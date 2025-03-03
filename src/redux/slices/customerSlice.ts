import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Customer {
  _id?: string;
  customerName: string;
  userName: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'Active' | 'Inactive';
}

interface CustomerState {
  customers: Customer[];
  customer: Customer | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: CustomerState = {
  customers: [],
  customer: null,
  loading: false,
  error: null,
  success: false,
};

// Create customer
export const createCustomer = createAsyncThunk(
  'customers/create',
  async (customerData: Customer, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { user: { token: string } } };
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/customers',
        customerData,
        config
      );
      
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get all customers
export const getCustomers = createAsyncThunk(
  'customers/getAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { user: { token: string } } };
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.get(
        'http://localhost:5000/api/customers',
        config
      );
      
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get customer by ID
export const getCustomerById = createAsyncThunk(
  'customers/getById',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { user: { token: string } } };
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/customers/${id}`,
        config
      );
      
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Update customer
export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, customerData }: { id: string; customerData: Customer }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { user: { token: string } } };
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:5000/api/customers/${id}`,
        customerData,
        config
      );
      
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Delete customer
export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { user: { token: string } } };
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      await axios.delete(
        `http://localhost:5000/api/customers/${id}`,
        config
      );
      
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearCustomerError: (state) => {
      state.error = null;
    },
    resetCustomerSuccess: (state) => {
      state.success = false;
    },
    clearCustomerDetails: (state) => {
      state.customer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create customer
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.loading = false;
        state.success = true;
        state.customers.push(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get all customers
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action: PayloadAction<Customer[]>) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(getCustomers.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get customer by ID
      .addCase(getCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerById.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(getCustomerById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.loading = false;
        state.success = true;
        state.customer = action.payload;
        state.customers = state.customers.map((customer) =>
          customer._id === action.payload._id ? action.payload : customer
        );
      })
      .addCase(updateCustomer.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete customer
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.success = true;
        state.customers = state.customers.filter(
          (customer) => customer._id !== action.payload
        );
      })
      .addCase(deleteCustomer.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCustomerError, resetCustomerSuccess, clearCustomerDetails } = customerSlice.actions;

export default customerSlice.reducer;