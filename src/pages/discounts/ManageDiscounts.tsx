import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Edit, Trash2, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CardContainer } from '@/components/ui/card-container';
import { PageHeader } from '@/components/ui/page-header';
import { SearchInput } from '@/components/ui/search-input';
import { FilterDropdown } from '@/components/ui/filter-dropdown';
import { ActionButton } from '@/components/ui/action-button';
import { IconButton } from '@/components/ui/icon-button';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';

interface Discount {
  id: string;
  code: string;
  type: 'discount_code' | 'coupon_codes';
  value: number;
  valueType: 'percentage' | 'fixed';
  usageCount: number;
  maxUses: number | null;
  status: 'Active' | 'Expired' | 'Scheduled';
  startDate: string;
  endDate: string;
}

const discounts: Discount[] = [
  {
    id: 'DISC-001',
    code: 'SUMMER2024',
    type: 'discount_code',
    value: 20,
    valueType: 'percentage',
    usageCount: 150,
    maxUses: null,
    status: 'Active',
    startDate: '2024-03-01',
    endDate: '2024-08-31'
  },
  {
    id: 'DISC-002',
    code: 'WELCOME10',
    type: 'discount_code',
    value: 10,
    valueType: 'fixed',
    usageCount: 45,
    maxUses: null,
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  {
    id: 'DISC-003',
    code: 'FLASH50',
    type: 'coupon_codes',
    value: 50,
    valueType: 'percentage',
    usageCount: 98,
    maxUses: 100,
    status: 'Expired',
    startDate: '2024-02-01',
    endDate: '2024-02-28'
  }
];

const ManageDiscounts = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Active' | 'Expired' | 'Scheduled' | ''>('');
  const [typeFilter, setTypeFilter] = useState<'discount_code' | 'coupon_codes' | ''>('');

  const handleManageDiscount = (discountId: string) => {
    navigate(`/discounts/manage-discount/${discountId}`);
  };

  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = discount.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || discount.status === statusFilter;
    const matchesType = !typeFilter || discount.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const columns = [
    {
      header: 'Code',
      accessor: 'code',
      className: 'font-medium'
    },
    {
      header: 'Type',
      accessor: (discount: Discount) => 
        discount.type === 'discount_code' ? 'Discount Code' : 'Coupon Codes'
    },
    {
      header: 'Value',
      accessor: (discount: Discount) => 
        discount.valueType === 'percentage' ? `${discount.value}%` : `$${discount.value}`
    },
    {
      header: 'Usage',
      accessor: (discount: Discount) => 
        `${discount.usageCount}${discount.maxUses ? `/${discount.maxUses}` : ''}`
    },
    {
      header: 'Status',
      accessor: (discount: Discount) => (
        <StatusBadge status={discount.status} />
      )
    },
    {
      header: 'Period',
      accessor: (discount: Discount) => (
        <div className="text-sm">
          <div>{discount.startDate}</div>
          <div className="text-shopify-text-secondary">to</div>
          <div>{discount.endDate}</div>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (discount: Discount) => (
        <div className="flex space-x-3">
          <IconButton 
            icon={Edit} 
            tooltip="Manage Discount"
            onClick={(e) => {
              e.stopPropagation();
              handleManageDiscount(discount.id);
            }}
          />
          <IconButton 
            icon={Trash2} 
            tooltip="Delete Discount"
            className="text-red-500"
          />
        </div>
      )
    }
  ];

  return (
    <CardContainer>
      <PageHeader title="Manage Discounts" backLink="/home">
        <div className="flex-1 w-full md:w-auto">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search discounts..."
          />
        </div>
        <div className="flex space-x-4 w-full md:w-auto">
          <FilterDropdown
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as 'Active' | 'Expired' | 'Scheduled' | '')}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Expired', label: 'Expired' },
              { value: 'Scheduled', label: 'Scheduled' }
            ]}
            placeholder="All Status"
          />
          <FilterDropdown
            value={typeFilter}
            onChange={(value) => setTypeFilter(value as 'discount_code' | 'coupon_codes' | '')}
            options={[
              { value: 'discount_code', label: 'Discount Codes' },
              { value: 'coupon_codes', label: 'Coupon Codes' }
            ]}
            placeholder="All Types"
          />
          <ActionButton 
            variant="primary"
            icon={Tag}
            onClick={() => navigate('/discounts/create')}
          >
            Create Discount
          </ActionButton>
        </div>
      </PageHeader>

      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredDiscounts}
          keyField="id"
          onRowClick={(discount) => handleManageDiscount(discount.id)}
          emptyMessage="No discounts found. Try adjusting your search or filters."
        />
      </div>
    </CardContainer>
  );
};

export default ManageDiscounts;