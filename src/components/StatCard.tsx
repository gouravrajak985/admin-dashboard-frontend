import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
}

const StatCard = ({ title, value, change, isPositive, icon: Icon }: StatCardProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={`p-6 rounded-lg border ${
      theme === 'dark' 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-shopify-border'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-shopify-text-secondary">{title}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${
          theme === 'dark' 
            ? 'bg-gray-800' 
            : 'bg-shopify-surface'
        }`}>
          <Icon className="h-6 w-6 text-shopify-green" />
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-sm font-medium ${isPositive ? 'text-shopify-green' : 'text-red-500'}`}>
          {change}
        </span>
        <span className="ml-2 text-sm text-shopify-text-secondary">from last month</span>
      </div>
    </div>
  );
};

export default StatCard;