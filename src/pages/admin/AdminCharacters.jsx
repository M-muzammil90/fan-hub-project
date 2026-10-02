import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Edit, Trash2, Search, RefreshCw, AlertCircle, Image as ImageIcon, UserX } from 'lucide-react';
import { adminApi } from '../../services/admin.api';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminCharacters() {
  const [characters, setCharacters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [bio, setBio] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [charRes, catRes] = await Promise.all([
        adminApi.getCharacters(),
        adminApi.getCategories()
      ]);

      if (charRes.success) {
        setCharacters(charRes.characters || []);
      }
      if (catRes.success) {
        setCategories(catRes.categories || []);
        if (catRes.categories?.length > 0 && !categoryId) {
          setCategoryId(catRes.categories[0]._id || catRes.categories[0].id);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch characters from server');
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
    setBio('');
    if (categories.length > 0) {
      setCategoryId(categories[0]._id || categories[0].id);
    }
    setTags('protagonist, warrior');
    setImage('');
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setName(item.name || '');
    setSlug(item.slug || '');
    setBio(item.bio || '');
    setCategoryId(item.category?._id || item.category || '');
    setTags(Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '');
    setImage(item.image || '');
    setImageFile(null);
    setImagePreview(item.image || '');
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
      formData.append('slug', slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      formData.append('bio', bio);
      formData.append('category', categoryId);
      formData.append('tags', tags);

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (image) {
        formData.append('image', image);
      }

      let res;
      if (editingItem) {
        const cId = editingItem._id || editingItem.id;
        res = await adminApi.updateCharacter(cId, formData);
      } else {
        res = await adminApi.createCharacter(formData);
      }

      if (res.success) {
        fetchData();
        setIsModalOpen(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to save character profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedCharacter) return;
    const cId = selectedCharacter._id || selectedCharacter.id;
    setIsDeleting(true);
    try {
      await adminApi.deleteCharacter(cId);
      setCharacters((prev) => prev.filter((c) => (c._id || c.id) !== cId));
      setDeleteModalOpen(false);
      setSelectedCharacter(null);
    } catch (err) {
      alert(err.message || 'Failed to delete character profile');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCharacters = characters.filter((c) => {
    const catName = c.category?.name || c.category || '';
    const matchesSearch =
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      catName.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesCat = selectedCategory === 'all' || (c.category?._id || c.category) === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight font-display">
            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">Lore Characters</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Maintain character profiles, Cloudinary portraits, category associations, and tags.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl transition-all shadow-lg shadow-red-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Character</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-zinc-950 border border-white/10 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search characters by name..."
            className="w-full pl-10 pr-4 py-2 bg-black border border-white/10 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>

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
          <RefreshCw className="w-8 h-8 text-red-400 animate-spin mx-auto" />
          <p className="text-xs font-bold text-zinc-400">Loading characters from server...</p>
        </div>
      ) : filteredCharacters.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-950 border border-white/5 space-y-3">
          <UserX className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="text-sm font-bold text-zinc-400">No characters found</p>
          <p className="text-xs text-zinc-600">Click "Add Character" above to register a new character codex entry.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-zinc-950 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/60 border-b border-white/10 text-zinc-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-4 px-5">Character Portrait & Name</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Bio Overview</th>
                <th className="py-4 px-4">Tags</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {filteredCharacters.map((char) => {
                const cId = char._id || char.id;
                return (
                  <tr key={cId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      {char.image ? (
                        <img
                          src={char.image}
                          alt={char.name}
                          className="w-10 h-10 rounded-xl object-cover bg-zinc-950 border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-red-400 flex items-center justify-center font-bold border border-red-500/30 shrink-0">
                          {char.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-white block">{char.name}</span>
                        <span className="text-[10px] text-red-400 font-mono">{char.slug}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-red-400">
                      {char.category?.name || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-zinc-400">
                      {char.bio || 'No biography details'}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {Array.isArray(char.tags) ? char.tags.join(', ') : char.tags || 'None'}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(char)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Edit character profile"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCharacter(char);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete character profile"
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
        title={editingItem ? 'Edit Character Codex Profile' : 'Add New Character Codex'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Character Name *
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
              placeholder="e.g. Eren Yeager"
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
                placeholder="eren-yeager"
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Biography & Lore Summary
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Detailed character lore and backstory..."
              className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="scout-regiment, titan-shifter"
              className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Cloudinary Image Upload or URL */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              Character Portrait (Cloudinary Upload or URL)
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
                  className="block w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-500/20 file:text-red-300 hover:file:bg-red-500/30 cursor-pointer"
                />
                <input
                  type="text"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    if (!imageFile) setImagePreview(e.target.value);
                  }}
                  placeholder="Or paste portrait image URL (https://...)"
                  className="w-full px-3 py-1.5 bg-black border border-white/10 rounded-xl text-xs font-mono text-zinc-300 focus:outline-none focus:border-red-500"
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
              className="px-5 py-2 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>{isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Character'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Character Codex?"
        message={`Are you sure you want to delete character "${selectedCharacter?.name}"? Associated image on Cloudinary will also be deleted.`}
        confirmText="Delete Character"
        isLoading={isDeleting}
      />
    </div>
  );
}
