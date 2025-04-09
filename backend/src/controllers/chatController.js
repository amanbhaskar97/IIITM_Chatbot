
// File: /src/controllers/chatController.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const sendMessage = async (req, res) => {
  try {
    const { messages } = req.body;

    // Extract system message and chat history
    const systemMessage = messages.find(msg => msg.role === 'system');
    const chatHistory = messages.filter(msg => msg.role !== 'system');

    // Initialize chat
    const chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // Prepare the user's message with system context
    const userMessage = chatHistory[chatHistory.length - 1].content;
    const messageWithContext = systemMessage 
        ? `${systemMessage.content}\n\nUser: ${userMessage}`
        : userMessage;

    // Send message and get response
    const result = await chat.sendMessage(messageWithContext);
    const response = await result.response;
    const text = response.text();

    res.json({ content: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
};

module.exports = {
  sendMessage
};
