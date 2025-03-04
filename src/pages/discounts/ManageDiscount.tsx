import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

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
  description?: string;
  minPurchaseAmount?: number;
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
    endDate: '2024-08-31',
    description: 'Summer sale discount for all products',
    minPurchaseAmount: 50
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
    endDate: '2024-12-31',
    description: 'Welcome discount for new customers',
    minPurchaseAmount: 0
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
    endDate: '2024-02-28',
    description: 'Flash sale with limited uses',
    minPurchaseAmount: 100
  }
];

const ManageDiscount = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [discount, setDiscount] = useState<Discount | null>(null);

  useEffect(() => {
    // Find the discount with the matching ID
    const foundDiscount = discounts.find(d => d.id === id);
    if (foundDiscount) {
      setDiscount(foundDiscount);
    } else {
      // Handle case where discount is not found
      navigate('/discounts/manage');
    }
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (discount) {
      setDiscount({
        ...discount,
        [name]: name === 'value' || name === 'minPurchaseAmount' || name === 'maxUses' 
          ? parseFloat(value) 
          : value
      });
    }
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the discount
    console.log('Saving discount:', discount);
    navigate('/discounts/manage');
  };

  if (!discount) {
    return <div>Loading...</div>;
  }

  const inputClassName = `w-full p-3 border rounded-md ${
    theme === 'dark'
      ? 'bg-gray-900 border-gray-800'
      : 'bg-white border-shopify-border'
  } focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-gray-600' : 'focus:ring-shopify-focus'} focus:border-shopify-focus`;

  return (
    <div className={`border rounded-lg ${
      theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-shopify-border'
    }`}>
      <div className="p-6 border-b border-shopify-border dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/discounts/manage')}
              className={`p-2 mr-4 border rounded-md ${
                theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : 'border-shopify-border hover:bg-shopify-surface'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold">Manage Discount</h2>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Discount Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Discount Code</label>
            <input
              type="text"
              name="code"
              value={discount.code}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Discount Type</label>
            <select
              name="type"
              value={discount.type}
              onChange={handleInputChange}
              className={inputClassName}
            >
              <option value="discount_code">Discount Code</option>
              <option value="coupon_codes">Coupon Codes</option>
            </select>
          </div>
        </div>

        {/* Discount Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Discount Value</label>
            <div className="flex">
              <input
                type="number"
                name="value"
                value={discount.value}
                onChange={handleInputChange}
                min="0"
                step={discount.valueType === 'percentage' ? '1' : '0.01'}
                className={`${inputClassName} rounded-r-none`}
              />
              <select
                name="valueType"
                value={discount.valueType}
                onChange={handleInputChange}
                className={`${inputClassName} rounded-l-none border-l-0 w-24`}
              >
                <option value="percentage">%</option>
                <option value="fixed">$</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Minimum Purchase Amount</label>
            <input
              type="number"
              name="minPurchaseAmount"
              value={discount.minPurchaseAmount || 0}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={inputClassName}
            />
          </div>
        </div>

        {/* Usage Limits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Maximum Uses</label>
            <input
              type="number"
              name="maxUses"
              value={discount.maxUses || ''}
              onChange={handleInputChange}
              min="0"
              placeholder="Unlimited"
              className={inputClassName}
            />
            <p className="mt-1 text-sm text-muted-foreground">Leave empty for unlimited uses</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Current Usage</label>
            <input
              type="number"
              value={discount.usageCount}
              className={`${inputClassName} bg-gray-100 dark:bg-gray-800`}
              disabled
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={discount.startDate}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={discount.endDate}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            name="status"
            value={discount.status}
            onChange={handleInputChange}
            className={inputClassName}
          >
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Scheduled">Scheduled</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={discount.description || ''}
            onChange={handleInputChange}
            className={`${inputClassName} h-24`}
            placeholder="Add a description for this discount"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={() => navigate('/discounts/manage')}
            className={`px-4 py-2 border rounded-md ${
              theme === 'dark'
                ? 'border-gray-800 hover:bg-gray-900'
                : 'border-shopify-border hover:bg-shopify-surface'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageDiscount;