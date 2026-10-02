import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Film, Star, Play, Filter, AlertCircle, Sparkles } from 'lucide-react';
import { contentApi } from '../services/content.api';
import ContentCard from '../components/ContentCard';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('latest');

  const genres = ['All', 'Action', 'Sci-Fi', 'Fantasy', 'Adventure', 'Drama', 'Thriller', 'Animation'];

  const fetchMovies = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await contentApi.getContent({
        contentType: 'video',
        genre: selectedGenre !== 'All' ? selectedGenre : undefined,
        search: searchQuery.trim() || undefined,
        sortBy: sortBy
      });

      if (res.success) {
        setMovies(res.content || []);
      } else {
        setError(res.message || 'Failed to load movies.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedGenre, sortBy]);

  const featuredMovie = movies.find((m) => m.isFeatured) || movies[0];

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Sleek Cinematic Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[220px] sm:min-h-[260px] bg-[#070204] border border-red-500/30 shadow-2xl flex items-center p-6 sm:p-10">
        {featuredMovie && (
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={featuredMovie.thumbnail || featuredMovie.mediaUrl || 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=1600'}
              alt={featuredMovie.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter saturate-110 contrast-105 opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070204] via-[#070204]/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070204] via-transparent to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/40 text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
            <Film className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>Cinematic Showcase</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display leading-tight">
            Movies & <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">Blockbusters</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed max-w-xl line-clamp-2">
            Stream iconic films, blockbuster anime sagas, and cinematic trailers directly from our database.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0d0407] border border-zinc-200 dark:border-white/10 shadow-lg">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies by title..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-[#120509] border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors shadow-inner"
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
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/40'
                  : 'bg-zinc-100 dark:bg-[#120509] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-white/5'
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
            className="px-3 py-2 bg-zinc-100 dark:bg-[#120509] border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-red-500 font-bold"
          >
            <option value="latest">Latest Released</option>
            <option value="popular">Most Popular</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <div key={n} className="aspect-[2/3] rounded-3xl bg-zinc-900/60 border border-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {/* Error Banner */}
      {error && !isLoading && (
        <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/40 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-sm font-bold text-red-300">{error}</p>
          <button
            onClick={fetchMovies}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && movies.length === 0 && (
        <div className="py-20 text-center space-y-3 bg-[#0d0407] rounded-3xl border border-white/5">
          <Film className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Movies Found</h3>
          <p className="text-xs text-zinc-400">Try adjusting your search query or genre filters.</p>
        </div>
      )}

      {/* 5-Card Responsive Layout (5 on Desktop, 3-4 on Tablet, 2 on Mobile) */}
      {!isLoading && !error && movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <div key={movie._id} className="h-full">
              <ContentCard content={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
