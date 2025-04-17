import React from 'react';
// Import your logo - update the path as needed
import logo from '../../assets/images/iiitm-logo.png';

const ChatHeader = ({ user, logout }) => {
  return (
    <header className="flex items-center justify-between py-2.5 px-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <img src={logo} alt="IIITM Logo" className="h-8 w-auto" />
        <h1 className="text-lg font-semibold text-foreground">IIITM Virtual Assist</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
          {user?.username}
        </span>
        <button
          onClick={logout}
          className="py-1.5 px-3 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;