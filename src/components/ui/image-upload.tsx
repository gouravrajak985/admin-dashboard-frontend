import React, { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ImageUploadProps {
  imagePreview: string | null;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
  className?: string;
}

export function ImageUpload({ 
  imagePreview, 
  onImageUpload, 
  onImageRemove,
  className 
}: ImageUploadProps) {
  const { theme } = useTheme();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <label className="block text-sm font-medium mb-2">Product Image</label>
      <div className="flex items-center space-x-4">
        <div className={`w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center ${
          theme === 'dark' ? 'border-gray-800' : 'border-shopify-border'
        }`}>
          {imagePreview ? (
            <div className="relative w-full h-full">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={onImageRemove}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Plus className="w-8 h-8 text-shopify-text-secondary" />
            </label>
          )}
        </div>
        <div className="text-sm text-shopify-text-secondary">
          <p>Upload a product image</p>
          <p>Recommended size: 800x800px</p>
        </div>
      </div>
    </div>
  );
}