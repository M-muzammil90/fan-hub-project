import React, { useState, useEffect } from 'react';
import { Flame, Search, AlertCircle, RefreshCw, Layers, Sparkles } from 'lucide-react';
import { categoryApi } from '../services/category.api';
import CategoryCard from '../components/CategoryCard';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryApi.getCategories();
      if (response && response.categories) {
        setCategories(response.categories);
      } else if (Array.isArray(response)) {
        setCategories(response);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError(err.message || 'Unable to load categories from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filterTabs = [
    { label: 'All Universes', value: 'All' },
    { label: 'Anime & Manga', value: 'Anime' },
    { label: 'Gaming', value: 'Gaming' },
    { label: 'Movies & TV', value: 'Movies' },
    { label: 'Cosplay & Pop', value: 'Cosplay' }
  ];

  const filteredCategories = categories.filter((cat) => {
    const nameStr = cat.name ? cat.name.toLowerCase() : '';
    const descStr = cat.description ? cat.description.toLowerCase() : '';
    const searchLower = searchTerm.toLowerCase().trim();

    const matchesSearch = nameStr.includes(searchLower) || descStr.includes(searchLower);
    if (!matchesSearch) return false;

    if (activeFilter === 'All') return true;
    const slug = cat.slug ? cat.slug.toLowerCase() : '';
    if (activeFilter === 'Anime') return slug.includes('anime') || slug.includes('manga');
    if (activeFilter === 'Gaming') return slug.includes('gaming') || slug.includes('game');
    if (activeFilter === 'Movies') return slug.includes('movie') || slug.includes('tv');
    if (activeFilter === 'Cosplay') return slug.includes('cosplay') || slug.includes('k-pop') || slug.includes('comic');
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-10 pb-8 sm:pb-14 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero Banner: Customized to 1329x460 Aspect Ratio with Background Image */}
      <div className="relative rounded-3xl overflow-hidden border border-red-500/30 bg-[#090b14] min-h-[300px] md:min-h-[400px] lg:min-h-[460px] flex items-center p-6 sm:p-12 lg:p-16 shadow-2xl">
        {/* Background Banner Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=80"
            alt="Fandom Multiverse Banner"
            className="w-full h-full object-cover object-center scale-105 filter brightness-75 transition-transform duration-1000"
          />
          {/* Dark Aesthetic Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070913] via-[#070913]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-transparent to-black/50" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
            <Flame className="w-4 h-4 text-red-500 fill-current animate-pulse" />
            <span>Fandom Multiverse Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-display leading-tight">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-400">Fandom Categories</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium max-w-xl">
            Dive into real database categories for Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga, and Cosplay. Explore interconnected characters, lore, and global events.
          </p>

          <div className="pt-2 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories (e.g. Anime, Gaming, Movies)..."
                className="w-full pl-11 pr-4 py-3 bg-black/70 border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 backdrop-blur-md transition-all shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Real Counter */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === tab.value
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-[#0c101d] text-zinc-400 hover:text-white border border-white/10 hover:bg-[#181120]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-zinc-400 font-bold">
          Showing <span className="text-red-400">{filteredCategories.length}</span> of {categories.length} Categories
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-[280px] rounded-2xl bg-[#090e1c] border border-white/5 animate-pulse p-5 flex flex-col justify-between"
            >
              <div className="w-24 h-6 bg-white/10 rounded-full" />
              <div className="space-y-3">
                <div className="w-3/4 h-6 bg-white/10 rounded-md" />
                <div className="w-full h-4 bg-white/5 rounded-md" />
                <div className="w-1/2 h-4 bg-white/5 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="rounded-3xl bg-red-950/30 border border-red-500/30 p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Unable to load categories</h3>
            <p className="text-xs text-zinc-400">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchCategories}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-600/30"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && filteredCategories.length === 0 && (
        <div className="rounded-3xl bg-[#090e1c] border border-white/10 p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No categories found</h3>
            <p className="text-xs text-zinc-400">
              {searchTerm ? `No category matches "${searchTerm}"` : 'There are no active categories in the database.'}
            </p>
          </div>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* REAL DATA DISPLAY */}
      {!loading && !error && filteredCategories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => (
            <CategoryCard key={cat._id || cat.id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
