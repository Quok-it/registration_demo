'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define GPU type
interface GPU {
  id: number;
  name: string;
  ram: string;
  gpu_uuid: string;
}

// Define Node type (now includes GPUs)
interface NodeStatus {
  admin: string;
  networkId: string;
  providerId: string;
  registrationTime: string;
  location: string;
  status: number;
  verificationOutput: string;
  deployedContract: string;
  gpus: GPU[]; // Embedded GPU array
}

// Define context type
interface GpuContextType {
  nodeStatus: NodeStatus | null;
  setNodeStatus: React.Dispatch<React.SetStateAction<NodeStatus | null>>;
}

// Create the context with default values
const GpuContext = createContext<GpuContextType | undefined>(undefined);

// Define props for the provider
interface GpuProviderProps {
  children: ReactNode;
}

// Create the provider component
export const GpuProvider: React.FC<GpuProviderProps> = ({ children }) => {
  const [nodeStatus, setNodeStatus] = useState<NodeStatus | null>(null);

  return (
    <GpuContext.Provider value={{ nodeStatus, setNodeStatus }}>
      {children}
    </GpuContext.Provider>
  );
};

// Custom hook for using the context
export const useGpu = () => {
  const context = useContext(GpuContext);
  if (!context) {
    throw new Error("useGpu must be used within a GpuProvider");
  }
  return context;
};
