import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Search, Edit, Trash2, Tag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const getStatusColor = (status: Discount['status']) => {
  const colors = {
    Active: 'bg-green-100 text-green-800',
    Expired: 'bg-red-100 text-red-800',
    Scheduled: 'bg-yellow-100 text-yellow-800'
  };
  return colors[status];
};

const ManageDiscounts = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Active' | 'Expired' | 'Scheduled' | ''>('');
  const [typeFilter, setTypeFilter] = useState<'discount_code' | 'coupon_codes' | ''>('');
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [editedDiscount, setEditedDiscount] = useState<Discount | null>(null);

  const handleEditClick = (discount: Discount) => {
    setSelectedDiscount(discount);
    setEditedDiscount({ ...discount });
  };

  const handleUpdateDiscount = () => {
    if (editedDiscount) {
      // Here you would typically make an API call to update the discount
      console.log('Updating discount:', editedDiscount);
      setSelectedDiscount(null);
      setEditedDiscount(null);
    }
  };

  const inputClassName = `w-full p-2 border rounded-md ${
    theme === 'dark'
      ? 'bg-gray-900 border-gray-800'
      : 'bg-white border-shopify-border'
  }`;

  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = discount.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || discount.status === statusFilter;
    const matchesType = !typeFilter || discount.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className={`border rounded-lg ${
      theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-shopify-border'
    }`}>
      {selectedDiscount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/50">
          <div className={`relative max-w-4xl w-full mx-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          } rounded-lg shadow-xl`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Edit Discount</h2>
                <button
                  onClick={() => {
                    setSelectedDiscount(null);
                    setEditedDiscount(null);
                  }}
                  className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Code</label>
                  <input
                    type="text"
                    value={editedDiscount?.code}
                    onChange={(e) => setEditedDiscount(prev => prev ? { ...prev, code: e.target.value.toUpperCase() } : null)}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Value</label>
                  <div className="flex">
                    <input
                      type="number"
                      value={editedDiscount?.value}
                      onChange={(e) => setEditedDiscount(prev => prev ? { ...prev, value: parseFloat(e.target.value) } : null)}
                      className={`${inputClassName} rounded-r-none`}
                    />
                    <select
                      value={editedDiscount?.valueType}
                      onChange={(e) => setEditedDiscount(prev => prev ? { ...prev, valueType: e.target.value as 'percentage' | 'fixed' } : null)}
                      className={`${inputClassName} rounded-l-none border-l-0 w-24`}
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">$</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editedDiscount?.startDate}
                    onChange={(e) => setEditedDiscount(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={editedDiscount?.endDate}
                    onChange={(e) => setEditedDiscount(prev => prev ? { ...prev, endDate: e.target.value } : null)}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={editedDiscount?.status}
                    onChange={(e) => setEditedDiscount(prev => prev ? { ...prev, status: e.target.value as Discount['status'] } : null)}
                    className={inputClassName}
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Uses</label>
                  <input
                    type="number"
                    value={editedDiscount?.maxUses || ''}
                    onChange={(e) => setEditedDiscount(prev => prev ? { ...prev, maxUses: e.target.value ? parseInt(e.target.value) : null } : null)}
                    className={inputClassName}
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setSelectedDiscount(null);
                    setEditedDiscount(null);
                  }}
                  className={`px-4 py-2 border rounded-md ${
                    theme === 'dark'
                      ? 'border-gray-800 hover:bg-gray-800'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateDiscount}
                  className="px-4 py-2 bg-shopify-green text-white rounded-md hover:bg-shopify-green-dark"
                >
                  Update Discount
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <h2 className="text-xl font-semibold">Manage Discounts</h2>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-shopify-text-secondary" />
              <input
                type="text"
                placeholder="Search discounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                  theme === 'dark' 
                    ? 'bg-gray-900 border-gray-800' 
                    : 'bg-white border-shopify-border'
                }`}
              />
            </div>
          </div>
          <div className="flex space-x-4 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'Active' | 'Expired' | 'Scheduled' | '')}
              className={`px-4 py-2 border rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-800' 
                  : 'bg-white border-shopify-border'
              }`}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Scheduled">Scheduled</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'discount_code' | 'coupon_codes' | '')}
              className={`px-4 py-2 border rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-800' 
                  : 'bg-white border-shopify-border'
              }`}
            >
              <option value="">All Types</option>
              <option value="discount_code">Discount Codes</option>
              <option value="coupon_codes">Coupon Codes</option>
            </select>
            <button 
              onClick={() => navigate('/discounts/create')}
              className="px-4 py-2 bg-shopify-green text-white rounded-md hover:bg-shopify-green-dark flex items-center"
            >
              <Tag className="h-5 w-5 mr-2" />
              Create Discount
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${
            theme === 'dark' ? 'bg-gray-900' : 'bg-shopify-surface'
          } border-b ${
            theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
          }`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase">Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-shopify-text-secondary uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            theme === 'dark' ? 'divide-gray-800' : 'divide-shopify-border'
          }`}>
            {filteredDiscounts.map((discount) => (
              <tr key={discount.id} className={
                theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-shopify-surface'
              }>
                <td className="px-6 py-4 font-medium">{discount.code}</td>
                <td className="px-6 py-4">
                  {discount.type === 'discount_code' ? 'Discount Code' : 'Coupon Codes'}
                </td>
                <td className="px-6 py-4">
                  {discount.valueType === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                </td>
                <td className="px-6 py-4">
                  {discount.usageCount}{discount.maxUses ? `/${discount.maxUses}` : ''}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(discount.status)}`}>
                    {discount.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div>{discount.startDate}</div>
                  <div className="text-shopify-text-secondary">to</div>
                  <div>{discount.endDate}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleEditClick(discount)}
                      className={`p-2 border rounded-md ${
                        theme === 'dark' ? 'border-gray-800 hover:bg-gray-800' : 'border-shopify-border hover:bg-shopify-surface'
                      }`}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className={`p-2 border rounded-md ${
                      theme === 'dark' ? 'border-gray-800 hover:bg-gray-800' : 'border-shopify-border hover:bg-shopify-surface'
                    }`}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDiscounts;