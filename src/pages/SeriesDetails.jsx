import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Tv,
  Film,
  Play,
  Star,
  Sparkles,
  Layers,
  Calendar,
  Clock,
  ArrowRight,
  Share2,
  Check,
  CheckCircle2,
  AlertCircle,
  Eye,
  Info,
  ChevronDown
} from 'lucide-react';
import { seriesApi } from '../services/series.api';
import { watchHistoryApi } from '../services/watchHistory.api';
import BookmarkButton from '../components/BookmarkButton';
import Modal from '../components/Modal';
import CustomVideoPlayer from '../components/video/CustomVideoPlayer';

export default function SeriesDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [series, setSeries] = useState(null);
  const [activeSeasonIndex, setActiveSeasonIndex] = useState(0);
  const [watchProgressMap, setWatchProgressMap] = useState({});
  const [continueWatchingItem, setContinueWatchingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Trailer Modal
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError('');

    seriesApi
      .getSeriesByIdOrSlug(slug)
      .then((res) => {
        if (!isMounted) return;
        const data = res.data || res;
        setSeries(data);

        // Fetch user watch progress if available
        if (data?._id) {
          watchHistoryApi
            .getSeriesWatchProgress(data._id)
            .then((pRes) => {
              if (isMounted && pRes?.data) {
                setWatchProgressMap(pRes.data);
              }
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Failed to load series details');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const seasons = series?.seasons || [];
  const currentSeason = seasons[activeSeasonIndex] || seasons[0] || null;
  const currentEpisodes = currentSeason?.episodes || [];

  // Determine First Episode to Start or Continue
  const firstEpisode = useMemo(() => {
    if (seasons.length === 0) return null;
    for (const s of seasons) {
      if (s.episodes && s.episodes.length > 0) {
        return {
          season: s,
          episode: s.episodes[0]
        };
      }
    }
    return null;
  }, [seasons]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="py-36 text-center space-y-3">
        <div className="w-12 h-12 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
          Loading Series Sagas...
        </p>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Series Not Found</h2>
        <p className="text-xs text-zinc-400">{error || 'This series could not be found or has been removed.'}</p>
        <Link
          to="/series"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-all"
        >
          <span>Browse All Series</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const categoryName = typeof series.category === 'object' ? (series.category?.name || 'Anime') : 'Anime';

  return (
    <div className="w-full space-y-10 pb-20">
      {/* 1. CINEMATIC HERO BACKDROP */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-red-500/25 bg-[#070709] shadow-[0_0_60px_rgba(255,20,50,0.18)] min-h-[460px] flex flex-col justify-end">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={series.backdrop || series.poster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=85'}
            alt={series.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070709] via-[#070709]/90 md:via-[#070709]/75 to-transparent/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/60 to-transparent" />
          <div className="absolute -left-10 -bottom-10 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Foreground Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8">
          {/* Vertical Poster Card */}
          <div className="hidden sm:block w-44 md:w-52 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-red-500/40 shadow-2xl shadow-red-950/80 shrink-0 bg-zinc-900 group">
            <img
              src={series.poster || series.backdrop}
              alt={series.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Metadata & Controls */}
          <div className="space-y-4 max-w-3xl flex-1">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/50">
                {categoryName}
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-black/60 text-amber-400 border border-amber-500/20 backdrop-blur-md">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{series.rating || '9.0'} Rating</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-black/60 text-zinc-300 border border-white/10 backdrop-blur-md">
                <Calendar className="w-3 h-3 text-red-400" />
                <span>{series.releaseYear || '2024'}</span>
              </span>

              <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-black/60 text-emerald-400 border border-emerald-500/20 capitalize">
                {series.status || 'ongoing'}
              </span>

              <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-black/60 text-zinc-300 border border-white/10">
                {seasons.length} {seasons.length === 1 ? 'Season' : 'Seasons'} ({series.totalEpisodes || 0} Episodes)
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight font-display leading-[1.05] drop-shadow-md">
              {series.title}
            </h1>

            {/* Genres */}
            {series.genres && series.genres.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {series.genres.map((genre, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-lg bg-white/10 text-zinc-200 text-xs font-medium border border-white/10 backdrop-blur-md"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-300/95 leading-relaxed line-clamp-3 md:line-clamp-4 pt-1">
              {series.description || 'Experience the complete saga in ultra high definition.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {firstEpisode ? (
                <Link
                  to={`/watch/episode/${firstEpisode.episode._id}`}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-black shadow-[0_0_35px_rgba(255,23,56,0.65)] flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Start Watching S{firstEpisode.season.seasonNumber} E{firstEpisode.episode.episodeNumber}</span>
                </Link>
              ) : (
                <button
                  disabled
                  className="px-6 py-3 rounded-full bg-zinc-800 text-zinc-500 text-xs sm:text-sm font-bold cursor-not-allowed"
                >
                  Coming Soon
                </button>
              )}

              {series.trailerUrl && (
                <button
                  type="button"
                  onClick={() => setTrailerModalOpen(true)}
                  className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/15 backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Film className="w-4 h-4 text-red-400" />
                  <span>Watch Trailer</span>
                </button>
              )}

              <BookmarkButton contentId={series._id} />

              <button
                type="button"
                onClick={handleShare}
                className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white border border-white/15 backdrop-blur-md transition-all"
                title="Share series"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEASONS & EPISODES CATALOG */}
      <div className="space-y-6">
        {/* Seasons Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-red-500" />
              <span>Seasons & Episodes</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select a season to browse and stream all available episodes.
            </p>
          </div>

          {/* Season Selector Tabs */}
          {seasons.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {seasons.map((season, idx) => {
                const isActive = idx === activeSeasonIndex;
                return (
                  <button
                    key={season._id || idx}
                    type="button"
                    onClick={() => setActiveSeasonIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-950/50 scale-105'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    <span>{season.title || `Season ${season.seasonNumber}`}</span>
                    <span className="ml-1.5 opacity-70 text-[10px] font-mono">
                      ({season.episodes?.length || 0})
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Current Season Info Banner */}
        {currentSeason && (
          <div className="p-4 bg-gradient-to-r from-zinc-950 via-[#0c0c10] to-zinc-950 border border-zinc-800/80 rounded-2xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span className="text-red-500 font-mono">S{String(currentSeason.seasonNumber).padStart(2, '0')}</span>
                <span>{currentSeason.title || `Season ${currentSeason.seasonNumber}`}</span>
              </h3>
              <p className="text-xs text-zinc-400">
                {currentSeason.description || `Episodes 1 to ${currentEpisodes.length} now streaming.`}
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-zinc-400 px-3 py-1 bg-black/50 border border-zinc-800 rounded-lg shrink-0">
              {currentEpisodes.length} Episodes
            </span>
          </div>
        )}

        {/* Episodes Grid */}
        {currentEpisodes.length === 0 ? (
          <div className="py-16 text-center bg-zinc-950/40 border border-zinc-800/60 rounded-2xl">
            <Film className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-zinc-300">No episodes available in this season yet</h4>
            <p className="text-xs text-zinc-500 mt-1">Episodes are coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentEpisodes.map((episode) => {
              const progressData = watchProgressMap[episode._id.toString()];
              const percent =
                progressData && progressData.totalDuration > 0
                  ? Math.min(100, Math.round((progressData.progressSeconds / progressData.totalDuration) * 100))
                  : 0;

              return (
                <Link
                  key={episode._id}
                  to={`/watch/episode/${episode._id}`}
                  className="group relative bg-[#09090c] border border-zinc-800/80 hover:border-red-500/60 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-950/30 flex flex-col justify-between"
                >
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                    <img
                      src={episode.thumbnail || currentSeason?.poster || series.backdrop || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'}
                      alt={episode.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090c] via-transparent to-black/40" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-600/50 transform scale-75 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Top Episode Number Pill */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-mono font-black shadow-md">
                        EP {String(episode.episodeNumber).padStart(2, '0')}
                      </span>
                      {episode.freePreview && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-black text-[9px] font-black uppercase shadow-md">
                          FREE
                        </span>
                      )}
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-white flex items-center gap-1">
                      <Clock className="w-3 h-3 text-red-400" />
                      <span>{episode.duration || '24m'}</span>
                    </div>

                    {/* Progress Bar */}
                    {percent > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 to-rose-500 shadow-sm"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Episode Info */}
                  <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white group-hover:text-red-400 transition-colors line-clamp-1 leading-snug">
                        {episode.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mt-1">
                        {episode.description || 'Watch now in full HD streaming.'}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-zinc-800/60">
                      <span>Stream HD</span>
                      <span className="text-red-400 font-bold group-hover:underline flex items-center gap-1">
                        <span>Play Episode</span>
                        <Play className="w-2.5 h-2.5 fill-current" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. TRAILER PREVIEW MODAL */}
      {trailerModalOpen && series.trailerUrl && (
        <Modal
          isOpen={trailerModalOpen}
          onClose={() => setTrailerModalOpen(false)}
          title={`${series.title} - Official Trailer`}
          size="lg"
        >
          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black">
            <CustomVideoPlayer
              src={series.trailerUrl}
              poster={series.backdrop}
              title={`${series.title} Trailer`}
              autoPlay={true}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
