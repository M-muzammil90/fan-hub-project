import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Play, ArrowRight, Bell, Check } from 'lucide-react';

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80';

export default function UpcomingReleaseCard({ item }) {
  const [isReminded, setIsReminded] = useState(false);

  if (!item) return null;

  const slug = item.slug || item._id || item.id;
  const isSeries =
    item.contentType === 'series' ||
    item.type === 'series' ||
    item.seasonsCount !== undefined ||
    (item.category &&
      (item.category === 'series' ||
        item.category?.slug === 'series' ||
        item.category?.name?.toLowerCase() === 'series'));
  const link = item.link || (isSeries ? `/series/${slug}` : `/content/${slug}`);
  const poster = item.thumbnail || item.poster || item.backdrop || item.mediaUrl || item.image || FALLBACK_POSTER;

  const rawDate = item.releaseDate || item.date;
  const dateObj = rawDate ? new Date(rawDate) : null;
  const isDateValid = dateObj && !isNaN(dateObj.getTime());

  // Extracted Month & Day for the Calendar Block
  const monthAbbr = isDateValid
    ? dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    : 'TBA';
  const dayNum = isDateValid ? dateObj.getDate() : '—';
  const formattedDate = isDateValid
    ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Coming Soon';

  const catName = typeof item.category === 'object'
    ? item.category?.name || 'ANIME'
    : item.category || (item.contentType ? item.contentType.toUpperCase() : 'ANIME');

  const genres = Array.isArray(item.genre)
    ? item.genre.slice(0, 2)
    : Array.isArray(item.genres)
      ? item.genres.slice(0, 2)
      : [typeof item.genre === 'string' ? item.genre : 'Action'];

  const handleRemind = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsReminded((prev) => !prev);
  };

  return (
    <div className="group relative flex flex-col justify-between w-full h-full rounded-2xl overflow-hidden bg-[#0A0D14] border border-white/[0.08] hover:border-red-500/70 shadow-lg hover:shadow-[0_8px_30px_rgba(255,23,68,0.22)] transition-all duration-300 hover:-translate-y-1 select-none">
      {/* Poster Image Container */}
      <Link to={link} className="block relative h-[180px] sm:h-[200px] w-full overflow-hidden bg-zinc-950">
        <img
          src={poster}
          alt={item.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_POSTER;
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-black/20 to-black/30 pointer-events-none" />

        {/* Top Left: Sleek Calendar Block */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <div className="flex flex-col items-center justify-center rounded-xl bg-black/85 backdrop-blur-md border border-white/15 overflow-hidden min-w-[42px] shadow-md">
            <span className="w-full text-center px-1.5 py-0.5 bg-gradient-to-r from-red-600 to-rose-600 text-[8.5px] font-black text-white uppercase tracking-wider">
              {monthAbbr}
            </span>
            <span className="text-xs sm:text-sm font-black text-white font-mono py-0.5 px-1 leading-none">
              {dayNum}
            </span>
          </div>
        </div>

        {/* Top Right: Category Tag */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-red-400 border border-red-500/30 text-[9px] font-extrabold uppercase tracking-wider">
            {catName}
          </span>
        </div>

        {/* Play Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
          <div className="w-10 h-10 rounded-full bg-[#FF1744] text-white flex items-center justify-center shadow-lg shadow-red-600/50 scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-4 h-4 fill-white text-white ml-0.5" />
          </div>
        </div>
      </Link>

      {/* Info Body */}
      <div className="p-3 space-y-2 bg-[#0A0D14] flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Release Date Label */}
          <div className="flex items-center gap-1 text-[9.5px] font-bold text-red-400">
            <Calendar className="w-3 h-3 text-red-500 shrink-0" />
            <span>{formattedDate}</span>
          </div>

          {/* Title */}
          <Link to={link} className="block">
            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 leading-tight font-display">
              {item.title}
            </h3>
          </Link>

          {/* Genres */}
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            {genres.map((g) => (
              <span
                key={g}
                className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-[9px] text-zinc-400 font-medium"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-white/[0.06]">
          <Link
            to={link}
            className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-red-600 border border-white/10 hover:border-red-500 text-white font-bold text-[10.5px] flex items-center justify-center gap-1 transition-all text-center group/btn"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3 text-red-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>

          <button
            type="button"
            onClick={handleRemind}
            title={isReminded ? 'Reminder set' : 'Remind me on release'}
            className={`p-1.5 rounded-lg border text-xs flex items-center justify-center transition-all shrink-0 cursor-pointer ${
              isReminded
                ? 'bg-red-600/30 border-red-500 text-red-400'
                : 'bg-white/5 hover:bg-white/15 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            {isReminded ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

