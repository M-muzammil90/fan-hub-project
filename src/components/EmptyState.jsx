import React from 'react';
import { SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No records found',
  description = 'Try adjusting your search criteria or browse another category.',
  actionText = 'Browse Explore',
  actionLink = '/explore',
  icon: Icon = SearchX
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-950/40">
      <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-rose-500 mb-4 border border-zinc-800">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>
      <p className="text-sm text-zinc-400 max-w-md mb-6">{description}</p>
      {actionLink && actionText && (
        <Link
          to={actionLink}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-md shadow-rose-950/40"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
