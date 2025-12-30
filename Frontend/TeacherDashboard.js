import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import PaperCard from '../components/PaperCard';

const TeacherDashboard = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('teacher');
      if (raw && raw !== 'undefined') {
        setTeacher(JSON.parse(raw));
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!teacher?._id) return;
    setLoading(true);
    API.get(`/papers/teacher/${teacher._id}`)
      .then((res) => setPapers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [teacher?._id]);

  const filteredPapers = useMemo(() => {
    return papers.filter(p =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [papers, searchQuery]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  if (!teacher && !loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <div className="bg-slate-900/50 border border-indigo-500/20 backdrop-blur-xl p-10 rounded-[2rem] text-center shadow-2xl max-w-sm">
          <div className="text-4xl mb-4 animate-bounce">🔐</div>
          <h3 className="text-xl font-bold text-white mb-2">Access Denied</h3>
          <p className="text-slate-400 mb-8 text-sm">Session expired. Re-authenticate to access the AI dashboard.</p>
          <button onClick={() => navigate('/login')} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row max-w-[1600px] mx-auto min-h-screen">
        
        {/* --- LEFT SIDEBAR (Dark Gradient Panel) --- */}
        <aside className="lg:w-80 p-6 lg:p-10 bg-slate-950/50 border-r border-white/5 backdrop-blur-xl flex flex-col">
          <div className="mb-12">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-indigo-500/20">
              🎓
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">{teacher?.name?.split(' ')[0]}</h2>
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{teacher?.subject || 'Lead Educator'}</p>
          </div>

          <nav className="space-y-3 flex-1">
             <button onClick={() => navigate('/generator')} className="group w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl shadow-xl shadow-indigo-500/10 hover:scale-[1.02] active:scale-95 transition-all">
                <span className="font-bold">New Assessment</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-lg text-sm">AI</span>
             </button>
             <button onClick={() => navigate('/question-bank')} className="w-full flex items-center gap-4 p-4 text-slate-400 font-bold hover:bg-white/5 hover:text-white rounded-2xl transition-all">
                <span className="opacity-70">📁</span> Question Bank
             </button>
          </nav>

          <div className="mt-10 p-6 bg-slate-900/50 rounded-3xl border border-white/5">
             <div className="flex justify-between items-end mb-2">
                <p className="text-[10px] font-black text-slate-500 uppercase">Neural Usage</p>
                <p className="text-[10px] font-black text-indigo-400">75%</p>
             </div>
             <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 w-[75%]" />
             </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 p-6 lg:p-12">
          
          <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-2">
                {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">{teacher?.name?.split(' ')[0]}</span>
              </h1>
              <p className="text-slate-500 font-medium">Your AI-generated exam repository is up to date.</p>
            </div>
            <div className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl flex items-center gap-4">
               <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System: Optimized</span>
            </div>
          </header>

          {/* METRICS GRID */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard title="Papers Archive" value={papers.length} icon="📑" color="from-indigo-500/20" />
            <StatCard title="Total Questions" value={papers.reduce((acc, p) => acc + (p.questions?.length || 0), 0)} icon="⚡" color="from-violet-500/20" />
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2rem] text-white flex flex-col justify-between shadow-2xl shadow-indigo-950">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Top Performance</span>
              <div>
                <p className="text-3xl font-black tracking-tighter italic">98.4%</p>
                <p className="text-xs font-medium opacity-80">Accuracy in generation</p>
              </div>
            </div>
          </section>

          {/* LIST SECTION */}
          <section className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 lg:p-10 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
              <h2 className="text-2xl font-black text-white tracking-tight">Recent Projects</h2>
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Search title or subject..."
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">🔍</span>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 4].map(i => <div key={i} className="h-36 bg-slate-800/20 animate-pulse rounded-3xl border border-white/5" />)}
              </div>
            ) : filteredPapers.length === 0 ? (
              <div className="py-24 text-center rounded-[2rem] border-2 border-dashed border-white/5 bg-slate-950/20">
                <p className="text-slate-600 font-bold tracking-tight">The archive is currently empty.</p>
                <button onClick={() => navigate('/generator')} className="mt-4 text-indigo-400 text-xs font-black uppercase tracking-widest hover:text-indigo-300">Start Generating →</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPapers.map((paper) => (
                  <div key={paper._id} className="group transition-all hover:translate-y-[-4px]">
                    <PaperCard paper={paper} isDark={true} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-slate-900/50 border border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all relative overflow-hidden group`}>
    <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-xl text-xl grayscale group-hover:grayscale-0 transition-all">{icon}</div>
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-1">{title}</p>
      <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
    </div>
  </div>
);

export default TeacherDashboard;