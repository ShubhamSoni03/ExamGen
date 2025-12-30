import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const teacher = localStorage.getItem('teacher');

  useEffect(() => {
    if (teacher) navigate('/dashboard');
  }, [teacher, navigate]);

  return (
    <div className="relative min-h-screen bg-[#010810] text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* --- KINETIC BACKGROUND --- */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-emerald-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse delay-1000" />
        {/* Vector Grid Mask */}
        <div className="absolute inset-0 opacity-[0.15]" 
             style={{backgroundImage: `radial-gradient(#2dd4bf 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px'}}></div>
      </div>

      {/* --- HERO SECTION: ASYMMETRIC 3D LAYOUT --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col lg:flex-row items-center gap-16">
        
        {/* LEFT: CONTENT AREA */}
        <div className="w-full lg:w-3/5 space-y-8 animate-fade-in-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">V1.0.4 Deploying AI Models</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Architect</span> <br /> 
            of Modern Exams.
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
            A high-fidelity workspace for educators. Upload datasets, manage complex question banks, and generate randomized assessments with mathematical precision.
          </p>

          <div className="flex flex-wrap gap-5 pt-4">
            {!teacher ? (
              <>
                <Link to="/register" className="px-8 py-4 bg-emerald-500 text-slate-950 font-black rounded-xl hover:bg-emerald-400 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] transition-all duration-300">
                  Initialize Workspace
                </Link>
                <Link to="/login" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 backdrop-blur-md transition-all">
                  Secure Login
                </Link>
              </>
            ) : (
              <button onClick={() => navigate('/dashboard')} className="px-10 py-4 bg-white text-slate-900 font-black rounded-xl hover:scale-105 transition-transform shadow-2xl">
                Access Core Dashboard →
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: THE 3D PANEL (Floating Portal) */}
        <div className="w-full lg:w-2/5 relative perspective-1000">
          <div className="relative bg-gradient-to-br from-white/10 to-transparent p-1 border border-white/20 rounded-[3rem] shadow-2xl transform rotate-y-[-15deg] rotate-x-[10deg] hover:rotate-y-[0deg] transition-all duration-1000 group">
            <div className="bg-[#020c18] rounded-[2.8rem] p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
              
              {/* Stat Elements inside 3D card */}
              <div className="space-y-8 relative z-10">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                   <div className="text-3xl font-black text-emerald-400 tracking-tight">100%</div>
                   <div className="text-[10px] text-slate-500 uppercase font-black">Data Encryption</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                   <div className="text-3xl font-black text-cyan-400 tracking-tight">Instant</div>
                   <div className="text-[10px] text-slate-500 uppercase font-black">Generation Speed</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                   <div className="text-3xl font-black text-white tracking-tight">5,000+</div>
                   <div className="text-[10px] text-slate-500 uppercase font-black">Question Database</div>
                </div>
              </div>

              {/* Decorative Geometric Shapes */}
              <div className="mt-8 flex justify-between items-end">
                <div className="h-12 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <div className="h-24 w-1.5 bg-cyan-500 rounded-full animate-pulse delay-75" />
                <div className="h-16 w-1.5 bg-emerald-300 rounded-full animate-pulse delay-150" />
                <div className="h-20 w-1.5 bg-blue-500 rounded-full animate-pulse delay-300" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- THE BENTO-GRID FEATURES --- */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] hover:border-emerald-500/50 transition-all group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="text-xl font-black mb-2">Advanced Analytics</h3>
            <p className="text-slate-500 text-sm">Track how questions perform across different difficulty tiers and batches.</p>
          </div>
          <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] hover:border-emerald-500/50 transition-all">
            <div className="text-4xl mb-4">📂</div>
            <h3 className="text-xl font-black mb-2">JSON Export</h3>
            <p className="text-slate-500 text-sm">Portable data formats.</p>
          </div>
          <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] hover:border-emerald-500/50 transition-all">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-black mb-2">FairPlay</h3>
            <p className="text-slate-500 text-sm">Anti-bias algorithms.</p>
          </div>
        </div>
      </section>

      {/* --- MINIMAL FOOTER --- */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5 text-center">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">
          Powered by ExamGen AI • Academic Intelligence Unit 2025
        </p>
      </footer>

      {/* Custom Global CSS for Perspective and Animations */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-[-15deg] { transform: rotateY(-15deg) rotateX(10deg); }
        
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-left { animation: fade-in-left 1s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default LandingPage;