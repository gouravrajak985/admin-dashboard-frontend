import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomers } from '../../redux/slices/customerSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { ArrowLeft, Download, FileText, Calendar, TrendingUp, Users, UserPlus, UserMinus, ChevronDown } from 'lucide-react';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

interface CustomerData {
  date: string;
  totalCustomers: number;
  newCustomers: number;
  churnedCustomers: number;
  growthRate: number;
}

const CustomerGrowthReports = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { customers, loading, error } = useSelector((state: RootState) => state.customers);
  
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDateFiltered, setIsDateFiltered] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (customers.length > 0) {
      generateCustomerData();
    }
  }, [customers, period]);

  const generateCustomerData = () => {
    // This is a simplified version that would normally use real data
    // In a real app, you would calculate this based on actual customer data
    const data: CustomerData[] = [];
    const now = new Date();
    let totalCustomers = customers.length;
    
    if (period === 'daily') {
      // Generate data for the last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const newCustomers = Math.floor(Math.random() * 5) + 1;
        const churnedCustomers = Math.floor(Math.random() * 2);
        
        totalCustomers = totalCustomers - newCustomers + churnedCustomers;
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
        
        const newCustomers = Math.floor(Math.random() * 10) + 3;
        const churnedCustomers = Math.floor(Math.random() * 5);
        
        totalCustomers = totalCustomers - newCustomers + churnedCustomers;
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
        
        const newCustomers = Math.floor(Math.random() * 20) + 5;
        const churnedCustomers = Math.floor(Math.random() * 10);
        
        totalCustomers = totalCustomers - newCustomers + churnedCustomers;
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
    
    setCustomerData(data);
  };

  const handleDateFilter = () => {
    if (startDate && endDate) {
      setIsDateFiltered(true);
      // In a real app, you would filter the data based on the date range
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
      return `${startDate} to ${endDate}`;
    }
    
    switch (period) {
      case 'daily': return 'Last 30 Days';
      case 'weekly': return 'Last 12 Weeks';
      case 'monthly': return 'Last 12 Months';
      case 'all': return 'All Time';
      default: return 'Last 12 Months';
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="error">{error}</Message>;
  }

  const latestData = customerData[customerData.length - 1] || {
    totalCustomers: customers.length,
    newCustomers: 0,
    churnedCustomers: 0,
    growthRate: 0
  };
  
  const totalNewCustomers = customerData.reduce((sum, item) => sum + item.newCustomers, 0);
  const averageGrowthRate = customerData.length > 0 
    ? customerData.reduce((sum, item) => sum + item.growthRate, 0) / customerData.length 
    : 0;

  return (
    <div className="border rounded-lg">
      <div className="p-6 border-b">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/home')}
            className="p-2 mr-4 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">Customer Growth Reports</h2>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="px-4 py-2 rounded-md flex items-center border hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <span>{getPeriodLabel()}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {showPeriodDropdown && (
              <div className="absolute z-10 mt-1 w-40 rounded-md shadow-lg border bg-white dark:bg-gray-800">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setPeriod('all');
                      setShowPeriodDropdown(false);
                    }}
                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    All Time
                  </button>
                  <button
                    onClick={() => {
                      setPeriod('daily');
                      setShowPeriodDropdown(false);
                    }}
                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => {
                      setPeriod('weekly');
                      setShowPeriodDropdown(false);
                    }}
                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => {
                      setPeriod('monthly');
                      setShowPeriodDropdown(false);
                    }}
                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Monthly
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
            <span>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
            <button
              onClick={handleDateFilter}
              className="px-3 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Apply
            </button>
            {isDateFiltered && (
              <button
                onClick={clearDateFilter}
                className="px-3 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Clear
              </button>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 border rounded-md flex items-center hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <FileText className="h-5 w-5 mr-2" />
              Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 border rounded-md flex items-center hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Download className="h-5 w-5 mr-2" />
              Export PDF
            </button>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Customers</h3>
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold">{latestData.totalCustomers.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">{getSummaryTimeLabel()}</p>
        </div>
        
        <div className="p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">New Customers</h3>
            <UserPlus className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold">{totalNewCustomers.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">{getSummaryTimeLabel()}</p>
        </div>
        
        <div className="p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Churn Rate</h3>
            <UserMinus className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-3xl font-bold">
            {latestData.totalCustomers > 0 
              ? ((latestData.churnedCustomers / latestData.totalCustomers) * 100).toFixed(1)
              : '0.0'}%
          </p>
          <p className="text-sm text-gray-500 mt-2">{getSummaryTimeLabel()}</p>
        </div>
        
        <div className="p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Growth Rate</h3>
            <TrendingUp className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold">{averageGrowthRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-500 mt-2">{getSummaryTimeLabel()}</p>
        </div>
      </div>
      
      {/* Customer Growth Data Table */}
      <div className="px-6 pb-6">
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {period === 'daily' ? 'Date' : period === 'weekly' ? 'Week' : 'Month'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Customers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Customers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Churned Customers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customerData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
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