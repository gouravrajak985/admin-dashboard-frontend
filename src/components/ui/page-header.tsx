import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  backLink?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, backLink, children }: PageHeaderProps) {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="p-6 border-b border-shopify-border dark:border-gray-800">
      <div className="flex items-center mb-4">
        {backLink && (
          <button
            onClick={() => navigate(backLink)}
            className={`p-2 mr-4 border rounded-md ${
              theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : 'border-shopify-border hover:bg-shopify-surface'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      
      {children && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {children}
        </div>
      )}
    </div>
  );
}