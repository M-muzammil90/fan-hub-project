import React from 'react';
import { Ticket, AlertCircle, RefreshCw, FilterX } from 'lucide-react';
import EventCard from './EventCard';

export default function EventGrid({
  events = [],
  isLoading = false,
  error = null,
  onRetry = () => {},
  onClearFilters = null
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="flex flex-col rounded-2xl overflow-hidden bg-[#0b0b0f] border border-white/[0.06] animate-pulse"
          >
            <div className="aspect-[16/10] bg-zinc-900" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-zinc-800 rounded w-1/3" />
              <div className="h-6 bg-zinc-800 rounded w-3/4" />
              <div className="h-3 bg-zinc-800/80 rounded w-1/2" />
              <div className="h-10 bg-zinc-800/40 rounded mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-[#120508] border border-red-500/40 text-center space-y-4 max-w-xl mx-auto shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center mx-auto border border-red-500/30">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-black text-white font-display">
            Unable to Load Events
          </h3>
          <p className="text-xs text-zinc-400">{error}</p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-600/30"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="py-16 px-4 text-center rounded-3xl bg-[#0b0b0f] border border-white/[0.06] space-y-4 max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-center text-zinc-600 mx-auto">
          <Ticket className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-black text-white font-display">No Events Found</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            We couldn't find any events matching your selected criteria. Try changing your search keywords or adjusting your filters.
          </p>
        </div>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-bold transition-colors border border-white/10"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event._id || event.id} event={event} />
      ))}
    </div>
  );
}
