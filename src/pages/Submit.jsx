import React, { useState } from 'react';
import { Sparkles, Check, AlertCircle, Image as ImageIcon, Send, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Submit() {
  const { currentUser } = useAuth();
  const { categories, addFanSubmission } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Anime');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80'
  );
  const [content, setContent] = useState('');
  const [creator, setCreator] = useState(currentUser?.name || 'Anonymous Fan');
  const [errors, setErrors] = useState({});
  const [submittedItem, setSubmittedItem] = useState(null);

  const sampleImages = [
    { label: 'Illustration Art', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80' },
    { label: 'Cosplay Craft', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80' },
    { label: 'Sci-Fi Scene', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80' },
    { label: 'Retro Gaming', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80' }
  ];

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!description.trim() || description.length < 10) {
      errs.description = 'Description must be at least 10 characters';
    }
    if (!category) errs.category = 'Select a valid fandom category';
    if (!creator.trim()) errs.creator = 'Creator attribution is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const matchedCat = categories.find((c) => c.name.toLowerCase() === category.toLowerCase());

    const newSub = addFanSubmission({
      title,
      description,
      category,
      categorySlug: matchedCat?.slug || category.toLowerCase(),
      image,
      content,
      creator
    });

    setSubmittedItem(newSub);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setContent('');
    setSubmittedItem(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Creator Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
          Submit <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Fan Content</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-medium">
          Share your custom artwork, cosplay photoshoot, orchestral arrangements, or deep lore breakdown with the Fan Hub community.
        </p>
      </div>

      {submittedItem ? (
        <div className="p-8 rounded-3xl bg-[#0c101d] border border-emerald-500/30 shadow-2xl space-y-6 animate-in fade-in">
          <div className="flex items-center gap-3 text-emerald-400">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Submission Successfully Received!</h3>
              <p className="text-xs text-zinc-400">Your work has entered the moderation queue.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-blue-400 uppercase">{submittedItem.category}</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[10px] font-bold">
                Status: Pending Approval
              </span>
            </div>
            <h4 className="text-base font-bold text-white">{submittedItem.title}</h4>
            <p className="text-xs text-zinc-300">{submittedItem.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-[#121829] hover:bg-[#192238] border border-white/[0.08] text-xs font-bold text-zinc-200"
            >
              Submit Another Work
            </button>
            <Link
              to="/fan-creations"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white flex items-center gap-1.5"
            >
              <span>View Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-[#0c101d] border border-white/[0.08] shadow-2xl space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              Title of Creation *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Gear 5 Luffy Canvas Painting / Cyberpunk Neon V Cosplay"
              className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Creator / Artist Alias *
              </label>
              <input
                type="text"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
              />
              {errors.creator && <p className="text-xs text-rose-400 mt-1">{errors.creator}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              Brief Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the medium, inspiration, tools used, or lore references..."
              className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
            {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              Artwork Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
            />

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] text-zinc-400 self-center">Or select preset:</span>
              {sampleImages.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setImage(s.url)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                    image === s.url
                      ? 'bg-blue-600/30 text-blue-400 border-blue-500/50'
                      : 'bg-black/30 text-zinc-400 border-white/5 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Submit to Community Review</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
