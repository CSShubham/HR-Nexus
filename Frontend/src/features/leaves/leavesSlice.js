import { createSlice } from "@reduxjs/toolkit";
import {
  applyLeave,
  fetchMyLeaves,
  fetchAllLeaves,
  updateLeaveStatus,
} from "./leavesThunks";

const initialState = {
  leaves: [],
  loading: false,
  error: null,
  page: 1,
  pages: 1,
  total: 0,
};

const leavesSlice = createSlice({
  name: "leaves",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyLeave.pending, (state) => {
        state.loading = true;
      })
      .addCase(applyLeave.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyLeaves.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
      })
      .addCase(fetchMyLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllLeaves.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload.leaves;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(fetchAllLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateLeaveStatus.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { clearError } = leavesSlice.actions;
export default leavesSlice.reducer;
