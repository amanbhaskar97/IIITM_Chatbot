import React from 'react';

const ChatInput = ({ input, setInput, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      gap: '10px'
    }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message here..."
        style={{
          flex: 1,
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ced4da',
          fontSize: '16px'
        }}
      />
      <button
        type="submit"
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;