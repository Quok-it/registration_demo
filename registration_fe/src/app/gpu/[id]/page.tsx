"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useGpu } from "@/context/GpuContext";

const GPUDetailPage = () => {
  const { nodeStatus } = useGpu();
  const router = useRouter();
  const params = useParams(); // ✅ Fix: Use `useParams()` to unwrap params
  const gpuId = params.id as string; // ✅ Ensure it's treated as a string

  if (!nodeStatus) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading GPU data...</div>;
  }

  const gpu = nodeStatus.gpus.find((g) => g.id.toString() === gpuId);

  if (!gpu) {
    return <div className="min-h-screen flex items-center justify-center text-red-400">GPU not found</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900 text-gray-200">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">GPU Details</h1>

        <div className="flex flex-col gap-6">
          <p className="text-lg"><strong>ID:</strong> {gpu.id}</p>
          <p className="text-lg"><strong>Model:</strong> {gpu.name}</p>
          <p className="text-lg"><strong>RAM:</strong> {gpu.ram} GB</p>
          <p className="text-lg"><strong>UUID:</strong> {gpu.gpu_uuid}</p>

          <button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
            onClick={() => router.push('/dashboard')}
          >
               Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
};

export default GPUDetailPage;
