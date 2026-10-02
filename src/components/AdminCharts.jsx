import React from 'react';

const REDS = ['#dc2626', '#ef4444', '#b91c1c', '#f87171', '#7f1d1d', '#991b1b'];

export function AdminBarChart({ items = [], labelKey = 'label', valueKey = 'value' }) {
  const max = Math.max(...items.map((item) => Number(item[valueKey]) || 0), 1);

  if (!items.length) {
    return <p className="text-sm text-zinc-500 py-8 text-center">No data to chart yet.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const value = Number(item[valueKey]) || 0;
        const pct = Math.round((value / max) * 100);
        return (
          <div key={item[labelKey] || index} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-200 truncate pr-3">{item[labelKey]}</span>
              <span className="font-mono text-red-400">{value}</span>
            </div>
            <div className="h-2.5 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-800 to-red-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AdminDonutChart({ segments = [] }) {
  const total = segments.reduce((sum, s) => sum + (Number(s.value) || 0), 0) || 1;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  if (!segments.length || total === 0) {
    return <p className="text-sm text-zinc-500 py-8 text-center">No data to chart yet.</p>;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg viewBox="0 0 140 140" className="w-40 h-40 shrink-0 -rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#18181b" strokeWidth="16" />
        {segments.map((seg, i) => {
          const value = Number(seg.value) || 0;
          const length = (value / total) * circumference;
          const circle = (
            <circle
              key={seg.label}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={REDS[i % REDS.length]}
              strokeWidth="16"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += length;
          return circle;
        })}
      </svg>
      <ul className="space-y-2 w-full">
        {segments.map((seg, i) => (
          <li key={seg.label} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: REDS[i % REDS.length] }} />
              {seg.label}
            </span>
            <span className="font-mono text-white">{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminColumnChart({ items = [], labelKey = 'label', valueKey = 'value' }) {
  const max = Math.max(...items.map((item) => Number(item[valueKey]) || 0), 1);

  if (!items.length) {
    return <p className="text-sm text-zinc-500 py-8 text-center">No data to chart yet.</p>;
  }

  return (
    <div className="flex items-end gap-3 h-48 pt-4">
      {items.map((item, index) => {
        const value = Number(item[valueKey]) || 0;
        const height = Math.max(8, Math.round((value / max) * 160));
        return (
          <div key={item[labelKey] || index} className="flex-1 flex flex-col items-center gap-2 min-w-0">
            <span className="text-[11px] font-mono text-red-400">{value}</span>
            <div
              className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-red-900 to-red-500 border border-red-500/30"
              style={{ height }}
            />
            <span className="text-[10px] font-bold text-zinc-400 truncate w-full text-center">
              {item[labelKey]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
