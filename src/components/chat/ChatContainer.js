import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import './ChatStyles.css';

const ChatContainer = ({ user, token, logout }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const systemContext = {
      role: 'system',
      content: "You are EmonerY, a friendly and empathetic chatbot inspired by ELIZA. You should respond in a way that shows genuine interest in the user's feelings and experiences, often reflecting their statements back to them or asking probing questions. Keep your responses concise and focused on understanding the user's emotional state. Always maintain a supportive and non-judgmental tone."
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [systemContext, ...messages, userMessage]
        })
      });

      if (!response.ok) {
        // Check if authentication error
        if (response.status === 401) {
          logout();
          throw new Error('Authentication required, please login again');
        }
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setIsTyping(false);
      
      const assistantMessage = {
        role: 'assistant',
        content: data.content
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Could you try again?"
      }]);
    }
  };

  return (
    <>
      <ChatHeader user={user} logout={logout} />
      <MessageList 
        messages={messages} 
        isTyping={isTyping} 
        messagesEndRef={messagesEndRef} 
      />
      <ChatInput 
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default ChatContainer;