import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

export function ActionButton({ 
  children, 
  icon: Icon, 
  variant = 'outline', 
  className,
  ...props 
}: ActionButtonProps) {
  const { theme } = useTheme();
  
  const getButtonClasses = () => {
    const baseClasses = "px-4 py-2 rounded-md flex items-center justify-center";
    
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
            ? 'border-gray-800 hover:bg-gray-900'
            : 'border-shopify-border hover:bg-shopify-surface'
        }`;
    }
  };

  return (
    <button
      className={`${getButtonClasses()} ${className || ''}`}
      {...props}
    >
      {Icon && <Icon className="h-5 w-5 mr-2" />}
      {children}
    </button>
  );
}