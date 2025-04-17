import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="px-4 py-2.5 bg-accent rounded-2xl rounded-tl-none inline-flex gap-1">
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
      </div>
    </div>
  );
};

export default TypingIndicator;