import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const studentTypes = [
  { id: 'class10', name: 'High School', sub: 'Class 10', icon: '📖' },
  { id: 'class12', name: 'Intermediate', sub: 'Class 12', icon: '🎓' },
  { id: 'engineering', name: 'Engineering', sub: 'University', icon: '⚙️' },
];

const subjectsByType = {
  class10: [
    { id: 'maths', name: 'Mathematics' }, { id: 'science', name: 'Science' },
    { id: 'sst', name: 'Social Science' }, { id: 'english', name: 'English' },
  ],
  class12: [
    { id: 'pcm_maths', name: 'Mathematics' }, { id: 'pcm_physics', name: 'Physics' },
    { id: 'pcm_chemistry', name: 'Chemistry' }, { id: 'english', name: 'English' },
  ],
  engineering: [
    { id: 'eng_maths', name: 'Engineering Mathematics' },
    { id: 'ds_algo', name: 'Data Structures' },
    { id: 'os', name: 'Operating Systems' },
    { id: 'dbms', name: 'DBMS' },
    { id: 'cn', name: 'Computer Networks' },
  ],
};

const GeneratorPage = () => {
  const [form, setForm] = useState({
    test: '',
    amount: 10,
    studentType: 'engineering',
    subject: 'eng_maths',
    difficulty: 'medium',
    questionType: 'mcq', 
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subjectOptions = useMemo(
    () => subjectsByType[form.studentType] || [],
    [form.studentType]
  );

  useEffect(() => {
    if (!subjectOptions.some((s) => s.id === form.subject)) {
      setForm((prev) => ({ ...prev, subject: subjectOptions[0]?.id || '' }));
    }
  }, [subjectOptions, form.subject]);

  const fetchQuestions = async (e) => {
    e.preventDefault();
    if (!form.test.trim()) return alert('Please enter a test name.');

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/exams/generate`, {
        params: {
          amount: form.amount,
          studentType: form.studentType,
          subjectId: form.subject,
          difficulty: form.difficulty,
          questionType: form.questionType,
        },
        timeout: 60000,
      });

      const examContext = { 
        ...form, 
        subjectId: form.subject, // Explicitly pass as subjectId
        subjectName: subjectOptions.find(s => s.id === form.subject)?.name 
      };

      // 1. Update Redux
      dispatch({
        type: 'SET_DATA',
        payload: {
          questions: res.data,
          info: examContext,
        },
      });

      // 2. BACKUP: Save to localStorage so PreviewPage can recover on refresh
      localStorage.setItem('last_exam_info', JSON.stringify(examContext));
      localStorage.setItem('last_questions', JSON.stringify(res.data));

      navigate('/preview');
    } catch (err) {
      console.error("Exam Generation Error:", err);
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />

      <main className="relative z-10 w-full max-w-5xl bg-slate-900/40 border border-slate-800 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all hover:border-slate-700">
        <div className="lg:w-1/3 bg-gradient-to-br from-indigo-600 to-blue-700 p-10 flex flex-col justify-between text-white relative">
          <div>
            <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl border border-white/30">
              <span className="text-3xl font-black italic">Q</span>
            </div>
            <h1 className="text-4xl font-black leading-tight uppercase tracking-tighter mb-4">Neural<br />Draft<span className="text-indigo-200">.</span></h1>
            <p className="text-indigo-100 text-sm opacity-90 leading-relaxed">Generate structured academic assessments using AI.</p>
          </div>
          <div className="flex items-center gap-3 bg-black/20 p-3 rounded-2xl border border-white/10">
            <div className={`h-2 w-2 rounded-full ${loading ? 'bg-orange-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-50">{loading ? 'AI Processing...' : 'API Status: Online'}</span>
          </div>
        </div>

        <form onSubmit={fetchQuestions} className="flex-1 p-8 md:p-12 space-y-8 bg-black/20">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Exam Title</label>
            <input
              required placeholder="e.g., Data Structures Mid-Term"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-lg font-bold focus:border-indigo-500 outline-none transition-all"
              value={form.test}
              onChange={(e) => setForm({ ...form, test: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {studentTypes.map((t) => (
              <button key={t.id} type="button" onClick={() => setForm({ ...form, studentType: t.id })}
                className={`p-4 rounded-2xl border text-left transition-all ${form.studentType === t.id ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' : 'bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="text-[10px] font-black uppercase tracking-tight">{t.name}</div>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Question Format</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[{ id: 'mcq', name: 'MCQ', icon: '🔘' }, { id: 'true_false', name: 'True/False', icon: '⚖️' }, { id: 'fill_blank', name: 'Fill Blanks', icon: '⌨️' }].map((type) => (
                <button key={type.id} type="button" onClick={() => setForm({ ...form, questionType: type.id })}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-bold transition-all ${form.questionType === type.id ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950/50 border-slate-800 text-slate-400'}`}>
                  <span>{type.icon}</span> {type.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Subject Area</label>
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-200 outline-none focus:border-indigo-500">
                {subjectOptions.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Complexity</label>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-200 outline-none focus:border-indigo-500">
                <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Questions</label>
              <span className="text-xl font-black text-indigo-500">{form.amount}</span>
            </div>
            <input type="range" min="1" max="50" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
            <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 py-5 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98]">
              {loading ? 'AI is thinking...' : 'Build My Exam Paper'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default GeneratorPage;