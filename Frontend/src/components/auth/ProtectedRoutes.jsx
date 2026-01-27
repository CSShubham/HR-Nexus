import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

   if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    if (role === 'hr') {
      return <Navigate to="/hr/dashboard" replace />;
    } else if (role === 'employee') {
      return <Navigate to="/employee/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;