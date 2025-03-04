import axios from 'axios';
import { User, UserFormData, LoginCredentials, Permission, Employee, EmployeeFormData, Project, ProjectFormData, Role } from '../types/types';

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
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.get('/users', {
      params: { email: credentials.email },
    });
    return response.data;
  },
  getUserPermissions: async (roleId: string): Promise<Permission[]> => {
    const response = await api.get(`/permissions`, {
      params: { roleId },
    });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },
  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  create: async (userData: UserFormData): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  update: async (id: string, userData: Partial<UserFormData>): Promise<User> => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Roles API
export const rolesAPI = {
  getAll: async (): Promise<Role[]> => {
    const response = await api.get('/roles');
    return response.data;
  },
  getById: async (id: string): Promise<Role> => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },
};

// Permissions API
export const permissionsAPI = {
  getAll: async (): Promise<Permission[]> => {
    const response = await api.get('/permissions');
    return response.data;
  },
  getByRoleId: async (roleId: string): Promise<Permission[]> => {
    const response = await api.get(`/permissions`, {
      params: { roleId },
    });
    return response.data;
  },
  update: async (id: string, permissionData: Permission): Promise<Permission> => {
    const response = await api.put(`/permissions/${id}`, permissionData);
    return response.data;
  },
};

// Employees API
export const employeesAPI = {
  getAll: async (): Promise<Employee[]> => {
    const response = await api.get('/employees');
    return response.data;
  },
  getById: async (id: string): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },
  create: async (employeeData: EmployeeFormData): Promise<Employee> => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },
  update: async (id: string, employeeData: Partial<EmployeeFormData>): Promise<Employee> => {
    const response = await api.patch(`/employees/${id}`, employeeData);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
  },
  getById: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  create: async (projectData: ProjectFormData): Promise<Project> => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
  update: async (id: string, projectData: Partial<ProjectFormData>): Promise<Project> => {
    const response = await api.patch(`/projects/${id}`, projectData);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};