import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Download, FileText, Calendar, TrendingUp, Users, UserPlus, UserMinus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CustomerData {
  date: string;
  totalCustomers: number;
  newCustomers: number;
  churnedCustomers: number;
  growthRate: number;
}

// Sample data for demonstration
const generateSampleData = (): CustomerData[] => {
  const data: CustomerData[] = [];
  const now = new Date();
  let totalCustomers = 1000;
  
  // Generate data for the last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    
    const newCustomers = Math.floor(Math.random() * 100) + 20;
    const churnedCustomers = Math.floor(Math.random() * 30);
    
    totalCustomers = totalCustomers + newCustomers - churnedCustomers;
    const growthRate = ((newCustomers - churnedCustomers) / (totalCustomers - newCustomers + churnedCustomers)) * 100;
    
    data.push({
      date: `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`,
      totalCustomers,
      newCustomers,
      churnedCustomers,
      growthRate: Math.round(growthRate * 100) / 100
    });
  }
  
  return data;
};

const CustomerGrowthReports = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const customerData = generateSampleData();
  
  const latestData = customerData[customerData.length - 1];
  const totalNewCustomers = customerData.reduce((sum, item) => sum + item.newCustomers, 0);
  const averageGrowthRate = customerData.reduce((sum, item) => sum + item.growthRate, 0) / customerData.length;
  
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
          <h2 className="text-xl font-semibold">Customer Growth Reports</h2>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
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
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Customers</h3>
            <Users className="h-6 w-6 text-shopify-green" />
          </div>
          <p className="text-3xl font-bold">{latestData.totalCustomers.toLocaleString()}</p>
          <p className="text-sm text-shopify-text-secondary mt-2">Current customer base</p>
        </div>
        
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">New Customers</h3>
            <UserPlus className="h-6 w-6 text-shopify-green" />
          </div>
          <p className="text-3xl font-bold">{totalNewCustomers.toLocaleString()}</p>
          <p className="text-sm text-shopify-text-secondary mt-2">Last 12 months</p>
        </div>
        
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Churn Rate</h3>
            <UserMinus className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-3xl font-bold">{(latestData.churnedCustomers / latestData.totalCustomers * 100).toFixed(1)}%</p>
          <p className="text-sm text-shopify-text-secondary mt-2">Current month</p>
        </div>
        
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Growth Rate</h3>
            <TrendingUp className="h-6 w-6 text-shopify-green" />
          </div>
          <p className="text-3xl font-bold">{averageGrowthRate.toFixed(1)}%</p>
          <p className="text-sm text-shopify-text-secondary mt-2">Average monthly</p>
        </div>
      </div>
      
      {/* Customer Growth Data Table */}
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
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">
                  Total Customers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">
                  New Customers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">
                  Churned Customers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">
                  Growth Rate
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              theme === 'dark' ? 'divide-gray-800' : 'divide-shopify-border'
            }`}>
              {customerData.map((item, index) => (
                <tr key={index} className={
                  theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-shopify-surface'
                }>
                  <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.totalCustomers.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-500">+{item.newCustomers}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-500">-{item.churnedCustomers}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={item.growthRate >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {item.growthRate >= 0 ? '+' : ''}{item.growthRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerGrowthReports;