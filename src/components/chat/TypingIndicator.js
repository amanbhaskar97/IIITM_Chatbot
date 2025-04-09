import React from 'react';

const TypingIndicator = () => {
  return (
    <div style={{
      marginBottom: '15px',
      textAlign: 'left'
    }}>
      <div style={{
        display: 'inline-block',
        padding: '10px 15px',
        borderRadius: '15px',
        backgroundColor: '#e9ecef',
      }}>
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;