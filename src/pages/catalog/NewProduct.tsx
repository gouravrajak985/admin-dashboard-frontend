import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, clearProductError, resetProductSuccess } from '../../redux/slices/productSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Plus, Minus, Save } from 'lucide-react';
import { CardContainer } from '@/components/ui/card-container';
import { PageHeader } from '@/components/ui/page-header';
import { FormInput } from '@/components/ui/form-input';
import { FormTextarea } from '@/components/ui/form-textarea';
import { FormSelect } from '@/components/ui/form-select';
import { ActionButton } from '@/components/ui/action-button';
import { ImageUpload } from '@/components/ui/image-upload';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

interface Tax {
  name: string;
  percentage: number;
}

const NewProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [profitPercentage, setProfitPercentage] = useState('20');
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [newTaxName, setNewTaxName] = useState('');
  const [newTaxPercentage, setNewTaxPercentage] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [status, setStatus] = useState('Saved');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [priceWithProfit, setPriceWithProfit] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [weight, setWeight] = useState('');
  const [image, setImage] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { loading, error, success } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    // Clear any previous errors and success state
    dispatch(clearProductError());
    dispatch(resetProductSuccess());
  }, [dispatch]);

  useEffect(() => {
    // Redirect after successful product creation
    if (success) {
      navigate('/catalog/manage-products');
    }
  }, [success, navigate]);

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

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setImage('');
  };

  const handleSubmit = (submitStatus: 'Live' | 'Saved') => {
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
      status: submitStatus,
      dimensions,
      weight
    };

    dispatch(createProduct(productData));
  };

  return (
    <CardContainer>
      <PageHeader title="New Product" backLink="/catalog/manage-products" />

      <div className="p-6 space-y-6">
        {error && <Message variant="error">{error}</Message>}
        {loading && <Loader />}

        {/* Product Image Upload */}
        <ImageUpload
          imagePreview={imagePreview}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
        />

        {/* Basic Information */}
        <div className="space-y-4">
          <FormInput
            label="Product Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product title"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Enter brand name"
              required
            />
            
            <FormInput
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter product category"
              required
            />
          </div>

          <FormInput
            label="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Enter product SKU"
            required
          />

          <FormTextarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            className="h-32 resize-none"
            required
          />
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <FormInput
            label="Base Price (cost price)"
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />

          <div>
            <label className="block text-sm font-medium mb-1">Profit Percentage</label>
            <div className="flex">
              <input
                type="number"
                value={profitPercentage}
                onChange={(e) => setProfitPercentage(e.target.value)}
                className="w-full p-3 border rounded-md rounded-r-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="20"
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
            <label className="block text-sm font-medium mb-1">Price with Profit</label>
            <input
              type="number"
              value={priceWithProfit.toFixed(2)}
              className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-800"
              disabled
            />
            <p className="mt-1 text-xs text-gray-500">
              Base price + {profitPercentage}% profit
            </p>
          </div>

          {/* Taxes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Taxes (applied on price with profit)</label>
            <div className="grid grid-cols-12 gap-2">
              <input
                type="text"
                value={newTaxName}
                onChange={(e) => setNewTaxName(e.target.value)}
                className="col-span-7 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tax name"
              />
              <input
                type="number"
                value={newTaxPercentage}
                onChange={(e) => setNewTaxPercentage(e.target.value)}
                className="col-span-4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Percentage"
                min="0"
                step="0.01"
              />
              <button
                type="button"
                onClick={handleAddTax}
                className="col-span-1 p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Tax List */}
            <div className="space-y-2">
              {taxes.map((tax, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <span>{tax.name} ({tax.percentage}%)</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTax(index)}
                    className="text-red-500"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Final Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Final Price (with profit and taxes)</label>
            <input
              type="number"
              value={finalPrice.toFixed(2)}
              className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-800 font-bold"
              disabled
            />
          </div>
        </div>

        {/* Stock */}
        <FormInput
          label="Initial Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="0"
          min="0"
          required
        />

        {/* Status */}
        <FormSelect
          label="Status"
          value={status}
          onChange={(value) => setStatus(value)}
          options={[
            { value: 'Live', label: 'Live' },
            { value: 'Saved', label: 'Saved' }
          ]}
        />

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Dimensions"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            placeholder="e.g., 10 x 5 x 2 inches"
          />
          <FormInput
            label="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g., 2.5 lbs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <ActionButton
            onClick={() => handleSubmit('Saved')}
            disabled={loading}
          >
            Save as Draft
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={() => handleSubmit('Live')}
            disabled={loading}
          >
            Publish
          </ActionButton>
        </div>
      </div>
    </CardContainer>
  );
};

export default NewProduct;