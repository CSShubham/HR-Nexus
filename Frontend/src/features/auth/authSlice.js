import { createSlice } from '@reduxjs/toolkit';
import { loginHR, loginEmployee, registerHR } from './authThunks';

const initialState = {

  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
  
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login HR
    builder
      .addCase(loginHR.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginHR.fulfilled, (state, action) => {
        state.loading = false;
        // console.log('Login HR fulfilled with payload:', action.payload);
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', action.payload.role);
      })
      .addCase(loginHR.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login Employee
    builder
      .addCase(loginEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', action.payload.role);
      })
      .addCase(loginEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register HR
    builder
      .addCase(registerHR.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerHR.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = 'hr';
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', 'hr');
      })
      .addCase(registerHR.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;