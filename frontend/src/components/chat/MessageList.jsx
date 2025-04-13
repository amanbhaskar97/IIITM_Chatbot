import React from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const MessageList = ({ messages, isTyping, messagesEndRef }) => {
  return (
    <div className="h-[60vh] overflow-y-auto px-4 py-2 bg-background border border-border rounded-lg shadow-sm">
      {messages.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">
          Start a conversation with EmonerY!
        </p>
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
