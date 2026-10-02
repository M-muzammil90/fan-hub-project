import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500 mb-6 shadow-xl">
        <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
      </div>

      <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-500 mb-2">
        Error 404 · Signal Lost
      </span>

      <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display mb-4">
        Fandom Realm Not Found
      </h1>

      <p className="text-sm text-zinc-400 max-w-md mb-8 leading-relaxed">
        The destination timeline or page you requested does not exist or has been shifted into another multiverse quadrant.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md shadow-rose-950"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-bold text-xs transition-colors"
        >
          <span>Explore Catalog</span>
        </Link>
      </div>
    </div>
  );
}
