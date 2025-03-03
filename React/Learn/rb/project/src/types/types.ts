// User related types
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  roleId: number;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  roleId: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

// Role related types
export interface Role {
  id: number;
  name: string;
  description: string;
}

// Permission related types
export type ActionType = 'view' | 'add' | 'edit' | 'delete';

export interface Permission {
  id: number;
  roleId: number;
  module: ModuleType;
  actions: ActionType[];
}

export type ModuleType = 'users' | 'roles' | 'employees' | 'projects';

export interface PermissionMap {
  [module: string]: {
    [action: string]: boolean;
  };
}

// Employee related types
export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  joinDate: string;
}

// Project related types
export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

// Auth context type
export interface AuthContextType {
  user: UserResponse | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Permission context type
export interface PermissionContextType {
  permissions: PermissionMap;
  hasPermission: (module: ModuleType, action: ActionType) => boolean;
  refreshPermissions: () => Promise<void>;
}