import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Play, Eye, Clock, Film, AlertCircle, Loader2 } from 'lucide-react';
import { contentApi } from '../services/content.api';

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchVideos = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await contentApi.getContent({
        search: searchQuery || undefined,
        sortBy: 'latest'
      });

      if (res.success) {
        // Filter video/trailer items or all media items with valid mediaUrl
        const list = (res.content || []).filter(
          (item) => item.contentType === 'video' || item.contentType === 'trailer' || item.mediaUrl
        );
        setVideos(list);
      } else {
        setError(res.message || 'Failed to load video collection.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVideos();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e0407] border border-red-500/30 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/40 text-[11px] font-black uppercase tracking-wider">
            <Film className="w-3.5 h-3.5 text-red-500" />
            <span>Video Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
            Trailers, AMVs & <span className="text-red-500">Gameplay Videos</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Stream high quality anime trailers, gameplay walkthroughs and community videos.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos & trailers..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#17060b] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="aspect-video rounded-2xl bg-zinc-900 animate-pulse border border-white/5" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/40 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-sm font-bold text-red-300">{error}</p>
          <button
            onClick={fetchVideos}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && videos.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-[#0d0407] rounded-3xl border border-white/5">
          <Film className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Videos Found</h3>
          <p className="text-xs text-zinc-400">No video media currently available matching search criteria.</p>
        </div>
      )}

      {/* Videos Grid */}
      {!isLoading && !error && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => {
            const isSeries = vid.contentType === 'series' || vid.type === 'series' || vid.seasonsCount !== undefined;
            const targetLink = vid.link || (isSeries ? `/series/${vid.slug || vid._id}` : `/content/${vid.slug || vid._id}`);
            return (
              <Link
                key={vid._id}
                to={targetLink}
                className="group rounded-2xl overflow-hidden border border-white/10 hover:border-red-500 bg-[#0e0407] transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] flex flex-col justify-between select-none"
              >
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  <img
                    src={vid.thumbnail || vid.mediaUrl}
                    alt={vid.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-black uppercase tracking-wider">
                    {vid.contentType || 'Video'}
                  </span>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-black text-white group-hover:text-red-400 transition-colors line-clamp-1 font-display">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {vid.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-red-500" />
                      {vid.viewCount || 0} views
                    </span>
                    <span className="text-red-400 font-bold group-hover:underline">View Details</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
