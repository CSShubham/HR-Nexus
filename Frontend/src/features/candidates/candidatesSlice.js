import { createSlice } from '@reduxjs/toolkit';
import { fetchCandidates, updateCandidateStatus, applyCandidate } from './candidatesThunks';

const initialState = {
  candidates: [],
  loading: false,
  error: null,
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCandidateStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(applyCandidate.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { clearError } = candidatesSlice.actions;
export default candidatesSlice.reducer;
