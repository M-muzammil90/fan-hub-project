import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Shield,
  Heart,
  Globe,
  Film,
  Gamepad2,
  Tv,
  Music,
  BookOpen,
  Award,
  ArrowRight,
  Flame
} from 'lucide-react';

export default function About() {
  const coveredFandoms = [
    { title: 'Anime', desc: 'From iconic seasonal shonen to indie arthouse features.' },
    { title: 'Gaming', desc: 'Triple-A blockbusters, competitive esports, and indie gems.' },
    { title: 'Movies', desc: 'Cinematic universes, sci-fi epics, and festival favorites.' },
    { title: 'TV Shows', desc: 'Binge-worthy prestige dramas and speculative fiction.' },
    { title: 'K-Pop', desc: 'Idol releases, world concert tours, and official lightsticks.' },
    { title: 'Comics', desc: 'Multiverse comic runs, graphic novels, and variant covers.' },
    { title: 'Manga', desc: 'Serialized weekly chapters and landmark tankobon volumes.' },
    { title: 'Cosplay', desc: 'Armor fabrication, propmaking, wig styling, and conventions.' }
  ];

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto selection:bg-red-500/30">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-red-500/10 bg-[#0a0204] p-8 sm:p-16 text-center shadow-2xl shadow-red-900/10">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-40 -right-20 w-[600px] h-[600px] bg-gradient-to-bl from-red-600/20 via-red-900/10 to-transparent blur-3xl rounded-full" />
          <div className="absolute -bottom-40 -left-20 w-[600px] h-[600px] bg-gradient-to-tr from-red-600/20 via-red-900/10 to-transparent blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-3xl mx-auto space-y-5 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-950/40 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
            <Flame className="w-4 h-4 text-red-500" />
            <span>Fandom Reimagined</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display">
            The Definitive Sanctuary for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400 drop-shadow-sm">Global Fandom Culture</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto font-medium">
            Fan Hub Plus unites fans, creators, and collectors under one cohesive, high-performance ecosystem built for genuine enthusiasm without friction.
          </p>
        </div>
      </div>

      {/* Pillars Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group p-8 rounded-3xl bg-[#0a0204] hover:bg-red-600 border border-white/5 hover:border-red-500 space-y-4 shadow-xl hover:shadow-red-600/30 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
            <Heart className="w-24 h-24 text-red-500 group-hover:text-black" />
          </div>
          <div className="relative w-14 h-14 rounded-2xl bg-red-950/50 group-hover:bg-black/20 text-red-500 group-hover:text-white flex items-center justify-center border border-red-500/20 group-hover:border-white/30 shadow-lg group-hover:scale-110 transition-transform">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="relative text-xl font-bold text-white font-display">Community-First Ethos</h3>
          <p className="relative text-sm text-zinc-400 group-hover:text-red-100 leading-relaxed font-medium transition-colors">
            Every feature is designed around fans: bookmarking personal watchlists with private notes, rating episodes, and sharing fan-made craft with verified attribution.
          </p>
        </div>

        <div className="group p-8 rounded-3xl bg-[#0a0204] hover:bg-red-600 border border-white/5 hover:border-red-500 space-y-4 shadow-xl hover:shadow-red-600/30 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
            <Shield className="w-24 h-24 text-red-500 group-hover:text-black" />
          </div>
          <div className="relative w-14 h-14 rounded-2xl bg-red-950/50 group-hover:bg-black/20 text-red-500 group-hover:text-white flex items-center justify-center border border-red-500/20 group-hover:border-white/30 shadow-lg group-hover:scale-110 transition-transform">
            <Shield className="w-7 h-7" />
          </div>
          <h3 className="relative text-xl font-bold text-white font-display">Curated Integrity</h3>
          <p className="relative text-sm text-zinc-400 group-hover:text-red-100 leading-relaxed font-medium transition-colors">
            Our moderation system guarantees that all community fan submissions and feedback undergo verification before appearing on the public index.
          </p>
        </div>

        <div className="group p-8 rounded-3xl bg-[#0a0204] hover:bg-red-600 border border-white/5 hover:border-red-500 space-y-4 shadow-xl hover:shadow-red-600/30 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
            <Globe className="w-24 h-24 text-red-500 group-hover:text-black" />
          </div>
          <div className="relative w-14 h-14 rounded-2xl bg-red-950/50 group-hover:bg-black/20 text-red-500 group-hover:text-white flex items-center justify-center border border-red-500/20 group-hover:border-white/30 shadow-lg group-hover:scale-110 transition-transform">
            <Globe className="w-7 h-7" />
          </div>
          <h3 className="relative text-xl font-bold text-white font-display">Universal Accessibility</h3>
          <p className="relative text-sm text-zinc-400 group-hover:text-red-100 leading-relaxed font-medium transition-colors">
            Built with fine-grained typographic scaling, responsive dark/light color schemes, and seamless keyboard navigation.
          </p>
        </div>
      </div>

      {/* Universes Section */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight font-display">
            Eight Covered Universes
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-rose-600 mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {coveredFandoms.map((fandom, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0a0204] hover:bg-red-600 border border-white/5 hover:border-red-500 space-y-2 shadow-lg hover:shadow-red-600/30 transition-all duration-300 group"
            >
              <h4 className="text-base font-bold text-white group-hover:text-white transition-colors font-display">{fandom.title}</h4>
              <p className="text-xs text-zinc-400 group-hover:text-red-100 leading-relaxed font-medium transition-colors">{fandom.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative p-10 rounded-3xl bg-[#0a0204] border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent pointer-events-none" />
        
        <div className="relative space-y-2 text-center sm:text-left z-10">
          <h3 className="text-2xl font-bold text-white font-display">Have a suggestion or question?</h3>
          <p className="text-sm text-zinc-300 font-medium max-w-md">Our team actively reviews member feedback to expand fandom coverage.</p>
        </div>
        
        <Link
          to="/feedback"
          className="relative z-10 px-8 py-3.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all hover:scale-105 shrink-0 flex items-center gap-2"
        >
          <span>Submit Feedback</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
