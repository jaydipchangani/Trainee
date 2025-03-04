import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <ShoppingCart />
        <span>Grocery Dashboard</span>
      </div>
      
      <nav className={styles.nav}>
        <Link 
          to="/" 
          className={location.pathname === '/' ? styles.active : ''}
        >
          Home
        </Link>
        <Link 
          to="/dashboard" 
          className={location.pathname === '/dashboard' ? styles.active : ''}
        >
          Dashboard
        </Link>
      </nav>
      
      <div className={styles.actions}>
        <div className={styles.themeToggle} onClick={toggleTheme}>
          {theme === 'light' ? <Moon /> : <Sun />}
        </div>
      </div>
    </header>
  );
};

export default Header;