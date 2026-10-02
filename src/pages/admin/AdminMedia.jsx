import React, { useState } from 'react';
import { adminApi } from '../../services/admin.api';
import { UploadCloud, Trash2, Copy, Check, FileText, Image as ImageIcon, Video, Music, AlertCircle } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminMedia() {
  const [folder, setFolder] = useState('fan-hub-plus/general');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedAssets, setUploadedAssets] = useState([]);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      let res;
      if (files.length === 1) {
        res = await adminApi.uploadMedia(files[0], folder);
        if (res.success) {
          setUploadedAssets((prev) => [res.data, ...prev]);
        }
      } else {
        res = await adminApi.uploadMultipleMedia(files, folder);
        if (res.success && res.data) {
          setUploadedAssets((prev) => [...res.data, ...prev]);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to upload file to Cloudinary');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmDelete = async () => {
    if (!selectedAsset) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteMedia(selectedAsset.publicId, selectedAsset.resourceType || 'image');
      setUploadedAssets((prev) => prev.filter((a) => a.publicId !== selectedAsset.publicId));
      setDeleteModalOpen(false);
      setSelectedAsset(null);
    } catch (err) {
      setError(err.message || 'Failed to delete asset from Cloudinary');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderFileIcon = (resourceType, format) => {
    if (resourceType === 'image' || ['jpg', 'png', 'webp', 'gif', 'svg'].includes(format)) {
      return <ImageIcon className="w-5 h-5 text-red-400" />;
    }
    if (resourceType === 'video' || ['mp4', 'webm', 'mov'].includes(format)) {
      return <Video className="w-5 h-5 text-red-400" />;
    }
    if (['mp3', 'wav', 'ogg'].includes(format)) {
      return <Music className="w-5 h-5 text-emerald-400" />;
    }
    return <FileText className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight font-display">
            Cloudinary <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">Media Library</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Upload, inspect, copy direct URLs, and manage Cloudinary media assets across all verticals.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">Upload New Media Asset</h2>
            <p className="text-xs text-zinc-400">Supports Images, Videos, Audio, PDFs, and Documents (Max 100MB)</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs font-semibold text-zinc-400">Target Folder:</label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="px-3 py-2 bg-black border border-white/10 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-red-500"
            >
              <option value="fan-hub-plus/general">fan-hub-plus/general</option>
              <option value="fan-hub-plus/categories">fan-hub-plus/categories</option>
              <option value="fan-hub-plus/content/thumbnails">fan-hub-plus/content/thumbnails</option>
              <option value="fan-hub-plus/content/media">fan-hub-plus/content/media</option>
              <option value="fan-hub-plus/characters">fan-hub-plus/characters</option>
              <option value="fan-hub-plus/events">fan-hub-plus/events</option>
              <option value="fan-hub-plus/merchandise">fan-hub-plus/merchandise</option>
              <option value="fan-hub-plus/fan-submissions">fan-hub-plus/fan-submissions</option>
            </select>
          </div>
        </div>

        <div className="relative border-2 border-dashed border-white/10 hover:border-red-500/50 rounded-2xl p-8 text-center transition-all bg-black/40 group">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-4 rounded-2xl bg-blue-500/10 text-red-400 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {isUploading ? 'Uploading to Cloudinary...' : 'Click or Drag & Drop files here'}
              </p>
              <p className="text-xs text-zinc-500 mt-1 font-mono">
                Memory buffer stream directly to Cloudinary storage
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight font-display">
          Session Uploaded Media ({uploadedAssets.length})
        </h2>

        {uploadedAssets.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-zinc-950 border border-white/5 space-y-3">
            <ImageIcon className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-sm font-bold text-zinc-400">No media uploaded in this session yet</p>
            <p className="text-xs text-zinc-600">Upload assets using the box above to inspect URL and Cloudinary Public ID.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedAssets.map((asset) => (
              <div
                key={asset.publicId}
                className="p-4 rounded-2xl bg-zinc-950 border border-white/10 space-y-3 flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl bg-zinc-950 overflow-hidden border border-white/5 flex items-center justify-center">
                    {asset.resourceType === 'image' || asset.format === 'jpg' || asset.format === 'png' || asset.format === 'webp' ? (
                      <img src={asset.url} alt={asset.originalName} className="w-full h-full object-cover" />
                    ) : asset.resourceType === 'video' ? (
                      <video src={asset.url} controls className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        {renderFileIcon(asset.resourceType, asset.format)}
                        <span className="text-xs font-mono font-semibold text-zinc-400 uppercase">{asset.format || 'file'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-white truncate">{asset.originalName || asset.publicId}</p>
                    <p className="text-[10px] font-mono text-zinc-500 truncate">ID: {asset.publicId}</p>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      {asset.bytes ? `${(asset.bytes / 1024).toFixed(1)} KB` : ''} • {asset.resourceType || 'auto'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => handleCopyUrl(asset.url, asset.publicId)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedId === asset.publicId ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedAsset(asset);
                      setDeleteModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Delete asset from Cloudinary"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Cloudinary Asset?"
        message={`Are you sure you want to delete asset "${selectedAsset?.publicId}" permanently from Cloudinary?`}
        confirmText="Delete Asset"
        isLoading={isDeleting}
      />
    </div>
  );
}
