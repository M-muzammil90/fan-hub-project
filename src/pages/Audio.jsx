import React, { useState, useEffect, useRef } from 'react';
import { Search, Music, Play, Pause, Volume2, VolumeX, AlertCircle, Disc, SkipForward, SkipBack, Sparkles } from 'lucide-react';
import { contentApi } from '../services/content.api';

export default function Audio() {
  const [audioList, setAudioList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  const fetchAudio = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await contentApi.getContent({
        search: searchQuery || undefined,
        sortBy: 'latest'
      });

      if (res.success) {
        const list = (res.content || []).filter(
          (item) => item.contentType === 'audio' || item.mediaUrl?.endsWith('.mp3') || item.mediaUrl?.endsWith('.wav') || item.mediaUrl
        );
        setAudioList(list);
        if (list.length > 0 && !currentTrack) {
          setCurrentTrack(list[0]);
        }
      } else {
        setError(res.message || 'Failed to load audio tracks.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAudio();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayTrack = (track) => {
    if (currentTrack?._id === track._id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-10 pb-36 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hidden HTML5 Audio Element */}
      {currentTrack?.mediaUrl && (
        <audio
          ref={audioRef}
          src={currentTrack.mediaUrl}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          autoPlay={isPlaying}
        />
      )}

      {/* Header Banner with Red & Black Theme */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border border-red-500/30 bg-white dark:bg-gradient-to-br dark:from-[#140508] dark:via-[#090b10] dark:to-[#040203] shadow-xl dark:shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 dark:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-500/30 text-[11px] font-black uppercase tracking-wider">
              <Music className="w-3.5 h-3.5 text-red-500 fill-current" />
              <span>Audio & Soundtracks</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white font-display">
              Fandom OSTs & <span className="text-red-600 dark:text-red-500">Audio Tracks</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-medium">
              Listen to official anime soundtracks, gaming OSTs, and audio lore.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search OSTs or audio tracks..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-[#16060a] border border-zinc-200 dark:border-white/10 rounded-2xl text-xs text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-20 rounded-2xl bg-zinc-200 dark:bg-zinc-900 animate-pulse border border-zinc-300 dark:border-white/5" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/40 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-sm font-bold text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={fetchAudio}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && audioList.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-zinc-50 dark:bg-[#0d0407] rounded-3xl border border-zinc-200 dark:border-white/5">
          <Disc className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mx-auto animate-spin" style={{ animationDuration: '8s' }} />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No Audio Tracks Found</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">No audio files match your search filter.</p>
        </div>
      )}

      {/* Audio Track List Cards */}
      {!isLoading && !error && audioList.length > 0 && (
        <div className="space-y-3">
          {audioList.map((track) => {
            const isSelected = currentTrack?._id === track._id;
            return (
              <div
                key={track._id}
                onClick={() => handlePlayTrack(track)}
                className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-red-50 dark:bg-[#160509] border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.25)]'
                    : 'bg-white dark:bg-[#0c0407] border-zinc-200 dark:border-white/10 hover:border-red-500/50 hover:bg-zinc-50 dark:hover:bg-[#120609]'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0 border border-zinc-200 dark:border-white/10">
                    <img
                      src={track.thumbnail || track.mediaUrl}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      {isSelected && isPlaying ? (
                        <Pause className="w-5 h-5 text-red-500 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <h4 className={`text-sm font-bold truncate font-display ${isSelected ? 'text-red-600 dark:text-red-400' : 'text-zinc-900 dark:text-white'}`}>
                      {track.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {track.category?.name || 'Fandom OST'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-2.5 py-1 rounded bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/30 text-[10px] font-mono font-bold uppercase">
                    Audio Track
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSelected && isPlaying ? 'bg-red-600 text-white' : 'bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-white'}`}>
                    {isSelected && isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Persistent Floating Bottom Red & Black Audio Player Bar */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-[999] bg-white/95 dark:bg-[#0a0204]/95 backdrop-blur-xl border-t border-zinc-200 dark:border-red-500/40 p-3 sm:p-4 shadow-[0_-10px_40px_rgba(239,68,68,0.2)]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Track Info */}
            <div className="flex items-center gap-3 min-w-0 sm:w-1/4">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-black shrink-0 border border-zinc-200 dark:border-white/10 shadow-md">
                <img
                  src={currentTrack.thumbnail || currentTrack.mediaUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">{currentTrack.title}</h4>
                <p className="text-[10px] text-red-600 dark:text-red-400 font-medium truncate">{currentTrack.category?.name || 'Audio Track'}</p>
              </div>
            </div>

            {/* Play/Pause Controls & Seek Bar */}
            <div className="flex-1 flex flex-col items-center gap-1.5 max-w-xl">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime = Math.max(0, currentTime - 5);
                  }}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handlePlayTrack(currentTrack)}
                  className="p-2.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/40 transition-transform hover:scale-105"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime = Math.min(duration, currentTime + 5);
                  }}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Slider */}
              <div className="w-full flex items-center gap-2 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                <span>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 accent-red-600 rounded-lg cursor-pointer"
                />
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="hidden sm:flex items-center justify-end gap-2 sm:w-1/4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-red-500" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-20 h-1.5 bg-zinc-200 dark:bg-zinc-800 accent-red-600 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
