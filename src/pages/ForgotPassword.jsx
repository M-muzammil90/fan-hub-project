import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, Flame, ArrowRight, Loader2, CheckCircle2, KeyRound } from 'lucide-react';
import { authApi } from '../services/auth.api';
import animeBg from '../assets/auth_anime_bg.jpg';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authApi.forgotPassword(email.trim());
      if (res.success) {
        setSent(true);
      } else {
        setError(res.message || 'Could not send reset instructions.');
      }
    } catch (err) {
      setError(err.message || 'Could not reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] w-full -mt-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-8 py-6 flex flex-col overflow-hidden bg-[#070204]">
      <div className="absolute inset-0 pointer-events-none">
        <img src={animeBg} alt="" className="w-full h-full object-cover object-left opacity-35 filter saturate-125 contrast-125 hue-rotate-[-30deg]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080205]/95 via-[#120308]/90 to-[#070204]/95" />
      </div>

      <header className="relative z-20 flex items-center justify-between py-2 border-b border-white/10 mb-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-700 p-0.5">
            <div className="w-full h-full bg-[#0d0305] rounded-[10px] flex items-center justify-center">
              <Flame className="w-4 h-4 text-red-500 fill-red-500" />
            </div>
          </div>
          <span className="text-base font-black text-white font-display">FAN HUB</span>
        </Link>
        <Link to="/login" className="text-xs font-bold text-red-400 hover:text-white">
          Back to login
        </Link>
      </header>

      <main className="relative z-20 max-w-md w-full mx-auto my-auto pb-10">
        <div className="rounded-2xl p-6 sm:p-7 bg-[#0d0407]/95 border-2 border-red-500/70 shadow-[0_0_40px_rgba(239,68,68,0.35)]">
          <div className="text-center space-y-2 mb-5">
            <div className="inline-flex p-2.5 rounded-xl bg-red-500/20 border border-red-500/60">
              <KeyRound className="w-5 h-5 text-red-500" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-display">
              Forgot <span className="text-red-500">password</span>
            </h1>
            <p className="text-[11px] text-zinc-400">
              Enter your account email. If it exists, we will send a tokenized reset link that expires in 10 minutes.
            </p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  If an account with that email exists, password reset instructions have been sent. Check your inbox and spam folder.
                </span>
              </div>
              <Link
                to="/login"
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm flex items-center justify-center gap-2"
              >
                Return to sign in
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/60 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                  <Mail className="w-3.5 h-3.5 text-red-400" />
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#120509]/90 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 disabled:opacity-50 text-white font-black text-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  <>
                    Send reset link
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
