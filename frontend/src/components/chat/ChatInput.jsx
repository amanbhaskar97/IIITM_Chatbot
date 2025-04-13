import React from 'react';

const ChatInput = ({ input, setInput, handleSubmit }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 items-center border border-border rounded-lg p-2 bg-accent"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-3 py-2 bg-transparent outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
