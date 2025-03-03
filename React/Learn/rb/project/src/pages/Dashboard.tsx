import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { UserIcon, Users, Briefcase, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <p className="mb-6">Welcome back, {user?.name}!</p>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Users"
              value={5}
              prefix={<UserIcon size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Employees"
              value={12}
              prefix={<Users size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Projects"
              value={8}
              prefix={<Briefcase size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Roles"
              value={4}
              prefix={<Settings size={20} />}
            />
          </Card>
        </Col>
      </Row>

      <Row className="mt-6">
        <Col span={24}>
          <Card title="System Overview">
            <p>This Role-Based Access Control (RBAC) system demonstrates how to implement permission-based access in a React application.</p>
            <p className="mt-2">Your current role: <strong>{user?.roleId === 1 ? 'Admin' : user?.roleId === 2 ? 'HR' : user?.roleId === 3 ? 'Supervisor' : 'Manager'}</strong></p>
            <p className="mt-2">Navigate through the sidebar to access different modules based on your permissions.</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;