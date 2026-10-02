import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Share2,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Building,
  User,
  Sparkles,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { eventApi } from '../services/event.api';
import EventStatusBadge from '../components/events/EventStatusBadge';
import EventTypeBadge from '../components/events/EventTypeBadge';
import EventMap from '../components/events/EventMap';
import TicketBookingModal from '../components/events/TicketBookingModal';

export default function EventDetails() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await eventApi.getEventBySlug(slug);
        if (res.success && res.event) {
          setEvent(res.event);
        } else {
          setError(res.message || 'Event not found.');
        }
      } catch (err) {
        setError(err.message || 'Unable to load event details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  const handleShare = async () => {
    const shareData = {
      title: event?.title || 'FanHub Plus Event',
      text: event?.description || `Check out ${event?.title} on FanHub Plus!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // user cancelled or share failed, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleBookingSuccess = (newBooking) => {
    // Decrement local available tickets
    if (event) {
      setEvent((prev) => ({
        ...prev,
        availableTickets: Math.max(0, (prev.availableTickets || prev.totalTickets || 100) - (newBooking.quantity || 1))
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          Loading Event Details...
        </p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 rounded-3xl bg-[#140609] border border-red-500/40 text-center space-y-4 shadow-2xl">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white font-display">Event Not Found</h2>
          <p className="text-xs text-zinc-400">{error || 'This event may have expired or been removed.'}</p>
        </div>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>
      </div>
    );
  }

  const startDateObj = new Date(event.startDate);
  const formattedStartDate = !isNaN(startDateObj)
    ? startDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'TBA';

  let formattedEndDate = null;
  if (event.endDate) {
    const endObj = new Date(event.endDate);
    if (!isNaN(endObj)) {
      formattedEndDate = endObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
  }

  const totalTickets = event.totalTickets || 100;
  const availableTickets = event.availableTickets !== undefined ? event.availableTickets : totalTickets;
  const percentageRemaining = Math.round((availableTickets / totalTickets) * 100);
  const isSoldOut = availableTickets <= 0;
  const ticketPrice = event.ticketPrice !== undefined ? event.ticketPrice : 1500;

  return (
    <div className="space-y-8 pb-24 max-w-6xl mx-auto px-4 sm:px-6">
      {/* 1. Back Navigation & Share */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-red-500 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Events</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 hover:text-white border border-white/10 text-xs font-bold transition-all shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-red-400" />
              <span>Share Event</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Large Cinematic Event Hero */}
      <div className="relative rounded-3xl overflow-hidden border border-red-500/40 bg-[#0b0b0f] shadow-[0_0_60px_rgba(255,23,56,0.25)]">
        {/* Cover Image Container (16:9 Aspect Ratio on Desktop) */}
        <div className="relative h-72 sm:h-96 md:h-[420px] w-full bg-zinc-950">
          <img
            src={
              event.image ||
              event.coverImage ||
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'
            }
            alt={event.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80';
            }}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/70 to-transparent" />
        </div>

        {/* Hero Overlay Content */}
        <div className="p-6 sm:p-10 -mt-32 sm:-mt-40 relative z-10 space-y-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/40 border border-red-400/40">
                {event.category?.name || 'Fandom'}
              </span>
              <EventTypeBadge type={event.eventType || 'Convention'} />
              <EventStatusBadge status={event.status || 'Upcoming'} />
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display leading-tight">
              {event.title}
            </h1>

            {/* Quick Metadata */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-zinc-200 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-mono font-bold text-white">
                  {formattedStartDate}
                  {formattedEndDate && ` — ${formattedEndDate}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-mono">
                  {event.startTime || '06:00 PM'} {event.endTime ? ` - ${event.endTime}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>{event.venue ? `${event.venue}, ` : ''}{event.city}</span>
              </div>
            </div>
          </div>

          {/* Action Row: Real Book Ticket Modal Button + External Link */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              disabled={isSoldOut}
              onClick={() => setIsBookingModalOpen(true)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base shadow-2xl shadow-red-600/40 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 border border-red-400/50"
            >
              <Ticket className="w-5 h-5" />
              <span>{isSoldOut ? 'Sold Out' : `Book Ticket • PKR ${ticketPrice.toLocaleString()}`}</span>
            </button>

            {event.ticketUrl && (
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/10 transition-colors"
              >
                <span>External Booking Site</span>
                <ExternalLink className="w-4 h-4 text-zinc-400" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Grid (Description & Event Information Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Complete Description */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0b0f] border border-white/[0.08] shadow-xl space-y-4">
            <h2 className="text-xl font-black text-white font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-500" />
              <span>Event Description</span>
            </h2>
            <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal whitespace-pre-line space-y-3">
              {event.description || (
                <p className="text-zinc-500 italic">
                  No additional description provided for this fandom event.
                </p>
              )}
            </div>
          </div>

          {/* Ticket Tiers Breakdown Box */}
          {event.ticketTiers && event.ticketTiers.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0b0f] border border-white/[0.08] shadow-xl space-y-4">
              <h2 className="text-xl font-black text-white font-display flex items-center gap-2">
                <Ticket className="w-5 h-5 text-red-500" />
                <span>Ticket Passes & Pricing</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.ticketTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-black text-white font-display">{tier.name}</h4>
                        <span className="font-mono font-black text-sm text-red-400">
                          PKR {tier.price?.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 pt-1">{tier.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsBookingModalOpen(true)}
                      className="w-full py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold transition-all text-center"
                    >
                      Select {tier.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Map & GPS Directions Section */}
          <EventMap
            latitude={event.latitude}
            longitude={event.longitude}
            venue={event.venue || 'Karachi Expo Center'}
            city={event.city}
            address={event.address}
          />
        </div>

        {/* Right: Event Information & Live Availability Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Availability Meter */}
          <div className="p-6 rounded-3xl bg-[#0b0b0f] border border-red-500/40 shadow-xl space-y-4">
            <h3 className="text-base font-black text-white font-display flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                <span>Pass Availability</span>
              </span>
              <span className="font-mono text-xs font-bold text-red-400">
                {availableTickets} / {totalTickets}
              </span>
            </h3>

            {/* Progress Meter Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 rounded-full bg-zinc-900 overflow-hidden border border-white/10 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, percentageRemaining))}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400 font-medium">
                <span>{percentageRemaining}% Remaining</span>
                <span className={isSoldOut ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {isSoldOut ? 'Sold Out' : 'Available for Booking'}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isSoldOut}
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs shadow-lg shadow-red-600/40 flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              <Ticket className="w-4 h-4" />
              <span>{isSoldOut ? 'Event Sold Out' : 'Reserve Tickets Now'}</span>
            </button>
          </div>

          {/* Event Information Table */}
          <div className="p-6 rounded-3xl bg-[#0b0b0f] border border-white/10 shadow-xl space-y-5">
            <h3 className="text-base sm:text-lg font-black text-white font-display flex items-center gap-2 border-b border-white/10 pb-3">
              <ShieldCheck className="w-5 h-5 text-red-500" />
              <span>Event Information</span>
            </h3>

            <div className="space-y-3.5 text-xs text-zinc-300 divide-y divide-white/5">
              <div className="flex justify-between items-center pt-1">
                <span className="text-zinc-500 font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-red-400" />
                  <span>Organizer</span>
                </span>
                <span className="font-bold text-white text-right">
                  {event.organizer || 'FanHub Community'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2.5">
                <span className="text-zinc-500 font-semibold">Category</span>
                <span className="font-bold text-red-400">
                  {event.category?.name || 'Anime'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2.5">
                <span className="text-zinc-500 font-semibold">Event Type</span>
                <span className="font-bold text-white">
                  {event.eventType || 'Convention'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2.5">
                <span className="text-zinc-500 font-semibold">City</span>
                <span className="font-bold text-white">{event.city}</span>
              </div>

              <div className="flex justify-between items-center pt-2.5">
                <span className="text-zinc-500 font-semibold flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Venue</span>
                </span>
                <span className="font-bold text-white text-right max-w-[160px] truncate">
                  {event.venue || 'TBA'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2.5">
                <span className="text-zinc-500 font-semibold">Start Date</span>
                <span className="font-bold font-mono text-white">
                  {formattedStartDate}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2.5">
                <span className="text-zinc-500 font-semibold">Time</span>
                <span className="font-bold font-mono text-white">
                  {event.startTime || '06:00 PM'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2.5">
                <span className="text-zinc-500 font-semibold">Status</span>
                <EventStatusBadge status={event.status || 'Upcoming'} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Booking Interactive Modal */}
      {isBookingModalOpen && (
        <TicketBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          event={event}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
