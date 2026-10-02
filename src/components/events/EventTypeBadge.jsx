import React from 'react';

export default function EventTypeBadge({ type }) {
  const displayType = type || 'Convention';

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30">
      <span>{displayType}</span>
    </span>
  );
}
