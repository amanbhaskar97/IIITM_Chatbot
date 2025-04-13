import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatContainer = ({ user, token, logout }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const systemContext = {
    role: 'system',
    content: "You are EmonerY, a friendly AI assistant. Provide short, accurate, and concise answers."
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [systemContext, ...messages, userMessage],
          userId: user.id
        })
      });

      if (!response.ok) {
        if (response.status === 401) logout();
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't respond. Try again." }]);
    }
  };

  useEffect(() => {
    const storageKey = `chatMessages_${user.id}`;
    const savedMessages = localStorage.getItem(storageKey);
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, [user]);

  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`chatMessages_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  return (
    <div className="space-y-4">
      <ChatHeader user={user} logout={logout} />
      <MessageList messages={messages} isTyping={isTyping} messagesEndRef={messagesEndRef} />
      <ChatInput input={input} setInput={setInput} handleSubmit={handleSubmit} />
    </div>
  );
};

export default ChatContainer;
