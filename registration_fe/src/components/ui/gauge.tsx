import React from 'react';

interface GaugeProps {
  value: number;
  min: number;
  max: number;
  className?: string;
}

export const Gauge: React.FC<GaugeProps> = ({ value, min, max, className }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`relative w-40 h-40 flex justify-center items-center ${className}`}>
      {/* Background Circle */}
      <div className="absolute inset-0 bg-gray-300 rounded-full"></div>

      {/* Gauge Arc */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(
            ${percentage > 75 ? 'green' : percentage > 50 ? 'yellow' : 'red'} ${percentage}%, 
            gray ${percentage}%)`,
        }}
      ></div>

      {/* Value Display */}
      <span className="absolute text-xl font-bold text-white">{value}%</span>
    </div>
  );
};
