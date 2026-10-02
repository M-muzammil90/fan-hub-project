import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import { eventApi } from '../../services/event.api';
import { CITIES_LIST } from './EventFilters';
import EventTypeBadge from './EventTypeBadge';
import EventStatusBadge from './EventStatusBadge';

export default function EventCalendar({ initialCity = 'All Cities', compact = false }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState(null);
  const [selectedDayNumber, setSelectedDayNumber] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Fetch calendar events whenever month, year or city changes
  useEffect(() => {
    const fetchCalendarData = async () => {
      setIsLoading(true);
      try {
        const res = await eventApi.getCalendarEvents({
          month: month + 1,
          year: year,
          city: selectedCity !== 'All Cities' ? selectedCity : undefined
        });
        if (res.success) {
          setEvents(res.events || []);
        }
      } catch (err) {
        console.error('Failed to fetch calendar events:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarData();
    // Reset active day selection on month change
    setSelectedDateEvents(null);
    setSelectedDayNumber(null);
  }, [month, year, selectedCity]);

  // Calendar math
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first: 0 = Mon, 6 = Sun

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Group events by day of current month
  const eventsByDay = {};
  events.forEach((evt) => {
    if (!evt.startDate) return;
    const evtDate = new Date(evt.startDate);
    if (evtDate.getFullYear() === year && evtDate.getMonth() === month) {
      const day = evtDate.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(evt);
    }
  });

  const handleDayClick = (day) => {
    const dayEvts = eventsByDay[day] || [];
    setSelectedDayNumber(day);
    setSelectedDateEvents(dayEvts);
  };

  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  return (
    <div className="rounded-3xl bg-[#0b0b0f] border border-white/[0.08] shadow-2xl p-5 sm:p-8 space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-zinc-400">
              Select any date to view scheduled fandom conventions and screenings.
            </p>
          </div>
        </div>

        {/* Controls: City Filter & Month Switchers */}
        <div className="flex items-center gap-3">
          {/* City Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black border border-white/10 text-xs">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-zinc-200 focus:outline-none cursor-pointer font-bold"
            >
              {CITIES_LIST.map((c) => (
                <option key={c} value={c} className="bg-[#0b0b0f] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-1 bg-black p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="py-12 flex items-center justify-center gap-2 text-zinc-400 text-xs font-bold">
          <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
          <span>Updating calendar events...</span>
        </div>
      )}

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs font-black uppercase text-zinc-400 tracking-wider">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span className="text-red-400">Sat</span>
        <span className="text-red-400">Sun</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="aspect-square rounded-xl bg-white/[0.01] border border-transparent opacity-20 pointer-events-none"
          />
        ))}

        {/* Days of Month */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const dayEvents = eventsByDay[day] || [];
          const hasEvents = dayEvents.length > 0;
          const isSelected = selectedDayNumber === day;

          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`relative aspect-square rounded-xl sm:rounded-2xl p-1 sm:p-2 flex flex-col justify-between items-center transition-all duration-200 border ${
                isSelected
                  ? 'bg-red-600/30 border-red-500 text-white shadow-lg shadow-red-600/20 scale-105'
                  : hasEvents
                  ? 'bg-[#14070a] border-red-500/40 hover:border-red-400 text-white hover:scale-105'
                  : isToday(day)
                  ? 'bg-white/[0.06] border-white/30 text-white'
                  : 'bg-black/40 border-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span className={`text-xs sm:text-sm font-bold font-mono ${isToday(day) ? 'text-red-400 underline font-black' : ''}`}>
                {day}
              </span>

              {/* Red indicator badge if date contains events */}
              {hasEvents && (
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 shadow-md shadow-red-600/60 animate-pulse" />
                  <span className="hidden sm:inline-block text-[9px] font-black text-red-300 font-mono">
                    {dayEvents.length}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Events List Section */}
      {selectedDayNumber !== null && (
        <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-black/60 border border-red-500/30 space-y-4 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm sm:text-base font-black text-white font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span>
                Events on {monthNames[month]} {selectedDayNumber}, {year}
              </span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'event scheduled' : 'events scheduled'}
            </span>
          </div>

          {selectedDateEvents.length === 0 ? (
            <p className="text-xs text-zinc-400 italic py-2">
              No events scheduled on this specific date. Pick a highlighted date with a red dot indicator.
            </p>
          ) : (
            <div className="space-y-3">
              {selectedDateEvents.map((evt) => (
                <div
                  key={evt._id || evt.id}
                  className="p-4 rounded-xl bg-[#0e070a] border border-white/[0.08] hover:border-red-500/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                        {evt.category?.name || 'Event'}
                      </span>
                      <EventTypeBadge type={evt.eventType || 'Convention'} />
                      <EventStatusBadge status={evt.status || 'Upcoming'} />
                    </div>
                    <h4 className="text-sm font-black text-white group-hover:text-red-400 transition-colors">
                      {evt.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        {evt.venue ? `${evt.venue}, ` : ''}{evt.city}
                      </span>
                      {evt.startTime && (
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          {evt.startTime}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/events/${evt.slug || evt._id}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-bold transition-all shrink-0"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
