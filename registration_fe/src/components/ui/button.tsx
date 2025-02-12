import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'destructive';
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick, className }) => {
  const baseStyle = "px-4 py-2 rounded text-white font-semibold transition duration-200";
  const variantStyle =
    variant === "destructive"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-blue-500 hover:bg-blue-600";

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};
