import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Layers,
  Film,
  Tv,
  UserCheck,
  ShoppingBag,
  Calendar,
  Sparkles,
  MessageSquare,
  ArrowLeft,
  X,
  Image as ImageIcon,
  Star
} from 'lucide-react';
import { useAdminChrome } from '../context/AdminChromeContext';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { name: 'Manage Users', path: '/admin/users', icon: Users },
  { name: 'Categories', path: '/admin/categories', icon: Layers },
  { name: 'Content Catalog', path: '/admin/content', icon: Film },
  { name: 'Series & Episodes', path: '/admin/series', icon: Tv },
  { name: 'Characters', path: '/admin/characters', icon: UserCheck },
  { name: 'Merchandise', path: '/admin/merchandise', icon: ShoppingBag },
  { name: 'Events', path: '/admin/events', icon: Calendar },
  { name: 'Community Reviews', path: '/admin/reviews', icon: Star, badgeKey: 'pendingReviews' },
  { name: 'Fan Submissions', path: '/admin/fan-submissions', icon: Sparkles, badgeKey: 'pendingSubmissions' },
  { name: 'Feedback', path: '/admin/feedback', icon: MessageSquare, badgeKey: 'pendingFeedback' },
  { name: 'Media Library', path: '/admin/media', icon: ImageIcon }
];

function NavList({ onNavigate, pendingSubmissions, pendingFeedback, pendingReviews = 0 }) {
  return (
    <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
      {navItems.map((item) => {
        const badge =
          item.badgeKey === 'pendingSubmissions'
            ? pendingSubmissions
            : item.badgeKey === 'pendingFeedback'
              ? pendingFeedback
              : item.badgeKey === 'pendingReviews'
                ? pendingReviews
                : 0;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                isActive
                  ? 'bg-red-600 text-white shadow-[0_8px_20px_rgba(220,38,38,0.35)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </div>
            {badge > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full text-[10px] font-black bg-white text-red-600 flex items-center justify-center">
                {badge}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default function AdminSidebar({ isMobileOpen, onMobileClose }) {
  const { pendingSubmissions, pendingFeedback, pendingReviews = 0 } = useAdminChrome();

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 border-r border-red-600/20 bg-zinc-950 min-h-[calc(100vh-64px)] p-4 shrink-0">
        <div className="mb-6 px-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Control</p>
          <h2 className="text-sm font-black text-white mt-1">Command Center</h2>
        </div>
        <NavList pendingSubmissions={pendingSubmissions} pendingFeedback={pendingFeedback} pendingReviews={pendingReviews} />
        <div className="pt-4 border-t border-zinc-900 mt-auto">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to site
          </Link>
        </div>
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/80" onClick={onMobileClose} />
          <div className="relative z-10 w-72 max-w-full bg-black h-full p-5 flex flex-col border-r border-red-600/30">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-4">
              <div>
                <h3 className="text-sm font-black text-white">Admin Menu</h3>
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Fan Hub Plus</p>
              </div>
              <button type="button" onClick={onMobileClose} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <NavList
              onNavigate={onMobileClose}
              pendingSubmissions={pendingSubmissions}
              pendingFeedback={pendingFeedback}
              pendingReviews={pendingReviews}
            />
            <div className="pt-4 border-t border-zinc-900 mt-auto">
              <Link
                to="/"
                onClick={onMobileClose}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to site
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
