import React from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { PermissionProvider } from './contexts/PermissionContext';

// Components
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Employees from './pages/Employees';
import Projects from './pages/Projects';
import Unauthorized from './pages/Unauthorized';

function App() {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/unauthorized',
      element: <Unauthorized />
    },
    {
      path: '/',
      element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
      children: [
        {
          path: 'dashboard',
          element: <Dashboard />
        },
        {
          path: 'users',
          element: <ProtectedRoute module="users" action="view"><Users /></ProtectedRoute>
        },
        {
          path: 'roles',
          element: <ProtectedRoute module="roles" action="view"><Roles /></ProtectedRoute>
        },
        {
          path: 'employees',
          element: <ProtectedRoute module="employees" action="view"><Employees /></ProtectedRoute>
        },
        {
          path: 'projects',
          element: <ProtectedRoute module="projects" action="view"><Projects /></ProtectedRoute>
        },
        {
          path: '',
          element: <Navigate to="/dashboard" replace />
        }
      ]
    },
    {
      path: '*',
      element: <Navigate to="/dashboard" replace />
    }
  ]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
        },
      }}
    >
      <AuthProvider>
        <PermissionProvider>
          <RouterProvider router={router} />
        </PermissionProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;