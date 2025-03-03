import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, deleteProduct, clearProductError, resetProductSuccess } from '../../redux/slices/productSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import { CardContainer } from '@/components/ui/card-container';
import { PageHeader } from '@/components/ui/page-header';
import { SearchInput } from '@/components/ui/search-input';
import { FilterDropdown } from '@/components/ui/filter-dropdown';
import { ActionButton } from '@/components/ui/action-button';
import { IconButton } from '@/components/ui/icon-button';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

const ManageProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { products, loading, error, success } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(resetProductSuccess());
    }
  }, [success, dispatch]);

  const handleManageProduct = (productId: string) => {
    navigate(`/catalog/manage-product/${productId}`);
  };

  const handleDeleteClick = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete));
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Product',
      accessor: (product: any) => (
        <div className="flex items-center">
          <img
            className="h-16 w-16 object-cover rounded-md border dark:border-gray-800"
            src={product.image}
            alt={product.name}
          />
          <div className="ml-4">
            <div className="font-medium">{product.name}</div>
          </div>
        </div>
      )
    },
    {
      header: 'SKU',
      accessor: 'sku',
      className: 'text-gray-500'
    },
    {
      header: 'Price',
      accessor: (product: any) => `$${product.finalPrice.toFixed(2)}`,
      className: 'text-gray-500'
    },
    {
      header: 'Stock',
      accessor: (product: any) => (
        <span className={`${product.stock < 10 ? 'text-red-500' : 'text-gray-500'}`}>
          {product.stock} units
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (product: any) => (
        <StatusBadge status={product.status} />
      )
    },
    {
      header: 'Actions',
      accessor: (product: any) => (
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
              handleManageProduct(product._id);
            }}
          />
          <IconButton 
            icon={Trash2} 
            tooltip="Delete Product"
            className="text-red-500"
            onClick={(e) => handleDeleteClick(product._id, e)}
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

      <div className="p-6">
        {error && <Message variant="error">{error}</Message>}
        {loading ? (
          <Loader />
        ) : (
          <DataTable
            columns={columns}
            data={filteredProducts}
            keyField="_id"
            onRowClick={(product) => handleManageProduct(product._id)}
            emptyMessage="No products found. Try adjusting your search or filters."
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </CardContainer>
  );
};

export default ManageProducts;