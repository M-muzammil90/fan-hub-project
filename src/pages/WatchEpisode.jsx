import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Layers,
  Star,
  Film,
  Sparkles,
  Clock,
  Share2,
  Check,
  Tv,
  List,
  CheckCircle2,
  AlertCircle,
  Volume2
} from 'lucide-react';
import { seriesApi } from '../services/series.api';
import { watchHistoryApi } from '../services/watchHistory.api';
import CustomVideoPlayer from '../components/video/CustomVideoPlayer';
import BookmarkButton from '../components/BookmarkButton';

export default function WatchEpisode() {
  const { episodeId, seriesSlug, seasonNum, episodeNum } = useParams();
  const navigate = useNavigate();

  const [episode, setEpisode] = useState(null);
  const [series, setSeries] = useState(null);
  const [season, setSeason] = useState(null);
  const [allSeasons, setAllSeasons] = useState([]);
  const [activeSidebarSeasonId, setActiveSidebarSeasonId] = useState('');
  const [sidebarEpisodes, setSidebarEpisodes] = useState([]);
  const [navigation, setNavigation] = useState({ previousEpisode: null, nextEpisode: null });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [autoNextCountdown, setAutoNextCountdown] = useState(null);

  const videoPlayerRef = useRef(null);

  // Load Episode Data
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError('');
    setAutoNextCountdown(null);

    async function loadData() {
      try {
        let currentEpisodeId = episodeId;

        // If accessed via /watch/:seriesSlug/season/:seasonNum/episode/:episodeNum
        if (!currentEpisodeId && seriesSlug && seasonNum && episodeNum) {
          const sRes = await seriesApi.getSeriesByIdOrSlug(seriesSlug);
          const fullSeries = sRes.data || sRes;
          const targetSeason = fullSeries.seasons?.find((s) => Number(s.seasonNumber) === Number(seasonNum));
          const targetEpisode = targetSeason?.episodes?.find((e) => Number(e.episodeNumber) === Number(episodeNum));

          if (targetEpisode) {
            currentEpisodeId = targetEpisode._id;
          } else {
            throw new Error(`Episode S${seasonNum} E${episodeNum} not found`);
          }
        }

        if (!currentEpisodeId) {
          throw new Error('Episode identifier missing');
        }

        const epRes = await seriesApi.getEpisodeById(currentEpisodeId);
        if (!isMounted) return;

        const epData = epRes.data || epRes;
        setEpisode(epData);
        setSeries(epData.series);
        setSeason(epData.season);
        setNavigation(epData.navigation || { previousEpisode: null, nextEpisode: null });

        // Load all seasons for sidebar playlist
        if (epData.series?._id || epData.series) {
          const seriesId = epData.series._id || epData.series;
          const seasonsRes = await seriesApi.getSeasonsBySeries(seriesId);
          if (isMounted) {
            const list = seasonsRes.seasons || [];
            setAllSeasons(list);
            const activeSeason = list.find((s) => s._id.toString() === (epData.season?._id || epData.season).toString()) || list[0];
            setActiveSidebarSeasonId(activeSeason?._id || '');
            setSidebarEpisodes(activeSeason?.episodes || []);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error loading episode:', err);
        setError(err.message || 'Failed to load episode stream');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [episodeId, seriesSlug, seasonNum, episodeNum]);

  // Handle Season switch in sidebar playlist
  const handleSwitchSidebarSeason = (seasonId) => {
    setActiveSidebarSeasonId(seasonId);
    const targetSeason = allSeasons.find((s) => s._id.toString() === seasonId.toString());
    setSidebarEpisodes(targetSeason?.episodes || []);
  };

  // Video Time Progress Updates
  const handleTimeUpdate = (currentTime, duration) => {
    if (!episode || !series || !season) return;

    // Send periodic progress updates every ~10s
    if (Math.round(currentTime) % 10 === 0 && currentTime > 2) {
      watchHistoryApi.saveProgress({
        seriesId: series._id || series,
        seasonId: season._id || season,
        episodeId: episode._id,
        progressSeconds: currentTime,
        totalDuration: duration
      }).catch(() => {});
    }
  };

  // Video End -> Auto trigger next episode countdown
  const handleVideoEnded = () => {
    if (navigation.nextEpisode) {
      setAutoNextCountdown(5);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (autoNextCountdown === null) return;
    if (autoNextCountdown === 0) {
      if (navigation.nextEpisode) {
        navigate(`/watch/episode/${navigation.nextEpisode._id}`);
      }
      return;
    }

    const timer = setTimeout(() => {
      setAutoNextCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoNextCountdown, navigation.nextEpisode, navigate]);

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
          Buffering Episode Stream...
        </p>
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Playback Error</h2>
        <p className="text-xs text-zinc-400">{error || 'This episode is unavailable or does not exist.'}</p>
        <Link
          to="/series"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Series Catalog</span>
        </Link>
      </div>
    );
  }

  const seasonNumber = season?.seasonNumber || 1;
  const episodeNumber = episode?.episodeNumber || 1;

  return (
    <div className="w-full space-y-6 pb-20">
      {/* 1. TOP CINEMA BREADCRUMBS & NAVIGATION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a0a0d] border border-red-500/20 p-3.5 sm:p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-400">
          <Link
            to={series?.slug ? `/series/${series.slug}` : '/series'}
            className="flex items-center gap-1.5 text-zinc-300 hover:text-red-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to</span>
            <strong className="text-white">{series?.title || 'Series'}</strong>
          </Link>

          <span className="text-zinc-600">/</span>

          <span className="text-red-500 font-mono font-black">
            S{String(seasonNumber).padStart(2, '0')} E{String(episodeNumber).padStart(2, '0')}
          </span>

          <span className="hidden md:inline text-zinc-600">•</span>
          <span className="hidden md:inline text-zinc-300 font-medium truncate max-w-md">
            {episode.title}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {series?._id && <BookmarkButton contentId={series._id} />}

          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Share Episode"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN CINEMA PLAYER & PLAYLIST SIDEBAR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center: Video Player & Episode Controls */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Custom Cinema Player Container */}
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-red-500/30 bg-black aspect-video shadow-[0_0_50px_rgba(255,20,50,0.2)]">
            <CustomVideoPlayer
              src={episode.videoUrl}
              poster={episode.thumbnail || season?.poster || series?.backdrop}
              title={`${series?.title || 'Series'} - S${seasonNumber} E${episodeNumber}: ${episode.title}`}
              autoPlay={true}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
            />

            {/* Auto Next Episode Countdown Overlay */}
            {autoNextCountdown !== null && navigation.nextEpisode && (
              <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
                <Sparkles className="w-10 h-10 text-red-500 animate-bounce" />
                <div className="space-y-1">
                  <p className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">Up Next</p>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    S{navigation.nextEpisode.seasonNumber} E{navigation.nextEpisode.episodeNumber}: {navigation.nextEpisode.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/watch/episode/${navigation.nextEpisode._id}`)}
                    className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg shadow-red-600/50 hover:scale-105 transition-all"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Play Now ({autoNextCountdown}s)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAutoNextCountdown(null)}
                    className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 text-xs sm:text-sm font-bold border border-white/15"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Episode Navigation Buttons (Cross-Season Previous & Next) */}
          <div className="flex items-center justify-between gap-3 bg-[#09090c] border border-zinc-800/90 p-3 sm:p-4 rounded-2xl">
            {/* Previous Episode Button */}
            {navigation.previousEpisode ? (
              <Link
                to={`/watch/episode/${navigation.previousEpisode._id}`}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 hover:border-red-500/50 border border-white/10 text-xs sm:text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 text-red-500 shrink-0" />
                <div className="text-left">
                  <span className="block text-[10px] font-mono text-zinc-400">Previous Episode</span>
                  <span className="font-black text-white line-clamp-1">
                    S{navigation.previousEpisode.seasonNumber} E{navigation.previousEpisode.episodeNumber}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="opacity-40 cursor-not-allowed inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-500">
                <ChevronLeft className="w-4 h-4" />
                <span>First Episode</span>
              </div>
            )}

            {/* Current Episode Indicator */}
            <div className="text-center hidden sm:block">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Current Stream</span>
              <span className="text-xs font-black text-red-500 font-mono">
                S{String(seasonNumber).padStart(2, '0')} E{String(episodeNumber).padStart(2, '0')}
              </span>
            </div>

            {/* Next Episode Button (with Next Season crossover support) */}
            {navigation.nextEpisode ? (
              <Link
                to={`/watch/episode/${navigation.nextEpisode._id}`}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-xs sm:text-sm font-black text-white shadow-lg shadow-red-950/60 transition-all hover:scale-105 active:scale-95"
              >
                <div className="text-right">
                  <span className="block text-[10px] font-mono text-red-200">Next Episode</span>
                  <span className="font-black line-clamp-1">
                    S{navigation.nextEpisode.seasonNumber} E{navigation.nextEpisode.episodeNumber}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </Link>
            ) : (
              <div className="opacity-40 cursor-not-allowed inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-500">
                <span>Series Finale</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Episode Description & Details Card */}
          <div className="p-5 sm:p-6 bg-[#09090c] border border-zinc-800/80 rounded-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
              <div>
                <span className="text-xs font-mono font-black text-red-500">
                  SEASON {seasonNumber} • EPISODE {episodeNumber}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">{episode.title}</h2>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-red-400" />
                  <span>{episode.duration || '24m'}</span>
                </span>
                {episode.freePreview && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    Free Stream
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {episode.description || series?.description || 'Enjoy streaming this high-definition episode.'}
            </p>
          </div>
        </div>

        {/* Right: Seasons & Episodes Playlist Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="bg-[#09090c] border border-zinc-800/90 rounded-2xl overflow-hidden flex flex-col h-full max-h-[640px]">
            {/* Playlist Header */}
            <div className="p-4 border-b border-zinc-800 bg-black/40 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <List className="w-4 h-4 text-red-500" />
                  <span>Episode Playlist</span>
                </h3>
                <span className="text-[11px] font-mono text-zinc-400 font-bold">
                  {sidebarEpisodes.length} Episodes
                </span>
              </div>

              {/* Season Selector Dropdown */}
              {allSeasons.length > 1 && (
                <select
                  value={activeSidebarSeasonId}
                  onChange={(e) => handleSwitchSidebarSeason(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-xs font-bold text-white rounded-xl px-3 py-2 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  {allSeasons.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.title || `Season ${s.seasonNumber}`} ({s.episodes?.length || s.episodeCount || 0} eps)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Scrollable Playlist Items */}
            <div className="overflow-y-auto flex-1 p-2 space-y-2 divide-y divide-zinc-900">
              {sidebarEpisodes.map((ep) => {
                const isCurrent = ep._id.toString() === episode._id.toString();

                return (
                  <Link
                    key={ep._id}
                    to={`/watch/episode/${ep._id}`}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                      isCurrent
                        ? 'bg-red-600/20 border border-red-500/50 shadow-md shadow-red-950/40'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {/* Tiny Thumbnail */}
                    <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
                      <img
                        src={ep.thumbnail || season?.poster || series?.backdrop || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80'}
                        alt={ep.title}
                        className="w-full h-full object-cover"
                      />
                      {isCurrent && (
                        <div className="absolute inset-0 bg-red-600/60 flex items-center justify-center">
                          <Volume2 className="w-4 h-4 text-white animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-black ${
                            isCurrent ? 'text-red-400' : 'text-zinc-400'
                          }`}
                        >
                          EP {String(ep.episodeNumber).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">• {ep.duration || '24m'}</span>
                      </div>

                      <h5
                        className={`text-xs font-bold truncate leading-snug ${
                          isCurrent ? 'text-white font-black' : 'text-zinc-300'
                        }`}
                      >
                        {ep.title}
                      </h5>
                    </div>

                    {isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500 shrink-0" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-zinc-600 hover:text-white shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
