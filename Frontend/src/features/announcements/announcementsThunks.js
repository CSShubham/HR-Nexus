import { createAsyncThunk } from '@reduxjs/toolkit';
import { announcementApi } from '../../api/announcementApi';
import { toast } from 'react-toastify';

export const createAnnouncement = createAsyncThunk(
  'announcements/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await announcementApi.createAnnouncement(data);
      toast.success('Announcement created successfully!');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await announcementApi.getAnnouncements();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteAnnouncement = createAsyncThunk(
  'announcements/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await announcementApi.deleteAnnouncement(id);
      toast.success('Announcement deleted successfully!');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
export const updateAnnouncement = createAsyncThunk(
  'announcements/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await announcementApi.updateAnnouncement(id, data);
      toast.success('Announcement updated successfully!');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);