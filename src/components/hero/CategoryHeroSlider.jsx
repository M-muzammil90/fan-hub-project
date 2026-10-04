import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Info, Star, ChevronLeft, ChevronRight, Sparkles, Calendar } from 'lucide-react';

export default function CategoryHeroSlider({ slides = [], onWatch, defaultCategoryName = 'Anime' }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const getSlideLink = (slide) => {
    if (!slide) return '/';
    if (slide.link) return slide.link;
    const isSeries =
      slide.badge === 'SERIES' ||
      slide.type === 'series' ||
      slide.contentType === 'series' ||
      (slide.category &&
        (slide.category === 'series' ||
          slide.category?.slug === 'series' ||
          slide.category?.name?.toLowerCase() === 'series'));
    const slug = slide.slug || slide.id || slide._id;
    return isSeries ? `/series/${slug}` : `/content/${slug}`;
  };

  // Fallback default slides if category has no slides
  const defaultSlides = [
    {
      id: 'cat-slide-1',
      badge: 'FEATURED',
      title: 'Spider-Man',
      subtitle: 'With great power comes great responsibility.',
      description:
        'Miles Morales navigates life as a teenager while becoming the Spider-Man of his own universe, encountering Spider-Heroes from across alternate dimensions.',
      rating: '9.0',
      genres: ['Action', 'Adventure'],
      year: '2023',
      image: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=1600&auto=format&fit=crop&q=85',
      characterArt: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=1200&auto=format&fit=crop&q=85',
      link: '/content/spider-man',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      id: 'cat-slide-2',
      badge: 'FEATURED',
      title: 'Infinity Castle',
      subtitle: 'Demon Slayer: The Ultimate Climax',
      description:
        'The final battle begins inside the shifting Infinity Castle as the Demon Slayer Corps face the terrifying Upper Ranks and Muzan Kibutsuji.',
      rating: '9.2',
      genres: ['Action', 'Fantasy'],
      year: '2025',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop&q=85',
      characterArt: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=85',
      link: '/content/demon-slayer',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      id: 'cat-slide-3',
      badge: 'FEATURED',
      title: 'Naruto Shippuden',
      subtitle: 'The Great Ninja War',
      description:
        'Shinobi nations unite against the greatest threat in ninja history. Naruto embraces his destiny to bring true peace to the world.',
      rating: '8.9',
      genres: ['Anime', 'Action'],
      year: '2024',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=85',
      characterArt: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=85',
      link: '/content/naruto-shippuden',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
  ];

  const activeSlides = slides && slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const current = activeSlides[currentIndex] || activeSlides[0];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const rawGenres = current.genres || current.genre || ['Action', 'Adventure'];
  const displayGenres = Array.isArray(rawGenres) ? rawGenres : [String(rawGenres)];

  const splitTitle = (text = '') => {
    const parts = text.split('-');
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}-<span className="text-[#ff1738]">{parts.slice(1).join('-')}</span>
        </>
      );
    }
    const words = text.split(' ');
    if (words.length > 1) {
      return (
        <>
          {words.slice(0, -1).join(' ')}{' '}
          <span className="text-[#ff1738]">{words[words.length - 1]}</span>
        </>
      );
    }
    return text;
  };

  return (
    <div
      onClick={() => navigate(getSlideLink(current))}
      className="relative w-full h-[270px] sm:h-[320px] md:h-[350px] rounded-3xl overflow-hidden border border-red-500/30 bg-[#070709] shadow-[0_0_50px_rgba(255,23,56,0.2)] group select-none cursor-pointer"
    >
      {/* Background Ambience & Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#070709] via-[#070709]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent z-10 pointer-events-none" />

      {/* Red Glow Aura on Right */}
      <div className="absolute -right-20 -top-20 w-[420px] h-[420px] bg-[#ff1738]/25 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute right-1/4 bottom-0 w-80 h-80 bg-red-800/15 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Right Character Art */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-2/3 lg:w-3/5 z-0 overflow-hidden">
        <img
          key={current.id || currentIndex}
          src={current.characterArt || current.image}
          alt={current.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-right-top transition-all duration-700 ease-out transform group-hover:scale-105 animate-in fade-in duration-500"
        />
      </div>

      {/* Center/Right Play Indicator Overlay on Hover */}
      <div className="pointer-events-none absolute right-16 sm:right-28 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center z-20">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-[0_0_30px_rgba(255,23,56,0.8)] border border-white/40 transform group-hover:scale-110 transition-all duration-300 backdrop-blur-md">
          <Play className="w-6 h-6 fill-white ml-0.5" />
        </div>
      </div>

      {/* Left Content Overlay */}
      <div className="relative z-20 h-full flex flex-col justify-between p-5 sm:p-8 md:p-10 max-w-xl">
        <div className="space-y-2.5 sm:space-y-3">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-md shadow-red-600/40">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>{current.badge || 'FEATURED'}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display leading-[1.1]">
            {splitTitle(current.title)}
          </h1>

          {/* Subtitle */}
          {current.subtitle && (
            <p className="text-xs sm:text-sm font-bold text-zinc-200 line-clamp-1">
              {current.subtitle}
            </p>
          )}

          {/* Description */}
          {current.description && (
            <p className="text-[11px] sm:text-xs text-zinc-400 font-medium leading-relaxed line-clamp-2 max-w-md">
              {current.description}
            </p>
          )}

          {/* Metadata Row (Rating, Genres, Year) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* Rating Pill */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs font-bold text-amber-400 font-mono">
              <Star className="w-3 h-3 fill-current" />
              <span>{current.rating || '9.0'}</span>
            </div>

            {/* Genre Pills */}
            {displayGenres.map((g) => (
              <span
                key={g}
                className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-[11px] font-semibold text-zinc-300"
              >
                {g}
              </span>
            ))}

            {/* Year */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-zinc-300">
              <Calendar className="w-3 h-3 text-red-500" />
              <span>{current.year || '2024'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(getSlideLink(current));
            }}
            className="px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#ff1738] via-rose-600 to-[#d90429] hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-red-600/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-red-400/40"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
            <span>Watch Now</span>
          </button>

          <Link
            to={getSlideLink(current)}
            onClick={(e) => e.stopPropagation()}
            className="px-5 py-2.5 sm:py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-white border border-white/20 hover:border-red-500/60 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Info className="w-4 h-4 text-red-400" />
            <span>More Details</span>
          </Link>
        </div>
      </div>

      {/* Bottom Right: Carousel Navigation Dots & Arrows */}
      {activeSlides.length > 1 && (
        <div className="absolute right-6 bottom-5 z-20 flex items-center gap-3">
          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === idx
                    ? 'w-5 h-1.5 bg-[#ff1738] shadow-sm shadow-[#ff1738]'
                    : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Circle Arrow Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="w-8 h-8 rounded-full bg-black/70 hover:bg-[#ff1738] border border-white/15 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="w-8 h-8 rounded-full bg-black/70 hover:bg-[#ff1738] border border-white/15 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
