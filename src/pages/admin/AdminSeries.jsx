import React, { useState, useEffect } from 'react';
import {
  Tv,
  Plus,
  Edit,
  Trash2,
  Sparkles,
  Search,
  RefreshCw,
  AlertCircle,
  Image as ImageIcon,
  Video,
  Play,
  Layers,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Calendar,
  Star,
  Film
} from 'lucide-react';
import { seriesApi } from '../../services/series.api';
import { categoryApi } from '../../services/category.api';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminSeries() {
  // Navigation Hierarchy Level: 'series' | 'seasons' | 'episodes'
  const [activeLevel, setActiveLevel] = useState('series');
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);

  // Data states
  const [seriesList, setSeriesList] = useState([]);
  const [seasonsList, setSeasonsList] = useState([]);
  const [episodesList, setEpisodesList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Series Form State
  const [seriesModalOpen, setSeriesModalOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState(null);
  const [seriesForm, setSeriesForm] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    status: 'ongoing',
    releaseYear: new Date().getFullYear(),
    genres: 'Action, Anime',
    tags: 'series, popular',
    rating: 9.0,
    trailerUrl: '',
    isFeatured: false,
    poster: '',
    backdrop: ''
  });
  const [seriesPosterFile, setSeriesPosterFile] = useState(null);
  const [seriesBackdropFile, setSeriesBackdropFile] = useState(null);

  // Season Form State
  const [seasonModalOpen, setSeasonModalOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState(null);
  const [seasonForm, setSeasonForm] = useState({
    seasonNumber: 1,
    title: 'Season 1',
    description: '',
    releaseYear: new Date().getFullYear(),
    trailerUrl: '',
    poster: ''
  });
  const [seasonPosterFile, setSeasonPosterFile] = useState(null);

  // Episode Form State
  const [episodeModalOpen, setEpisodeModalOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);
  const [episodeForm, setEpisodeForm] = useState({
    episodeNumber: 1,
    title: '',
    description: '',
    duration: '24m',
    videoUrl: '',
    thumbnail: '',
    freePreview: false
  });
  const [episodeThumbnailFile, setEpisodeThumbnailFile] = useState(null);
  const [episodeVideoFile, setEpisodeVideoFile] = useState(null);

  // Video Preview Modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

  // Delete Confirm Modal
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    type: null, // 'series' | 'season' | 'episode'
    item: null
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadSeries();
  }, []);

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getCategories();
      setCategories(res.categories || res || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadSeries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await seriesApi.getSeries({ limit: 100 });
      setSeriesList(res.series || []);
    } catch (err) {
      setError(err.message || 'Failed to load series catalog');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSeasons = async (seriesId) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await seriesApi.getSeasonsBySeries(seriesId);
      setSeasonsList(res.seasons || []);
    } catch (err) {
      setError(err.message || 'Failed to load seasons');
    } finally {
      setIsLoading(false);
    }
  };

  const loadEpisodes = async (seasonId) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await seriesApi.getEpisodesBySeason(seasonId);
      setEpisodesList(res.episodes || []);
    } catch (err) {
      setError(err.message || 'Failed to load episodes');
    } finally {
      setIsLoading(false);
    }
  };

  // Drilldown Navigation Handlers
  const handleOpenSeasons = (series) => {
    setSelectedSeries(series);
    setSelectedSeason(null);
    setActiveLevel('seasons');
    loadSeasons(series._id);
  };

  const handleOpenEpisodes = (season) => {
    setSelectedSeason(season);
    setActiveLevel('episodes');
    loadEpisodes(season._id);
  };

  // === SERIES CRUD ===
  const handleOpenSeriesModal = (series = null) => {
    if (series) {
      setEditingSeries(series);
      setSeriesForm({
        title: series.title || '',
        slug: series.slug || '',
        description: series.description || '',
        category: typeof series.category === 'object' ? series.category?._id : (series.category || ''),
        status: series.status || 'ongoing',
        releaseYear: series.releaseYear || new Date().getFullYear(),
        genres: Array.isArray(series.genres) ? series.genres.join(', ') : '',
        tags: Array.isArray(series.tags) ? series.tags.join(', ') : '',
        rating: series.rating || 9.0,
        trailerUrl: series.trailerUrl || '',
        isFeatured: series.isFeatured || false,
        poster: series.poster || '',
        backdrop: series.backdrop || ''
      });
    } else {
      setEditingSeries(null);
      setSeriesForm({
        title: '',
        slug: '',
        description: '',
        category: categories[0]?._id || '',
        status: 'ongoing',
        releaseYear: new Date().getFullYear(),
        genres: 'Action, Anime',
        tags: 'series, popular',
        rating: 9.0,
        trailerUrl: '',
        isFeatured: false,
        poster: '',
        backdrop: ''
      });
    }
    setSeriesPosterFile(null);
    setSeriesBackdropFile(null);
    setSeriesModalOpen(true);
  };

  const handleSaveSeries = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', seriesForm.title);
      if (seriesForm.slug) formData.append('slug', seriesForm.slug);
      formData.append('description', seriesForm.description);
      formData.append('category', seriesForm.category);
      formData.append('status', seriesForm.status);
      formData.append('releaseYear', seriesForm.releaseYear);
      formData.append('rating', seriesForm.rating);
      formData.append('trailerUrl', seriesForm.trailerUrl);
      formData.append('isFeatured', seriesForm.isFeatured);

      const parsedGenres = seriesForm.genres.split(',').map((g) => g.trim()).filter(Boolean);
      formData.append('genres', JSON.stringify(parsedGenres));

      const parsedTags = seriesForm.tags.split(',').map((t) => t.trim()).filter(Boolean);
      formData.append('tags', JSON.stringify(parsedTags));

      if (seriesPosterFile) {
        formData.append('poster', seriesPosterFile);
      } else if (seriesForm.poster) {
        formData.append('poster', seriesForm.poster);
      }

      if (seriesBackdropFile) {
        formData.append('backdrop', seriesBackdropFile);
      } else if (seriesForm.backdrop) {
        formData.append('backdrop', seriesForm.backdrop);
      }

      if (editingSeries) {
        await seriesApi.updateSeries(editingSeries._id, formData);
        showToast('Series updated successfully!');
      } else {
        await seriesApi.createSeries(formData);
        showToast('Series created successfully!');
      }

      setSeriesModalOpen(false);
      loadSeries();
    } catch (err) {
      setError(err.message || 'Failed to save series');
    } finally {
      setIsSubmitting(false);
    }
  };

  // === SEASON CRUD ===
  const handleOpenSeasonModal = (season = null) => {
    if (season) {
      setEditingSeason(season);
      setSeasonForm({
        seasonNumber: season.seasonNumber || 1,
        title: season.title || `Season ${season.seasonNumber || 1}`,
        description: season.description || '',
        releaseYear: season.releaseYear || new Date().getFullYear(),
        trailerUrl: season.trailerUrl || '',
        poster: season.poster || ''
      });
    } else {
      setEditingSeason(null);
      const nextNum = seasonsList.length > 0 ? Math.max(...seasonsList.map((s) => s.seasonNumber || 0)) + 1 : 1;
      setSeasonForm({
        seasonNumber: nextNum,
        title: `Season ${nextNum}`,
        description: '',
        releaseYear: new Date().getFullYear(),
        trailerUrl: '',
        poster: selectedSeries?.poster || ''
      });
    }
    setSeasonPosterFile(null);
    setSeasonModalOpen(true);
  };

  const handleSaveSeason = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('series', selectedSeries._id);
      formData.append('seasonNumber', seasonForm.seasonNumber);
      formData.append('title', seasonForm.title);
      formData.append('description', seasonForm.description);
      formData.append('releaseYear', seasonForm.releaseYear);
      formData.append('trailerUrl', seasonForm.trailerUrl);

      if (seasonPosterFile) {
        formData.append('poster', seasonPosterFile);
      } else if (seasonForm.poster) {
        formData.append('poster', seasonForm.poster);
      }

      if (editingSeason) {
        await seriesApi.updateSeason(editingSeason._id, formData);
        showToast('Season updated successfully!');
      } else {
        await seriesApi.createSeason(formData);
        showToast('Season created successfully!');
      }

      setSeasonModalOpen(false);
      loadSeasons(selectedSeries._id);
      loadSeries(); // refresh counts
    } catch (err) {
      setError(err.message || 'Failed to save season');
    } finally {
      setIsSubmitting(false);
    }
  };

  // === EPISODE CRUD ===
  const handleOpenEpisodeModal = (episode = null) => {
    if (episode) {
      setEditingEpisode(episode);
      setEpisodeForm({
        episodeNumber: episode.episodeNumber || 1,
        title: episode.title || '',
        description: episode.description || '',
        duration: episode.duration || '24m',
        videoUrl: episode.videoUrl || '',
        thumbnail: episode.thumbnail || '',
        freePreview: episode.freePreview || false
      });
    } else {
      setEditingEpisode(null);
      const nextEpNum = episodesList.length > 0 ? Math.max(...episodesList.map((e) => e.episodeNumber || 0)) + 1 : 1;
      setEpisodeForm({
        episodeNumber: nextEpNum,
        title: `Episode ${nextEpNum}`,
        description: '',
        duration: '24m',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: selectedSeason?.poster || selectedSeries?.backdrop || '',
        freePreview: false
      });
    }
    setEpisodeThumbnailFile(null);
    setEpisodeVideoFile(null);
    setEpisodeModalOpen(true);
  };

  const handleSaveEpisode = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('season', selectedSeason._id);
      formData.append('episodeNumber', episodeForm.episodeNumber);
      formData.append('title', episodeForm.title);
      formData.append('description', episodeForm.description);
      formData.append('duration', episodeForm.duration);
      formData.append('freePreview', episodeForm.freePreview);

      if (episodeVideoFile) {
        formData.append('video', episodeVideoFile);
      } else if (episodeForm.videoUrl) {
        formData.append('videoUrl', episodeForm.videoUrl);
      }

      if (episodeThumbnailFile) {
        formData.append('thumbnail', episodeThumbnailFile);
      } else if (episodeForm.thumbnail) {
        formData.append('thumbnail', episodeForm.thumbnail);
      }

      if (editingEpisode) {
        await seriesApi.updateEpisode(editingEpisode._id, formData);
        showToast('Episode updated successfully!');
      } else {
        await seriesApi.createEpisode(formData);
        showToast('Episode created successfully!');
      }

      setEpisodeModalOpen(false);
      loadEpisodes(selectedSeason._id);
      loadSeasons(selectedSeries._id);
      loadSeries();
    } catch (err) {
      setError(err.message || 'Failed to save episode');
    } finally {
      setIsSubmitting(false);
    }
  };

  // === DELETE HANDLER ===
  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;
    setIsDeleting(true);
    setError(null);

    try {
      if (deleteModal.type === 'series') {
        await seriesApi.deleteSeries(deleteModal.item._id);
        showToast('Series and all nested seasons/episodes deleted!');
        loadSeries();
      } else if (deleteModal.type === 'season') {
        await seriesApi.deleteSeason(deleteModal.item._id);
        showToast('Season and all its episodes deleted!');
        loadSeasons(selectedSeries._id);
        loadSeries();
      } else if (deleteModal.type === 'episode') {
        await seriesApi.deleteEpisode(deleteModal.item._id);
        showToast('Episode deleted successfully!');
        loadEpisodes(selectedSeason._id);
        loadSeasons(selectedSeries._id);
        loadSeries();
      }
      setDeleteModal({ open: false, type: null, item: null });
    } catch (err) {
      setError(err.message || 'Delete operation failed');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered Series list
  const filteredSeries = seriesList.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const catId = typeof s.category === 'object' ? s.category?._id : s.category;
    const matchesCat = selectedCategory === 'all' || catId === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successMsg && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="flex items-center justify-between bg-red-950/40 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="text-xs text-red-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Top Header & Interactive Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0d] border border-red-500/20 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 mb-1">
            <button
              type="button"
              onClick={() => {
                setActiveLevel('series');
                setSelectedSeries(null);
                setSelectedSeason(null);
              }}
              className={`hover:text-red-400 transition-colors ${activeLevel === 'series' ? 'text-red-500 font-black' : ''}`}
            >
              All Series
            </button>

            {selectedSeries && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                <button
                  type="button"
                  onClick={() => {
                    setActiveLevel('seasons');
                    setSelectedSeason(null);
                    loadSeasons(selectedSeries._id);
                  }}
                  className={`hover:text-red-400 transition-colors ${activeLevel === 'seasons' ? 'text-red-500 font-black' : ''}`}
                >
                  {selectedSeries.title}
                </button>
              </>
            )}

            {selectedSeason && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-red-500 font-black">
                  {selectedSeason.title || `Season ${selectedSeason.seasonNumber}`}
                </span>
              </>
            )}
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Tv className="w-6 h-6 text-red-500" />
            {activeLevel === 'series' && 'Series & Episodes Management'}
            {activeLevel === 'seasons' && `${selectedSeries?.title} — Seasons`}
            {activeLevel === 'episodes' && `${selectedSeries?.title} — ${selectedSeason?.title || `Season ${selectedSeason?.seasonNumber}`}`}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {activeLevel === 'series' && 'Manage anime series, web series, and seasons hierarchies.'}
            {activeLevel === 'seasons' && `Manage seasons belonging to ${selectedSeries?.title}.`}
            {activeLevel === 'episodes' && `Manage video episodes and playback streams for ${selectedSeason?.title}.`}
          </p>
        </div>

        {/* Action Button depending on level */}
        <div className="flex items-center gap-3">
          {activeLevel !== 'series' && (
            <button
              type="button"
              onClick={() => {
                if (activeLevel === 'episodes') {
                  setActiveLevel('seasons');
                  setSelectedSeason(null);
                } else {
                  setActiveLevel('series');
                  setSelectedSeries(null);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {activeLevel === 'series' && (
            <button
              type="button"
              onClick={() => handleOpenSeriesModal()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black shadow-lg shadow-red-950/50 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add Series</span>
            </button>
          )}

          {activeLevel === 'seasons' && (
            <button
              type="button"
              onClick={() => handleOpenSeasonModal()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black shadow-lg shadow-red-950/50 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add Season</span>
            </button>
          )}

          {activeLevel === 'episodes' && (
            <button
              type="button"
              onClick={() => handleOpenEpisodeModal()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black shadow-lg shadow-red-950/50 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add Episode</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= LEVEL 1: ALL SERIES VIEW ================= */}
      {activeLevel === 'series' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/60 border border-zinc-800/80 p-3.5 rounded-xl">
            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search series title, description, genres..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-black/50 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-black/50 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-black/50 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
              >
                <option value="all">All Statuses</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>

            <button
              type="button"
              onClick={loadSeries}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
              title="Refresh series list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-red-500' : ''}`} />
            </button>
          </div>

          {/* Series Cards Grid */}
          {isLoading ? (
            <div className="py-20 text-center text-zinc-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-red-500" />
              <p className="text-xs font-semibold">Loading series collection...</p>
            </div>
          ) : filteredSeries.length === 0 ? (
            <div className="py-20 text-center bg-zinc-950/40 border border-zinc-800/60 rounded-2xl">
              <Tv className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-300">No series found</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search filters.'
                  : 'Start by creating your first series with seasons and episodes.'}
              </p>
              <button
                type="button"
                onClick={() => handleOpenSeriesModal()}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all"
              >
                Create Series
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSeries.map((series) => {
                const catName = typeof series.category === 'object' ? (series.category?.name || 'Category') : 'Category';
                return (
                  <div
                    key={series._id}
                    className="group relative bg-[#09090c] border border-zinc-800/80 hover:border-red-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-red-950/30 flex flex-col justify-between"
                  >
                    {/* Poster / Backdrop Header */}
                    <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                      <img
                        src={series.backdrop || series.poster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80'}
                        alt={series.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09090c] via-transparent to-black/60" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-md">
                          {catName}
                        </span>

                        {series.isFeatured && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 text-black flex items-center gap-1 shadow-md">
                            <Sparkles className="w-2.5 h-2.5 fill-current" />
                            FEATURED
                          </span>
                        )}
                      </div>

                      {/* Small Poster Thumbnail Overlay */}
                      {series.poster && (
                        <div className="absolute bottom-2 left-3 w-12 h-16 rounded-lg overflow-hidden border border-white/20 shadow-lg shrink-0">
                          <img src={series.poster} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Status Tag */}
                      <div className="absolute bottom-2 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            series.status === 'ongoing'
                              ? 'bg-emerald-400 animate-pulse'
                              : series.status === 'completed'
                                ? 'bg-blue-400'
                                : 'bg-amber-400'
                          }`}
                        />
                        <span className="capitalize">{series.status}</span>
                      </div>
                    </div>

                    {/* Body Info */}
                    <div className="p-4 space-y-2 flex-1">
                      <div>
                        <h3 className="text-base font-black text-white leading-tight group-hover:text-red-400 transition-colors line-clamp-1">
                          {series.title}
                        </h3>
                        <p className="text-[11px] font-mono text-zinc-500">/{series.slug}</p>
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {series.description || 'No description provided.'}
                      </p>

                      {/* Meta Tags Row */}
                      <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {series.rating || '9.0'}
                        </span>
                        <span>•</span>
                        <span>{series.releaseYear || '2024'}</span>
                        <span>•</span>
                        <span className="text-zinc-300 font-bold">
                          {series.seasonsCount || 0} Seasons ({series.episodesCount || 0} Eps)
                        </span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-3 bg-black/40 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await seriesApi.updateSeries(series._id, { isFeatured: !series.isFeatured });
                            if (res.success) {
                              setSeriesList((prev) =>
                                prev.map((s) => (s._id === series._id ? { ...s, isFeatured: !series.isFeatured } : s))
                              );
                              showToast(series.isFeatured ? 'Removed from Hero Slider' : 'Added to Hero Slider & Featured!');
                            }
                          } catch (err) {
                            setError(err.message || 'Failed to update featured status');
                          }
                        }}
                        className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
                          series.isFeatured
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500 hover:text-black'
                            : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-amber-500/20 hover:text-amber-300'
                        }`}
                        title={series.isFeatured ? 'Active on Hero Slider (Click to remove)' : 'Click to feature on Hero Slider'}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenSeasons(series)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-black flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Seasons ({series.seasonsCount || 0})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenSeriesModal(series)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-colors"
                        title="Edit series"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteModal({ open: true, type: 'series', item: series })}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 transition-colors"
                        title="Delete series (cascades)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= LEVEL 2: SEASONS VIEW ================= */}
      {activeLevel === 'seasons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-zinc-950/60 border border-zinc-800/80 p-3.5 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-300">
                Total Seasons: <strong className="text-white">{seasonsList.length}</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={() => loadSeasons(selectedSeries._id)}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-red-500' : ''}`} />
            </button>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-zinc-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-red-500" />
              <p className="text-xs font-semibold">Loading seasons...</p>
            </div>
          ) : seasonsList.length === 0 ? (
            <div className="py-16 text-center bg-zinc-950/40 border border-zinc-800/60 rounded-2xl">
              <Layers className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-zinc-300">No seasons created yet</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Add Season 1 to start attaching episodes.</p>
              <button
                type="button"
                onClick={() => handleOpenSeasonModal()}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all"
              >
                Add Season 1
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {seasonsList.map((season) => (
                <div
                  key={season._id}
                  className="bg-[#09090c] border border-zinc-800/80 hover:border-red-500/40 rounded-2xl overflow-hidden p-4 flex flex-col justify-between group transition-all"
                >
                  <div className="flex gap-3.5">
                    {/* Season Poster */}
                    <div className="w-20 h-28 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
                      <img
                        src={season.poster || selectedSeries?.poster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80'}
                        alt={season.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Season Info */}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-red-600/30 border border-red-500/40 text-red-400 font-mono text-[10px] font-black">
                          S{String(season.seasonNumber).padStart(2, '0')}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">{season.releaseYear || '2024'}</span>
                      </div>

                      <h4 className="text-sm font-black text-white leading-tight line-clamp-1">
                        {season.title || `Season ${season.seasonNumber}`}
                      </h4>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-snug">
                        {season.description || 'No season synopsis provided.'}
                      </p>

                      <div className="pt-1 text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-red-400" />
                        <span>{season.episodeCount || season.episodes?.length || 0} Episodes</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEpisodes(season)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-all"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Manage Episodes ({season.episodeCount || season.episodes?.length || 0})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenSeasonModal(season)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10"
                      title="Edit season"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteModal({ open: true, type: 'season', item: season })}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20"
                      title="Delete season"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= LEVEL 3: EPISODES VIEW ================= */}
      {activeLevel === 'episodes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-zinc-950/60 border border-zinc-800/80 p-3.5 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-300">
                Episodes in {selectedSeason?.title || `Season ${selectedSeason?.seasonNumber}`}:{' '}
                <strong className="text-white">{episodesList.length}</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={() => loadEpisodes(selectedSeason._id)}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-red-500' : ''}`} />
            </button>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-zinc-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-red-500" />
              <p className="text-xs font-semibold">Loading episodes...</p>
            </div>
          ) : episodesList.length === 0 ? (
            <div className="py-16 text-center bg-zinc-950/40 border border-zinc-800/60 rounded-2xl">
              <Video className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-zinc-300">No episodes created yet</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Upload or link your first video episode stream.</p>
              <button
                type="button"
                onClick={() => handleOpenEpisodeModal()}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all"
              >
                Add Episode 1
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {episodesList.map((ep) => (
                <div
                  key={ep._id}
                  className="bg-[#09090c] border border-zinc-800/80 hover:border-red-500/40 p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group transition-all"
                >
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    {/* Episode Thumbnail with Play Preview */}
                    <div
                      onClick={() => setPreviewVideoUrl(ep.videoUrl)}
                      className="relative w-28 h-18 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0 cursor-pointer group/thumb"
                    >
                      <img
                        src={ep.thumbnail || selectedSeason?.poster || selectedSeries?.backdrop || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80'}
                        alt={ep.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover/thumb:bg-red-600/40 flex items-center justify-center transition-colors">
                        <Play className="w-5 h-5 text-white fill-current" />
                      </div>
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-white">
                        {ep.duration || '24m'}
                      </span>
                    </div>

                    {/* Episode Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-mono font-black">
                          EP {String(ep.episodeNumber).padStart(2, '0')}
                        </span>
                        {ep.freePreview && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            FREE PREVIEW
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-zinc-500">
                          {ep.viewCount || 0} views
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-white leading-tight">{ep.title}</h4>
                      <p className="text-xs text-zinc-400 line-clamp-1 max-w-xl">
                        {ep.description || 'No description.'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => setPreviewVideoUrl(ep.videoUrl)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold flex items-center gap-1 border border-white/10"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEpisodeModal(ep)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10"
                      title="Edit episode"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteModal({ open: true, type: 'episode', item: ep })}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20"
                      title="Delete episode"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT SERIES ================= */}
      {seriesModalOpen && (
        <Modal
          isOpen={seriesModalOpen}
          onClose={() => setSeriesModalOpen(false)}
          title={editingSeries ? `Edit Series: ${editingSeries.title}` : 'Add New Series'}
          size="lg"
        >
          <form onSubmit={handleSaveSeries} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Series Title *</label>
                <input
                  type="text"
                  required
                  value={seriesForm.title}
                  onChange={(e) => setSeriesForm({ ...seriesForm, title: e.target.value })}
                  placeholder="e.g. Solo Leveling: Arise"
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Custom Slug (optional)</label>
                <input
                  type="text"
                  value={seriesForm.slug}
                  onChange={(e) => setSeriesForm({ ...seriesForm, slug: e.target.value })}
                  placeholder="e.g. solo-leveling-arise"
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Category *</label>
                <select
                  required
                  value={seriesForm.category}
                  onChange={(e) => setSeriesForm({ ...seriesForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Status</label>
                <select
                  value={seriesForm.status}
                  onChange={(e) => setSeriesForm({ ...seriesForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Release Year</label>
                <input
                  type="number"
                  value={seriesForm.releaseYear}
                  onChange={(e) => setSeriesForm({ ...seriesForm, releaseYear: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Synopsis / Description</label>
              <textarea
                rows={3}
                value={seriesForm.description}
                onChange={(e) => setSeriesForm({ ...seriesForm, description: e.target.value })}
                placeholder="Detailed summary of the series storyline..."
                className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Genres (comma separated)</label>
                <input
                  type="text"
                  value={seriesForm.genres}
                  onChange={(e) => setSeriesForm({ ...seriesForm, genres: e.target.value })}
                  placeholder="Action, Fantasy, Adventure"
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Trailer URL (YouTube / MP4)</label>
                <input
                  type="text"
                  value={seriesForm.trailerUrl}
                  onChange={(e) => setSeriesForm({ ...seriesForm, trailerUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Poster & Backdrop Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Poster Image (Vertical)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSeriesPosterFile(e.target.files[0])}
                  className="w-full text-xs text-zinc-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
                />
                <input
                  type="text"
                  placeholder="Or enter direct image URL"
                  value={seriesForm.poster}
                  onChange={(e) => setSeriesForm({ ...seriesForm, poster: e.target.value })}
                  className="w-full mt-2 px-3 py-1.5 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Backdrop Banner (Horizontal)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSeriesBackdropFile(e.target.files[0])}
                  className="w-full text-xs text-zinc-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
                />
                <input
                  type="text"
                  placeholder="Or enter direct banner URL"
                  value={seriesForm.backdrop}
                  onChange={(e) => setSeriesForm({ ...seriesForm, backdrop: e.target.value })}
                  className="w-full mt-2 px-3 py-1.5 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isFeaturedSeries"
                checked={seriesForm.isFeatured}
                onChange={(e) => setSeriesForm({ ...seriesForm, isFeatured: e.target.checked })}
                className="rounded border-zinc-800 text-red-600 focus:ring-red-500 w-4 h-4 bg-black/60"
              />
              <label htmlFor="isFeaturedSeries" className="text-xs font-bold text-zinc-300 cursor-pointer">
                Promote to Featured Slider & Showcase
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setSeriesModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-black text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-lg transition-all"
              >
                {isSubmitting ? 'Saving...' : editingSeries ? 'Update Series' : 'Create Series'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL: CREATE / EDIT SEASON ================= */}
      {seasonModalOpen && (
        <Modal
          isOpen={seasonModalOpen}
          onClose={() => setSeasonModalOpen(false)}
          title={editingSeason ? `Edit Season: ${seasonForm.title}` : `Add Season to ${selectedSeries?.title}`}
          size="md"
        >
          <form onSubmit={handleSaveSeason} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Season Number *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={seasonForm.seasonNumber}
                  onChange={(e) => setSeasonForm({ ...seasonForm, seasonNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Release Year</label>
                <input
                  type="number"
                  value={seasonForm.releaseYear}
                  onChange={(e) => setSeasonForm({ ...seasonForm, releaseYear: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Season Title / Arc Name</label>
              <input
                type="text"
                value={seasonForm.title}
                onChange={(e) => setSeasonForm({ ...seasonForm, title: e.target.value })}
                placeholder="e.g. Entertainment District Arc"
                className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Season Description</label>
              <textarea
                rows={2}
                value={seasonForm.description}
                onChange={(e) => setSeasonForm({ ...seasonForm, description: e.target.value })}
                placeholder="Brief synopsis for this season..."
                className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Season Poster (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSeasonPosterFile(e.target.files[0])}
                className="w-full text-xs text-zinc-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setSeasonModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-black text-white bg-red-600 hover:bg-red-500 rounded-xl"
              >
                {isSubmitting ? 'Saving...' : editingSeason ? 'Update Season' : 'Add Season'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL: CREATE / EDIT EPISODE ================= */}
      {episodeModalOpen && (
        <Modal
          isOpen={episodeModalOpen}
          onClose={() => setEpisodeModalOpen(false)}
          title={editingEpisode ? `Edit Episode ${episodeForm.episodeNumber}` : `Add Episode to ${selectedSeason?.title}`}
          size="lg"
        >
          <form onSubmit={handleSaveEpisode} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Episode Number *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={episodeForm.episodeNumber}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, episodeNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-zinc-300 mb-1">Episode Title *</label>
                <input
                  type="text"
                  required
                  value={episodeForm.title}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, title: e.target.value })}
                  placeholder="e.g. The Sound Hashira Tengen Uzui"
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Duration (e.g. 24m)</label>
                <input
                  type="text"
                  value={episodeForm.duration}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, duration: e.target.value })}
                  placeholder="24m"
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="freePreviewCheck"
                  checked={episodeForm.freePreview}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, freePreview: e.target.checked })}
                  className="rounded border-zinc-800 text-red-600 focus:ring-red-500 w-4 h-4 bg-black/60"
                />
                <label htmlFor="freePreviewCheck" className="text-xs font-bold text-zinc-300 cursor-pointer">
                  Allow Free Preview without login
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Episode Description</label>
              <textarea
                rows={2}
                value={episodeForm.description}
                onChange={(e) => setEpisodeForm({ ...episodeForm, description: e.target.value })}
                placeholder="What happens in this episode..."
                className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Video Media Source */}
            <div className="p-3 bg-black/40 border border-zinc-800 rounded-xl space-y-2">
              <label className="block text-xs font-black text-red-400 uppercase tracking-wider">
                Video Stream Source *
              </label>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Direct Video URL (MP4, HLS, Cloudinary, etc.)</label>
                <input
                  type="text"
                  value={episodeForm.videoUrl}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, videoUrl: e.target.value })}
                  placeholder="https://commondatastorage.googleapis.com/... or cloud video"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div className="pt-2">
                <label className="block text-[11px] text-zinc-400 mb-1">Or Upload Video File to Cloudinary</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setEpisodeVideoFile(e.target.files[0])}
                  className="w-full text-xs text-zinc-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white"
                />
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Episode Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEpisodeThumbnailFile(e.target.files[0])}
                className="w-full text-xs text-zinc-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white"
              />
              <input
                type="text"
                placeholder="Or enter direct thumbnail image URL"
                value={episodeForm.thumbnail}
                onChange={(e) => setEpisodeForm({ ...episodeForm, thumbnail: e.target.value })}
                className="w-full mt-2 px-3 py-1.5 bg-black/60 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEpisodeModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-black text-white bg-red-600 hover:bg-red-500 rounded-xl"
              >
                {isSubmitting ? 'Saving...' : editingEpisode ? 'Update Episode' : 'Add Episode'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL: VIDEO PREVIEW ================= */}
      {previewVideoUrl && (
        <Modal
          isOpen={Boolean(previewVideoUrl)}
          onClose={() => setPreviewVideoUrl(null)}
          title="Video Playback Preview"
          size="lg"
        >
          <div className="w-full rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
            <video
              src={previewVideoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support video playback.
            </video>
          </div>
        </Modal>
      )}

      {/* ================= MODAL: CASCADE DELETE CONFIRMATION ================= */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, type: null, item: null })}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deleteModal.type === 'series' ? 'Series' : deleteModal.type === 'season' ? 'Season' : 'Episode'}`}
        message={
          deleteModal.type === 'series'
            ? `Are you sure you want to delete "${deleteModal.item?.title}"? This will permanently cascade delete all associated seasons, episodes, watch history, and uploaded media files.`
            : deleteModal.type === 'season'
              ? `Are you sure you want to delete "${deleteModal.item?.title || `Season ${deleteModal.item?.seasonNumber}`}"? All episodes under this season will also be permanently deleted.`
              : `Are you sure you want to delete Episode ${deleteModal.item?.episodeNumber}: "${deleteModal.item?.title}"?`
        }
        confirmText={isDeleting ? 'Deleting...' : 'Confirm Delete'}
        isDanger={true}
      />
    </div>
  );
}
