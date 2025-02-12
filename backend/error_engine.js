const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const axios = require("axios");

// Load environment variables from .env file
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not defined in the .env file");
  process.exit(1);
}

const client = new MongoClient(uri);
let lastChecked = new Date(Date.now()); // Current time in UTC

// Define the threshold for high memory usage
const THRESHOLD = 70;
const SERVER_API_URL = "http://localhost:3001/send-error-alert"; // server API endpoint

const sendErrorToServer = async (errors) => {
  try {
    console.log("Sending errors to WebSocket server API...");
    await axios.post(SERVER_API_URL, { errors });
    console.log("Successfully sent errors to server :)");
  } catch (error) {
    console.error("Failed to send errors to server :(", error.message);
  }
};

// Main function that checks for new errors and processes the error log
const checkThreshold = async () => {
  try {
    console.log(
      `\n[${new Date().toISOString()}] Checking for high fb_util since ${lastChecked.toISOString()}`
    );

    // 1) Check for new high memory usage in the gpu_polling collection
    console.log(`[DEBUG] Fetching errors after: ${lastChecked.toISOString()}`);
    const newHighUsageDocs = await global.collection
      .find({
        timestamp: { $gt: lastChecked },
        "metrics_measured.fb_util": { $gt: THRESHOLD },
      })
      .limit(100)
      .toArray();
      console.log(`[DEBUG] Found ${newHighUsageDocs.length} new errors.`);

    if (newHighUsageDocs.length > 0) {
      console.log(
        "New high fb_util documents found:",
        // this iterates over each element in the newHighUsageDocs array and returns a new array with just the gpu_uuid and timestamp fields
        newHighUsageDocs.map((doc) => ({
          gpu_uuid: doc.gpu_uuid,
          timestamp: doc.timestamp,
        }))
      );
      // This is here to better understand the ordering and output structure of the doc -> will delete eventually
      console.log("Doc first index: ", newHighUsageDocs[0]);
      console.log("Doc last index: ", newHighUsageDocs[newHighUsageDocs.length - 1]);

      // Send alert to the frontend
      sendFrontendAlert(newHighUsageDocs);

      // Send errors to backend server API
      await sendErrorToServer(newHighUsageDocs);

      // 1.a) For each new high usage document, log the error in the error_log collection.
      // We assume that each document contains a gpu_uuid field.
      for (const doc of newHighUsageDocs) {
        await global.errorLogCollection.updateOne(
          { gpu_uuid: doc.gpu_uuid },
          {
            $set: {
              gpu_uuid: doc.gpu_uuid,
              error: "High fb_util",
              lastOccurrence: doc.timestamp,
              metrics: doc.metrics_measured,
            },
          },
          { upsert: true }
        );
      }

      // Update lastChecked to the timestamp of the latest processed document.
      lastChecked = new Date(
        newHighUsageDocs[newHighUsageDocs.length - 1].timestamp
      );
      console.log(`Updated lastChecked to ${lastChecked.toISOString()}`);
    } else {
      console.log("No new high fb_util entries found in main collection.");

      // 2) If no new errors, check if the error_log collection is empty.
      const errorLogCount = await global.errorLogCollection.countDocuments();
      // console.log(`Error log count: ${errorLogCount}`);
      if (errorLogCount === 0) {
        console.log("Error log is empty. Continuing monitoring...");
      } else {
        // 2.b) For each error in error_log, verify if the error is still present.
        const errorDocs = await global.errorLogCollection.find({}).toArray();
        for (const errorDoc of errorDocs) {
          // Check the main collection for any document from the same GPU still reporting high usage.
          const stillHigh = await global.collection.findOne({
            timestamp: { $gt: lastChecked },
            gpu_uuid: errorDoc.gpu_uuid,
            "metrics_measured.fb_util": { $gt: THRESHOLD },
          });

          if (!stillHigh) {
            // 3) Error is resolved.
            // Remove from error_log and move to resolved_db with a resolvedAt timestamp.
            await global.errorLogCollection.deleteOne({ _id: errorDoc._id });
            const resolvedEntry = {
              ...errorDoc,
              resolvedAt: new Date(),
            };
            await global.resolvedCollection.insertOne(resolvedEntry);
            console.log(
              `Error for gpu_uuid ${errorDoc.gpu_uuid} resolved and moved to resolved_db.`
            );
          } else {
            console.log(
              `Error for gpu_uuid ${errorDoc.gpu_uuid} still present.`
            );
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in checkThreshold:", error);
  }
};

const startPolling = async () => {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db("gpu_monitoring");

    // Define our collections
    global.collection = db.collection("gpu_polling");
    global.errorLogCollection = db.collection("error_log");
    global.resolvedCollection = db.collection("resolved_db");

    console.log("Connected to MongoDB. Starting error detection polling...");

    // Poll every 3 seconds
    setInterval(checkThreshold, 1000);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

startPolling();
