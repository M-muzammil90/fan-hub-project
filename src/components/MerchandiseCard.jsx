import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowUpRight } from 'lucide-react';

export default function MerchandiseCard({ item, onAddToCart }) {
  const displayTitle = item.name || item.title || 'Merchandise';
  const displayImage = item.image || item.images?.[0] || item.imagesData?.[0]?.url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80';
  const categoryName = typeof item.category === 'object' ? item.category?.name : item.category || 'Gear';
  const displayPrice = typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : (item.price || '$49.99');
  const itemLink = `/merchandise/${item.slug || item._id}`;

  return (
    <div className="group rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-white/[0.07] bg-white dark:bg-gradient-to-b dark:from-[#0e1018] dark:to-[#080b12] hover:border-red-500/40 transition-all duration-300 hover:-translate-y-1.5 shadow-[0_4px_20px_rgba(225,29,72,0.05)] dark:shadow-none hover:shadow-[0_12px_36px_rgba(220,38,38,0.18)] dark:hover:shadow-[0_8px_40px_rgba(239,68,68,0.18)] flex flex-col justify-between">

      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-[#060810]">
        <Link to={itemLink} className="block w-full h-full">
          <img
            src={displayImage}
            alt={displayTitle}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          {/* Cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Discount badge */}
        {item.discount && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-red-600/40 border border-red-400/30">
            {item.discount}
          </span>
        )}

        {/* Quick view arrow */}
        <Link
          to={itemLink}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:border-red-400 transition-all duration-200"
          aria-label="View product"
        >
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 space-y-3">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">
            {categoryName}
          </span>
          <Link to={itemLink} className="block">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200 line-clamp-1 font-display">
              {displayTitle}
            </h4>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-white/[0.06]">
          <div className="space-y-0.5">
            <span className="text-base font-black text-zinc-900 dark:text-white font-mono">{displayPrice}</span>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart && onAddToCart(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold shadow-md shadow-red-600/30 hover:shadow-red-500/50 transition-all hover:scale-105 active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Bottom accent sweep */}
        <div className="h-[1px] bg-gradient-to-r from-red-500/0 via-red-500/35 to-red-500/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
      </div>
    </div>
  );
}

