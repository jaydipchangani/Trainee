import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.scss";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>Welcome to the Grocery Dashboard</h1>
      <p>Manage your groceries efficiently with our dashboard.</p>
      <Button type="primary" onClick={() => navigate("/dashboard")}>
        Go to Dashboard
      </Button>
    </div>
  );
};

export default LandingPage;
