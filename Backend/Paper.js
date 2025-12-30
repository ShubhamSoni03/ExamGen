const mongoose = require('mongoose');

/*
Paper Schema
Stores generated exam papers
*/
const paperSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    title: String,
    subject: String,
    questions: Array,
    totalMarks: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Paper', paperSchema);
