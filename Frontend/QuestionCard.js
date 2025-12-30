import React from 'react';

/*
Single Question Card
Reusable for Question Bank
*/
const QuestionCard = ({ question, onSelect }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <p className="text-white text-sm mb-2">
        {question.question}
      </p>

      <p className="text-xs text-slate-400">
        {question.subject} • {question.difficulty} • {question.type}
      </p>

      <button
        onClick={() => onSelect(question)}
        className="mt-2 text-xs bg-emerald-600 px-3 py-1 rounded"
      >
        Select
      </button>
    </div>
  );
};

export default QuestionCard;
