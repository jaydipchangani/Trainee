import React, { createContext, useState, useEffect, useContext } from 'react';
import { PermissionContextType, PermissionMap, ModuleType, ActionType, Permission } from '../types/types';
import { permissionsApi } from '../api/api';
import { useAuth } from './AuthContext';

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [permissions, setPermissions] = useState<PermissionMap>({});

  const fetchPermissions = async () => {
    if (!user || !isAuthenticated) {
      setPermissions({});
      return;
    }

    try {
      const userPermissions = await permissionsApi.getByRoleId(user.roleId);
      const permissionMap: PermissionMap = {};

      userPermissions.forEach((permission: Permission) => {
        permissionMap[permission.module] = {};
        permission.actions.forEach((action) => {
          permissionMap[permission.module][action] = true;
        });
      });

      setPermissions(permissionMap);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      setPermissions({});
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [user, isAuthenticated]);

  const hasPermission = (module: ModuleType, action: ActionType): boolean => {
    return Boolean(permissions[module]?.[action]);
  };

  const refreshPermissions = async (): Promise<void> => {
    await fetchPermissions();
  };

  return (
    <PermissionContext.Provider value={{ permissions, hasPermission, refreshPermissions }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};