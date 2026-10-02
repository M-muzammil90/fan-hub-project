import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  Moon,
  Sun,
  Bell,
  ChevronDown,
  Menu,
  X,
  User,
  Shield,
  Bookmark,
  LogOut,
  Flame,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SearchBar from './SearchBar';
import ThemeToggle from "../components/ThemeToggle";
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Industry-level Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const openLoginModal = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const openRegisterModal = () => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const categories = [
    { name: 'Anime', path: '/category/anime' },
    { name: 'Gaming', path: '/category/gaming' },
    { name: 'Movies', path: '/category/movies' },
    { name: 'TV Shows', path: '/category/tv-shows' },
    { name: 'K-Pop', path: '/category/k-pop' },
    { name: 'Comics', path: '/category/comics' },
    { name: 'Manga', path: '/category/manga' },
    { name: 'Cosplay', path: '/category/cosplay' }
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 dark:bg-[#0a0204]/95 border-b border-zinc-200 dark:border-white/10 shadow-sm dark:shadow-2xl backdrop-blur-xl transition-colors duration-300">
      <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center justify-between h-full gap-2 sm:gap-3">
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-br from-[#ff2e63] to-[#d6004c] p-0.5 shadow-lg shadow-[#ff2e63]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white dark:bg-[#0a0204] rounded-[14px] flex items-center justify-center">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff2e63] fill-[#ff2e63]/20 animate-pulse" />
                </div>
              </div>
              <span className="text-base sm:text-lg font-black tracking-tight text-zinc-900 dark:text-white font-display flex items-baseline gap-1 sm:gap-1.5 drop-shadow-sm">
                <span>FAN HUB</span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-lg bg-red-100 dark:bg-[#ff2e63]/20 text-[#ff3366] border border-red-200 dark:border-[#ff2e63]/40 backdrop-blur-md shadow-sm">
                  PLUS
                </span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <SearchBar
              className="w-full"
              inputClassName="w-full pl-10 pr-9 py-2 text-xs md:text-sm bg-zinc-100 dark:bg-black/40 hover:bg-zinc-200 dark:hover:bg-black/55 border border-zinc-200 dark:border-white/20 focus:border-red-500 focus:bg-white dark:focus:bg-black/70 rounded-2xl text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all shadow-inner"
              placeholder="Search anime, movies, characters, events..."
            />
          </div>
        
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <ThemeToggle className="!p-1.5 sm:!p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-black/20 dark:hover:bg-black/40 border-zinc-200 dark:border-white/20" />

            {isAdmin && (
              <Link
                to="/admin"
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-white bg-zinc-100 dark:bg-black/30 border border-zinc-200 dark:border-white/25 hover:bg-zinc-200 dark:hover:bg-black/45 transition-colors backdrop-blur-md"
              >
                <Shield className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
                <span>Admin</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-red-400/60 dark:hover:ring-white/60 transition-all bg-zinc-100 dark:bg-black/20 border border-zinc-200 dark:border-white/20"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-white/60"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-600 dark:text-white/80" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1a0509] border border-red-500/40 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl">
                    <div className="px-4 py-2 border-b border-red-500/20">
                      <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                      <p className="text-[11px] text-white/60 truncate">{currentUser?.email}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-black/40 text-red-300 border border-red-500/30">
                          Role: {currentUser?.role || 'user'}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white/85 hover:text-white hover:bg-red-900/40"
                      >
                        <Flame className="w-4 h-4 text-red-400" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white/85 hover:text-white hover:bg-red-900/40"
                      >
                        <User className="w-4 h-4 text-white/70" />
                        Profile Settings
                      </Link>
                      <Link
                        to="/bookmarks"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white/85 hover:text-white hover:bg-red-900/40"
                      >
                        <Bookmark className="w-4 h-4 text-white/70" />
                        My Bookmarks
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-300 hover:text-white hover:bg-red-900/40"
                        >
                          <Shield className="w-4 h-4 text-red-400" />
                          Admin Console
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-red-500/20">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-300 hover:text-white hover:bg-red-900/40 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={openLoginModal}
                  className="px-2 xs:px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-red-200 bg-red-600/20 hover:bg-red-600 hover:text-white rounded-full border border-red-500/70 transition-all shadow-[0_0_10px_rgba(239,68,68,0.25)] hover:shadow-[0_0_15px_rgba(239,68,68,0.6)] whitespace-nowrap active:scale-95"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={openRegisterModal}
                  className="px-2 xs:px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-black text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 rounded-full transition-all shadow-[0_0_15px_rgba(239,68,68,0.45)] hover:shadow-[0_0_22px_rgba(239,68,68,0.7)] hover:scale-105 active:scale-95 border border-red-400/60 whitespace-nowrap"
                >
                  Register
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-white bg-white/5 hover:bg-red-600/20 border border-white/10 transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 p-5 border-t border-b border-red-500/20 space-y-6 animate-in fade-in slide-in-from-top-2 duration-150 bg-gradient-to-b from-[#0a0204] to-black shadow-2xl backdrop-blur-3xl z-40">
            <SearchBar
              className="w-full"
              inputClassName="w-full pl-10 pr-9 py-2.5 text-sm bg-transparent border border-red-500/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-red-500"
              placeholder="Search anime, games, characters..."
            />

            {/* Mobile Auth Buttons */}
            {!isAuthenticated && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={openLoginModal}
                  className="flex-1 py-3 text-sm font-bold text-center text-red-200 bg-red-950/60 border border-red-500/60 rounded-xl hover:bg-red-900/60 transition-colors"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={openRegisterModal}
                  className="flex-1 py-3 text-sm font-black text-center text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-xl shadow-md shadow-red-600/40 border border-red-400/50 hover:from-red-500 hover:to-rose-500 transition-colors"
                >
                  Register
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3 text-sm font-bold text-white hover:text-red-400 rounded-[14px] bg-transparent border border-white/10 hover:border-red-500/40 transition-colors">Home</Link>
              <Link to="/explore" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3 text-sm font-bold text-white hover:text-red-400 rounded-[14px] bg-transparent border border-white/10 hover:border-red-500/40 transition-colors">Explore</Link>
              <Link to="/series" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3 text-sm font-bold text-white hover:text-red-400 rounded-[14px] bg-transparent border border-white/10 hover:border-red-500/40 transition-colors">Series & Shows</Link>
              <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3 text-sm font-bold text-white hover:text-red-400 rounded-[14px] bg-transparent border border-white/10 hover:border-red-500/40 transition-colors">Categories</Link>
              <Link to="/characters" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3 text-sm font-bold text-white hover:text-red-400 rounded-[14px] bg-transparent border border-white/10 hover:border-red-500/40 transition-colors">Characters</Link>
              <Link to="/fan-creations" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3 text-sm font-bold text-white hover:text-red-400 rounded-[14px] bg-transparent border border-white/10 hover:border-red-500/40 transition-colors">Articles</Link>
              <Link to="/events" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3 text-sm font-bold text-white hover:text-red-400 rounded-[14px] bg-transparent border border-white/10 hover:border-red-500/40 transition-colors">Events</Link>
              <Link to="/media" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3 text-sm font-bold text-white hover:text-red-400 rounded-[14px] bg-transparent border border-white/10 hover:border-red-500/40 transition-colors">Media</Link>
              <Link to="/merchandise" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3 text-sm font-bold text-white hover:text-red-400 rounded-[14px] bg-transparent border border-white/10 hover:border-red-500/40 transition-colors">Merchandise</Link>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Industry-Level Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </header>
  );
}

