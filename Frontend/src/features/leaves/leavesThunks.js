import { createAsyncThunk } from '@reduxjs/toolkit';
import { leaveApi } from '../../api/leaveApi';
import { toast } from 'react-toastify';

export const applyLeave = createAsyncThunk(
  'leaves/apply',
  async (data, { rejectWithValue }) => {
    try {
      const response = await leaveApi.applyLeave(data);
      toast.success('Leave applied successfully!');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchMyLeaves = createAsyncThunk(
  'leaves/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      return await leaveApi.getMyLeaves();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchAllLeaves = createAsyncThunk(
  'leaves/fetchAll',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      return await leaveApi.getAllLeaves(page, limit);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateLeaveStatus = createAsyncThunk(
  'leaves/updateStatus',
  async ({ id, status, remarks }, { rejectWithValue }) => {
    try {
      const response = await leaveApi.updateLeaveStatus(id, { status, remarks });
      toast.success(`Leave ${status} successfully!`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);