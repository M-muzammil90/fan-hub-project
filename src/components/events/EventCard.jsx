import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, ExternalLink, Ticket, Flame, Calendar } from 'lucide-react';
import EventStatusBadge from './EventStatusBadge';
import EventTypeBadge from './EventTypeBadge';

const FALLBACK_EVENT_IMAGE = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';

export default function EventCard({ event, onBookTicket }) {
  if (!event) return null;

  const dateObj = new Date(event.startDate);
  const monthName = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    : 'TBA';
  const dayNum = !isNaN(dateObj.getTime()) ? dateObj.getDate() : '';

  const eventIdentifier = event.slug || event._id || event.id;
  const price = event.ticketPrice !== undefined ? event.ticketPrice : 1500;
  const availableTickets = event.availableTickets !== undefined ? event.availableTickets : 100;
  const isSoldOut = availableTickets <= 0;

  const handleBook = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBookTicket) {
      onBookTicket(event);
    }
  };

  return (
    <article className="group relative flex flex-col justify-between rounded-3xl overflow-hidden bg-[#0c0508] border border-white/[0.08] hover:border-red-500/80 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_12px_36px_rgba(255,23,56,0.25)] h-full">
      <div>
        {/* Cinematic Cover Image with Date Badge & Status */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950">
          <img
            src={event.image || event.coverImage || FALLBACK_EVENT_IMAGE}
            alt={event.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => {
              e.target.src = FALLBACK_EVENT_IMAGE;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0508] via-black/30 to-transparent" />

          {/* Top Left: Date Pill */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/50 border border-red-400/40 backdrop-blur-md z-10">
            <span className="text-[10px] font-black uppercase tracking-wider font-mono">
              {monthName}
            </span>
            {dayNum && (
              <span className="text-xs font-black font-mono">
                {dayNum}
              </span>
            )}
          </div>

          {/* Top Right: Status Badge & Distance */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <EventStatusBadge status={event.status || 'Upcoming'} />
          </div>

          {/* Bottom Left Price Badge */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-white font-mono text-xs font-black border border-white/15">
              <Flame className="w-3 h-3 text-red-500" />
              <span>PKR {price.toLocaleString()}</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          {/* Category and Event Type Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-white/[0.06] text-zinc-300 border border-white/10 text-[10px] font-bold uppercase tracking-wider">
              {event.category?.name || 'Fandom'}
            </span>
            <EventTypeBadge type={event.eventType || 'Convention'} />
          </div>

          {/* Event Title */}
          <h3 className="text-base sm:text-lg font-black text-white group-hover:text-red-400 transition-colors line-clamp-1 font-display tracking-tight">
            <Link to={`/events/${eventIdentifier}`}>
              {event.title}
            </Link>
          </h3>

          {/* Venue & City */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="truncate font-medium">
              {event.venue ? `${event.venue}, ` : ''}{event.city}
            </span>
          </div>

          {/* Time */}
          {event.startTime && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="font-mono text-[11px]">
                {event.startTime} {event.endTime ? ` - ${event.endTime}` : ''}
              </span>
            </div>
          )}

          {/* Short Description */}
          {event.description && (
            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-normal pt-1">
              {event.description}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Action Buttons Row */}
      <div className="p-5 pt-0 flex items-center gap-2.5">
        <Link
          to={`/events/${eventIdentifier}`}
          className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5 text-red-400" />
        </Link>

        {onBookTicket && (
          <button
            type="button"
            disabled={isSoldOut}
            onClick={handleBook}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs shadow-lg shadow-red-600/40 flex items-center justify-center gap-1.5 transition-all hover:scale-102 active:scale-98"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{isSoldOut ? 'Sold Out' : 'Book Ticket'}</span>
          </button>
        )}
      </div>
    </article>
  );
}
