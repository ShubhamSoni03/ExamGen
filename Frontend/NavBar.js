import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const teacher = localStorage.getItem('teacher');

  // Determine if we are in dark mode based on global props
  const isDark = theme === 'dark';

  // Don't show Navbar on Auth pages
  if (['/', '/login', '/register'].includes(location.pathname)) {
    return null;
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('teacher');
    setIsOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* ================= TOP NAVBAR ================= */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4
        bg-white/90 dark:bg-slate-900/90 backdrop-blur-md 
        border-b border-indigo-100 dark:border-slate-800 shadow-sm transition-colors duration-300">

        {/* LOGO SECTION */}
        <div 
          onClick={() => navigate('/dashboard')}
          className="group cursor-pointer flex items-center gap-2"
        >
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-500/20">
            <span className="text-white font-black text-lg">Q</span>
          </div>
          <h1 className="text-slate-800 dark:text-white font-black text-xl tracking-tighter">
            EXAM<span className="text-indigo-600 dark:text-indigo-400 font-extrabold">.AI</span>
          </h1>
        </div>

        {/* NAVIGATION LINKS (DESKTOP) */}
        <div className="hidden md:flex items-center gap-8">
          {teacher && (
            <>
              <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-sm uppercase tracking-wider transition">Home</Link>
              <Link to="/generator" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-sm uppercase tracking-wider transition">Generator</Link>
              <Link to="/question-bank" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-sm uppercase tracking-wider transition">Bank</Link>
            </>
          )}
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-4 lg:gap-6">
          
          {/* 🌓 GLOBAL THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:scale-110 active:scale-95 transition-all shadow-inner border border-transparent dark:border-slate-700"
            title="Toggle Light/Dark Mode"
          >
            {isDark ? (
              /* Sun Icon for Dark Mode */
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              /* Moon Icon for Light Mode */
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {!teacher ? (
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/login')} className="text-slate-600 dark:text-slate-400 font-bold text-sm hidden sm:block">Sign In</button>
              <button onClick={() => navigate('/register')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition">Get Started</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end leading-none">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Status</span>
                <span className="text-xs font-bold text-emerald-500">Online</span>
              </div>
              
              <button
                onClick={toggleMenu}
                className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-xl hover:bg-indigo-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="space-y-1.5">
                  <span className={`block h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded transition-all duration-300 ${isOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
                  <span className={`block h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-4'}`} />
                  <span className={`block h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`} />
                </div>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-500 ease-in-out z-[100] p-10 shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.5)]`}
      >
        <div className="flex justify-between items-center mb-12">
          <span className="text-slate-400 font-black text-xs tracking-[0.3em] uppercase">Menu</span>
          <button onClick={toggleMenu} className="text-slate-400 hover:text-red-500 text-2xl transition">✕</button>
        </div>

        <nav className="flex flex-col space-y-2">
          {[
            { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
            { to: '/generator', label: 'AI Generator', icon: '✨' },
            { to: '/question-bank', label: 'Question Bank', icon: '📁' },
            { to: '/preview', label: 'Paper Preview', icon: '📄' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={toggleMenu}
              className="group flex items-center justify-between p-4 rounded-2xl hover:bg-indigo-50 dark:hover:bg-slate-800/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm group-hover:scale-110 transition">{item.icon}</span>
                <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{item.label}</span>
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition text-indigo-400">→</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-10 left-10 right-10 space-y-6">
          <button
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-slate-400 font-bold hover:border-red-100 dark:hover:border-red-900/30 hover:text-red-500 transition-all"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* OVERLAY */}
      {isOpen && (
        <div onClick={toggleMenu} className="fixed inset-0 bg-indigo-900/10 dark:bg-black/60 backdrop-blur-[2px] z-[90]" />
      )}
    </>
  );
};

export default Navbar;