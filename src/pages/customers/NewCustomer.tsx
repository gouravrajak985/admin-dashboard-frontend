import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCustomer, clearCustomerError, resetCustomerSuccess } from '../../redux/slices/customerSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Save, ArrowLeft } from 'lucide-react';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

const NewCustomer = () => {
  const [customerName, setCustomerName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('Active');

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { loading, error, success } = useSelector((state: RootState) => state.customers);

  useEffect(() => {
    // Clear any previous errors and success state
    dispatch(clearCustomerError());
    dispatch(resetCustomerSuccess());
  }, [dispatch]);

  useEffect(() => {
    // Redirect after successful customer creation
    if (success) {
      navigate('/customers/manage-customers');
    }
  }, [success, navigate]);

  const handleSubmit = (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    
    // Validate form
    if (!customerName || !userName || !email) {
      alert('Please fill in all required fields');
      return;
    }

    const customerData = {
      customerName,
      userName,
      email,
      phone,
      address,
      status: isDraft ? 'Inactive' : status
    };

    dispatch(createCustomer(customerData));
  };

  const inputClassName = "w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="border rounded-lg">
      <div className="p-6 border-b">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/customers/manage-customers')}
            className="p-2 mr-4 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">New Customer</h2>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="p-6 space-y-6">
        {error && <Message variant="error">{error}</Message>}
        {loading && <Loader />}

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
            <label className="block text-sm font-medium mb-2">User Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
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
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`${inputClassName} h-24`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputClassName}
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="px-6 py-3 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center"
            disabled={loading}
          >
            <Save className="h-5 w-5 mr-2" />
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            disabled={loading}
          >
            <Save className="h-5 w-5 mr-2" />
            Create Customer
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCustomer;