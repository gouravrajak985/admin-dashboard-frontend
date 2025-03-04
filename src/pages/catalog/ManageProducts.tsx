import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CardContainer } from '@/components/ui/card-container';
import { PageHeader } from '@/components/ui/page-header';
import { SearchInput } from '@/components/ui/search-input';
import { FilterDropdown } from '@/components/ui/filter-dropdown';
import { ActionButton } from '@/components/ui/action-button';
import { IconButton } from '@/components/ui/icon-button';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';

interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
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
    price: 199.99,
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
    price: 49.99,
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
    price: 159.99,
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
    price: 299.99,
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

const ManageProducts = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleManageProduct = (productId: number) => {
    navigate(`/catalog/manage-product/${productId}`);
  };

  const columns = [
    {
      header: 'Product',
      accessor: (product: Product) => (
        <div className="flex items-center">
          <img
            className="h-16 w-16 object-cover rounded-md border dark:border-gray-800"
            src={product.image}
            alt={product.title}
          />
          <div className="ml-4">
            <div className="font-medium">{product.title}</div>
          </div>
        </div>
      )
    },
    {
      header: 'SKU',
      accessor: 'sku',
      className: 'text-shopify-text-secondary'
    },
    {
      header: 'Price',
      accessor: (product: Product) => `$${product.price.toFixed(2)}`,
      className: 'text-shopify-text-secondary'
    },
    {
      header: 'Stock',
      accessor: (product: Product) => (
        <span className={`${product.stock < 10 ? 'text-red-500' : 'text-shopify-text-secondary'}`}>
          {product.stock} units
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (product: Product) => (
        <StatusBadge status={product.status} />
      )
    },
    {
      header: 'Actions',
      accessor: (product: Product) => (
        <div className="flex space-x-3">
          <IconButton 
            icon={ExternalLink} 
            tooltip="View Product"
          />
          <IconButton 
            icon={Edit} 
            tooltip="Manage Product"
            onClick={(e) => {
              e.stopPropagation();
              handleManageProduct(product.id);
            }}
          />
          <IconButton 
            icon={Trash2} 
            tooltip="Delete Product"
            className="text-red-500"
          />
        </div>
      )
    }
  ];

  return (
    <CardContainer>
      <PageHeader title="Manage Products" backLink="/home">
        <div className="flex-1 w-full md:w-auto">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search products..."
          />
        </div>
        <div className="flex space-x-4 w-full md:w-auto">
          <FilterDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'Live', label: 'Live' },
              { value: 'Saved', label: 'Saved' }
            ]}
            placeholder="All Status"
          />
          <ActionButton 
            variant="primary"
            onClick={() => navigate('/catalog/new-product')}
          >
            Add New Product
          </ActionButton>
        </div>
      </PageHeader>

      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredProducts}
          keyField="id"
          onRowClick={(product) => handleManageProduct(product.id)}
          emptyMessage="No products found. Try adjusting your search or filters."
        />
      </div>
    </CardContainer>
  );
};

export default ManageProducts;