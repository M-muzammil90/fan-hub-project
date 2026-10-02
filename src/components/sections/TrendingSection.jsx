import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';
import TrendingCard from '../cards/TrendingCard';
import { trendingNowData, filterPillsList } from '../../data/homepage';

export default function TrendingSection({ items = trendingNowData }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'All') return true;
    const rawCat = item.categoryFilter ?? item.category ?? '';
    const cat = typeof rawCat === 'object' ? (rawCat?.name || '') : String(rawCat);
    return cat.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <section className="relative w-full">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#ff1738] flex items-center justify-center text-white shadow-md shadow-[#ff1738]/30">
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
            Trending <span className="text-[#ff1738]">now</span>
          </h2>
        </div>

        <Link
          to="/explore"
          className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-[#ff1738] transition-colors shrink-0"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3.5 scrollbar-none">
        {filterPillsList.map((pill) => (
          <button
            key={pill}
            type="button"
            onClick={() => setActiveFilter(pill)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 select-none cursor-pointer ${
              activeFilter === pill
                ? 'bg-[#ff1738] text-white shadow-sm shadow-[#ff1738]/40 scale-100'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Clean Smooth Slider Track (No overlapping side arrow icons) */}
      <div className="flex items-center gap-3.5 overflow-x-auto scrollbar-none pb-2 pt-1 px-0.5 scroll-smooth">
        {filteredItems.length === 0 ? (
          <div className="w-full py-8 text-center text-xs text-zinc-500 font-medium">
            No trending titles in this category.
          </div>
        ) : (
          filteredItems.map((item) => <TrendingCard key={item.id} item={item} />)
        )}
      </div>
    </section>
  );
}
