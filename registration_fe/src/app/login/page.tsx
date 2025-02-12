import React, { useState } from 'react';

const LoginPage: React.FC = () => {
    const [nodeId, setNodeId] = useState('');
    const [status, setStatus] = useState('');

    const handleLogin = async () => {
        // Replace with actual on-chain status check
        const onChainStatus = await checkOnChainStatus(nodeId);
        setStatus(onChainStatus);
    };

    const checkOnChainStatus = async (nodeId: string): Promise<string> => {
        // Simulate an on-chain status check
        // Replace this with actual logic to check the status on-chain
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('pending'); // Simulated status
            }, 1000);
        });
    };

    if (status === 'pending') {
        window.location.href = '/gpu-info';
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
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;