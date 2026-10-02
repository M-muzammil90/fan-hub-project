import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Layers,
  Flame,
  Tv,
  Film,
  FileText,
  Headphones,
  Image as ImageIcon,
  Sparkles,
  Play
} from 'lucide-react';
import { useData } from '../context/DataContext';
import ContentCard from '../components/ContentCard';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { contentApi } from '../services/content.api';
import { seriesApi } from '../services/series.api';
import { categoryApi } from '../services/category.api';
import { apiFetch } from '../services/api';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { contentList: fallbackContent, categories: fallbackCategories, fanSubmissions: fallbackSubmissions } = useData();

  const queryParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const typeParam = searchParams.get('type') || 'all';
  const genreParam = searchParams.get('genre') || 'all';
  const sortParam = searchParams.get('sort') || 'popularity';

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedType, setSelectedType] = useState(typeParam);
  const [selectedGenre, setSelectedGenre] = useState(genreParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Database State
  const [dbItems, setDbItems] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all content, series, and fan articles directly from the database
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      contentApi.getContent({ limit: 150 }).catch(() => ({ content: [] })),
      seriesApi.getSeries({ limit: 100 }).catch(() => ({ series: [] })),
      apiFetch('/fan-submissions').catch(() => ({ submissions: [] })),
      categoryApi.getCategories().catch(() => ({ categories: [] }))
    ])
      .then(([contentRes, seriesRes, subRes, catRes]) => {
        if (!isMounted) return;

        const rawContent = contentRes?.content || contentRes?.data || (Array.isArray(contentRes) ? contentRes : []);
        const rawSeries = seriesRes?.series || seriesRes?.data || (Array.isArray(seriesRes) ? seriesRes : []);
        const rawSubs = subRes?.submissions || subRes?.data || (Array.isArray(subRes) ? subRes : []);
        const rawCats = catRes?.categories || catRes?.data || (Array.isArray(catRes) ? catRes : []);

        // 1. Format Standard Content Items (Videos, Trailers, Audios, Wallpapers, Articles)
        const formattedContent = rawContent.map((item) => {
          const catName = typeof item.category === 'object' ? item.category?.name : item.category;
          const is4k = item.is4K || item.quality === '4K' || (item.rating && Number(item.rating) >= 9.0) || item.contentType === 'video';
          return {
            ...item,
            _id: item._id || item.id,
            id: item._id || item.id,
            slug: item.slug || item._id,
            title: item.title,
            description: item.description || '',
            contentType: item.contentType || 'video',
            category: item.category,
            categoryName: catName || 'Media',
            genre: item.genre || [catName || 'Media'],
            genres: item.genre || [catName || 'Media'],
            rating: item.averageRating ? Number(item.averageRating).toFixed(1) : (item.rating ? String(item.rating) : '9.1'),
            poster: item.thumbnail || item.poster || item.backdrop || item.mediaUrl,
            thumbnail: item.thumbnail || item.poster || item.backdrop || item.mediaUrl,
            backdrop: item.backdrop || item.thumbnail || item.poster,
            image: item.backdrop || item.thumbnail || item.poster || item.mediaUrl,
            releaseDate: item.releaseDate || item.createdAt,
            createdAt: item.createdAt || item.releaseDate,
            viewCount: item.viewCount || 0,
            popularityScore: item.popularityScore || item.viewCount || 0,
            is4K: is4k,
            link: `/content/${item.slug || item._id}`
          };
        });

        // 2. Format Series Items from Database
        const formattedSeries = rawSeries.map((ser) => {
          const catName = typeof ser.category === 'object' ? ser.category?.name : ser.category;
          return {
            ...ser,
            _id: ser._id || ser.id,
            id: ser._id || ser.id,
            slug: ser.slug || ser._id,
            title: ser.title,
            description: ser.description || '',
            contentType: 'series',
            type: 'series',
            category: ser.category,
            categoryName: catName || 'Series',
            genre: ser.genres || ['Series'],
            genres: ser.genres || ['Series'],
            rating: ser.rating ? String(ser.rating) : '9.5',
            poster: ser.poster || ser.backdrop,
            thumbnail: ser.poster || ser.backdrop,
            backdrop: ser.backdrop || ser.poster,
            image: ser.poster || ser.backdrop,
            releaseDate: ser.releaseYear ? `${ser.releaseYear}-01-01` : ser.createdAt,
            createdAt: ser.createdAt,
            releaseYear: ser.releaseYear || '2025',
            seasonsCount: ser.seasonsCount || 1,
            episodesCount: ser.episodesCount || ser.totalEpisodes || 8,
            totalEpisodes: ser.episodesCount || ser.totalEpisodes || 8,
            viewCount: ser.viewCount || 0,
            popularityScore: ser.viewCount || 80,
            is4K: true,
            link: `/series/${ser.slug || ser._id}`
          };
        });

        // 3. Format Fan Submissions / Community Articles from Database
        const formattedArticles = rawSubs.map((sub) => {
          const catName = typeof sub.category === 'object' ? sub.category?.name : sub.category;
          return {
            ...sub,
            _id: sub._id || sub.id,
            id: sub._id || sub.id,
            slug: sub.slug || sub._id,
            title: sub.title,
            description: sub.description || (sub.content ? sub.content.slice(0, 130) + '...' : ''),
            content: sub.content,
            contentType: 'article',
            type: 'article',
            category: sub.category,
            categoryName: catName || 'Community Lore',
            genre: [catName || 'Fan Article'],
            genres: [catName || 'Fan Article'],
            rating: sub.likesCount ? (Math.min(9.9, 8.8 + (sub.likesCount % 10) * 0.1)).toFixed(1) : '9.3',
            poster: sub.image,
            thumbnail: sub.image,
            backdrop: sub.image,
            image: sub.image,
            creator: sub.user?.name || sub.creator || 'Community Creator',
            creatorAvatar: sub.user?.avatar || sub.creatorAvatar,
            readTime: sub.readTime || `${Math.max(2, Math.ceil((sub.content?.length || 500) / 250))}m read`,
            releaseDate: sub.createdAt || sub.submissionDate,
            createdAt: sub.createdAt || sub.submissionDate,
            viewCount: sub.viewsCount || (sub.likesCount ? sub.likesCount * 15 : 150),
            popularityScore: sub.likesCount ? sub.likesCount * 10 : 50,
            link: `/articles`
          };
        });

        // Combine all database items
        const combined = [...formattedContent, ...formattedSeries, ...formattedArticles];

        if (combined.length > 0) {
          setDbItems(combined);
        } else {
          setDbItems(fallbackContent);
        }

        if (rawCats.length > 0) {
          setDbCategories(rawCats);
        } else {
          setDbCategories(fallbackCategories);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setSearchTerm(queryParam);
    setSelectedCategory(categoryParam);
    setSelectedType(typeParam);
    setSelectedGenre(genreParam);
    setSortBy(sortParam);
  }, [queryParam, categoryParam, typeParam, genreParam, sortParam]);

  const activeContentList = dbItems.length > 0 ? dbItems : fallbackContent;
  const activeCategories = dbCategories.length > 0 ? dbCategories : fallbackCategories;

  // Extract all unique genres across all database items
  const allGenres = useMemo(() => {
    const set = new Set();
    activeContentList.forEach((c) => {
      if (Array.isArray(c.genres)) {
        c.genres.forEach((g) => {
          if (g && typeof g === 'string') set.add(g.trim());
        });
      }
      if (Array.isArray(c.genre)) {
        c.genre.forEach((g) => {
          if (g && typeof g === 'string') set.add(g.trim());
        });
      }
      if (typeof c.genre === 'string') set.add(c.genre.trim());
    });
    return Array.from(set).filter(Boolean);
  }, [activeContentList]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    let result = [...activeContentList];

    // 1. Text Search Filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((c) => {
        const titleMatch = c.title && c.title.toLowerCase().includes(q);
        const descMatch = c.description && c.description.toLowerCase().includes(q);
        const creatorMatch = c.creator && c.creator.toLowerCase().includes(q);
        const tagsMatch = c.tags && Array.isArray(c.tags) && c.tags.some((t) => t.toLowerCase().includes(q));
        const genreMatch = (c.genres || c.genre) && (Array.isArray(c.genres || c.genre)
          ? (c.genres || c.genre).some((g) => typeof g === 'string' && g.toLowerCase().includes(q))
          : typeof (c.genres || c.genre) === 'string' && (c.genres || c.genre).toLowerCase().includes(q));
        const catMatch = typeof c.category === 'object'
          ? (c.category?.name?.toLowerCase().includes(q) || c.category?.slug?.toLowerCase().includes(q))
          : (c.category && typeof c.category === 'string' && c.category.toLowerCase().includes(q));

        return titleMatch || descMatch || creatorMatch || tagsMatch || genreMatch || catMatch;
      });
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter((c) => {
        const catId = typeof c.category === 'object' ? c.category?._id : c.category;
        const catSlug = typeof c.category === 'object' ? c.category?.slug : c.categorySlug || c.category;
        const catName = typeof c.category === 'object' ? c.category?.name?.toLowerCase() : '';
        return (
          catId === selectedCategory ||
          catSlug === selectedCategory ||
          (catName && catName === selectedCategory.toLowerCase())
        );
      });
    }

    // 3. Content Type Filter
    if (selectedType !== 'all') {
      result = result.filter((c) => {
        if (selectedType === 'series') {
          return c.contentType === 'series' || c.type === 'series' || c.seasonsCount !== undefined;
        }
        if (selectedType === 'video') {
          return c.contentType === 'video' || c.type === 'movie' || (!c.contentType && !c.seasonsCount);
        }
        if (selectedType === 'article') {
          return c.contentType === 'article' || c.type === 'article';
        }
        if (selectedType === 'trailer') {
          return c.contentType === 'trailer';
        }
        if (selectedType === 'audio') {
          return c.contentType === 'audio' || c.type === 'audio';
        }
        if (selectedType === 'image') {
          return c.contentType === 'image' || c.type === 'image' || c.type === 'wallpaper';
        }
        return c.contentType === selectedType || c.type === selectedType;
      });
    }

    // 4. Genre Filter
    if (selectedGenre !== 'all') {
      result = result.filter((c) => {
        if (Array.isArray(c.genres)) return c.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());
        if (Array.isArray(c.genre)) return c.genre.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());
        return typeof c.genre === 'string' && c.genre.toLowerCase() === selectedGenre.toLowerCase();
      });
    }

    // 5. Sorting
    result.sort((a, b) => {
      if (sortBy === 'popularity') {
        const popA = Number(a.popularityScore || a.viewCount || a.rating || 0);
        const popB = Number(b.popularityScore || b.viewCount || b.rating || 0);
        return popB - popA;
      }
      if (sortBy === 'rating') {
        return Number(b.rating || 0) - Number(a.rating || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.releaseDate || b.createdAt || 0).getTime() - new Date(a.releaseDate || a.createdAt || 0).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.releaseDate || a.createdAt || 0).getTime() - new Date(b.releaseDate || b.createdAt || 0).getTime();
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    return result;
  }, [activeContentList, searchTerm, selectedCategory, selectedType, selectedGenre, sortBy]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedGenre('all');
    setSortBy('popularity');
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== 'all' ||
    selectedType !== 'all' ||
    selectedGenre !== 'all' ||
    sortBy !== 'popularity';

  return (
    <div className="space-y-8 sm:space-y-10 pb-20 max-w-7xl mx-auto px-2 sm:px-4">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-red-500/30 bg-gradient-to-r from-[#17050a] via-[#0d070b] to-[#080509] p-6 sm:p-10 shadow-[0_0_50px_rgba(255,23,56,0.15)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-red-900/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-current text-red-500" />
            <span>Fandom Database Explorer</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-[#ff3b60]">Content, Series & Articles</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
            Explore live database titles including movies, episodic series, fan articles & creations, OST soundtracks, and 4K wallpapers.
          </p>
        </div>
      </div>

      {/* 2. Filter & Search Panel */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#0b0c13] border border-white/[0.08] space-y-4 shadow-xl">
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, article lore, creator, genre or topic..."
            className="w-full pl-11 pr-28 py-3 bg-black/60 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-black shadow-md shadow-red-600/40 transition-all cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Realm / Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="all">All Realms / Categories</option>
              {activeCategories.map((c) => (
                <option key={c._id || c.id || c.slug} value={c.slug || c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Media Format Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Content Format
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="all">All Media Formats</option>
              <option value="video">Movies & Videos</option>
              <option value="series">Episodic Series & Shows</option>
              <option value="article">Fan Articles & Creations</option>
              <option value="trailer">Trailers & AMVs</option>
              <option value="audio">OSTs & Soundtracks</option>
              <option value="image">4K Wallpapers & Art</option>
            </select>
          </div>

          {/* Genre Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Genre / Lore
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="all">All Genres</option>
              {allGenres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="popularity">Most Popular / Views</option>
              <option value="rating">Top Rated (★ 9.0+)</option>
              <option value="newest">Latest Added</option>
              <option value="oldest">Oldest Catalog</option>
              <option value="title">Alphabetical (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Active Filters summary bar */}
        {hasActiveFilters && (
          <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08]">
            <span className="text-xs text-zinc-400">
              Found <strong className="text-white font-mono font-bold">{filteredItems.length}</strong> matching database items
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Items Grid */}
{/* =========================================================
    3. PREMIUM CONTENT CARDS GRID
========================================================= */}

{isLoading ? (
  <div
    className="
      grid
      grid-cols-2
      sm:grid-cols-3
      lg:grid-cols-4
      xl:grid-cols-5
      gap-x-4
      gap-y-7
      sm:gap-x-5
      sm:gap-y-8
    "
  >
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
      <div
        key={n}
        className="
          group
          overflow-hidden
          rounded-[22px]
          border border-white/[0.07]
          bg-[#0b0b0f]
          shadow-[0_12px_35px_rgba(0,0,0,0.28)]
        "
      >
        {/* Poster Skeleton */}
        <div className="relative aspect-[2/3] overflow-hidden bg-[#111116]">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.06] via-transparent to-red-500/[0.04]" />

          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <div className="h-3.5 w-[78%] rounded-full bg-white/[0.08] animate-pulse" />
            <div className="h-2.5 w-[52%] rounded-full bg-white/[0.05] animate-pulse" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="p-3.5 space-y-2">
          <div className="h-3 w-[80%] rounded-full bg-white/[0.07] animate-pulse" />
          <div className="h-2.5 w-[55%] rounded-full bg-white/[0.04] animate-pulse" />
        </div>
      </div>
    ))}
  </div>
) : filteredItems.length > 0 ? (
  <div className="space-y-10">

    {/* Results Header */}
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]" />

          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">
            Explore Collection
          </span>
        </div>

        <h2 className="mt-1.5 text-xl sm:text-2xl font-black tracking-tight text-white">
          Discover Content
        </h2>
      </div>

      <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5">
        <Layers className="h-3.5 w-3.5 text-zinc-500" />

        <span className="text-[10px] font-bold text-zinc-400">
          {filteredItems.length} Results
        </span>
      </div>
    </div>

    {/* Cards */}
    <div
      className="
        grid
        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        gap-x-4
        gap-y-8
        sm:gap-x-5
        sm:gap-y-9
      "
    >
      {paginatedItems.map((item) => (
        <div
          key={item._id || item.id || item.slug}
          className="
            group
            min-w-0
            h-full
            transition-all
            duration-300
            hover:-translate-y-1
          "
        >
          <div
            className="
              relative
              h-full
              rounded-[22px]
              transition-all
              duration-300
              group-hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)]
            "
          >
            {/* Red hover glow */}
            <div
              className="
                pointer-events-none
                absolute
                -inset-1
                rounded-[24px]
                bg-red-600/0
                blur-xl
                transition-all
                duration-300
                group-hover:bg-red-600/[0.08]
              "
            />

            {/* Card */}
            <div className="relative h-full">
              <ContentCard content={item} />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="pt-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }}
        />
      </div>
    )}
  </div>
) : (
  <EmptyState
    title="No database content found"
    description="We couldn't find any media or articles matching your current search and filters. Try clearing your filters."
    actionText="Reset All Filters"
    onAction={handleResetFilters}
  />
)}


    </div>
  );
}
