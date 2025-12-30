import React, { useState, useEffect } from 'react';
import API from '../api/api';

const QuestionBank = () => {
  const [bank, setBank] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===== ADD QUESTION STATE ===== */
  const [questionText, setQuestionText] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [marks, setMarks] = useState(2);
  const [questionType, setQuestionType] = useState('MCQ');
  const [options, setOptions] = useState(['', '', '', '']);
  const [saving, setSaving] = useState(false);

  /* ===== EDIT STATE ===== */
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  /* ===== FETCH BANK ===== */
  useEffect(() => { fetchBank(); }, []);

  const fetchBank = async () => {
    try {
      setLoading(true);
      const res = await API.get('/questions/bank');
      setBank(res.data);
    } catch {
      console.error('Failed to fetch bank');
    } finally {
      setLoading(false);
    }
  };

  /* ===== RESET OPTIONS BASED ON TYPE ===== */
  useEffect(() => {
    if (questionType === 'MCQ') setOptions(['', '', '', '']);
    if (questionType === 'TRUE_FALSE') setOptions(['True', 'False']);
    if (questionType === 'SHORT') setOptions([]);
  }, [questionType]);

  const handleSaveQuestion = async () => {
    if (!questionText.trim() || !subject.trim()) return alert('Missing fields');
    try {
      setSaving(true);
      const teacher = JSON.parse(localStorage.getItem('teacher'));
      await API.post('/questions/bank', {
        questionText, questionType, options, difficulty, marks, subject,
        source: 'Manual', teacherId: teacher?._id,
      });
      setQuestionText(''); setSubject(''); fetchBank();
    } catch { alert('Save failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await API.delete(`/questions/bank/${id}`);
      setBank(prev => prev.filter(q => q._id !== id));
    } catch { alert('Delete failed'); }
  };

  const saveEdit = async (id) => {
    try {
      await API.put(`/questions/bank/${id}`, { questionText: editText });
      setBank(prev => prev.map(q => q._id === id ? { ...q, questionText: editText } : q));
      setEditingId(null);
    } catch { alert('Update failed'); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="h-12 w-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col lg:flex-row font-sans">
      
      {/* LEFT SIDEBAR: CREATION PANEL */}
      <aside className="w-full lg:w-96 lg:h-screen lg:sticky lg:top-0 bg-slate-900/30 border-r border-slate-800/50 p-6 md:p-8 overflow-y-auto backdrop-blur-xl">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Editor Mode</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Quest<span className="text-indigo-600">.Bank</span></h1>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Question Text</label>
            <textarea
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              placeholder="What is the output of..."
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Type</label>
              <select 
                value={questionType} onChange={e => setQuestionType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-300 outline-none focus:border-indigo-500"
              >
                <option value="MCQ">MCQ</option>
                <option value="TRUE_FALSE">True/False</option>
                <option value="SHORT">Short</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Subject</label>
              <input 
                placeholder="DBMS" value={subject} onChange={e => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {questionType !== 'SHORT' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Options</label>
              {options.map((opt, i) => (
                <div key={i} className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600">{String.fromCharCode(65 + i)}</span>
                  <input
                    value={opt}
                    disabled={questionType === 'TRUE_FALSE'}
                    onChange={e => {
                      const copy = [...options]; copy[i] = e.target.value; setOptions(copy);
                    }}
                    placeholder={`Choice ${i + 1}`}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleSaveQuestion}
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] text-white transition-all transform active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-600/20"
          >
            {saving ? 'Saving...' : 'Add to Collection'}
          </button>
        </div>
      </aside>

      {/* RIGHT CONTENT: REPOSITORY GRID */}
      <main className="flex-1 p-6 lg:p-12 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter">Repository</h2>
              <p className="text-slate-500 text-sm font-medium italic">Managing {bank.length} validated questions</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Unit V: CRUD Operations
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {bank.map((q) => (
              <div
                key={q._id}
                className="group relative bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-6 hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-2">
                    <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-black px-2 py-1 rounded-md uppercase border border-indigo-500/20">
                      {q.questionType}
                    </span>
                    <span className="bg-slate-800 text-slate-400 text-[9px] font-black px-2 py-1 rounded-md uppercase">
                      {q.difficulty}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{q.subject}</span>
                </div>

                {editingId === q._id ? (
                  <textarea
                    autoFocus
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="w-full bg-black border border-indigo-500 rounded-xl p-3 text-sm text-white outline-none mb-4 min-h-[100px]"
                  />
                ) : (
                  <h3 className="text-lg font-bold text-slate-200 leading-tight mb-4 line-clamp-3 group-hover:text-white transition-colors">
                    {q.questionText}
                  </h3>
                )}

                <div className="flex flex-wrap gap-2 mb-8">
                  {q.options?.filter(opt => opt).map((opt, i) => (
                    <div key={i} className="text-[10px] text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800/50">
                      {opt}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                  <span className="text-[10px] font-black text-slate-600 uppercase">ID: {q._id.slice(-4)}</span>
                  <div className="flex gap-4">
                    {editingId === q._id ? (
                      <button 
                        onClick={() => saveEdit(q._id)} 
                        className="text-[11px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest transition-colors"
                      >
                        Update
                      </button>
                    ) : (
                      <button 
                        onClick={() => { setEditingId(q._id); setEditText(q.questionText); }} 
                        className="text-[11px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(q._id)} 
                      className="text-[11px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionBank;