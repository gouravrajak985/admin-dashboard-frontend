import React from 'react';
import { Badge } from './badge';

type StatusType = 
  | 'active' | 'inactive'
  | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'refunded' | 'completed' | 'saved'
  | 'live' | 'draft'
  | 'success' | 'warning' | 'error' | 'info';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase() as StatusType;
  
  const getVariant = () => {
    switch (normalizedStatus) {
      case 'active':
      case 'live':
      case 'completed':
      case 'delivered':
      case 'success':
        return 'success';
      case 'pending':
      case 'processing':
      case 'saved':
      case 'draft':
      case 'warning':
        return 'warning';
      case 'cancelled':
      case 'returned':
      case 'refunded':
      case 'inactive':
      case 'error':
        return 'danger';
      case 'shipped':
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Badge variant={getVariant()} className={className}>
      {status}
    </Badge>
  );
}