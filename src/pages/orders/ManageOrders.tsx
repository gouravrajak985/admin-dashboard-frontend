import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CardContainer } from '@/components/ui/card-container';
import { PageHeader } from '@/components/ui/page-header';
import { SearchInput } from '@/components/ui/search-input';
import { FilterDropdown } from '@/components/ui/filter-dropdown';
import { ActionButton } from '@/components/ui/action-button';
import { IconButton } from '@/components/ui/icon-button';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  amount: number;
  paymentReceived: boolean;
  paymentMethod: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned' | 'Refunded' | 'Completed' | 'Saved';
  date: string;
  items: OrderItem[];
}

const orders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    amount: 299.99,
    paymentReceived: true,
    paymentMethod: 'Credit Card',
    status: 'Delivered',
    date: '2024-03-15',
    items: [
      { productName: 'Premium Headphones', quantity: 1, price: 199.99 },
      { productName: 'Wireless Mouse', quantity: 2, price: 49.99 }
    ]
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    amount: 149.99,
    paymentReceived: false,
    paymentMethod: 'PayPal',
    status: 'Pending',
    date: '2024-03-14',
    items: [
      { productName: 'Mechanical Keyboard', quantity: 1, price: 149.99 }
    ]
  },
  {
    id: 'ORD-003',
    customerName: 'Mike Johnson',
    amount: 599.99,
    paymentReceived: true,
    paymentMethod: 'Bank Transfer',
    status: 'Saved',
    date: '2024-03-13',
    items: [
      { productName: 'Gaming Monitor', quantity: 2, price: 299.99 }
    ]
  },
  {
    id: 'ORD-004',
    customerName: 'Sarah Williams',
    amount: 899.99,
    paymentReceived: false,
    paymentMethod: 'Credit Card',
    status: 'Cancelled',
    date: '2024-03-12',
    items: [
      { productName: 'Gaming Monitor', quantity: 1, price: 299.99 },
      { productName: 'Premium Headphones', quantity: 1, price: 199.99 },
      { productName: 'Mechanical Keyboard', quantity: 1, price: 159.99 },
      { productName: 'Wireless Mouse', quantity: 2, price: 49.99 }
    ]
  }
];

const ManageOrders = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const handleManageOrder = (orderId: string) => {
    navigate(`/orders/manage-order/${orderId}`);
  };

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Order ID',
      accessor: 'id',
      className: 'font-medium'
    },
    {
      header: 'Customer',
      accessor: 'customerName'
    },
    {
      header: 'Amount',
      accessor: (order: Order) => (
        <span className={order.paymentReceived ? 'text-green-500' : 'text-red-500'}>
          ${order.amount.toFixed(2)}
        </span>
      ),
      className: 'font-medium'
    },
    {
      header: 'Payment Method',
      accessor: 'paymentMethod'
    },
    {
      header: 'Status',
      accessor: (order: Order) => (
        <StatusBadge status={order.status} />
      )
    },
    {
      header: 'Date',
      accessor: 'date'
    },
    {
      header: 'Actions',
      accessor: (order: Order) => (
        <div className="flex space-x-3">
          <IconButton 
            icon={Eye} 
            tooltip="View Order Details"
            onClick={(e) => {
              e.stopPropagation();
              toggleOrderDetails(order.id);
            }}
          />
          <IconButton 
            icon={Edit} 
            tooltip="Manage Order"
            onClick={(e) => {
              e.stopPropagation();
              handleManageOrder(order.id);
            }}
          />
          <IconButton 
            icon={Trash2} 
            tooltip="Delete Order"
            className="text-red-500"
          />
        </div>
      )
    }
  ];

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Returned', label: 'Returned' },
    { value: 'Refunded', label: 'Refunded' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Saved', label: 'Saved' }
  ];

  return (
    <CardContainer>
      <PageHeader title="Manage Orders" backLink="/home">
        <div className="flex-1 w-full md:w-auto">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search orders or products..."
          />
        </div>
        <div className="flex space-x-4 w-full md:w-auto">
          <FilterDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="All Status"
          />
          <ActionButton 
            variant="primary"
            onClick={() => navigate('/orders/new-order')}
          >
            Create Order
          </ActionButton>
        </div>
      </PageHeader>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${
            theme === 'dark' ? 'bg-gray-900' : 'bg-shopify-surface'
          } border-b ${
            theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
          }`}>
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className={`px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${
            theme === 'dark' ? 'divide-gray-800' : 'divide-shopify-border'
          }`}>
            {filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className={
                  theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-shopify-surface'
                }>
                  {columns.map((column, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className={`px-6 py-4 ${column.className || ''}`}
                      onClick={() => {
                        if (cellIndex !== columns.length - 1) { // Not clicking on actions column
                          handleManageOrder(order.id);
                        }
                      }}
                      style={{ cursor: cellIndex !== columns.length - 1 ? 'pointer' : 'default' }}
                    >
                      {typeof column.accessor === 'function' 
                        ? column.accessor(order)
                        : order[column.accessor as keyof Order]}
                    </td>
                  ))}
                </tr>
                {expandedOrderId === order.id && (
                  <tr>
                    <td colSpan={columns.length} className={`px-6 py-4 ${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-shopify-surface'
                    }`}>
                      <div className="text-sm">
                        <h4 className="font-medium mb-2">Order Items:</h4>
                        <table className="w-full">
                          <thead>
                            <tr className="text-xs text-shopify-text-secondary">
                              <th className="text-left py-2">Product</th>
                              <th className="text-left py-2">Quantity</th>
                              <th className="text-left py-2">Price</th>
                              <th className="text-left py-2">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, index) => (
                              <tr key={index} className="border-t border-gray-200 dark:border-gray-800">
                                <td className="py-2">{item.productName}</td>
                                <td className="py-2">{item.quantity}</td>
                                <td className="py-2">${item.price.toFixed(2)}</td>
                                <td className="py-2">${(item.quantity * item.price).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </CardContainer>
  );
};

export default ManageOrders;