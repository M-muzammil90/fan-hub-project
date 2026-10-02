import React, { useState } from 'react';
import { Filter, X, RotateCcw, MapPin, Tag, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

export const CITIES_LIST = [
  'All Cities',
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Peshawar',
  'Quetta',
  'Multan',
  'Faisalabad',
  'Tokyo'
];

export const EVENT_TYPES_LIST = [
  'All Types',
  'Convention',
  'Meetup',
  'Screening',
  'Premiere',
  'Release',
  'Gaming Event',
  'Cosplay Event',
  'Fan Gathering'
];

export const STATUS_LIST = [
  'All Statuses',
  'Upcoming',
  'Ongoing',
  'Completed',
  'Cancelled'
];

export const DATE_PRESETS = [
  { label: 'All Dates', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This Weekend', value: 'weekend' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Upcoming 3 Months', value: 'upcoming_3m' }
];

export const DEFAULT_CATEGORIES = [
  { name: 'All', slug: 'all' },
  { name: 'Anime', slug: 'anime' },
  { name: 'Gaming', slug: 'games' },
  { name: 'Movies', slug: 'movies' },
  { name: 'TV Shows', slug: 'tv-shows' },
  { name: 'K-Pop', slug: 'k-pop' },
  { name: 'Comics', slug: 'comics' },
  { name: 'Manga', slug: 'manga' },
  { name: 'Cosplay', slug: 'cosplay' }
];

export default function EventFilters({
  activeCategory,
  onCategoryChange,
  categories = [],
  selectedCity,
  onCityChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  selectedDatePreset,
  onDatePresetChange,
  onResetFilters
}) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Combine backend categories with default categories if available
  const displayCategories = categories.length > 0
    ? [{ name: 'All', slug: 'all', _id: 'all' }, ...categories]
    : DEFAULT_CATEGORIES;

  const isAnyFilterActive =
    (activeCategory && activeCategory !== 'all') ||
    (selectedCity && selectedCity !== 'All Cities' && selectedCity !== 'all') ||
    (selectedType && selectedType !== 'All Types' && selectedType !== 'all') ||
    (selectedStatus && selectedStatus !== 'All Statuses' && selectedStatus !== 'all') ||
    (selectedDatePreset && selectedDatePreset !== 'all');

  return (
    <div className="space-y-4">
      {/* Category Pills Bar (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
        {displayCategories.map((cat) => {
          const catVal = cat.slug || cat._id || cat.name;
          const isActive =
            activeCategory === catVal ||
            (catVal === 'all' && (!activeCategory || activeCategory === 'all')) ||
            activeCategory?.toLowerCase() === cat.name?.toLowerCase();

          return (
            <button
              key={cat._id || cat.slug || cat.name}
              type="button"
              onClick={() => onCategoryChange(cat.slug || cat._id || cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-400/40 scale-105'
                  : 'bg-[#0b0b0f] text-zinc-300 hover:text-white border border-white/[0.08] hover:border-red-500/40'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Desktop Filter Dropdowns Bar */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0b0b0f] border border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-3">
          {/* City Filter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black border border-white/10 text-xs">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent text-zinc-200 focus:outline-none cursor-pointer font-bold"
            >
              {CITIES_LIST.map((c) => (
                <option key={c} value={c} className="bg-[#0b0b0f] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Event Type Filter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black border border-white/10 text-xs">
            <Tag className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="bg-transparent text-zinc-200 focus:outline-none cursor-pointer font-bold"
            >
              {EVENT_TYPES_LIST.map((t) => (
                <option key={t} value={t} className="bg-[#0b0b0f] text-white">
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black border border-white/10 text-xs">
            <CalendarIcon className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <select
              value={selectedDatePreset}
              onChange={(e) => onDatePresetChange(e.target.value)}
              className="bg-transparent text-zinc-200 focus:outline-none cursor-pointer font-bold"
            >
              {DATE_PRESETS.map((d) => (
                <option key={d.value} value={d.value} className="bg-[#0b0b0f] text-white">
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black border border-white/10 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-transparent text-zinc-200 focus:outline-none cursor-pointer font-bold"
            >
              {STATUS_LIST.map((s) => (
                <option key={s} value={s} className="bg-[#0b0b0f] text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Filter Action */}
        {isAnyFilterActive && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-bold transition-colors py-1 px-2.5 rounded-lg hover:bg-red-500/10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Mobile Filters Toggle Button */}
      <div className="md:hidden flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex-1 py-2.5 px-4 rounded-xl bg-[#0b0b0f] border border-white/10 hover:border-red-500 text-xs font-bold text-white flex items-center justify-center gap-2"
        >
          <Filter className="w-3.5 h-3.5 text-red-500" />
          <span>Filters {isAnyFilterActive && '• Active'}</span>
        </button>

        {isAnyFilterActive && (
          <button
            type="button"
            onClick={onResetFilters}
            className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 text-xs"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mobile Filters Drawer / Modal */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full max-w-lg bg-[#0b0b0f] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 space-y-5 shadow-2xl animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-red-500" />
                <h3 className="text-base font-black text-white font-display">Filter Events</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* City */}
              <div>
                <label className="block text-zinc-400 font-bold mb-1.5">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => onCityChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white font-bold focus:border-red-500"
                >
                  {CITIES_LIST.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-zinc-400 font-bold mb-1.5">Event Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => onTypeChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white font-bold focus:border-red-500"
                >
                  {EVENT_TYPES_LIST.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Date Preset */}
              <div>
                <label className="block text-zinc-400 font-bold mb-1.5">Date</label>
                <select
                  value={selectedDatePreset}
                  onChange={(e) => onDatePresetChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white font-bold focus:border-red-500"
                >
                  {DATE_PRESETS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-zinc-400 font-bold mb-1.5">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => onStatusChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white font-bold focus:border-red-500"
                >
                  {STATUS_LIST.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  onResetFilters();
                  setMobileDrawerOpen(false);
                }}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-600/30"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
