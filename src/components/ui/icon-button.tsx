import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  tooltip?: string;
}

export function IconButton({ 
  icon: Icon, 
  variant = 'outline', 
  tooltip,
  className,
  ...props 
}: IconButtonProps) {
  const { theme } = useTheme();
  
  const getButtonClasses = () => {
    const baseClasses = "p-2 rounded-md";
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
      case 'secondary':
        return `${baseClasses} bg-secondary text-secondary-foreground hover:bg-secondary/80`;
      case 'danger':
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700`;
      case 'outline':
      default:
        return `${baseClasses} border ${
          theme === 'dark'
            ? 'border-gray-800 hover:bg-gray-800'
            : 'border-shopify-border hover:bg-shopify-surface'
        }`;
    }
  };

  return (
    <button
      className={`${getButtonClasses()} ${className || ''}`}
      title={tooltip}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}