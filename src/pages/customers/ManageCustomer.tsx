import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerById, updateCustomer, clearCustomerError, resetCustomerSuccess } from '../../redux/slices/customerSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { ArrowLeft, Save } from 'lucide-react';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

const ManageCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { customer, loading, error, success } = useSelector((state: RootState) => state.customers);
  
  const [customerName, setCustomerName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (id) {
      dispatch(getCustomerById(id));
    }
    
    return () => {
      dispatch(clearCustomerError());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      dispatch(resetCustomerSuccess());
      navigate('/customers/manage-customers');
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    if (customer) {
      setCustomerName(customer.customerName);
      setUserName(customer.userName);
      setEmail(customer.email);
      setPhone(customer.phone || '');
      setAddress(customer.address || '');
      setStatus(customer.status);
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
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
      status
    };

    dispatch(updateCustomer({ id, customerData }));
  };

  const inputClassName = "w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  if (loading && !customer) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="error">{error}</Message>;
  }

  if (!customer && !loading) {
    return <Message variant="error">Customer not found</Message>;
  }

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
          <h2 className="text-xl font-semibold">Manage Customer</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
            onClick={() => navigate('/customers/manage-customers')}
            className="px-6 py-3 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            disabled={loading}
          >
            <Save className="h-5 w-5 mr-2" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageCustomer;