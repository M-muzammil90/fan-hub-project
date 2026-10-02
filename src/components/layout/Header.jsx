import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Settings,
  ChevronDown,
  User,
  Shield,
  Bookmark,
  LogOut,
  Flame,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import SearchBar from '../SearchBar';
import AuthModal from '../AuthModal';

export default function Header({ onMobileMenuToggle, isMobileMenuOpen }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[185px] h-16 z-30 bg-[#070709]/95 backdrop-blur-xl border-b border-white/10 transition-all select-none">
      <div className="w-full h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Mobile Logo when Sidebar is hidden on < lg */}
        <div className="flex lg:hidden items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="p-1.5 rounded-xl text-zinc-300 hover:text-white bg-white/5 border border-white/10"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <Link to="/" className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-[#ff1738] flex items-center justify-center text-white">
              <Flame className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="text-sm font-black text-white font-display">
              FanHub <span className="text-[#ff1738]">PLUS</span>
            </span>
          </Link>
        </div>

        {/* Search Bar: Centered/Left, matching reference */}
        <div className="flex-1 max-w-xl hidden sm:flex">
          <div className="relative w-full">
            <SearchBar
              className="w-full"
              inputClassName="w-full pl-9 pr-4 py-2 text-xs bg-[#0d0d12] hover:bg-[#121218] focus:bg-[#14141c] border border-white/10 focus:border-[#ff1738] rounded-full text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#ff1738]/50 transition-all shadow-inner"
              placeholder="Search anime, movies, characters, events..."
            />
          </div>
        </div>

        {/* Right Action Icons: Settings/Theme, Notifications, User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          {/* Theme/Settings Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification Bell with Badge */}
          <div className="relative">
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff1738] text-[9px] font-black text-white flex items-center justify-center shadow-sm shadow-[#ff1738]/50">
              5
            </span>
          </div>

          {/* Admin shortcut if logged in as Admin */}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}

          {/* User Avatar / Auth */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-[#ff1738]/60 transition-all border border-[#ff1738]/40"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={currentUser?.name || 'User'}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                />
                <ChevronDown className="w-3 h-3 text-zinc-400 mr-1" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#0d0d12] border border-white/15 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{currentUser?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5"
                    >
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/bookmarks"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Bookmarks</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-amber-300 hover:text-white hover:bg-white/5"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        <span>Admin Console</span>
                      </Link>
                    )}
                  </div>
                  <div className="pt-1 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-white/5 text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-3 py-1 text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/10 rounded-full border border-white/15 transition-all"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('register');
                  setAuthModalOpen(true);
                }}
                className="px-3 py-1 text-xs font-black text-white bg-[#ff1738] hover:bg-red-600 rounded-full transition-all shadow-sm shadow-[#ff1738]/40"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </header>
  );
}
