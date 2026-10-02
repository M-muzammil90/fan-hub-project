import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-xl
        border border-white/15 dark:border-white/15
        bg-white/10 dark:bg-black/20
        text-zinc-100 dark:text-white/80
        hover:text-white dark:hover:text-white
        hover:bg-white/20 dark:hover:bg-black/35
        transition-all duration-300 cursor-pointer
        active:scale-95
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#ff2e63]
        ${className}
      `}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-300 animate-in spin-in-180 duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-cyan-300 animate-in spin-in-180 duration-300" />
      )}
    </button>
  );
}