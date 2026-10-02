import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Edit, Trash2, Search, RefreshCw, AlertCircle, Image as ImageIcon, PackageX } from 'lucide-react';
import { adminApi } from '../../services/admin.api';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminMerchandise() {
  const [merchandise, setMerchandise] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUpcomingFilter, setIsUpcomingFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tag, setTag] = useState('Figurine, Limited Edition');
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [releaseDate, setReleaseDate] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState('');

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMerch, setSelectedMerch] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [merchRes, catRes] = await Promise.all([
        adminApi.getMerchandise(),
        adminApi.getCategories()
      ]);

      if (merchRes.success) {
        setMerchandise(merchRes.merchandise || []);
      }
      if (catRes.success) {
        setCategories(catRes.categories || []);
        if (catRes.categories?.length > 0 && !categoryId) {
          setCategoryId(catRes.categories[0]._id || catRes.categories[0].id);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch merchandise items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setSlug('');
    setDescription('');
    if (categories.length > 0) {
      setCategoryId(categories[0]._id || categories[0].id);
    }
    setTag('Figurine, Limited Edition');
    setIsUpcoming(false);
    setReleaseDate('');
    setImageFiles([]);
    setImageUrls('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setName(item.name || '');
    setSlug(item.slug || '');
    setDescription(item.description || '');
    setCategoryId(item.category?._id || item.category || '');
    setTag(Array.isArray(item.tag) ? item.tag.join(', ') : item.tag || '');
    setIsUpcoming(!!item.isUpcoming);
    setReleaseDate(item.releaseDate ? new Date(item.releaseDate).toISOString().split('T')[0] : '');
    setImageFiles([]);
    setImageUrls(Array.isArray(item.images) ? item.images.join(', ') : item.images || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      formData.append('description', description);
      formData.append('category', categoryId);
      formData.append('tag', tag);
      formData.append('isUpcoming', isUpcoming);
      if (releaseDate) formData.append('releaseDate', releaseDate);

      if (imageFiles.length > 0) {
        Array.from(imageFiles).forEach((f) => formData.append('images', f));
      } else if (imageUrls) {
        const urlArray = imageUrls.split(',').map((u) => u.trim()).filter(Boolean);
        formData.append('images', JSON.stringify(urlArray));
      }

      let res;
      if (editingItem) {
        const mId = editingItem._id || editingItem.id;
        res = await adminApi.updateMerchandise(mId, formData);
      } else {
        res = await adminApi.createMerchandise(formData);
      }

      if (res.success) {
        fetchData();
        setIsModalOpen(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to save merchandise entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedMerch) return;
    const mId = selectedMerch._id || selectedMerch.id;
    setIsDeleting(true);
    try {
      await adminApi.deleteMerchandise(mId);
      setMerchandise((prev) => prev.filter((m) => (m._id || m.id) !== mId));
      setDeleteModalOpen(false);
      setSelectedMerch(null);
    } catch (err) {
      alert(err.message || 'Failed to delete merchandise item');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredMerchandise = merchandise.filter((m) => {
    const catName = m.category?.name || m.category || '';
    const matchesSearch =
      (m.name || '').toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      catName.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesCat = selectedCategory === 'all' || (m.category?._id || m.category) === selectedCategory;
    const matchesUpcoming =
      isUpcomingFilter === 'all' ||
      (isUpcomingFilter === 'upcoming' && m.isUpcoming) ||
      (isUpcomingFilter === 'available' && !m.isUpcoming);
    return matchesSearch && matchesCat && matchesUpcoming;
  });

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight font-display">
            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">Merchandise Showcase</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Showcase official figurines, props, apparel, Cloudinary image galleries, and pre-orders.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl transition-all shadow-lg shadow-red-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Merchandise Item</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-zinc-950 border border-white/10 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search merchandise by name..."
            className="w-full pl-10 pr-4 py-2 bg-black border border-white/10 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <select
          value={isUpcomingFilter}
          onChange={(e) => setIsUpcomingFilter(e.target.value)}
          className="px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-red-500"
        >
          <option value="all">All Drops</option>
          <option value="available">Available Now</option>
          <option value="upcoming">Upcoming Pre-orders</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-red-500"
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
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs font-bold text-zinc-400">Loading merchandise items from server...</p>
        </div>
      ) : filteredMerchandise.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-950 border border-white/5 space-y-3">
          <PackageX className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="text-sm font-bold text-zinc-400">No merchandise items found</p>
          <p className="text-xs text-zinc-600">Click "Add Merchandise Item" above to create your first product showcase entry.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-zinc-950 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/60 border-b border-white/10 text-zinc-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-4 px-5">Item Preview & Name</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Tags</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Views</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {filteredMerchandise.map((item) => {
                const mId = item._id || item.id;
                const heroImg = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '';
                return (
                  <tr key={mId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      {heroImg ? (
                        <img
                          src={heroImg}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover bg-zinc-950 border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30 shrink-0">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-white block">{item.name}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{item.slug}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-400">
                      {item.category?.name || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {Array.isArray(item.tag) ? item.tag.join(', ') : item.tag || 'None'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase ${
                          item.isUpcoming
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {item.isUpcoming ? 'Upcoming Drop' : 'Available'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-zinc-400">
                      {item.viewCount || 0}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Edit merchandise"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMerch(item);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete merchandise"
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
        title={editingItem ? 'Edit Merchandise Showcase' : 'Add Merchandise Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Merchandise Item Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingItem) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }
              }}
              placeholder="e.g. Eren Yeager 1/7 Scale Figurine"
              className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-red-500"
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
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="eren-yeager-figurine"
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product details, material, dimensions..."
              className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Figurine, Scale Model"
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Release Date
              </label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs font-mono text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Cloudinary Multiple Image Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              Product Images (Cloudinary Files Upload or URLs)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImageFiles(e.target.files)}
              className="block w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/20 file:text-emerald-300 hover:file:bg-emerald-500/30 cursor-pointer"
            />
            <input
              type="text"
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              placeholder="Or paste comma-separated image URLs (https://...)"
              className="w-full px-3 py-1.5 bg-black border border-white/10 rounded-xl text-xs font-mono text-zinc-300 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isUpcoming"
              checked={isUpcoming}
              onChange={(e) => setIsUpcoming(e.target.checked)}
              className="accent-emerald-600 rounded"
            />
            <label htmlFor="isUpcoming" className="text-xs text-zinc-300 cursor-pointer">
              Mark as Upcoming Pre-order Drop
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-white bg-white/5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>{isSubmitting ? 'Uploading & Saving...' : editingItem ? 'Save Changes' : 'Create Merchandise'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Merchandise Item?"
        message={`Are you sure you want to delete merchandise "${selectedMerch?.name}"? All Cloudinary images associated with this product will also be deleted.`}
        confirmText="Delete Item"
        isLoading={isDeleting}
      />
    </div>
  );
}
