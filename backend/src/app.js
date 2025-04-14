

// ---- File: /src/app.js ----
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const port = process.env.PORT || 5000;

connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/users', authRoutes);
app.use('/api/chat', chatRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// ---- Dependencies to install ----
// npm install express cors dotenv mongoose jsonwebtoken bcryptjs nodemailer
// npm install pdf-parse xlsx sqlite3 sqlite
// npm install @google/generative-ai
