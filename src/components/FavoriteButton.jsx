import React from 'react';
import { Heart } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function FavoriteButton({ categoryName, className = '', showLabel = false }) {
  const { isFavoriteCategory, toggleFavoriteCategory } = useData();
  const favorited = isFavoriteCategory(categoryName);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteCategory(categoryName);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
        favorited
          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
          : 'bg-zinc-900/70 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
      } ${className}`}
      title={favorited ? 'Remove from favorites' : 'Add to favorite categories'}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorite categories'}
    >
      <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
      {showLabel && <span>{favorited ? 'Favorited' : 'Favorite'}</span>}
    </button>
  );
}
