import { createAsyncThunk } from '@reduxjs/toolkit';
import { profileApi } from '../../api/profileApi';
import { toast } from 'react-toastify';

export const fetchMyProfile = createAsyncThunk(
  'profile/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      return await profileApi.getMyProfile();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateMyProfile = createAsyncThunk(
  'profile/update',
  async (data, { rejectWithValue }) => {
    try {
      const response = await profileApi.updateMyProfile(data);
      toast.success('Profile updated successfully!');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);