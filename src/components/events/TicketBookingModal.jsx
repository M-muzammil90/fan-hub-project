import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  X,
  Sparkles,
  Flame
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { eventApi } from '../../services/event.api';

export default function TicketBookingModal({ isOpen, onClose, event, onBookingSuccess }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Select tickets, 2: Customer details, 3: Confirmation
  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copied, setCopied] = useState(false);

  // Initialize or reset when event or user changes
  useEffect(() => {
    if (event) {
      const defaultTier = event.ticketTiers && event.ticketTiers.length > 0
        ? event.ticketTiers[0]
        : {
            name: 'General Pass',
            price: event.ticketPrice !== undefined ? event.ticketPrice : 1500,
            description: 'Standard event entry and general stage access',
            availableTickets: event.availableTickets !== undefined ? event.availableTickets : 100
          };
      setSelectedTier(defaultTier);
      setQuantity(1);
      setError('');
      setStep(1);
      setConfirmedBooking(null);
    }
  }, [event, isOpen]);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name || '');
      if (!email) setEmail(user.email || '');
      if (!phone) setPhone(user.phone || '');
    }
  }, [user, isOpen]);

  if (!isOpen || !event) return null;

  const availableTickets = event.availableTickets !== undefined
    ? event.availableTickets
    : event.totalTickets || 100;

  const unitPrice = selectedTier ? selectedTier.price : (event.ticketPrice || 1500);
  const totalAmount = unitPrice * quantity;
  const isSoldOut = availableTickets <= 0;

  const handleIncrement = () => {
    if (quantity < availableTickets && quantity < 10) {
      setQuantity((prev) => prev + 1);
      setError('');
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      setError('');
    }
  };

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
    if (quantity > (tier.availableTickets || availableTickets)) {
      setQuantity(Math.max(1, tier.availableTickets || availableTickets));
    }
    setError('');
  };

  const handleProceedToDetails = (e) => {
    e.preventDefault();
    if (isSoldOut) {
      setError('Sorry, this event is completely sold out.');
      return;
    }
    if (quantity > availableTickets) {
      setError(`Only ${availableTickets} tickets are currently available.`);
      return;
    }
    setError('');
    setStep(2);
  };

  const handleFinalBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const eventId = event._id || event.id;
      const res = await eventApi.createBooking(eventId, {
        customerName: customerName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        ticketType: selectedTier ? selectedTier.name : 'General Pass',
        quantity,
        notes: notes.trim()
      });

      if (res.success && res.booking) {
        setConfirmedBooking(res.booking);

        // Save reference locally so Pass Wallet can find it even if offline
        try {
          const existing = JSON.parse(localStorage.getItem('fanhub_user_booking_refs') || '[]');
          if (!existing.includes(res.booking.bookingReference)) {
            existing.unshift(res.booking.bookingReference);
            localStorage.setItem('fanhub_user_booking_refs', JSON.stringify(existing));
          }
        } catch (e) {
          // ignore storage error
        }

        if (onBookingSuccess) {
          onBookingSuccess(res.booking);
        }
        setStep(3);
      } else {
        setError(res.message || 'Failed to confirm booking. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Server error occurred during ticket reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferenceCode = () => {
    if (confirmedBooking?.bookingReference) {
      navigator.clipboard.writeText(confirmedBooking.bookingReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const eventDateFormatted = event.startDate
    ? new Date(event.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'TBA';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#12070a] via-[#0c0508] to-[#080204] border border-red-500/40 rounded-3xl shadow-[0_0_60px_rgba(255,23,56,0.3)] overflow-hidden my-6">
        {/* Top Header Bar */}
        <div className="relative p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-600/40">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-400">
                Official Ticket Reservation
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white font-display leading-tight">
                {step === 3 ? 'Booking Confirmed!' : 'Book Event Tickets'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Event Banner Snapshot */}
        <div className="px-5 sm:px-6 pt-4 pb-1">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
            <img
              src={event.image || event.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300'}
              alt={event.title}
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
            />
            <div className="min-w-0 flex-1 space-y-0.5">
              <h3 className="text-sm font-black text-white truncate font-display">
                {event.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-300">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-red-500" />
                  <span className="font-mono">{eventDateFormatted}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span className="truncate">{event.venue ? `${event.venue}, ` : ''}{event.city}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div className="mx-5 sm:mx-6 mt-3 p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Step 1: Ticket Selection */}
        {step === 1 && (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Availability Badge */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-red-600/10 border border-red-500/20 text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <Flame className="w-4 h-4 text-red-500" />
                <span>Ticket Availability:</span>
              </div>
              <span className={`font-mono font-black ${isSoldOut ? 'text-red-500' : 'text-emerald-400'}`}>
                {isSoldOut ? 'Sold Out' : `${availableTickets} passes remaining`}
              </span>
            </div>

            {/* Ticket Tiers Selection */}
            {event.ticketTiers && event.ticketTiers.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Select Ticket Tier:
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {event.ticketTiers.map((tier) => {
                    const isSelected = selectedTier?.name === tier.name;
                    return (
                      <button
                        key={tier.name}
                        type="button"
                        onClick={() => handleTierSelect(tier)}
                        className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-red-600/20 border-red-500 text-white shadow-lg shadow-red-600/20'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-zinc-300'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-black text-white font-display">
                              {tier.name}
                            </span>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-full bg-red-600 text-[9px] font-black text-white uppercase tracking-wider">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400">
                            {tier.description || 'General event access'}
                          </p>
                        </div>
                        <div className="text-right shrink-0 font-mono font-black text-sm sm:text-base text-red-400">
                          PKR {tier.price.toLocaleString()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Pass Quantity</span>
                <span className="text-[11px] text-zinc-400">Limit 10 passes per reservation</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || isSoldOut}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10 text-white font-black text-lg flex items-center justify-center transition-colors border border-white/10"
                >
                  -
                </button>
                <span className="w-8 text-center font-mono font-black text-base text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= availableTickets || quantity >= 10 || isSoldOut}
                  className="w-9 h-9 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white font-black text-lg flex items-center justify-center transition-colors shadow-md shadow-red-600/30"
                >
                  +
                </button>
              </div>
            </div>

            {/* Subtotal Calculation */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Total Amount:
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">
                PKR {totalAmount.toLocaleString()}
              </span>
            </div>

            {/* Action Buttons */}
            <button
              type="button"
              onClick={handleProceedToDetails}
              disabled={isSoldOut}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm shadow-xl shadow-red-600/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isSoldOut ? 'Sold Out' : 'Continue to Customer Details'}</span>
              {!isSoldOut && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Step 2: Customer Contact Form */}
        {step === 2 && (
          <form onSubmit={handleFinalBookingSubmit} className="p-5 sm:p-6 space-y-4">
            <div className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 mb-1.5">
                  <User className="w-3.5 h-3.5 text-red-500" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Sarah Ahmed"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-red-500 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-red-500" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-red-500 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-red-500" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-red-500 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1.5">
                  Special Instructions / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Accessibility needs, cosplay props notice, etc."
                  className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-red-500 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Summary Review Box */}
            <div className="p-3.5 rounded-2xl bg-red-600/10 border border-red-500/20 text-xs space-y-1.5">
              <div className="flex justify-between text-zinc-300">
                <span>Selected Tier:</span>
                <span className="font-bold text-white">{selectedTier?.name || 'General Pass'}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Quantity:</span>
                <span className="font-bold text-white font-mono">{quantity} Pass{quantity > 1 ? 'es' : ''}</span>
              </div>
              <div className="flex justify-between text-white font-bold pt-1 border-t border-white/10">
                <span>Total Payable:</span>
                <span className="font-mono text-red-400">PKR {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Navigation & Submit Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition-colors border border-white/10"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-red-600/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming Pass...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm Ticket Reservation (PKR {totalAmount.toLocaleString()})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Booking Success Confirmation Screen */}
        {step === 3 && confirmedBooking && (
          <div className="p-6 sm:p-8 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Pass Confirmed & Active</span>
              </span>
              <h3 className="text-2xl font-black text-white font-display">
                You're All Set for the Event!
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Your fandom event pass has been reserved in our system. Present your booking reference or digital barcode at the venue entrance.
              </p>
            </div>

            {/* Reference Code Card */}
            <div className="p-4 rounded-2xl bg-[#090305] border border-red-500/40 space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                Booking Reference Code
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xl sm:text-2xl font-black text-red-400 tracking-wider">
                  {confirmedBooking.bookingReference}
                </span>
                <button
                  type="button"
                  onClick={copyReferenceCode}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors border border-white/10"
                  title="Copy Reference"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Booking Details Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-left text-xs bg-white/[0.02] p-4 rounded-2xl border border-white/10">
              <div>
                <span className="text-zinc-500 block">Attendee:</span>
                <span className="font-bold text-white truncate block">{confirmedBooking.customerName}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Pass Tier:</span>
                <span className="font-bold text-red-400 block">{confirmedBooking.ticketType}</span>
              </div>
              <div className="pt-2">
                <span className="text-zinc-500 block">Quantity:</span>
                <span className="font-bold text-white font-mono">{confirmedBooking.quantity} Ticket(s)</span>
              </div>
              <div className="pt-2">
                <span className="text-zinc-500 block">Total Amount:</span>
                <span className="font-bold text-white font-mono">PKR {confirmedBooking.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/my-bookings');
                }}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-600/40 transition-colors flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>View in Pass Wallet</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white font-bold text-xs transition-colors border border-white/10"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
