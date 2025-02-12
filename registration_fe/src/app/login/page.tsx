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
            setStatus(data.data.status === 0 ? 'pending' : 'other'); // Assuming 0 is the pending status
            setGpuData({ ...data.data, transactionHash: '', nodeId }); // Store the GPU data with transactionHash and nodeId
            console.log("GPU data set:", { ...data.data, transactionHash: '', nodeId });
        } else {
            console.error("Failed to fetch node status:", data.message);
        }
    };

    useEffect(() => {
        if (status === 'pending' && gpuData) {
            const queryParams = new URLSearchParams({ data: JSON.stringify(gpuData) }).toString();
            console.log("Navigating to /gpu-info with query params:", queryParams);
            router.push(`/gpu-info?${queryParams}`);
        }
    }, [status, gpuData, router]);

    return (
        <div>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="Enter Node ID"
                value={nodeId}
                onChange={(e) => setNodeId(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;