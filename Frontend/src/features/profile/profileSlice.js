import { createSlice } from "@reduxjs/toolkit";
import { fetchMyProfile, updateMyProfile } from "./profileThunks";

const initialState = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  updateSuccess: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateMyProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.profile = action.payload.employee; // ✅ FIX
        state.updateSuccess = true;
        state.updateError = null;
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      });
  },
});

export const { clearUpdateStatus } = profileSlice.actions;
export default profileSlice.reducer;
