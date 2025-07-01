"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Pause, ExternalLink, Music, Loader2 } from "lucide-react";

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
    const interval = setInterval(fetchNowPlaying, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!nowPlaying.isPlaying || durationMs === 0) return;

      const elapsed = Date.now() - lastUpdateRef.current;
      const updatedProgress = progressMs + elapsed;

      if (updatedProgress < durationMs) {
        setProgressMs(updatedProgress);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [progressMs, durationMs, nowPlaying.isPlaying]);

  const handleSpotifyLogin = () => {
    window.location.href = "/api/auth/spotify";
  };

  // const progressPercentage =
  //   progressMs && durationMs
  //     ? Math.min((progressMs / durationMs) * 100, 100)
  //     : 0;

  // const formatTime = (ms: number) => {
  //   const minutes = Math.floor(ms / 60000);
  //   const seconds = Math.floor((ms % 60000) / 1000);
  //   return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  // };

  // Loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-gradient-to-br from-gray-900/98 via-gray-800/98 to-gray-900/98 backdrop-blur-md rounded-2xl p-6 border border-gray-700/30 shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5 animate-pulse" />
        <div className="relative z-10 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-green-400 animate-spin" />
          <span className="ml-2 text-gray-300 text-sm">Loading...</span>
        </div>
      </motion.div>
    );
  }

  // Authentication required state
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-gradient-to-br from-gray-900/98 via-gray-800/98 to-gray-900/98 backdrop-blur-md rounded-2xl p-6 border border-gray-700/30 shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-spotify-green/5 via-green-500/5 to-emerald-500/5" />
        <div className="relative z-10 text-center">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Music className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-white text-lg font-bold mb-2">Connect Spotify</h3>
          <p className="text-gray-400 text-sm mb-4">
            Link your Spotify account to display what you're listening to
          </p>
          <motion.button
            onClick={handleSpotifyLogin}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-gradient-to-br from-gray-900/98 via-gray-800/98 to-gray-900/98 backdrop-blur-md rounded-2xl p-6 border border-gray-700/30 shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-600/5 via-gray-500/5 to-gray-600/5" />
        <div className="relative z-10 flex items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
            <Pause className="w-8 h-8 text-gray-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-white text-lg font-semibold">Not Playing</h3>
            <p className="text-gray-400 text-sm">No music currently playing</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Now playing state
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-gradient-to-br from-gray-900/98 via-gray-800/98 to-gray-900/98 backdrop-blur-md rounded-2xl p-6 border border-gray-700/30 shadow-2xl overflow-hidden"
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5" />

      {/* Subtle animated border */}
      <motion.div
        className="absolute inset-0 rounded-2xl border border-green-500/20"
        animate={{
          borderColor: [
            "rgba(34, 197, 94, 0.2)",
            "rgba(16, 185, 129, 0.3)",
            "rgba(34, 197, 94, 0.2)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
            className="w-3 h-3 bg-green-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-green-400 text-xs font-bold tracking-wider uppercase">
            Now Playing
          </span>
        </motion.div>

        <div className="flex items-start gap-4">
          {/* Album Art */}
          <motion.div
            className="relative w-20 h-20 rounded-xl overflow-hidden shadow-2xl flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <AnimatePresence mode="wait">
              {nowPlaying.albumImageUrl ? (
                <motion.div
                  key={nowPlaying.albumImageUrl}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={nowPlaying.albumImageUrl}
                    alt="Album cover"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <Music className="w-8 h-8 text-gray-400" />
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
              key={nowPlaying.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {nowPlaying.title}
            </motion.h3>

            <motion.p
              className="text-gray-400 text-sm mb-1 truncate"
              key={nowPlaying.artist}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {nowPlaying.artist}
            </motion.p>

            {nowPlaying.album && (
              <motion.p
                className="text-gray-500 text-xs truncate"
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
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
            </motion.a>
          )}
        </div>

        {/* Progress Bar */}
        {/* {progressMs > 0 && durationMs > 0 && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>{formatTime(progressMs)}</span>
              <span>{formatTime(durationMs)}</span>
            </div>

            <div className="relative w-full h-2 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg"
                style={{ width: `${progressPercentage}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            </div>
          </motion.div>
        )} */}
      </div>
    </motion.div>
  );
}
