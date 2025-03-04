import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Plus, Minus, Save, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  title: string;
  price: number;
  sku: string;
  image: string;
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  productId?: number;
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
  
  // Product search and recommendation states
  const [searchQuery, setSearchQuery] = useState<{[key: string]: string}>({});
  const [showRecommendations, setShowRecommendations] = useState<{[key: string]: boolean}>({});
  const [filteredProducts, setFilteredProducts] = useState<{[key: string]: Product[]}>({});
  
  const recommendationsRef = useRef<{[key: string]: HTMLDivElement | null}>({});

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

  const addItem = () => {
    const newItemId = Date.now().toString();
    setItems([
      ...items,
      {
        id: newItemId,
        productName: '',
        quantity: 1,
        price: 0
      }
    ]);
    
    // Initialize search state for the new item
    setSearchQuery(prev => ({...prev, [newItemId]: ''}));
    setShowRecommendations(prev => ({...prev, [newItemId]: false}));
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
      
      // Clean up search state
      setSearchQuery(prev => {
        const newState = {...prev};
        delete newState[id];
        return newState;
      });
      
      setShowRecommendations(prev => {
        const newState = {...prev};
        delete newState[id];
        return newState;
      });
      
      setFilteredProducts(prev => {
        const newState = {...prev};
        delete newState[id];
        return newState;
      });
    }
  };

  const updateItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleProductSearch = (id: string, value: string) => {
    updateItem(id, 'productName', value);
    setSearchQuery(prev => ({...prev, [id]: value}));
    setShowRecommendations(prev => ({...prev, [id]: true}));
  };

  const handleSelectProduct = (itemId: string, product: Product) => {
    updateItem(itemId, 'productName', product.title);
    updateItem(itemId, 'price', product.price);
    updateItem(itemId, 'productId', product.id);
    setShowRecommendations(prev => ({...prev, [itemId]: false}));
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
    
    navigate('/orders/manage-orders');
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
            onClick={() => navigate('/orders/manage-orders')}
            className={`p-2 mr-4 border rounded-md ${
              theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : 'border-shopify-border hover:bg-shopify-surface'
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
            {items.map((item) => (
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
                        required
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
        <div className={`p-4 border rounded-md ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
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
            className={`px-6 py-3 border rounded-md ${
              theme === 'dark'
                ? 'border-gray-800 hover:bg-gray-900'
                : 'border-shopify-border hover:bg-shopify-surface'
            } flex items-center`}
          >
            <Save className="h-5 w-5 mr-2" />
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
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