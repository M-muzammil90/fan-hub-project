import React, { useState } from 'react';
import { Bookmark, Edit3 } from 'lucide-react';
import { useData } from '../context/DataContext';
import Modal from './Modal';

export default function BookmarkButton({ contentSlug, title = '', className = '', showLabel = false, size = 'sm' }) {
  const { isBookmarked, toggleBookmark, bookmarks, updateBookmarkNote } = useData();
  const bookmarked = isBookmarked(contentSlug);
  const currentBookmark = bookmarks.find(b => b.contentSlug === contentSlug);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState(currentBookmark?.note || '');

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(contentSlug);
  };

  const handleOpenNote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setNoteText(currentBookmark?.note || '');
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    updateBookmarkNote(contentSlug, noteText);
    setIsNoteModalOpen(false);
  };

  return (
    <>
      <div className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={handleClick}
          className={`inline-flex items-center justify-center rounded-xl transition-all ${
            size === 'sm' ? 'p-2' : 'px-3 py-2'
          } ${
            bookmarked
              ? 'bg-rose-500 text-white shadow-md shadow-rose-950/40 hover:bg-rose-600'
              : 'bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-700/60'
          } ${className}`}
          title={bookmarked ? 'Remove bookmark' : 'Bookmark this title'}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this title'}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-white' : ''}`} />
          {showLabel && <span className="ml-1.5 text-xs font-semibold">{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>}
        </button>

        {bookmarked && (
          <button
            type="button"
            onClick={handleOpenNote}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-400 hover:text-white transition-colors"
            title="Add or edit bookmark note"
            aria-label="Add or edit bookmark note"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Bookmark Note"
      >
        <form onSubmit={handleSaveNote} className="space-y-4">
          <p className="text-xs text-zinc-400">
            Save a personal note for <strong className="text-zinc-200">{title || contentSlug}</strong>:
          </p>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="e.g. Plan to watch with discord squad at 8 PM..."
            rows={3}
            className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNoteModalOpen(false)}
              className="px-3 py-1.5 text-xs font-medium rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
            >
              Save Note
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
