// ---- File: /src/controllers/chatController.js (modified sendMessage) ----
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');
const InteractionLog = require('../models/InteractionLog');
const { getChatContext } = require('../utils/dataLoader'); // ✅ this line is critical

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });


const sendMessage = async (req, res) => {
  try {
    const { message, userId } = req.body;
    const authenticatedUserId = req.user._id;
    const userEmail = req.user.email;

    if (userId && userId !== authenticatedUserId.toString()) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'No message provided' });
    }

    const folderData = await getChatContext(userEmail);
    const prompt = `
You are an AI assistant for IIIT Manipur.

Your job is to answer user questions based **only** on the information provided in the following context.

If the answer is not clearly available in the context, respond with:
**"Sorry, I don't know the answer to that."**

Be honest. Do not make up information. Do not guess.

Context:
${folderData}

User question: ${message.trim()}
Answer:`.trim();


    const chat = model.startChat({
      generationConfig: { maxOutputTokens: 500, temperature: 0.5 },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text().replace(/^"|"$/g, '');

    await new InteractionLog({
      userId: authenticatedUserId,
      message: message.trim(),
      response: text
    }).save();

    res.json({ content: text });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { sendMessage };