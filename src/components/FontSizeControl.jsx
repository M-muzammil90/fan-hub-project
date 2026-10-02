import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function FontSizeControl({ className = '' }) {
  const { fontSize, changeFontSize } = useTheme();

  return (
    <div className={`flex items-center gap-1 p-1 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs ${className}`}>
      <button
        type="button"
        onClick={() => changeFontSize('small')}
        className={`px-2 py-1 rounded-lg font-medium transition-colors ${
          fontSize === 'small'
            ? 'bg-rose-600 text-white shadow-sm'
            : 'text-zinc-400 hover:text-white'
        }`}
        title="Small font size"
      >
        A-
      </button>
      <button
        type="button"
        onClick={() => changeFontSize('normal')}
        className={`px-2 py-1 rounded-lg font-medium transition-colors ${
          fontSize === 'normal'
            ? 'bg-rose-600 text-white shadow-sm'
            : 'text-zinc-400 hover:text-white'
        }`}
        title="Normal font size"
      >
        A
      </button>
      <button
        type="button"
        onClick={() => changeFontSize('large')}
        className={`px-2 py-1 rounded-lg font-medium transition-colors ${
          fontSize === 'large'
            ? 'bg-rose-600 text-white shadow-sm'
            : 'text-zinc-400 hover:text-white'
        }`}
        title="Large font size"
      >
        A+
      </button>
    </div>
  );
}
