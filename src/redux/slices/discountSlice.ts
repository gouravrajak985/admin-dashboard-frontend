import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Discount {
  _id?: string;
  code: string;
  type: 'discount_code' | 'coupon_codes';
  value: number;
  valueType: 'percentage' | 'fixed';
  minPurchaseAmount?: number;
  maxUses?: number;
  usageCount?: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Scheduled';
  description?: string;
}

interface DiscountState {
  discounts: Discount[];
  discount: Discount | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: DiscountState = {
  discounts: [],
  discount: null,
  loading: false,
  error: null,
  success: false,
};

// Create discount
export const createDiscount = createAsyncThunk(
  'discounts/create',
  async (discountData: Discount, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { user: { token: string } } };
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/discounts',
        discountData,
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

// Get all discounts
export const getDiscounts = createAsyncThunk(
  'discounts/getAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { user: { token: string } } };
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.get(
        'http://localhost:5000/api/discounts',
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

// Get discount by ID
export const getDiscountById = createAsyncThunk(
  'discounts/getById',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { user: { token: string } } };
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/discounts/${id}`,
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

// Update discount
export const updateDiscount = createAsyncThunk(
  'discounts/update',
  async ({ id, discountData }: { id: string; discountData: Discount }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { user: { token: string } } };
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:5000/api/discounts/${id}`,
        discountData,
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

// Delete discount
export const deleteDiscount = createAsyncThunk(
  'discounts/delete',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { user: { token: string } } };
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };

      await axios.delete(
        `http://localhost:5000/api/discounts/${id}`,
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

const discountSlice = createSlice({
  name: 'discounts',
  initialState,
  reducers: {
    clearDiscountError: (state) => {
      state.error = null;
    },
    resetDiscountSuccess: (state) => {
      state.success = false;
    },
    clearDiscountDetails: (state) => {
      state.discount = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create discount
      .addCase(createDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDiscount.fulfilled, (state, action: PayloadAction<Discount>) => {
        state.loading = false;
        state.success = true;
        state.discounts.push(action.payload);
      })
      .addCase(createDiscount.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get all discounts
      .addCase(getDiscounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDiscounts.fulfilled, (state, action: PayloadAction<Discount[]>) => {
        state.loading = false;
        state.discounts = action.payload;
      })
      .addCase(getDiscounts.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get discount by ID
      .addCase(getDiscountById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDiscountById.fulfilled, (state, action: PayloadAction<Discount>) => {
        state.loading = false;
        state.discount = action.payload;
      })
      .addCase(getDiscountById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update discount
      .addCase(updateDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDiscount.fulfilled, (state, action: PayloadAction<Discount>) => {
        state.loading = false;
        state.success = true;
        state.discount = action.payload;
        state.discounts = state.discounts.map((discount) =>
          discount._id === action.payload._id ? action.payload : discount
        );
      })
      .addCase(updateDiscount.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete discount
      .addCase(deleteDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDiscount.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.success = true;
        state.discounts = state.discounts.filter(
          (discount) => discount._id !== action.payload
        );
      })
      .addCase(deleteDiscount.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDiscountError, resetDiscountSuccess, clearDiscountDetails } = discountSlice.actions;

export default discountSlice.reducer;