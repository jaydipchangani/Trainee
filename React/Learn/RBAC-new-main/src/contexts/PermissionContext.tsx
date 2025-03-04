import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { permissionsAPI, rolesAPI } from '../api/api';
import { Permission, Role } from '../types/types';
import { useAuth } from './AuthContext';

interface PermissionContextType {
  permissions: Permission[];
  roles: Role[];
  loading: boolean;
  updatePermission: (permissionId: number, actions: string[]) => Promise<void>;
  refreshPermissions: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();

  const fetchPermissionsAndRoles = async () => {
    setLoading(true);
    try {
      const [permissionsData, rolesData] = await Promise.all([
        permissionsAPI.getAll(),
        rolesAPI.getAll(),
      ]);
      setPermissions(permissionsData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Error fetching permissions and roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchPermissionsAndRoles();
    }
  }, [authState.isAuthenticated]);

  const updatePermission = async (permissionId: number, actions: string[]) => {
    try {
      const permissionToUpdate = permissions.find(p => p.id === permissionId);
      if (permissionToUpdate) {
        const adminRoleId = roles.find(r => r.name === 'Admin')?.id;
        
        // Only block if admin is trying to modify admin permissions
        if (authState.user?.role === 'Admin' && 
            permissionToUpdate.roleId === adminRoleId) {
          throw new Error('Admin cannot modify their own permissions');
        }

        const updatedPermission = { ...permissionToUpdate, actions };
        await permissionsAPI.update(permissionId, updatedPermission);
        await refreshPermissions();
      }
    } catch (error) {
      console.error('Error updating permission:', error);
      throw error;
    }
  };

  const refreshPermissions = async () => {
    return fetchPermissionsAndRoles();
  };

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        roles,
        loading,
        updatePermission,
        refreshPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};