import React from 'react';

export default function AdminPageHeader({ eyebrow, title, accent, subtitle, actions }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-2">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-500 mb-2">{eyebrow}</p>
        )}
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {title} {accent ? <span className="text-red-500">{accent}</span> : null}
        </h1>
        {subtitle && <p className="mt-1.5 text-sm text-zinc-400 max-w-2xl">{subtitle}</p>}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
