import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AutoSlider({
  children,
  itemClassName = 'w-[240px] sm:w-[260px] shrink-0',
  className = ''
}) {
  const scrollRef = useRef(null);

  const scrollByCard = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstChild = el.querySelector(':scope > div');
    const amount = firstChild ? firstChild.clientWidth + 16 : 280;
    el.scrollBy({ left: amount * direction, behavior: 'smooth' });
  };

  return (
    <div className={`relative isolate w-full ${className}`}>
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        className="hidden md:flex absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-1 w-9 h-9 items-center justify-center rounded-full bg-black/80 border border-white/15 text-white hover:bg-red-600 transition-colors"
        aria-label="Scroll previous"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        className="hidden md:flex absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1 w-9 h-9 items-center justify-center rounded-full bg-black/80 border border-white/15 text-white hover:bg-red-600 transition-colors"
        aria-label="Scroll next"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-none pb-2 px-0.5 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {React.Children.map(children, (child, idx) => (
          <div key={idx} className={`snap-start ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
