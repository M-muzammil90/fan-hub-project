import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  Home,
  Compass,
  Users,
  Calendar,
  PlaySquare,
  LayoutGrid,
  FileText,
  ShoppingBag,
  MoreHorizontal,
  Flame,
  X
} from 'lucide-react';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import Footer from './layout/Footer';
import ExternalChatbotWidget from './ExternalChatbotWidget';
import SearchBar from './SearchBar';

export default function Layout() {
  const [isChatbotModalOpen, setIsChatbotModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mobileNavItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Categories', path: '/categories', icon: LayoutGrid },
    { name: 'Characters', path: '/characters', icon: Users },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Media', path: '/media', icon: PlaySquare }
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col selection:bg-[#ff1738] selection:text-white transition-colors duration-300 overflow-x-hidden relative">
      {/* Background Subtle Red Ambient Glows */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[400px] bg-[#ff1738]/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 left-10 w-[450px] h-[450px] bg-[#ff1738]/4 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Top Header */}
      <Header
        onMobileMenuToggle={() => setIsMobileMenuOpen((prev) => !prev)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Fixed Left Sidebar (Desktop) */}
      <Sidebar onUpgrade={() => setIsChatbotModalOpen(true)} />

      {/* Mobile Drawer (Visible when hamburger clicked on < lg) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col p-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#ff1738] flex items-center justify-center text-white">
                <Flame className="w-4 h-4 fill-white" />
              </div>
              <span className="text-base font-black text-white font-display">
                FanHub <span className="text-[#ff1738]">PLUS</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white bg-white/5 border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-4">
            <SearchBar
              className="w-full"
              inputClassName="w-full pl-9 pr-4 py-2.5 text-xs bg-[#0d0d12] border border-white/10 focus:border-[#ff1738] rounded-xl text-white placeholder-zinc-500"
              placeholder="Search anime, movies, characters..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5 py-2">
            {[
              { name: 'Home', path: '/' },
              { name: 'Explore', path: '/explore' },
              { name: 'Categories', path: '/categories' },
              { name: 'Characters', path: '/characters' },
              { name: 'Articles', path: '/articles' },
              { name: 'Events', path: '/events' },
              { name: 'Media', path: '/media' },
              { name: 'Merchandise', path: '/merchandise' }
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-[#ff1738] text-white text-xs font-bold transition-colors border border-white/5"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area (Offset by sidebar width 185px on desktop) */}
      <div className="lg:ml-[185px] pt-16 flex-1 flex flex-col min-h-screen z-10">
        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-[1550px] w-full mx-auto pb-20 lg:pb-10">
          <Outlet />
        </main>
        <Footer />
      </div>

      {/* Mobile App-Style Bottom Navigation Bar (Hidden on Desktop >= lg) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070709]/95 backdrop-blur-xl border-t border-white/10 px-2 pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all select-none ${isActive
                  ? 'text-[#ff1738] scale-105 drop-shadow-[0_0_8px_rgba(255,23,56,0.7)] font-black'
                  : 'text-zinc-400 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* External AI Chatbot Widget */}
      <ExternalChatbotWidget
        isOpen={isChatbotModalOpen}
        onClose={() => setIsChatbotModalOpen(false)}
        onOpen={() => setIsChatbotModalOpen(true)}
      />
    </div>
  );
}
