import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContainer({ children, className }: CardContainerProps) {
  const { theme } = useTheme();

  return (
    <div className={`border rounded-lg ${
      theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-shopify-border'
    } ${className || ''}`}>
      {children}
    </div>
  );
}