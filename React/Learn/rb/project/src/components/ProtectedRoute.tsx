import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermission } from '../contexts/PermissionContext';
import { ModuleType, ActionType } from '../types/types';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  children: React.ReactNode;
  module?: ModuleType;
  action?: ActionType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, module, action }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasPermission } = usePermission();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (module && action && !hasPermission(module, action)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;