import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  UserIcon, 
  Users, 
  Briefcase, 
  FileText, 
  Settings, 
  Menu as MenuIcon 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePermission } from '../contexts/PermissionContext';

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { hasPermission } = usePermission();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <FileText size={18} />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
      show: true,
    },
    {
      key: 'users',
      icon: <UserIcon size={18} />,
      label: 'Users',
      onClick: () => navigate('/users'),
      show: hasPermission('users', 'view'),
    },
    {
      key: 'roles',
      icon: <Settings size={18} />,
      label: 'Roles & Permissions',
      onClick: () => navigate('/roles'),
      show: hasPermission('roles', 'view'),
    },
    {
      key: 'employees',
      icon: <Users size={18} />,
      label: 'Employees',
      onClick: () => navigate('/employees'),
      show: hasPermission('employees', 'view'),
    },
    {
      key: 'projects',
      icon: <Briefcase size={18} />,
      label: 'Projects',
      onClick: () => navigate('/projects'),
      show: hasPermission('projects', 'view'),
    },
  ].filter(item => item.show);

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      label: 'Logout',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          position: 'fixed',
          zIndex: 1,
          width: '100%',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: token.colorBgContainer,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={<MenuIcon size={18} />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ marginRight: 16 }}
          />
          <h1 style={{ margin: 0, fontSize: '18px' }}>RBAC System</h1>
        </div>
        <div>
          {user && (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar style={{ backgroundColor: token.colorPrimary }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <span style={{ marginLeft: 8 }}>{user.name}</span>
              </div>
            </Dropdown>
          )}
        </div>
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 64,
            bottom: 0,
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname.split('/')[1] || 'dashboard']}
            items={menuItems}
            style={{ padding: '16px 0' }}
          />
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
          <Content style={{ margin: '24px 16px', padding: 24, background: token.colorBgContainer, borderRadius: 4 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;