import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../../redux/slices/orderSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { BarChart2, ArrowLeft, Download, FileText, Calendar, ChevronDown } from 'lucide-react';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

const SalesReports = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);
  
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDateFiltered, setIsDateFiltered] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orders.length > 0) {
      generateSalesData();
    }
  }, [orders, period]);

  const generateSalesData = () => {
    // This is a simplified version that would normally use real data
    // In a real app, you would calculate this based on actual order data
    const data: SalesData[] = [];
    const now = new Date();
    
    if (period === 'daily') {
      // Generate data for the last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Filter orders for this day
        const dayOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt || Date.now());
          return orderDate.toDateString() === date.toDateString();
        });
        
        const revenue = dayOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const orderCount = dayOrders.length;
        
        data.push({
          date: date.toISOString().split('T')[0],
          revenue,
          orders: orderCount,
          averageOrderValue: orderCount > 0 ? revenue / orderCount : 0
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
        
        // Filter orders for this week
        const weekOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt || Date.now());
          return orderDate >= weekStart && orderDate <= weekEnd;
        });
        
        const revenue = weekOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const orderCount = weekOrders.length;
        
        data.push({
          date: `${weekStart.toISOString().split('T')[0]} to ${weekEnd.toISOString().split('T')[0]}`,
          revenue,
          orders: orderCount,
          averageOrderValue: orderCount > 0 ? revenue / orderCount : 0
        });
      }
    } else {
      // Generate data for the last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        // Filter orders for this month
        const monthOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt || Date.now());
          return orderDate >= monthStart && orderDate <= monthEnd;
        });
        
        const revenue = monthOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const orderCount = monthOrders.length;
        
        data.push({
          date: `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`,
          revenue,
          orders: orderCount,
          averageOrderValue: orderCount > 0 ? revenue / orderCount : 0
        });
      }
    }
    
    setSalesData(data);
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

  // Calculate summary data
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

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
          <h2 className="text-xl font-semibold">Sales Reports</h2>
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
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Revenue</h3>
            <BarChart2 className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">{getSummaryTimeLabel()}</p>
        </div>
        
        <div className="p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Orders</h3>
            <BarChart2 className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold">{totalOrders.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">{getSummaryTimeLabel()}</p>
        </div>
        
        <div className="p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Average Order Value</h3>
            <BarChart2 className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold">${averageOrderValue.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2">{getSummaryTimeLabel()}</p>
        </div>
      </div>
      
      {/* Sales Data Table */}
      <div className="px-6 pb-6">
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {period === 'daily' ? 'Date' : period === 'weekly' ? 'Week' : 'Month'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Order Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {salesData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
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