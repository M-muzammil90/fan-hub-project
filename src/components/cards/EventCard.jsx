import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, ArrowRight, Sparkles, Flame } from 'lucide-react';

const FALLBACK_EVENT_IMAGE = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80';

export default function EventCard({ event, onBookTicket }) {
  if (!event) return null;

  const eventSlug = event.slug || event._id || event.id;
  const eventLink = `/events/${eventSlug}`;
  const catName = typeof event.category === 'object' ? (event.category?.name || 'Anime') : (event.category || 'Convention');

  const startDateObj = event.startDate ? new Date(event.startDate) : null;
  const formattedDate = startDateObj && !isNaN(startDateObj.getTime())
    ? startDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Upcoming';

  const month = startDateObj && !isNaN(startDateObj.getTime())
    ? startDateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    : 'OCT';

  const day = startDateObj && !isNaN(startDateObj.getTime())
    ? String(startDateObj.getDate()).padStart(2, '0')
    : '18';

  const price = event.ticketPrice !== undefined ? event.ticketPrice : 1500;
  const availableTickets = event.availableTickets !== undefined ? event.availableTickets : 100;
  const isSoldOut = availableTickets <= 0;

  const handleBookClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBookTicket) {
      onBookTicket(event);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between w-full h-full rounded-3xl overflow-hidden bg-[#0c0508] border border-white/10 hover:border-red-500/80 shadow-xl hover:shadow-[0_12px_40px_rgba(255,23,56,0.28)] transition-all duration-500 hover:-translate-y-1.5 select-none">
      {/* Top 16:9 Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950">
        <img
          src={event.image || event.coverImage || FALLBACK_EVENT_IMAGE}
          alt={event.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            e.target.src = FALLBACK_EVENT_IMAGE;
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0508] via-black/30 to-transparent" />

        {/* Floating Top Left Date Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/50 border border-red-400/40 backdrop-blur-md">
          <span className="text-[10px] font-black uppercase tracking-wider">{month}</span>
          <span className="font-mono font-black text-xs">{day}</span>
        </div>

        {/* Floating Top Right Category & Availability */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-red-300 border border-red-500/30 text-[10px] font-black uppercase tracking-wider">
            {catName}
          </span>
        </div>

        {/* Floating Bottom Left Price Pill */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-white font-mono text-xs font-black border border-white/15">
            <Flame className="w-3 h-3 text-red-500" />
            <span>PKR {price.toLocaleString()}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Title */}
          <Link to={eventLink} className="block">
            <h3 className="text-base sm:text-lg font-black text-white group-hover:text-red-400 transition-colors line-clamp-1 font-display leading-snug">
              {event.title}
            </h3>
          </Link>

          {/* Location & Time */}
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="truncate">
              {event.venue ? `${event.venue}, ` : ''}{event.city || 'Karachi'}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {event.description || 'Join fellow fans for exclusive previews, panels, cosplay competitions and live performances.'}
          </p>
        </div>

        {/* Action Buttons Row: View Event + Book Ticket */}
        <div className="pt-3 border-t border-white/5 flex items-center gap-2.5">
          <Link
            to={eventLink}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-400" />
          </Link>

          <button
            type="button"
            disabled={isSoldOut}
            onClick={handleBookClick}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs shadow-lg shadow-red-600/40 flex items-center justify-center gap-1.5 transition-all hover:scale-102 active:scale-98"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{isSoldOut ? 'Sold Out' : 'Book Ticket'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
