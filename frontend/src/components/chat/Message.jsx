import React from 'react';

const Message = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`my-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-xl text-sm shadow-md ${
          isUser ? 'bg-blue-600 text-white' : 'bg-accent text-foreground'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default Message;
