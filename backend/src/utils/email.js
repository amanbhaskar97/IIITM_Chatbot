
// File: /src/utils/email.js
const nodemailer = require('nodemailer');

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

const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'IIITM Assistant Chat - Email Verification',
    html: `
      <h2>Welcome to IIITM Assist Chat!</h2>
      <p>Your verification code is: <strong>${otp}</strong></p>
      <p>This code will expire in 1 hour.</p>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'IIITM Assist Chat - Password Reset',
    html: `
      <h2>Password Reset Request</h2>
      <p>Your password reset code is: <strong>${otp}</strong></p>
      <p>This code will expire in 1 hour.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

module.exports = {
  generateOTP,
  sendVerificationEmail,
  sendPasswordResetEmail
};
