import React, { useState, useEffect } from 'react';
import { Search, Image as ImageIcon, Download, Maximize2, X, AlertCircle } from 'lucide-react';
import { contentApi } from '../services/content.api';

export default function Wallpapers() {
  const [wallpapers, setWallpapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const fetchWallpapers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await contentApi.getContent({
        search: searchQuery || undefined,
        sortBy: 'latest'
      });

      if (res.success) {
        const list = (res.content || []).filter(
          (item) => item.contentType === 'image' || item.thumbnail || item.mediaUrl
        );
        setWallpapers(list);
      } else {
        setError(res.message || 'Failed to load wallpapers.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWallpapers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDownload = (imageUrl, fileName) => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = fileName || 'fanhub_wallpaper.jpg';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border border-red-500/30 bg-white dark:bg-gradient-to-br dark:from-[#140508] dark:via-[#090b10] dark:to-[#040203] shadow-xl dark:shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 dark:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-500/30 text-[11px] font-black uppercase tracking-wider">
              <ImageIcon className="w-3.5 h-3.5 text-red-500" />
              <span>Visual Gallery</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white font-display">
              HD Fandom <span className="text-red-600 dark:text-red-500">Wallpapers & Art</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-medium">
              Browse and download high-resolution anime, gaming, and movie wallpapers.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wallpapers..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-[#16060a] border border-zinc-200 dark:border-white/10 rounded-2xl text-xs text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="aspect-[3/4] rounded-2xl bg-zinc-200 dark:bg-zinc-900 animate-pulse border border-zinc-300 dark:border-white/5" />
          ))}
        </div>
      )}

      {/* Error Banner */}
      {error && !isLoading && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/40 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-sm font-bold text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={fetchWallpapers}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && wallpapers.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-zinc-50 dark:bg-[#0d0407] rounded-3xl border border-zinc-200 dark:border-white/5">
          <ImageIcon className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No Wallpapers Found</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">No images match your search terms.</p>
        </div>
      )}

      {/* Wallpaper Gallery Grid */}
      {!isLoading && !error && wallpapers.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {wallpapers.map((item) => {
            const imgSrc = item.thumbnail || item.mediaUrl;
            return (
              <div
                key={item._id}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-white/10 hover:border-red-500 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_0_30px_rgba(239,68,68,0.35)] flex flex-col justify-end p-4"
              >
                <img
                  src={imgSrc}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Hover overlay actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewImage(item)}
                    className="p-3 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg transition-transform hover:scale-110"
                    title="Fullscreen Preview"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(imgSrc, `${item.title}.jpg`)}
                    className="p-3 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 shadow-lg transition-transform hover:scale-110"
                    title="Download Wallpaper"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative z-10 space-y-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-600 text-white">
                    {item.category?.name || 'Wallpaper'}
                  </span>
                  <h3 className="text-xs font-bold text-white truncate font-display">
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Wallpaper Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center justify-center space-y-4">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 z-50 p-2 rounded-full bg-white/10 hover:bg-red-600 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={previewImage.thumbnail || previewImage.mediaUrl}
              alt={previewImage.title}
              className="max-h-[75vh] w-auto object-contain rounded-2xl border border-white/10 shadow-2xl"
            />

            <div className="flex items-center justify-between w-full max-w-xl px-4 py-3 rounded-2xl bg-zinc-900 dark:bg-[#14060a] border border-white/10 text-white">
              <div>
                <h4 className="text-sm font-bold truncate">{previewImage.title}</h4>
                <p className="text-xs text-zinc-400">{previewImage.category?.name || 'Fandom Wallpaper'}</p>
              </div>

              <button
                type="button"
                onClick={() => handleDownload(previewImage.thumbnail || previewImage.mediaUrl, `${previewImage.title}.jpg`)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Wallpaper</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
