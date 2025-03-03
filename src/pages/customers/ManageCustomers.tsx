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

interface Customer {
  id: string;
  customerName: string;
  userName: string;
  email: string;
  orders: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const customers: Customer[] = [
  {
    id: 'CUST-001',
    customerName: 'John Doe',
    userName: 'johndoe',
    email: 'john.doe@example.com',
    orders: 12,
    status: 'Active',
    createdAt: '2024-01-15'
  },
  {
    id: 'CUST-002',
    customerName: 'Jane Smith',
    userName: 'janesmith',
    email: 'jane.smith@example.com',
    orders: 5,
    status: 'Inactive',
    createdAt: '2023-11-20'
  },
  {
    id: 'CUST-003',
    customerName: 'Mike Johnson',
    userName: 'mikejohnson',
    email: 'mike.johnson@example.com',
    orders: 20,
    status: 'Active',
    createdAt: '2024-02-01'
  },
  {
    id: 'CUST-004',
    customerName: 'Sarah Williams',
    userName: 'sarahwilliams',
    email: 'sarah.williams@example.com',
    orders: 8,
    status: 'Inactive',
    createdAt: '2023-12-10'
  }
];

const ManageCustomers = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Active' | 'Inactive' | ''>('');

  const handleManageCustomer = (customerId: string) => {
    navigate(`/customers/manage-customer/${customerId}`);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Customer Name',
      accessor: 'customerName'
    },
    {
      header: 'User Name',
      accessor: 'userName'
    },
    {
      header: 'Email',
      accessor: 'email'
    },
    {
      header: 'Orders',
      accessor: 'orders'
    },
    {
      header: 'Status',
      accessor: (customer: Customer) => (
        <StatusBadge status={customer.status} />
      )
    },
    {
      header: 'Created At',
      accessor: 'createdAt'
    },
    {
      header: 'Actions',
      accessor: (customer: Customer) => (
        <div className="flex space-x-3">
          <IconButton 
            icon={Eye} 
            tooltip="View Customer"
          />
          <IconButton 
            icon={Edit} 
            tooltip="Manage Customer"
            onClick={(e) => {
              e.stopPropagation();
              handleManageCustomer(customer.id);
            }}
          />
          <IconButton 
            icon={Trash2} 
            tooltip="Delete Customer"
            className="text-red-500"
          />
        </div>
      )
    }
  ];

  return (
    <CardContainer>
      <PageHeader title="Manage Customers" backLink="/home">
        <div className="flex-1 w-full md:w-auto">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search customers..."
          />
        </div>
        <div className="flex space-x-4 w-full md:w-auto">
          <FilterDropdown
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as 'Active' | 'Inactive' | '')}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
            placeholder="All Status"
          />
          <ActionButton 
            variant="primary"
            onClick={() => navigate('/customers/new-customer')}
          >
            Add Customer
          </ActionButton>
        </div>
      </PageHeader>

      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredCustomers}
          keyField="id"
          onRowClick={(customer) => handleManageCustomer(customer.id)}
          emptyMessage="No customers found. Try adjusting your search or filters."
        />
      </div>
    </CardContainer>
  );
};

export default ManageCustomers;