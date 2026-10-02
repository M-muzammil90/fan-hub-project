import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Flame,
  ArrowRight,
  Sparkles,
  Ticket,
  AlertCircle
} from 'lucide-react';
import { eventApi } from '../../services/event.api';
import TicketBookingModal from '../events/TicketBookingModal';

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBookingEvent, setSelectedBookingEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setError('');

    eventApi
      .getEvents({ isPublished: true, limit: 6 })
      .then((res) => {
        const list = res.events || res || [];
        setEvents(list);
      })
      .catch((err) => {
        console.error('Error loading events:', err);
        setError('Failed to load upcoming events.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Format date for badge
  const formatDateBadge = (dateStr) => {
    if (!dateStr) return 'Nov 10, 2026';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Extract month and day for small square badge
  const getShortMonthDay = (dateStr) => {
    if (!dateStr) return { month: 'NOV', day: '10' };
    const d = new Date(dateStr);
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    return { month, day };
  };

  // Helper for category badge color
  const getCategoryColor = (catName) => {
    const text = (catName || '').toString().toLowerCase();
    if (text.includes('gaming')) return 'bg-red-600 text-white';
    if (text.includes('tv') || text.includes('series') || text.includes('show')) return 'bg-red-600 text-white';
    if (text.includes('movie')) return 'bg-red-600 text-white';
    return 'bg-red-600 text-white';
  };

  const featuredEvent = events.find((e) => e.isFeatured) || events[0] || {
    _id: 'featured-default',
    slug: 'animecon-karachi-2026',
    title: 'AnimeCon Karachi 2026',
    category: { name: 'ANIME' },
    description: 'The largest convention for anime fans in Karachi. Voice actors, cosplay competitions, and live orchestra.',
    startDate: '2026-11-10T10:00:00.000Z',
    venue: 'Expo Centre Karachi, University Road, Gulshan-e-Iqbal, Karachi',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80'
  };

  const sideEvents = events.filter((e) => e._id !== featuredEvent._id).slice(0, 3);
  const displaySideEvents = sideEvents.length >= 3 ? sideEvents : [
    ...sideEvents,
    {
      _id: 'side-1',
      slug: 'lahore-gaming-league',
      title: 'Lahore Gaming League Championship',
      category: { name: 'GAMING' },
      startDate: '2026-12-01T10:00:00.000Z',
      venue: 'Nishat Hotel Convention Hall, Emporium Mall, Lahore',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80'
    },
    {
      _id: 'side-2',
      slug: 'peaky-blinders-fan-meetup',
      title: 'Peaky Blinders Fan Meetup & Screening',
      category: { name: 'TV SHOWS' },
      startDate: '2026-12-01T17:00:00.000Z',
      venue: 'Thandi Sarak, Saddar, Hyderabad',
      image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=500&auto=format&fit=crop&q=80'
    },
    {
      _id: 'side-3',
      slug: 'stranger-things-experience',
      title: 'Stranger Things Upside Down Night',
      category: { name: 'TV SHOWS' },
      startDate: '2026-09-27T18:00:00.000Z',
      venue: 'Aptech Computer Education - Metro Star Gate, Karachi',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80'
    }
  ].slice(0, 3);

  return (
    <section className="relative w-full space-y-4">
      {/* Header Row (Exact Image 3 Layout) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ff1738] flex items-center justify-center text-white shadow-md shadow-[#ff1738]/40">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
              Fandom <span className="text-[#ff1738]">Events</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Meet legendary creators, participate in cosplay championships & experience live fandom summits!
          </p>
        </div>

        {/* Explore All Events CTA Button (Navigates to /events) */}
        <Link
          to="/events"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#ff1738] hover:bg-red-500 text-white font-black text-xs sm:text-sm shadow-[0_4px_25px_rgba(255,23,56,0.4)] hover:scale-105 active:scale-95 transition-all shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <span>Explore All Events</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main Split Grid (Exact Image 3 Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* =====================================================================
            LEFT COLUMN: LARGE FEATURED EVENT CARD (8 COLS)
        ===================================================================== */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-[#0c0d14] border border-white/10 p-5 sm:p-7 shadow-2xl flex flex-col justify-between group hover:border-red-500/50 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Big Poster Image */}
            <div className="md:col-span-5 relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-lg">
              <img
                src={featuredEvent.image || featuredEvent.thumbnail || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80'}
                alt={featuredEvent.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Top-Left Featured Pill */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-red-950/60 border border-red-400/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>FEATURED EVENT</span>
                </span>
              </div>
            </div>

            {/* Right Event Content Details */}
            <div className="md:col-span-7 space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                {/* Category Label with Flame */}
                <div className="flex items-center gap-1.5 text-xs font-black text-red-500 uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{typeof featuredEvent.category === 'object' ? (featuredEvent.category?.name || 'ANIME') : (featuredEvent.category || 'ANIME')}</span>
                </div>

                {/* Big Title */}
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display group-hover:text-red-400 transition-colors leading-tight">
                  {featuredEvent.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-3">
                  {featuredEvent.description || 'The largest convention for anime fans in Karachi. Voice actors, cosplay competitions, and live orchestra performances.'}
                </p>

                {/* Date Row */}
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 pt-1">
                  <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{formatDateBadge(featuredEvent.startDate)}</span>
                </div>

                {/* Location Row */}
                <div className="flex items-start gap-2 text-xs text-zinc-400">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{featuredEvent.venue || featuredEvent.city || 'Expo Centre Karachi, University Road, Gulshan-e-Iqbal, Karachi'}</span>
                </div>
              </div>

              {/* View Event Details Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/events/${featuredEvent.slug || featuredEvent._id}`)}
                  className="w-full py-3.5 px-6 rounded-full bg-[#ff1738] hover:bg-red-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(255,23,56,0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>View Event Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN: 3 STACKED COMPACT EVENT CARDS (4 COLS)
        ===================================================================== */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-3.5">
          {displaySideEvents.map((evt, idx) => {
            const catName = typeof evt.category === 'object' ? (evt.category?.name || 'EVENT') : (evt.category || 'EVENT');
            const { month, day } = getShortMonthDay(evt.startDate);
            const thumb = evt.image || evt.thumbnail || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80';

            return (
              <div
                key={evt._id || idx}
                onClick={() => navigate(`/events/${evt.slug || evt._id}`)}
                className="group relative flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0c0d14] border border-white/10 hover:border-red-500/60 shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex-1"
              >
                {/* Square Thumbnail with Date Badge */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-white/10">
                  <img
                    src={thumb}
                    alt={evt.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                  {/* Date Badge on Bottom of Thumbnail */}
                  <div className="absolute bottom-1 left-1 right-1">
                    <span className="block px-1.5 py-0.5 rounded bg-white text-zinc-950 font-mono font-black text-[9px] text-center shadow">
                      {month} {day}
                    </span>
                  </div>
                </div>

                {/* Right Text Details */}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[8.5px] font-black uppercase bg-[#ff1738] text-white shadow-sm">
                    {catName}
                  </span>

                  <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-red-400 transition-colors truncate font-display">
                    {evt.title}
                  </h4>

                  <p className="text-[10px] text-zinc-400 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span>{evt.venue || evt.city || 'Karachi, Pakistan'}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticket Booking Modal if triggered directly */}
      {selectedBookingEvent && (
        <TicketBookingModal
          isOpen={!!selectedBookingEvent}
          onClose={() => setSelectedBookingEvent(null)}
          event={selectedBookingEvent}
        />
      )}
    </section>
  );
}

