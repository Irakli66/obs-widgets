"use client";

import { motion } from "framer-motion";
import { useRequest } from "@/lib/hooks/useRequest";
import Image from "next/image";
import { Trophy, Target, Skull, Crosshair, Shield } from "lucide-react";

import {
  FaceitPlayerData,
  FaceitStatsData,
  Last30MatchesData,
} from "@/lib/types/faceit";

const SKILL_LEVEL_COLORS = {
  1: "from-gray-500 to-gray-600",
  2: "from-gray-400 to-gray-500",
  3: "from-yellow-500 to-yellow-600",
  4: "from-yellow-400 to-yellow-500",
  5: "from-orange-500 to-orange-600",
  6: "from-orange-400 to-orange-500",
  7: "from-red-500 to-red-600",
  8: "from-red-400 to-red-500",
  9: "from-purple-500 to-purple-600",
  10: "from-purple-400 to-red-500",
} as const;

export default function FaceitStatsS() {
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
  } = useRequest<Last30MatchesData>(
    shouldFetchStats ? `/api/faceit/matches` : "",
    {
      refreshInterval: 30_000,
      revalidateIfStale: true,
      revalidateOnFocus: false,
    }
  );

  const csData = playerData?.games.cs2 || playerData?.games.csgo;
  const isInitialLoading = playerLoading;
  // const isDataLoading = statsLoading || matchLoading;
  const hasError = playerError || statsError || matchError;

  const getSkillLevelGradient = (level: number) => {
    return (
      SKILL_LEVEL_COLORS[level as keyof typeof SKILL_LEVEL_COLORS] ||
      SKILL_LEVEL_COLORS[1]
    );
  };

  if (isInitialLoading) {
    return (
      <div className="w-full max-w-md mx-auto bg-black/90 backdrop-blur-lg border-2 border-orange-500/50 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-white font-bold text-sm">
              Loading FACEIT...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (hasError || !playerData) {
    return (
      <div className="w-full max-w-md mx-auto bg-black/90 backdrop-blur-lg border-2 border-red-500/70 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center justify-center h-16">
          <span className="text-red-400 font-bold text-sm">
            FACEIT Connection Failed
          </span>
        </div>
      </div>
    );
  }

  if (matchLoading || statsLoading) {
    return (
      <div className="w-full max-w-md mx-auto bg-black/90 backdrop-blur-lg border-2 border-orange-500/50 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-white font-bold text-sm">
              Loading Stats...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto bg-black/95 backdrop-blur-xl border-2 border-orange-500/60 rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10"
    >
      {/* Header with Player Info */}
      <div className="relative p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20">
        {/* Live indicator */}
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
          <span className="text-white font-bold text-xs uppercase tracking-wider bg-red-500/20 px-2 py-1 rounded-full">
            Live
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
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
          </div>

          {/* Player Info */}
          <div className="flex-1">
            <h2 className="text-white font-bold text-lg leading-tight">
              {playerData.nickname}
            </h2>
            <div className="flex items-center space-x-3 mt-1">
              <div className="flex items-center space-x-1">
                <span className="text-orange-400 font-bold text-lg">
                  {csData?.faceit_elo}
                </span>
                <span className="text-white/70 text-xs font-medium">ELO</span>
              </div>
              {csData && (
                <div
                  className={`bg-gradient-to-r ${getSkillLevelGradient(
                    csData.skill_level
                  )} px-2 py-1 rounded-lg shadow-lg`}
                >
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-3 h-3 text-white" />
                    <span className="text-white font-bold text-xs">
                      LVL {csData.skill_level}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div className="px-4 py-3 bg-black/50">
        <div className="flex items-center justify-between">
          <span className="text-white font-bold text-xs uppercase tracking-wider">
            Recent
          </span>
          <div className="flex space-x-1">
            {statsData?.lifetime["Recent Results"]
              .slice(-8)
              .map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shadow-lg ${
                    result === "1"
                      ? "bg-green-500 text-white shadow-green-500/30"
                      : "bg-red-500 text-white shadow-red-500/30"
                  }`}
                >
                  {result === "1" ? "W" : "L"}
                </motion.div>
              ))}
          </div>
        </div>
      </div>

      {/* Last Match Performance - Compact Layout */}
      {matchData?.lastGameStas && (
        <div className="px-4 py-3 bg-gradient-to-r from-slate-900/50 to-black/50">
          <div className="space-y-2">
            <span className="text-white font-bold text-xs uppercase tracking-wider">
              Last Match
            </span>
            <div className="grid grid-cols-2 gap-2">
              {/* KDA */}
              <div className="bg-black/60 rounded-lg p-2 border border-blue-500/30">
                <div className="flex items-center space-x-1 mb-1">
                  <Crosshair className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-400 text-xs font-medium">
                    K/D/A
                  </span>
                </div>
                <div className="text-white font-bold text-sm">
                  {matchData.lastGameStas.Kills}/{matchData.lastGameStas.Deaths}
                  /{matchData.lastGameStas.Assists}
                </div>
              </div>

              {/* K/D Ratio */}
              <div className="bg-black/60 rounded-lg p-2 border border-green-500/30">
                <div className="flex items-center space-x-1 mb-1">
                  <Target className="w-3 h-3 text-green-400" />
                  <span className="text-green-400 text-xs font-medium">
                    K/D
                  </span>
                </div>
                <div className="text-white font-bold text-sm">
                  {matchData.lastGameStas["K/D Ratio"]}
                </div>
              </div>

              {/* Headshots */}
              <div className="bg-black/60 rounded-lg p-2 border border-red-500/30">
                <div className="flex items-center space-x-1 mb-1">
                  <Skull className="w-3 h-3 text-red-400" />
                  <span className="text-red-400 text-xs font-medium">HS%</span>
                </div>
                <div className="text-white font-bold text-sm">
                  {matchData.lastGameStas["Headshots %"]}%
                </div>
              </div>

              {/* ADR */}
              <div className="bg-black/60 rounded-lg p-2 border border-yellow-500/30">
                <div className="flex items-center space-x-1 mb-1">
                  <Shield className="w-3 h-3 text-yellow-400" />
                  <span className="text-yellow-400 text-xs font-medium">
                    ADR
                  </span>
                </div>
                <div className="text-white font-bold text-sm">
                  {matchData.lastGameStas.ADR}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats - Horizontal Layout */}
      {statsData && (
        <div className="p-4 bg-black/70">
          <span className="text-white font-bold text-xs uppercase tracking-wider block mb-2">
            Overall (30 Days)
          </span>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-2 border border-blue-500/40">
              <div className="text-blue-400 text-xs font-medium mb-1">
                AVG K/D
              </div>
              <div className="text-white font-bold text-lg">
                {matchData?.kd || statsData.lifetime["Average K/D Ratio"]}
              </div>
            </div>

            <div
              className={`rounded-lg p-2 border ${
                Number(matchData?.winRate || statsData.lifetime["Win Rate %"]) >
                50
                  ? "bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/40"
                  : "bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/40"
              }`}
            >
              <div
                className={`text-xs font-medium mb-1 ${
                  Number(
                    matchData?.winRate || statsData.lifetime["Win Rate %"]
                  ) > 50
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                WIN %
              </div>
              <div className="text-white font-bold text-lg">
                {matchData?.winRate || statsData.lifetime["Win Rate %"]}%
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg p-2 border border-red-500/40">
              <div className="text-red-400 text-xs font-medium mb-1">HS%</div>
              <div className="text-white font-bold">
                {matchData?.hsPercent ||
                  statsData.lifetime["Average Headshots %"]}
                %
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-2 border border-yellow-500/40">
              <div className="text-yellow-400 text-xs font-medium mb-1">
                STREAK
              </div>
              <div className="text-white font-bold">
                {statsData.lifetime["Current Win Streak"]}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
