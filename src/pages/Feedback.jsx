import React, { useState } from 'react';
import { Check, Send, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { feedbackApi } from '../services/ratings.api';

const TYPES = [
  { id: 'suggestion', label: 'Suggestion' },
  { id: 'bug', label: 'Bug' },
  { id: 'query', label: 'Question' }
];

export default function Feedback() {
  const { isAuthenticated } = useAuth();
  const [type, setType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || message.length < 10) {
      setError('Message must be at least 10 characters.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await feedbackApi.submit({ type, message: message.trim() });
      setIsSubmitted(true);
      setMessage('');
    } catch (err) {
      setError(err.message || 'Could not send feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20 pt-4">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/40 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          Community Voice
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-display">
          Send <span className="text-red-500">Feedback</span>
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Your message is saved to the Fan Hub Plus database and reviewed by admins.
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-8 rounded-3xl bg-[#0a0204] border border-emerald-500/30 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Saved to the database</h3>
          <p className="text-sm text-zinc-400">Thank you. Our team will review your message.</p>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="px-6 py-2.5 text-sm font-bold text-white border border-red-500/50 rounded-full hover:bg-red-950/50"
          >
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-[#0a0204] border border-white/10 space-y-6">
          {!isAuthenticated && (
            <p className="text-xs text-zinc-500">You can submit as a guest. Sign in to attach your account.</p>
          )}
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  type === t.id ? 'bg-red-600 text-white' : 'bg-white/5 text-zinc-400 border border-white/10'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <textarea
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            className="w-full px-5 py-4 bg-[#150508] border border-red-500/30 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 resize-none"
          />
          {error && (
            <p className="text-xs text-red-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Submit to database
          </button>
        </form>
      )}
    </div>
  );
}
