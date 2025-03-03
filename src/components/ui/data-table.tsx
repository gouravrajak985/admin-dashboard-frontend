import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Column<T> {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  keyField: keyof T;
  emptyMessage?: string;
}

export function DataTable<T>({ 
  columns, 
  data, 
  onRowClick, 
  keyField,
  emptyMessage = "No data available"
}: DataTableProps<T>) {
  const { theme } = useTheme();

  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return item[column.accessor];
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${
      theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
    }`}>
      <table className="w-full">
        <thead className={`${
          theme === 'dark' ? 'bg-gray-900' : 'bg-shopify-surface'
        } border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                className={`px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${
          theme === 'dark' ? 'divide-gray-800' : 'divide-shopify-border'
        }`}>
          {data.length > 0 ? (
            data.map((item) => (
              <tr 
                key={String(item[keyField])} 
                className={`${
                  theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-shopify-surface'
                } ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className={`px-6 py-4 ${column.className || ''}`}
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}