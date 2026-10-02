import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, RefreshCw, BarChart3 } from 'lucide-react';
import { adminApi } from '../../services/admin.api';
import AdminPageHeader from '../../components/AdminPageHeader';
import { AdminBarChart, AdminColumnChart, AdminDonutChart } from '../../components/AdminCharts';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAnalytics();
      if (res.success) setAnalytics(res.analytics);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-16 bg-zinc-900 rounded-2xl w-1/2" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-zinc-900 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl bg-red-950/40 border border-red-600/40 text-center space-y-4 max-w-xl mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-black text-white">Analytics unavailable</h2>
        <p className="text-sm text-zinc-300">{error}</p>
        <button
          onClick={load}
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

  const inventory = [
    { label: 'Users', value: u.totalUsers || 0 },
    { label: 'Content', value: c.totalContent || 0 },
    { label: 'Characters', value: act.totalCharacters || 0 },
    { label: 'Merch', value: act.totalMerchandise || 0 },
    { label: 'Events', value: act.totalEvents || 0 }
  ];

  const usersDonut = [
    { label: 'Members', value: u.activeUsers || 0 },
    { label: 'Admins', value: u.adminUsers || 0 }
  ].filter((s) => s.value > 0);

  const typeBars = (c.byType || []).map((row) => ({
    label: row._id || 'unknown',
    value: row.count || 0
  }));

  const categoryViews = (analytics?.popularCategories || []).map((cat) => ({
    label: cat.name,
    value: cat.totalViews || 0
  }));

  const categoryItems = (analytics?.popularCategories || []).map((cat) => ({
    label: cat.name,
    value: cat.totalContent || 0
  }));

  const engagement = [
    { label: 'Bookmarks', value: act.totalBookmarks || 0 },
    { label: 'Ratings', value: act.totalRatings || 0 },
    { label: 'Submissions', value: act.totalSubmissions || 0 },
    { label: 'Feedback', value: act.totalFeedback || 0 }
  ];

  const kpis = [
    { label: 'Total users', value: u.totalUsers || 0 },
    { label: 'Featured titles', value: c.featuredContent || 0 },
    { label: 'Pending review', value: act.pendingSubmissions || 0 },
    { label: 'Categories', value: act.totalCategories || 0 }
  ];

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      <AdminPageHeader
        eyebrow="Reports"
        title="Platform"
        accent="Analytics"
        subtitle="Live charts from MongoDB: catalog mix, audience split, category performance, and engagement."
        actions={
          <Link
            to="/admin"
            className="px-4 py-2.5 text-xs font-black uppercase tracking-wide text-zinc-200 bg-zinc-950 border border-zinc-800 hover:border-red-500/50 rounded-xl inline-flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4 text-red-500" />
            Back to dashboard
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{kpi.label}</p>
            <p className="mt-2 text-3xl font-black text-white font-mono">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
          <h2 className="text-base font-black text-white mb-1">Inventory overview</h2>
          <p className="text-xs text-zinc-500 mb-4">Counts across core collections</p>
          <AdminColumnChart items={inventory} />
        </section>

        <section className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
          <h2 className="text-base font-black text-white mb-1">User split</h2>
          <p className="text-xs text-zinc-500 mb-4">Members vs administrators</p>
          <AdminDonutChart segments={usersDonut} />
        </section>

        <section className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
          <h2 className="text-base font-black text-white mb-1">Content by type</h2>
          <p className="text-xs text-zinc-500 mb-4">Article, video, audio, image, trailer</p>
          <AdminBarChart items={typeBars} />
        </section>

        <section className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
          <h2 className="text-base font-black text-white mb-1">Category item volume</h2>
          <p className="text-xs text-zinc-500 mb-4">How much catalog sits in each vertical</p>
          <AdminBarChart items={categoryItems} />
        </section>

        <section className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
          <h2 className="text-base font-black text-white mb-1">Category views</h2>
          <p className="text-xs text-zinc-500 mb-4">Aggregated viewCount by category</p>
          <AdminColumnChart items={categoryViews} />
        </section>

        <section className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
          <h2 className="text-base font-black text-white mb-1">Engagement</h2>
          <p className="text-xs text-zinc-500 mb-4">Bookmarks, ratings, submissions, feedback</p>
          <AdminBarChart items={engagement} />
        </section>
      </div>
    </div>
  );
}
