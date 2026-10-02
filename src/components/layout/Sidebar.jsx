import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  Compass,
  LayoutGrid,
  Tv,
  Users,
  FileText,
  Calendar,
  PlaySquare,
  ShoppingBag,
  MoreHorizontal,
  Flame,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ onUpgrade }) {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Series', path: '/series', icon: Tv },
    { name: 'Categories', path: '/categories', icon: LayoutGrid },
    { name: 'Characters', path: '/characters', icon: Users },
    { name: 'Articles', path: '/articles', icon: FileText },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Media', path: '/media', icon: PlaySquare },
    { name: 'Merchandise', path: '/merchandise', icon: ShoppingBag },
    { name: 'More', path: '/about', icon: MoreHorizontal }
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[204px] h-screen bg-[#070709] border-r border-white/10 flex-col justify-between p-3.5 select-none z-40 overflow-hidden">
      {/* Top Section: Logo & Nav items */}
      <div className="space-y-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 pt-1.5 px-1.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff1738] to-[#d90429] flex items-center justify-center text-white shadow-md shadow-[#ff1738]/30 group-hover:scale-105 transition-transform">
            <Flame className="w-4.5 h-4.5 fill-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-black text-white tracking-tight font-display">
              FanHub
            </span>
            <span className="text-[10px] font-black text-[#ff1738] tracking-widest uppercase mt-0.5">
              PLUS
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${isActive
                    ? 'bg-[#ff1738] text-white shadow-[0_0_15px_rgba(255,23,56,0.4)] font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Premium Card & Subtle Artwork */}
      <div className="relative pt-3">
        {/* Subtle Anime Red Ambient Glow */}
        <div className="absolute -left-6 bottom-0 w-28 h-28 bg-[#ff1738]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Premium Upgrade Card */}
        <div className="relative z-10 p-2.5 rounded-xl bg-gradient-to-b from-[#16060a] to-[#0d0406] border border-red-500/30 text-center space-y-1.5 shadow-md shadow-red-950/40">
          <div className="w-6 h-6 rounded-lg bg-[#ff1738]/20 text-[#ff1738] mx-auto flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-white leading-tight">
              Join <span className="text-[#ff1738]">FanHub</span> PLUS
            </p>
            <p className="text-[9px] text-zinc-400 leading-tight mt-0.5">
              Unlock premium features
            </p>
          </div>
          <button
            type="button"
            onClick={onUpgrade}
            className="w-full py-1.5 px-2 rounded-lg bg-[#ff1738] hover:bg-red-600 text-white text-[10px] font-black flex items-center justify-center gap-1 shadow-sm shadow-[#ff1738]/40 transition-all hover:scale-[1.02] active:scale-95"
          >
            <span>Upgrade Now</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Faint watermark silhouette indicator at bottom */}
        <div className="pt-2 text-center text-[9px] text-zinc-600 font-mono">
          v2.5 • Plus
        </div>
      </div>
    </aside>
  );
}
