import React from 'react';
import { Link } from 'react-router-dom';
import { User, ArrowRight } from 'lucide-react';
import CharacterCard from '../cards/CharacterCard';
import { featuredCharactersData } from '../../data/homepage';

export default function CharactersSection({ characters = featuredCharactersData }) {
  return (
    <section className="relative w-full">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#ff1738] flex items-center justify-center text-white shadow-md shadow-[#ff1738]/30">
            <User className="w-4 h-4" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
            Featured <span className="text-[#ff1738]">characters</span>
          </h2>
        </div>

        <Link
          to="/characters"
          className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-[#ff1738] transition-colors shrink-0"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Clean Smooth Slider Track (No overlapping side arrow icons) */}
      <div className="flex items-center gap-3.5 overflow-x-auto scrollbar-none pb-2 pt-1 px-0.5 scroll-smooth">
        {characters.map((char) => (
          <CharacterCard key={char.id || char.name} character={char} />
        ))}
      </div>
    </section>
  );
}
