"use client";

import { motion } from "framer-motion";
import { useRequest } from "@/lib/hooks/useRequest";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trophy, Target, Zap, TrendingUp, Skull, Activity } from "lucide-react";
import { stat } from "fs";

type FaceitPlayerData = {
  player_id: string;
  nickname: string;
  avatar: string;
  country: string;
  cover_image: string;
  games: {
    cs2?: {
      skill_level: number;
      faceit_elo: number;
      region: string;
    };
    csgo?: {
      skill_level: number;
      faceit_elo: number;
      region: string;
    };
  };
};

type FaceitStatsData = {
  lifetime: {
    "Average K/D Ratio": string;
    "Recent Results": string[];
    "Average Headshots %": string;
    Matches: string;
    "Win Rate %": string;
    "Total Headshots %": string;
    Wins: string;
    "Current Win Streak": string;
  };
};

type MatchData = {
  items: Array<{
    stats: {
      player: {
        "K/D Ratio": string;
        Kills: string;
        Deaths: string;
        "Headshots %": string;
        Result: string;
      };
    };
  }>;
};

const SKILL_LEVEL_COLORS = {
  1: "from-gray-600 to-gray-700",
  2: "from-gray-500 to-gray-600",
  3: "from-yellow-600 to-yellow-700",
  4: "from-yellow-500 to-yellow-600",
  5: "from-orange-500 to-orange-600",
  6: "from-orange-400 to-orange-500",
  7: "from-red-500 to-red-600",
  8: "from-red-400 to-red-500",
  9: "from-purple-500 to-purple-600",
  10: "from-purple-400 to-red-500",
} as const;

export default function FaceitStats() {
  const {
    data: playerData,
    error: playerError,
    isLoading: playerLoading,
  } = useRequest<FaceitPlayerData>("/api/faceit", {
    refreshInterval: 60_000,
    revalidateIfStale: true,
    revalidateOnFocus: false,
  });

  const shouldFetchStats = Boolean(playerData?.player_id);

  const {
    data: statsData,
    error: statsError,
    isLoading: statsLoading,
  } = useRequest<FaceitStatsData>(shouldFetchStats ? `/api/faceit/stats` : "", {
    refreshInterval: 30_000,
    revalidateIfStale: true,
    revalidateOnFocus: false,
  });

  const {
    data: matchData,
    error: matchError,
    isLoading: matchLoading,
  } = useRequest<MatchData>(shouldFetchStats ? `/api/faceit/matches` : "", {
    refreshInterval: 30_000,
    revalidateIfStale: true,
    revalidateOnFocus: false,
  });

  const csData = playerData?.games.cs2 || playerData?.games.csgo;
  const isInitialLoading = playerLoading;
  const isDataLoading = statsLoading || matchLoading;
  const hasError = playerError || statsError || matchError;

  const getSkillLevelGradient = (level: number) => {
    return (
      SKILL_LEVEL_COLORS[8 as keyof typeof SKILL_LEVEL_COLORS] ||
      SKILL_LEVEL_COLORS[1]
    );
  };

  console.log(matchData);

  if (isInitialLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-center h-20">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-slate-300 font-medium">
              Loading FACEIT stats...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (hasError || !playerData) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-gradient-to-r from-red-900/20 to-slate-900/95 backdrop-blur-sm border border-red-500/30 rounded-xl p-4">
        <div className="flex items-center justify-center h-20">
          <span className="text-red-400 font-medium">
            Failed to load FACEIT data
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full relative max-w-xl mx-auto bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 pb-3">
        {/* Avatar & Name */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 p-0.5">
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                {playerData.avatar ? (
                  <Image
                    src={playerData.avatar}
                    alt={playerData.nickname}
                    width={44}
                    height={44}
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-orange-400 font-bold text-lg">
                    {playerData.nickname.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {playerData.nickname}
            </h2>
            <div className="text-center flex items-center gap-2">
              <div className="text-lg font-bold text-orange-400">
                {csData?.faceit_elo}
              </div>
              <div className="text-xs text-slate-400">ELO</div>
            </div>
          </div>
        </div>

        {/* Skill Level */}
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2 absolute top-0">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-slate-300 text-sm font-medium">LIVE</span>
          </div>
          {csData && (
            <div className="flex items-center space-x-3">
              <div
                className={`bg-gradient-to-r ${getSkillLevelGradient(
                  csData.skill_level
                )} px-4 py-2 rounded-lg`}
              >
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-white" />
                  <span className="text-white font-bold">
                    Level {csData.skill_level}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live indicator */}
      </div>

      <div className="flex gap-5 px-4 pb-3">
        {statsData?.lifetime["Recent Results"].map((result, index) => (
          <div
            key={index}
            className={`flex text-white rounded-full w-6 h-6 items-center justify-center ${
              result === "1" ? " bg-green-600" : "bg-red-500"
            }`}
          >
            {result === "1" ? "W" : "L"}
          </div>
        ))}
      </div>
      <Separator className="bg-slate-700/50" />

      {/* Stats Section */}
      <div className="p-4 pt-3">
        <div className="flex">
          {/* Main Stats */}

          {statsData && (
            <div className="flex justify-between w-full">
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
                <div className="flex items-center space-x-2 mb-1">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-400 text-sm">K/D Ratio</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {parseFloat(statsData.lifetime["Average K/D Ratio"]).toFixed(
                    2
                  )}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
                <div className="flex items-center space-x-2 mb-1">
                  <Skull className="w-4 h-4 text-red-400" />
                  <span className="text-slate-400 text-sm">Headshots</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {parseFloat(
                    statsData.lifetime["Average Headshots %"]
                  ).toFixed(0)}
                  %
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-slate-400 text-sm">Win Rate</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {parseFloat(statsData.lifetime["Win Rate %"]).toFixed(0)}%
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
                <div className="flex items-center space-x-2 mb-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-slate-400 text-sm">Win Streak</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {statsData.lifetime["Current Win Streak"]}
                </div>
              </div>
            </div>
          )}

          {/* Recent Matches */}
        </div>
      </div>
    </motion.div>
  );
}
