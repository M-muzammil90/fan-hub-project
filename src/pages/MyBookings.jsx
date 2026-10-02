import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  MapPin,
  Calendar,
  Trash2,
  ArrowLeft,
  Flame,
  AlertCircle,
  Loader2,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';
import { eventApi } from '../services/event.api';
import { useAuth } from '../context/AuthContext';

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // Collect stored references from localStorage
      let localRefs = [];
      try {
        localRefs = JSON.parse(localStorage.getItem('fanhub_user_booking_refs') || '[]');
      } catch (e) {
        localRefs = [];
      }

      const params = {};
      if (user?.email) {
        params.email = user.email;
      }
      if (localRefs.length > 0) {
        params.references = localRefs.join(',');
      }

      const res = await eventApi.getMyBookings(params);

      if (res.success) {
        setBookings(res.bookings || []);
      } else {
        setError(res.message || 'Failed to load bookings.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to booking service.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this event pass? Released tickets will be returned to the event pool.')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const res = await eventApi.cancelBooking(bookingId);
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) =>
            (b._id || b.id) === bookingId ? { ...b, bookingStatus: 'Cancelled' } : b
          )
        );
      } else {
        alert(res.message || 'Failed to cancel pass.');
      }
    } catch (err) {
      alert(err.message || 'Error cancelling pass.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-24 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 pt-2">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/40 text-[11px] font-black uppercase tracking-wider">
            <Ticket className="w-3.5 h-3.5" />
            <span>Digital Pass Wallet</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
            My Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">Passes & Bookings</span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchBookings}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
            title="Refresh Bookings"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Events</span>
          </Link>
        </div>
      </div>

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-44 rounded-3xl bg-zinc-900/60 border border-white/5 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/40 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-xs font-bold text-red-300">{error}</p>
          <button
            type="button"
            onClick={fetchBookings}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && bookings.length === 0 && (
        <div className="py-20 text-center space-y-4 bg-[#0d0407] rounded-3xl border border-white/5 shadow-xl">
          <Ticket className="w-12 h-12 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Event Bookings Found</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              You haven't reserved any fandom event passes yet. Browse upcoming conventions, screening galas, and reserve your tickets!
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-600/40 transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explore Upcoming Events</span>
          </Link>
        </div>
      )}

      {/* Bookings List */}
      {!isLoading && !error && bookings.length > 0 && (
        <div className="space-y-6">
          {bookings.map((item) => {
            const isCancelled = item.bookingStatus === 'Cancelled';
            const eventObj = item.eventId || {};
            const eventDateFormatted = eventObj.startDate
              ? new Date(eventObj.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'TBA';

            return (
              <div
                key={item._id || item.id || item.bookingReference}
                className={`relative rounded-3xl overflow-hidden border bg-gradient-to-r from-[#120508] via-[#090b10] to-[#050608] shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-stretch justify-between gap-6 transition-all ${
                  isCancelled ? 'border-zinc-800 opacity-60' : 'border-red-500/40 hover:border-red-500'
                }`}
              >
                {/* Left Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-red-600 text-white text-[11px] font-mono font-black tracking-wider">
                      {item.bookingReference}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${
                        isCancelled
                          ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          : item.bookingStatus === 'Confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }`}
                    >
                      {isCancelled ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      <span>{item.bookingStatus || 'Confirmed'}</span>
                    </span>
                  </div>

                  <Link
                    to={eventObj.slug ? `/events/${eventObj.slug}` : `/events/${eventObj._id || ''}`}
                    className="block group"
                  >
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-red-400 transition-colors font-display">
                      {eventObj.title || 'Fandom Convention Event'}
                    </h3>
                  </Link>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                      <span>
                        <strong>Date:</strong> {eventDateFormatted}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="truncate">
                        <strong>Venue:</strong> {eventObj.venue ? `${eventObj.venue}, ` : ''}{eventObj.city || 'Karachi'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-red-500 shrink-0" />
                      <span>
                        <strong>Pass Tier:</strong> {item.ticketType} ({item.quantity} Pass{item.quantity > 1 ? 'es' : ''})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-red-500 shrink-0" />
                      <span>
                        <strong>Total Amount:</strong> PKR {item.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-zinc-500 font-medium">
                    <span>Booked under: </span>
                    <strong className="text-zinc-300">{item.customerName}</strong> ({item.email})
                  </div>
                </div>

                {/* Right Barcode UI */}
                <div className="w-full md:w-56 bg-[#090305] border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center space-y-3 shrink-0">
                  <div className="w-full h-12 bg-zinc-900 rounded-lg flex items-center justify-center space-x-1 px-2 border border-white/5">
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-full ${
                          i % 3 === 0
                            ? 'w-1 bg-white'
                            : i % 2 === 0
                            ? 'w-1.5 bg-zinc-400'
                            : 'w-0.5 bg-zinc-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 tracking-widest font-black">
                    {item.bookingReference}
                  </span>

                  {!isCancelled && (
                    <button
                      type="button"
                      disabled={cancellingId === (item._id || item.id)}
                      onClick={() => handleCancelBooking(item._id || item.id)}
                      className="w-full py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {cancellingId === (item._id || item.id) ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Cancel Pass</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
