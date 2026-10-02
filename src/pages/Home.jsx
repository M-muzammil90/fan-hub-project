import React, { useState, useEffect } from 'react';
import HeroSlider from '../components/hero/HeroSlider';
import TrendingSection from '../components/sections/TrendingSection';
import DynamicCategorySection from '../components/sections/DynamicCategorySection';
import CharactersSection from '../components/sections/CharactersSection';
import ReleasesSection from '../components/sections/ReleasesSection';
import EventsSection from '../components/sections/EventsSection';
import EventBanner from '../components/sections/EventBanner';

import { categoryApi } from '../services/category.api';
import { contentApi } from '../services/content.api';
import { seriesApi } from '../services/series.api';
import { characterApi } from '../services/character.api';
import { eventApi } from '../services/event.api';
import { heroSlidesData } from '../data/homepage';

// Curated high-definition fallback items per category type
const defaultCategoryItemsMap = {
  anime: [
    {
      id: 'anime-1',
      title: 'Solo Leveling: Arise',
      genre: ['Action', 'Fantasy'],
      rating: 9.6,
      badge: 'FEATURED',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=85',
      link: '/category/anime'
    },
    {
      id: 'anime-2',
      title: 'Demon Slayer: Infinity Castle',
      genre: ['Supernatural', 'Action'],
      rating: 9.8,
      badge: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=85',
      link: '/category/anime'
    },
    {
      id: 'anime-3',
      title: 'Jujutsu Kaisen: Shibuya',
      genre: ['Dark Fantasy', 'Action'],
      rating: 9.4,
      badge: 'TRENDING',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=85',
      link: '/category/anime'
    },
    {
      id: 'anime-4',
      title: 'Chainsaw Man',
      genre: ['Horror', 'Action'],
      rating: 9.1,
      badge: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=85',
      link: '/category/anime'
    }
  ],
  series: [
    {
      id: 'ser-1',
      title: 'The Last of Us',
      genre: ['Drama', 'Survival'],
      rating: 9.5,
      badge: 'SERIES',
      image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&auto=format&fit=crop&q=85',
      link: '/series'
    },
    {
      id: 'ser-2',
      title: 'Arcane: League of Legends',
      genre: ['Animation', 'Sci-Fi'],
      rating: 9.9,
      badge: 'TOP RATED',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=85',
      link: '/series'
    },
    {
      id: 'ser-3',
      title: 'Stranger Things 5',
      genre: ['Mystery', 'Supernatural'],
      rating: 9.3,
      badge: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=85',
      link: '/series'
    },
    {
      id: 'ser-4',
      title: 'Cyberpunk: Edgerunners',
      genre: ['Cyberpunk', 'Action'],
      rating: 9.4,
      badge: 'SERIES',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=85',
      link: '/series'
    }
  ],
  movies: [
    {
      id: 'mov-1',
      title: 'Spider-Man: Beyond the Spider-Verse',
      genre: ['Action', 'Multiverse'],
      rating: 9.7,
      badge: 'BLOCKBUSTER',
      image: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=800&auto=format&fit=crop&q=85',
      link: '/category/movies'
    },
    {
      id: 'mov-2',
      title: 'Dune: Part Two',
      genre: ['Sci-Fi', 'Adventure'],
      rating: 9.6,
      badge: 'FEATURED',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=85',
      link: '/category/movies'
    },
    {
      id: 'mov-3',
      title: 'Cyberpunk Neon City',
      genre: ['Sci-Fi', 'Thriller'],
      rating: 9.0,
      badge: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=85',
      link: '/category/movies'
    }
  ],
  dramas: [
    {
      id: 'dra-1',
      title: 'Crash Landing on You',
      genre: ['Romance', 'Drama'],
      rating: 9.5,
      badge: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&auto=format&fit=crop&q=85',
      link: '/categories'
    },
    {
      id: 'dra-2',
      title: 'Vincenzo',
      genre: ['Crime', 'Dark Comedy'],
      rating: 9.4,
      badge: 'FEATURED',
      image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=85',
      link: '/categories'
    },
    {
      id: 'dra-3',
      title: 'Itaewon Class',
      genre: ['Drama', 'Revenge'],
      rating: 9.2,
      badge: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=85',
      link: '/categories'
    }
  ],
  gaming: [
    {
      id: 'gam-1',
      title: 'God of War Ragnarök',
      genre: ['Action', 'Mythology'],
      rating: 9.8,
      badge: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=85',
      link: '/category/gaming'
    },
    {
      id: 'gam-2',
      title: 'Elden Ring: Shadow of the Erdtree',
      genre: ['RPG', 'Open World'],
      rating: 9.7,
      badge: 'FEATURED',
      image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&auto=format&fit=crop&q=85',
      link: '/category/gaming'
    },
    {
      id: 'gam-3',
      title: 'Ghost of Tsushima',
      genre: ['Action', 'Samurai'],
      rating: 9.6,
      badge: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=85',
      link: '/category/gaming'
    }
  ]
};

export default function Home() {
  // Dynamic API state
  const [heroSlides, setHeroSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [categoryItemsMap, setCategoryItemsMap] = useState({});


  useEffect(() => {
    // 1. Fetch Dynamic Categories from API
    categoryApi
      .getCategories()
      .then((res) => {
        const list = res.categories || res || [];
        if (list && list.length > 0) {
          const categoryOrder = ['movies', 'series', 'anime', 'pakistani', 'dramas', 'drama', 'videos', 'gaming'];
          const formatted = list.map((cat, idx) => ({
            id: cat._id || cat.id || `api-cat-${idx}`,
            _id: cat._id || cat.id,
            slug: cat.slug || cat._id,
            title: typeof cat.name === 'object' ? (cat.name?.name || 'Category') : (cat.name || 'Category'),
            name: typeof cat.name === 'object' ? (cat.name?.name || 'Category') : (cat.name || 'Category'),
            subtitle: typeof cat.tagline === 'object' ? (cat.tagline?.name || 'Watch & Explore') : (cat.tagline || cat.description || 'Watch & Explore'),
            tagline: typeof cat.tagline === 'object' ? (cat.tagline?.name || 'Watch & Explore') : (cat.tagline || cat.description || 'Watch & Explore'),
            badge: cat.isFeatured ? 'FEATURED' : 'POPULAR',
            rating: cat.rating ? Number(cat.rating).toFixed(1) : (9.2 + (idx % 6) * 0.1).toFixed(1),
            icon: cat.iconType || 'film',
            image: cat.image || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=85',
            link: `/category/${cat.slug || cat._id}`
          }));

          formatted.sort((a, b) => {
            const indexA = categoryOrder.indexOf((a.slug || '').toLowerCase());
            const indexB = categoryOrder.indexOf((b.slug || '').toLowerCase());
            const posA = indexA === -1 ? 99 : indexA;
            const posB = indexB === -1 ? 99 : indexB;
            return posA - posB;
          });

          setCategories(formatted);
        }
      })
      .catch((err) => {
        console.info('Using showcase categories:', err.message);
      });

    // 2. Fetch Dynamic Content & Series to populate each category slider
    Promise.all([
      contentApi.getContent({ sortBy: 'popular', limit: 100 }).catch(() => ({ content: [] })),
      seriesApi.getSeries({ limit: 100 }).catch(() => ({ series: [] }))
    ]).then(([contentRes, seriesRes]) => {
      const allContent = contentRes.content || contentRes || [];
      const allSeries = seriesRes.series || seriesRes || [];

      // Build mapping of categoryId/slug -> items
      const map = {};

      // Add database contents to category map
      allContent.forEach((item) => {
        const catId = typeof item.category === 'object' ? item.category?._id : item.category;
        const catSlug = typeof item.category === 'object' ? item.category?.slug : item.category;
        const key = (catSlug || catId || '').toString().toLowerCase();

        if (!map[key]) map[key] = [];
        map[key].push({
          _id: item._id || item.id,
          slug: item.slug || item._id,
          title: item.title,
          genre: item.genre || [typeof item.category === 'object' ? item.category?.name : 'Media'],
          genres: item.genre || [typeof item.category === 'object' ? item.category?.name : 'Media'],
          rating: item.rating ? String(item.rating) : '9.2',
          badge: item.isFeatured ? 'FEATURED' : 'POPULAR',
          poster: item.poster || item.backdrop || item.thumbnail || item.mediaUrl,
          image: item.poster || item.backdrop || item.thumbnail || item.mediaUrl,
          thumbnail: item.thumbnail || item.poster || item.backdrop,
          duration: item.duration || (item.runtime ? `${Math.floor(item.runtime / 60)}h ${(item.runtime % 60).toString().padStart(2, '0')}m` : '2h 15m'),
          runtime: item.runtime,
          quality: item.quality || (Number(item.rating) >= 9.0 ? '4K' : 'HD'),
          is4K: item.is4K || item.quality === '4K' || Number(item.rating) >= 9.0,
          releaseYear: item.releaseDate ? new Date(item.releaseDate).getFullYear() : (item.releaseYear || '2024'),
          link: `/content/${item.slug || item._id}`,
          videoUrl: item.mediaUrl
        });
      });

      // Add database series to category map
      allSeries.forEach((ser) => {
        const catId = typeof ser.category === 'object' ? ser.category?._id : ser.category;
        const catSlug = typeof ser.category === 'object' ? ser.category?.slug : ser.category;
        const key = (catSlug || catId || 'series').toString().toLowerCase();

        if (!map[key]) map[key] = [];
        map[key].push({
          _id: ser._id || ser.id,
          slug: ser.slug || ser._id,
          title: ser.title,
          genre: ser.genres || ['Series'],
          genres: ser.genres || ['Series'],
          rating: ser.rating ? String(ser.rating) : '9.5',
          badge: 'SERIES',
          poster: ser.poster || ser.backdrop,
          image: ser.poster || ser.backdrop,
          totalEpisodes: ser.totalEpisodes || ser.episodes?.length || 8,
          episodes: ser.totalEpisodes || ser.episodes?.length || 8,
          quality: '4K',
          is4K: true,
          releaseYear: ser.releaseYear || '2024',
          link: `/series/${ser.slug || ser._id}`,
          videoUrl: ser.trailerUrl
        });

        // Also ensure it is present under 'series' key
        if (key !== 'series') {
          if (!map['series']) map['series'] = [];
          map['series'].push(map[key][map[key].length - 1]);
        }
      });

      setCategoryItemsMap(map);

      // 2. Populate Hero Slider strictly with items marked as isFeatured
      const featuredContent = allContent
        .filter((item) => item.isFeatured === true || item.isFeatured === 'true')
        .map((item, idx) => {
          const catName = typeof item.category === 'object' ? (item.category?.name || 'ANIME') : (item.category || 'ANIME');
          const bgImg = item.backdrop || item.thumbnail || item.mediaUrl || heroSlidesData[idx % heroSlidesData.length]?.image;
          return {
            id: item._id || item.id || `dyn-slide-${idx}`,
            badge: catName.toUpperCase(),
            title: item.title,
            subtitle: (item.genre && item.genre.length > 0 ? (Array.isArray(item.genre) ? item.genre.join(' • ') : item.genre) : (item.contentType ? item.contentType.toUpperCase() : 'Featured Title')),
            description: item.description || 'Watch now on FanHub Plus.',
            image: bgImg,
            characterArt: bgImg,
            link: `/content/${item.slug || item._id}`,
            videoUrl: item.mediaUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
            rating: item.averageRating && item.averageRating > 0 ? Number(item.averageRating).toFixed(1) : (item.rating ? String(item.rating) : '9.0'),
            year: item.releaseDate ? new Date(item.releaseDate).getFullYear() : '2025',
            genres: Array.isArray(item.genre) ? item.genre : [item.genre].filter(Boolean)
          };
        });

      const featuredSeries = (allSeries || [])
        .filter((ser) => ser.isFeatured === true || ser.isFeatured === 'true')
        .map((ser, idx) => {
          const catName = typeof ser.category === 'object' ? (ser.category?.name || 'SERIES') : (ser.category || 'SERIES');
          const bgImg = ser.backdrop || ser.poster || heroSlidesData[idx % heroSlidesData.length]?.image;
          return {
            id: ser._id || ser.id || `dyn-ser-slide-${idx}`,
            badge: catName.toUpperCase(),
            title: ser.title,
            subtitle: (ser.genres && ser.genres.length > 0 ? ser.genres.join(' • ') : 'Series'),
            description: ser.description || 'Watch now on FanHub Plus.',
            image: bgImg,
            characterArt: bgImg,
            link: `/series/${ser.slug || ser._id}`,
            videoUrl: ser.trailerUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
            rating: ser.rating ? String(ser.rating) : '9.5',
            year: ser.releaseYear || '2025',
            genres: ser.genres || ['Series']
          };
        });

      const allFeaturedSlides = [...featuredContent, ...featuredSeries];

      if (allFeaturedSlides.length > 0) {
        setHeroSlides(allFeaturedSlides);
      } else {
        setHeroSlides([
          {
            id: 'dyn-fallback-1',
            badge: 'FEATURED',
            title: 'Demon Slayer: Infinity Castle',
            subtitle: 'Dark Fantasy • Action',
            description: 'The final showdown between the Demon Slayer Corps and Muzan Kibutsuji begins within the shifting corridors of the Infinity Castle.',
            image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop&q=85',
            characterArt: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=85',
            link: '/category/anime',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            rating: '9.8',
            year: '2026'
          }
        ]);
      }

      const formattedTrending = allContent.slice(0, 10).map((item) => {
        const catName = typeof item.category === 'object' ? (item.category?.name || 'Anime') : (item.category || 'Anime');
        return {
          id: item._id || item.id,
          title: item.title,
          category: catName,
          categoryFilter: catName,
          rating: item.rating ? String(item.rating) : '9.0',
          badge: item.isFeatured ? 'FEATURED' : 'TRENDING',
          image: item.backdrop || item.thumbnail || item.mediaUrl,
          link: `/content/${item.slug || item._id}`
        };
      });
      setTrendingItems(formattedTrending);
    });

    // 3. Fetch characters from API
    characterApi
      .getCharacters()
      .then((res) => {
        const list = res.characters || res || [];
        if (list && list.length > 0) {
          const formatted = list.slice(0, 8).map((char) => {
            const catName = typeof char.category === 'object' ? (char.category?.name || 'Anime') : (char.category || 'Anime');
            return {
              id: char._id || char.id,
              name: char.name,
              category: catName,
              rating: char.rating ? String(char.rating) : '9.2',
              badge: 'POPULAR',
              image: char.avatar || char.image || char.banner,
              link: `/characters/${char.slug || char._id}`
            };
          });
          setCharacters(formatted);
        }
      })
      .catch((err) => {
        console.info('Using database characters:', err.message);
      });
  }, []);

  return (
    <div className="w-full space-y-10 sm:space-y-12 pb-10">
      {/* 1. HERO SLIDER (Controlled by Admin Dashboard isFeatured toggle) */}
      {heroSlides.length > 0 && (
        <HeroSlider slides={heroSlides} />
      )}

      {/* 2. DEDICATED CATEGORY SLIDERS (Image 2 exact style: Movies, Series, Anime, Dramas, etc.) */}
      {categories.map((cat) => {
        const slugKey = (cat.slug || cat._id || '').toString().toLowerCase().trim();
        const idKey = (cat._id || cat.id || '').toString().toLowerCase().trim();

        // Get matching items from database content/series or rich fallback items
        const dbItems = categoryItemsMap[slugKey] || categoryItemsMap[idKey] || [];
        const fallbackItems =
          defaultCategoryItemsMap[slugKey] ||
          defaultCategoryItemsMap[Object.keys(defaultCategoryItemsMap).find((k) => slugKey.includes(k))] ||
          defaultCategoryItemsMap.anime.map((it, i) => ({
            ...it,
            id: `${slugKey}-${i}`,
            title: `${cat.name || 'Title'} ${i + 1}`,
            image: cat.image,
            link: `/category/${cat.slug}`
          }));

        const finalItems = dbItems.length > 0 ? dbItems : fallbackItems;

        return (
          <DynamicCategorySection
            key={cat.id || cat.slug || cat._id}
            category={cat}
            items={finalItems}
          />
        );
      })}

      {/* 5. UPCOMING RELEASES (100% Database Driven) */}
      <ReleasesSection />

      {/* 6. FAN EVENTS & CONVENTIONS (100% Database Driven Event Slider) */}
      <EventsSection />

      {/* 8. PROMOTIONAL STREAMING FOOTER BANNER (Exact Screenshot 1 Layout) */}
      <div className="relative rounded-2xl overflow-hidden border border-red-900/40 bg-gradient-to-r from-[#1a0509] via-[#0d080c] to-[#1a0509] p-5 sm:p-6 shadow-[0_0_40px_rgba(255,23,56,0.15)] flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full lg:w-auto flex-1">
          {/* Feature 1 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-[#ff1738] shrink-0 shadow-md">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Unlimited Entertainment</h4>
              <p className="text-[11px] text-zinc-400">Movies • Series • Anime • More</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-3.5 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-6">
            <div className="w-11 h-11 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-[#ff1738] shrink-0 shadow-md">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M7 2v11h3v9l7-12h-4l4-8z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-black text-white">High Quality Streaming</h4>
              <p className="text-[11px] text-zinc-400">HD • Full HD • 4K</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-3.5 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-6">
            <div className="w-11 h-11 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-[#ff1738] shrink-0 shadow-md">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Watch Anywhere</h4>
              <p className="text-[11px] text-zinc-400">TV • Mobile • Tablet • PC</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('explore-section') || window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
          className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#ff1738] hover:bg-red-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-[0_4px_25px_rgba(255,23,56,0.4)] hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <span>Start Watching Now</span>
          <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

