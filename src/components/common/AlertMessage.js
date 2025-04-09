import React from 'react';

const AlertMessage = ({ error, message }) => {
  if (error) {
    return (
      <div style={{
        padding: '10px',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '4px',
        marginBottom: '15px'
      }}>
        {error}
      </div>
    );
  }
  
  if (message) {
    return (
      <div style={{
        padding: '10px',
        backgroundColor: '#d4edda',
        color: '#155724',
        borderRadius: '4px',
        marginBottom: '15px'
      }}>
        {message}
      </div>
    );
  }
  
  return null;
};

export default AlertMessage;