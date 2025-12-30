
// 1. Load environment variables IMMEDIATELY at the very top
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// 2. Diagnostics: Check if key is loaded on startup
console.log('------------------------------------');
if (process.env.OPENROUTER_API_KEY) {
  console.log('✅ OPENROUTER_API_KEY detected');
} else {
  console.log('❌ ERROR: OPENROUTER_API_KEY not found in .env');
  console.log('Current Directory:', __dirname);
}
console.log('------------------------------------');

// 3. Import Routes (Must be after dotenv)
const examRoutes = require('./routes/examRoutes');

const app = express();

// Unit III: Custom Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} to ${req.url}`);
  next();
});

// Unit II: Middleware Setup
app.use(cors());
app.use(bodyParser.json());

// Unit IV: Mongoose/MongoDB Connection
mongoose
  .connect('mongodb://127.0.0.1:27017/exam_generator')
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Unit II: Implementing Routes
app.use('/api/exams', examRoutes);
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/papers', require('./routes/paperRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});