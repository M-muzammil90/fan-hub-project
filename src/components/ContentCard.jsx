import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, FileText, Headphones, Image as ImageIcon, Tv, Film } from 'lucide-react';

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80';

export default function ContentCard({ content, onPlay }) {
  if (!content) return null;

  const slug = content.slug || content._id || content.id;
  const isSeries =
    content.contentType === 'series' ||
    content.type === 'series' ||
    content.seasonsCount !== undefined ||
    content.totalEpisodes !== undefined ||
    (content.category &&
      (content.category === 'series' ||
        content.category?.slug === 'series' ||
        content.category?.name?.toLowerCase() === 'series'));
  
  const isArticle = content.contentType === 'article' || content.type === 'article';
  const isAudio = content.contentType === 'audio' || content.type === 'audio';
  const isImage = content.contentType === 'image' || content.type === 'image' || content.type === 'wallpaper';

  const link = content.link || (isSeries ? `/series/${slug}` : isArticle ? `/articles` : `/content/${slug}`);
  const poster = content.poster || content.thumbnail || content.backdrop || content.image || content.mediaUrl || FALLBACK_POSTER;

  // Determine Type Badge
  let qualityBadge = 'HD';
  let badgeColor = 'bg-black/75 text-white border-white/15';
  if (isSeries) {
    qualityBadge = 'SERIES';
    badgeColor = 'bg-red-600/90 text-white border-red-400/40';
  } else if (isArticle) {
    qualityBadge = 'ARTICLE';
    badgeColor = 'bg-rose-600/90 text-white border-rose-400/40';
  } else if (isAudio) {
    qualityBadge = 'AUDIO';
    badgeColor = 'bg-amber-600/90 text-white border-amber-400/40';
  } else if (isImage) {
    qualityBadge = '4K ART';
    badgeColor = 'bg-purple-600/90 text-white border-purple-400/40';
  } else if (content.is4K || content.quality === '4K' || (content.rating && Number(content.rating) >= 9.0) || content.type === 'movie') {
    qualityBadge = '4K';
    badgeColor = 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-400/40';
  }

  // Determine Duration / Meta Badge
  let metaBadge = 'HD';
  if (isArticle) {
    metaBadge = content.readTime || '4m read';
  } else if (isAudio) {
    metaBadge = content.duration || '4:15';
  } else if (isImage) {
    metaBadge = '3840×2160';
  } else if (content.duration) {
    metaBadge = content.duration;
  } else if (content.totalEpisodes || content.episodes || content.episodesCount) {
    metaBadge = `${content.episodesCount || content.totalEpisodes || content.episodes} Eps`;
  } else if (isSeries) {
    metaBadge = '8 Eps';
  } else if (content.runtime) {
    const hours = Math.floor(content.runtime / 60);
    const mins = content.runtime % 60;
    metaBadge = `${hours}h ${mins.toString().padStart(2, '0')}m`;
  } else {
    metaBadge = '2h 15m';
  }

  // Release Year
  const year = content.releaseYear || (content.releaseDate ? new Date(content.releaseDate).getFullYear() : (content.createdAt ? new Date(content.createdAt).getFullYear() : '2025'));

  // Genres (Primary & Secondary)
  let genreText = 'Action • Drama';
  if (Array.isArray(content.genre) && content.genre.length > 0) {
    genreText = content.genre.slice(0, 2).join(' • ');
  } else if (Array.isArray(content.genres) && content.genres.length > 0) {
    genreText = content.genres.slice(0, 2).join(' • ');
  } else if (typeof content.genre === 'string') {
    genreText = content.genre;
  } else if (content.category) {
    const catName = typeof content.category === 'object' ? content.category?.name : content.category;
    genreText = `${catName} • Popular`;
  }

  // Rating
  const rawRating = content.averageRating || content.rating || 9.0;
  const rating = Number(rawRating).toFixed(1);

  const handlePlay = (e) => {
    if (onPlay) {
      e.preventDefault();
      e.stopPropagation();
      onPlay(content);
    }
  };

  return (
    <Link
      to={link}
      className="group relative flex flex-col justify-between w-full h-full rounded-2xl overflow-hidden bg-[#090C12] border border-white/[0.08] hover:border-red-500/80 shadow-md hover:shadow-[0_8px_30px_rgba(255,23,68,0.28)] transition-all duration-300 hover:-translate-y-1.5 select-none"
    >
      {/* Poster Container */}
      <div className="relative h-[150px] sm:h-[165px] md:h-[240px] w-full overflow-hidden bg-zinc-950">
        <img
          src={poster}
          alt={content.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_POSTER;
          }}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090C12] via-black/20 to-black/30 pointer-events-none" />

        {/* Top-Left Type Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className={`px-2 py-0.5 rounded-md backdrop-blur-md text-[9px] font-black uppercase tracking-wider border shadow-sm ${badgeColor}`}>
            {qualityBadge}
          </span>
        </div>

        {/* Top-Right Duration / Episode / Read Count Badge */}
        <div className="absolute top-2 right-2 z-10">
          <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-bold text-white border border-white/15 shadow-sm">
            {metaBadge}
          </span>
        </div>

        {/* Play Overlay Hover Indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
          <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg shadow-red-600/50 scale-90 group-hover:scale-100 transition-transform">
            {isArticle ? (
              <FileText className="w-4 h-4 text-white" />
            ) : isAudio ? (
              <Headphones className="w-4 h-4 text-white" />
            ) : isImage ? (
              <ImageIcon className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 space-y-1 bg-[#090C12] flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 font-display leading-tight pb-1">
            {content.title}
          </h3>

          {/* Metadata Row */}
          <p className="text-[9.5px] sm:text-[10px] text-zinc-400 truncate">
            <span className="text-zinc-300 font-semibold">{year}</span>
            <span className="mx-1 text-zinc-600">•</span>
            <span>{genreText}</span>
          </p>
        </div>

        {/* Bottom Rating & Action Button */}
        <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
          <div className="inline-flex items-center gap-1 text-amber-400 text-[10.5px] font-bold font-mono">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{rating}</span>
          </div>

          <div className="w-6 h-6 rounded-full bg-red-600/20 group-hover:bg-red-600 text-red-400 group-hover:text-white border border-red-500/30 flex items-center justify-center transition-colors shrink-0">
            {isArticle ? (
              <FileText className="w-2.5 h-2.5" />
            ) : isAudio ? (
              <Headphones className="w-2.5 h-2.5" />
            ) : (
              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
