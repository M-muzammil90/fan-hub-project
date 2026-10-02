import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Layers,
  Film,
  UserCheck,
  ShoppingBag,
  Calendar,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Folder,
  BarChart3
} from 'lucide-react';
import { adminApi } from '../../services/admin.api';
import { useAuth } from '../../context/AuthContext';
import { useAdminChrome } from '../../context/AdminChromeContext';
import AdminPageHeader from '../../components/AdminPageHeader';
import { AdminBarChart, AdminDonutChart } from '../../components/AdminCharts';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const { refreshBadges } = useAdminChrome();
  const [analytics, setAnalytics] = useState(null);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [analyticsRes, submissionsRes] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getAdminSubmissions('pending')
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
      if (submissionsRes.success) setPendingSubmissions(submissionsRes.submissions || []);
      refreshBadges();
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleModeration = async (submissionId, status) => {
    setActionLoadingId(submissionId);
    try {
      await adminApi.updateAdminSubmission(submissionId, {
        status,
        adminNote: `Quick ${status} from admin dashboard`
      });
      setPendingSubmissions((prev) => prev.filter((s) => (s._id || s.id) !== submissionId));
      fetchDashboardData();
    } catch (err) {
      alert(err.message || `Failed to ${status} submission`);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-16 bg-zinc-900 rounded-2xl w-2/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-zinc-900 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl bg-red-950/40 border border-red-600/40 text-center space-y-4 max-w-xl mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-black text-white">Dashboard connection error</h2>
        <p className="text-sm text-zinc-300">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const u = analytics?.users || {};
  const c = analytics?.content || {};
  const act = analytics?.activity || {};
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const stats = [
    { title: 'Registered users', count: u.totalUsers || 0, icon: Users, link: '/admin/users', sub: `${u.activeUsers || 0} members` },
    { title: 'Categories', count: act.totalCategories || 0, icon: Layers, link: '/admin/categories', sub: 'Catalog verticals' },
    { title: 'Media content', count: c.totalContent || 0, icon: Film, link: '/admin/content', sub: `${c.featuredContent || 0} featured` },
    { title: 'Characters', count: act.totalCharacters || 0, icon: UserCheck, link: '/admin/characters', sub: 'Lore entries' },
    { title: 'Merchandise', count: act.totalMerchandise || 0, icon: ShoppingBag, link: '/admin/merchandise', sub: 'Showcase items' },
    { title: 'Events', count: act.totalEvents || 0, icon: Calendar, link: '/admin/events', sub: 'Scheduled' },
    { title: 'Pending submissions', count: act.pendingSubmissions || 0, icon: Sparkles, link: '/admin/fan-submissions', sub: 'Needs review', alert: (act.pendingSubmissions || 0) > 0 },
    { title: 'Feedback', count: act.totalFeedback || 0, icon: MessageSquare, link: '/admin/feedback', sub: 'Support tickets' }
  ];

  const categoryBars = (analytics?.popularCategories || []).map((cat) => ({
    label: cat.name,
    value: cat.totalContent
  }));

  const inventoryDonut = [
    { label: 'Content', value: c.totalContent || 0 },
    { label: 'Characters', value: act.totalCharacters || 0 },
    { label: 'Merch', value: act.totalMerchandise || 0 },
    { label: 'Events', value: act.totalEvents || 0 }
  ].filter((s) => s.value > 0);

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      <AdminPageHeader
        eyebrow={`${greeting}, ${currentUser?.name || 'Admin'}`}
        title="Admin"
        accent="Dashboard"
        subtitle="Red-and-black control room for users, catalog, moderation, and live platform stats."
        actions={
          <>
            <Link
              to="/admin/analytics"
              className="px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white bg-red-600 hover:bg-red-500 rounded-xl inline-flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Open analytics
            </Link>
            <Link
              to="/admin/content"
              className="px-4 py-2.5 text-xs font-black uppercase tracking-wide text-zinc-200 bg-zinc-950 border border-zinc-800 hover:border-red-500/50 rounded-xl"
            >
              Manage catalog
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className={`p-5 rounded-2xl bg-zinc-950 border transition-all space-y-3 ${
              stat.alert ? 'border-red-500/60 shadow-[0_0_24px_rgba(220,38,38,0.15)]' : 'border-zinc-800 hover:border-red-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400">{stat.title}</span>
              <span className={`p-2 rounded-lg ${stat.alert ? 'bg-red-600 text-white' : 'bg-black text-red-400 border border-zinc-800'}`}>
                <stat.icon className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-white font-mono">{stat.count}</span>
              <span className={`text-[11px] font-bold ${stat.alert ? 'text-red-400' : 'text-zinc-500'}`}>{stat.sub}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-black text-white">Top categories</h2>
            <Link to="/admin/analytics" className="text-[11px] font-bold text-red-400 hover:text-red-300">
              Full charts
            </Link>
          </div>
          <AdminBarChart items={categoryBars} />
        </div>
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
          <h2 className="text-base font-black text-white mb-5">Catalog mix</h2>
          <AdminDonutChart segments={inventoryDonut} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white">
            Moderation queue <span className="text-red-500">({pendingSubmissions.length})</span>
          </h2>
          <Link to="/admin/fan-submissions" className="text-xs font-bold text-red-400 hover:text-red-300 inline-flex items-center gap-1">
            Full table <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingSubmissions.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-black border-b border-zinc-800 text-zinc-500 uppercase tracking-wider font-black">
                <tr>
                  <th className="py-3.5 px-5">Submission</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Creator</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {pendingSubmissions.slice(0, 5).map((sub) => {
                  const subId = sub._id || sub.id;
                  const isBusy = actionLoadingId === subId;
                  return (
                    <tr key={subId} className="hover:bg-red-950/20">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          {sub.image ? (
                            <img src={sub.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-zinc-800" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-black border border-zinc-800 flex items-center justify-center text-zinc-500">
                              <Folder className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white">{sub.title}</p>
                            <p className="text-[10px] text-zinc-500 line-clamp-1">{sub.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-red-400">{sub.category?.name || 'General'}</td>
                      <td className="py-3.5 px-4">{sub.user?.name || sub.user?.email || 'Anonymous'}</td>
                      <td className="py-3.5 px-4 font-mono text-zinc-500 text-[11px]">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleModeration(subId, 'approved')}
                            disabled={isBusy}
                            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-[11px] inline-flex items-center gap-1 disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleModeration(subId, 'rejected')}
                            disabled={isBusy}
                            className="px-3 py-1.5 rounded-lg bg-red-600/15 hover:bg-red-600/25 text-red-400 font-bold text-[11px] inline-flex items-center gap-1 disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-500 text-sm">
            No submissions waiting in the moderation queue.
          </div>
        )}
      </div>
    </div>
  );
}
