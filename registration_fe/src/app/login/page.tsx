'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGpu } from '@/context/GpuContext';

const LoginPage: React.FC = () => {
    const [nodeId, setNodeId] = useState('');
    const [status, setStatus] = useState('');
    const { setNodeStatus } = useGpu(); // ✅ Use updated context
    const router = useRouter();

    const handleLogin = async () => {
        console.log("Fetching node status for nodeId:", nodeId);
        
        try {
            const response = await fetch(`http://localhost:3001/node-status/${nodeId}`);
            const data = await response.json();
            console.log("Response data:", data);

            if (data.success) {
                // ✅ Store full node status in context
                const nodeData = { ...data.data, nodeId }; // Attach nodeId
                setNodeStatus(nodeData);

                // ✅ Update status logic
                setStatus(nodeData.status === 0 ? 'pending' : 'verified');
                console.log("Node status updated:", nodeData);
            } else {
                console.error("Failed to fetch node status:", data.message);
            }
        } catch (error) {
            console.error("Error fetching node status:", error);
        }
    };

    // ✅ Handle navigation properly
    useEffect(() => {
        if (status === 'pending') {
            router.push('/gpu-info');
        } else if (status === 'verified') {
            console.log("Navigating to /dashboard");
            router.push('/dashboard');
        }
    }, [status, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100">
            <h1 className="text-3xl font-bold mb-6">Login</h1>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md w-96">
                <input
                    type="text"
                    className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-md mb-4 focus:ring focus:ring-blue-500 placeholder-gray-400"
                    placeholder="Enter Node ID"
                    value={nodeId}
                    onChange={(e) => setNodeId(e.target.value)}
                />
                <button 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
