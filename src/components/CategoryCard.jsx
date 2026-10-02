import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';

const defaultCategoryImages = {
  anime: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=85',
  series: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=85',
  movies: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=85',
  movie: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=85',
  dramas: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&auto=format&fit=crop&q=85',
  drama: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&auto=format&fit=crop&q=85',
  gaming: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=85',
  games: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=85',
  'k-pop': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=85',
  kpop: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=85',
  comics: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=85',
  manga: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&auto=format&fit=crop&q=85',
  cosplay: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=85',
  audio: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=85'
};

export default function CategoryCard({ category }) {
  const [imgError, setImgError] = useState(false);

  const title = category?.name || category?.title || 'Category';
  const slug = category?.slug || category?._id || category?.id || 'all';
  const subtitle = category?.tagline || category?.description || category?.subtitle || title;
  const rating = category?.rating || '9.5';
  const badge = category?.badge || (category?.isFeatured ? 'FEATURED' : 'POPULAR');

  const slugKey = slug?.toString().toLowerCase().trim();
  const fallbackImg =
    defaultCategoryImages[slugKey] ||
    defaultCategoryImages[Object.keys(defaultCategoryImages).find((k) => slugKey.includes(k))] ||
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=85';

  const displayImage = !imgError && category?.image ? category.image : fallbackImg;
  const linkTo = category?.link || `/category/${slug}`;

  return (
    <Link
      to={linkTo}
      className="group relative flex flex-col justify-between w-full h-[160px] sm:h-[170px] rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d11] p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff1738] hover:shadow-[0_0_25px_rgba(255,20,50,0.25)] select-none"
    >
      {/* Background Artwork */}
      <img
        src={displayImage}
        alt={title}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/60 to-black/20" />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-[#ff1738]/5 transition-colors duration-300 pointer-events-none" />

      {/* Top Left Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#ff1738] text-white shadow-sm shadow-[#ff1738]/40">
          {badge}
        </span>
      </div>

      {/* Bottom Content Bar */}
      <div className="relative z-10 flex items-end justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-0.5">
          <h3 className="text-sm sm:text-base font-black text-white tracking-tight truncate group-hover:text-red-400 transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-300">
            <span className="truncate max-w-[140px] text-zinc-400 font-medium">
              {subtitle}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="inline-flex items-center gap-1 text-amber-400 font-bold font-mono">
              <Star className="w-3 h-3 fill-current" />
              <span>{rating}</span>
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