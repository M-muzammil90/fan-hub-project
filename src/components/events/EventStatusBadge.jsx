import React from 'react';

export default function EventStatusBadge({ status }) {
  const normalized = (status || 'Upcoming').toLowerCase();

  const getStyle = () => {
    switch (normalized) {
      case 'ongoing':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'completed':
        return 'bg-zinc-800/60 text-zinc-400 border-zinc-700/40';
      case 'cancelled':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'upcoming':
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md shadow-sm ${getStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span>{status || 'Upcoming'}</span>
    </span>
  );
}
