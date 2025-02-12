import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`bg-gray-800 shadow-lg rounded-lg p-6 ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<CardProps> = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
