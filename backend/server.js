const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema - Updated with verification fields
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Create OTP - 6 digit random number
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new Error();
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Authentication required' });
  }
};

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Register endpoint - Updated to include email verification
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate verification token (OTP)
    const otp = generateOTP();
    const otpExpires = Date.now() + 3600000; // 1 hour
    
    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken: otp,
      verificationTokenExpires: otpExpires
    });
    
    await user.save();
    
    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'EmonerY Chat - Email Verification',
      html: `
        <h2>Welcome to EmonerY Chat!</h2>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 1 hour.</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification code.',
      userId: user._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify email endpoint
app.post('/api/users/verify-email', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    // Check if OTP is valid and not expired
    if (user.verificationToken !== otp || Date.now() > user.verificationTokenExpires) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }
    
    // Mark user as verified and clear verification fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Resend verification code
app.post('/api/users/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }
    
    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = Date.now() + 3600000; // 1 hour
    
    user.verificationToken = otp;
    user.verificationTokenExpires = otpExpires;
    await user.save();
    
    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'EmonerY Chat - New Verification Code',
      html: `
        <h2>EmonerY Chat - Email Verification</h2>
        <p>Your new verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 1 hour.</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.json({
      message: 'Verification code resent successfully',
      userId: user._id
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Forgot password endpoint
app.post('/api/users/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    // Generate reset token (OTP)
    const otp = generateOTP();
    const otpExpires = Date.now() + 3600000; // 1 hour
    
    user.passwordResetToken = otp;
    user.passwordResetExpires = otpExpires;
    await user.save();
    
    // Send password reset email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'EmonerY Chat - Password Reset',
      html: `
        <h2>Password Reset Request</h2>
        <p>Your password reset code is: <strong>${otp}</strong></p>
        <p>This code will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.json({
      message: 'Password reset code sent to your email',
      userId: user._id
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset password endpoint
app.post('/api/users/reset-password', async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    // Check if OTP is valid and not expired
    if (user.passwordResetToken !== otp || Date.now() > user.passwordResetExpires) {
      return res.status(400).json({ error: 'Invalid or expired reset code' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password and clear reset fields
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    res.json({
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint - Updated to check email verification
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        error: 'Email not verified',
        userId: user._id
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
app.get('/api/users/profile', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });
});

// Chat endpoint (now protected by auth middleware)
app.post('/api/chat', auth, async (req, res) => {
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
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});