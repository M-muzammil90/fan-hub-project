import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  ExternalLink,
  LogOut,
  User,
  ChevronDown,
  Shield,
  Flame,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminChrome } from '../context/AdminChromeContext';

const PAGE_TITLES = {
  '/admin': 'Dashboard',
  '/admin/analytics': 'Analytics',
  '/admin/users': 'Users',
  '/admin/categories': 'Categories',
  '/admin/content': 'Content Catalog',
  '/admin/characters': 'Characters',
  '/admin/merchandise': 'Merchandise',
  '/admin/events': 'Events',
  '/admin/fan-submissions': 'Fan Submissions',
  '/admin/feedback': 'Feedback',
  '/admin/media': 'Media Library'
};

const QUICK_LINKS = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Analytics', path: '/admin/analytics' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Categories', path: '/admin/categories' },
  { label: 'Content', path: '/admin/content' },
  { label: 'Characters', path: '/admin/characters' },
  { label: 'Merchandise', path: '/admin/merchandise' },
  { label: 'Events', path: '/admin/events' },
  { label: 'Fan Submissions', path: '/admin/fan-submissions' },
  { label: 'Feedback', path: '/admin/feedback' },
  { label: 'Media Library', path: '/admin/media' }
];

export default function AdminNavbar({ onMenuOpen }) {
  const { currentUser, logout } = useAuth();
  const { pendingSubmissions, pendingFeedback } = useAdminChrome();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const searchRef = useRef(null);
  const userRef = useRef(null);
  const alertsRef = useRef(null);

  const pageTitle = PAGE_TITLES[location.pathname] || 'Admin Console';
  const alertCount = (pendingSubmissions || 0) + (pendingFeedback || 0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return QUICK_LINKS;
    return QUICK_LINKS.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    const onClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
      if (alertsRef.current && !alertsRef.current.contains(e.target)) setAlertsOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goTo = (path) => {
    navigate(path);
    setQuery('');
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 h-16 shrink-0 bg-black border-b border-red-600/30">
      <div className="h-full px-3 sm:px-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          className="lg:hidden p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-red-600/15 border border-transparent hover:border-red-600/30"
          aria-label="Open admin menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/admin" className="flex items-center gap-2.5 shrink-0">
          <span className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center shadow-[0_0_18px_rgba(220,38,38,0.45)]">
            <Flame className="w-5 h-5 text-white" />
          </span>
          <span className="hidden sm:flex flex-col leading-none">
            <span className="text-[10px] font-black tracking-[0.22em] text-red-500 uppercase">Fan Hub</span>
            <span className="text-sm font-black text-white tracking-tight">Admin Console</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-red-600/25 bg-zinc-950">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[11px] font-bold text-zinc-300">{pageTitle}</span>
        </div>

        <div className="flex-1 max-w-xl mx-auto relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Jump to admin page..."
              className="w-full h-10 pl-10 pr-9 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchOpen && (
            <div className="absolute top-[calc(100%+8px)] left-0 right-0 rounded-2xl border border-red-600/20 bg-zinc-950 shadow-2xl overflow-hidden">
              {results.length === 0 ? (
                <p className="px-4 py-3 text-xs text-zinc-500">No matching admin page</p>
              ) : (
                results.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => goTo(item.path)}
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-red-600/15 hover:text-white flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] font-mono text-zinc-600">{item.path}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-zinc-800 text-[11px] font-bold uppercase tracking-wide text-zinc-300 hover:text-white hover:border-red-500/50 hover:bg-red-600/10"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Site
          </Link>

          <div className="relative" ref={alertsRef}>
            <button
              type="button"
              onClick={() => setAlertsOpen((v) => !v)}
              className="relative p-2 rounded-xl border border-zinc-800 text-zinc-300 hover:text-white hover:border-red-500/50 hover:bg-red-600/10"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5 w-4 h-4" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-600 text-[10px] font-black text-white flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </button>
            {alertsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-red-600/25 bg-zinc-950 shadow-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800">
                  <p className="text-xs font-black uppercase tracking-wider text-red-400">Queue alerts</p>
                </div>
                <Link
                  to="/admin/fan-submissions"
                  onClick={() => setAlertsOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-sm text-zinc-300 hover:bg-red-600/10"
                >
                  <span>Pending submissions</span>
                  <span className="font-mono text-red-400">{pendingSubmissions}</span>
                </Link>
                <Link
                  to="/admin/feedback"
                  onClick={() => setAlertsOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-sm text-zinc-300 hover:bg-red-600/10"
                >
                  <span>Pending feedback</span>
                  <span className="font-mono text-red-400">{pendingFeedback}</span>
                </Link>
              </div>
            )}
          </div>

          <div className="relative" ref={userRef}>
            <button
              type="button"
              onClick={() => setUserOpen((v) => !v)}
              className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-xl border border-zinc-800 hover:border-red-500/50 hover:bg-red-600/10"
            >
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="" className="w-7 h-7 rounded-lg object-cover" />
              ) : (
                <span className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center text-[11px] font-black">
                  {(currentUser?.name || 'A').charAt(0).toUpperCase()}
                </span>
              )}
              <span className="hidden md:block text-xs font-bold text-white max-w-[110px] truncate">
                {currentUser?.name || 'Admin'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>
            {userOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-red-600/25 bg-zinc-950 shadow-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800">
                  <p className="text-sm font-bold text-white truncate">{currentUser?.name}</p>
                  <p className="text-[11px] text-zinc-500 truncate">{currentUser?.email}</p>
                  <span className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 text-[10px] font-black uppercase">
                    <Shield className="w-3 h-3" />
                    Administrator
                  </span>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-red-600/10"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-600/15"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
