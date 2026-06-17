import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../utils/helpers';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
