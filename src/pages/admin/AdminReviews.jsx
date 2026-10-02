import React, { useCallback, useEffect, useState } from 'react';
import { Star, CheckCircle2, XCircle, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { adminApi } from '../../services/admin.api';

const statusStyles = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30'
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [busyId, setBusyId] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getAdminReviews(statusFilter === 'all' ? undefined : statusFilter);
      setReviews(res.ratings || res.reviews || []);
    } catch (err) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const moderate = async (id, status) => {
    setBusyId(id);
    try {
      await adminApi.moderateReview(id, status);
      setReviews((prev) => prev.filter((r) => (r._id || r.id) !== id));
    } catch (err) {
      alert(err.message || 'Failed to update review');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Community <span className="text-red-500">Reviews</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Approve reviews before they appear on public content pages.</p>
        </div>
        <div className="flex items-center gap-2">
          {['pending', 'approved', 'rejected', 'all'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase ${
                statusFilter === s ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
              }`}
            >
              {s}
            </button>
          ))}
          <button type="button" onClick={fetchReviews} className="p-2 rounded-lg bg-zinc-900 text-zinc-300">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="h-40 rounded-2xl bg-zinc-900 animate-pulse" />
      ) : reviews.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-500 text-sm">
          No reviews in this queue.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((item) => {
            const id = item._id || item.id;
            return (
              <article key={id} className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white truncate">{item.content?.title || 'Untitled'}</p>
                    <p className="text-xs text-zinc-500">
                      {item.user?.name || 'Member'} · {item.user?.email || ''}
                    </p>
                  </div>
                  <span className={`self-start px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${statusStyles[item.status] || statusStyles.pending}`}>
                    {item.status || 'pending'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'fill-current' : 'text-zinc-700'}`} />
                  ))}
                  <span className="text-xs font-mono text-zinc-400 ml-2">{item.rating}/5</span>
                </div>
                {item.review ? <p className="text-sm text-zinc-300 leading-relaxed">{item.review}</p> : null}
                {item.status !== 'approved' || statusFilter === 'all' ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      disabled={busyId === id}
                      onClick={() => moderate(id, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 text-[11px] font-bold inline-flex items-center gap-1 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      type="button"
                      disabled={busyId === id}
                      onClick={() => moderate(id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 text-[11px] font-bold inline-flex items-center gap-1 disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                    {item.status !== 'pending' && (
                      <button
                        type="button"
                        disabled={busyId === id}
                        onClick={() => moderate(id, 'pending')}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-[11px] font-bold inline-flex items-center gap-1 disabled:opacity-50"
                      >
                        <Clock className="w-3.5 h-3.5" /> Queue
                      </button>
                    )}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
