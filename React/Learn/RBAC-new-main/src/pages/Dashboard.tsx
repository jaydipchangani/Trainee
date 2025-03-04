import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { UserIcon, UsersIcon, BriefcaseIcon, ShieldIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI, employeesAPI, projectsAPI, rolesAPI } from '../api/api';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const [counts, setCounts] = useState({
    users: 0,
    employees: 0,
    projects: 0,
    roles: 0
  });
  
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [users, employees, projects, roles] = await Promise.all([
          usersAPI.getAll(),
          employeesAPI.getAll(),
          projectsAPI.getAll(),
          rolesAPI.getAll()
        ]);
        
        setCounts({
          users: users.length,
          employees: employees.length,
          projects: projects.length,
          roles: roles.length
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
    
    fetchCounts();
  }, []);
  
  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <p className="mb-6">Welcome back, {authState.user?.name}!</p>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Users"
              value={counts.users}
              prefix={<UserIcon size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Employees"
              value={counts.employees}
              prefix={<UsersIcon size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Projects"
              value={counts.projects}
              prefix={<BriefcaseIcon size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Roles"
              value={counts.roles}
              prefix={<ShieldIcon size={20} />}
            />
          </Card>
        </Col>
      </Row>
      
      <Card title="Your Permissions" className="mt-6">
        <div>
          {authState.permissions.map((permission) => (
            <div key={permission.id} className="mb-4">
              <Title level={5} className="capitalize">{permission.module}</Title>
              <div className="flex gap-2">
                {permission.actions.map((action) => (
                  <span key={action} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {action}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;