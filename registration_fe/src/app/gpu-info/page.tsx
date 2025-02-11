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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Spheron Fizz Node Information</h1>
      <div className="flex flex-col gap-4 w-64">
        <p><strong>Transaction Hash:</strong> {gpuData.transactionHash}</p>
        <p><strong>Node ID:</strong> {gpuData.nodeId}</p>
        <p><strong>Status:</strong> {gpuData.status}</p>
        <div>
          <h2 className="text-xl font-bold">Details:</h2>
          <p><strong>Admin:</strong> {gpuData.details.admin}</p>
          <p><strong>Network ID:</strong> {gpuData.details.networkId}</p>
          <p><strong>Provider ID:</strong> {gpuData.details.providerId}</p>
          <p><strong>Registration Time:</strong> {gpuData.details.registrationTime}</p>
          <p><strong>Location:</strong> {gpuData.details.location}</p>
          <p><strong>Verification Output:</strong> {gpuData.details.verificationOutput}</p>
          <p><strong>Deployed Contract:</strong> {gpuData.details.deployedContract}</p>
        </div>
        <div>
          <h2 className="text-xl font-bold">Steps for Verification:</h2>
          <ol className="list-decimal list-inside">
            <li>Step 1: Verify the GPU node details.</li>
            <li>Step 2: Confirm the registration time and location.</li>
            <li>Step 3: Check the deployed contract address.</li>
            <li>Step 4: Follow the verification output instructions.</li>
          </ol>
        </div>
      </div>
    </main>
  );
};

export default GPUInfoPage;