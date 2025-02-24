import React from 'react';
import {Layout, Menu,Typography  } from 'antd';

const { Header} = Layout;
const { Title } = Typography;

const items = [
  { key: '1', label: 'Home', path: '/' },
  { key: '2', label: 'Products', path: '/products' },
  { key: '3', label: 'Add Products', path: '/add' },
];

const App: React.FC = () => {
  
  return (
    <Layout>
      
      <Header
        style={{
         
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color:'blue',
          padding: 0
        }}
      >
        <div className="demo-logo" />
        <Title level={3} style={{color:'white'}}>Products Managment</Title>
        
      </Header>

    </Layout>
  );
};

export default App;