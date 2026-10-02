import React from 'react';

export default function Loading({ message = 'Loading fandom content...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-medium text-zinc-400">{message}</p>
    </div>
  );
}
