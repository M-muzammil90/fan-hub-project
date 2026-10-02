import React, { useState, useEffect } from 'react';
import {
  Film,
  Plus,
  Edit,
  Trash2,
  Sparkles,
  Search,
  RefreshCw,
  AlertCircle,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Sliders,
  CheckCircle2,
  Tv
} from 'lucide-react';
import { adminApi } from '../../services/admin.api';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminContent() {
  const [contentList, setContentList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [contentType, setContentType] = useState('video');
  const [genre, setGenre] = useState('Action, Sci-Fi');
  const [tags, setTags] = useState('anime, premiere');
  const [popularityScore, setPopularityScore] = useState(85);
  const [isFeatured, setIsFeatured] = useState(false);

  // Media files & previews
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaUrl, setMediaUrl] = useState('');

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [contentRes, catRes] = await Promise.all([
        adminApi.getContent(),
        adminApi.getCategories()
      ]);

      if (contentRes.success) {
        setContentList(contentRes.content || []);
      }
      if (catRes.success) {
        setCategories(catRes.categories || []);
        if (catRes.categories?.length > 0 && !categoryId) {
          setCategoryId(catRes.categories[0]._id || catRes.categories[0].id);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch catalog content from backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = (forSlider = false) => {
    setEditingItem(null);
    setTitle('');
    setSlug('');
    setDescription('');
    if (categories.length > 0) {
      setCategoryId(categories[0]._id || categories[0].id);
    }
    setContentType('video');
    setGenre(forSlider ? 'Action • Fantasy' : 'Action, Fantasy');
    setTags('hero-slider, premiere');
    setPopularityScore(95);
    setIsFeatured(forSlider);
    setThumbnailFile(null);
    setThumbnailUrl('');
    setMediaFile(null);
    setMediaUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setTitle(item.title || '');
    setSlug(item.slug || '');
    setDescription(item.description || '');
    setCategoryId(item.category?._id || item.category || '');
    setContentType(item.contentType || 'video');
    setGenre(Array.isArray(item.genre) ? item.genre.join(', ') : item.genre || '');
    setTags(Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '');
    setPopularityScore(item.popularityScore ?? 75);
    setIsFeatured(!!item.isFeatured);
    setThumbnailFile(null);
    setThumbnailUrl(item.thumbnail || '');
    setMediaFile(null);
    setMediaUrl(item.mediaUrl || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      formData.append('description', description);
      formData.append('category', categoryId);
      formData.append('contentType', contentType);
      formData.append('genre', genre);
      formData.append('tags', tags);
      formData.append('popularityScore', popularityScore);
      formData.append('isFeatured', isFeatured);

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      } else if (thumbnailUrl) {
        formData.append('thumbnail', thumbnailUrl);
      }

      if (mediaFile) {
        formData.append('media', mediaFile);
      } else if (mediaUrl) {
        formData.append('mediaUrl', mediaUrl);
      }

      let res;
      if (editingItem) {
        const cId = editingItem._id || editingItem.id;
        res = await adminApi.updateContent(cId, formData);
      } else {
        res = await adminApi.createContent(formData);
      }

      if (res.success) {
        fetchData();
        setIsModalOpen(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to save content entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFeatured = async (item) => {
    const cId = item._id || item.id;
    try {
      const res = await adminApi.updateContent(cId, { isFeatured: !item.isFeatured });
      if (res.success) {
        setContentList((prev) =>
          prev.map((c) => ((c._id || c.id) === cId ? { ...c, isFeatured: !item.isFeatured } : c))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to update featured status');
    }
  };

  const confirmDelete = async () => {
    if (!selectedContent) return;
    const cId = selectedContent._id || selectedContent.id;
    setIsDeleting(true);
    try {
      await adminApi.deleteContent(cId);
      setContentList((prev) => prev.filter((c) => (c._id || c.id) !== cId));
      setDeleteModalOpen(false);
      setSelectedContent(null);
    } catch (err) {
      alert(err.message || 'Failed to delete content entry');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredContent = contentList.filter((c) => {
    const catName = c.category?.name || c.category || '';
    const matchesSearch =
      (c.title || '').toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      catName.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesCat = selectedCategory === 'all' || (c.category?._id || c.category) === selectedCategory;
    const matchesType = selectedType === 'all' || c.contentType === selectedType;
    const matchesFeatured = !filterFeaturedOnly || !!c.isFeatured;
    return matchesSearch && matchesCat && matchesType && matchesFeatured;
  });

  const featuredCount = contentList.filter((c) => c.isFeatured).length;

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#17060b] to-[#090306] border border-red-500/30 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/40 text-[10px] font-black uppercase tracking-wider mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Catalog & Hero Slider Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Manage <span className="text-[#ff1738]">Movies & Content</span>
          </h1>
          <p className="text-xs text-zinc-400 font-medium">
            Publish movies, add items directly to Homepage Hero Slider, and stream trailers with Cloudinary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleOpenAdd(true)}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 rounded-xl transition-all shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ Add to Hero Slider</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAdd(false)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-zinc-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Media</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-zinc-950 border border-white/10 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by movie title or category..."
            className="w-full pl-10 pr-4 py-2 bg-black border border-white/10 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <button
          type="button"
          onClick={() => setFilterFeaturedOnly(!filterFeaturedOnly)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            filterFeaturedOnly
              ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
              : 'bg-black text-zinc-300 hover:text-white border border-white/10 hover:border-red-500/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hero Slider Only ({featuredCount})</span>
        </button>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-red-500 cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="video">Videos</option>
          <option value="trailer">Trailers</option>
          <option value="article">Articles</option>
          <option value="audio">Audio</option>
          <option value="image">Image Galleries</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-red-500 cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c._id || c.id} value={c._id || c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchData} className="underline hover:text-white">Retry</button>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-950 border border-white/5 space-y-3">
          <RefreshCw className="w-8 h-8 text-red-400 animate-spin mx-auto" />
          <p className="text-xs font-bold text-zinc-400">Loading catalog items from server...</p>
        </div>
      ) : filteredContent.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-950 border border-white/5 space-y-3">
          <Film className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="text-sm font-bold text-zinc-400">No content entries found</p>
          <p className="text-xs text-zinc-600">Click "+ Add to Hero Slider" above to add your first movie or show to the homepage slider.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-zinc-950 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/60 border-b border-white/10 text-zinc-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-4 px-5">Media Title & Slug</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Content Type</th>
                <th className="py-4 px-4">Popularity</th>
                <th className="py-4 px-4">Homepage Hero Slider</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {filteredContent.map((item) => {
                const cId = item._id || item.id;
                return (
                  <tr key={cId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-12 h-8 rounded-lg object-cover bg-zinc-950 border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 shrink-0">
                          <Film className="w-4 h-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate max-w-xs">{item.title}</span>
                        <span className="text-[10px] text-zinc-500 truncate block font-mono">{item.slug}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-red-400">
                      {item.category?.name || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4 uppercase font-mono text-[11px] text-zinc-400">
                      {item.contentType}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {item.popularityScore || 0}%
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(item)}
                        className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                          item.isFeatured
                            ? 'bg-red-600 text-white shadow-md shadow-red-600/40 hover:bg-red-500'
                            : 'bg-black text-zinc-400 hover:text-white border border-white/10 hover:border-red-500/30'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{item.isFeatured ? 'In Hero Slider' : 'Add To Slider'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          title="Edit content entry"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedContent(item);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete content entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Movie / Media Content' : 'Add Movie / Hero Slider Slide'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Movie / Show Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!editingItem) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }
              }}
              placeholder="e.g. Cyberpunk Neon City"
              className="w-full px-3.5 py-2 bg-black border border-white/10 rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-red-500"
              >
                {categories.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Content Type *
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-red-500"
              >
                <option value="video">Movie / Video</option>
                <option value="trailer">Trailer</option>
                <option value="article">Article</option>
                <option value="audio">Audio OST</option>
                <option value="image">Image Gallery</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Subtitle / Genres (e.g. Action • Fantasy)
            </label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Action • Fantasy"
              className="w-full px-3.5 py-2 bg-black border border-white/10 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Description / Synopsis *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Movie synopsis or description for the slider..."
              className="w-full px-3.5 py-2 bg-black border border-white/10 rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Thumbnail / Backdrop Image */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              Backdrop / Slider Banner Image (File Upload or Image URL)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files[0] || null)}
              className="block w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-500/20 file:text-red-300 hover:file:bg-red-500/30 cursor-pointer"
            />
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="Or paste direct image URL (https://...)"
              className="w-full px-3.5 py-1.5 bg-black border border-white/10 rounded-xl text-xs font-mono text-zinc-300 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Video Stream URL */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              Watch Now Video / Trailer Stream (MP4 Video Upload or URL)
            </label>
            <input
              type="file"
              onChange={(e) => setMediaFile(e.target.files[0] || null)}
              className="block w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-500/20 file:text-red-300 hover:file:bg-red-500/30 cursor-pointer"
            />
            <input
              type="text"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Or paste direct video MP4 / stream URL (https://...)"
              className="w-full px-3.5 py-1.5 bg-black border border-white/10 rounded-xl text-xs font-mono text-zinc-300 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Checkbox for Pinning to Hero Slider */}
          <div className="p-3.5 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-center gap-3">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-xs text-zinc-200 font-bold cursor-pointer">
              Pin & Display this Movie inside the Homepage Hero Slider
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-white bg-white/5 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-xs font-black bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>{isSubmitting ? 'Uploading & Saving...' : editingItem ? 'Save Changes' : 'Publish Movie'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Content Entry?"
        message={`Are you sure you want to delete "${selectedContent?.title}"?`}
        confirmText="Delete Entry"
        isLoading={isDeleting}
      />
    </div>
  );
}
