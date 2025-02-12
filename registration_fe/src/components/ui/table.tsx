import React from "react";

interface TableProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TableCellProps extends TableProps {
  colSpan?: number;
}

// Table Component
export const Table: React.FC<TableProps> = ({ children, className }) => (
  <table className={`w-full border border-gray-600 ${className}`}>{children}</table>
);

// Table Head (Fix: Ensure no whitespace)
export const TableHead: React.FC<TableProps> = ({ children, className }) => (
  <thead className={`bg-gray-700 text-white ${className}`}>{children}</thead>
);

// Table Row (Fix: Pass `onClick` to `<tr>`)
export const TableRow: React.FC<TableProps> = ({ children, className, onClick }) => (
  <tr 
    className={`border-b border-gray-600 ${className} ${onClick ? 'cursor-pointer hover:bg-gray-700 transition' : ''}`}
    onClick={onClick}
  >
    {children}
  </tr>
);

// Table Cell (Fix: Allow `colSpan`)
export const TableCell: React.FC<TableCellProps> = ({ children, colSpan, className }) => (
  <td colSpan={colSpan} className={`p-3 border border-gray-600 ${className}`}>
    {children}
  </td>
);

// Table Body
export const TableBody: React.FC<TableProps> = ({ children, className }) => (
  <tbody className={className}>{children}</tbody>
);