import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

const TeacherLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      const res = await API.post('/teachers/login', { email, password });
      localStorage.setItem('teacher', JSON.stringify(res.data));
      localStorage.setItem('isTeacherLoggedIn', 'true');
      navigate('/dashboard');
    } catch (err) {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] relative overflow-hidden font-sans">
      
      {/* --- UNIQUE BACKGROUND: THE "SPOTLIGHT" --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/20 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

      {/* --- FLOATING DECORATIVE ELEMENTS (DIFFERENT FROM REGISTER) --- */}
      <div className="absolute top-20 right-[15%] w-32 h-32 border border-indigo-500/20 rounded-full animate-pulse" />
      <div className="absolute bottom-20 left-[10%] w-64 h-64 border-t-2 border-indigo-500/10 rounded-full rotate-45" />

      {/* --- LOGIN PORTAL CARD --- */}
      <div className="relative z-10 w-full max-w-md mx-auto group">
        
        {/* TOP ICON BOX (Floating above the card) */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
          <div className="w-24 h-24 bg-slate-900 border border-indigo-500/30 rounded-3xl flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <form 
          onSubmit={handleLogin}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 pt-16 shadow-[0_30px_100px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:border-indigo-500/40"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white tracking-tighter">Welcome Back</h2>
            <p className="text-indigo-400/60 text-xs font-bold uppercase tracking-[0.2em] mt-2">Authorized Access Only</p>
          </div>

          <div className="space-y-5">
            {/* EMAIL FIELD */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/40 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                required
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-500 transition-colors">@</span>
            </div>

            {/* PASSWORD FIELD */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/40 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                required
              />
              <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 px-2">
             <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer hover:text-slate-300 transition">
                <input type="checkbox" className="accent-indigo-500 rounded" /> Remember Me
             </label>
             <button type="button" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition">Forgot Key?</button>
          </div>

          <button
            type="submit"
            className="w-full mt-8 py-4 bg-white text-[#030712] font-black rounded-2xl shadow-xl shadow-white/5 hover:bg-indigo-500 hover:text-white hover:shadow-indigo-500/20 transition-all duration-300 active:scale-95"
          >
            Authenticate →
          </button>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm">
              Don't have access?{' '}
              <Link to="/register" className="text-white font-bold hover:text-indigo-400 transition underline underline-offset-4 decoration-indigo-500/30">
                Register Workspace
              </Link>
            </p>
          </div>
        </form>

        {/* BOTTOM DECORATIVE SHADOW */}
        <div className="w-[80%] h-4 bg-indigo-600/20 blur-2xl mx-auto rounded-full mt-[-10px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Footer hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 text-[10px] font-bold uppercase tracking-[0.4em]">
        Secure Terminal 1.0.4
      </div>
    </div>
  );
};

export default TeacherLogin;