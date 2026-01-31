import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import { toast } from 'react-toastify';

export const loginHR = createAsyncThunk(
  'auth/loginHR',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.loginHR(credentials);
      toast.success('Login successful!');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const loginEmployee = createAsyncThunk(
  'auth/loginEmployee',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.loginEmployee(credentials);
      toast.success('Login successful!');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerHR = createAsyncThunk(
  'auth/registerHR',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.registerHR(data);
      toast.success('Registration successful!');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);