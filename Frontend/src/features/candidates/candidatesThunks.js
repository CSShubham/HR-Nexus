import { createAsyncThunk } from '@reduxjs/toolkit';
import { candidateApi } from '../../api/candidateApi';
import { toast } from 'react-toastify';

export const fetchCandidates = createAsyncThunk(
  'candidates/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await candidateApi.getAllCandidates();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateCandidateStatus = createAsyncThunk(
  'candidates/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await candidateApi.updateCandidateStatus(id, { status });
      toast.success('Candidate status updated!');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const applyCandidate = createAsyncThunk(
  'candidates/apply',
  async (data, { rejectWithValue }) => {
    try {
      const response = await candidateApi.applyCandidate(data);
      toast.success('Application submitted successfully!');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


