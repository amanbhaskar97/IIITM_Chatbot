// File: /src/controllers/chatController.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Define a Chat History schema
const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  messages: [
    {
      role: { type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  lastUpdated: { type: Date, default: Date.now }
});

// Create the model
const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

const sendMessage = async (req, res) => {
  try {
    const { messages, userId } = req.body;
    const authenticatedUserId = req.user._id;

    // Security check - ensure the userId from request matches authenticated user
    if (userId && userId !== authenticatedUserId.toString()) {
      return res.status(403).json({ error: 'Unauthorized access to chat history' });
    }

    // Extract system message for personality and style instructions
    const systemMessage = messages.find(msg => msg.role === 'system') || {
      content: "You are EmonerY, a friendly AI assistant. Provide short, accurate, and concise answers - typically 1-3 sentences. Be warm but direct. Avoid unnecessary explanations or excessive enthusiasm."
    };
    
    // Get all user and assistant messages for conversation history
    const conversationHistory = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => `${msg.role === 'user' ? 'User' : 'EmonerY'}: ${msg.content}`)
      .join('\n\n');

    // Initialize chat with appropriate settings
    const chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.5, // Lower temperature for more precise responses
      },
    });

    // Create comprehensive prompt with personality and full history
    const fullPrompt = `${systemMessage.content}

Remember the conversation history but keep your responses short and focused.

Conversation history:
${conversationHistory}

User: ${messages[messages.length - 1].content}

Important: Your response must be concise (1-3 sentences), accurate, and direct.`;

    // Send message and get response
    const result = await chat.sendMessage(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Clean up any formatting artifacts
    const cleanedResponse = text.replace(/^(EmonerY|Assistant): /i, '');

    // Store the latest message in the database (optional - for server-side storage)
    try {
      // Find or create a chat history document for this user
      let chatHistory = await ChatHistory.findOne({ userId: authenticatedUserId });
      
      if (!chatHistory) {
        chatHistory = new ChatHistory({
          userId: authenticatedUserId,
          messages: []
        });
      }
      
      // Add the new messages (both user and assistant)
      const userMessage = messages[messages.length - 1];
      const assistantMessage = {
        role: 'assistant',
        content: cleanedResponse,
        timestamp: new Date()
      };
      
      chatHistory.messages.push(userMessage, assistantMessage);
      chatHistory.lastUpdated = new Date();
      
      // Keep only the last 100 messages to prevent excessive storage
      if (chatHistory.messages.length > 100) {
        chatHistory.messages = chatHistory.messages.slice(-100);
      }
      
      await chatHistory.save();
    } catch (dbError) {
      console.error('Database storage error:', dbError);
      // Continue with the response even if database storage fails
    }

    res.json({ content: cleanedResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
};

// New endpoint to retrieve chat history from server (optional)
const getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const chatHistory = await ChatHistory.findOne({ userId });
    
    if (!chatHistory) {
      return res.json({ messages: [] });
    }
    
    res.json({ messages: chatHistory.messages });
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
};

module.exports = {
  sendMessage,
  getChatHistory
};