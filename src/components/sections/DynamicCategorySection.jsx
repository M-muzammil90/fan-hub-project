import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Film,
  Gamepad2,
  Clapperboard,
  Tv,
  Music,
  BookOpen,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ContentCard from '../ContentCard';

const iconMap = {
  anime: Film,
  series: Tv,
  movies: Clapperboard,
  movie: Clapperboard,
  dramas: Film,
  drama: Film,
  gaming: Gamepad2,
  games: Gamepad2,
  audio: Music,
  music: Music,
  comics: BookOpen,
  manga: BookOpen,
  cosplay: Sparkles
};

export default function DynamicCategorySection({
  category,
  items = []
}) {
  const scrollRef = useRef(null);

  const rawName = category?.name || category?.title || 'Category';
  const displayName = rawName.toLowerCase().startsWith('popular') ? rawName : `Popular ${rawName}`;
  const catName = displayName;
  const catSlug = category?.slug || category?._id || 'all';
  const slugKey = (catSlug || '').toLowerCase().trim();
  const IconComponent = iconMap[slugKey] || iconMap[Object.keys(iconMap).find((k) => slugKey.includes(k))] || Layers;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320 * direction;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative w-full space-y-4 group/section">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#ff1738] flex items-center justify-center text-white shadow-md shadow-[#ff1738]/30 shrink-0">
            <IconComponent className="w-4 h-4" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
            <span>{displayName}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Scroll Prev / Next Navigation */}
          {items.length > 2 && (
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label={`Previous ${catName}`}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#ff1738] border border-white/10 hover:border-[#ff1738] text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label={`Next ${catName}`}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#ff1738] border border-white/10 hover:border-[#ff1738] text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <Link
            to={`/category/${catSlug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-[#ff1738] transition-colors shrink-0 ml-1.5"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Responsive Horizontal Slider / Grid Track */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 px-0.5 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, idx) => (
          <div
            key={item._id || item.id || `${catSlug}-${idx}`}
            className="w-[185px] sm:w-[200px] md:w-[210px] lg:w-[220px] shrink-0 snap-start flex"
          >
            <ContentCard content={item} />
          </div>
        ))}
      </div>
    </section>
  );
}

