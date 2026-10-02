import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Sparkles, Star, User, ArrowRight, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ratingsApi } from '../services/ratings.api';

const statusChip = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30'
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    let live = true;
    ratingsApi
      .getMine()
      .then((res) => {
        if (live) setReviews(res.ratings || []);
      })
      .catch(() => {
        if (live) setReviews([]);
      })
      .finally(() => {
        if (live) setLoadingReviews(false);
      });
    return () => {
      live = false;
    };
  }, []);

  const communityScore = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const approvedCount = reviews.filter((r) => r.status === 'approved' || !r.status).length;
  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      <div className="p-5 sm:p-8 rounded-3xl bg-[#0c0508] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-600/20 border border-red-500/30 overflow-hidden">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-red-400 font-black">
                {(currentUser?.name || 'U').slice(0, 1)}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-white font-display">{currentUser?.name}</h1>
            <p className="text-xs text-zinc-400 mt-1">{currentUser?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link to="/profile" className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-4 py-2.5 text-xs font-bold text-zinc-300 bg-white/5 rounded-xl border border-white/10">
            <User className="w-4 h-4" /> Profile
          </Link>
          <Link to="/submit" className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl">
            <Plus className="w-4 h-4" /> Submit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0508] border border-white/10">
          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Community score</p>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">{communityScore || '—'}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Average of your reviews</p>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0508] border border-white/10">
          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Reviews</p>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">{reviews.length}</p>
          <p className="text-[11px] text-zinc-500 mt-1">{approvedCount} live · {pendingCount} pending</p>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0508] border border-white/10">
          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Approved</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">{approvedCount}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Visible on content pages</p>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0508] border border-white/10">
          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Awaiting admin</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-1">{pendingCount}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Not public yet</p>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-white font-display">Your reviews</h2>
          <Link to="/explore" className="text-xs font-bold text-red-400 inline-flex items-center gap-1">
            Rate more <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingReviews ? (
          <div className="flex items-center justify-center py-12 text-zinc-500">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0c0508] border border-white/10 text-center space-y-2">
            <Star className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-semibold text-zinc-300">No reviews yet</p>
            <p className="text-xs text-zinc-500">Open a title and submit a community score. Admins approve it before it goes public.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((item) => (
              <article key={item._id || item.id} className="p-4 rounded-2xl bg-[#0c0508] border border-white/10 flex flex-col sm:flex-row gap-4">
                {item.content?.thumbnail ? (
                  <img src={item.content.thumbnail} alt="" className="w-full sm:w-20 h-28 sm:h-20 rounded-xl object-cover" />
                ) : (
                  <div className="w-full sm:w-20 h-28 sm:h-20 rounded-xl bg-black" />
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/content/${item.content?.slug || item.content?._id}`} className="font-bold text-white text-sm hover:text-red-400 truncate">
                      {item.content?.title || 'Content'}
                    </Link>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${statusChip[item.status] || statusChip.pending}`}>
                      {item.status || 'pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? 'fill-current' : 'text-zinc-700'}`} />
                    ))}
                  </div>
                  {item.review ? <p className="text-xs text-zinc-400 line-clamp-2">{item.review}</p> : null}
                  {item.status === 'pending' ? (
                    <p className="text-[10px] text-amber-500 font-bold">Waiting for admin approval before it shows on the public page.</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Bookmark className="w-4 h-4" />
        <Link to="/bookmarks" className="hover:text-white">Open watchlist</Link>
        <span>·</span>
        <Sparkles className="w-4 h-4" />
        <Link to="/submit" className="hover:text-white">Submit fan work</Link>
      </div>
    </div>
  );
}
