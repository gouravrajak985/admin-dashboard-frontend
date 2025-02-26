import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type DiscountType = 'discount_code' | 'coupon_codes';

interface DiscountForm {
  type: DiscountType;
  code?: string;
  numberOfCoupons?: number;
  discountValue: number;
  discountType: 'percentage' | 'fixed';
  minPurchaseAmount: number;
  startDate: string;
  endDate: string;
  description: string;
}

const CreateDiscount = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DiscountForm>({
    type: 'discount_code',
    code: '',
    discountValue: 0,
    discountType: 'percentage',
    minPurchaseAmount: 0,
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add discount creation logic here
    console.log('Form data:', formData);
    navigate('/discounts/manage');
  };

  const generateRandomCode = (prefix: string = 'SALE') => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

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
        <div className="flex items-center">
          <button
            onClick={() => navigate('/discounts/manage')}
            className={`p-2 mr-4 border rounded-md ${
              theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : 'border-shopify-border hover:bg-shopify-surface'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">Create Discount</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Discount Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Discount Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'discount_code' })}
              className={`p-4 border rounded-lg text-left ${
                formData.type === 'discount_code'
                  ? 'border-shopify-green bg-shopify-surface'
                  : 'border-shopify-border hover:bg-shopify-surface'
              }`}
            >
              <h3 className="font-medium mb-1">Discount Code</h3>
              <p className="text-sm text-shopify-text-secondary">Single code that can be used multiple times</p>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'coupon_codes' })}
              className={`p-4 border rounded-lg text-left ${
                formData.type === 'coupon_codes'
                  ? 'border-shopify-green bg-shopify-surface'
                  : 'border-shopify-border hover:bg-shopify-surface'
              }`}
            >
              <h3 className="font-medium mb-1">Coupon Codes</h3>
              <p className="text-sm text-shopify-text-secondary">Generate multiple single-use codes</p>
            </button>
          </div>
        </div>

        {/* Code or Number of Coupons */}
        {formData.type === 'discount_code' ? (
          <div>
            <label className="block text-sm font-medium mb-2">Discount Code</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="Enter code or generate one"
                className={inputClassName}
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, code: generateRandomCode() })}
                className="px 4 py-2 bg-shopify-green text-white rounded-md hover:bg-shopify-green-dark"
              >
                Generate
              </button>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">Number of Coupon Codes</label>
            <input
              type="number"
              value={formData.numberOfCoupons}
              onChange={(e) => setFormData({ ...formData, numberOfCoupons: parseInt(e.target.value) })}
              min="1"
              max="1000"
              className={inputClassName}
            />
            <p className="mt-1 text-sm text-shopify-text-secondary">Maximum 1000 codes per batch</p>
          </div>
        )}

        {/* Discount Value */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Discount Value</label>
            <div className="flex">
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                min="0"
                step={formData.discountType === 'percentage' ? '1' : '0.01'}
                className={`${inputClassName} rounded-r-none`}
              />
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
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
              value={formData.minPurchaseAmount}
              onChange={(e) => setFormData({ ...formData, minPurchaseAmount: parseFloat(e.target.value) })}
              min="0"
              step="0.01"
              className={inputClassName}
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className={inputClassName}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`${inputClassName} h-24`}
            placeholder="Add a description for this discount"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/discounts/manage')}
            className={`px-6 py-3 border rounded-md ${
              theme === 'dark'
                ? 'border-gray-800 hover:bg-gray-900'
                : 'border-shopify-border hover:bg-shopify-surface'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-shopify-green text-white rounded-md hover:bg-shopify-green-dark flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            Create Discount
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDiscount;