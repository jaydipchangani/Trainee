import axios from 'axios';
import { jwtVerify, SignJWT } from 'jose';
import { 
  User, 
  UserResponse, 
  LoginCredentials, 
  AuthResponse, 
  Role, 
  Permission, 
  Employee, 
  Project 
} from '../types/types';

const API_URL = 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data: users } = await api.get<User[]>(`/users?email=${credentials.email}`);
    
    if (users.length === 0) {
      throw new Error('User not found');
    }
    
    const user = users[0];
    
    // In a real app, you would use bcrypt.compare here
    // For this demo, we're just checking if the passwords match
    if (user.password !== credentials.password) {
      throw new Error('Invalid password');
    }
    
    // Create a JWT token
    const secret = new TextEncoder().encode('your-secret-key');
    const token = await new SignJWT({ userId: user.id, roleId: user.roleId })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secret);
    
    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
    };
    
    return { user: userResponse, token };
  },
  
  verifyToken: async (token: string): Promise<{ userId: number; roleId: number }> => {
    try {
      const secret = new TextEncoder().encode('your-secret-key');
      const { payload } = await jwtVerify(token, secret);
      return payload as unknown as { userId: number; roleId: number };
    } catch (error) {
      throw new Error('Invalid token');
    }
  },
  
  getCurrentUser: async (): Promise<UserResponse> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const { userId } = await authApi.verifyToken(token);
    const { data: user } = await api.get<User>(`/users/${userId}`);
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
    };
  },
};

// Users API
export const usersApi = {
  getAll: async (): Promise<UserResponse[]> => {
    const { data } = await api.get<User[]>('/users');
    return data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
    }));
  },
  
  getById: async (id: number): Promise<UserResponse> => {
    const { data: user } = await api.get<User>(`/users/${id}`);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
    };
  },
  
  create: async (user: Omit<User, 'id'>): Promise<UserResponse> => {
    const { data } = await api.post<User>('/users', user);
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      roleId: data.roleId,
    };
  },
  
  update: async (id: number, user: Partial<User>): Promise<UserResponse> => {
    const { data } = await api.patch<User>(`/users/${id}`, user);
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      roleId: data.roleId,
    };
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Roles API
export const rolesApi = {
  getAll: async (): Promise<Role[]> => {
    const { data } = await api.get<Role[]>('/roles');
    return data;
  },
  
  getById: async (id: number): Promise<Role> => {
    const { data } = await api.get<Role>(`/roles/${id}`);
    return data;
  },
};

// Permissions API
export const permissionsApi = {
  getAll: async (): Promise<Permission[]> => {
    const { data } = await api.get<Permission[]>('/permissions');
    return data;
  },
  
  getByRoleId: async (roleId: number): Promise<Permission[]> => {
    const { data } = await api.get<Permission[]>(`/permissions?roleId=${roleId}`);
    return data;
  },
  
  update: async (id: number, permission: Partial<Permission>): Promise<Permission> => {
    const { data } = await api.patch<Permission>(`/permissions/${id}`, permission);
    return data;
  },

  create: async (permission: Omit<Permission, 'id'>): Promise<Permission> => {
    const { data } = await api.post<Permission>('/permissions', permission);
    return data;
  }
};

// Employees API
export const employeesApi = {
  getAll: async (): Promise<Employee[]> => {
    const { data } = await api.get<Employee[]>('/employees');
    return data;
  },
  
  getById: async (id: number): Promise<Employee> => {
    const { data } = await api.get<Employee>(`/employees/${id}`);
    return data;
  },
  
  create: async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
    const { data } = await api.post<Employee>('/employees', employee);
    return data;
  },
  
  update: async (id: number, employee: Partial<Employee>): Promise<Employee> => {
    const { data } = await api.patch<Employee>(`/employees/${id}`, employee);
    return data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};

// Projects API
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const { data } = await api.get<Project[]>('/projects');
    return data;
  },
  
  getById: async (id: number): Promise<Project> => {
    const { data } = await api.get<Project>(`/projects/${id}`);
    return data;
  },
  
  create: async (project: Omit<Project, 'id'>): Promise<Project> => {
    const { data } = await api.post<Project>('/projects', project);
    return data;
  },
  
  update: async (id: number, project: Partial<Project>): Promise<Project> => {
    const { data } = await api.patch<Project>(`/projects/${id}`, project);
    return data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};



export default api;