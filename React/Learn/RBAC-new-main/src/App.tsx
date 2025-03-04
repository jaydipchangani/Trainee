import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import { PermissionProvider } from './contexts/PermissionContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Employees from './pages/Employees';
import Projects from './pages/Projects';
import Roles from './pages/Roles';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <AuthProvider>
          <PermissionProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              <Route element={<ProtectedRoute requiredPermission={{ module: 'users', action: 'view' }} />}>
                <Route path="/users" element={<AppLayout />}>
                  <Route index element={<Users />} />
                </Route>
              </Route>
              
              <Route element={<ProtectedRoute requiredPermission={{ module: 'employees', action: 'view' }} />}>
                <Route path="/employees" element={<AppLayout />}>
                  <Route index element={<Employees />} />
                </Route>
              </Route>
              
              <Route element={<ProtectedRoute requiredPermission={{ module: 'projects', action: 'view' }} />}>
                <Route path="/projects" element={<AppLayout />}>
                  <Route index element={<Projects />} />
                </Route>
              </Route>
              
              <Route element={<ProtectedRoute requiredPermission={{ module: 'roles', action: 'view' }} />}>
                <Route path="/roles" element={<AppLayout />}>
                  <Route index element={<Roles />} />
                </Route>
              </Route>
              
              <Route element={<ProtectedRoute requiredPermission={{ module: 'users', action: 'view' }} />}>
                <Route path="/profile" element={<AppLayout />}>
                  <Route index element={<Profile />} />
                </Route>
              </Route>
              
              <Route path="/dashboard" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
              </Route>
              
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </PermissionProvider>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;