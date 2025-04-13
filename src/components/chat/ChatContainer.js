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

  // System message that defines the AI's personality
  const systemContext = {
    role: 'system',
    content: "You are EmonerY, a friendly AI assistant. Provide short, accurate, and concise answers - typically 1-3 sentences. Be warm but direct. Avoid unnecessary explanations or excessive enthusiasm."
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

    const userMessage = {
      role: 'user',
      content: input
    };

    // Add user message to the conversation
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Send the entire message history for context
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [systemContext, ...messages, userMessage],
          userId: user.id // Send user ID to backend
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
      
      // Add assistant response to the conversation
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

  // Load previous conversation from localStorage on component mount
  // Using user.id to create a unique storage key for each user
  useEffect(() => {
    if (user && user.id) {
      const storageKey = `chatMessages_${user.id}`;
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
        } catch (e) {
          console.error('Failed to load saved messages', e);
        }
      } else {
        // Clear messages if no history for this user
        setMessages([]);
      }
    }
  }, [user]);

  // Save conversation to localStorage whenever messages change
  // Using user.id to create a unique storage key for each user
  useEffect(() => {
    if (user && user.id && messages.length > 0) {
      const storageKey = `chatMessages_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, user]);

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