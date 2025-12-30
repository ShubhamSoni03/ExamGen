/*Teacher Registration and login using db. */

const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

/*
POST /api/teachers/register
Registers a new teacher
*/
router.post('/register', async (req, res) => {
  try {
    const { name, subject, email, password } = req.body;

    // Basic validation
    if (!name || !subject || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher already exists' });
    }

    // Create teacher
    const teacher = await Teacher.create({
      name,
      subject,
      email,
      password, // (we will hash later)
    });

    res.status(201).json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/*
POST /api/teachers/login
Validates teacher credentials
*/
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher || teacher.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
