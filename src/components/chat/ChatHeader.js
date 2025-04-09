import React from 'react';

const ChatHeader = ({ user, logout }) => {
  return (
    <div style={{
      textAlign: 'center',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{
        color: '#2c3e50',
        fontSize: '2em'
      }}>EmonerY Chat</h1>
      
      <div>
        <span style={{ marginRight: '10px' }}>Hi, {user?.username}</span>
        <button
          onClick={logout}
          style={{
            padding: '5px 10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;