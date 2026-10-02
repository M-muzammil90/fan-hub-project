import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Flame } from 'lucide-react';
import { eventApi } from '../../services/event.api';

export default function EventHighlights({ limit = 3 }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await eventApi.getUpcomingEvents(limit);
        if (res.success) {
          setEvents(res.events || []);
        }
      } catch (err) {
        console.error('Failed to load event highlights:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHighlights();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-44 rounded-2xl bg-zinc-900/60 border border-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (events.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30">
            <Flame className="w-4 h-4" />
          </span>
          <h2 className="text-xl font-black text-white font-display">Fan Events</h2>
        </div>
        <Link
          to="/events"
          className="text-xs font-black text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map((evt) => {
          const dateObj = new Date(evt.startDate);
          const monthStr = !isNaN(dateObj)
            ? dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase()
            : 'TBA';
          const dayStr = !isNaN(dateObj) ? dateObj.getDate() : '';

          return (
            <div
              key={evt._id || evt.id}
              className="group p-5 rounded-2xl bg-[#0b0b0f] border border-white/[0.08] hover:border-red-500/60 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-[0_8px_24px_rgba(255,23,56,0.18)]"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-black text-red-400">
                    {monthStr} {dayStr}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300">
                    {evt.category?.name || 'Anime'} • {evt.eventType || 'Convention'}
                  </span>
                </div>

                <h3 className="text-sm font-black text-white group-hover:text-red-400 transition-colors line-clamp-1 font-display">
                  {evt.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="truncate">{evt.venue ? `${evt.venue}, ` : ''}{evt.city}</span>
                </div>
              </div>

              <Link
                to={`/events/${evt.slug || evt._id}`}
                className="w-full py-2 px-3 rounded-xl bg-red-600/15 group-hover:bg-red-600 text-xs font-bold text-red-400 group-hover:text-white border border-red-500/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>View Event</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
