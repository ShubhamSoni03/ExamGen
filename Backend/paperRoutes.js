//saving paper and fetching paper from a specific user.

const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');

/*
POST /api/papers
Save a paper
*/
router.post('/', async (req, res) => {
  try {
    const paper = await Paper.create(req.body);
    res.status(201).json(paper);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save paper' });
  }
});

/*
Get all papers for a teacher
*/
router.get('/teacher/:id', async (req, res) => {
  try {
    const papers = await Paper.find({ teacherId: req.params.id });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch papers' });
  }
});

module.exports = router;
