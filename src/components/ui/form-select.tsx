import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  options: Option[];
  error?: string;
  onChange: (value: string) => void;
}

export function FormSelect({ label, options, error, onChange, className, value, ...props }: FormSelectProps) {
  const { theme } = useTheme();
  
  const selectClassName = `w-full p-3 border rounded-md ${
    theme === 'dark'
      ? 'bg-gray-900 border-gray-800'
      : 'bg-white border-shopify-border'
  } focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-gray-600' : 'focus:ring-shopify-focus'} focus:border-shopify-focus ${
    error ? 'border-red-500' : ''
  } ${className || ''}`;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select 
        className={selectClassName} 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}