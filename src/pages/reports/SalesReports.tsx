import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Download, FileText, Calendar, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

// Sample data for demonstration
const generateSampleData = (period: 'daily' | 'weekly' | 'monthly'): SalesData[] => {
  const data: SalesData[] = [];
  const now = new Date();
  
  if (period === 'daily') {
    // Generate data for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const revenue = Math.floor(Math.random() * 5000) + 1000;
      const orders = Math.floor(Math.random() * 50) + 10;
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue,
        orders,
        averageOrderValue: Math.round((revenue / orders) * 100) / 100
      });
    }
  } else if (period === 'weekly') {
    // Generate data for the last 12 weeks
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - (i * 7));
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const revenue = Math.floor(Math.random() * 30000) + 5000;
      const orders = Math.floor(Math.random() * 300) + 50;
      
      data.push({
        date: `${weekStart.toISOString().split('T')[0]} to ${weekEnd.toISOString().split('T')[0]}`,
        revenue,
        orders,
        averageOrderValue: Math.round((revenue / orders) * 100) / 100
      });
    }
  } else {
    // Generate data for the last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      
      const revenue = Math.floor(Math.random() * 100000) + 20000;
      const orders = Math.floor(Math.random() * 1000) + 200;
      
      data.push({
        date: `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`,
        revenue,
        orders,
        averageOrderValue: Math.round((revenue / orders) * 100) / 100
      });
    }
  }
  
  return data;
};

const SalesReports = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const salesData = generateSampleData(period);
  
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const averageOrderValue = totalRevenue / totalOrders;
  
  const handleExportCSV = () => {
    // Implementation for CSV export would go here
    console.log('Exporting as CSV...');
  };
  
  const handleExportPDF = () => {
    // Implementation for PDF export would go here
    console.log('Exporting as PDF...');
  };
  
  return (
    <div className={`border rounded-lg ${
      theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-shopify-border'
    }`}>
      <div className="p-6 border-b border-shopify-border dark:border-gray-800">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/home')}
            className={`p-2 mr-4 border rounded-md ${
              theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : 'border-shopify-border hover:bg-shopify-surface'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">Sales Reports</h2>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setPeriod('daily')}
              className={`px-4 py-2 rounded-md ${
                period === 'daily'
                  ? 'bg-shopify-green text-white'
                  : theme === 'dark'
                    ? 'bg-gray-900 border border-gray-800'
                    : 'bg-white border border-shopify-border'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-4 py-2 rounded-md ${
                period === 'weekly'
                  ? 'bg-shopify-green text-white'
                  : theme === 'dark'
                    ? 'bg-gray-900 border border-gray-800'
                    : 'bg-white border border-shopify-border'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-4 py-2 rounded-md ${
                period === 'monthly'
                  ? 'bg-shopify-green text-white'
                  : theme === 'dark'
                    ? 'bg-gray-900 border border-gray-800'
                    : 'bg-white border border-shopify-border'
              }`}
            >
              Monthly
            </button>
          </div>
          
          <div className="flex space-x-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-shopify-text-secondary" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`px-3 py-2 border rounded-md ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-800'
                    : 'bg-white border-shopify-border'
                }`}
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`px-3 py-2 border rounded-md ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-800'
                    : 'bg-white border-shopify-border'
                }`}
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleExportCSV}
              className={`px-4 py-2 border rounded-md flex items-center ${
                theme === 'dark'
                  ? 'border-gray-800 hover:bg-gray-900'
                  : 'border-shopify-border hover:bg-shopify-surface'
              }`}
            >
              <FileText className="h-5 w-5 mr-2" />
              Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className={`px-4 py-2 border rounded-md flex items-center ${
                theme === 'dark'
                  ? 'border-gray-800 hover:bg-gray-900'
                  : 'border-shopify-border hover:bg-shopify-surface'
              }`}
            >
              <Download className="h-5 w-5 mr-2" />
              Export PDF
            </button>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Revenue</h3>
            <BarChart2 className="h-6 w-6 text-shopify-green" />
          </div>
          <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-shopify-text-secondary mt-2">
            {period === 'daily' ? 'Today' : period === 'weekly' ? 'This Week' : 'This Month'}
          </p>
        </div>
        
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Orders</h3>
            <BarChart2 className="h-6 w-6 text-shopify-green" />
          </div>
          <p className="text-3xl font-bold">{totalOrders.toLocaleString()}</p>
          <p className="text-sm text-shopify-text-secondary mt-2">
          {period === 'daily' ? 'Today' : period === 'weekly' ? 'This Week' : 'This Month'}
          </p>
        </div>
        
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Average Order Value</h3>
            <BarChart2 className="h-6 w-6 text-shopify-green" />
          </div>
          <p className="text-3xl font-bold">${averageOrderValue.toFixed(2)}</p>
          <p className="text-sm text-shopify-text-secondary mt-2">
          {period === 'daily' ? 'Today' : period === 'weekly' ? 'This Week' : 'This Month'}
          </p>
        </div>
      </div>
      
      {/* Sales Data Table */}
      <div className="px-6 pb-6">
        <div className={`border rounded-lg overflow-hidden ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <table className="w-full">
            <thead className={`${
              theme === 'dark' ? 'bg-gray-900' : 'bg-shopify-surface'
            }`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">
                  {period === 'daily' ? 'Date' : period === 'weekly' ? 'Week' : 'Month'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">
                  Average Order Value
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              theme === 'dark' ? 'divide-gray-800' : 'divide-shopify-border'
            }`}>
              {salesData.map((item, index) => (
                <tr key={index} className={
                  theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-shopify-surface'
                }>
                  <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${item.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${item.averageOrderValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReports;