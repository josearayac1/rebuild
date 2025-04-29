import React, { useEffect } from 'react';
import styles from './Snackbar.module.css';

export default function Snackbar({ message, open, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className={styles.snackbar}>
      <span>{message}</span>
      <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="5" y1="5" x2="15" y2="15" stroke="#fff" strokeWidth="2"/>
          <line x1="15" y1="5" x2="5" y2="15" stroke="#fff" strokeWidth="2"/>
        </svg>
      </button>
    </div>
  );
} 