import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight, Sparkles, AlertCircle, Film } from 'lucide-react';
import ReleaseCard from '../cards/ReleaseCard';
import { contentApi } from '../../services/content.api';

export default function ReleasesSection({ initialReleases }) {
  const [releases, setReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch upcoming releases from database API
  useEffect(() => {
    setIsLoading(true);
    setError('');

    contentApi
      .getUpcoming({ limit: 12 })
      .then((res) => {
        const list = res.upcoming || res.content || res || [];
        setReleases(list);
      })
      .catch((err) => {
        console.error('Error fetching upcoming releases:', err);
        setError('Failed to load upcoming releases.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.querySelector('.release-slide-card')?.clientWidth || 220;
      sliderRef.current.scrollBy({ left: -(cardWidth + 18) * 2, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.querySelector('.release-slide-card')?.clientWidth || 220;
      sliderRef.current.scrollBy({ left: (cardWidth + 18) * 2, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-red-600/40">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-red-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Calendar Schedule</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
              Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">Releases</span>
            </h2>
          </div>
        </div>

        {/* Right Slider Arrow Controls & View all Link */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent text-white flex items-center justify-center transition-all"
              aria-label="Previous releases"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              disabled={!canScrollRight}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent text-white flex items-center justify-center transition-all"
              aria-label="Next releases"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white transition-all shrink-0"
          >
            <span>All Releases</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-500" />
          </Link>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="aspect-[2/3] rounded-3xl bg-zinc-900/60 border border-white/5 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-8 rounded-3xl bg-red-950/30 border border-red-500/30 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-xs font-bold text-red-300">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && releases.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-[#0d0407] rounded-3xl border border-white/5">
          <Film className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No upcoming releases available.</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Stay tuned! Upcoming anime movies, episodes, and series premieres will appear here soon.
          </p>
        </div>
      )}

      {/* Horizontal Slider Track (Mouse & Touch Responsive) */}
      {!isLoading && !error && releases.length > 0 && (
        <div className="relative">
          <div
            ref={sliderRef}
            onScroll={checkScrollButtons}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scrollbar-none pb-4 pt-1 px-1 scroll-smooth snap-x snap-mandatory"
          >
            {releases.map((item) => (
              <div
                key={item._id || item.id || item.slug}
                className="release-slide-card snap-start shrink-0 w-[170px] sm:w-[200px] md:w-[220px] lg:w-[230px]"
              >
                <ReleaseCard item={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
