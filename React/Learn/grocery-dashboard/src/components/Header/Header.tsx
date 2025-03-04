import React from "react";
import { Layout, Switch } from "antd";
import { useTheme } from "../../context/ThemeContext";
import styles from "./Header.module.scss";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Header className={styles.header}>
      <h1 className={styles.title}>Dashboard</h1>
      <Switch
        checked={theme === "dark"}
        onChange={toggleTheme}
        checkedChildren="🌙 Dark"
        unCheckedChildren="☀️ Light"
      />
    </Header>
  );
};

export default AppHeader;
