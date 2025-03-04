import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Plus, Minus, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CardContainer } from '@/components/ui/card-container';
import { PageHeader } from '@/components/ui/page-header';
import { FormInput } from '@/components/ui/form-input';
import { FormTextarea } from '@/components/ui/form-textarea';
import { FormSelect } from '@/components/ui/form-select';
import { ActionButton } from '@/components/ui/action-button';
import { ImageUpload } from '@/components/ui/image-upload';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Tax {
  id: string;
  name: string;
  percentage: number;
}

const NewProduct = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [profitPercentage, setProfitPercentage] = useState('20');
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [newTaxName, setNewTaxName] = useState('');
  const [newTaxPercentage, setNewTaxPercentage] = useState('');
  const [stock, setStock] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [priceWithProfit, setPriceWithProfit] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [weight, setWeight] = useState('');

  React.useEffect(() => {
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
          id: Date.now().toString(),
          name: newTaxName,
          percentage: parseFloat(newTaxPercentage)
        }
      ]);
      setNewTaxName('');
      setNewTaxPercentage('');
    }
  };

  const handleRemoveTax = (id: string) => {
    setTaxes(taxes.filter(tax => tax.id !== id));
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (status: 'draft' | 'published') => {
    // Handle save logic here
    console.log({
      title,
      description,
      basePrice: parseFloat(basePrice),
      profitPercentage: parseFloat(profitPercentage),
      priceWithProfit,
      taxes,
      finalPrice,
      stock: parseInt(stock),
      brand,
      category,
      dimensions,
      weight,
      status
    });
  };

  const inputClassName = `w-full p-3 border rounded-md ${
    theme === 'dark'
      ? 'bg-gray-900 border-gray-800'
      : 'bg-white border-shopify-border'
  } focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-gray-600' : 'focus:ring-shopify-focus'} focus:border-shopify-focus`;

  return (
    <CardContainer>
      <PageHeader title="New Product" backLink="/catalog/manage-products" />

      <div className="p-6 space-y-6">
        {/* Product Image Upload */}
        <ImageUpload
          imagePreview={imagePreview}
          onImageUpload={handleImageUpload}
          onImageRemove={() => setImagePreview(null)}
        />

        {/* Basic Information */}
        <div className="space-y-4">
          <FormInput
            label="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter product title"
          />

          <FormTextarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            className="h-32 resize-none"
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
          />

          <div>
            <label className="block text-sm font-medium mb-1">Profit Percentage</label>
            <div className="flex">
              <input
                type="number"
                value={profitPercentage}
                onChange={(e) => setProfitPercentage(e.target.value)}
                className={`${inputClassName} rounded-r-none`}
                placeholder="20"
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
            <label className="block text-sm font-medium mb-1">Price with Profit</label>
            <input
              type="number"
              value={priceWithProfit.toFixed(2)}
              className={`${inputClassName} bg-shopify-surface`}
              disabled
            />
            <p className="mt-1 text-xs text-shopify-text-secondary">
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
            <div className="space-y-2">
              {taxes.map((tax) => (
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
              className={`${inputClassName} bg-shopify-surface font-bold`}
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
        />

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter product category"
          />
          <FormInput
            label="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Enter product brand"
          />
        </div>

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
            onClick={() => handleSave('draft')}
          >
            Save as Draft
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={() => handleSave('published')}
          >
            Publish
          </ActionButton>
        </div>
      </div>
    </CardContainer>
  );
};

export default NewProduct;