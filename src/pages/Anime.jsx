import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Star, Play, Filter, Flame, AlertCircle } from 'lucide-react';
import { contentApi } from '../services/content.api';
import ContentCard from '../components/ContentCard';

export default function Anime() {
  const [animeList, setAnimeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('latest');

  const genres = ['All', 'Shonen', 'Action', 'Isekai', 'Fantasy', 'Romance', 'Sci-Fi', 'Supernatural'];

  const fetchAnime = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await contentApi.getContent({
        genre: selectedGenre !== 'All' ? selectedGenre : undefined,
        search: searchQuery || undefined,
        sortBy: sortBy
      });

      if (res.success) {
        setAnimeList(res.content || []);
      } else {
        setError(res.message || 'Failed to load anime collection.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAnime();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedGenre, sortBy]);

  const topPopular = animeList.slice().sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Sleek Compact Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[200px] sm:min-h-[240px] p-6 sm:p-8 border border-red-500/30 bg-white dark:bg-gradient-to-br dark:from-[#140508] dark:via-[#090b10] dark:to-[#040203] shadow-xl flex items-center">
        <div className="relative z-20 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 dark:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-500/30 text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-current text-red-500" />
            <span>Anime Universe</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight font-display leading-tight">
            Explore <span className="text-red-600 dark:text-red-500">Anime & Series</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed max-w-xl">
            Stream anime sagas, episodes, character lore, and releases.
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
            placeholder="Search anime by title or character..."
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
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
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
            onClick={fetchAnime}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Anime Grid */}
      {!isLoading && !error && animeList.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-zinc-50 dark:bg-[#0d0407] rounded-3xl border border-zinc-200 dark:border-white/5">
          <Sparkles className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No Anime Found</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Try adjusting your search or genre filters.</p>
        </div>
      )}

      {!isLoading && !error && animeList.length > 0 && (
        <div className="space-y-8">
          {/* Top Trending Horizontal Section */}
          {topPopular.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2 font-display">
                <Flame className="w-4 h-4 text-red-500 fill-current" />
                <span>Trending Anime Releases</span>
              </h2>

              <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
                {topPopular.slice(0, 6).map((item) => (
                  <Link
                    key={item._id}
                    to={`/content/${item.slug || item._id}`}
                    className="shrink-0 w-44 sm:w-52 aspect-[2/3] relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-white/10 hover:border-red-500 transition-all group p-4 flex flex-col justify-end shadow-md"
                  >
                    <img
                      src={item.thumbnail || item.mediaUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    
                    <div className="relative z-10 space-y-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-600 text-white">
                        {item.category?.name || 'Anime'}
                      </span>
                      <h4 className="text-xs font-bold text-white group-hover:text-red-400 truncate font-display">
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Anime Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-white font-display">All Anime Catalog</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {animeList.map((item) => (
                <div key={item._id || item.id} className="h-full">
                  <ContentCard content={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
