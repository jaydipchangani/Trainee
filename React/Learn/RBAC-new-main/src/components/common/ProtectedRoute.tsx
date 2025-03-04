import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRouteProps } from '../../types/types';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredPermission }) => {
  const { authState, hasPermission, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredPermission && !hasPermission(requiredPermission.module, requiredPermission.action)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;