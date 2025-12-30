import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

const TeacherRegister = () => {
  const [form, setForm] = useState({
    name: '',
    subject: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/teachers/register', form);
      alert('Registration successful! Welcome aboard.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative selection:bg-indigo-500/30 font-sans bg-[#020617]">
      
      {/* --- COMPLEX MESH GRADIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0">
        {/* Primary Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-600/30 to-blue-600/10 blur-[140px] rounded-full animate-pulse" />
        {/* Secondary Glow */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-purple-600/20 to-pink-600/10 blur-[140px] rounded-full animate-pulse delay-700" />
        {/* Accent Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      {/* --- MAIN GLASS CARD --- */}
      <div className="relative z-10 flex w-full max-w-6xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* --- LEFT PANEL: THE SCHOLAR VISUAL --- */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600/20 via-transparent to-purple-600/10 p-16 flex-col justify-between border-r border-white/5 relative">
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-10 w-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                AI
              </div>
              <span className="text-white font-black tracking-tighter text-xl">ExamGen</span>
            </div>
            
            <h2 className="text-6xl font-black text-white leading-[1.1] mb-6">
              Master your <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic">
                Curriculum.
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              The world’s first AI-powered exam generator built specifically for academic excellence.
            </p>
          </div>

          {/* SCHOLAR ILLUSTRATION */}
          <div className="relative group flex justify-center py-10">
            {/* Animated Ring */}
            <div className="absolute inset-0 m-auto w-72 h-72 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-0 m-auto w-80 h-80 border-t border-indigo-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            
            <div className="relative bg-slate-900/80 p-10 rounded-[3rem] border border-white/10 backdrop-blur-md shadow-2xl transition-transform duration-500 group-hover:-translate-y-4">
              <svg width="140" height="140" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" fill="url(#scholar_grad)" />
                <path opacity="0.4" d="M12 16C9.24 16 7 18.24 7 21H17C17 18.24 14.76 16 12 16Z" fill="white" />
                <circle opacity="0.2" cx="12" cy="11" r="4" fill="white" />
                <defs>
                  <linearGradient id="scholar_grad" x1="1" y1="3" x2="23" y2="15" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#818cf8" />
                    <stop offset="1" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">
            <span>Registration Open 2025</span>
          </div>
        </div>

        {/* --- RIGHT PANEL: THE FORM --- */}
        <div className="w-full lg:w-1/2 p-8 md:p-20 flex flex-col justify-center relative">
          
          <div className="max-w-md mx-auto w-full relative z-10">
            <div className="mb-12">
              <h3 className="text-4xl font-black text-white mb-3 tracking-tight">Get Started</h3>
              <p className="text-slate-400 font-medium">Create your teacher profile in seconds.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 gap-5">
                
                {/* Inputs */}
                {[
                  { label: "Full Name", name: "name", type: "text", placeholder: "e.g. Isaac Newton" },
                  { label: "Department", name: "subject", type: "text", placeholder: "e.g. Physics" },
                  { label: "Email Address", name: "email", type: "email", placeholder: "isaac@cambridge.edu" },
                  { label: "Create Password", name: "password", type: "password", placeholder: "••••••••" }
                ].map((input) => (
                  <div key={input.name} className="flex flex-col gap-2 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-400 transition-colors">
                      {input.label}
                    </label>
                    <input
                      name={input.name}
                      type={input.type}
                      placeholder={input.placeholder}
                      onChange={handleChange}
                      required
                      className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-indigo-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                    />
                  </div>
                ))}

              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all duration-500 active:scale-95 mt-4"
              >
                Create Account →
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-slate-500 text-sm font-medium">
                Already have a workspace?{' '}
                <Link to="/login" className="text-indigo-400 font-bold hover:text-white transition-colors underline underline-offset-8 decoration-indigo-500/30">
                  Login Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;