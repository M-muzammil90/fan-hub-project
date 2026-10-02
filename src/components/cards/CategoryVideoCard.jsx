import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Play, Heart } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function CategoryVideoCard({ item, onPlay }) {
  const { bookmarks, toggleBookmark } = useData();
  const slug = item.slug || item._id || item.id;
  const isBookmarked = bookmarks?.some((b) => b.contentSlug === slug);

  const isSeries =
    item.contentType === 'series' ||
    item.type === 'series' ||
    item.seasonsCount !== undefined ||
    item.totalEpisodes !== undefined ||
    (item.category &&
      (item.category === 'series' ||
        item.category?.slug === 'series' ||
        item.category?.name?.toLowerCase() === 'series'));
  const link = item.link || (isSeries ? `/series/${slug}` : `/content/${slug}`);

  const rawCat = typeof item.category === 'object' ? item.category?.name : item.category;
  const catBadge = (item.badge || item.contentType || rawCat || 'Movie').toUpperCase();

  const genres = Array.isArray(item.genre) && item.genre.length > 0
    ? item.genre.slice(0, 3)
    : ['Action', 'Adventure', 'Fantasy'];

  const rating = item.rating || item.score || '9.0';
  const duration = item.duration || '2h 20m';
  const image = item.backdrop || item.thumbnail || item.mediaUrl || item.image || 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=800&auto=format&fit=crop&q=80';

  const handlePlayClick = (e) => {
    if (onPlay) {
      e.preventDefault();
      e.stopPropagation();
      onPlay(item);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl overflow-hidden bg-[#0a0b10] border border-white/[0.08] hover:border-red-500/70 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_12px_32px_rgba(255,23,56,0.22)]">
      <div>
        {/* Poster Image Container */}
        <Link to={link} className="block relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
          <img
            src={image}
            alt={item.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-black/20 to-transparent" />

          {/* Top Left: Content Type Badge */}
          <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md shadow-red-600/40">
            {catBadge}
          </span>

          {/* Top Right: Heart Bookmark */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleBookmark(slug);
            }}
            className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              isBookmarked
                ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/50'
                : 'bg-black/50 border-white/15 text-zinc-300 hover:bg-red-600 hover:border-red-500 hover:text-white'
            }`}
            title="Bookmark"
          >
            <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </Link>

        {/* Content Details */}
        <div className="p-4 space-y-2.5">
          {/* Title */}
          <Link to={link} className="block">
            <h3 className="text-sm sm:text-base font-black text-white group-hover:text-red-400 transition-colors line-clamp-1 font-display">
              {item.title}
            </h3>
          </Link>

          {/* Genre Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            {genres.map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-[10px] text-zinc-400 font-semibold"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Rating, Duration & Circular Play Button */}
      <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-white/[0.05]">
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-1 font-bold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-white font-mono">{rating}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
            <Clock className="w-3 h-3 text-zinc-500" />
            <span>{duration}</span>
          </div>
        </div>

        {/* Circular Red Play Button */}
        <button
          type="button"
          onClick={handlePlayClick}
          className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 hover:scale-110 active:scale-95 transition-all group-hover:bg-red-500"
          title="Watch Now"
        >
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        </button>
      </div>
    </div>
  );
}
