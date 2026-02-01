import { createAsyncThunk } from '@reduxjs/toolkit';
import { attendanceApi } from '../../api/attendanceApi';
import { toast } from 'react-toastify';

export const punchIn = createAsyncThunk(
  'attendance/punchIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.punchIn();
      toast.success('Punched in successfully!');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const punchOut = createAsyncThunk(
  'attendance/punchOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.punchOut();
      toast.success('Punched out successfully!');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchMyAttendance = createAsyncThunk(
  'attendance/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      return await attendanceApi.getMyAttendance();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchAllAttendance = createAsyncThunk(
  'attendance/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await attendanceApi.getAllAttendance();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);