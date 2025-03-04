import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { 
  UserIcon, 
  UsersIcon, 
  BriefcaseIcon, 
  ShieldIcon, 
  LogOutIcon,
  HomeIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC = () => {
  const { authState, hasPermission, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeIcon size={16} />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    hasPermission('users', 'view') && {
      key: 'users',
      icon: <UserIcon size={16} />,
      label: 'Users',
      onClick: () => navigate('/users'),
    },
    hasPermission('employees', 'view') && {
      key: 'employees',
      icon: <UsersIcon size={16} />,
      label: 'Employees',
      onClick: () => navigate('/employees'),
    },
    hasPermission('projects', 'view') && {
      key: 'projects',
      icon: <BriefcaseIcon size={16} />,
      label: 'Projects',
      onClick: () => navigate('/projects'),
    },
    hasPermission('roles', 'view') && {
      key: 'roles',
      icon: <ShieldIcon size={16} />,
      label: 'Roles & Permissions',
      onClick: () => navigate('/roles'),
    },
  ].filter(Boolean);

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogOutIcon size={16} />,
      onClick: logout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        position: 'fixed', 
        zIndex: 1, 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
      }}>
        <div className="logo" style={{ fontSize: '18px', fontWeight: 'bold' }}>
          RBAC System
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '12px' }}>
            {authState.user?.name} ({authState.user?.role})
          </span>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}>
              {authState.user?.name.charAt(0)}
            </Avatar>
          </Dropdown>
        </div>
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
              borderRadius: '4px',
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;