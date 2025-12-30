import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import API from '../api/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const QUESTIONS_PER_PAGE = 10;

const PreviewPage = () => {
  const dispatch = useDispatch();

  // 1. Redux Data
  const reduxState = useSelector((state) => state || {});

  // 2. Recovery Logic: If Redux is empty (on refresh), pull from localStorage
  const examInfo = useMemo(() => {
    if (reduxState.info && (reduxState.info.subjectId || reduxState.info.subject)) {
      return reduxState.info;
    }
    const saved = localStorage.getItem('last_exam_info');
    return saved ? JSON.parse(saved) : {};
  }, [reduxState.info]);

  const [localQuestions, setLocalQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [marksPerQuestion, setMarksPerQuestion] = useState(1);
  const [notes, setNotes] = useState({});
  const [loadingRegen, setLoadingRegen] = useState(false);
  const [savedToBank, setSavedToBank] = useState({});

  // 3. Sync questions from Redux or localStorage
  useEffect(() => {
    if (reduxState.questions && reduxState.questions.length > 0) {
      setLocalQuestions(reduxState.questions);
    } else {
      const savedQs = localStorage.getItem('last_questions');
      if (savedQs) setLocalQuestions(JSON.parse(savedQs));
    }
  }, [reduxState.questions]);

  const totalPages = Math.max(1, Math.ceil(localQuestions.length / QUESTIONS_PER_PAGE));
  
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * QUESTIONS_PER_PAGE;
    return localQuestions.slice(start, start + QUESTIONS_PER_PAGE);
  }, [localQuestions, currentPage]);

  const totalMarks = useMemo(() => {
    return localQuestions.length * (Number(marksPerQuestion) || 0);
  }, [localQuestions.length, marksPerQuestion]);

  // ================= HANDLERS =================

  const handleShuffle = () => {
    setLocalQuestions([...localQuestions].sort(() => Math.random() - 0.5));
    setCurrentPage(1);
    alert("🔀 Questions shuffled successfully!");
  };

  const goToPage = (page) => { 
    if (page >= 1 && page <= totalPages) setCurrentPage(page); 
  };

  const handleSaveToBank = async (question, index) => {
    try {
      const rawData = localStorage.getItem('teacher') || localStorage.getItem('user') || localStorage.getItem('auth');
      const teacher = rawData ? JSON.parse(rawData) : null;
      const teacherId = teacher?._id || teacher?.id || teacher?.user?._id || teacher?.user?.id;
      
      if (!teacherId) return alert("Session expired. Please log in again.");

      const payload = {
        questionText: question.question || question.questionText, 
        options: question.options || [],
        correctAnswer: question.answerText || question.answer || "",
        subject: examInfo.subjectName || examInfo.subject || "General",
        difficulty: examInfo.difficulty || 'Medium',
        marks: marksPerQuestion,
        teacherId: teacherId, 
        source: 'AI-Generated'
      };

      await API.post('/questions/bank', payload);
      setSavedToBank(prev => ({ ...prev, [index]: true }));
    } catch (err) { 
      alert(`Failed to save: ${err.message}`); 
    }
  };

  const handleRegenerate = async () => {
    const finalSubjectId = examInfo.subjectId || examInfo.subject;
    
    if (!finalSubjectId) {
      alert("Exam context missing. Please go back to the Generator page and re-select options.");
      return;
    }

    setLoadingRegen(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/exams/generate`, {
        params: {
          amount: examInfo.amount,
          studentType: examInfo.studentType,
          subjectId: finalSubjectId,
          difficulty: examInfo.difficulty,
          questionType: examInfo.questionType,
        },
        timeout: 60000,
      });

      if (!res.data || res.data.length === 0) return alert('No questions returned.');

      // Update Global State
      dispatch({ type: 'SET_DATA', payload: { questions: res.data, info: examInfo } });
      
      // Update Persistent Storage
      localStorage.setItem('last_questions', JSON.stringify(res.data));

      // Update Local View
      setLocalQuestions(res.data);
      setSavedToBank({});
      setCurrentPage(1);

      // ✅ Success Alert after full state update
      alert(`✨ Success! ${res.data.length} new questions have been generated.`);

    } catch (err) {
      alert('Regeneration failed: ' + (err.response?.data?.message || err.message));
    } finally { 
      setLoadingRegen(false); 
    }
  };

  const handleSavePaper = async () => {
    try {
      const rawData = localStorage.getItem('teacher') || localStorage.getItem('user') || localStorage.getItem('auth');
      if (!rawData) return alert('No login session found.');
      const teacher = JSON.parse(rawData);
      const teacherId = teacher.id || teacher._id || teacher.user?.id || teacher.user?._id;

      await API.post('/papers', {
        teacherId,
        title: examInfo.test || 'Question Paper',
        subject: examInfo.subjectName || examInfo.subject || '',
        totalMarks,
        questions: localQuestions,
      });
      alert('✅ Full exam paper saved to your dashboard!');
    } catch (err) { 
      alert(err.response?.data?.message || 'Failed to save paper'); 
    }
  };

  // ================= VIEW =================

  if (!localQuestions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-slate-200">
        <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 text-center">
          <h2 className="text-xl font-semibold mb-2">No active paper found</h2>
          <p className="text-gray-500 mb-4 text-sm">Return to the generator to create a new one.</p>
          <button onClick={() => window.history.back()} className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center p-6 bg-gray-950 text-gray-100">
      <div className="w-full max-w-5xl bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Header Section */}
        <header className="p-6 border-b border-gray-800 flex flex-col md:flex-row justify-between gap-6 bg-gray-900/50 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">Preview Mode</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{examInfo.test || 'Untitled Paper'}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {examInfo.subjectName} • {localQuestions.length} Questions • <span className="text-emerald-500 font-bold">{totalMarks} Total Marks</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-bold mb-1 ml-1">Marks per Q</span>
              <input 
                type="number" 
                className="w-20 px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none text-sm focus:border-indigo-500 transition-colors" 
                value={marksPerQuestion} 
                onChange={(e) => setMarksPerQuestion(e.target.value)} 
              />
            </div>
            <button onClick={handleShuffle} className="px-4 py-2 rounded bg-gray-800 text-xs font-bold hover:bg-gray-700 transition">Shuffle</button>
            <button 
              onClick={handleRegenerate} 
              disabled={loadingRegen} 
              className="px-4 py-2 rounded bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loadingRegen ? 'Regenerating...' : 'Regenerate'}
            </button>
            <button onClick={handleSavePaper} className="px-4 py-2 rounded bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition">Save Paper</button>
          </div>
        </header>

        {/* Questions Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto bg-gray-950/30">
          {paginatedQuestions.map((q, i) => {
            const index = (currentPage - 1) * QUESTIONS_PER_PAGE + i;
            const isSaved = savedToBank[index];
            return (
              <div key={index} className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all group">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex-1">
                    <span className="text-indigo-500 font-bold text-sm mb-2 block uppercase tracking-widest">Question {index + 1}</span>
                    <p className="text-lg text-gray-100 font-medium leading-relaxed">{q.question || q.questionText}</p>
                  </div>
                  <button 
                    onClick={() => handleSaveToBank(q, index)} 
                    disabled={isSaved} 
                    className={`text-[10px] uppercase font-black px-4 py-1.5 rounded-full border transition-all ${
                      isSaved 
                      ? 'text-emerald-500 border-emerald-500/50 bg-emerald-500/10' 
                      : 'text-gray-500 border-gray-800 hover:border-indigo-500 hover:text-indigo-400'
                    }`}
                  >
                    {isSaved ? '✓ Added to Bank' : '⭐ Add to Bank'}
                  </button>
                </div>

                {/* Options Grid */}
                {Array.isArray(q.options) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {q.options.map((opt, idx) => (
                      <div key={idx} className="bg-gray-950/50 border border-gray-800 rounded-lg p-3 text-gray-300 text-sm flex items-center group-hover:border-gray-700 transition-colors">
                        <span className="w-6 h-6 rounded bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold mr-3 text-xs">{String.fromCharCode(65 + idx)}</span>
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                {/* Answer Key */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-4 py-2 mb-4 inline-block">
                   <p className="text-xs text-emerald-500 font-mono">
                     <span className="font-bold uppercase mr-2">Correct Answer:</span> 
                     {q.answerText || (q.options ? q.options[q.answerIndex] : 'N/A')}
                   </p>
                </div>

                {/* Internal Notes */}
                <textarea 
                  className="w-full rounded-xl p-3 text-sm bg-gray-950 border border-gray-800 focus:border-indigo-500 outline-none text-gray-400 transition-all" 
                  placeholder="Attach internal notes or teaching points for this question..." 
                  value={notes[index] || ''} 
                  onChange={(e) => setNotes({...notes, [index]: e.target.value})} 
                />
              </div>
            );
          })}
        </div>

        {/* Pagination Footer */}
        <footer className="p-4 border-t border-gray-800 flex justify-between items-center text-xs bg-gray-900/80 backdrop-blur-md">
          <div className="text-gray-500 font-medium">
            Page <span className="text-gray-300">{currentPage}</span> of <span className="text-gray-300">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => goToPage(currentPage - 1)} 
              disabled={currentPage === 1} 
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <button 
              onClick={() => goToPage(currentPage + 1)} 
              disabled={currentPage === totalPages} 
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PreviewPage;