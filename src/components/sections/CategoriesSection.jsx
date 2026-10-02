import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryCard from '../cards/CategoryCard';
import { exploreCategoriesData } from '../../data/homepage';

export default function CategoriesSection({ categories = exploreCategoriesData }) {
  const scrollRef = useRef(null);
  const list = categories && categories.length > 0 ? categories : exploreCategoriesData;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300 * direction;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full group/section">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#ff1738] flex items-center justify-center text-white shadow-md shadow-[#ff1738]/30">
            <Layers className="w-4 h-4" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
            Explore <span className="text-[#ff1738]">Categories</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Scroll Prev / Next Buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous categories"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-600 border border-white/10 hover:border-red-500 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next categories"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-600 border border-white/10 hover:border-red-500 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-[#ff1738] transition-colors shrink-0 ml-2"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Horizontal Slider Track */}
      <div
        ref={scrollRef}
        className="flex items-center gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 px-0.5 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {list.map((cat) => (
          <div key={cat.id || cat.slug || cat._id} className="snap-start shrink-0">
            <CategoryCard category={cat} />
          </div>
        ))}
      </div>
    </section>
  );
}
