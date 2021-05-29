import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/fontawesome-free-solid';
import styles from './dashboard.module.css';

// render an empty dashboard
export default function EmptyDashboard () {
  return (
    <div>
      <div className={styles.emptyContainer}>
        <h1>Oh No!</h1>
        <p>You have 0 Big Brain Games</p>
        <FontAwesomeIcon icon={faFolderOpen} size='6x' />
        <p>Get started by adding a new game</p>
      </div>
    </div>
  );
}
