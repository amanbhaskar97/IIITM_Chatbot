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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
          message: input.trim(),
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

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background rounded-none sm:rounded-lg shadow-md overflow-hidden">
      <ChatHeader user={user} logout={logout} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center text-muted-foreground max-w-sm p-6 bg-accent/30 rounded-lg">
                <p>Ask me anything about IIITM. I'm here to help!</p>
              </div>
            </div>
          )}
          <div className="px-3 py-4 md:px-6">
            <MessageList 
              messages={messages} 
              isTyping={isTyping} 
              messagesEndRef={messagesEndRef} 
            />
          </div>
        </div>
        <div className="p-3 border-t border-border bg-background/80 backdrop-blur-sm">
          <ChatInput 
            input={input} 
            setInput={setInput} 
            handleSubmit={handleSubmit} 
            isTyping={isTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;