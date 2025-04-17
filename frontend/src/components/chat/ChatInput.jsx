import React from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ input, setInput, handleSubmit, isTyping }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 max-w-4xl mx-auto w-full"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        disabled={isTyping}
        className="flex-1 py-2.5 px-4 rounded-full outline-none focus:ring-2 focus:ring-blue-400 border border-border text-foreground placeholder:text-muted-foreground bg-background"
      />
      <button
        type="submit"
        disabled={isTyping || !input.trim()}
        className={`p-2.5 rounded-full bg-blue-600 text-white ${
          isTyping || !input.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
        } transition-colors`}
        aria-label="Send message"
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default ChatInput;