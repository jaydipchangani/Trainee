import React, { useState } from 'react';
import { Layout, Card, Menu, Avatar, Typography, Row, Col, Space, Tag, Button, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './Dashboard.css'; // We'll define some custom styles

const { Header, Content } = Layout;
const { Title, Text } = Typography;

interface User {
  name: string;
  profilePicture?: string;
  daysRemaining: number;
}

interface MenuItem {
  title: string;
  items: {
    name: string;
    comingSoon?: boolean;
  }[];
}

const Dashboard: React.FC = () => {
  // User information would come from your authentication system
  const [user, setUser] = useState<User>({
    name: 'shailesh',
    daysRemaining: 31
  });

  // Menu data for the dashboard
  const menuItems: MenuItem[] = [
    {
      title: 'Group Financial Reporting',
      items: [
        { name: 'Working Papers' },
        { name: 'Reports' },
        { name: 'Journals' }
      ]
    },
    {
      title: 'Group Financial Control',
      items: [
        { name: 'Intercompany Reconciliation' },
        { name: 'Intercompany Recharge' },
        { name: 'Intercompany Loan', comingSoon: true },
        { name: 'Balance Sheet Control', comingSoon: true }
      ]
    },
    {
      title: 'Group Financial Planning',
      items: [
        { name: 'Group Budget' }
      ]
    },
    {
      title: 'Multi-Entity & Display',
      items: [
        { name: 'Company' },
        { name: 'Group' },
        { name: 'Group Class' },
        { name: 'Configuration Display' }
      ]
    },
    {
      title: 'Users & Roles',
      items: [
        { name: 'Users' },
        { name: 'Roles' }
      ]
    }
  ];

  return (
    <Layout className="dashboard-layout">
      <Header className="header">
        <div className="logo">
          <Title level={3} style={{ color: '#2E8B57', margin: 0 }}>
            GATHER<span style={{ fontSize: '16px', fontWeight: 'normal' }}>.nexus</span>
          </Title>
        </div>
        
        <div className="user-info">
          <Space>
            <Text>Trial expires in {user.daysRemaining} days</Text>
            <div className="trial-status-bar">
              <div className="trial-progress"></div>
            </div>
            <Avatar size="large" style={{ backgroundColor: '#333' }}>
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} />
              ) : (
                <Text style={{ color: 'white' }}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              )}
            </Avatar>
            <div>
              <Text strong>{user.name}</Text>
              <br />
              <Text type="secondary">My Profile</Text>
            </div>
          </Space>
        </div>
      </Header>
      
      <Content className="content">
        <Row gutter={[24, 24]}>
          {menuItems.slice(0, 3).map((section, index) => (
            <Col key={index} xs={24} md={8}>
              <Card className="menu-card">
                <Title level={5}>{section.title}</Title>
                <Divider className="green-divider" />
                <Menu mode="vertical" className="section-menu">
                  {section.items.map((item, itemIndex) => (
                    <Menu.Item key={`${index}-${itemIndex}`} className="menu-item">
                      <div className="menu-item-content">
                        <Text className={item.comingSoon ? 'coming-soon-text' : ''}>
                          {item.name}
                        </Text>
                        {item.comingSoon && (
                          <Tag color="green">Coming Soon</Tag>
                        )}
                      </div>
                    </Menu.Item>
                  ))}
                </Menu>
              </Card>
            </Col>
          ))}
        </Row>
        
        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          {menuItems.slice(3).map((section, index) => (
            <Col key={index + 3} xs={24} md={12}>
              <Card className="menu-card">
                <Title level={5}>{section.title}</Title>
                <Divider className="green-divider" />
                <Menu mode="vertical" className="section-menu">
                  {section.items.map((item, itemIndex) => (
                    <Menu.Item key={`${index + 3}-${itemIndex}`} className="menu-item">
                      <div className="menu-item-content">
                        <Text>{item.name}</Text>
                        {item.comingSoon && (
                          <Tag color="green">Coming Soon</Tag>
                        )}
                      </div>
                    </Menu.Item>
                  ))}
                </Menu>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default Dashboard;