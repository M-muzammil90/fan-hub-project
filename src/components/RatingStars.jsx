import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ value = 0, onChange, readOnly = false, size = 'md' }) {
  const [hoverValue, setHoverValue] = useState(0);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const currentDisplay = hoverValue || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = currentDisplay >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            className={`transition-transform ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
            aria-label={`Rate ${star} stars`}
          >
            <Star
              className={`${starSizes[size] || starSizes.md} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-zinc-600 hover:text-zinc-400'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
