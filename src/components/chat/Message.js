import React from 'react';

const Message = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div
      style={{
        marginBottom: '15px',
        textAlign: isUser ? 'right' : 'left'
      }}
    >
      <div style={{
        display: 'inline-block',
        maxWidth: '70%',
        padding: '10px 15px',
        borderRadius: '15px',
        backgroundColor: isUser ? '#007bff' : '#e9ecef',
        color: isUser ? 'white' : 'black'
      }}>
        {message.content}
      </div>
    </div>
  );
};

export default Message;