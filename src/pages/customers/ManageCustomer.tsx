import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Customer {
  id: string;
  customerName: string;
  userName: string;
  email: string;
  phone?: string;
  address?: string;
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
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA',
    orders: 12,
    status: 'Active',
    createdAt: '2024-01-15'
  },
  {
    id: 'CUST-002',
    customerName: 'Jane Smith',
    userName: 'janesmith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Ave, Somewhere, USA',
    orders: 5,
    status: 'Inactive',
    createdAt: '2023-11-20'
  },
  {
    id: 'CUST-003',
    customerName: 'Mike Johnson',
    userName: 'mikejohnson',
    email: 'mike.johnson@example.com',
    phone: '+1 (555) 456-7890',
    address: '789 Pine Rd, Elsewhere, USA',
    orders: 20,
    status: 'Active',
    createdAt: '2024-02-01'
  },
  {
    id: 'CUST-004',
    customerName: 'Sarah Williams',
    userName: 'sarahwilliams',
    email: 'sarah.williams@example.com',
    phone: '+1 (555) 234-5678',
    address: '321 Elm Blvd, Nowhere, USA',
    orders: 8,
    status: 'Inactive',
    createdAt: '2023-12-10'
  }
];

const ManageCustomer = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    // Find the customer with the matching ID
    const foundCustomer = customers.find(c => c.id === id);
    if (foundCustomer) {
      setCustomer(foundCustomer);
    } else {
      // Handle case where customer is not found
      navigate('/customers/manage-customers');
    }
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (customer) {
      setCustomer({
        ...customer,
        [name]: value
      });
    }
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the customer
    console.log('Saving customer:', customer);
    navigate('/customers/manage-customers');
  };

  if (!customer) {
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
              onClick={() => navigate('/customers/manage-customers')}
              className={`p-2 mr-4 border rounded-md ${
                theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : 'border-shopify-border hover:bg-shopify-surface'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold">Manage Customer</h2>
          </div>

        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={customer.customerName}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              name="userName"
              value={customer.userName}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={customer.email}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={customer.phone || ''}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <textarea
            name="address"
            value={customer.address || ''}
            onChange={handleInputChange}
            className={`${inputClassName} h-24`}
          />
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={customer.status}
              onChange={handleInputChange}
              className={inputClassName}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Total Orders</label>
            <input
              type="number"
              value={customer.orders}
              className={`${inputClassName} bg-gray-100 dark:bg-gray-800`}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Created At</label>
            <input
              type="text"
              value={customer.createdAt}
              className={`${inputClassName} bg-gray-100 dark:bg-gray-800`}
              disabled
            />
          </div>
        </div>

        {/* Order History (Placeholder) */}
        <div className={`p-6 border rounded-lg ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <h3 className="text-lg font-medium mb-4">Order History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${
                theme === 'dark' ? 'bg-gray-900' : 'bg-shopify-surface'
              } border-b ${
                theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
              }`}>
                <tr>
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                theme === 'dark' ? 'divide-gray-800' : 'divide-shopify-border'
              }`}>
                <tr>
                  <td className="px-4 py-2">ORD-12345</td>
                  <td className="px-4 py-2">2024-03-15</td>
                  <td className="px-4 py-2">$199.99</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">ORD-12346</td>
                  <td className="px-4 py-2">2024-02-28</td>
                  <td className="px-4 py-2">$49.99</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Processing</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={() => navigate('/customers/manage-customers')}
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

export default ManageCustomer;