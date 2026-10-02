import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Gamepad2, Star, Filter, Eye, AlertCircle, Play } from 'lucide-react';
import { contentApi } from '../services/content.api';

export default function Games() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const genres = ['All', 'RPG', 'Action', 'Open World', 'Strategy', 'FPS', 'Indie', 'MMORPG'];

  const fetchGames = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await contentApi.getContent({
        genre: selectedGenre !== 'All' ? selectedGenre : undefined,
        search: searchQuery || undefined,
        sortBy: sortBy
      });

      if (res.success) {
        setGames(res.content || []);
      } else {
        setError(res.message || 'Failed to load games catalog.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGames();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedGenre, sortBy]);

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Gaming Banner Header */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border border-red-500/30 bg-white dark:bg-gradient-to-br dark:from-[#140508] dark:via-[#090b10] dark:to-[#040203] shadow-xl dark:shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        <div className="relative z-20 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 dark:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-500/30 text-[11px] font-black uppercase tracking-wider">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Gaming Realm</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight font-display leading-tight">
            Explore <span className="text-red-600 dark:text-red-500">Gaming Titles & Lore</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed max-w-xl">
            Discover legendary games, character builds, gameplay guides, and community reviews.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0e0407] border border-zinc-200 dark:border-white/10 shadow-lg">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games by title..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-[#16060a] border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors shadow-inner"
          />
        </div>

        {/* Genre Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {genres.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedGenre === g
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                  : 'bg-zinc-100 dark:bg-[#16060a] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-white/5'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-red-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-zinc-100 dark:bg-[#16060a] border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-red-500 font-bold"
          >
            <option value="popular">Most Popular</option>
            <option value="latest">Latest Released</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="aspect-[2/3] rounded-2xl bg-zinc-200 dark:bg-zinc-900 animate-pulse border border-zinc-300 dark:border-white/5" />
          ))}
        </div>
      )}

      {/* Error Banner */}
      {error && !isLoading && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/40 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-sm font-bold text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={fetchGames}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Games Grid */}
      {!isLoading && !error && games.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-zinc-50 dark:bg-[#0d0407] rounded-3xl border border-zinc-200 dark:border-white/5">
          <Gamepad2 className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No Games Found</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">No titles match your search filters.</p>
        </div>
      )}

      {!isLoading && !error && games.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {games.map((game) => (
            <Link
              key={game._id}
              to={`/content/${game.slug || game._id}`}
              className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-white/10 hover:border-red-500 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_0_30px_rgba(239,68,68,0.35)] flex flex-col justify-end p-4"
            >
              <img
                src={game.thumbnail || game.mediaUrl}
                alt={game.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Info Bar */}
              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-600 text-white">
                    {game.category?.name || 'Gaming'}
                  </span>
                  {game.averageRating > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      {game.averageRating}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-black text-white group-hover:text-red-400 transition-colors line-clamp-1 font-display">
                  {game.title}
                </h3>

                <p className="text-[11px] text-zinc-300 line-clamp-2">
                  {game.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
