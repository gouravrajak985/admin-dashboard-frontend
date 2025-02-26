import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Plus, Minus, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

const NewOrder = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [items, setItems] = useState<OrderItem[]>([
    { id: '1', productName: '', quantity: 1, price: 0 }
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        productName: '',
        quantity: 1,
        price: 0
      }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handleSubmit = (e: React.FormEvent, status: 'draft' | 'submitted') => {
    e.preventDefault();
    // Add order submission logic here
    console.log({
      customerName,
      email,
      phone,
      address,
      paymentMethod,
      items,
      total: calculateTotal(),
      status
    });
  };

  const inputClassName = `w-full p-3 border ${
    theme === 'dark'
      ? 'bg-gray-900 border-gray-800'
      : 'bg-white border-gray-200'
  }`;

  return (
    <div className={`border ${
      theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
    }`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/orders/manage-orders')}
            className={`p-2 mr-4 border ${
              theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">New Order</h2>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, 'submitted')} className="p-6 space-y-6">
        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={inputClassName}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClassName}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClassName}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={inputClassName}
              required
            >
              <option value="">Select Payment Method</option>
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash on Delivery</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Shipping Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`${inputClassName} h-24`}
            required
          />
        </div>

        {/* Order Items */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Order Items</h3>
            <button
              type="button"
              onClick={addItem}
              className={`p-2 border ${
                theme === 'dark'
                  ? 'border-gray-800 hover:bg-gray-900'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className={`p-4 border ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <input
                      type="text"
                      value={item.productName}
                      onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                      className={inputClassName}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))}
                      className={inputClassName}
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value))}
                      className={inputClassName}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="mt-2 text-red-500 hover:text-red-600"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className={`p-4 border ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <span className="text-xl font-bold">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            className={`px-6 py-3 border ${
              theme === 'dark'
                ? 'border-gray-800 hover:bg-gray-900'
                : 'border-gray-200 hover:bg-gray-50'
            } flex items-center`}
          >
            <Save className="h-5 w-5 mr-2" />
            Save as Draft
          </button>
          <button
            type="submit"
            className={`px-6 py-3 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-black'
            } text-white hover:opacity-90 flex items-center`}
          >
            <Save className="h-5 w-5 mr-2" />
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewOrder;
