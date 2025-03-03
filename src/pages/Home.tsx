import React from 'react';
import { DollarSign, ShoppingCart, Package, TrendingUp, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryCard } from '@/components/ui/summary-card';

const Home = () => {
  const stats = [
    {
      title: 'Total Sales',
      value: '$45,231',
      change: '+20.1%',
      isPositive: true,
      icon: DollarSign
    },
    {
      title: 'Total Orders',
      value: '1,205',
      change: '+12.5%',
      isPositive: true,
      icon: ShoppingCart
    },
    {
      title: 'Total Items',
      value: '356',
      change: '-2.3%',
      isPositive: false,
      icon: Package
    },
    {
      title: 'Total Revenue',
      value: '$89,123',
      change: '+15.2%',
      isPositive: true,
      icon: TrendingUp
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'New order received',
      description: 'Order #12345 needs processing',
      time: '5 minutes ago',
      type: 'order'
    },
    {
      id: 2,
      title: 'Low stock alert',
      description: 'Product "Gaming Mouse" is running low',
      time: '2 hours ago',
      type: 'warning'
    },
    {
      id: 3,
      title: 'Payment received',
      description: 'Payment for order #12344 confirmed',
      time: '4 hours ago',
      type: 'success'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <SummaryCard 
            key={index} 
            title={stat.title} 
            value={stat.value} 
            icon={stat.icon}
            subtitle={
              <span>
                <span className={cn(
                  "font-medium",
                  stat.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {stat.change}
                </span>
                <span className="ml-2 text-muted-foreground">from last month</span>
              </span>
            }
          />
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <Bell className="h-5 w-5 mr-2 text-muted-foreground" />
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className="bg-secondary">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function for class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default Home;