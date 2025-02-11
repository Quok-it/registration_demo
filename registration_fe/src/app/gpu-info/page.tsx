'use client'
import { useSearchParams } from "next/navigation";
import React from "react";

const GPUInfoPage = () => {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');

  const gpuData = data ? JSON.parse(data as string) : null;

  if (!gpuData) {
    return <div>Loading...</div>;
  }

  const getStatusText = (status) => {
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
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-200">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-600">Spheron Fizz Node Information</h1>
        <div className="flex flex-col gap-6">
          <p className="text-lg text-gray-800"><strong>Transaction Hash:</strong> {gpuData.transactionHash}</p>
          <p className="text-lg text-gray-800"><strong>Node ID:</strong> {gpuData.nodeId}</p>
          <p className="text-lg text-gray-800"><strong>Status:</strong> <span className={`font-bold ${gpuData.status === 0 ? 'text-yellow-500' : gpuData.status === 1 ? 'text-green-500' : 'text-red-500'}`}>{getStatusText(gpuData.status)}</span></p>
          <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Details:</h2>
            <p className="text-lg text-gray-800"><strong>Admin:</strong> {gpuData.details.admin}</p>
            <p className="text-lg text-gray-800"><strong>Network ID:</strong> {gpuData.details.networkId}</p>
            <p className="text-lg text-gray-800"><strong>Provider ID:</strong> {gpuData.details.providerId}</p>
            <p className="text-lg text-gray-800"><strong>Registration Time:</strong> {gpuData.details.registrationTime}</p>
            <p className="text-lg text-gray-800"><strong>Location:</strong> {gpuData.details.location}</p>
            <p className="text-lg text-gray-800"><strong>Verification Output:</strong> {gpuData.details.verificationOutput}</p>
            <p className="text-lg text-gray-800"><strong>Deployed Contract:</strong> {gpuData.details.deployedContract}</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-inner mt-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Steps for Verification:</h2>
            <ol className="list-decimal list-inside text-lg text-gray-800">
              <li>Coming Soon...</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GPUInfoPage;