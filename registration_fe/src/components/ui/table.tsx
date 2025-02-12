import React from "react";

interface TableProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void; // Add onClick prop
}

interface TableCellProps extends TableProps {
  colSpan?: number; // Add support for colSpan
}

export const Table: React.FC<TableProps> = ({ children, className }) => (
  <table className={`w-full border border-gray-600 ${className}`}>{children}</table>
);

export const TableHead: React.FC<TableProps> = ({ children, className }) => (
  <thead className={`bg-gray-700 text-white ${className}`}> {children}</thead>
);

export const TableRow: React.FC<TableProps> = ({ children, className, onClick }) => (
  <tr 
    className={`border-b border-gray-600 ${className} ${onClick ? 'cursor-pointer hover:bg-gray-700 transition' : ''}`}
    onClick={onClick} // Fix: Pass `onClick` to `<tr>`
  >
    {children}
  </tr>
);

// Fix: Allow TableCell to accept colSpan
export const TableCell: React.FC<TableCellProps> = ({ children, colSpan, className }) => (
  <td colSpan={colSpan} className={`p-3 border border-gray-600 ${className}`}>
    {children}
  </td>
);

export const TableBody: React.FC<TableProps> = ({ children, className }) => <tbody className={className}>{children}</tbody>;