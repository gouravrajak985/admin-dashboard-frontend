import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CardContainer } from '@/components/ui/card-container';
import { PageHeader } from '@/components/ui/page-header';
import { PeriodSelector } from '@/components/ui/period-selector';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { ExportButtons } from '@/components/ui/export-buttons';
import { SummaryCard } from '@/components/ui/summary-card';
import { DataTable } from '@/components/ui/data-table';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

// Sample data for demonstration
const generateSampleData = (period: 'daily' | 'weekly' | 'monthly' | 'all'): SalesData[] => {
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
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDateFiltered, setIsDateFiltered] = useState(false);
  
  // Generate the base data according to the selected period
  const baseData = generateSampleData(period);
  
  // Apply date filtering only when the Apply button is clicked
  const filteredData = isDateFiltered && startDate && endDate
    ? baseData.filter(item => {
        // For monthly and weekly data that have date ranges like "March 2024" or "2024-03-01 to 2024-03-07"
        if (item.date.includes(' to ')) {
          const [rangeStart] = item.date.split(' to ');
          return rangeStart >= startDate;
        } else if (!item.date.includes('-')) {
          // For monthly data like "March 2024"
          const [month, year] = item.date.split(' ');
          const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
          const itemDate = new Date(parseInt(year), monthIndex, 1).toISOString().split('T')[0];
          return itemDate >= startDate && itemDate <= endDate;
        }
        // For daily data
        return item.date >= startDate && item.date <= endDate;
      })
    : baseData;
  
  const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = filteredData.reduce((sum, item) => sum + item.orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

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

  const columns = [
    {
      header: period === 'daily' ? 'Date' : period === 'weekly' ? 'Week' : 'Month',
      accessor: 'date'
    },
    {
      header: 'Revenue',
      accessor: (item: SalesData) => `$${item.revenue.toLocaleString()}`
    },
    {
      header: 'Orders',
      accessor: 'orders'
    },
    {
      header: 'Average Order Value',
      accessor: (item: SalesData) => `$${item.averageOrderValue.toFixed(2)}`
    }
  ];
  
  return (
    <CardContainer>
      <PageHeader title="Sales Reports" backLink="/home">
        <PeriodSelector
          period={period}
          onChange={setPeriod}
        />
        
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApply={handleDateFilter}
          onClear={clearDateFilter}
          isFiltered={isDateFiltered}
        />
        
        <ExportButtons
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
        />
      </PageHeader>
      
      {/* Summary Cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={BarChart2}
          iconColor="text-primary"
          subtitle={getSummaryTimeLabel()}
        />
        
        <SummaryCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          icon={BarChart2}
          iconColor="text-primary"
          subtitle={getSummaryTimeLabel()}
        />
        
        <SummaryCard
          title="Average Order Value"
          value={`$${averageOrderValue.toFixed(2)}`}
          icon={BarChart2}
          iconColor="text-primary"
          subtitle={getSummaryTimeLabel()}
        />
      </div>
      
      {/* Sales Data Table */}
      <div className="px-6 pb-6">
        <DataTable
          columns={columns}
          data={filteredData}
          keyField="date"
          emptyMessage="No sales data available for the selected period."
        />
      </div>
    </CardContainer>
  );
};

export default SalesReports;