import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
}

const StatCard = ({ title, value, change, isPositive, icon: Icon }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 bg-secondary rounded-md">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="mt-2 text-sm">
          <span className={cn(
            "font-medium",
            isPositive ? "text-green-600" : "text-red-600"
          )}>
            {change}
          </span>
          <span className="ml-2 text-muted-foreground">from last month</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default StatCard;