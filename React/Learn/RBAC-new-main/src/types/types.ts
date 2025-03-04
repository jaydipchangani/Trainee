// User related types
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  permissions: Permission[];
}

// Role related types
export interface Role {
  id: number;
  name: string;
  description: string;
}

// Permission related types
export interface Permission {
  id: number;
  roleId: number;
  module: string;
  actions: string[];
}

export interface PermissionMatrix {
  [module: string]: {
    [action: string]: boolean;
  };
}

// Employee related types
export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
}

export interface EmployeeFormData {
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
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

export interface ProjectFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

// Route related types
export interface ProtectedRouteProps {
  requiredPermission: {
    module: string;
    action: string;
  };
}