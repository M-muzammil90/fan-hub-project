import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialCategories } from '../data/categories';
import { initialContent } from '../data/content';
import { initialCharacters } from '../data/characters';
import { initialMerchandise } from '../data/merchandise';
import { initialEvents } from '../data/events';
import { initialFanSubmissions } from '../data/fanSubmissions';
import { initialFeedback } from '../data/feedback';
import { initialUsers } from '../data/users';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('fanhub_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [contentList, setContentList] = useState(() => {
    const saved = localStorage.getItem('fanhub_content');
    return saved ? JSON.parse(saved) : initialContent;
  });

  const [characters, setCharacters] = useState(() => {
    const saved = localStorage.getItem('fanhub_characters');
    return saved ? JSON.parse(saved) : initialCharacters;
  });

  const [merchandise, setMerchandise] = useState(() => {
    const saved = localStorage.getItem('fanhub_merchandise');
    return saved ? JSON.parse(saved) : initialMerchandise;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('fanhub_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [fanSubmissions, setFanSubmissions] = useState(() => {
    const saved = localStorage.getItem('fanhub_submissions');
    return saved ? JSON.parse(saved) : initialFanSubmissions;
  });

  const [feedbackList, setFeedbackList] = useState(() => {
    const saved = localStorage.getItem('fanhub_feedback');
    return saved ? JSON.parse(saved) : initialFeedback;
  });

  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('fanhub_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('fanhub_bookmarks');
    return saved ? JSON.parse(saved) : [
      { id: 'bm-1', userId: 'usr-1', contentSlug: 'the-soul-conductor', note: 'Must watch with friends this weekend', createdAt: '2026-03-16' },
      { id: 'bm-2', userId: 'usr-1', contentSlug: 'spider-man-across-realms', note: 'Rewatch dimension hop sequence', createdAt: '2026-03-14' }
    ];
  });

  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem('fanhub_ratings');
    return saved ? JSON.parse(saved) : {
      'the-soul-conductor': 5,
      'spider-man-across-realms': 5,
      'alita-battle-angel-awakening': 4
    };
  });

  const [favoriteCategories, setFavoriteCategories] = useState(() => {
    const saved = localStorage.getItem('fanhub_favorites');
    return saved ? JSON.parse(saved) : ['Anime', 'Gaming', 'Manga'];
  });

  useEffect(() => {
    localStorage.setItem('fanhub_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('fanhub_content', JSON.stringify(contentList));
  }, [contentList]);

  useEffect(() => {
    localStorage.setItem('fanhub_characters', JSON.stringify(characters));
  }, [characters]);

  useEffect(() => {
    localStorage.setItem('fanhub_merchandise', JSON.stringify(merchandise));
  }, [merchandise]);

  useEffect(() => {
    localStorage.setItem('fanhub_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('fanhub_submissions', JSON.stringify(fanSubmissions));
  }, [fanSubmissions]);

  useEffect(() => {
    localStorage.setItem('fanhub_feedback', JSON.stringify(feedbackList));
  }, [feedbackList]);

  useEffect(() => {
    localStorage.setItem('fanhub_users', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('fanhub_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('fanhub_ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('fanhub_favorites', JSON.stringify(favoriteCategories));
  }, [favoriteCategories]);

  const toggleFavoriteCategory = (categoryName) => {
    setFavoriteCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(c => c !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  const isFavoriteCategory = (categoryName) => {
    return favoriteCategories.includes(categoryName);
  };

  const toggleBookmark = (contentSlug, note = '') => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.contentSlug === contentSlug);
      if (exists) {
        return prev.filter(b => b.contentSlug !== contentSlug);
      } else {
        return [
          ...prev,
          {
            id: `bm-${Date.now()}`,
            userId: 'usr-1',
            contentSlug,
            note: note || '',
            createdAt: new Date().toISOString().split('T')[0]
          }
        ];
      }
    });
  };

  const updateBookmarkNote = (contentSlug, note) => {
    setBookmarks(prev => prev.map(b => b.contentSlug === contentSlug ? { ...b, note } : b));
  };

  const isBookmarked = (contentSlug) => {
    return bookmarks.some(b => b.contentSlug === contentSlug);
  };

  const setContentRating = (contentSlug, ratingValue) => {
    setRatings(prev => ({
      ...prev,
      [contentSlug]: ratingValue
    }));
  };

  const getContentRating = (contentSlug) => {
    return ratings[contentSlug] || 0;
  };

  const addCategory = (category) => {
    setCategories(prev => [...prev, { ...category, id: `cat-${Date.now()}` }]);
  };

  const updateCategory = (id, updatedFields) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addContent = (item) => {
    setContentList(prev => [...prev, { ...item, id: `cnt-${Date.now()}` }]);
  };

  const updateContent = (id, updatedFields) => {
    setContentList(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const deleteContent = (id) => {
    setContentList(prev => prev.filter(c => c.id !== id));
  };

  const toggleFeatureContent = (id) => {
    setContentList(prev => prev.map(c => c.id === id ? { ...c, featured: !c.featured } : c));
  };

  const addCharacter = (item) => {
    setCharacters(prev => [...prev, { ...item, id: `char-${Date.now()}` }]);
  };

  const updateCharacter = (id, updatedFields) => {
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const deleteCharacter = (id) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  };

  const addMerchandise = (item) => {
    setMerchandise(prev => [...prev, { ...item, id: `merch-${Date.now()}` }]);
  };

  const updateMerchandise = (id, updatedFields) => {
    setMerchandise(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
  };

  const deleteMerchandise = (id) => {
    setMerchandise(prev => prev.filter(m => m.id !== id));
  };

  const addEvent = (item) => {
    setEvents(prev => [...prev, { ...item, id: `evt-${Date.now()}` }]);
  };

  const updateEvent = (id, updatedFields) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updatedFields } : e));
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const addFanSubmission = (sub) => {
    const newSubmission = {
      ...sub,
      id: `sub-${Date.now()}`,
      status: 'pending',
      adminNote: 'Awaiting moderation review',
      submissionDate: new Date().toISOString().split('T')[0]
    };
    setFanSubmissions(prev => [newSubmission, ...prev]);
    return newSubmission;
  };

  const updateFanSubmissionStatus = (id, status, adminNote = '') => {
    setFanSubmissions(prev => prev.map(s => s.id === id ? { ...s, status, adminNote: adminNote || s.adminNote } : s));
  };

  const addFeedback = (fb) => {
    const newFeedback = {
      ...fb,
      id: `fb-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFeedbackList(prev => [newFeedback, ...prev]);
    return newFeedback;
  };

  const updateFeedbackStatus = (id, status) => {
    setFeedbackList(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  const updateUserRole = (id, role) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  };

  const deleteUser = (id) => {
    setUsersList(prev => prev.filter(u => u.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        categories,
        contentList,
        characters,
        merchandise,
        events,
        fanSubmissions,
        feedbackList,
        usersList,
        bookmarks,
        ratings,
        favoriteCategories,
        toggleFavoriteCategory,
        isFavoriteCategory,
        toggleBookmark,
        updateBookmarkNote,
        isBookmarked,
        setContentRating,
        getContentRating,
        addCategory,
        updateCategory,
        deleteCategory,
        addContent,
        updateContent,
        deleteContent,
        toggleFeatureContent,
        addCharacter,
        updateCharacter,
        deleteCharacter,
        addMerchandise,
        updateMerchandise,
        deleteMerchandise,
        addEvent,
        updateEvent,
        deleteEvent,
        addFanSubmission,
        updateFanSubmissionStatus,
        addFeedback,
        updateFeedbackStatus,
        updateUserRole,
        deleteUser
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
