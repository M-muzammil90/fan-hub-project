import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Check, X, Edit3, Search, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { adminApi } from '../../services/admin.api';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminFanSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Note edit state
  const [editingSub, setEditingSub] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  // Confirm delete state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const filterArg = statusFilter !== 'all' ? statusFilter : undefined;
      const res = await adminApi.getAdminSubmissions(filterArg);
      setSubmissions(res.submissions || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch fan submissions');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminApi.updateAdminSubmission(id, { status: newStatus });
      setSubmissions((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: newStatus } : s))
      );
    } catch (err) {
      alert(err.message || 'Failed to update submission status');
    }
  };

  const handleOpenNoteModal = (sub) => {
    setEditingSub(sub);
    setAdminNote(sub.adminNote || '');
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!editingSub) return;
    try {
      const res = await adminApi.updateAdminSubmission(editingSub._id, { adminNote });
      setSubmissions((prev) =>
        prev.map((s) => (s._id === editingSub._id ? { ...s, adminNote: res.submission?.adminNote || adminNote } : s))
      );
      setEditingSub(null);
    } catch (err) {
      alert(err.message || 'Failed to save admin note');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await adminApi.deleteAdminSubmission(deleteId);
      setSubmissions((prev) => prev.filter((s) => s._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert(err.message || 'Failed to delete submission');
    } finally {
      setDeleting(false);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const title = s.title?.toLowerCase() || '';
    const creatorName = s.user?.name?.toLowerCase() || '';
    const creatorEmail = s.user?.email?.toLowerCase() || '';
    const catName = s.category?.name?.toLowerCase() || '';
    return title.includes(term) || creatorName.includes(term) || creatorEmail.includes(term) || catName.includes(term);
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Fan <span className="text-red-500">Submissions</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Review community artwork, cosplay photos, and essays before public approval.
          </p>
        </div>
        <button
          onClick={fetchSubmissions}
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
            placeholder="Search by title, creator, email, or category..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
        >
          <option value="all">All Moderation Statuses</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
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
          Loading fan submissions...
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="p-12 text-center bg-zinc-950 border border-zinc-850 rounded-2xl text-zinc-500 text-xs">
          No fan submissions found matching your filters.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-850 bg-zinc-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/60 border-b border-zinc-850 text-zinc-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Submission</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Creator</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Admin Note</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {filteredSubmissions.map((s) => (
                <tr key={s._id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-9 rounded-lg object-cover bg-zinc-900 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-9 rounded-lg bg-zinc-900 flex items-center justify-center text-[10px] text-zinc-600 shrink-0">
                        No Image
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-white block">{s.title}</span>
                      <span className="text-[11px] text-zinc-500 line-clamp-1">{s.description || s.content}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-rose-400">
                    {s.category?.name || 'Uncategorized'}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-white">{s.user?.name || 'Anonymous'}</div>
                    <div className="text-[10px] text-zinc-500">{s.user?.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        s.status === 'approved'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : s.status === 'rejected'
                          ? 'bg-red-950/60 text-red-400 border border-red-800/40'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs text-zinc-400 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate">{s.adminNote || 'No notes'}</span>
                      <button
                        type="button"
                        onClick={() => handleOpenNoteModal(s)}
                        className="text-zinc-500 hover:text-white shrink-0"
                        title="Edit note"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s._id, 'approved')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          s.status === 'approved'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-zinc-900 text-zinc-300 hover:bg-emerald-950 hover:text-emerald-300 border border-zinc-800'
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s._id, 'rejected')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          s.status === 'rejected'
                            ? 'bg-red-600 text-white'
                            : 'bg-zinc-900 text-zinc-300 hover:bg-red-950 hover:text-red-300 border border-zinc-800'
                        }`}
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(s._id)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-900 rounded-lg transition-colors"
                        title="Delete submission"
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

      <Modal
        isOpen={!!editingSub}
        onClose={() => setEditingSub(null)}
        title="Moderation Review Note"
      >
        <form onSubmit={handleSaveNote} className="space-y-4">
          <p className="text-xs text-zinc-400">
            Set administrative feedback or review reason for <strong>{editingSub?.title}</strong>:
          </p>
          <textarea
            rows={3}
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
            placeholder="Reason for approval/rejection..."
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingSub(null)}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl"
            >
              Save Note
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Submission"
        message="Are you sure you want to delete this fan submission? This action cannot be undone and will delete associated media files."
        confirmText="Delete Submission"
        loading={deleting}
      />
    </div>
  );
}

