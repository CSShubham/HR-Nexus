
// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import employeesReducer from '../features/employees/employeeSlice';
import candidatesReducer from '../features/candidates/candidatesSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';
import leavesReducer from '../features/leaves/leavesSlice';
import announcementsReducer from '../features/announcements/announcementsSlice';
import profileReducer from '../features/profile/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeesReducer,
    candidates: candidatesReducer,
    attendance: attendanceReducer,
    leaves: leavesReducer,
    announcements: announcementsReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});