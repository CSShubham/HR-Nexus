import { createAsyncThunk } from '@reduxjs/toolkit';
import { employeeApi } from '../../api/employeeApi';
import { toast } from 'react-toastify';

export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await employeeApi.getAllEmployees();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchEmployeesWithWorkingStatus = createAsyncThunk(
  'employees/fetchWithWorkingStatus',
  async (_, { rejectWithValue }) => {
    try {
      return await employeeApi.getEmployeesWithWorkingStatus();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ employeeId, data }, { rejectWithValue }) => {
    try {
      const response = await employeeApi.updateEmployee(employeeId, data);
      toast.success('Employee updated successfully!');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const onboardEmployee = createAsyncThunk(
  'employees/onboard',
  async ({ candidateId, data }, { rejectWithValue }) => {
    try {
      const response = await employeeApi.onboardEmployee(candidateId, data);
      toast.success('Employee onboarded successfully!');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const offboardEmployee = createAsyncThunk(
  'employees/offboard',
  async ({ employeeId, data }, { rejectWithValue }) => {
    try {
      const response = await employeeApi.offboardEmployee(employeeId, data);
      toast.success('Offboarding initiated successfully!');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await employeeApi.deleteEmployee(employeeId);
      toast.success('Employee deleted successfully!');
      return { employeeId, ...response };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete employee');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getOffboardingInfo = createAsyncThunk(
  'employees/getOffboardingInfo',
  async (_, { rejectWithValue }) => {
    try {
      return await employeeApi.getOffboardingInfo();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
