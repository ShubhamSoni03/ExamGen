import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-[90vh] bg-slate-900 flex flex-col items-center justify-center text-center p-6">
            <div className="bg-indigo-600 w-20 h-2 mb-6"></div>
            <h1 className="text-6xl font-black text-white mb-4">SMART EXAM<br/><span className="text-indigo-500">GENERATOR</span></h1>
            <p className="text-slate-400 max-w-md mb-8">Generate randomized question papers instantly using external APIs. Customized for your school requirements.</p>
            <button 
                onClick={() => navigate('/generator')}
                className="bg-white text-slate-900 px-10 py-4 font-black rounded-full hover:bg-indigo-400 transition"
            >
                START GENERATING
            </button>
        </div>
    );
};
export default HomePage;