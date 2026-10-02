import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  UserPlus,
  LogIn,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Flame,
  ArrowRight,
  AlertCircle,
  Users,
  Star,
  Zap,
  Crown,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { redirectAfterAuth } from '../utils/authRedirect';
import animeBg from '../assets/auth_anime_bg.jpg';

export default function AuthModal({ isOpen, onClose, initialMode = 'register' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMode(initialMode);
    setErrors({});
    setServerError('');
  }, [initialMode, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset state when switching modes
  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (mode === 'register' && !name.trim()) {
      errs.name = 'Full name is required';
    }
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (mode === 'register' && password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          onClose();
          redirectAfterAuth(navigate, res.user);
        } else {
          setServerError(res.error || 'Invalid email or password');
        }
      } else {
        const res = await register({ name, email, password });
        if (res.success) {
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          onClose();
          redirectAfterAuth(navigate, res.user);
        } else {
          setServerError(res.error || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Users,
      title: 'Connect',
      desc: 'Meet fellow anime & gaming fans'
    },
    {
      icon: Star,
      title: 'Explore',
      desc: 'Latest releases, news & archives'
    },
    {
      icon: Zap,
      title: 'Create',
      desc: 'Share fan arts, stories & lore'
    },
    {
      icon: Crown,
      title: 'Be Part',
      desc: 'Join tournaments & VIP events'
    }
  ];

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
      {/* Dark Ambient Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Main Container */}
      <div
        className="relative z-10 w-full max-w-4xl max-h-[95vh] overflow-y-auto sm:overflow-visible grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-stretch animate-in fade-in zoom-in-95 duration-200 text-white my-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Anime Art Card with Community Points */}
        <div className="md:col-span-5 relative hidden md:flex flex-col justify-between rounded-3xl overflow-hidden p-5 sm:p-6 border border-white/10 bg-[#080205] shadow-[0_0_35px_rgba(220,38,38,0.25)]">
          {/* Background Anime Character Image with Red/Crimson Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={animeBg}
              alt="Anime Community"
              className="w-full h-full object-cover object-top filter saturate-125 contrast-110 hue-rotate-[-30deg]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080205] via-[#120308]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080205]/95 via-[#080205]/60 to-transparent" />
          </div>

          {/* Top Heading: White & Red Style */}
          <div className="relative z-10 space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight italic drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
              Join Our <br />
              Amazing <br />
              Community
            </h2>
            <div className="w-12 h-1 rounded-full bg-gradient-to-r from-red-500 to-transparent shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          </div>

          {/* 4 Feature Items */}
          <div className="relative z-10 space-y-2.5 pt-6">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full border border-red-500/70 bg-red-950/60 text-red-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.35)] group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-xs font-black text-white group-hover:text-red-300 transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-zinc-300 leading-tight truncate">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Red Neon Border Glowing Card */}
        <div className="md:col-span-7 relative">
          <div className="relative rounded-3xl p-5 sm:p-6 bg-[#0b0407]/95 backdrop-blur-2xl border-2 border-red-500/80 shadow-[0_0_45px_rgba(239,68,68,0.35),0_0_90px_rgba(0,0,0,0.8)]">
            
            {/* Floating Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-30 p-1.5 rounded-full bg-white/[0.08] hover:bg-red-600 text-zinc-400 hover:text-white border border-white/10 transition-all hover:scale-110"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Avatar Box */}
            <div className="text-center space-y-1.5 mb-3.5">
              <div className="inline-flex p-2 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                <Flame className="w-5 h-5 text-red-500 fill-red-500" />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
                  {mode === 'register' ? (
                    <>
                      Create Your <span className="text-red-500">Account</span>
                    </>
                  ) : (
                    <>
                      Welcome <span className="text-red-500">Back</span>
                    </>
                  )}
                </h1>
                <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
                  {mode === 'register'
                    ? 'Join Fan Hub Plus and be part of something amazing!'
                    : 'Sign in to access your fandom collection and perks!'}
                </p>
              </div>

              <div className="w-10 h-0.5 mx-auto rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </div>

            {/* Global Server Error Banner */}
            {serverError && (
              <div className="mb-3.5 p-2.5 rounded-xl bg-red-950/80 border border-red-500/60 text-red-300 text-xs flex items-center gap-2 font-medium animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Full Name (Only on Register) */}
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                    <User className="w-3.5 h-3.5 text-red-400" />
                    <span>Full Name</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-9 pr-3 py-2 bg-[#120509]/90 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[10px] text-red-400 flex items-center gap-1 font-medium mt-0.5">
                      <AlertCircle className="w-2.5 h-2.5" />
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                  <Mail className="w-3.5 h-3.5 text-red-400" />
                  <span>Email Address</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-9 pr-3 py-2 bg-[#120509]/90 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-red-400 flex items-center gap-1 font-medium mt-0.5">
                    <AlertCircle className="w-2.5 h-2.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                  <Lock className="w-3.5 h-3.5 text-red-400" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'register' ? 'Create a password' : '••••••••'}
                    className="w-full pl-9 pr-9 py-2 bg-[#120509]/90 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] text-red-400 flex items-center gap-1 font-medium mt-0.5">
                    <AlertCircle className="w-2.5 h-2.5" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password (Only on Register) */}
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                    <Lock className="w-3.5 h-3.5 text-red-400" />
                    <span>Confirm Password</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full pl-9 pr-9 py-2 bg-[#120509]/90 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-zinc-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[10px] text-red-400 flex items-center gap-1 font-medium mt-0.5">
                      <AlertCircle className="w-2.5 h-2.5" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/forgot-password');
                    }}
                    className="text-[11px] font-bold text-red-400 hover:text-white"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#e11d48] via-[#dc2626] to-[#b91c1c] hover:from-[#f43f5e] hover:to-[#ef4444] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(225,29,72,0.5)] hover:shadow-[0_0_35px_rgba(225,29,72,0.7)] flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{mode === 'register' ? 'Registering...' : 'Signing in...'}</span>
                    </>
                  ) : mode === 'register' ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Register</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* OR Divider */}
            <div className="relative flex items-center justify-center my-3.5">
              <div className="w-full border-t border-white/10" />
              <span className="absolute px-2.5 bg-[#0b0407] text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                OR
              </span>
            </div>

            {/* Bottom Switcher */}
            <div className="text-center text-[11px] text-zinc-300">
              <span>{mode === 'register' ? 'Already have an account?' : "Don't have an account?"}</span>
              <button
                type="button"
                onClick={() => switchMode(mode === 'register' ? 'login' : 'register')}
                className="inline-flex items-center gap-1 text-red-500 hover:text-white font-bold ml-1.5 transition-colors"
              >
                <span>{mode === 'register' ? 'Login' : 'Register'}</span>
                <ArrowRight className="w-3 h-3 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
