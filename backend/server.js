const express = require("express"); // Importing express
const cors = require("cors"); // Importing cors
const { ethers } = require("ethers"); // Importing ethers.js
const dotenv = require("dotenv"); // Importing dotenv
dotenv.config(); // Load environment variables from .env file
const app = express(); // Creating an express app

app.use(cors()); // Using cors middleware
app.use(express.json()); // Middleware to parse JSON request bodies

// Create a route that sends a response when visiting the homepage
app.get("/", (req, res) => {
  res.send("<h1>Hello, Express.js Server!</h1>");
});

// Function to interact with the smart contract
async function callSmartContractFunction(
  networkId,
  providerId,
  location,
  gpus
) {
  const provider = new ethers.JsonRpcProvider(
    "https://evm-rpc-testnet.sei-apis.com"
  );
  const wallet = new ethers.Wallet(process.env.PKEY, provider);
  const contractAddress = "0x48baa64bCcDDD1E97BA30C6f1eFFFb01DE4182e5";
  const abi = [
    {
      type: "constructor",
      inputs: [
        {
          name: "_verifier",
          type: "address",
          internalType: "address",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "getGPU",
      inputs: [
        {
          name: "nodeId",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "index",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "name",
          type: "string",
          internalType: "string",
        },
        {
          name: "ram",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "gpu_uuid",
          type: "string",
          internalType: "string",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getGPUCount",
      inputs: [
        {
          name: "nodeId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "gpuNodes",
      inputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "admin",
          type: "address",
          internalType: "address",
        },
        {
          name: "networkId",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "providerIp",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "registrationTime",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "location",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "status",
          type: "uint8",
          internalType: "enum GPURegistry.NodeStatus",
        },
        {
          name: "verificationOutput",
          type: "string",
          internalType: "string",
        },
        {
          name: "deployedContract",
          type: "address",
          internalType: "address",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "nextNodeId",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "registerGPU",
      inputs: [
        {
          name: "_networkId",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "_providerId",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "_location",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "_gpus",
          type: "tuple[]",
          internalType: "struct GPURegistry.GPU[]",
          components: [
            {
              name: "name",
              type: "string",
              internalType: "string",
            },
            {
              name: "ram",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "gpu_uuid",
              type: "string",
              internalType: "string",
            },
          ],
        },
      ],
      outputs: [
        {
          name: "nodeId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "verifier",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "address",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "verifyGPU",
      inputs: [
        {
          name: "_nodeId",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "_passed",
          type: "bool",
          internalType: "bool",
        },
        {
          name: "_verificationOutput",
          type: "string",
          internalType: "string",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "event",
      name: "GPUBlacklisted",
      inputs: [
        {
          name: "nodeId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "failureReason",
          type: "string",
          indexed: false,
          internalType: "string",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "GPURegistered",
      inputs: [
        {
          name: "nodeId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "admin",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "GPUVerified",
      inputs: [
        {
          name: "nodeId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "verificationOutput",
          type: "string",
          indexed: false,
          internalType: "string",
        },
        {
          name: "deployedContract",
          type: "address",
          indexed: false,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
  ];
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  console.log("Calling smart contract function");
  const tx = await contract.registerGPU(networkId, providerId, location, gpus);

  if (typeof tx.wait === "function") {
    try {
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", tx.hash);

      // Find the GPURegistered event in the transaction receipt
      const gpuRegisteredEvent = receipt.logs.find((log) => {
        const event = contract.interface.getEvent("GPURegistered");
        return log.topics[0] === event.topicHash;
      });
      if (gpuRegisteredEvent) {
        console.log("GPURegistered event:", gpuRegisteredEvent);

        const parsedLog = contract.interface.parseLog(gpuRegisteredEvent);
        const nodeId = parsedLog.args.nodeId;
        console.log("Node ID from event:", nodeId.toString());
        // Fetch the node status
        const nodeStatus = await contract.gpuNodes(nodeId);
        console.log("Node status:", nodeStatus);
        const statusAsNumber = nodeStatus[5];

        console.log("Node status:", statusAsNumber);

        return {
          transaction: tx,
          nodeId: nodeId,
          status: statusAsNumber,
        };
      } else {
        console.log("GPURegistered event not found in transaction logs");
        return tx;
      }
    } catch (error) {
      console.error("Error calling smart contract function:", error);
      throw error;
    }
  } else {
    // This is a view function
    console.log("Function result:", tx);
    return tx;
  }
}

app.post("/register", async (req, res) => {
  const { networkId, providerId, location, gpus } = req.body;
  try {
    // Call the smart contract function
    const tx = await callSmartContractFunction(
      networkId,
      providerId,
      location,
      gpus
    );
    res.json({
      message: "Registration successful",
      data: { networkId, providerId, location, gpus },
      transaction: tx,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
});
// // New registration route
// app.post("/register", (req, res) => {
//   const { email, password, gpuModel, staticIp } = req.body;
//   // Handle registration logic here (e.g. save to DB)
//   res.json({
//     message: "Registration successful",
//     data: { email, password, gpuModel, staticIp },
//   });
// });

// Set up the server to listen on port 3000
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
