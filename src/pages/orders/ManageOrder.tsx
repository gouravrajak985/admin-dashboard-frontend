import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Save, Plus, Minus, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  productId?: number;
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  amount: number;
  paymentReceived: boolean;
  paymentMethod: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned' | 'Refunded' | 'Completed' | 'Saved';
  date: string;
  items: OrderItem[];
}

interface Product {
  id: number;
  title: string;
  price: number;
  sku: string;
  image: string;
}

// Sample products data (in a real app, this would come from an API)
const products: Product[] = [
  {
    id: 1,
    title: 'Premium Headphones',
    price: 199.99,
    sku: 'HDX-100',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80'
  },
  {
    id: 2,
    title: 'Wireless Mouse',
    price: 49.99,
    sku: 'WM-200',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=80'
  },
  {
    id: 3,
    title: 'Mechanical Keyboard',
    price: 159.99,
    sku: 'KB-300',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&q=80'
  },
  {
    id: 4,
    title: 'Gaming Monitor',
    price: 299.99,
    sku: 'GM-400',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&q=80'
  }
];

const orders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA',
    amount: 299.99,
    paymentReceived: true,
    paymentMethod: 'Credit Card',
    status: 'Delivered',
    date: '2024-03-15',
    items: [
      { id: 'ITEM-001', productName: 'Premium Headphones', quantity: 1, price: 199.99, productId: 1 },
      { id: 'ITEM-002', productName: 'Wireless Mouse', quantity: 2, price: 49.99, productId: 2 }
    ]
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Ave, Somewhere, USA',
    amount: 149.99,
    paymentReceived: false,
    paymentMethod: 'PayPal',
    status: 'Pending',
    date: '2024-03-14',
    items: [
      { id: 'ITEM-003', productName: 'Mechanical Keyboard', quantity: 1, price: 149.99, productId: 3 }
    ]
  },
  {
    id: 'ORD-003',
    customerName: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+1 (555) 456-7890',
    address: '789 Pine Rd, Elsewhere, USA',
    amount: 599.99,
    paymentReceived: true,
    paymentMethod: 'Bank Transfer',
    status: 'Saved',
    date: '2024-03-13',
    items: [
      { id: 'ITEM-004', productName: 'Gaming Monitor', quantity: 2, price: 299.99, productId: 4 }
    ]
  },
  {
    id: 'ORD-004',
    customerName: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    phone: '+1 (555) 234-5678',
    address: '321 Elm Blvd, Nowhere, USA',
    amount: 899.99,
    paymentReceived: false,
    paymentMethod: 'Credit Card',
    status: 'Cancelled',
    date: '2024-03-12',
    items: [
      { id: 'ITEM-005', productName: 'Gaming Monitor', quantity: 1, price: 299.99, productId: 4 },
      { id: 'ITEM-006', productName: 'Premium Headphones', quantity: 1, price: 199.99, productId: 1 },
      { id: 'ITEM-007', productName: 'Mechanical Keyboard', quantity: 1, price: 159.99, productId: 3 },
      { id: 'ITEM-008', productName: 'Wireless Mouse', quantity: 2, price: 49.99, productId: 2 }
    ]
  }
];

const ManageOrder = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  
  // Product search and recommendation states
  const [searchQuery, setSearchQuery] = useState<{[key: string]: string}>({});
  const [showRecommendations, setShowRecommendations] = useState<{[key: string]: boolean}>({});
  const [filteredProducts, setFilteredProducts] = useState<{[key: string]: Product[]}>({});
  
  const recommendationsRef = useRef<{[key: string]: HTMLDivElement | null}>({});

  useEffect(() => {
    // Find the order with the matching ID
    const foundOrder = orders.find(o => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
      
      // Initialize search state for existing items
      const initialSearchState: {[key: string]: string} = {};
      const initialShowState: {[key: string]: boolean} = {};
      
      foundOrder.items.forEach(item => {
        initialSearchState[item.id] = '';
        initialShowState[item.id] = false;
      });
      
      setSearchQuery(initialSearchState);
      setShowRecommendations(initialShowState);
    } else {
      // Handle case where order is not found
      navigate('/orders/manage-orders');
    }
  }, [id, navigate]);

  // Handle clicks outside the recommendations dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(recommendationsRef.current).forEach(itemId => {
        if (
          recommendationsRef.current[itemId] && 
          !recommendationsRef.current[itemId]?.contains(event.target as Node)
        ) {
          setShowRecommendations(prev => ({...prev, [itemId]: false}));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter products based on search query
  useEffect(() => {
    const newFilteredProducts: {[key: string]: Product[]} = {};
    
    Object.keys(searchQuery).forEach(itemId => {
      if (searchQuery[itemId]) {
        const query = searchQuery[itemId].toLowerCase();
        newFilteredProducts[itemId] = products.filter(
          product => 
            product.title.toLowerCase().includes(query) || 
            product.sku.toLowerCase().includes(query)
        );
      } else {
        newFilteredProducts[itemId] = [];
      }
    });
    
    setFilteredProducts(newFilteredProducts);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (order) {
      setOrder({
        ...order,
        [name]: value
      });
    }
  };

  const handleProductSearch = (itemId: string, value: string) => {
    handleItemChange(itemId, 'productName', value);
    setSearchQuery(prev => ({...prev, [itemId]: value}));
    setShowRecommendations(prev => ({...prev, [itemId]: true}));
  };

  const handleSelectProduct = (itemId: string, product: Product) => {
    handleItemChange(itemId, 'productName', product.title);
    handleItemChange(itemId, 'price', product.price);
    handleItemChange(itemId, 'productId', product.id);
    setShowRecommendations(prev => ({...prev, [itemId]: false}));
  };

  const handleItemChange = (itemId: string, field: keyof OrderItem, value: string | number) => {
    if (order) {
      const updatedItems = order.items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      );
      
      // Recalculate total amount
      const newAmount = updatedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      
      setOrder({
        ...order,
        items: updatedItems,
        amount: newAmount
      });
    }
  };

  const addItem = () => {
    if (order) {
      const newItemId = `ITEM-${Date.now()}`;
      const newItem: OrderItem = {
        id: newItemId,
        productName: '',
        quantity: 1,
        price: 0
      };
      
      setOrder({
        ...order,
        items: [...order.items, newItem]
      });
      
      // Initialize search state for the new item
      setSearchQuery(prev => ({...prev, [newItemId]: ''}));
      setShowRecommendations(prev => ({...prev, [newItemId]: false}));
    }
  };

  const removeItem = (itemId: string) => {
    if (order && order.items.length > 1) {
      const updatedItems = order.items.filter(item => item.id !== itemId);
      
      // Recalculate total amount
      const newAmount = updatedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      
      setOrder({
        ...order,
        items: updatedItems,
        amount: newAmount
      });
      
      // Clean up search state
      setSearchQuery(prev => {
        const newState = {...prev};
        delete newState[itemId];
        return newState;
      });
      
      setShowRecommendations(prev => {
        const newState = {...prev};
        delete newState[itemId];
        return newState;
      });
      
      setFilteredProducts(prev => {
        const newState = {...prev};
        delete newState[itemId];
        return newState;
      });
    }
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the order
    console.log('Saving order:', order);
    navigate('/orders/manage-orders');
  };

  if (!order) {
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
              onClick={() => navigate('/orders/manage-orders')}
              className={`p-2 mr-4 border rounded-md ${
                theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : 'border-shopify-border hover:bg-shopify-surface'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold">Manage Order {order.id}</h2>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Order Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={order.customerName}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={order.email}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={order.phone}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select
              name="paymentMethod"
              value={order.paymentMethod}
              onChange={handleInputChange}
              className={inputClassName}
            >
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash on Delivery</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-2">Shipping Address</label>
          <textarea
            name="address"
            value={order.address}
            onChange={handleInputChange}
            className={`${inputClassName} h-24`}
          />
        </div>

        {/* Order Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Order Status</label>
            <select
              name="status"
              value={order.status}
              onChange={handleInputChange}
              className={inputClassName}
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
              <option value="Refunded">Refunded</option>
              <option value="Completed">Completed</option>
              <option value="Saved">Saved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payment Status</label>
            <select
              name="paymentReceived"
              value={order.paymentReceived.toString()}
              onChange={(e) => {
                if (order) {
                  setOrder({
                    ...order,
                    paymentReceived: e.target.value === 'true'
                  });
                }
              }}
              className={inputClassName}
            >
              <option value="true">Received</option>
              <option value="false">Pending</option>
            </select>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Order Items</h3>
            <button
              type="button"
              onClick={addItem}
              className={`p-2 border rounded-md ${
                theme === 'dark'
                  ? 'border-gray-800 hover:bg-gray-900'
                  : 'border-shopify-border hover:bg-shopify-surface'
              }`}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className={`p-4 border rounded-md ${
                theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2 relative">
                    <label className="block text-sm font-medium mb-2">Product Name or SKU</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={item.productName}
                        onChange={(e) => handleProductSearch(item.id, e.target.value)}
                        className={inputClassName}
                        placeholder="Type to search products..."
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    
                    {/* Product recommendations dropdown */}
                    {showRecommendations[item.id] && filteredProducts[item.id]?.length > 0 && (
                      <div 
                        ref={el => recommendationsRef.current[item.id] = el}
                        className={`absolute z-10 mt-1 w-full rounded-md shadow-lg ${
                          theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
                        } max-h-60 overflow-auto`}
                      >
                        {filteredProducts[item.id].map(product => (
                          <div 
                            key={product.id}
                            onClick={() => handleSelectProduct(item.id, product)}
                            className={`flex items-center p-3 cursor-pointer ${
                              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                            }`}
                          >
                            <img 
                              src={product.image} 
                              alt={product.title} 
                              className="w-10 h-10 object-cover rounded mr-3"
                            />
                            <div>
                              <div className="font-medium">{product.title}</div>
                              <div className="text-sm text-gray-500">SKU: {product.sku} | ${product.price.toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value))}
                      className={inputClassName}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value))}
                      className={inputClassName}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                {order.items.length > 1 && (
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
        <div className={`p-4 border rounded-md ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <span className="text-xl font-bold">${order.amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={() => navigate('/orders/manage-orders')}
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

export default ManageOrder;