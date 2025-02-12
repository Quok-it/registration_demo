"use client";

import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { useGpu } from "@/context/GpuContext";
import { useWebSocket } from "@/context/WebSocketContext"; // ✅ Import WebSocket Context
import { Card, CardContent } from "@/components/ui/card";
import { Gauge } from "@/components/ui/gauge";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

console.log("Dashboard component is loading...");

// const socket = new WebSocket("ws://localhost:3001");

const Dashboard = () => {
  const { nodeStatus } = useGpu();
  const { ws, isConnected } = useWebSocket(); // ✅ Get WebSocket from context
  const [gpuErrors, setGpuErrors] = useState([]);

  useEffect(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    console.log("📡 Listening for WebSocket messages...");

    ws.onmessage = (event) => {
      console.log("📩 Received message:", event.data);
      try {
        // ✅ Check if message is valid JSON
        const jsonStart = event.data.trim().charAt(0);
        if (jsonStart !== "{" && jsonStart !== "[") {
          console.warn("⚠️ Received non-JSON message:", event.data);
          return;
        }

        const newErrors = JSON.parse(event.data);
        if (Array.isArray(newErrors)) {
          const filteredErrors = newErrors.filter((error) =>
            nodeStatus?.gpus?.some((gpu) => gpu.gpu_uuid === error.gpu_uuid)
          );

          if (filteredErrors.length > 0) {
            setGpuErrors((prevErrors) => [...prevErrors, ...filteredErrors]);
          }
        }
      } catch (error) {
        console.error("❌ JSON Parsing Error:", error);
      }
    };

    return () => {
      console.log("🛑 Stopping WebSocket listener...");
      ws.onmessage = null;
    };
  }, [ws, nodeStatus]);

  // Handle loading state
  if (!nodeStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading node data...
      </div> 
    );
  }  
 
  console.log("Dashboard loaded with node status:", nodeStatus);

  // Determine network health based on node status

  // TODO: Replace with errors
  const networkHealth = nodeStatus.status * 20; 

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-8">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold mb-6 text-white tracking-tight">
        Welcome Node# <span className="text-blue-500">{nodeStatus.nodeId}</span>
      </h1>

      {/* Grid Layout for Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Network Health Meter */}
        <Card className="bg-gray-800 shadow-lg rounded-xl border border-gray-700">
          <CardContent className="flex flex-col items-center p-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-300">Network Health</h2>
            <Gauge value={networkHealth} min={0} max={100} className="w-40 h-40" />
            <p className={`mt-2 text-xl font-bold ${
                networkHealth >= 80 ? "text-green-400" :
                networkHealth >= 50 ? "text-yellow-400" :
                "text-red-400"
              }`}
            >
              {networkHealth}%
            </p>
          </CardContent>
        </Card>

        {/* Actions Panel */}
        <Card className="bg-gray-800 shadow-lg rounded-xl border border-gray-700">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-300">Actions</h2>
            {networkHealth >= 80 ? (
              <p className="text-green-500 font-medium">✅ Everything looks good!</p>
            ) : (
              <Button variant="destructive" className="w-full mt-3">
                ⚠️ Check Warnings
              </Button>
            )}
          </CardContent>
        </Card>

        {/* GPU Lookup Table */}
        <Card className="bg-gray-800 shadow-lg rounded-xl border border-gray-700 col-span-1 md:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-300">GPU Lookup</h2>
            <Table className="w-full bg-gray-900 rounded-lg">
              <TableHead className="bg-gray-700 text-white">
                <TableRow>
                  <TableCell className="p-3 font-semibold">ID</TableCell>
                  <TableCell className="p-3 font-semibold">Model</TableCell>
                  <TableCell className="p-3 font-semibold">RAM (GB)</TableCell>
                  <TableCell className="p-3 font-semibold">UUID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nodeStatus.gpus.length > 0 ? (
                  nodeStatus.gpus.map((gpu) => (
                    <TableRow key={gpu.id} className="hover:bg-gray-700 transition">
                      <TableCell className="p-3">{gpu.id}</TableCell>
                      <TableCell className="p-3">{gpu.name}</TableCell>
                      <TableCell className="p-3">{gpu.ram}</TableCell>
                      <TableCell className="p-3">{gpu.gpu_uuid}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center p-4 text-gray-500">
                      🚫 No GPUs available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
