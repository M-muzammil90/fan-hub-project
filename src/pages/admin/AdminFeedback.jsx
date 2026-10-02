import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, CheckCircle, Clock, Search, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { adminApi } from '../../services/admin.api';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.type = typeFilter;

      const res = await adminApi.getAdminFeedback(params);
      setFeedbackList(res.feedback || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch member feedback');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminApi.updateAdminFeedback(id, { status: newStatus });
      setFeedbackList((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      alert(err.message || 'Failed to update feedback status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await adminApi.deleteAdminFeedback(deleteId);
      setFeedbackList((prev) => prev.filter((item) => item._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert(err.message || 'Failed to delete feedback');
    } finally {
      setDeleting(false);
    }
  };

  const filteredFeedback = feedbackList.filter((fb) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const msg = fb.message?.toLowerCase() || '';
    const userName = fb.user?.name?.toLowerCase() || '';
    const userEmail = fb.user?.email?.toLowerCase() || '';
    const type = fb.type?.toLowerCase() || '';
    return msg.includes(term) || userName.includes(term) || userEmail.includes(term) || type.includes(term);
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Member <span className="text-red-500">Feedback</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Triage bug reports, feature suggestions, and general inquiries from community fans.
          </p>
        </div>
        <button
          onClick={fetchFeedback}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-zinc-950/80 border border-zinc-850 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tickets by user, email, message or type..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
        >
          <option value="all">All Types</option>
          <option value="bug">Bug</option>
          <option value="suggestion">Suggestion</option>
          <option value="query">Query</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/50 rounded-2xl flex items-center gap-3 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-zinc-500 text-xs flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-rose-500" />
          Loading feedback tickets...
        </div>
      ) : filteredFeedback.length === 0 ? (
        <div className="p-12 text-center bg-zinc-950 border border-zinc-850 rounded-2xl text-zinc-500 text-xs">
          No feedback tickets found matching your filters.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-850 bg-zinc-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/60 border-b border-zinc-850 text-zinc-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Feedback Message</th>
                <th className="py-3.5 px-4">Sender</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {filteredFeedback.map((fb) => (
                <tr key={fb._id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3.5 px-4 max-w-sm">
                    <span className="text-[12px] text-zinc-200 line-clamp-3">{fb.message}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white block">{fb.user?.name || 'Anonymous User'}</span>
                    <span className="text-[11px] font-mono text-zinc-500">{fb.user?.email || 'N/A'}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                        fb.type === 'bug'
                          ? 'bg-red-950/60 text-red-400 border border-red-800/40'
                          : fb.type === 'suggestion'
                          ? 'bg-zinc-900 text-zinc-200 border border-zinc-700'
                          : 'bg-zinc-900 text-rose-400 border border-zinc-800'
                      }`}
                    >
                      {fb.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500">
                    {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        fb.status === 'resolved'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : fb.status === 'reviewed'
                          ? 'bg-blue-950/60 text-red-400 border border-blue-800/40'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                      }`}
                    >
                      {fb.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <select
                        value={fb.status}
                        onChange={(e) => handleStatusChange(fb._id, e.target.value)}
                        className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => setDeleteId(fb._id)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-900 rounded-lg transition-colors"
                        title="Delete ticket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Feedback Ticket"
        message="Are you sure you want to delete this feedback ticket? This action cannot be undone."
        confirmText="Delete Ticket"
        loading={deleting}
      />
    </div>
  );
}

