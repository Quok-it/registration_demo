'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const LoginPage: React.FC = () => {
    const [nodeId, setNodeId] = useState('');
    const [status, setStatus] = useState('');
    const [gpuData, setGpuData] = useState(null);
    const router = useRouter();
    
    const handleLogin = async () => {
        console.log("Fetching node status for nodeId:", nodeId);
        const response = await fetch(`http://localhost:3001/node-status/${nodeId}`);
        const data = await response.json();
        console.log("Response data:", data);
        if (data.success) {
            setStatus(data.data.status === 0 ? 'verified' : 'pending'); // Assuming 0 is the pending status
            setGpuData({ ...data.data, transactionHash: '', nodeId }); // Store the GPU data with transactionHash and nodeId
            console.log("GPU data set:", { ...data.data, transactionHash: '', nodeId });
        } else {
            console.error("Failed to fetch node status:", data.message);
        }
    };

    if (status === 'pending') {
        window.location.href = '/gpu-info';
    } else if (status === 'verified') {
        console.log("Navigating to /dashboard");
        router.push('/dashboard');
    }

    return (
        <div>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="Enter Node ID"
                value={nodeId}
                onChange={(e) => setNodeId(e.target.value)}
            />
            <button  className="bg-blue-500 text-white px-4 py-0.25 rounded" onClick={handleLogin}>Login</button>
        </div>
    );
};
export default LoginPage;