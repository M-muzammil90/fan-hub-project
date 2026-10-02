import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Sparkles } from 'lucide-react';
import EventCalendar from '../components/events/EventCalendar';

export default function EventCalendarPage() {
  return (
    <div className="space-y-8 pb-24 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors group mb-2"
          >
            <ArrowLeft className="w-4 h-4 text-red-500 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Events</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display">
            Fandom <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">Event Calendar</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Browse upcoming convention schedules, cosplay meetups, and cinema premieres by month and city.
          </p>
        </div>
      </div>

      <EventCalendar />
    </div>
  );
}
