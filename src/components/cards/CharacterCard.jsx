import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';

export default function CharacterCard({ character }) {
  return (
    <Link
      to={character.link || `/characters/${character.slug || character.id}`}
      className="group relative flex flex-col justify-between w-[240px] sm:w-[250px] h-[155px] rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d11] p-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff1738] hover:shadow-[0_0_25px_rgba(255,20,50,0.22)] select-none shrink-0"
    >
      {/* Character Image */}
      <img
        src={character.image || character.avatar || character.banner}
        alt={character.name}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/60 to-black/20" />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-[#ff1738]/5 transition-colors duration-300" />

      {/* Top Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#ff1738] text-white shadow-sm shadow-[#ff1738]/40">
          {character.badge || 'POPULAR'}
        </span>
      </div>

      {/* Bottom Content Bar */}
      <div className="relative z-10 flex items-end justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-0.5">
          <h3 className="text-sm font-black text-white tracking-tight truncate group-hover:text-red-400 transition-colors">
            {character.name}
          </h3>
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span className="truncate">
              {typeof character.category === 'object' ? (character.category?.name || 'Anime') : (character.category || 'Anime')}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{character.rating || '9.4'}</span>
            </span>
          </div>
        </div>

        {/* Circular Red Action Button */}
        <div className="w-8 h-8 rounded-full bg-[#ff1738] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#ff1738]/40 group-hover:scale-110 group-hover:bg-red-500 transition-transform">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}
