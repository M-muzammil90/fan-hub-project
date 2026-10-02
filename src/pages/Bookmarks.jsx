import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Star, Trash2, Edit3, Film, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import RatingStars from '../components/RatingStars';
import EmptyState from '../components/EmptyState';

export default function Bookmarks() {
  const { bookmarks, toggleBookmark, updateBookmarkNote, contentList, ratings, setContentRating } = useData();
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [noteText, setNoteText] = useState('');

  const bookmarkedItems = bookmarks.map((b) => {
    const item = contentList.find((c) => c.slug === b.contentSlug);
    return {
      ...b,
      item
    };
  }).filter(b => b.item);

  const ratedItems = Object.entries(ratings).map(([slug, ratingVal]) => {
    const item = contentList.find((c) => c.slug === slug);
    return {
      slug,
      ratingVal,
      item
    };
  }).filter(r => r.item);

  const handleOpenEdit = (b) => {
    setEditingBookmark(b);
    setNoteText(b.note || '');
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (editingBookmark) {
      updateBookmarkNote(editingBookmark.contentSlug, noteText);
      setEditingBookmark(null);
    }
  };

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Personal Vault</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
          Watchlist & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Ratings</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-medium">
          Manage your saved series, custom viewing notes, and community star scores.
        </p>
      </div>

      <div className="flex items-center gap-2 p-1.5 bg-[#0c101d] rounded-2xl border border-white/[0.08] w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bookmarks'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Bookmarks ({bookmarkedItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ratings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ratings'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>My Ratings ({ratedItems.length})</span>
        </button>
      </div>

      {activeTab === 'bookmarks' && (
        bookmarkedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarkedItems.map(({ id, contentSlug, note, item }) => (
              <div
                key={id}
                className="p-5 rounded-3xl bg-[#0c101d] border border-white/[0.08] flex flex-col sm:flex-row gap-4 items-start justify-between group hover:border-blue-500/40 transition-all shadow-xl"
              >
                <div className="flex gap-4 min-w-0 w-full">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 bg-zinc-950"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      {item.category} • {item.contentType}
                    </span>
                    <Link to={`/content/${item.slug}`}>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors truncate font-display">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-zinc-400 line-clamp-1">{item.description}</p>

                    <div className="pt-2">
                      {note ? (
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-[11px] text-zinc-300 flex items-start justify-between gap-2">
                          <span className="italic truncate">"{note}"</span>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit({ contentSlug, note })}
                            className="text-zinc-400 hover:text-white shrink-0"
                            title="Edit note"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenEdit({ contentSlug, note: '' })}
                          className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-bold"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Add personal note</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleBookmark(contentSlug)}
                  className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-colors shrink-0 self-end sm:self-start"
                  title="Remove bookmark"
                  aria-label="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your Watchlist is Empty"
            description="You haven't bookmarked any fandom entries yet. Browse Explore or any category page and click the bookmark button."
            actionText="Explore Fandom Content"
            actionLink="/explore"
          />
        )
      )}

      {activeTab === 'ratings' && (
        ratedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ratedItems.map(({ slug, ratingVal, item }) => (
              <div
                key={slug}
                className="p-5 rounded-3xl bg-[#0c101d] border border-white/[0.08] flex gap-4 items-center justify-between shadow-xl"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-zinc-950"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase text-blue-400">
                      {item.category}
                    </span>
                    <Link to={`/content/${item.slug}`}>
                      <h4 className="text-sm font-bold text-white hover:text-blue-400 truncate font-display">
                        {item.title}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <RatingStars
                        value={ratingVal}
                        onChange={(newVal) => setContentRating(slug, newVal)}
                        size="sm"
                      />
                      <span className="text-xs font-mono text-zinc-400 font-semibold">
                        {ratingVal} / 5
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/content/${item.slug}`}
                  className="p-2.5 rounded-xl bg-[#121829] hover:bg-blue-600 text-zinc-300 hover:text-white transition-colors"
                  title="View content"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Ratings Logged"
            description="You haven't rated any titles yet. Head over to any content detail page to rate from 1 to 5 stars."
            actionText="Browse Titles"
            actionLink="/explore"
          />
        )
      )}

      <Modal
        isOpen={!!editingBookmark}
        onClose={() => setEditingBookmark(null)}
        title="Edit Watchlist Note"
      >
        <form onSubmit={handleSaveNote} className="space-y-4">
          <p className="text-xs text-zinc-400">
            Update your personal reminder or watch party plan:
          </p>
          <textarea
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full px-3 py-2.5 text-xs bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingBookmark(null)}
              className="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md shadow-blue-500/20"
            >
              Update Note
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
