//Question bank api.

const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true }, // Ensure this is questionText, not question
  options: [String],
  subject: { type: String, default: 'General' },
  difficulty: { type: String, default: 'Medium' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // If required: true, the ID must be valid
  source: { type: String, default: 'Manual' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Questions', QuestionSchema);