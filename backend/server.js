BigInt.prototype.toJSON = function () {
  return this.toString();
};
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
async function callRegisterFunction(networkId, providerId, location, gpus) {
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

        // Convert all BigInt values to strings when accessing node status
        const nodeStatus = await contract.gpuNodes(nodeId);
        const statusAsNumber = Number(nodeStatus[5]); // Convert status to number

        console.log("Node status:", {
          admin: nodeStatus[0],
          networkId: nodeStatus[1].toString(),
          providerId: nodeStatus[2].toString(),
          registrationTime: nodeStatus[3].toString(),
          location: nodeStatus[4].toString(),
          status: statusAsNumber,
          verificationOutput: nodeStatus[6],
          deployedContract: nodeStatus[7],
        });

        // Return structured data with serialization-friendly values
        return {
          transactionHash: tx.hash,
          nodeId: nodeId.toString(),
          status: statusAsNumber, // Convert enum to number
          details: {
            admin: nodeStatus[0],
            networkId: nodeStatus[1].toString(),
            providerId: nodeStatus[2].toString(),
            registrationTime: new Date(
              Number(nodeStatus[3]) * 1000
            ).toISOString(),
            location: nodeStatus[4].toString(),
            verificationOutput: nodeStatus[6],
            deployedContract: nodeStatus[7],
          },
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
    const result = await callRegisterFunction(
      networkId.toString(),
      providerId.toString(),
      location.toString(),
      gpus
    );

    res.json({
      success: true,
      message: "GPU node registered successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.reason || error.message,
    });
  }
});

// Set up the server to listen on port 3000
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
