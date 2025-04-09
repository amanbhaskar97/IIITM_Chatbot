import React from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import EmptyChat from './EmptyChat';

const MessageList = ({ messages, isTyping, messagesEndRef }) => {
  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      {messages.length === 0 ? (
        <EmptyChat />
      ) : (
        messages.map((message, index) => (
          <Message key={index} message={message} />
        ))
      )}
      
      {isTyping && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;