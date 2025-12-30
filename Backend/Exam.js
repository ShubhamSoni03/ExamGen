/*storing exam data in db. */


const mongoose = require('mongoose');

// Defining the Schema
const ExamSchema = new mongoose.Schema({
    schoolName: { type: String, required: true },
    examTitle: { type: String, required: true },
    category: String,
    difficulty: String,
    // Questions are stored as an array of objects fetched from the External API
    questions: [
        {
            question: String,
            correct_answer: String,
            incorrect_answers: [String]
        }
    ],
    createdAt: { type: Date, default: Date.now } //timestamp field.
});

module.exports = mongoose.model('Exam', ExamSchema);