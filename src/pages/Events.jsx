import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Sparkles,
  Ticket,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  Bell,
  Radio,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { eventApi } from '../services/event.api';
import TicketBookingModal from '../components/events/TicketBookingModal';

export default function Events() {
  const [eventsList, setEventsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBookingEvent, setSelectedBookingEvent] = useState(null);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const res = await eventApi.getEvents({ isPublished: true });
        if (res.success && res.events) {
          setEventsList(res.events);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Helper to format date badges
  const formatDateBadge = (dateStr) => {
    if (!dateStr) return 'Oct 18, 2026';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  // Helper for category badge colors matching Screenshot 2
  const getCategoryTheme = (category, eventType) => {
    const text = (category?.name || category || eventType || 'Anime').toString().toLowerCase();
    if (text.includes('gaming') || text.includes('game') || text.includes('esports')) {
      return { label: 'GAMING EVENT', bg: 'bg-purple-600/90 text-white border-purple-400/40' };
    }
    if (text.includes('movie') || text.includes('screening') || text.includes('film')) {
      return { label: 'MOVIE EVENT', bg: 'bg-blue-600/90 text-white border-blue-400/40' };
    }
    if (text.includes('cosplay') || text.includes('fashion') || text.includes('fiesta')) {
      return { label: 'COSPLAY EVENT', bg: 'bg-pink-600/90 text-white border-pink-400/40' };
    }
    if (text.includes('community') || text.includes('meetup') || text.includes('fanhub')) {
      return { label: 'COMMUNITY', bg: 'bg-emerald-600/90 text-white border-emerald-400/40' };
    }
    return { label: 'ANIME EVENT', bg: 'bg-red-600/90 text-white border-red-400/40' };
  };

  // 5 Top Showcase Events matching Screenshot 2 (From database or rich mapped DB records)
  const displayEvents = eventsList.length >= 5
    ? eventsList.slice(0, 5)
    : [
        ...eventsList,
        {
          _id: 'seed-ev-1',
          slug: 'animecon-karachi-2026',
          title: 'AnimeCon Karachi 2026',
          category: 'Anime',
          eventType: 'Anime Event',
          image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80',
          startDate: '2026-10-18T10:00:00.000Z',
          startTime: '10:00 AM - 8:00 PM',
          venue: 'Expo Center, Karachi',
          city: 'Karachi',
          tags: 'Cosplay • Fan Meet • Merchandise',
          ticketPrice: 1500
        },
        {
          _id: 'seed-ev-2',
          slug: 'valorant-gaming-tournament',
          title: 'Valorant Gaming Tournament',
          category: 'Gaming',
          eventType: 'Gaming Event',
          image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80',
          startDate: '2026-10-25T10:00:00.000Z',
          startTime: '10:00 AM - 10:00 PM',
          venue: 'Titanic Mall, Karachi',
          city: 'Karachi',
          tags: 'PC Gaming • Ranks • Prizes',
          ticketPrice: 1800
        },
        {
          _id: 'seed-ev-3',
          slug: 'the-batman-special-screening',
          title: 'The Batman – Special Screening',
          category: 'Movie',
          eventType: 'Movie Event',
          image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=80',
          startDate: '2026-11-02T18:00:00.000Z',
          startTime: '06:00 PM - 11:00 PM',
          venue: 'Cinepax, Karachi',
          city: 'Karachi',
          tags: 'Big Screen • Fan Meetup • Q&A',
          ticketPrice: 1200
        },
        {
          _id: 'seed-ev-4',
          slug: 'cosplay-fiesta-karachi',
          title: 'Cosplay Fiesta Karachi',
          category: 'Cosplay',
          eventType: 'Cosplay Event',
          image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&auto=format&fit=crop&q=80',
          startDate: '2026-11-15T11:00:00.000Z',
          startTime: '11:00 PM - 7:00 PM',
          venue: 'Cinech Luxury Hotel, Karachi',
          city: 'Karachi',
          tags: 'Meet • Photoshoot • Giveaways',
          ticketPrice: 1600
        },
        {
          _id: 'seed-ev-5',
          slug: 'fanhub-community-meetup',
          title: 'FanHub Community Meetup',
          category: 'Community',
          eventType: 'Community',
          image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&auto=format&fit=crop&q=80',
          startDate: '2026-12-05T14:00:00.000Z',
          startTime: '02:00 PM - 8:00 PM',
          venue: 'Dolmen Mall, Karachi',
          city: 'Karachi',
          tags: 'Games • Quiz • Social • Fun',
          ticketPrice: 1000
        }
      ].slice(0, 5);

  // Month days for the mini calendar (October 2026 has 31 days, starts on Thursday)
  const calendarDays = [
    null, null, null, null, 1, 2, 3,
    4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31
  ];

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto">
      {/* =========================================================================
          1. HERO BANNER — EXACT SCREENSHOT 2 LAYOUT
      ========================================================================= */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-red-950/60 bg-gradient-to-r from-[#170509] via-[#0b080e] to-[#120509] p-6 sm:p-10 shadow-[0_0_50px_rgba(255,23,56,0.18)]">
        {/* Glow Ambient Lights */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Text Content */}
          <div className="lg:col-span-6 space-y-4">
            {/* Top Red Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/20 text-[#ff1738] border border-red-500/40 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#ff1738] animate-pulse" />
              <span>LIVE EVENTS & CONVENTIONS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display leading-[1.05]">
              Upcoming <span className="text-[#ff1738]">Events</span>
            </h1>

            {/* Sub-headline */}
            <h2 className="text-sm sm:text-base font-bold text-white/90">
              Meet. Watch. Explore. Be Part of Something Bigger.
            </h2>

            {/* Description paragraph */}
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium max-w-lg">
              Join exclusive movie screenings, anime conventions, gaming events, cosplay gatherings and more. Don't just watch — be there!
            </p>

            {/* 3 Dark Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-[#ff1738] shrink-0">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-white block">Live Events</span>
                  <span className="text-zinc-400 text-[10px]">In Your City</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-[#ff1738] shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-white block">Meet Fans</span>
                  <span className="text-zinc-400 text-[10px]">Like You</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-[#ff1738] shrink-0">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-white block">Exclusive</span>
                  <span className="text-zinc-400 text-[10px]">Experiences</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Cinematic Characters Collage Graphic */}
          <div className="lg:col-span-6 relative h-[280px] sm:h-[340px] rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80"
              alt="Anime Gaming Convention"
              className="w-full h-full object-cover object-center"
            />
            {/* Dark Vignette Overlay with Neon Text Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#170509]/90 via-transparent to-black/60 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-xl sm:text-2xl font-black text-rose-400/90 uppercase tracking-[0.25em] font-display drop-shadow-[0_0_20px_rgba(255,23,56,0.8)] leading-tight">
                  ANIME<br />GAMING<br />MOVIES<br />COSPLAY<br />COMMUNITY
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. FEATURED EVENTS ROW — EXACT SCREENSHOT 2 (5 CARDS IN ROW)
      ========================================================================= */}
      <section className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ff1738] flex items-center justify-center text-white shadow-md shadow-[#ff1738]/30">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
              Featured <span className="text-[#ff1738]">Events</span>
            </h2>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-[#ff1738] transition-colors shrink-0"
          >
            <span>View All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 5 Events Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {displayEvents.map((evt) => {
            const theme = getCategoryTheme(evt.category, evt.eventType);
            const dateStr = formatDateBadge(evt.startDate || evt.date);
            const timeStr = evt.startTime || '10:00 AM - 8:00 PM';
            const locationStr = evt.venue || evt.city || 'Karachi, Pakistan';
            const tagStr = evt.tags || evt.description?.slice(0, 32) || 'Convention • Meetup • Exclusive';
            const posterImg = evt.image || evt.thumbnail || evt.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';

            return (
              <div
                key={evt._id || evt.slug}
                className="group relative flex flex-col justify-between rounded-2xl overflow-hidden bg-[#0c0d14] border border-white/10 hover:border-red-500/80 shadow-xl hover:shadow-[0_8px_30px_rgba(255,23,56,0.25)] transition-all duration-300 hover:-translate-y-1 select-none"
              >
                {/* Event Image Container (Aspect 4:3 / 16:10 for vertical card) */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
                  <img
                    src={posterImg}
                    alt={evt.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d14] via-transparent to-black/30 pointer-events-none" />

                  {/* Top-Left Category Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider border shadow-sm ${theme.bg}`}>
                      {theme.label}
                    </span>
                  </div>

                  {/* Top-Right Date Badge */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 flex items-center gap-1 shadow-sm">
                      <CalendarIcon className="w-3 h-3 text-[#ff1738]" />
                      <span>{dateStr}</span>
                    </span>
                  </div>
                </div>

                {/* Event Body Information */}
                <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between bg-[#0c0d14]">
                  <div className="space-y-1.5">
                    {/* Title */}
                    <Link to={`/events/${evt.slug || evt._id}`}>
                      <h3 className="text-sm font-black text-white group-hover:text-red-400 transition-colors line-clamp-1 font-display">
                        {evt.title}
                      </h3>
                    </Link>

                    {/* Sub-tags */}
                    <p className="text-[11px] text-zinc-400 truncate">
                      {tagStr}
                    </p>

                    {/* Date & Time Row */}
                    <div className="flex items-center gap-1.5 text-[10.5px] text-zinc-300 pt-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#ff1738] shrink-0" />
                      <span className="truncate">{dateStr} | {timeStr}</span>
                    </div>

                    {/* Location Row */}
                    <div className="flex items-center gap-1.5 text-[10.5px] text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 text-[#ff1738] shrink-0" />
                      <span className="truncate">{locationStr}</span>
                    </div>
                  </div>

                  {/* Get Tickets Action Button (Exact Screenshot 2) */}
                  <button
                    type="button"
                    onClick={() => setSelectedBookingEvent(evt)}
                    className="w-full py-2.5 px-3 rounded-full bg-[#ff1738] hover:bg-red-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-600/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Get Tickets</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          3. BOTTOM TWO COLUMNS — EVENT CALENDAR & FANHUB COMMUNITY (SCREENSHOT 2)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* =======================================================
            LEFT COLUMN: EVENT CALENDAR (5 Cols on Large Screen)
        ======================================================= */}
        <div className="lg:col-span-6 rounded-3xl bg-[#0c0d14] border border-white/10 p-5 sm:p-6 space-y-4 shadow-xl">
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ff1738] flex items-center justify-center text-white shadow-md shadow-[#ff1738]/30">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight font-display">
              Event <span className="text-[#ff1738]">Calendar</span>
            </h3>
          </div>

          {/* Calendar Month Header */}
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <button
              type="button"
              className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-white font-display">October 2026</span>
            <button
              type="button"
              className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Weekday Names */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-zinc-400">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Days Matrix */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {calendarDays.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="h-7 sm:h-8" />;
              const isEventDay = day === 18 || day === 25;
              return (
                <div
                  key={`day-${day}`}
                  className={`h-7 sm:h-8 flex items-center justify-center rounded-full text-xs font-semibold select-none ${
                    isEventDay
                      ? 'bg-[#ff1738] text-white font-black shadow-md shadow-red-600/50 scale-105'
                      : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Mini Event List inside Calendar Box (Screenshot 2) */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            {displayEvents.slice(0, 4).map((evt, idx) => {
              const isUpcoming = idx < 2;
              return (
                <div
                  key={`cal-item-${evt._id || idx}`}
                  onClick={() => setSelectedBookingEvent(evt)}
                  className="group/item flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-red-500/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={evt.image || evt.thumbnail || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&auto=format&fit=crop&q=80'}
                      alt={evt.title}
                      className="w-11 h-11 rounded-lg object-cover shrink-0 ring-1 ring-white/10"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white group-hover/item:text-red-400 transition-colors truncate">
                        {evt.title}
                      </h4>
                      <p className="text-[10px] text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                        <CalendarIcon className="w-3 h-3 text-[#ff1738]" />
                        <span>{formatDateBadge(evt.startDate)} | {evt.startTime || '10:00 AM'}</span>
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-500" />
                        <span>{evt.venue || evt.city || 'Karachi'}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider shrink-0 ${
                      isUpcoming
                        ? 'bg-red-600 text-white shadow-sm shadow-red-600/40'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {isUpcoming ? 'Upcoming' : 'Coming Soon'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =======================================================
            RIGHT COLUMN: BE PART OF THE FANHUB COMMUNITY (6 Cols)
        ======================================================= */}
        <div className="lg:col-span-6 rounded-3xl bg-gradient-to-b from-[#180509] via-[#0d070b] to-[#120509] border border-red-900/40 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
          {/* Background Ambient Aura */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-[#ff1738] border border-red-500/30 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#ff1738]" />
              <span>DON'T MISS OUT</span>
            </div>

            {/* Headline */}
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
              Be Part of the <span className="text-[#ff1738]">FanHub Community</span>
            </h3>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
              Get the latest updates, event alerts, exclusive passes, and connect with fans around you.
            </p>

            {/* 4 Feature Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-1 text-center">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-[#ff1738] mx-auto">
                  <Bell className="w-4 h-4" />
                </div>
                <h5 className="text-[11px] font-bold text-white pt-1">Event Updates</h5>
                <p className="text-[9.5px] text-zinc-400">In Real Time</p>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-1 text-center">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-[#ff1738] mx-auto">
                  <Ticket className="w-4 h-4" />
                </div>
                <h5 className="text-[11px] font-bold text-white pt-1">Exclusive Passes</h5>
                <p className="text-[9.5px] text-zinc-400">& Offers</p>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-1 text-center">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-[#ff1738] mx-auto">
                  <Users className="w-4 h-4" />
                </div>
                <h5 className="text-[11px] font-bold text-white pt-1">Fan Community</h5>
                <p className="text-[9.5px] text-zinc-400">Meet New People</p>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-1 text-center">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-[#ff1738] mx-auto">
                  <Radio className="w-4 h-4" />
                </div>
                <h5 className="text-[11px] font-bold text-white pt-1">Live Alerts</h5>
                <p className="text-[9.5px] text-zinc-400">Never Miss Again</p>
              </div>
            </div>
          </div>

          {/* Bottom Explore CTA Button */}
          <div className="relative z-10 pt-2">
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="w-full py-3.5 px-6 rounded-full bg-[#ff1738] hover:bg-red-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(255,23,56,0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Explore All Events</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. TICKET BOOKING MODAL (100% DATABASE DRIVEN & CONCURRENCY SAFE)
      ========================================================================= */}
      {selectedBookingEvent && (
        <TicketBookingModal
          isOpen={!!selectedBookingEvent}
          onClose={() => setSelectedBookingEvent(null)}
          event={selectedBookingEvent}
        />
      )}
    </div>
  );
}

