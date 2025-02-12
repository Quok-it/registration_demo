'use client';
import React, { createContext, useContext, useState } from 'react';

const GpuContext = createContext(null);

export const GpuProvider = ({ children }) => {
  const [gpuData, setGpuData] = useState(null);

  return (
    <GpuContext.Provider value={{ gpuData, setGpuData }}>
      {children}
    </GpuContext.Provider>
  );
};

export const useGpu = () => useContext(GpuContext);
