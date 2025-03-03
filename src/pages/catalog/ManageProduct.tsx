import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById, updateProduct, clearProductError, resetProductSuccess, clearProductDetails } from '../../redux/slices/productSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { ArrowLeft, Save, Plus, Minus, X } from 'lucide-react';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

interface Tax {
  name: string;
  percentage: number;
}

const ManageProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { product, loading, error, success } = useSelector((state: RootState) => state.products);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [profitPercentage, setProfitPercentage] = useState('');
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [newTaxName, setNewTaxName] = useState('');
  const [newTaxPercentage, setNewTaxPercentage] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [status, setStatus] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [priceWithProfit, setPriceWithProfit] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [weight, setWeight] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
    
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      dispatch(resetProductSuccess());
      navigate('/catalog/manage-products');
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setBasePrice(product.basePrice.toString());
      setProfitPercentage(product.profitPercentage.toString());
      setTaxes(product.taxes || []);
      setStock(product.stock.toString());
      setSku(product.sku);
      setStatus(product.status);
      setImagePreview(product.image);
      setImage(product.image);
      setPriceWithProfit(product.priceWithProfit || 0);
      setFinalPrice(product.finalPrice || 0);
      setBrand(product.brand);
      setCategory(product.category);
      setDimensions(product.dimensions || '');
      setWeight(product.weight || '');
    }
  }, [product]);

  useEffect(() => {
    const basePriceValue = parseFloat(basePrice) || 0;
    const profitValue = basePriceValue * (parseFloat(profitPercentage) / 100);
    const priceWithProfitValue = basePriceValue + profitValue;
    setPriceWithProfit(priceWithProfitValue);
    
    const taxAmount = taxes.reduce((acc, tax) => {
      return acc + (priceWithProfitValue * (tax.percentage / 100));
    }, 0);
    
    setFinalPrice(priceWithProfitValue + taxAmount);
  }, [basePrice, profitPercentage, taxes]);

  const handleAddTax = () => {
    if (newTaxName && newTaxPercentage) {
      setTaxes([
        ...taxes,
        {
          name: newTaxName,
          percentage: parseFloat(newTaxPercentage)
        }
      ]);
      setNewTaxName('');
      setNewTaxPercentage('');
    }
  };

  const handleRemoveTax = (index: number) => {
    setTaxes(taxes.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!id) return;
    
    // Validate form
    if (!name || !image || !brand || !category || !description || !basePrice || !stock || !sku) {
      alert('Please fill in all required fields');
      return;
    }

    const productData = {
      name,
      image,
      brand,
      category,
      description,
      basePrice: parseFloat(basePrice),
      profitPercentage: parseFloat(profitPercentage),
      taxes,
      stock: parseInt(stock),
      sku,
      status,
      dimensions,
      weight
    };

    dispatch(updateProduct({ id, productData }));
  };

  const inputClassName = "w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  if (loading && !product) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="error">{error}</Message>;
  }

  if (!product && !loading) {
    return <Message variant="error">Product not found</Message>;
  }

  return (
    <div className="border rounded-lg">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/catalog/manage-products')}
              className="p-2 mr-4 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold">Manage Product</h2>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {error && <Message variant="error">{error}</Message>}
        {loading && <Loader />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Image</label>
            <div className="border rounded-lg overflow-hidden relative" style={{ height: '300px' }}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <label className="p-2 rounded-full cursor-pointer bg-white dark:bg-gray-800 shadow-md">
                  <Plus className="h-5 w-5" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                {imagePreview && (
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setImage('');
                    }}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className={inputClassName}
                required
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
                <option value="Live">Live</option>
                <option value="Saved">Saved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={inputClassName}
                min="0"
                required
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
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className={inputClassName}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Profit Percentage</label>
              <div className="flex">
                <input
                  type="number"
                  value={profitPercentage}
                  onChange={(e) => setProfitPercentage(e.target.value)}
                  className={`${inputClassName} rounded-r-none`}
                  min="0"
                  step="0.1"
                  required
                />
                <div className="flex items-center justify-center px-4 border border-l-0 rounded-r-md">
                  %
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Price with Profit</label>
              <input
                type="number"
                value={priceWithProfit.toFixed(2)}
                className={`${inputClassName} bg-gray-100 dark:bg-gray-800`}
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">
                Base price + {profitPercentage}% profit
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Final Price (with profit and taxes)</label>
              <input
                type="number"
                value={finalPrice.toFixed(2)}
                className={`${inputClassName} bg-gray-100 dark:bg-gray-800 font-bold`}
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
                className="p-2 border rounded-md col-span-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Tax List */}
            <div className="space-y-2 mt-2">
              {taxes.map((tax, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <span>{tax.name} ({tax.percentage}%)</span>
                  <button
                    onClick={() => handleRemoveTax(index)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClassName} h-32`}
            required
          />
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className={inputClassName}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClassName}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Dimensions</label>
            <input
              type="text"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Weight</label>
            <input
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={() => navigate('/catalog/manage-products')}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            disabled={loading}
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