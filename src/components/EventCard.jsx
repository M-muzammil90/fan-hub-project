import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Sparkles, ArrowRight } from 'lucide-react';

export default function EventCard({ event }) {
  return (
    <div className="group relative rounded-3xl overflow-hidden bg-white dark:bg-[#070204] border border-zinc-200/80 dark:border-red-950/80 hover:border-red-500/60 transition-all duration-300 hover:-translate-y-1.5 shadow-[0_4px_20px_rgba(225,29,72,0.05)] dark:shadow-[0_0_20px_rgba(220,38,38,0.12)] hover:shadow-xl dark:hover:shadow-[0_0_35px_rgba(239,68,68,0.35)] flex flex-col justify-between">
      <div>
        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
          <Link to={`/events/${event.slug}`} className="block w-full h-full">
            <img
              src={event.image}
              alt={event.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </Link>
        

          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-red-300 border border-red-600/30">
              {typeof event.category === 'object'
                ? event.category?.name || 'Fandom Event'
                : event.category || 'Fandom Event'}
            </span>
            {event.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-md shadow-red-600/50">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-red-600/20">
            <span className="inline-flex items-center gap-1.5 font-bold text-red-400">
              <MapPin className="w-3.5 h-3.5" />
              {event.city}
            </span>
            <span className="font-mono text-[11px] text-zinc-300 font-semibold">
              {event.startDate}
            </span>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <Link to={`/events/${event.slug}`}>
            <h4 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors font-display">
              {event.title}
            </h4>
          </Link>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400 pt-1">
            <div className="flex items-center gap-2 truncate">
              <span className="text-zinc-400 dark:text-zinc-500 font-medium">Venue:</span>
              <span className="text-zinc-700 dark:text-zinc-300 truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <Calendar className="w-3.5 h-3.5 text-red-500 dark:text-red-400 shrink-0" />
              <span className="text-zinc-500 dark:text-zinc-400 text-[11px] font-mono">{event.startDate} to {event.endDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <Link
          to={`/events/${event.slug}`}
          className="w-full py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-600 dark:bg-red-950/40 dark:hover:bg-gradient-to-r dark:hover:from-red-600 dark:hover:to-rose-600 text-xs font-bold text-red-600 hover:text-white dark:text-red-300 dark:hover:text-white border border-red-200 dark:border-red-600/30 hover:border-transparent flex items-center justify-center gap-2 shadow-sm transition-all group/btn"
        >
          <span>Get Event Passes</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
