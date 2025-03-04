import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Save, Upload, X, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Tax {
  id: string;
  name: string;
  percentage: number;
}

interface Product {
  id: number;
  image: string;
  title: string;
  basePrice: number;
  profitPercentage: number;
  taxes: Tax[];
  priceWithProfit: number;
  finalPrice: number;
  stock: number;
  status: string;
  sku: string;
  description?: string;
  category?: string;
  brand?: string;
  dimensions?: string;
  weight?: string;
}

const products: Product[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80',
    title: 'Premium Headphones',
    basePrice: 150,
    profitPercentage: 33.33,
    taxes: [
      { id: '1', name: 'VAT', percentage: 10 }
    ],
    priceWithProfit: 200,
    finalPrice: 220,
    stock: 45,
    status: 'Live',
    sku: 'HDX-100',
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'Electronics',
    brand: 'AudioTech',
    dimensions: '7.5 x 6.3 x 3.2 inches',
    weight: '0.55 lbs'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=80',
    title: 'Wireless Mouse',
    basePrice: 35,
    profitPercentage: 42.86,
    taxes: [
      { id: '1', name: 'VAT', percentage: 10 }
    ],
    priceWithProfit: 50,
    finalPrice: 55,
    stock: 32,
    status: 'Saved',
    sku: 'WM-200',
    description: 'Ergonomic wireless mouse with precision tracking',
    category: 'Electronics',
    brand: 'TechGear',
    dimensions: '4.5 x 2.8 x 1.5 inches',
    weight: '0.25 lbs'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&q=80',
    title: 'Mechanical Keyboard',
    basePrice: 120,
    profitPercentage: 33.33,
    taxes: [
      { id: '1', name: 'VAT', percentage: 10 }
    ],
    priceWithProfit: 160,
    finalPrice: 176,
    stock: 15,
    status: 'Live',
    sku: 'KB-300',
    description: 'Mechanical gaming keyboard with RGB backlight',
    category: 'Electronics',
    brand: 'GameTech',
    dimensions: '17.3 x 5.1 x 1.4 inches',
    weight: '2.1 lbs'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&q=80',
    title: 'Gaming Monitor',
    basePrice: 250,
    profitPercentage: 20,
    taxes: [
      { id: '1', name: 'VAT', percentage: 10 }
    ],
    priceWithProfit: 300,
    finalPrice: 330,
    stock: 8,
    status: 'Saved',
    sku: 'GM-400',
    description: '27-inch gaming monitor with 144Hz refresh rate',
    category: 'Electronics',
    brand: 'ViewTech',
    dimensions: '24.1 x 21.2 x 7.9 inches',
    weight: '12.3 lbs'
  }
];

const ManageProduct = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newTaxName, setNewTaxName] = useState('');
  const [newTaxPercentage, setNewTaxPercentage] = useState('');

  useEffect(() => {
    // Find the product with the matching ID
    const foundProduct = products.find(p => p.id === Number(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setImagePreview(foundProduct.image);
    } else {
      // Handle case where product is not found
      navigate('/catalog/manage-products');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (product) {
      // Recalculate prices when base price, profit percentage, or taxes change
      const basePriceValue = product.basePrice;
      const profitValue = basePriceValue * (product.profitPercentage / 100);
      const priceWithProfitValue = basePriceValue + profitValue;
      
      const taxAmount = product.taxes.reduce((acc, tax) => {
        return acc + (priceWithProfitValue * (tax.percentage / 100));
      }, 0);
      
      setProduct({
        ...product,
        priceWithProfit: priceWithProfitValue,
        finalPrice: priceWithProfitValue + taxAmount
      });
    }
  }, [product?.basePrice, product?.profitPercentage, product?.taxes]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        if (product) {
          setProduct({ ...product, image: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (product) {
      setProduct({
        ...product,
        [name]: name === 'basePrice' || name === 'profitPercentage' || name === 'stock' 
          ? Number(value) 
          : value
      });
    }
  };

  const handleAddTax = () => {
    if (product && newTaxName && newTaxPercentage) {
      const newTax = {
        id: Date.now().toString(),
        name: newTaxName,
        percentage: parseFloat(newTaxPercentage)
      };
      
      setProduct({
        ...product,
        taxes: [...product.taxes, newTax]
      });
      
      setNewTaxName('');
      setNewTaxPercentage('');
    }
  };

  const handleRemoveTax = (taxId: string) => {
    if (product) {
      setProduct({
        ...product,
        taxes: product.taxes.filter(tax => tax.id !== taxId)
      });
    }
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the product
    console.log('Saving product:', product);
    navigate('/catalog/manage-products');
  };

  if (!product) {
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
              onClick={() => navigate('/catalog/manage-products')}
              className={`p-2 mr-4 border rounded-md ${
                theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : 'border-shopify-border hover:bg-shopify-surface'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold">Manage Product</h2>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Image</label>
            <div className="border rounded-lg overflow-hidden relative" style={{ height: '300px' }}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <label className={`p-2 rounded-full cursor-pointer ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-md`}>
                  <Upload className="h-5 w-5" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                {imagePreview && (
                  <button
                    onClick={() => setImagePreview(null)}
                    className="p-2 bg-red-500 text-white rounded-full shadow-md"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Title</label>
              <input
                type="text"
                name="title"
                value={product.title}
                onChange={handleInputChange}
                className={inputClassName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SKU</label>
              <input
                type="text"
                name="sku"
                value={product.sku}
                onChange={handleInputChange}
                className={inputClassName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={product.status}
                onChange={handleInputChange}
                className={inputClassName}
              >
                <option value="Live">Live</option>
                <option value="Saved">Saved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleInputChange}
                className={inputClassName}
              />
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Base Price (cost price)</label>
              <input
                type="number"
                name="basePrice"
                value={product.basePrice}
                onChange={handleInputChange}
                className={inputClassName}
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Profit Percentage</label>
              <div className="flex">
                <input
                  type="number"
                  name="profitPercentage"
                  value={product.profitPercentage}
                  onChange={handleInputChange}
                  className={`${inputClassName} rounded-r-none`}
                  min="0"
                  step="0.1"
                />
                <div className={`flex items-center justify-center px-4 border border-l-0 rounded-r-md ${
                  theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-shopify-border'
                }`}>
                  %
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Price with Profit</label>
              <input
                type="number"
                value={product.priceWithProfit.toFixed(2)}
                className={`${inputClassName} bg-shopify-surface`}
                disabled
              />
              <p className="mt-1 text-xs text-shopify-text-secondary">
                Base price + {product.profitPercentage}% profit
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Final Price (with profit and taxes)</label>
              <input
                type="number"
                value={product.finalPrice.toFixed(2)}
                className={`${inputClassName} bg-shopify-surface font-bold`}
                disabled
              />
            </div>
          </div>
          
          {/* Taxes */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Taxes (applied on price with profit)</label>
            <div className="grid grid-cols-12 gap-2">
              <input
                type="text"
                value={newTaxName}
                onChange={(e) => setNewTaxName(e.target.value)}
                className={`${inputClassName} col-span-7`}
                placeholder="Tax name"
              />
              <input
                type="number"
                value={newTaxPercentage}
                onChange={(e) => setNewTaxPercentage(e.target.value)}
                className={`${inputClassName} col-span-4`}
                placeholder="Percentage"
                min="0"
                step="0.01"
              />
              <button
                onClick={handleAddTax}
                className={`p-2 border rounded-md col-span-1 ${
                  theme === 'dark'
                    ? 'border-gray-800 hover:bg-gray-900'
                    : 'border-shopify-border hover:bg-shopify-surface'
                }`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Tax List */}
            <div className="space-y-2 mt-2">
              {product.taxes.map((tax) => (
                <div
                  key={tax.id}
                  className={`flex items-center justify-between p-2 border rounded-md ${
                    theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
                  }`}
                >
                  <span>{tax.name} ({tax.percentage}%)</span>
                  <button
                    onClick={() => handleRemoveTax(tax.id)}
                    className="text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={product.description || ''}
            onChange={handleInputChange}
            className={`${inputClassName} h-32`}
          />
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={product.category || ''}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <input
              type="text"
              name="brand"
              value={product.brand || ''}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Dimensions</label>
            <input
              type="text"
              name="dimensions"
              value={product.dimensions || ''}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Weight</label>
            <input
              type="text"
              name="weight"
              value={product.weight || ''}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={() => navigate('/catalog/manage-products')}
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

export default ManageProduct;