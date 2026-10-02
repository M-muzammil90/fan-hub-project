import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, AlertCircle, Flame, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { authApi } from '../services/auth.api';
import animeBg from '../assets/auth_anime_bg.jpg';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('This reset link is missing a token. Request a new one.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authApi.resetPassword(token, password);
      if (res.success) {
        navigate('/login', {
          replace: true,
          state: { message: 'Password reset successful. Sign in with your new password.' }
        });
      } else {
        setError(res.message || 'Invalid or expired reset token.');
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired reset token.');
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
        <Link to="/forgot-password" className="text-xs font-bold text-red-400 hover:text-white">
          Request new link
        </Link>
      </header>

      <main className="relative z-20 max-w-md w-full mx-auto my-auto pb-10">
        <div className="rounded-2xl p-6 sm:p-7 bg-[#0d0407]/95 border-2 border-red-500/70 shadow-[0_0_40px_rgba(239,68,68,0.35)]">
          <div className="text-center space-y-2 mb-5">
            <div className="inline-flex p-2.5 rounded-xl bg-red-500/20 border border-red-500/60">
              <ShieldCheck className="w-5 h-5 text-red-500" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-display">
              Reset <span className="text-red-500">password</span>
            </h1>
            <p className="text-[11px] text-zinc-400">
              Choose a new password for your Fan Hub Plus account. This tokenized link is valid for 10 minutes.
            </p>
          </div>

          {!token ? (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/60 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Missing reset token. Open the link from your email, or request a new one.
              </div>
              <Link to="/forgot-password" className="block text-center py-2.5 rounded-xl bg-red-600 text-white font-black text-sm">
                Forgot password
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
                  <Lock className="w-3.5 h-3.5 text-red-400" />
                  New password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#120509]/90 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3 text-zinc-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                  <Lock className="w-3.5 h-3.5 text-red-400" />
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
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
                    Updating password...
                  </>
                ) : (
                  <>
                    Save new password
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
