'use client';
import React from "react";
import { useGpu } from '@/context/GpuContext';

const GPUInfoPage = () => {
  const { nodeStatus } = useGpu();

  // Handle loading state
  if (!nodeStatus) {
    console.log("No node data found, displaying loading message.");
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading node data...</div>;
  }

  console.log("Parsed node data:", nodeStatus);

  // Status formatter
  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "PENDING";
      case 1:
        return "VERIFIED";
      case 2:
        return "BLACKLISTED";
      default:
        return "UNKNOWN";
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900 text-gray-200">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Node Information</h1>

        {/* Node Details */}
        <div className="flex flex-col gap-6">
          <p className="text-lg"><strong>Node ID:</strong> {nodeStatus.nodeId}</p>
          <p className="text-lg"><strong>Status:</strong> 
            <span className={`font-bold ml-2 ${
              nodeStatus.status === 0 ? 'text-yellow-500' : 
              nodeStatus.status === 1 ? 'text-green-500' : 
              'text-red-500'}`}>
              {getStatusText(nodeStatus.status)}
            </span>
          </p>

          <div className="bg-gray-700 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold mb-4 text-white">Node Details</h2>
            <p className="text-lg"><strong>Admin:</strong> {nodeStatus.admin}</p>
            <p className="text-lg"><strong>Network ID:</strong> {nodeStatus.networkId}</p>
            <p className="text-lg"><strong>Provider ID:</strong> {nodeStatus.providerId}</p>
            <p className="text-lg"><strong>Registration Time:</strong> {nodeStatus.registrationTime}</p>
            <p className="text-lg"><strong>Location:</strong> {nodeStatus.location}</p>
            <p className="text-lg"><strong>Verification Output:</strong> {nodeStatus.verificationOutput || "N/A"}</p>
            <p className="text-lg"><strong>Deployed Contract:</strong> {nodeStatus.deployedContract}</p>
          </div>

          {/* GPU Details Table */}
          {nodeStatus.gpus.length > 0 ? (
            <div className="bg-gray-700 p-6 rounded-lg shadow-inner mt-6">
              <h2 className="text-2xl font-bold mb-4 text-white">Registered GPUs</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-600 text-white">
                      <th className="p-3">ID</th>
                      <th className="p-3">Model</th>
                      <th className="p-3">RAM (GB)</th>
                      <th className="p-3">UUID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodeStatus.gpus.map((gpu) => (
                      <tr key={gpu.id} className="border-b border-gray-600 hover:bg-gray-600 transition">
                        <td className="p-3">{gpu.id}</td>
                        <td className="p-3">{gpu.name}</td>
                        <td className="p-3">{gpu.ram}</td>
                        <td className="p-3">{gpu.gpu_uuid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-700 p-6 rounded-lg shadow-inner mt-6 text-center">
              <h2 className="text-2xl font-bold mb-4 text-white">No GPUs Registered</h2>
              <p className="text-lg">This node does not have any GPUs registered.</p>
            </div>
          )}

          {/* Steps for Verification */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-inner mt-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Steps for Verification</h2>
            <ol className="list-decimal list-inside text-lg">
              <li>Coming Soon...</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GPUInfoPage;
