import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoutes';
import LoginPage from '../pages/auth/LoginPage';
import HRRoutes from './HRRoutes';
import EmployeeRoutes from './EmployeeRoutes';
import NotFoundPage from '../pages/public/NotFoundPage';
import HomePage from '../pages/public/HomePage';
import ApplyPage from '../pages/public/ApplyPage';
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {/* <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} /> */}
      <Route path="/" element={<HomePage />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* HR Routes */}
      <Route
        path="/hr/*"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <HRRoutes />
          </ProtectedRoute>
        }
      />

      {/* Employee Routes */}
      <Route
        path="/employee/*"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <EmployeeRoutes />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;