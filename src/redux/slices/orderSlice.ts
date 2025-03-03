import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  product: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Order {
  createdAt: number;
  _id?: string;
  customer: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentReceived: boolean;
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned' | 'Refunded' | 'Completed' | 'Saved';
}

interface OrderState {
  orders: Order[];
  order: Order | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  success: false,
};

// Create order
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData: Order, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { user: { token: string } } };
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/orders',
        orderData,
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

// Get all orders
export const getOrders = createAsyncThunk(
  'orders/getAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { user: { token: string } } };
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.get(
        'http://localhost:5000/api/orders',
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

// Get order by ID
export const getOrderById = createAsyncThunk(
  'orders/getById',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { user: { token: string } } };
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/orders/${id}`,
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

// Update order
export const updateOrder = createAsyncThunk(
  'orders/update',
  async ({ id, orderData }: { id: string; orderData: Order }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { user: { token: string } } };
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:5000/api/orders/${id}`,
        orderData,
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

// Delete order
export const deleteOrder = createAsyncThunk(
  'orders/delete',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { user: { token: string } } };
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      await axios.delete(
        `http://localhost:5000/api/orders/${id}`,
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

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrderSuccess: (state) => {
      state.success = false;
    },
    clearOrderDetails: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.success = true;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get all orders
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get order by ID
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateOrder.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.success = true;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      })
      .addCase(deleteOrder.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError, resetOrderSuccess, clearOrderDetails } = orderSlice.actions;

export default orderSlice.reducer;