import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { GroceryProvider } from './context/GroceryContext';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import './styles/global.scss';

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: theme === 'dark' ? '#177ddc' : '#1890ff',
        },
      }}
    >
      <div className="app-container">
        <Header />
        <main className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </ConfigProvider>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <GroceryProvider>
          <AppContent />
        </GroceryProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;