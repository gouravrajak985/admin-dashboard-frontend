import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Download, FileText, Calendar, CreditCard, DollarSign, AlertTriangle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentData {
  id: string;
  date: string;
  method: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  customerName: string;
  orderId: string;
}

// Sample data for demonstration
const generateSampleData = (period: 'daily' | 'weekly' | 'monthly' | 'all'): PaymentData[] => {
  const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Apple Pay', 'Google Pay'];
  const statuses: Array<PaymentData['status']> = ['Completed', 'Pending', 'Failed', 'Refunded'];
  const data: PaymentData[] = [];
  const now = new Date();
  
  let daysToGenerate = 30;
  if (period === 'weekly') daysToGenerate = 84; // 12 weeks
  if (period === 'monthly') daysToGenerate = 365; // 12 months
  if (period === 'all') daysToGenerate = 365;
  
  for (let i = 0; i < 50; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysToGenerate));
    
    data.push({
      id: `PAY-${1000 + i}`,
      date: date.toISOString().split('T')[0],
      method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      amount: Math.floor(Math.random() * 500) + 50,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      customerName: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Robert Brown'][Math.floor(Math.random() * 5)],
      orderId: `ORD-${2000 + i}`
    });
  }
  
  return data;
};

const PaymentReports = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isDateFiltered, setIsDateFiltered] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  
  // Generate the base data according to the selected period
  const baseData = generateSampleData(period);
  
  // Apply date filtering only when the Apply button is clicked
  const dateFilteredData = isDateFiltered && startDate && endDate
    ? baseData.filter(payment => payment.date >= startDate && payment.date <= endDate)
    : baseData;
  
  // Apply method and status filters
  const filteredPayments = dateFilteredData.filter(payment => {
    const matchesMethod = !methodFilter || payment.method === methodFilter;
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    return matchesMethod && matchesStatus;
  });
  
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedAmount = filteredPayments
    .filter(payment => payment.status === 'Completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = filteredPayments
    .filter(payment => payment.status === 'Pending')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const failedAmount = filteredPayments
    .filter(payment => payment.status === 'Failed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const paymentMethods = Array.from(new Set(baseData.map(payment => payment.method)));
  
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
  
  const getStatusColor = (status: PaymentData['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return '';
    }
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
          <h2 className="text-xl font-semibold">Payment Reports</h2>
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
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className={`px-3 py-2 border rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-shopify-border'
              }`}
            >
              <option value="">All Payment Methods</option>
              {paymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-3 py-2 border rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-shopify-border'
              }`}
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
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
            <h3 className="text-lg font-medium">Total Payments</h3>
            <DollarSign className="h-6 w-6 text-shopify-green" />
          </div>
          <p className="text-3xl font-bold">${totalAmount.toLocaleString()}</p>
          <p className="text-sm text-shopify-text-secondary mt-2">
            {getSummaryTimeLabel()} • {filteredPayments.length} transactions
          </p>
        </div>
        
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Completed</h3>
            <CreditCard className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-3xl font-bold">${completedAmount.toLocaleString()}</p>
          <p className="text-sm text-shopify-text-secondary mt-2">
            {getSummaryTimeLabel()} • {filteredPayments.filter(p => p.status === 'Completed').length} transactions
          </p>
        </div>
        
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Pending</h3>
            <CreditCard className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold">${pendingAmount.toLocaleString()}</p>
          <p className="text-sm text-shopify-text-secondary mt-2">
            {getSummaryTimeLabel()} • {filteredPayments.filter(p => p.status === 'Pending').length} transactions
          </p>
        </div>
        
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Failed</h3>
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-3xl font-bold">${failedAmount.toLocaleString()}</p>
          <p className="text-sm text-shopify-text-secondary mt-2">
            {getSummaryTimeLabel()} • {filteredPayments.filter(p => p.status === 'Failed').length} transactions
          </p>
        </div>
      </div>
      
      {/* Payments Table */}
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
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              theme === 'dark' ? 'divide-gray-800' : 'divide-shopify-border'
            }`}>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className={
                  theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-shopify-surface'
                }>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{payment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.method}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${payment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
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

export default PaymentReports;
