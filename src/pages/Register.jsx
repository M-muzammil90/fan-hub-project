import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Flame,
  ArrowRight,
  Users,
  Star,
  Zap,
  Crown,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { redirectAfterAuth } from '../utils/authRedirect';
import animeBg from '../assets/auth_anime_bg.jpg';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      redirectAfterAuth(navigate, { role: isAdmin ? 'admin' : 'user' });
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required';
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
    if (password !== confirmPassword) {
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
      const res = await register({ name, email, password });
      if (res.success) {
        redirectAfterAuth(navigate, res.user);
      } else {
        setServerError(res.error || 'Registration failed. Please check your details.');
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
      desc: 'Meet fellow anime & gaming fans and make new friends.'
    },
    {
      icon: Star,
      title: 'Explore',
      desc: 'Discover amazing content, news, lore and updates.'
    },
    {
      icon: Zap,
      title: 'Create',
      desc: 'Share your fan arts, stories and character builds.'
    },
    {
      icon: Crown,
      title: 'Be Part',
      desc: 'Join exclusive events, tournaments and activities.'
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-5rem)] w-full -mt-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-8 py-6 flex flex-col justify-between overflow-hidden bg-[#070204]">
      {/* Background Image Layer with Crimson & Ruby Red Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={animeBg}
          alt="Anime Community Atmosphere"
          className="w-full h-full object-cover object-left opacity-35 filter saturate-125 contrast-125 hue-rotate-[-30deg]"
        />
        {/* Dark Vignette & Red Color Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080205]/95 via-[#120308]/90 to-[#070204]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070204] via-transparent to-[#080205]/80" />

        {/* Ambient Red Glows */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-red-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 flex items-center justify-between py-2 border-b border-white/10 mb-4 sm:mb-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 via-red-600 to-rose-700 p-0.5 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            <div className="w-full h-full bg-[#0d0305] rounded-[10px] flex items-center justify-center">
              <Flame className="w-4 h-4 text-red-500 fill-red-500" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black tracking-tight text-white font-display">
              FAN HUB
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm shadow-red-600/50">
              PLUS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-zinc-300">
          <span className="hidden xs:inline">Already have an account?</span>
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-red-400 hover:text-white font-black transition-colors"
          >
            <span>Login</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-500" />
          </Link>
        </div>
      </header>

      {/* Main Content: Left Column + Right Card */}
      <main className="relative z-20 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center my-auto pb-6">
        
        {/* Left Column: Community Points */}
        <div className="lg:col-span-5 space-y-6">
          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-red-500 tracking-tight leading-tight italic drop-shadow-[0_0_25px_rgba(239,68,68,0.5)]">
              Join Our <br />
              Amazing <br />
              Community
            </h2>
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-red-500 to-transparent shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          </div>

          {/* 4 Feature Items */}
          <div className="space-y-3.5">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-3.5 group">
                  <div className="w-9 h-9 rounded-full border border-red-500/70 bg-red-950/60 text-red-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.35)] group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-red-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-zinc-300 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Red & White Form Card */}
        <div className="lg:col-span-7 max-w-md w-full mx-auto">
          <div className="relative rounded-2xl p-6 sm:p-7 bg-[#0d0407]/95 backdrop-blur-2xl border-2 border-red-500/70 shadow-[0_0_40px_rgba(239,68,68,0.35)] transition-all">
            
            {/* Header / Avatar Box */}
            <div className="text-center space-y-2 mb-4">
              <div className="inline-flex p-2.5 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                <Flame className="w-5 h-5 text-red-500 fill-red-500" />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
                  Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-white">Account</span>
                </h1>
                <p className="text-[11px] text-zinc-400 font-medium">
                  Join Fan Hub Plus and be part of something amazing!
                </p>
              </div>

              <div className="w-10 h-0.5 mx-auto rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </div>

            {/* Server Error Banner */}
            {serverError && (
              <div className="mb-3.5 p-2.5 rounded-xl bg-red-950/80 border border-red-500/60 text-red-300 text-xs flex items-center gap-2 font-medium animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                  <User className="w-3.5 h-3.5 text-red-400" />
                  <span>Full Name</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#120509]/90 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
                  />
                </div>
                {errors.name && (
                  <p className="text-[10px] text-red-400 flex items-center gap-1 font-medium mt-0.5">
                    <AlertCircle className="w-2.5 h-2.5" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                  <Mail className="w-3.5 h-3.5 text-red-400" />
                  <span>Email Address</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#120509]/90 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
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
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#120509]/90 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-zinc-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] text-red-400 flex items-center gap-1 font-medium mt-0.5">
                    <AlertCircle className="w-2.5 h-2.5" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                  <Lock className="w-3.5 h-3.5 text-red-400" />
                  <span>Confirm Password</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#120509]/90 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3 text-zinc-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[10px] text-red-400 flex items-center gap-1 font-medium mt-0.5">
                    <AlertCircle className="w-2.5 h-2.5" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Register Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:shadow-[0_0_35px_rgba(239,68,68,0.7)] flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Register</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Bottom Login Text */}
            <div className="text-center text-[11px] text-zinc-300 pt-4 mt-3 border-t border-white/10">
              <span>Already have an account?</span>
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-red-400 hover:text-white font-bold ml-1.5 transition-colors"
              >
                <span>Login</span>
                <ArrowRight className="w-3 h-3 text-red-500" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
