import React from 'react';

const ChatHeader = ({ user, logout }) => {
  return (
    <header className="flex justify-between items-center py-2 px-4 border-b border-border bg-accent rounded-md">
      <h1 className="text-xl font-semibold">EmonerY Chat</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Hi, {user?.username}</span>
        <button
          onClick={logout}
          className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
