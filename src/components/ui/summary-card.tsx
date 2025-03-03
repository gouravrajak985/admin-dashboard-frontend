import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  className?: string;
}

export function SummaryCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = "text-primary", 
  subtitle,
  className 
}: SummaryCardProps) {
  const { theme } = useTheme();

  return (
    <div className={`p-6 rounded-lg border ${
      theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
    } ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {subtitle && (
        <p className="text-sm text-shopify-text-secondary mt-2">{subtitle}</p>
      )}
    </div>
  );
}