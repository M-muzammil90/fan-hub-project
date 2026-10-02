import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function SearchBar({
  placeholder = 'Search titles, genres, creators, lore...',
  className = '',
  inputClassName = ''
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { contentList } = useData();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmed = query.trim().toLowerCase();

  const filteredContent = trimmed
    ? contentList.filter(
        (c) =>
          c.title.toLowerCase().includes(trimmed) ||
          c.description.toLowerCase().includes(trimmed) ||
          c.category.toLowerCase().includes(trimmed) ||
          c.tags?.some((t) => t.toLowerCase().includes(trimmed)) ||
          c.genres?.some((g) => g.toLowerCase().includes(trimmed))
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (trimmed) {
      setIsOpen(false);
      navigate(`/explore?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleSelectContent = (slug) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/content/${slug}`);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <div className="absolute left-3.5 text-zinc-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={
            inputClassName ||
            'w-full pl-10 pr-9 py-2 text-xs md:text-sm bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-2xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all shadow-inner'
          }
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 text-zinc-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {isOpen && trimmed && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0f0507] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 max-h-80 overflow-y-auto divide-y divide-white/[0.06]">
            {filteredContent.length > 0 ? (
              <>
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-400 font-mono">
                  Search Results ({filteredContent.length})
                </div>
                {filteredContent.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectContent(item.slug)}
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-red-950/40 rounded-xl transition-colors text-left group"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-zinc-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white group-hover:text-red-400 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {item.category} · {item.contentType} · {item.genres?.join(', ')}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-full mt-1 p-2 text-center text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-xl transition-colors"
                >
                  View all results for "{trimmed}" in Explore →
                </button>
              </>
            ) : (
              <div className="py-6 px-4 text-center">
                <p className="text-xs font-semibold text-zinc-300">No matching titles or tags</p>
                <p className="text-[11px] text-zinc-500 mt-1">Try searching for Anime, Gaming, or Cyberpunk</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
