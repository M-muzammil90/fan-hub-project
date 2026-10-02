import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Check,
  ArrowLeft,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { merchandiseApi } from '../services/merchandise.api';

export default function MerchandiseDetails() {
  const { id, slug } = useParams();
  const searchKey = id || slug;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotification, setAddedNotification] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        let fetchedItem = null;
        if (searchKey && searchKey.match(/^[0-9a-fA-F]{24}$/)) {
          const res = await merchandiseApi.getMerchandiseById(searchKey);
          fetchedItem = res.merchandise || res;
        } else {
          const res = await merchandiseApi.getMerchandise();
          const list = res.merchandise || res || [];
          fetchedItem = list.find((m) => m.slug === searchKey || m._id === searchKey) || list[0];
        }

        if (fetchedItem) {
          setItem(fetchedItem);
          const images = fetchedItem.imagesData?.map((img) => img.url) || fetchedItem.images || [fetchedItem.image];
          setActiveImage(images[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80');
        } else {
          setError('Merchandise product not found in database.');
        }
      } catch (err) {
        console.error('Error fetching merchandise details:', err);
        setError(err.message || 'Unable to connect to database.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchKey]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-red-950/20 border border-red-500/30 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <p className="text-xs text-zinc-300">{error || 'Product not found.'}</p>
        <Link to="/merchandise" className="inline-block px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold">
          Back to Store
        </Link>
      </div>
    );
  }

  const galleryImages = item.imagesData?.map((img) => img.url) || item.images || [item.image || activeImage];
  const displayTitle = item.name || item.title;
  const categoryName = typeof item.category === 'object' ? item.category?.name : item.category || 'Gear';
  const displayPrice = typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : (item.price || '$49.99');

  const handleAddToCart = () => {
    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 3000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
        <Link to="/" className="hover:text-white">Home</Link>
        <span>&gt;</span>
        <Link to="/merchandise" className="hover:text-white">Merchandise</Link>
        <span>&gt;</span>
        <span className="text-zinc-500">{categoryName}</span>
        <span>&gt;</span>
        <span className="text-white truncate">{displayTitle}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Gallery Column */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                  activeImage === img
                    ? 'border-red-500 ring-2 ring-red-500/20'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl">
            <img
              src={activeImage}
              alt={displayTitle}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-bold border border-red-500/30 uppercase">
              {categoryName}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-display leading-tight">
              {displayTitle}
            </h1>
            <p className="text-2xl font-mono font-black text-red-500">{displayPrice}</p>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
            {item.description || 'Authentic database-driven merchandise item.'}
          </p>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-xl bg-black/60 border border-white/15 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-lg"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-white font-mono">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-xl shadow-red-600/40 flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>

            {addedNotification && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Added to cart successfully!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
