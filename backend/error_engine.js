const { MongoClient } = require("mongodb");
const dotenv = require("dotenv"); // Importing dotenv
dotenv.config(); // Load environment variables from .env file

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not defined in the .env file");
  process.exit(1);
}

const client = new MongoClient(uri);
let lastChecked = new Date(0); // Initialize lastChecked to the Unix epoch

const sendFrontendAlert = (docs) => {
  console.log("Alert: High mem_copy_utilization detected", docs);
};

// checkks to see if any new collection items have a high memory utilization
const checkThreshold = async () => {
  try {
    console.log(
      `Checking for high mem_copy_utilization since ${lastChecked.toISOString()}`
    );
    const docs = await global.collection
      .find({
        timestamp: { $gt: lastChecked }, // TODO: verify this jawn
        "metrics_measured.mem_copy_utilization": { $gt: 70 },
      })
      .limit(100)
      .toArray();

    if (docs.length > 0) {
      console.log(
        "Retrieved documents:",
        docs.map((doc) => doc.timestamp)
      );
      sendFrontendAlert(docs);
      lastChecked = new Date(docs[docs.length - 1].timestamp); // Update lastChecked
      console.log(`Updated lastChecked to ${lastChecked.toISOString()}`);
    } else {
      console.log("No new high mem_copy_utilization entries found.");
    }
  } catch (error) {
    console.error("Error checking threshold:", error);
  }
};

const startPolling = async () => {
  try {
    await client.connect();
    global.collection = client.db("gpu_monitoring").collection("gpu_polling");
    setInterval(checkThreshold, 3000); // Check every 3 seconds
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

startPolling();
