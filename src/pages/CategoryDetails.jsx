import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Layers,
  Film,
  ImageIcon,
  FileText,
  Users,
  ShoppingBag,
  Calendar,
  Flame,
  Play,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { categoryApi } from '../services/category.api';
import { contentApi } from '../services/content.api';
import { characterApi } from '../services/character.api';
import { merchandiseApi } from '../services/merchandise.api';
import { eventApi } from '../services/event.api';

import CategoryHeroSlider from '../components/hero/CategoryHeroSlider';
import CategoryVideoCard from '../components/cards/CategoryVideoCard';
import CategoryTrendingCard from '../components/cards/CategoryTrendingCard';
import CharacterCard from '../components/cards/CharacterCard';
import EventCard from '../components/events/EventCard';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

import { heroSlidesData, trendingNowData } from '../data/homepage';

export default function CategoryDetails() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [merchandise, setMerchandise] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError('');

    async function loadCategoryData() {
      try {
        // 1. Fetch Categories
        const catRes = await categoryApi.getCategories();
        const allCats = catRes.categories || catRes || [];
        const matchedCat = allCats.find(
          (c) =>
            c.slug?.toLowerCase() === slug?.toLowerCase() ||
            c._id === slug ||
            c.id === slug ||
            c.name?.toLowerCase() === slug?.toLowerCase()
        );

        if (!matchedCat) {
          if (isMounted) {
            setError('Category not found.');
            setIsLoading(false);
          }
          return;
        }

        if (isMounted) {
          setCategory(matchedCat);
        }

        const catId = matchedCat._id || matchedCat.id;
        const catSlug = matchedCat.slug || slug;
        const catName = matchedCat.name.toLowerCase();

        // 2. Fetch Content, Characters, Merchandise, Events in parallel
        const [contentRes, charRes, merchRes, eventRes] = await Promise.allSettled([
          contentApi.getContent(),
          characterApi.getCharacters(),
          merchandiseApi.getMerchandise(),
          eventApi.getEvents()
        ]);

        if (isMounted) {
          // Process Content matching category
          if (contentRes.status === 'fulfilled' && contentRes.value) {
            const allItems = contentRes.value.content || contentRes.value || [];
            const filtered = allItems.filter((item) => {
              if (!item) return false;
              if (typeof item.category === 'object' && item.category) {
                return (
                  item.category._id === catId ||
                  item.category.slug === catSlug ||
                  (item.category.name && item.category.name.toLowerCase() === catName)
                );
              }
              const itemCatStr = String(item.category || item.categorySlug || '').toLowerCase();
              return itemCatStr === catSlug.toLowerCase() || itemCatStr === catName;
            });
            setContentList(filtered);
          }

          // Process Characters matching category
          if (charRes.status === 'fulfilled' && charRes.value) {
            const allChars = charRes.value.characters || charRes.value || [];
            const filtered = allChars.filter((ch) => {
              if (!ch) return false;
              if (typeof ch.category === 'object' && ch.category) {
                return (
                  ch.category._id === catId ||
                  ch.category.slug === catSlug ||
                  (ch.category.name && ch.category.name.toLowerCase() === catName)
                );
              }
              const str = String(ch.category || ch.categorySlug || '').toLowerCase();
              return str === catSlug.toLowerCase() || str === catName;
            });
            setCharacters(filtered);
          }

          // Process Merchandise matching category
          if (merchRes.status === 'fulfilled' && merchRes.value) {
            const allMerch = merchRes.value.merchandise || merchRes.value || [];
            const filtered = allMerch.filter((m) => {
              if (!m) return false;
              if (typeof m.category === 'object' && m.category) {
                return (
                  m.category._id === catId ||
                  m.category.slug === catSlug ||
                  (m.category.name && m.category.name.toLowerCase() === catName)
                );
              }
              const str = String(m.category || m.categorySlug || '').toLowerCase();
              return str === catSlug.toLowerCase() || str === catName;
            });
            setMerchandise(filtered);
          }

          // Process Events matching category
          if (eventRes.status === 'fulfilled' && eventRes.value) {
            const allEvents = eventRes.value.events || eventRes.value || [];
            const filtered = allEvents.filter((evt) => {
              if (!evt) return false;
              if (typeof evt.category === 'object' && evt.category) {
                return (
                  evt.category._id === catId ||
                  evt.category.slug === catSlug ||
                  (evt.category.name && evt.category.name.toLowerCase() === catName)
                );
              }
              const str = String(evt.category || evt.categorySlug || '').toLowerCase();
              return str === catSlug.toLowerCase() || str === catName;
            });
            setEvents(filtered);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load category details.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCategoryData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Tab Filtering & Sorting
  const filteredContent = useMemo(() => {
    let list = [...contentList];

    if (activeTab === 'videos') {
      list = list.filter((c) => c.contentType === 'video' || c.contentType === 'trailer');
    } else if (activeTab === 'wallpapers') {
      list = list.filter((c) => c.contentType === 'image');
    } else if (activeTab === 'articles') {
      list = list.filter((c) => c.contentType === 'article');
    }

    list.sort((a, b) => {
      if (sortBy === 'popular') return (b.popularityScore || b.popularity || 0) - (a.popularityScore || a.popularity || 0);
      if (sortBy === 'latest') return new Date(b.createdAt || b.releaseDate || 0).getTime() - new Date(a.createdAt || a.releaseDate || 0).getTime();
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    return list;
  }, [contentList, activeTab, sortBy]);

  // Generate category slides for Hero Slider
  const heroSlides = useMemo(() => {
    if (contentList && contentList.length > 0) {
      return contentList.slice(0, 5).map((item) => {
        const isSeries =
          item.contentType === 'series' ||
          item.type === 'series' ||
          item.seasonsCount !== undefined ||
          (item.category &&
            (item.category === 'series' ||
              item.category?.slug === 'series' ||
              item.category?.name?.toLowerCase() === 'series'));
        return {
          id: item._id || item.id,
          badge: (item.contentType || category?.name || 'FEATURED').toUpperCase(),
          title: item.title,
          subtitle: item.genre?.join(' • ') || item.tagline || 'Featured in ' + (category?.name || 'Realm'),
          description: item.description || 'Watch now on FanHub Plus.',
          rating: item.rating ? String(item.rating) : '9.0',
          genres: item.genre || ['Action', 'Adventure'],
          year: item.releaseDate ? new Date(item.releaseDate).getFullYear() : '2024',
          image: item.backdrop || item.thumbnail || item.mediaUrl || heroSlidesData[0].image,
          characterArt: item.backdrop || item.thumbnail || item.mediaUrl || heroSlidesData[0].characterArt,
          link: item.link || (isSeries ? `/series/${item.slug || item._id}` : `/content/${item.slug || item._id}`),
          videoUrl: item.mediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        };
      });
    }
    return heroSlidesData;
  }, [contentList, category]);

  // Videos & Movies list (use DB content or high polish default showcase)
  const latestVideos = useMemo(() => {
    if (contentList && contentList.length > 0) {
      return contentList;
    }
    // High-polish showcase items matching reference image
    return [
      {
        id: 'mock-1',
        title: 'Infinity Castle',
        badge: 'MOVIE',
        genre: ['Action', 'Adventure', 'Fantasy'],
        rating: '9.0',
        duration: '2h 35m',
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
        link: '/content/infinity-castle',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      },
      {
        id: 'mock-2',
        title: 'Spider-Man: Across the Spider-Verse',
        badge: 'MOVIE',
        genre: ['Animation', 'Action', 'Adventure'],
        rating: '9.2',
        duration: '2h 20m',
        image: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=800&auto=format&fit=crop&q=80',
        link: '/content/spider-man',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      },
      {
        id: 'mock-3',
        title: 'Naruto Shippuden',
        badge: 'SERIES',
        genre: ['Anime', 'Action', 'Adventure'],
        rating: '8.9',
        duration: '24m/ep',
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
        link: '/content/naruto-shippuden',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      },
      {
        id: 'mock-4',
        title: 'Joker',
        badge: 'MOVIE',
        genre: ['Crime', 'Drama', 'Thriller'],
        rating: '8.8',
        duration: '2h 02m',
        image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
        link: '/content/joker',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      }
    ];
  }, [contentList]);

  // Trending items list
  const trendingList = useMemo(() => {
    return [
      {
        id: 'tr-1',
        title: 'Attack on Titan',
        rating: '9.3',
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      },
      {
        id: 'tr-2',
        title: 'Demon Slayer',
        rating: '9.1',
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      },
      {
        id: 'tr-3',
        title: 'One Piece',
        rating: '9.0',
        image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      },
      {
        id: 'tr-4',
        title: 'Jujutsu Kaisen',
        rating: '8.8',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      },
      {
        id: 'tr-5',
        title: 'Death Note',
        rating: '8.6',
        image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      },
      {
        id: 'tr-6',
        title: 'Dragon Ball Super',
        rating: '8.5',
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      }
    ];
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#ff1738] animate-spin" />
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          Loading {slug} Realm...
        </p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <EmptyState
        title="Category Not Found"
        description="The category you requested does not exist or has been relocated."
        actionText="Browse All Categories"
        actionLink="/categories"
      />
    );
  }

  return (
    <div className="w-full space-y-8 sm:space-y-10 pb-16">
      {/* 1. TOP HERO BANNER SLIDER (Matching Reference Image 1) */}
      <CategoryHeroSlider
        slides={heroSlides}
        defaultCategoryName={category?.name || 'Anime'}
        onWatch={(media) =>
          setActiveVideoModal({
            title: media.title,
            subtitle: media.subtitle,
            url: media.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          })
        }
      />

      {/* 2. FILTER & CATEGORY TABS BAR (Matching Reference Image 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        {/* Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: `All Content (${contentList.length || latestVideos.length})`, icon: Layers },
            { id: 'videos', label: 'Videos & Movies', icon: Film },
            { id: 'wallpapers', label: 'Wallpapers & Art', icon: ImageIcon },
            { id: 'articles', label: 'Articles & Lore', icon: FileText },
            { id: 'characters', label: `Characters (${characters.length})`, icon: Users },
            { id: 'merchandise', label: `Merch (${merchandise.length})`, icon: ShoppingBag },
            { id: 'events', label: `Events (${events.length})`, icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 select-none ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 border border-red-400/40 scale-102'
                    : 'bg-[#0a0b10] text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.08]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-current" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sorting Dropdown */}
        {['all', 'videos', 'wallpapers', 'articles'].includes(activeTab) && (
          <div className="flex items-center gap-2 text-xs self-end sm:self-auto shrink-0">
            <span className="text-zinc-400 font-bold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0b0b0f] border border-white/15 text-white rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-red-500"
            >
              <option value="latest">Latest Added</option>
              <option value="popular">Most Popular</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        )}
      </div>

      {/* 3. DEFAULT "ALL CONTENT" OR "VIDEOS" VIEW (Matching Reference Image 1) */}
      {(activeTab === 'all' || activeTab === 'videos') && (
        <div className="space-y-10">
          {/* SECTION 1: LATEST VIDEOS & MOVIES */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight font-display">
                    Latest Videos & Movies
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium">
                    Discover the newest videos, movies, trailers and more.
                  </p>
                </div>
              </div>

              <Link
                to="/videos"
                className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-red-500 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4-Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {latestVideos.slice(0, 4).map((item) => (
                <CategoryVideoCard
                  key={item._id || item.id}
                  item={item}
                  onPlay={(media) =>
                    setActiveVideoModal({
                      title: media.title,
                      url: media.videoUrl || media.mediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                    })
                  }
                />
              ))}
            </div>
          </section>

          {/* SECTION 2: TRENDING NOW */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-md">
                  <Flame className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight font-display">
                    Trending Now
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium">
                    Most watched and talked about right now.
                  </p>
                </div>
              </div>

              <Link
                to="/explore"
                className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-red-500 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 6-Card Row Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {trendingList.map((item) => (
                <CategoryTrendingCard
                  key={item.id}
                  item={item}
                  onPlay={(media) =>
                    setActiveVideoModal({
                      title: media.title,
                      url: media.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                    })
                  }
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* 4. WALLPAPERS & ART TAB */}
      {activeTab === 'wallpapers' && (
        <div>
          {filteredContent.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#0a0b10] border border-white/10 space-y-3 p-8">
              <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Wallpapers Found</h3>
              <p className="text-xs text-zinc-400">No wallpapers currently uploaded in {category.name}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredContent.map((item) => (
                <div
                  key={item._id || item.id}
                  className="group rounded-2xl overflow-hidden bg-[#0a0b10] border border-white/10 hover:border-red-500 transition-all"
                >
                  <div className="aspect-video relative overflow-hidden bg-black">
                    <img
                      src={item.mediaUrl || item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. ARTICLES & LORE TAB */}
      {activeTab === 'articles' && (
        <div>
          {filteredContent.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#0a0b10] border border-white/10 space-y-3 p-8">
              <FileText className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Articles Found</h3>
              <p className="text-xs text-zinc-400">No lore articles currently written for {category.name}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContent.map((item) => (
                <Link
                  key={item._id || item.id}
                  to={`/content/${item.slug || item._id}`}
                  className="p-5 rounded-2xl bg-[#0a0b10] border border-white/10 hover:border-red-500 space-y-2 block"
                >
                  <h4 className="text-sm font-bold text-white hover:text-red-400">{item.title}</h4>
                  <p className="text-xs text-zinc-400 line-clamp-2">{item.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. CHARACTERS TAB */}
      {activeTab === 'characters' && (
        <div>
          {characters.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#0a0b10] border border-white/10 space-y-3 p-8">
              <Users className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Characters Found</h3>
              <p className="text-xs text-zinc-400">No lore characters currently registered under {category.name}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {characters.map((char) => (
                <CharacterCard key={char._id || char.id} character={char} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. MERCHANDISE TAB */}
      {activeTab === 'merchandise' && (
        <div>
          {merchandise.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#0a0b10] border border-white/10 space-y-3 p-8">
              <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Merchandise Found</h3>
              <p className="text-xs text-zinc-400">No shop items currently listed under {category.name}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {merchandise.map((m) => (
                <Link
                  key={m._id || m.id}
                  to={`/merchandise/${m.slug || m._id}`}
                  className="group rounded-2xl overflow-hidden border border-white/10 bg-[#0a0b10] hover:border-red-500 p-3 space-y-2 transition-all hover:-translate-y-1"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-black">
                    <img
                      src={m.image}
                      alt={m.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-red-400">{m.title}</h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-red-400">${m.price || '29.99'}</span>
                    <span className="text-[10px] text-zinc-500 uppercase">{m.category?.name || category.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. EVENTS TAB */}
      {activeTab === 'events' && (
        <div>
          {events.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#0a0b10] border border-white/10 space-y-3 p-8">
              <Calendar className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Events Found</h3>
              <p className="text-xs text-zinc-400">No community events currently scheduled under {category.name}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((evt) => (
                <EventCard key={evt._id || evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
