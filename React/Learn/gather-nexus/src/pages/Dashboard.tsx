import React, { useState } from 'react';
import { Layout, Card, Menu, Typography, Row, Col, Space, Tag, Divider } from 'antd';
import { Link } from 'react-router-dom';
import AppHeader from '../components/Header'; // Import the Header component
import './Dashboard.css';

const { Content } = Layout;
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
    link?: string;
    comingSoon?: boolean;
  }[];
}

const Dashboard: React.FC = () => {

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
        { name: 'Group', link: '/multi' },
        { name: 'Group Class', link: '/multi' },
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
      <AppHeader/> {/* Use the Header component */}
      
      <Content className="content">
        <Row gutter={[24, 24]}>
          {menuItems.map((section, index) => (
            <Col key={index} xs={24} md={8}>
              <Card className="menu-card">
                <Title level={5}>{section.title}</Title>
                <Divider className="green-divider" />
                <Menu mode="vertical" className="section-menu">
                  {section.items.map((item, itemIndex) => (
                    <Menu.Item key={`${index}-${itemIndex}`} className="menu-item">
                      {item.link ? (
                        <Link to={item.link} className="menu-item-content">
                          <Text>{item.name}</Text>
                        </Link>
                      ) : (
                        <div className="menu-item-content">
                          <Text className={item.comingSoon ? 'coming-soon-text' : ''}>
                            {item.name}
                          </Text>
                        </div>
                      )}
                      {item.comingSoon && <Tag color="green">Coming Soon</Tag>}
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