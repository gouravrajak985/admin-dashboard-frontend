import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormInput({ label, error, className, ...props }: FormInputProps) {
  const { theme } = useTheme();
  
  const inputClassName = `w-full p-3 border rounded-md ${
    theme === 'dark'
      ? 'bg-gray-900 border-gray-800'
      : 'bg-white border-shopify-border'
  } focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-gray-600' : 'focus:ring-shopify-focus'} focus:border-shopify-focus ${
    error ? 'border-red-500' : ''
  } ${className || ''}`;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input className={inputClassName} {...props} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}