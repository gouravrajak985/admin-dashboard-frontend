# Backend Integration Guide for Avirrav Ecommerce Admin Dashboard

This guide provides step-by-step instructions for integrating your backend with the frontend React application.

## Table of Contents
1. [Environment Setup](#1-environment-setup)
2. [API Configuration](#2-api-configuration)
3. [Authentication Integration](#3-authentication-integration)
4. [Redux Integration](#4-redux-integration)
5. [Module-wise Integration](#5-module-wise-integration)
6. [Error Handling](#6-error-handling)
7. [Testing](#7-testing)

## 1. Environment Setup

### 1.1 Create Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=development
```

### 1.2 Update API Base URL
Create a new file `src/config/axios.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 2. API Configuration

### 2.1 Create API Services
Create separate service files for each module in `src/services/`:

```typescript
// src/services/auth.service.ts
import api from '../config/axios';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resendOTP: (email) => api.post('/auth/resend-otp', { email }),
};

// src/services/product.service.ts
import api from '../config/axios';

export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Create similar service files for customers, orders, and discounts
```

## 3. Authentication Integration

### 3.1 Update Auth Redux Slice
Update the auth slice to use the API services:

```typescript
// src/redux/slices/authSlice.ts
import { authService } from '../../services/auth.service';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const { data } = await authService.login(credentials);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update other auth actions similarly
```

### 3.2 Implement Protected Routes
Update the ProtectedRoute component:

```typescript
// src/components/ProtectedRoute.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  
  return user ? children : null;
};
```

## 4. Redux Integration

### 4.1 Update Redux Store
Ensure proper TypeScript types for the store:

```typescript
// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    customers: customerReducer,
    orders: orderReducer,
    discounts: discountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## 5. Module-wise Integration

### 5.1 Products Integration
Update the products components to use Redux actions:

```typescript
// src/pages/catalog/ManageProducts.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getProducts, deleteProduct } from '../../redux/slices/productSlice';

const ManageProducts = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProduct(id));
    }
  };

  if (loading) return <Loader />;

  // Rest of the component code
};
```

### 5.2 Form Handling
Implement proper form handling with validation:

```typescript
// Example for NewProduct.tsx
import { useState } from 'react';
import { useAppDispatch } from '../../redux/store';
import { createProduct } from '../../redux/slices/productSlice';

const NewProduct = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    // other fields
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await dispatch(createProduct(formData)).unwrap();
        navigate('/catalog/manage-products');
      } catch (error) {
        setErrors({ submit: error.message });
      }
    }
  };

  // Rest of the component code
};
```

## 6. Error Handling

### 6.1 Global Error Handler
Create a global error handling component:

```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-600">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 6.2 API Error Handling
Create a utility for handling API errors:

```typescript
// src/utils/errorHandler.ts
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'No response from server';
  } else {
    // Other errors
    return error.message || 'An error occurred';
  }
};
```

## 7. Testing

### 7.1 API Integration Testing
Create tests for API integration:

```typescript
// src/services/__tests__/auth.service.test.ts
import { authService } from '../auth.service';
import api from '../../config/axios';

jest.mock('../../config/axios');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully', async () => {
    const mockResponse = { data: { token: 'test-token' } };
    (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const credentials = { email: 'test@example.com', password: 'password' };
    const response = await authService.login(credentials);

    expect(api.post).toHaveBeenCalledWith('/auth/login', credentials);
    expect(response).toEqual(mockResponse);
  });
});
```

### 7.2 Component Integration Testing
Test components with API integration:

```typescript
// src/pages/catalog/__tests__/ManageProducts.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';
import ManageProducts from '../ManageProducts';
import { getProducts } from '../../../redux/slices/productSlice';

jest.mock('../../../redux/slices/productSlice');

describe('ManageProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and display products', async () => {
    const mockProducts = [
      { id: 1, name: 'Test Product', price: 99.99 }
    ];
    
    (getProducts as jest.Mock).mockResolvedValueOnce({ payload: mockProducts });

    render(
      <Provider store={store}>
        <ManageProducts />
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });
});
```

## Additional Considerations

1. **Caching Strategy**
   - Implement caching for frequently accessed data
   - Use React Query or RTK Query for better cache management

2. **Performance Optimization**
   - Implement lazy loading for routes
   - Use pagination for large data sets
   - Optimize API calls with debouncing/throttling

3. **Security**
   - Implement CSRF protection
   - Sanitize user inputs
   - Use HTTPS in production
   - Implement rate limiting

4. **Monitoring**
   - Add error tracking (e.g., Sentry)
   - Implement performance monitoring
   - Add analytics tracking

5. **Deployment**
   - Set up CI/CD pipeline
   - Configure environment variables for different environments
   - Implement health checks

## Common Issues and Solutions

1. **CORS Issues**
   ```typescript
   // Backend (Node.js/Express)
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```

2. **Token Expiration**
   - Implement token refresh mechanism
   - Handle expired token scenarios gracefully

3. **Form Data Handling**
   - Use FormData for file uploads
   - Implement proper validation
   - Handle multipart/form-data correctly

4. **State Management**
   - Keep Redux store normalized
   - Implement proper loading states
   - Handle error states consistently

## Best Practices

1. **Code Organization**
   - Keep related code together
   - Use feature-based folder structure
   - Maintain consistent naming conventions

2. **Type Safety**
   - Use TypeScript interfaces for API responses
   - Implement proper type checking
   - Use type guards where necessary

3. **Error Handling**
   - Implement proper error boundaries
   - Log errors appropriately
   - Show user-friendly error messages

4. **Testing**
   - Write unit tests for critical functionality
   - Implement integration tests
   - Use proper test coverage

5. **Performance**
   - Implement proper loading states
   - Use proper caching strategies
   - Optimize bundle size

## Conclusion

This guide provides a comprehensive approach to integrating your backend with the frontend React application. Follow these steps and best practices to ensure a robust and maintainable integration. Remember to:

- Keep security in mind
- Handle errors gracefully
- Test thoroughly
- Monitor performance
- Follow best practices
- Document your code

For any specific issues or questions, refer to the respective documentation or reach out to the development team.