import React from 'react';

const ReminderBanner = ({ onClose }) => {
  return (
    <div style={styles.banner}>
      <p style={styles.message}>
      🌞 Don't forget to check your child’s activities today!
      </p>
      <button style={styles.closeButton} onClick={onClose}>
        ✕
      </button>
    </div>
  );
};

const styles = {
  banner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fffae6',
    color: '#856404',
    padding: '10px 20px',
    border: '1px solid #ffeeba',
    borderRadius: '5px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '20px 0',
  },
  message: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '500',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#856404',
    fontSize: '18px',
    cursor: 'pointer',
  },
};

export default ReminderBanner;