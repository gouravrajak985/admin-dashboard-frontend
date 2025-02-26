import React from 'react';
import { DollarSign, ShoppingCart, Package, TrendingUp, Bell } from 'lucide-react';
import StatCard from '../components/StatCard';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { theme } = useTheme();
  
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
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className={`border rounded-lg ${
        theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-shopify-border'
      } p-6`}>
        <div className="flex items-center mb-6">
          <Bell className="h-5 w-5 mr-2 text-shopify-text-secondary" />
          <h2 className="text-lg font-semibold">Recent Notifications</h2>
        </div>
        
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-shopify-border bg-shopify-surface'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{notification.title}</h3>
                  <p className="mt-1 text-sm text-shopify-text-secondary">{notification.description}</p>
                </div>
                <span className="text-xs text-shopify-text-secondary">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;