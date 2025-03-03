import React from 'react';
import { Download, FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ExportButtonsProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
  className?: string;
}

export function ExportButtons({ onExportCSV, onExportPDF, className }: ExportButtonsProps) {
  const { theme } = useTheme();

  return (
    <div className={`flex space-x-2 ${className}`}>
      <button
        onClick={onExportCSV}
        className={`px-4 py-2 border rounded-md flex items-center ${
          theme === 'dark'
            ? 'border-gray-800 hover:bg-gray-900'
            : 'border-shopify-border hover:bg-shopify-surface'
        }`}
      >
        <FileText className="h-5 w-5 mr-2" />
        Export CSV
      </button>
      <button
        onClick={onExportPDF}
        className={`px-4 py-2 border rounded-md flex items-center ${
          theme === 'dark'
            ? 'border-gray-800 hover:bg-gray-900'
            : 'border-shopify-border hover:bg-shopify-surface'
        }`}
      >
        <Download className="h-5 w-5 mr-2" />
        Export PDF
      </button>
    </div>
  );
}