import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';

export default function CategoryTrendingCard({ item, onPlay }) {
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
  const image = item.backdrop || item.thumbnail || item.mediaUrl || item.image || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80';
  const rating = item.rating || item.score || '9.0';

  const handlePlay = (e) => {
    if (onPlay) {
      e.preventDefault();
      e.stopPropagation();
      onPlay(item);
    }
  };

  return (
    <div className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-[#0a0b10] border border-white/[0.08] hover:border-red-500/70 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_8px_24px_rgba(255,23,56,0.2)]">
      <Link to={link} className="block relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
        <img
          src={image}
          alt={item.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Center / Overlay Play Button */}
        <button
          type="button"
          onClick={handlePlay}
          className="absolute right-2.5 bottom-2.5 w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 border border-white/20 hover:border-red-500 text-white flex items-center justify-center transition-all opacity-90 group-hover:opacity-100 group-hover:scale-110"
        >
          <Play className="w-3 h-3 fill-current ml-0.5" />
        </button>
      </Link>

      <div className="p-3 space-y-1">
        <Link to={link} className="block">
          <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-red-400 transition-colors line-clamp-1 font-display">
            {item.title}
          </h4>
        </Link>
        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
          <Star className="w-3 h-3 fill-current" />
          <span className="text-zinc-300 font-mono">{rating}</span>
        </div>
      </div>
    </div>
  );
}
