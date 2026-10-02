import React, { useState, useEffect } from 'react';
import { Users, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { characterApi } from '../services/character.api';
import CharacterCard from '../components/CharacterCard';
import EmptyState from '../components/EmptyState';

export default function Characters() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCharacters = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await characterApi.getCharacters({ search: searchTerm || undefined });
      if (res && res.characters) {
        setCharacters(res.characters);
      } else if (Array.isArray(res)) {
        setCharacters(res);
      } else {
        setCharacters([]);
      }
    } catch (err) {
      console.error('Failed to fetch characters:', err);
      setError(err.message || 'Unable to load characters from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCharacters();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-red-900/40 bg-gradient-to-r from-[#150508] via-[#0a0b12] to-[#0e0609] p-6 sm:p-12 shadow-[0_0_60px_rgba(220,38,38,0.15)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Fandom Lore Codex</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
            Characters <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-400 to-red-300">Archive</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
            Discover legendary characters across Anime, Gaming, Movies and TV Universes with real database profiles.
          </p>

          <div className="relative max-w-md pt-2">
            <Search className="absolute left-3.5 top-5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search characters by name, lore..."
              className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-[#14080b] animate-pulse" />
          ))}
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="rounded-3xl bg-red-950/30 border border-red-500/30 p-8 text-center space-y-4 max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-xs text-zinc-300">{error}</p>
          <button
            type="button"
            onClick={fetchCharacters}
            className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all"
          >
            Try Again
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && characters.length === 0 && (
        <EmptyState
          title="No characters found"
          message={searchTerm ? `No character matches "${searchTerm}"` : 'There are no active character entries in the database.'}
        />
      )}

      {/* REAL DATA DISPLAY */}
      {!loading && !error && characters.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters.map((char) => (
            <CharacterCard key={char._id || char.id} character={char} />
          ))}
        </div>
      )}
    </div>
  );
}
