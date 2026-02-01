import { createSlice } from '@reduxjs/toolkit';
import { createAnnouncement, fetchAnnouncements } from './announcementsThunks';

const initialState = {
  announcements: [],
  loading: false,
  error: null,
};

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAnnouncement.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAnnouncement.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = announcementsSlice.actions;
export default announcementsSlice.reducer;
