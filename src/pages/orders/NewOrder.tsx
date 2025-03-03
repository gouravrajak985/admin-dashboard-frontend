import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, clearOrderError, resetOrderSuccess } from '../../redux/slices/orderSlice';
import { getCustomers } from '../../redux/slices/customerSlice';
import { getProducts } from '../../redux/slices/productSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { ArrowLeft, Save, Plus, Minus } from 'lucide-react';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const NewOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { loading: orderLoading, error: orderError, success: orderSuccess } = useSelector((state: RootState) => state.orders);
  const { customers, loading: customersLoading } = useSelector((state: RootState) => state.customers);
  const { products, loading: productsLoading } = useSelector((state: RootState) => state.products);
  
  const [customer, setCustomer] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { product: '', name: '', quantity: 1, price: 0 }
  ]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [status, setStatus] = useState('Pending');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getProducts());
    dispatch(clearOrderError());
    dispatch(resetOrderSuccess());
  }, [dispatch]);

  useEffect(() => {
    if (orderSuccess) {
      navigate('/orders/manage-orders');
    }
  }, [orderSuccess, navigate]);

  useEffect(() => {
    // Calculate total price whenever order items change
    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
  }, [orderItems]);

  const handleAddItem = () => {
    setOrderItems([...orderItems, { product: '', name: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (orderItems.length > 1) {
      const newItems = [...orderItems];
      newItems.splice(index, 1);
      setOrderItems(newItems);
    }
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...orderItems];
    
    if (field === 'product' && typeof value === 'string') {
      const selectedProduct = products.find(p => p._id === value);
      if (selectedProduct) {
        newItems[index] = {
          ...newItems[index],
          product: value,
          name: selectedProduct.name,
          price: selectedProduct.finalPrice
        };
      }
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
    }
    
    setOrderItems(newItems);
  };

  const handleShippingChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress({
      ...shippingAddress,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent, saveAsDraft: boolean = false) => {
    e.preventDefault();
    
    // Validate form
    if (!customer || orderItems.some(item => !item.product) || 
        !shippingAddress.address || !shippingAddress.city || 
        !shippingAddress.postalCode || !shippingAddress.country) {
      alert('Please fill in all required fields');
      return;
    }

    const orderData = {
      customer,
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentReceived,
      totalPrice,
      status: saveAsDraft ? 'Saved' : status
    };

    dispatch(createOrder(orderData));
  };

  const inputClassName = "w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="border rounded-lg">
      <div className="p-6 border-b">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/orders/manage-orders')}
            className="p-2 mr-4 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">New Order</h2>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="p-6 space-y-6">
        {orderError && <Message variant="error">{orderError}</Message>}
        {orderLoading && <Loader />}

        {/* Customer Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Customer</label>
          <select
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className={inputClassName}
            required
          >
            <option value="">Select Customer</option>
            {customers.map((cust) => (
              <option key={cust._id} value={cust._id}>
                {cust.customerName} ({cust.email})
              </option>
            ))}
          </select>
        </div>

        {/* Order Items */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Order Items</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {orderItems.map((item, index) => (
              <div key={index} className="p-4 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Product</label>
                    <select
                      value={item.product}
                      onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                      className={inputClassName}
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map((prod) => (
                        <option key={prod._id} value={prod._id}>
                          {prod.name} - ${prod.finalPrice.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
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
                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                      className={inputClassName}
                      min="0"
                      step="0.01"
                      required
                      readOnly
                    />
                  </div>
                </div>
                {orderItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="mt-2 text-red-500 hover:text-red-600"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                value={shippingAddress.address}
                onChange={(e) => handleShippingChange('address', e.target.value)}
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) => handleShippingChange('city', e.target.value)}
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                value={shippingAddress.country}
                onChange={(e) => handleShippingChange('country', e.target.value)}
                className={inputClassName}
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={inputClassName}
              required
            >
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash on Delivery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payment Status</label>
            <select
              value={paymentReceived.toString()}
              onChange={(e) => setPaymentReceived(e.target.value === 'true')}
              className={inputClassName}
              required
            >
              <option value="true">Received</option>
              <option value="false">Pending</option>
            </select>
          </div>
        </div>

        {/* Order Status */}
        <div>
          <label className="block text-sm font-medium mb-2">Order Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputClassName}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Returned">Returned</option>
            <option value="Refunded">Refunded</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Total Price */}
        <div className="p-4 border rounded-md">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="px-6 py-3 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center"
            disabled={orderLoading}
          >
            <Save className="h-5 w-5 mr-2" />
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            disabled={orderLoading}
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