import React from 'react';
import { Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply: () => void;
  onClear?: () => void;
  isFiltered?: boolean;
  className?: string;
}

export function DateRangePicker({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  onApply, 
  onClear, 
  isFiltered = false,
  className 
}: DateRangePickerProps) {
  const { theme } = useTheme();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Calendar className="h-5 w-5 text-shopify-text-secondary" />
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className={`px-3 py-2 border rounded-md ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-shopify-border'
        }`}
      />
      <span>to</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className={`px-3 py-2 border rounded-md ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-shopify-border'
        }`}
      />
      <button
        onClick={onApply}
        className={`px-3 py-2 rounded-md ${
          theme === 'dark'
            ? 'bg-gray-900 border border-gray-800 hover:bg-gray-800'
            : 'bg-white border border-shopify-border hover:bg-shopify-surface'
        }`}
      >
        Apply
      </button>
      {isFiltered && onClear && (
        <button
          onClick={onClear}
          className={`px-3 py-2 rounded-md ${
            theme === 'dark'
              ? 'bg-gray-900 border border-gray-800 hover:bg-gray-800'
              : 'bg-white border border-shopify-border hover:bg-shopify-surface'
          }`}
        >
          Clear
        </button>
      )}
    </div>
  );
}