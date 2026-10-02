import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Sparkles, Flame, Ticket } from 'lucide-react';
import { eventApi } from '../../services/event.api';

export default function EventBanner({ data }) {
  const [featuredEvent, setFeaturedEvent] = useState(data || null);

  useEffect(() => {
    if (!data) {
      eventApi
        .getFeaturedEvents(1)
        .then((res) => {
          const list = res.events || res || [];
          if (list.length > 0) {
            setFeaturedEvent(list[0]);
          }
        })
        .catch(() => {
          // keep existing if any
        });
    } else {
      setFeaturedEvent(data);
    }
  }, [data]);

  if (!featuredEvent) return null;

  const startDateObj = featuredEvent.startDate ? new Date(featuredEvent.startDate) : null;
  const month = startDateObj && !isNaN(startDateObj.getTime())
    ? startDateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    : (featuredEvent.month || 'OCT');

  const day = startDateObj && !isNaN(startDateObj.getTime())
    ? String(startDateObj.getDate()).padStart(2, '0')
    : (featuredEvent.day || '26');

  const slug = featuredEvent.slug || featuredEvent._id || featuredEvent.id;
  const ticketLink = slug ? `/events/${slug}` : (featuredEvent.ticketLink || '/events');
  const price = featuredEvent.ticketPrice !== undefined ? featuredEvent.ticketPrice : 1500;

  const image = featuredEvent.image || featuredEvent.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=85';

  return (
    <section className="relative w-full space-y-3.5">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">Grand Event</span>
          </h2>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-red-400 transition-colors shrink-0"
        >
          <span>All Events</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Feature Event Banner */}
      <div className="group relative w-full rounded-3xl overflow-hidden border border-red-500/30 bg-[#0d0407] p-6 sm:p-8 transition-all duration-500 hover:border-red-500 hover:shadow-[0_0_40px_rgba(255,20,50,0.25)] select-none">
        {/* Background Image */}
        <img
          src={image}
          alt={featuredEvent.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-35 filter saturate-110"
        />

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070204] via-[#070204]/90 to-[#070204]/70" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Content Row */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Date Box + Details */}
          <div className="flex items-center sm:items-center gap-4 sm:gap-6">
            {/* Red Date Box */}
            <div className="flex flex-col items-center justify-center w-14 h-16 sm:w-16 sm:h-18 rounded-2xl bg-gradient-to-b from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/40 shrink-0 border border-white/20">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider leading-none font-mono">
                {month}
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-tight leading-none mt-1 font-mono">
                {day}
              </span>
            </div>

            {/* Title & Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-[9px] font-black text-white uppercase tracking-wider">
                  FEATURED EVENT
                </span>
                <span className="text-xs font-mono font-bold text-red-400">
                  PKR {price.toLocaleString()}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight font-display">
                {featuredEvent.title}
              </h3>

              <p className="text-xs sm:text-sm text-zinc-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{featuredEvent.venue ? `${featuredEvent.venue}, ` : ''}{featuredEvent.city || 'Karachi'}</span>
              </p>
            </div>
          </div>

          {/* Right: CTA Button */}
          <div className="shrink-0 flex items-center self-start md:self-center">
            <Link
              to={ticketLink}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-xl shadow-red-600/40 hover:shadow-red-600/60 transition-all hover:scale-105 active:scale-95 border border-red-400/40"
            >
              <Ticket className="w-4 h-4" />
              <span>Get Event Passes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
