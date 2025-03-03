import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

type PeriodType = 'daily' | 'weekly' | 'monthly' | 'all';

interface PeriodSelectorProps {
  period: PeriodType;
  onChange: (period: PeriodType) => void;
  className?: string;
}

export function PeriodSelector({ period, onChange, className }: PeriodSelectorProps) {
  const { theme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  const getPeriodLabel = () => {
    switch (period) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'all': return 'All Time';
      default: return 'Monthly';
    }
  };

  return (
    <div className={`relative ${className || ''}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`px-4 py-2 rounded-md flex items-center ${
          theme === 'dark'
            ? 'bg-gray-900 border border-gray-800'
            : 'bg-white border border-shopify-border'
        }`}
      >
        <span>{getPeriodLabel()}</span>
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>
      
      {showDropdown && (
        <div className={`absolute z-10 mt-1 w-40 rounded-md shadow-lg ${
          theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-shopify-border'
        }`}>
          <div className="py-1">
            <button
              onClick={() => {
                onChange('all');
                setShowDropdown(false);
              }}
              className={`block px-4 py-2 text-sm w-full text-left ${
                period === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : theme === 'dark'
                    ? 'hover:bg-gray-800'
                    : 'hover:bg-shopify-surface'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => {
                onChange('daily');
                setShowDropdown(false);
              }}
              className={`block px-4 py-2 text-sm w-full text-left ${
                period === 'daily'
                  ? 'bg-primary text-primary-foreground'
                  : theme === 'dark'
                    ? 'hover:bg-gray-800'
                    : 'hover:bg-shopify-surface'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => {
                onChange('weekly');
                setShowDropdown(false);
              }}
              className={`block px-4 py-2 text-sm w-full text-left ${
                period === 'weekly'
                  ? 'bg-primary text-primary-foreground'
                  : theme === 'dark'
                    ? 'hover:bg-gray-800'
                    : 'hover:bg-shopify-surface'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => {
                onChange('monthly');
                setShowDropdown(false);
              }}
              className={`block px-4 py-2 text-sm w-full text-left ${
                period === 'monthly'
                  ? 'bg-primary text-primary-foreground'
                  : theme === 'dark'
                    ? 'hover:bg-gray-800'
                    : 'hover:bg-shopify-surface'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      )}
    </div>
  );
}