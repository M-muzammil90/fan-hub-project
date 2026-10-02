import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Tv,
  Film,
  Play,
  Star,
  Sparkles,
  Search,
  Filter,
  Layers,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import { seriesApi } from '../services/series.api';
import { categoryApi } from '../services/category.api';
import EmptyState from '../components/EmptyState';
import ContentCard from '../components/ContentCard';

export default function SeriesPage() {
  const [seriesList, setSeriesList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      seriesApi.getSeries({ limit: 100 }),
      categoryApi.getCategories()
    ])
      .then(([seriesRes, catRes]) => {
        if (!isMounted) return;
        setSeriesList(seriesRes.series || []);
        setCategories(catRes.categories || catRes || []);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Failed to load series catalog');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Featured spotlight series
  const featuredSeries = useMemo(() => {
    const featured = seriesList.filter((s) => s.isFeatured);
    return featured.length > 0 ? featured[0] : seriesList[0] || null;
  }, [seriesList]);

  // Filtered & Sorted list
  const filteredSeries = useMemo(() => {
    let list = [...seriesList];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.genres?.some((g) => g.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter((s) => {
        const catId = typeof s.category === 'object' ? s.category?._id : s.category;
        const catSlug = typeof s.category === 'object' ? s.category?.slug : '';
        return catId === selectedCategory || catSlug === selectedCategory;
      });
    }

    if (selectedStatus !== 'all') {
      list = list.filter((s) => s.status === selectedStatus);
    }

    list.sort((a, b) => {
      if (sortBy === 'popular') return (b.viewCount || 0) - (a.viewCount || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'latest') return (b.releaseYear || 0) - (a.releaseYear || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    return list;
  }, [seriesList, searchTerm, selectedCategory, selectedStatus, sortBy]);

  return (
    <div className="w-full space-y-8 pb-16">
      {/* 1. HERO SPOTLIGHT BANNER */}
      {featuredSeries && (
        <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] rounded-3xl overflow-hidden border border-red-500/30 bg-[#070709] shadow-[0_0_50px_rgba(255,20,50,0.18)] group select-none">
          <img
            src={featuredSeries.backdrop || featuredSeries.poster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=85'}
            alt={featuredSeries.title}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-7000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-[#050507]/90 md:via-[#050507]/80 to-transparent/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-3/5 bg-radial from-red-600/20 via-transparent to-transparent pointer-events-none" />

          {/* Foreground Spotlight Content */}
          <div className="relative z-20 h-full flex flex-col justify-between p-6 sm:p-10 max-w-2xl">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-950/50">
                  <Sparkles className="w-3 h-3 fill-current" />
                  <span>SPOTLIGHT SERIES</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-black/60 text-amber-400 border border-amber-500/20">
                  ★ {featuredSeries.rating || '9.0'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-black/60 text-zinc-300 border border-white/10">
                  {featuredSeries.releaseYear || '2024'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display drop-shadow-md">
                {featuredSeries.title}
              </h1>

              <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 max-w-xl leading-relaxed">
                {featuredSeries.description || 'Explore all seasons, sagas, and episodes streaming now.'}
              </p>

              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                <span className="text-red-400 font-mono font-black">{featuredSeries.seasonsCount || 1} Seasons</span>
                <span>•</span>
                <span>{featuredSeries.episodesCount || 0} Episodes Available</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Link
                to={`/series/${featuredSeries.slug || featuredSeries._id}`}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-black shadow-[0_0_30px_rgba(255,23,56,0.6)] flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Watch Series</span>
              </Link>

              <Link
                to={`/series/${featuredSeries.slug || featuredSeries._id}`}
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/15 backdrop-blur-md transition-all hover:scale-105"
              >
                <span>View Seasons & Episodes</span>
                <ArrowRight className="w-4 h-4 ml-1 inline" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. SECTION HEADER & SEARCH FILTER BAR */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Tv className="w-7 h-7 text-red-500" />
              <span>Explore Series & Shows</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Browse anime sagas, multi-season franchises, and episodic web series.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-zinc-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            {filteredSeries.length} Shows Found
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a0a0d] border border-zinc-800/80 p-3.5 rounded-2xl">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search series by title, genre, synopsis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-black/60 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="all">All Realms / Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-black/60 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-black/60 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="latest">Latest Releases</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* 3. SERIES GRID */}
      {isLoading ? (
        <div className="py-24 text-center text-zinc-500">
          <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold uppercase tracking-wider">Loading series collection...</p>
        </div>
      ) : filteredSeries.length === 0 ? (
        <EmptyState
          title="No Series Found"
          message="No matching series found for your current search criteria."
          actionText="Reset All Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('all');
            setSelectedStatus('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {filteredSeries.map((series) => (
            <div key={series._id || series.id} className="h-full">
              <ContentCard
                content={{
                  ...series,
                  contentType: 'series',
                  episodes: series.episodesCount || series.totalEpisodes || 8,
                  totalEpisodes: series.episodesCount || series.totalEpisodes || 8
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
