//exam generator code

const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const axios = require('axios');

/* ============================
   HELPERS
   ============================ */
function resolveSubjectName(studentType, subjectId) {
  const map = {
    class10: { maths: 'Class 10 Mathematics', science: 'Class 10 Science', sst: 'Class 10 Social Science', english: 'Class 10 English', hindi: 'Class 10 Hindi' },
    class12: { pcm_maths: 'Class 12 Mathematics', pcm_physics: 'Class 12 Physics', pcm_chemistry: 'Class 12 Chemistry', english: 'Class 12 English' },
    engineering: { eng_maths: 'Engineering Mathematics', ds_algo: 'Data Structures', os: 'Operating Systems', dbms: 'DBMS', cn: 'Computer Networks' },
  };
  return map[studentType]?.[subjectId] || 'General Knowledge';
}

function describeQuestionType(type) {
  if (type === 'true_false') return 'True/False questions';
  if (type === 'fill_blank') return 'Fill in the blanks';
  return 'MCQs with 4 options and one correct answer';
}

/* ============================
   GENERATE QUESTIONS
   ============================ */
router.get('/generate', async (req, res) => {

  req.setTimeout(60000);
  try {
    // Fetch key inside the route to ensure it's loaded from process.env
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    const { amount = 10, studentType, subjectId, difficulty, questionType } = req.query;

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ message: 'API Key missing on server' });
    }

    const subjectName = resolveSubjectName(studentType, subjectId);

   //This part of code tells AI exactly what to do and the formatting of data.
    //JSON is parsed here because it makes parsing reliable.
    
    const prompt = `Generate exactly ${amount} ${describeQuestionType(questionType)} for ${studentType} level on ${subjectName}. 
    Difficulty: ${difficulty}.
    Return ONLY a JSON object. No conversational text.
    FORMAT:
    {
      "questions": [
        {
          "question": "string",
          "options": ["A","B","C","D"],  
          "answerIndex": 0,
          "answerText": "string"
        }
      ]
    }`;

    // Using a very stable OpenRouter model
    const aiResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.1-8b-instruct', 
        messages: [
          { role: 'system', content: 'You are an exam generator. You must output valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5 
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'ExamGen',
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    //extracting the response

    let rawText = aiResponse.data.choices?.[0]?.message?.content;

    if (!rawText) {
      return res.status(502).json({ message: 'AI returned an empty response' });
    }

    // markdown stripping
    let cleanedText = rawText;
    if (rawText.includes('```')) {
      cleanedText = rawText.replace(/```json|```/g, '').trim();
    }

    // pure answer to be extracted.
    const firstBrace = cleanedText.indexOf('{');
    const lastBrace = cleanedText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
    }

    //parsing 
    try {
      const parsed = JSON.parse(cleanedText);
      const questions = (parsed.questions || []).map(q => ({
        ...q, //spread operator: all original data.
        type: questionType
      }));
      res.status(200).json(questions); //success signal
    } 
    catch (parseErr) {
      console.error("Raw AI Output:", rawText);
      return res.status(502).json({ 
        message: 'AI output could not be parsed as JSON',
        error: parseErr.message 
      });
    }

    //AI error.
  } catch (error) {
    console.error('OpenRouter Error:', error.response?.data || error.message);
    res.status(502).json({
      message: 'External AI Service Error',
      details: error.response?.data || error.message
    });
  }
});

/* ============================
   SAVE EXAM
   ============================ */
router.post('/save', async (req, res) => {
  try {
    const newExam = new Exam(req.body); //whole question paper to be stored using .body!!
    await newExam.save(); //saving to dbb.
    res.status(201).json({ message: 'Saved successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;