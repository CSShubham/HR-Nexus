import { createSlice } from "@reduxjs/toolkit";
import {
  fetchEmployees,
  fetchEmployeesWithWorkingStatus,
  onboardEmployee,
  updateEmployee,
  offboardEmployee,
  deleteEmployee,
  getOffboardingInfo,
} from "./employeeThunks";

const initialState = {
  employees: [],
  loading: false,
  error: null,
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOffboardingInfo: (state) => {
      state.offboardingInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload);
        state.employees = action.payload.employees || action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployeesWithWorkingStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployeesWithWorkingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployeesWithWorkingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmployee.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(onboardEmployee.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(offboardEmployee.fulfilled, (state) => {
        state.loading = false;
      })
            .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted employee from the state
        state.employees = state.employees.filter(
          (emp) => emp._id !== action.payload.employeeId
        );
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOffboardingInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOffboardingInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.offboardingInfo = action.payload;
      })
      .addCase(getOffboardingInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearOffboardingInfo } = employeesSlice.actions;
export default employeesSlice.reducer;
