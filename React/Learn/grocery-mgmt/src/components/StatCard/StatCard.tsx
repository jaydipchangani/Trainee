import React, { ReactNode } from 'react';
import styles from './StatCard.module.scss';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className={styles.statCard}>
      <div className={styles.statTitle}>{title}</div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statIcon}>{icon}</div>
    </div>
  );
};

export default StatCard;