import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, Sparkles, ArrowRight, Shield, Zap } from "lucide-react";

export default function CharacterCard({ character }) {
  const [liked, setLiked] = useState(false);

  if (!character) return null;

  const image = character.avatar || character.image || character.banner;
  const name = character.name || character.title || "Character";
  const characterLink = `/characters/${character.slug || character._id || character.id}`;
  const loreSnippet = character.shortBio || character.bio || character.description;
  const categoryName = typeof character.category === 'object' ? character.category?.name : character.category || 'Featured';

  return (
    <article
      className="
        group relative flex flex-col justify-between
        rounded-2xl p-3.5 sm:p-4
        bg-white dark:bg-gradient-to-b dark:from-[#14080b] dark:via-[#0b0c12] dark:to-[#06070a]
        border border-zinc-200 dark:border-white/[0.08] hover:border-red-500/60 dark:hover:border-red-500/70
        transition-all duration-400 ease-out
        hover:-translate-y-2
        shadow-[0_4px_20px_rgba(225,29,72,0.05)] dark:shadow-[0_6px_24px_rgba(0,0,0,0.6)]
        hover:shadow-[0_14px_40px_rgba(239,68,68,0.25)] dark:hover:shadow-[0_14px_40px_rgba(220,38,38,0.25)]
        h-full select-none
      "
    >
      {/* Top Outer Accent Frame Glow */}
      <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Character Image / Poster Container */}
      <div className="relative aspect-[3/3.8] w-full overflow-hidden rounded-xl bg-black mb-3.5 ring-1 ring-black/5 dark:ring-white/10 group-hover:ring-red-500/30 transition-all">
        {image ? (
          <img
            src={image}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs bg-zinc-950">
            No Image
          </div>
        )}

        {/* Top Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent pointer-events-none" />

        {/* Bottom Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c12] via-[#0b0c12]/30 to-transparent pointer-events-none" />

        {/* Fandom Badge Top-Left */}
        {character.fandom && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase backdrop-blur-md bg-red-600/90 text-white border border-red-400/40 shadow-md shadow-red-950/70">
              <Sparkles className="w-2.5 h-2.5 text-red-200" />
              <span className="truncate max-w-[110px]">{character.fandom}</span>
            </span>
          </div>
        )}

        {/* Like Button Top-Right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked(!liked);
          }}
          aria-label={liked ? "Unlike character" : "Like character"}
          className={`
            absolute top-2.5 right-2.5 z-20
            w-8 h-8 rounded-full
            flex items-center justify-center
            backdrop-blur-md border transition-all duration-300
            ${
              liked
                ? "bg-red-600 border-red-400 text-white shadow-lg shadow-red-600/50 scale-105"
                : "bg-black/60 border-white/20 text-white/90 hover:bg-red-600 hover:border-red-500 hover:text-white hover:scale-105"
            }
          `}
        >
          <Heart size={14} className={liked ? "fill-current text-white" : ""} />
        </button>

        {/* Role / Power Badge Bottom-Left */}
        {(character.role || character.powerLevel) && (
          <div className="absolute bottom-2.5 left-2.5 z-10 max-w-[90%] truncate">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-black/85 border border-red-500/30 text-red-200 backdrop-blur-md truncate shadow-sm">
              <Shield className="w-3 h-3 text-red-400 shrink-0" />
              <span className="truncate">
                {character.role ? character.role.split('/')[0].trim() : character.powerLevel}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9.5px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40">
              {categoryName}
            </span>
            {character.powerLevel && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                <Zap className="w-2.5 h-2.5 text-amber-500 dark:text-amber-400" />
                <span className="truncate max-w-[80px]">{character.powerLevel}</span>
              </span>
            )}
          </div>

          <Link to={characterLink} className="block group/title">
            <h3
              className="text-base sm:text-lg font-black text-zinc-900 dark:text-white leading-snug truncate font-display transition-colors duration-200 group-hover/title:text-red-500 dark:group-hover/title:text-red-400"
              title={name}
            >
              {name}
            </h3>
          </Link>

          {loreSnippet && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium line-clamp-1 leading-relaxed">
              {loreSnippet}
            </p>
          )}
        </div>

        {/* Bottom Row / Stats & Classical CTA */}
        <div className="pt-2.5 border-t border-zinc-200 dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06]">
            <Star className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
              {character.rating ? Number(character.rating).toFixed(1) : '4.9'}
            </span>
          </div>

          <Link
            to={characterLink}
            className="group/link inline-flex items-center gap-1.5 text-xs font-bold text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Hover Red Accent Sweep */}
        <div className="h-[1.5px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full" />
      </div>
    </article>
  );
}