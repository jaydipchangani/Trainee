import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface PermissionGuardProps {
  module: string;
  action: string;
  children: ReactNode;
  fallback?: ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  module,
  action,
  children,
  fallback = null,
}) => {
  const { hasPermission } = useAuth();
  
  if (hasPermission(module, action)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

export default PermissionGuard;