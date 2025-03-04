import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, permissionsAPI, rolesAPI } from '../api/api';
import { verifyPassword, generateToken, verifyToken, createPermissionMatrix } from '../utils/auth';
import { AuthState, LoginCredentials, User, Permission, PermissionMatrix } from '../types/types';

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasPermission: (module: string, action: string) => boolean;
  loading: boolean;
}

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  permissions: [],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [permissionMatrix, setPermissionMatrix] = useState<PermissionMatrix>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = await verifyToken(token);
          const userId = Number(payload.sub);
          
          // Fetch user data
          const response = await authAPI.login({ email: payload.email, password: '' });
          const user = response[0];
          
          if (user) {
            // Fetch role
            const roles = await rolesAPI.getAll();
            const userRole = roles.find(role => role.name === user.role);
            
            if (userRole) {
              // Fetch permissions
              const permissions = await permissionsAPI.getByRoleId(userRole.id);
              
              setAuthState({
                user,
                token,
                isAuthenticated: true,
                permissions,
              });
              
              setPermissionMatrix(createPermissionMatrix(permissions));
            }
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for changes to localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token' && !event.newValue) {
        logout();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const users = await authAPI.login(credentials);
      
      if (users.length === 0) {
        throw new Error('Invalid email or password');
      }
      
      const user = users[0] as User;
      const isPasswordValid = await verifyPassword(credentials.password, user.password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }
      
      // Generate token
      const token = await generateToken(user);
      localStorage.setItem('token', token);
      
      // Fetch roles
      const roles = await rolesAPI.getAll();
      const userRole = roles.find(role => role.name === user.role);
      
      if (!userRole) {
        throw new Error('User role not found');
      }
      
      // Fetch permissions
      const permissions = await permissionsAPI.getByRoleId(userRole.id);
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        permissions,
      });
      
      setPermissionMatrix(createPermissionMatrix(permissions));
      
      // Check if user has access to dashboard, otherwise redirect to a page they can access
      const canAccessDashboard = permissions.some(p => p.module === 'users' && p.actions.includes('view'));
      
      if (canAccessDashboard) {
        navigate('/dashboard');
      } else if (permissions.some(p => p.module === 'employees' && p.actions.includes('view'))) {
        navigate('/employees');
      } else if (permissions.some(p => p.module === 'projects' && p.actions.includes('view'))) {
        navigate('/projects');
      } else {
        // If they don't have access to any main modules, show unauthorized
        navigate('/unauthorized');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState(initialAuthState);
    setPermissionMatrix({});
    navigate('/login');
  };

  const checkPermission = (module: string, action: string): boolean => {
    return Boolean(permissionMatrix[module]?.[action]);
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        hasPermission: checkPermission,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};