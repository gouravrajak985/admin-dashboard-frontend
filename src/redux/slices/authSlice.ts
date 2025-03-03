import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  token?: string;
}

interface AuthState {
  user: User | null;
  otpSent: boolean;
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface OtpVerification {
  email: string;
  otp: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const initialState: AuthState = {
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || '{}')
    : null,
  otpSent: false,
  loading: false,
  error: null,
  success: false,
};

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/users/login',
        credentials
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

// Verify OTP
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (verificationData: OtpVerification, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/users/verify-otp',
        verificationData
      );
      
      if (data.token) {
        localStorage.setItem('user', JSON.stringify(data));
      }
      
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

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/users',
        userData
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

// Resend OTP
export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/users/resend-otp',
        { email }
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

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.otpSent = action.payload.otpSent;
        if (!action.payload.otpSent) {
          state.user = action.payload;
        }
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.otpSent = false;
        state.success = true;
      })
      .addCase(verifyOtp.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.otpSent = action.payload.otpSent;
        state.success = true;
      })
      .addCase(register.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
        state.success = true;
      })
      .addCase(resendOtp.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.otpSent = false;
      });
  },
});

export const { clearError, resetSuccess } = authSlice.actions;

export default authSlice.reducer;