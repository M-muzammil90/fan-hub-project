import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  PictureInPicture,
  RotateCcw,
  Check,
  Film
} from 'lucide-react';

export default function CustomVideoPlayer({
  src,
  poster,
  title,
  autoPlay = true,
  onEnded,
  className = ''
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressContainerRef = useRef(null);
  const hideControlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('1080P');
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverPosition, setHoverPosition] = useState(0);

  // Format seconds to HH:MM:SS or MM:SS
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds === null) return '00:00';
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const pad = (n) => String(n).padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Update progress
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);

    // Calculate buffered range
    if (videoRef.current.buffered.length > 0 && duration > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      setBuffered((bufferedEnd / duration) * 100);
    }
  };

  // Loaded metadata
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
    if (autoPlay) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  // Seek bar click / drag
  const handleSeek = (e) => {
    if (!progressContainerRef.current || !videoRef.current || !duration) return;
    const rect = progressContainerRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pos * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Hover time preview
  const handleProgressMouseMove = (e) => {
    if (!progressContainerRef.current || !duration) return;
    const rect = progressContainerRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    setHoverTime(pos * duration);
    setIsHoveringProgress(true);
  };

  // Volume change
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = volume || 0.8;
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Picture in Picture
  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.error('PiP failed', e);
    }
  };

  // Change playback rate
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setIsSettingsOpen(false);
  };

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    if (isPlaying) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        if (!isSettingsOpen) {
          setShowControls(false);
        }
      }, 2800);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight' && videoRef.current) {
        e.preventDefault();
        videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
      } else if (e.code === 'ArrowLeft' && videoRef.current) {
        e.preventDefault();
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
      } else if (e.code === 'KeyM') {
        toggleMute();
      } else if (e.code === 'KeyF') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, duration, isMuted, volume]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Instant video buffering & playback optimization when src changes
  useEffect(() => {
    if (videoRef.current && src) {
      videoRef.current.load();
      if (autoPlay) {
        const promise = videoRef.current.play();
        if (promise !== undefined) {
          promise
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Fallback to muted autoplay if browser blocks sound autoplay
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                videoRef.current
                  .play()
                  .then(() => setIsPlaying(true))
                  .catch(() => setIsPlaying(false));
              }
            });
        }
      }
    }
  }, [src, autoPlay]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && !isSettingsOpen && setShowControls(false)}
      className={`group relative w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden select-none border border-red-500/20 shadow-2xl ${className}`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="auto"
        autoPlay={autoPlay}
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          setShowControls(true);
          onEnded?.();
        }}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Vignette Gradients */}
      <div
        onClick={togglePlay}
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 transition-opacity duration-300 pointer-events-none ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Top Bar Title */}
      {title && (
        <div
          className={`absolute top-0 left-0 right-0 p-4 sm:p-5 flex items-center justify-between z-20 transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-md shadow-red-600/40">
              HD STREAM
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate max-w-md drop-shadow">
              {title}
            </h4>
          </div>
        </div>
      )}

      {/* Large Center Play / Pause Button Overlay (Like Image 3) */}
      <div
        onClick={togglePlay}
        className={`absolute inset-0 flex items-center justify-center z-20 cursor-pointer transition-all duration-300 ${
          !isPlaying || showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.8)] ${
            !isPlaying
              ? 'bg-white/85 text-black hover:bg-white hover:scale-110 shadow-[0_0_30px_rgba(255,255,255,0.4)]'
              : 'bg-black/60 hover:bg-black/80 text-white hover:scale-105 border border-white/20'
          }`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current ml-1" />
          )}
        </button>
      </div>

      {/* Bottom Controls Bar (Exactly as designed in Image 3) */}
      <div
        className={`absolute bottom-0 left-0 right-0 px-3 sm:px-5 pb-3 sm:pb-4 pt-8 z-30 flex flex-col gap-2 transition-all duration-300 ${
          showControls || !isPlaying
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Seek Progress Bar */}
        <div
          ref={progressContainerRef}
          onClick={handleSeek}
          onMouseMove={handleProgressMouseMove}
          onMouseLeave={() => setIsHoveringProgress(false)}
          className="relative w-full h-2 group/progress cursor-pointer flex items-center"
        >
          {/* Background Bar */}
          <div className="absolute inset-0 h-1 sm:h-1.5 rounded-full bg-white/20 overflow-hidden backdrop-blur-sm group-hover/progress:h-2 transition-all">
            {/* Buffered Bar */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-white/40 rounded-full transition-all duration-200"
              style={{ width: `${buffered}%` }}
            />
            {/* Played Bar (Blue / Red gradient as in Image 3) */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-sky-400 via-sky-500 to-[#00b4d8] rounded-full shadow-[0_0_12px_rgba(0,180,216,0.8)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Scrubber Knob */}
          <div
            className="absolute -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white border-2 border-sky-400 shadow-[0_0_10px_#00b4d8] scale-0 group-hover/progress:scale-100 transition-transform pointer-events-none"
            style={{ left: `${progressPercent}%` }}
          />

          {/* Time Hover Preview Tooltip */}
          {isHoveringProgress && (
            <div
              className="absolute bottom-4 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/90 border border-white/20 text-[10px] font-mono font-bold text-white shadow-lg pointer-events-none"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between gap-3 text-white">
          {/* Left Controls: Play/Pause, Volume, Time */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 rounded-full hover:bg-white/15 text-white transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              )}
            </button>

            {/* Volume Control with hover slider */}
            <div className="group/vol flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-full hover:bg-white/15 text-white transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-20 h-1 accent-sky-400 bg-white/30 rounded-full cursor-pointer transition-all opacity-70 group-hover/vol:opacity-100"
              />
            </div>

            {/* Current Time / Duration Counter */}
            <div className="text-[11px] sm:text-xs font-mono font-bold text-zinc-300 tracking-wider">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-1 text-zinc-500">/</span>
              <span>{formatTime(duration || 180)}</span>
            </div>
          </div>

          {/* Right Controls: 1080P Badge, Settings, PiP, Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 1080P Resolution Badge (as seen in Image 3) */}
            <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-black tracking-wider text-sky-400 bg-sky-500/10 border border-sky-400/30">
              {quality}
            </span>

            {/* Settings Menu Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-1.5 rounded-full transition-all ${
                  isSettingsOpen ? 'bg-white/25 text-white' : 'hover:bg-white/15 text-zinc-300 hover:text-white'
                }`}
                aria-label="Settings"
              >
                <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Settings Dropdown Popover */}
              {isSettingsOpen && (
                <div className="absolute bottom-10 right-0 w-44 p-2 rounded-2xl bg-zinc-950/95 border border-white/15 backdrop-blur-xl shadow-2xl text-xs space-y-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-white/10">
                    Playback Speed
                  </div>
                  <div className="grid grid-cols-3 gap-1 px-1">
                    {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleSpeedChange(s)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                          playbackSpeed === s
                            ? 'bg-sky-500 text-white'
                            : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>

                  <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-white/10 pt-1">
                    Quality
                  </div>
                  <div className="space-y-1 px-1">
                    {['1080P', '720P', 'Auto'].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => {
                          setQuality(q);
                          setIsSettingsOpen(false);
                        }}
                        className={`w-full px-2.5 py-1 rounded-lg flex items-center justify-between text-[11px] font-mono ${
                          quality === q
                            ? 'bg-sky-500/20 text-sky-400 font-bold'
                            : 'hover:bg-white/5 text-zinc-300'
                        }`}
                      >
                        <span>{q}</span>
                        {quality === q && <Check className="w-3 h-3 text-sky-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Picture in Picture */}
            <button
              type="button"
              onClick={togglePiP}
              className="p-1.5 rounded-full hover:bg-white/15 text-zinc-300 hover:text-white transition-colors hidden xs:flex items-center justify-center"
              aria-label="Picture in Picture"
              title="Mini Player"
            >
              <PictureInPicture className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-full hover:bg-white/15 text-zinc-300 hover:text-white transition-colors flex items-center justify-center"
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
