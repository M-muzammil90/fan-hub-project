import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Star,
  Eye,
  Bookmark,
  Share2,
  Download,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Check,
  Send,
  MessageSquare,
  ShieldCheck,
  User
} from 'lucide-react';
import { contentApi } from '../services/content.api';
import { seriesApi } from '../services/series.api';
import { ratingsApi } from '../services/ratings.api';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import CustomVideoPlayer from '../components/video/CustomVideoPlayer';

export default function ContentDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { bookmarks, toggleBookmark } = useData();

  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isPlaying, setIsPlaying] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Review & Community Score states
  const [userScore, setUserScore] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [reviewErrorMsg, setReviewErrorMsg] = useState('');
  const [approvedReviews, setApprovedReviews] = useState([]);

  const fetchContentDetails = async () => {
    setIsLoading(true);
    setError('');
    try {
      let res;
      if (slug && slug.length === 24) {
        try {
          res = await contentApi.getContentById(slug);
        } catch (e) {
          // fallback
        }
      }

      if (!res?.success) {
        const allRes = await contentApi.getContent();
        if (allRes.success) {
          const match = allRes.content.find((c) => c._id === slug || c.slug === slug);
          if (match) {
            res = { success: true, content: match };
          }
        }
      }

      if (res?.success && res.content) {
        const item = res.content;
        setContent(item);

        // Fetch Approved Reviews for this content
        try {
          const ratingRes = await ratingsApi.getApprovedForContent(item._id || item.id);
          if (ratingRes.success) {
            setApprovedReviews(ratingRes.ratings || []);
          }
        } catch (rErr) {
          console.error('Failed to load approved reviews:', rErr);
        }
      } else {
        // Fallback: Check if this ID/slug belongs to a Series
        try {
          const seriesRes = await seriesApi.getSeriesByIdOrSlug(slug);
          const seriesData = seriesRes?.data || seriesRes;
          if (seriesData && (seriesData._id || seriesData.slug)) {
            navigate(`/series/${seriesData.slug || seriesData._id}`, { replace: true });
            return;
          }
        } catch (sErr) {
          // not a series
        }

        setError('Media content not found.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContentDetails();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setReviewErrorMsg('Please log in to leave a community score and review.');
      return;
    }
    setReviewErrorMsg('');
    setReviewSuccessMsg('');
    setIsSubmittingReview(true);

    try {
      const res = await ratingsApi.submit({
        content: content._id || content.id,
        rating: userScore,
        review: reviewText.trim()
      });

      if (res.success) {
        setReviewSuccessMsg(res.message || 'Review submitted! It will be displayed publicly after Admin approval.');
        setReviewText('');
      } else {
        setReviewErrorMsg(res.message || 'Failed to submit review.');
      }
    } catch (err) {
      console.error('Review submit error:', err);
      setReviewErrorMsg(err.message || 'Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Loading media details...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-red-950/40 border border-red-500/40 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-black text-white">Content Not Found</h2>
        <p className="text-xs text-zinc-300">{error}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

  const isBookmarkedItem = bookmarks.some((b) => b.contentSlug === content.slug || b.contentSlug === content._id);

  return (
    <div className="space-y-8 sm:space-y-10 pb-12 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
        <Link to="/" className="hover:text-red-400 transition-colors">Home</Link>
        <span>&gt;</span>
        <Link to="/explore" className="hover:text-red-400 transition-colors">Media</Link>
        <span>&gt;</span>
        <span className="text-white truncate font-bold">{content.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Player / Thumbnail & Approved Reviews */}
        <div className="lg:col-span-8 space-y-6">
          <div className="w-full">
            {content.contentType === 'article' ? (
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                <img
                  src={content.backdrop || content.thumbnail || content.mediaUrl}
                  alt={content.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-600 text-white shadow-lg">
                    {typeof content.category === 'object' ? content.category?.name : (content.category || 'Article & Lore')}
                  </span>
                </div>
              </div>
            ) : isPlaying ? (
              <CustomVideoPlayer
                src={content.mediaUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'}
                poster={content.thumbnail || content.backdrop}
                title={content.title}
                autoPlay={true}
              />
            ) : (
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl group">
                <img
                  src={content.thumbnail || content.backdrop || content.mediaUrl}
                  alt={content.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-all">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 hover:scale-110 transition-transform cursor-pointer"
                    aria-label="Play media"
                  >
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-bold text-white font-display">
              {content.contentType === 'article' ? 'Article Lore & Story' : 'Overview & Description'}
            </h3>
            {content.content && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950/20 to-black/40 border border-red-500/20 text-sm text-zinc-200 leading-relaxed font-serif whitespace-pre-line">
                {content.content}
              </div>
            )}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
              {content.description}
            </p>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#0c0508] border border-white/10 text-center text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Category</span>
                <span className="font-mono font-bold text-white">{typeof content.category === 'object' ? content.category?.name : content.category || 'Fandom'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Released</span>
                <span className="font-mono font-bold text-white">
                  {content.releaseDate ? new Date(content.releaseDate).toLocaleDateString() : '2026'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Format</span>
                <span className="font-mono font-bold text-white uppercase">{content.contentType || 'Media'}</span>
              </div>
            </div>

            {content.genre && content.genre.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {content.genre.map((g) => (
                  <span key={g} className="px-2.5 py-1 rounded-lg bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-mono font-bold">
                    #{g}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Approved Reviews & Community Scores Section */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-red-500" />
                <span>Approved Community Reviews ({approvedReviews.length})</span>
              </h3>
            </div>

            {approvedReviews.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#0c0508] border border-white/10 text-center text-xs text-zinc-400 space-y-1">
                <p className="font-bold text-white">No approved reviews yet for this item.</p>
                <p>Be the first to submit your score below! Once approved by an Admin, your review will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {approvedReviews.map((rev) => (
                  <div key={rev._id || rev.id} className="p-4 rounded-2xl bg-[#0c0508] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {rev.user?.avatar ? (
                          <img src={rev.user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-xs">
                            <User className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span className="text-xs font-bold text-white">{rev.user?.name || 'Fandom Member'}</span>
                        <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                          <ShieldCheck className="w-3 h-3" />
                          Approved
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-mono font-bold">{rev.rating}/5</span>
                      </div>
                    </div>
                    {rev.review && <p className="text-xs text-zinc-300 leading-relaxed">{rev.review}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Metadata, Actions & Review Submission Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-red-600 text-white">
                {content.contentType || 'Media'}
              </span>
            </div>

            <h1 className="text-2xl font-black text-white font-display">
              {content.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-1 font-medium">
                <Eye className="w-3.5 h-3.5 text-red-500" />
                <span>{content.viewCount || 0} views</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Stream Media</span>
            </button>

            <button
              type="button"
              onClick={() => toggleBookmark(content.slug || content._id)}
              className={`w-full py-3.5 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isBookmarkedItem
                  ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/40'
                  : 'border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white bg-[#0c0508]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarkedItem ? 'fill-current' : ''}`} />
              <span>{isBookmarkedItem ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>

            <div className="flex items-center justify-around pt-2 border-t border-white/10 text-xs text-zinc-400">
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{shareCopied ? 'Copied!' : 'Share'}</span>
              </button>

              {content.mediaUrl && (
                <a
                  href={content.mediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              )}
            </div>
          </div>

          {/* User Review / Community Score Form */}
          <form onSubmit={handleReviewSubmit} className="p-5 rounded-3xl bg-[#0c0508] border border-white/10 space-y-4 shadow-xl">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block font-display">Submit Community Score & Review</span>
              <p className="text-[11px] text-zinc-400">Admin will review and approve your submission before it appears publicly.</p>
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserScore(star)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= userScore ? 'text-amber-400 fill-current' : 'text-zinc-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono font-bold text-zinc-300 ml-2">
                {userScore}/5
              </span>
            </div>

            <textarea
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here (optional)..."
              className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
            />

            {reviewSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{reviewSuccessMsg}</span>
              </div>
            )}

            {reviewErrorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{reviewErrorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/30 disabled:opacity-50"
            >
              {isSubmittingReview ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit for Admin Approval</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
