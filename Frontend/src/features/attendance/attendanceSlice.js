import { createSlice } from '@reduxjs/toolkit';
import { punchIn, punchOut, fetchMyAttendance, fetchAllAttendance } from './attendanceThunks';

const initialState = {
  attendanceList: [],
  todayAttendance: null,
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(punchIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(punchIn.fulfilled, (state, action) => {
        state.loading = false;
        state.todayAttendance = action.payload.attendance;
      })
      .addCase(punchIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(punchOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(punchOut.fulfilled, (state, action) => {
        state.loading = false;
        state.todayAttendance = action.payload.attendance;
      })
      .addCase(punchOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceList = action.payload;
      })
      .addCase(fetchMyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceList = action.payload;
      })
      .addCase(fetchAllAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
