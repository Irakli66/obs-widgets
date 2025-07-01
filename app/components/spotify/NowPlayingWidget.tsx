// components/NowPlayingWidget.tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface NowPlayingData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  progress?: number;
  duration?: number;
}

export default function NowPlayingWidget() {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData>({
    isPlaying: false,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNowPlaying = async () => {
    try {
      const response = await fetch("/api/spotify/now-playing");
      if (response.status === 401) {
        setIsAuthenticated(false);
        return;
      }

      const data = await response.json();
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

    // Poll every 30 seconds
    const interval = setInterval(fetchNowPlaying, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSpotifyLogin = () => {
    window.location.href = "/api/auth/spotify";
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 text-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 text-white">
        <div className="text-center">
          <p className="mb-2">Connect Spotify to show now playing!</p>
          <button
            onClick={handleSpotifyLogin}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-white font-medium"
          >
            Connect Spotify
          </button>
        </div>
      </div>
    );
  }

  if (!nowPlaying.isPlaying) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 text-white">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.797l-4-3A1 1 0 014 13V7a1 1 0 01.383-.924l4-3z"
                clipRule="evenodd"
              />
              <path d="M14.657 2.757a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.243 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-gray-400">Not currently playing</p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage =
    nowPlaying.progress && nowPlaying.duration
      ? (nowPlaying.progress / nowPlaying.duration) * 100
      : 0;

  return (
    <div className="bg-gray-900 rounded-lg p-4 text-white">
      <div className="flex items-center space-x-3">
        {nowPlaying.albumImageUrl && (
          <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={nowPlaying.albumImageUrl}
              alt={`${nowPlaying.album} cover`}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-500 font-medium">
              NOW PLAYING
            </span>
          </div>

          <h3 className="text-sm font-medium text-white truncate">
            {nowPlaying.title}
          </h3>

          <p className="text-xs text-gray-400 truncate">{nowPlaying.artist}</p>

          {nowPlaying.progress && nowPlaying.duration && (
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div
                  className="bg-green-500 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {nowPlaying.songUrl && (
          <a
            href={nowPlaying.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
