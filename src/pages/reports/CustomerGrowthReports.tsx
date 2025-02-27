import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Download, FileText, Calendar, TrendingUp, Users, UserPlus, UserMinus, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CustomerData {
  date: string;
  totalCustomers: number;
  newCustomers: number;
  churnedCustomers: number;
  growthRate: number;
}

// Sample data for demonstration
const generateSampleData = (period: 'daily' | 'weekly' | 'monthly' | 'all'): CustomerData[] => {
  const data: CustomerData[] = [];
  const now = new Date();
  let totalCustomers = 1000;
  
  if (period === 'daily') {
    // Generate data for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const newCustomers = Math.floor(Math.random() * 20) + 5;
      const churnedCustomers = Math.floor(Math.random() * 10);
      
      totalCustomers = totalCustomers + newCustomers - churnedCustomers;
      const growthRate = ((newCustomers - churnedCustomers) / (totalCustomers - newCustomers + churnedCustomers)) * 100;
      
      data.push({
        date: date.toISOString().split('T')[0],
        totalCustomers,
        newCustomers,
        churnedCustomers,
        growthRate: Math.round(growthRate * 100) / 100
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
      
      const newCustomers = Math.floor(Math.random() * 50) + 10;
      const churnedCustomers = Math.floor(Math.random() * 20);
      
      totalCustomers = totalCustomers + newCustomers - churnedCustomers;
      const growthRate = ((newCustomers - churnedCustomers) / (totalCustomers - newCustomers + churnedCustomers)) * 100;
      
      data.push({
        date: `${weekStart.toISOString().split('T')[0]} to ${weekEnd.toISOString().split('T')[0]}`,
        totalCustomers,
        newCustomers,
        churnedCustomers,
        growthRate: Math.round(growthRate * 100) / 100
      });
    }
  } else {
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
  }
  
  return data;
};

const CustomerGrowthReports = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDateFiltered, setIsDateFiltered] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  
  const customerData = generateSampleData(period);
  
  const latestData = customerData[customerData.length - 1];
  const totalNewCustomers = customerData.reduce((sum, item) => sum + item.newCustomers, 0);
  const averageGrowthRate = customerData.reduce((sum, item) => sum + item.growthRate, 0) / customerData.length;
  
  const handleDateFilter = () => {
    if (startDate && endDate) {
      setIsDateFiltered(true);
    }
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setIsDateFiltered(false);
  };

  const handleExportCSV = () => {
    // Implementation for CSV export would go here
    console.log('Exporting as CSV...');
  };
  
  const handleExportPDF = () => {
    // Implementation for PDF export would go here
    console.log('Exporting as PDF...');
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'all': return 'All Time';
      default: return 'Monthly';
    }
  };

  const getSummaryTimeLabel = () => {
    if (isDateFiltered) {
      return 'Selected Period';
    }
    
    switch (period) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      case 'all': return 'All Time';
      default: return 'This Month';
    }
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
          <div className="relative">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className={`px-4 py-2 rounded-md flex items-center ${
                theme === 'dark'
                  ? 'bg-gray-900 border border-gray-800'
                  : 'bg-white border border-shopify-border'
              }`}
            >
              <span>{getPeriodLabel()}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {showPeriodDropdown && (
              <div className={`absolute z-10 mt-1 w-40 rounded-md shadow-lg ${
                theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-shopify-border'
              }`}>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setPeriod('all');
                      setShowPeriodDropdown(false);
                    }}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      period === 'all'
                        ? 'bg-shopify-green text-white'
                        : theme === 'dark'
                          ? 'hover:bg-gray-800'
                          : 'hover:bg-shopify-surface'
                    }`}
                  >
                    All Time
                  </button>
                  <button
                    onClick={() => {
                      setPeriod('daily');
                      setShowPeriodDropdown(false);
                    }}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      period === 'daily'
                        ? 'bg-shopify-green text-white'
                        : theme === 'dark'
                          ? 'hover:bg-gray-800'
                          : 'hover:bg-shopify-surface'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => {
                      setPeriod('weekly');
                      setShowPeriodDropdown(false);
                    }}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      period === 'weekly'
                        ? 'bg-shopify-green text-white'
                        : theme === 'dark'
                          ? 'hover:bg-gray-800'
                          : 'hover:bg-shopify-surface'
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => {
                      setPeriod('monthly');
                      setShowPeriodDropdown(false);
                    }}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      period === 'monthly'
                        ? 'bg-shopify-green text-white'
                        : theme === 'dark'
                          ? 'hover:bg-gray-800'
                          : 'hover:bg-shopify-surface'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
            )}
          </div>
          
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
            <button
              onClick={handleDateFilter}
              className={`px-3 py-2 rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-900 border border-gray-800 hover:bg-gray-800'
                  : 'bg-white border border-shopify-border hover:bg-shopify-surface'
              }`}
            >
              Apply
            </button>
            {isDateFiltered && (
              <button
                onClick={clearDateFilter}
                className={`px-3 py-2 rounded-md ${
                  theme === 'dark'
                    ? 'bg-gray-900 border border-gray-800 hover:bg-gray-800'
                    : 'bg-white border border-shopify-border hover:bg-shopify-surface'
                }`}
              >
                Clear
              </button>
            )}
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
          <p className="text-sm text-shopify-text-secondary mt-2">{getSummaryTimeLabel()}</p>
        </div>
        
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">New Customers</h3>
            <UserPlus className="h-6 w-6 text-shopify-green" />
          </div>
          <p className="text-3xl font-bold">{totalNewCustomers.toLocaleString()}</p>
          <p className="text-sm text-shopify-text-secondary mt-2">{getSummaryTimeLabel()}</p>
        </div>
        
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Churn Rate</h3>
            <UserMinus className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-3xl font-bold">{(latestData.churnedCustomers / latestData.totalCustomers * 100).toFixed(1)}%</p>
          <p className="text-sm text-shopify-text-secondary mt-2">{getSummaryTimeLabel()}</p>
        </div>
        
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Growth Rate</h3>
            <TrendingUp className="h-6 w-6 text-shopify-green" />
          </div>
          <p className="text-3xl font-bold">{averageGrowthRate.toFixed(1)}%</p>
          <p className="text-sm text-shopify-text-secondary mt-2">{getSummaryTimeLabel()}</p>
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
                  {period === 'daily' ? 'Date' : period === 'weekly' ? 'Week' : 'Month'}
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