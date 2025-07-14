"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, ExternalLink, Music, Loader2, Volume2 } from "lucide-react";
import Image from "next/image";

interface NowPlayingData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  progress?: number; // in ms
  duration?: number; // in ms
}

export default function NowPlayingWidget() {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData>({
    isPlaying: false,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progressMs, setProgressMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const lastUpdateRef = useRef(Date.now());

  const fetchNowPlaying = async () => {
    try {
      const response = await fetch("/api/spotify/now-playing", {
        cache: "no-store",
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        return;
      }

      const data = await response.json();

      if (data && data.isPlaying) {
        setProgressMs(data.progress || 0);
        setDurationMs(data.duration || 0);
        lastUpdateRef.current = Date.now();
      }

      setNowPlaying(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching now playing:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 7500); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const updateProgress = () => {
      if (!nowPlaying.isPlaying || durationMs === 0) return;

      const elapsed = Date.now() - lastUpdateRef.current;
      const updatedProgress = (nowPlaying.progress || 0) + elapsed;

      if (updatedProgress < durationMs) {
        setProgressMs(updatedProgress);
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgressMs(durationMs);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, [nowPlaying.isPlaying, durationMs, nowPlaying.progress]);

  const handleSpotifyLogin = () => {
    window.location.href = "/api/auth/spotify";
  };

  // const progressPercentage =
  //   progressMs && durationMs
  //     ? Math.min((progressMs / durationMs) * 100, 100)
  //     : 0;

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-slate-900/95 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-indigo-500/10 animate-pulse" />
        <div className="relative z-10 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          <span className="ml-3 text-blue-300 text-sm font-medium">
            Loading music...
          </span>
        </div>
      </motion.div>
    );
  }

  // Authentication required state
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-slate-900/95 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-indigo-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

        <div className="relative z-10 text-center">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 30px rgba(14, 165, 233, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Music className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-white text-lg font-bold mb-2">Connect Spotify</h3>
          <p className="text-blue-300 text-sm mb-6 leading-relaxed">
            Link your Spotify account to display what you are listening to
          </p>
          <motion.button
            onClick={handleSpotifyLogin}
            className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 px-6 py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 30px rgba(14, 165, 233, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Music className="w-4 h-4" />
            Connect Spotify
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Not playing state
  if (!nowPlaying.isPlaying) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-slate-900/95 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-blue-500/5 to-slate-500/5" />
        <div className="relative z-10 flex items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-700 via-blue-700 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
            <Pause className="w-8 h-8 text-blue-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-white text-lg font-semibold">Music Paused</h3>
            <p className="text-blue-300 text-sm">No music currently playing</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Now playing state
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative bg-slate-900/95 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 shadow-2xl overflow-hidden"
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-indigo-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      {/* Subtle animated border */}
      <motion.div
        className="absolute inset-0 rounded-2xl border"
        animate={{
          borderColor: [
            "rgba(59, 130, 246, 0.3)",
            "rgba(14, 165, 233, 0.5)",
            "rgba(99, 102, 241, 0.4)",
            "rgba(59, 130, 246, 0.3)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10">
        {/* Now Playing Header */}
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className="flex items-center gap-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Volume2 className="w-4 h-4 text-blue-400" />
            <div className="flex gap-1">
              {/* {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-gradient-to-t from-blue-500 to-sky-400 rounded-full"
                  animate={{
                    height: [8, 16, 12, 8],
                    opacity: [0.5, 1, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))} */}
            </div>
          </motion.div>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400 text-xs font-bold tracking-wider uppercase">
            Now Playing
          </span>
        </motion.div>

        <div className="flex items-start gap-4">
          {/* Album Art */}
          <motion.div
            className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <AnimatePresence mode="wait">
              {nowPlaying.albumImageUrl ? (
                <motion.div
                  key={nowPlaying.albumImageUrl}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={nowPlaying.albumImageUrl}
                    alt="Album cover"
                    fill
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <motion.div
                    className="absolute inset-0 border-2 border-white/20 rounded-2xl"
                    animate={{
                      borderColor: [
                        "rgba(255,255,255,0.1)",
                        "rgba(59, 130, 246, 0.3)",
                        "rgba(255,255,255,0.1)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 via-sky-600 to-indigo-600 flex items-center justify-center">
                  <Music className="w-8 h-8 text-white" />
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Track Info */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.h3
              className="text-white text-lg font-bold mb-1 truncate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {nowPlaying.title}
            </motion.h3>

            <motion.p
              className="text-blue-300 text-sm mb-1 truncate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {nowPlaying.artist}
            </motion.p>

            {nowPlaying.album && (
              <motion.p
                className="text-blue-400 text-xs truncate"
                key={nowPlaying.album}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {nowPlaying.album}
              </motion.p>
            )}
          </motion.div>

          {/* External Link */}
          {nowPlaying.songUrl && (
            <motion.a
              href={nowPlaying.songUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-sky-400 transition-colors" />
            </motion.a>
          )}
        </div>

        {/* Progress Bar */}
        {progressMs > 0 && durationMs > 0 && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between text-xs text-blue-400 mb-2 font-mono">
              <span>{formatTime(Math.min(progressMs, durationMs))}</span>
              <span>{formatTime(durationMs)}</span>
            </div>

            <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 rounded-full shadow-lg"
                style={{
                  width: `${
                    durationMs > 0
                      ? Math.min((progressMs / durationMs) * 100, 100)
                      : 0
                  }%`,
                }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
                animate={{
                  x: [-100, 300],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
