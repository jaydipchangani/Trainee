import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { ShoppingCart, BarChart2, RefreshCw, Clock } from 'lucide-react';
import styles from './Home.module.scss';

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1>Manage Your Grocery Inventory with Ease</h1>
        <p>
          A powerful dashboard to track, manage, and optimize your grocery items.
          Get started today and experience the difference.
        </p>
        <Button type="primary" size="large">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
        <img 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
          alt="Grocery management" 
          className={styles.heroImage}
        />
      </section>
      
      <section className={styles.features}>
        <div className={styles.feature}>
          <h3>
            <ShoppingCart />
            Inventory Management
          </h3>
          <p>
            Keep track of all your grocery items in one place. Add, update, and remove items with ease.
          </p>
        </div>
        
        <div className={styles.feature}>
          <h3>
            <BarChart2 />
            Data Visualization
          </h3>
          <p>
            View your inventory data in intuitive charts and graphs to make informed decisions.
          </p>
        </div>
        
        <div className={styles.feature}>
          <h3>
            <RefreshCw />
            Real-time Updates
          </h3>
          <p>
            All changes to your inventory are updated in real-time, ensuring you always have the latest information.
          </p>
        </div>
        
        <div className={styles.feature}>
          <h3>
            <Clock />
            Expiry Tracking
          </h3>
          <p>
            Never let your groceries go to waste. Get notified when items are about to expire.
          </p>
        </div>
      </section>
      
      <section className={styles.cta}>
        <h2>Ready to Get Started?</h2>
        <p>
          Take control of your grocery inventory today. Our dashboard provides all the tools you need to manage your items efficiently.
        </p>
        <Button type="primary" size="large">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </section>
    </div>
  );
};

export default Home;