import React from 'react';

/*
Reusable card component
Used in Teacher Dashboard
Works with real MongoDB paper data
*/
const PaperCard = ({ paper, onRegenerate }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg hover:shadow-xl transition">
      <h3 className="text-lg font-semibold text-white mb-1">
        {paper.title || 'Untitled Paper'}
      </h3>

      <p className="text-slate-400 text-sm">
        Subject: {paper.subject || 'N/A'}
      </p>

      <p className="text-slate-400 text-xs mt-1">
        Questions: {paper.questions?.length || 0} • Marks:{' '}
        {paper.totalMarks || 0}
      </p>

      <p className="text-slate-500 text-xs mt-2">
        Created: {new Date(paper.createdAt).toLocaleDateString()}
      </p>

      {onRegenerate && (
        <button
          onClick={() => onRegenerate(paper)}
          className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-md"
        >
          Regenerate
        </button>
      )}
    </div>
  );
};

export default PaperCard;
