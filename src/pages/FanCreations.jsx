import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  Search,
  FileText,
  Heart,
  Share2,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  Tag,
  ArrowUpRight,
  X,
  BookOpen,
  Layers,
  Flame
} from 'lucide-react';
import { useData } from '../context/DataContext';
import FanSubmissionCard from '../components/FanSubmissionCard';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { apiFetch } from '../services/api';
import { contentApi } from '../services/content.api';
import { categoryApi } from '../services/category.api';

export default function FanCreations() {
  const { fanSubmissions: fallbackSubmissions, categories: fallbackCategories } = useData();
  const [dbSubmissions, setDbSubmissions] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeArticleModal, setActiveArticleModal] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);

  // Fetch Fan Submissions & Content Articles directly from MongoDB
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      apiFetch('/fan-submissions').catch(() => ({ submissions: [] })),
      contentApi.getContent({ contentType: 'article', limit: 100 }).catch(() => ({ content: [] })),
      categoryApi.getCategories().catch(() => ({ categories: [] }))
    ])
      .then(([subRes, contentRes, catRes]) => {
        if (!isMounted) return;

        const rawSubs = subRes?.submissions || subRes?.data || (Array.isArray(subRes) ? subRes : []);
        const rawContent = contentRes?.content || contentRes?.data || (Array.isArray(contentRes) ? contentRes : []);
        const rawCats = catRes?.categories || catRes?.data || (Array.isArray(catRes) ? catRes : []);

        // 1. Format Fan Submissions from Database
        const formattedSubs = rawSubs.map((sub) => {
          const catName = typeof sub.category === 'object' ? sub.category?.name : sub.category;
          const catSlug = typeof sub.category === 'object' ? sub.category?.slug : (sub.category || '').toLowerCase();
          const authorName = sub.user?.name || sub.creator || 'Community Creator';
          const authorAvatar = sub.user?.avatar || sub.creatorAvatar || '';
          const wordCount = (sub.content || '').trim().split(/\s+/).length;
          const calculatedReadTime = `${Math.max(2, Math.ceil(wordCount / 180))} min read`;

          return {
            ...sub,
            _id: sub._id || sub.id,
            id: sub._id || sub.id,
            title: sub.title || 'Untitled Community Work',
            description: sub.description || (sub.content ? sub.content.slice(0, 140) + '...' : ''),
            content: sub.content || '',
            fullArticle: sub.content || '',
            category: catName || 'Fandom Lore',
            categorySlug: catSlug || 'fandom-lore',
            image: sub.image || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=85',
            creator: authorName,
            creatorAvatar: authorAvatar,
            likesCount: sub.likesCount || 142,
            viewsCount: sub.viewsCount || 310,
            submissionDate: sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'Recent',
            readTime: calculatedReadTime,
            status: sub.status || 'approved',
            tags: sub.tags || [catName || 'Community Lore', 'Fan Creation']
          };
        });

        // 2. Format Content Articles from Database
        const formattedContentArticles = rawContent.map((item) => {
          const catName = typeof item.category === 'object' ? item.category?.name : item.category;
          const catSlug = typeof item.category === 'object' ? item.category?.slug : (item.category || '').toLowerCase();
          const wordCount = (item.content || item.description || '').trim().split(/\s+/).length;
          const calculatedReadTime = `${Math.max(2, Math.ceil(wordCount / 180))} min read`;

          return {
            ...item,
            _id: item._id || item.id,
            id: item._id || item.id,
            title: item.title,
            description: item.description || (item.content ? item.content.slice(0, 140) + '...' : ''),
            content: item.content || item.description || '',
            fullArticle: item.fullArticle || item.content || item.description || '',
            category: catName || 'Article',
            categorySlug: catSlug || 'article',
            image: item.backdrop || item.thumbnail || item.poster || item.mediaUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=85',
            creator: item.creator || item.author || 'Editorial Lore Team',
            creatorAvatar: item.creatorAvatar || item.authorAvatar || '',
            likesCount: item.likesCount || item.viewCount || 180,
            viewsCount: item.viewCount || 450,
            submissionDate: item.releaseDate ? new Date(item.releaseDate).toLocaleDateString() : (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'),
            readTime: calculatedReadTime,
            status: 'approved',
            tags: item.genre || item.tags || [catName || 'Lore', 'Article']
          };
        });

        // Combine all database articles and submissions
        const combined = [...formattedSubs, ...formattedContentArticles];

        if (combined.length > 0) {
          setDbSubmissions(combined);
        } else {
          setDbSubmissions(fallbackSubmissions);
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

  const activeSubmissionsList = dbSubmissions.length > 0 ? dbSubmissions : fallbackSubmissions;
  const activeCategories = dbCategories.length > 0 ? dbCategories : fallbackCategories;

  // Filter Categories & Search
  const filterPills = useMemo(() => {
    const defaultPills = ['All', 'Anime', 'Cosplay', 'Comics', 'Gaming', 'Audio'];
    const dynamicNames = activeCategories.map((c) => c.name).filter(Boolean);
    const set = new Set([...defaultPills, ...dynamicNames]);
    return Array.from(set).slice(0, 8);
  }, [activeCategories]);

  const approvedSubmissions = useMemo(() => {
    return activeSubmissionsList
      .filter((s) => s.status !== 'rejected')
      .filter((s) => {
        const q = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !q ||
          (s.title && s.title.toLowerCase().includes(q)) ||
          (s.creator && s.creator.toLowerCase().includes(q)) ||
          (s.description && s.description.toLowerCase().includes(q)) ||
          (s.content && s.content.toLowerCase().includes(q));

        const catName = (typeof s.category === 'object' ? s.category?.name : s.category) || '';
        const catSlug = (typeof s.category === 'object' ? s.category?.slug : s.categorySlug) || '';

        const matchesCat =
          selectedCategory === 'all' ||
          catSlug.toLowerCase() === selectedCategory.toLowerCase() ||
          catName.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCat;
      });
  }, [activeSubmissionsList, searchTerm, selectedCategory]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* 1. Hero Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-red-500/30 bg-gradient-to-r from-[#17050a] via-[#0d070b] to-[#080509] p-6 sm:p-10 md:p-12 shadow-[0_0_50px_rgba(255,23,56,0.15)]">
        {/* Glow Effects */}
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/4 w-60 h-60 bg-red-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-widest shadow-sm">
              <FileText className="w-3.5 h-3.5 text-red-500" />
              <span>LIVE DATABASE COMMUNITY ARTICLES & WORKS</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-display">
              Fan Articles & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff1738] via-rose-400 to-[#ff5277]">Creations</span>
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
              Explore authentic illustrations, cosplay photoshoots, orchestral covers, and lore analysis submitted by passionate fans and creators directly from the database.
            </p>
          </div>

          {/* Submit Action Button */}
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff1738] via-rose-600 to-[#ff1738] hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(255,23,56,0.5)] hover:shadow-[0_0_35px_rgba(255,23,56,0.7)] transition-all hover:scale-105 active:scale-95 shrink-0 self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Submit Your Creation</span>
          </Link>
        </div>
      </div>

      {/* 2. Search & Category Filters Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 p-3.5 sm:p-4 bg-gradient-to-b from-[#110609] to-[#090306] border border-red-500/20 rounded-2xl shadow-lg">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search creations by title, character, or creator..."
              className="w-full pl-10 pr-4 py-2 bg-black/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff1738] transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-black/60 border border-white/10 rounded-xl text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-[#ff1738] transition-colors cursor-pointer"
          >
            <option value="all">All Categories</option>
            {activeCategories.map((c) => (
              <option key={c._id || c.id || c.slug} value={c.slug || c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Filter Pill Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterPills.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => setSelectedCategory(pill === 'All' ? 'all' : pill.toLowerCase())}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer ${
                (selectedCategory === 'all' && pill === 'All') ||
                selectedCategory.toLowerCase() === pill.toLowerCase()
                  ? 'bg-[#ff1738] text-white shadow-md shadow-[#ff1738]/40 scale-100'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Articles Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="overflow-hidden rounded-[26px] bg-[#09090b] border border-white/[0.07] p-5 space-y-4 animate-pulse"
            >
              <div className="aspect-[16/10] w-full rounded-2xl bg-white/[0.05]" />
              <div className="h-4 w-3/4 rounded-full bg-white/[0.08]" />
              <div className="h-3 w-1/2 rounded-full bg-white/[0.04]" />
              <div className="h-12 w-full rounded-xl bg-white/[0.03]" />
            </div>
          ))}
        </div>
      ) : approvedSubmissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {approvedSubmissions.map((sub) => (
            <FanSubmissionCard
              key={sub._id || sub.id}
              submission={sub}
              onReadArticle={(item) => setActiveArticleModal(item)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Community Works Found"
          description="There are currently no database submissions matching your active query."
          actionText="Submit Something New"
          actionLink="/submit"
        />
      )}

      {/* 4. Full Article Reader Modal */}
      {activeArticleModal && (
        <Modal
          isOpen={true}
          onClose={() => setActiveArticleModal(null)}
          title={activeArticleModal.title}
          size="lg"
        >
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
            {/* Featured Image */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-xl">
              <img
                src={activeArticleModal.image}
                alt={activeArticleModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-md">
                  {typeof activeArticleModal.category === 'object' ? activeArticleModal.category?.name : activeArticleModal.category}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/60 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  VERIFIED WORK
                </span>
              </div>
            </div>

            {/* Author Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#110609] border border-white/10">
              <div className="flex items-center gap-3">
                {activeArticleModal.creatorAvatar ? (
                  <img
                    src={activeArticleModal.creatorAvatar}
                    alt={activeArticleModal.creator}
                    className="w-10 h-10 rounded-full object-cover border border-red-500/40"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center font-black">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-black text-white">{activeArticleModal.creator}</h4>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Published on {activeArticleModal.submissionDate || 'Recent'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{shareCopied ? 'Copied Link!' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div className="space-y-4 text-xs sm:text-sm text-zinc-200 leading-relaxed">
              {activeArticleModal.description && (
                <p className="font-semibold text-zinc-100 text-sm sm:text-base border-l-2 border-red-500 pl-3">
                  {activeArticleModal.description}
                </p>
              )}

              {activeArticleModal.content && (
                <div className="p-4 rounded-2xl bg-[#14080b] border border-red-950/60 font-serif italic text-zinc-300">
                  "{activeArticleModal.content}"
                </div>
              )}

              {activeArticleModal.fullArticle && activeArticleModal.fullArticle !== activeArticleModal.content && (
                <div className="space-y-3 pt-2 whitespace-pre-line font-sans text-zinc-300 leading-relaxed">
                  {activeArticleModal.fullArticle}
                </div>
              )}
            </div>

            {/* Tags */}
            {activeArticleModal.tags && activeArticleModal.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                {activeArticleModal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-mono font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
