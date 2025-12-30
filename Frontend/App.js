import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

/* COMPONENTS */
import Navbar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

/* PAGES */
import LandingPage from './pages/LandingPage';
import TeacherRegister from './pages/TeacherRegister';
import TeacherLogin from './pages/TeacherLogin';
import TeacherDashboard from './pages/TeacherDashboard';
import GeneratorPage from './pages/SetupPage';
import PreviewPage from './pages/PreviewPage';
import QuestionBank from './pages/QuestionBank';

function App() {
  // 1. Initialize theme from localStorage so it persists on refresh
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // 2. Effect to update the HTML class whenever theme changes (Unit III: Lifecycle)
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 3. Toggle function to be passed to the Navbar
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Provider store={store}>
      <Router>
        {/* GLOBAL UI WRAPPER 
            We apply transitions here so the background color change feels smooth 
        */}
        <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500">

          {/* NAVBAR 
              We pass the current theme and the toggle function as props (Unit II: Props)
          */}
          <Navbar theme={theme} toggleTheme={toggleTheme} />

          {/* PAGE CONTENT */}
          <main className="animate-fade">
            <Routes>
              {/* ================= PUBLIC ROUTES ================= */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<TeacherLogin />} />
              <Route path="/register" element={<TeacherRegister />} />

              {/* ================= PROTECTED ROUTES ================= */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/generator"
                element={
                  <ProtectedRoute>
                    <GeneratorPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/preview"
                element={
                  <ProtectedRoute>
                    <PreviewPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/question-bank"
                element={
                  <ProtectedRoute>
                    <QuestionBank />
                  </ProtectedRoute>
                }
              />

              {/* ================= FALLBACK ================= */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </main>

        </div>
      </Router>
    </Provider>
  );
}

export default App;