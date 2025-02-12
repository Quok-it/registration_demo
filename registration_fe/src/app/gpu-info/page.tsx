'use client'
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://54.237.75.116:4000"); // connect to websocket server

const GPUInfoPage = () => {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    console.log("Query data:", data);
  }, [data]);

  const gpuData = data ? JSON.parse(data) : null;

  useEffect(() => {
    if (!gpuData) return;

    // listening for real-time errors alerts
    socket.on("error_alert", (newErrors) => {
      console.log("Received GPU errors: ", newErrors);

      // check if this error corresponds to this node's GPU UUID
      const filteredErrors = newErrors.filter(error =>
        gpuData.details.gpus.some(gpu => gpu.gpu_uuid === error.gpu_uuid)
      );

      if (filteredErrors.length > 0) {
        setErrors(prevErrors => [...prevErrors, ...filteredErrors]);
      }

    });

    return () => {
      socket.disconnect();
    };
  }, [gpuData]); 

  if (!gpuData) {
    console.log("No GPU data found, displaying loading message.");
    return <div>Loading...</div>;
  }

  console.log("Parsed GPU data:", gpuData);

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
            <p className="text-lg text-gray-800"><strong>Admin:</strong> {gpuData.admin}</p>
            <p className="text-lg text-gray-800"><strong>Network ID:</strong> {gpuData.networkId}</p>
            <p className="text-lg text-gray-800"><strong>Provider ID:</strong> {gpuData.providerId}</p>
            <p className="text-lg text-gray-800"><strong>Registration Time:</strong> {gpuData.registrationTime}</p>
            <p className="text-lg text-gray-800"><strong>Location:</strong> {gpuData.location}</p>
            <p className="text-lg text-gray-800"><strong>Verification Output:</strong> {gpuData.verificationOutput}</p>
            <p className="text-lg text-gray-800"><strong>Deployed Contract:</strong> {gpuData.deployedContract}</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-inner mt-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Steps for Verification:</h2>
            <ol className="list-decimal list-inside text-lg text-gray-800">
              <li>Coming Soon...</li>
            </ol>
          </div>

          {/* Error Monitoring */}
          <div className="bg-red-100 p-6 rounded-lg shadow-inner mt-6">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Real-Time GPU Errors</h2>
            {errors.length > 0 ? (
              errors.map((error, index) => (
                <div key={index} className="bg-red-500 text-white p-3 my-2 rounded">
                  <p><strong>GPU UUID:</strong> {error.gpu_uuid}</p>
                  <p><strong>Error:</strong> {error.error}</p>
                  <p><strong>Timestamp:</strong> {new Date(error.timestamp).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="text-lg text-gray-800">No GPU errors detected.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default GPUInfoPage;