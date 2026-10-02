import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Trash2, RefreshCw, AlertCircle, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { adminApi } from '../../services/admin.api';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getCategories();
      if (res.success) {
        setCategories(res.categories || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingItem(cat);
    setName(cat.name || '');
    setSlug(cat.slug || '');
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setImageFile(null);
    setImagePreview(cat.image || '');
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug.trim() || name.toLowerCase().replace(/\s+/g, '-'));
      formData.append('description', description);

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (image) {
        formData.append('image', image);
      }

      let res;
      if (editingItem) {
        const catId = editingItem._id || editingItem.id;
        res = await adminApi.updateCategory(catId, formData);
      } else {
        res = await adminApi.createCategory(formData);
      }

      if (res.success) {
        fetchCategories();
        setIsModalOpen(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    const catId = selectedCategory._id || selectedCategory.id;
    setIsDeleting(true);
    try {
      await adminApi.deleteCategory(catId);
      setCategories((prev) => prev.filter((c) => (c._id || c.id) !== catId));
      setDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (err) {
      alert(err.message || 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight font-display">
            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">Fandom Categories</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Create, edit, and organize core categories, Cloudinary hero artwork, and URL slugs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl transition-all shadow-lg shadow-rose-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchCategories} className="underline hover:text-white">Retry</button>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-950 border border-white/5 space-y-3">
          <RefreshCw className="w-8 h-8 text-rose-400 animate-spin mx-auto" />
          <p className="text-xs font-bold text-zinc-400">Loading categories from server...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-950 border border-white/5 space-y-3">
          <Layers className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="text-sm font-bold text-zinc-400">No categories found in backend</p>
          <p className="text-xs text-zinc-600">Click "Add New Category" above to create your first fandom vertical.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-zinc-950 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/60 border-b border-white/10 text-zinc-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-4 px-5">Category Image & Name</th>
                <th className="py-4 px-4">URL Slug</th>
                <th className="py-4 px-4">Description</th>
                <th className="py-4 px-4">Created Date</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {categories.map((c) => {
                const cId = c._id || c.id;
                return (
                  <tr key={cId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-10 h-10 rounded-xl object-cover bg-zinc-950 border border-white/10"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-red-400 flex items-center justify-center font-bold border border-red-500/30">
                          {c.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-white block">{c.name}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">ID: {cId}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-red-400 font-semibold">{c.slug}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-zinc-400">{c.description || 'No description'}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(c)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Edit category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory(c);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete category"
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

      {/* Modal for Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Fandom Category' : 'Create New Fandom Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingItem) {
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                }
              }}
              placeholder="e.g. Anime & Manga"
              className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
            />
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
              placeholder="e.g. anime-manga"
              className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of this fandom category..."
              className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Cloudinary Image Upload or Direct URL */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              Category Image (Cloudinary Upload or URL)
            </label>
            <div className="flex items-center gap-3">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-xl object-cover bg-zinc-950 border border-white/10" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-500/20 file:text-rose-300 hover:file:bg-rose-500/30 cursor-pointer"
                />
                <input
                  type="text"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    if (!imageFile) setImagePreview(e.target.value);
                  }}
                  placeholder="Or paste image URL (https://...)"
                  className="w-full px-3 py-1.5 bg-black border border-white/10 rounded-xl text-xs font-mono text-zinc-300 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
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
              className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>{isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Category?"
        message={`Are you sure you want to delete category "${selectedCategory?.name}"? All content mapped under this category may be affected.`}
        confirmText="Delete Category"
        isLoading={isDeleting}
      />
    </div>
  );
}
