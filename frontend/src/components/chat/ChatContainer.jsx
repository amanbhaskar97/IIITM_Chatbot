import React, { useState, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatContainer = ({ user, token, logout }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isError, setIsError] = useState(false);
  const messagesEndRef = useRef(null);

  // Visual-only chat history - not sent to backend for context
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll whenever messages change
  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setIsError(false);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: input.trim(), // Only send current message, no history
          userId: user.id
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          throw new Error('Session expired');
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error("Chat error:", error);
      setIsError(true);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble understanding. Could you rephrase that?",
        error: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Therapeutic UI elements
  const therapyThemes = {
    header: "Chat with Emory",
    placeholder: "Tell me what's on your mind...",
    startingHint: "How are you feeling today?"
  };

  return (
    <div className="flex flex-col h-full bg-blue-50 rounded-lg shadow-md">
      <ChatHeader 
        title={therapyThemes.header}
        user={user} 
        logout={logout} 
        onClearChat={clearChat} 
      />
      <div className="flex-1 p-4 overflow-auto">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10 italic">
            {therapyThemes.startingHint}
          </div>
        )}
        <MessageList 
          messages={messages} 
          isTyping={isTyping} 
          isError={isError}
          messagesEndRef={messagesEndRef} 
        />
      </div>
      <div className="p-4 border-t border-gray-200">
        <ChatInput 
          input={input} 
          setInput={setInput} 
          handleSubmit={handleSubmit} 
          isTyping={isTyping}
          placeholder={therapyThemes.placeholder}
        />
      </div>
    </div>
  );
};

export default ChatContainer;