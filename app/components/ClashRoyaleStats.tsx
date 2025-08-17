"use client";

import { motion } from "framer-motion";
import { useRequest } from "@/lib/hooks/useRequest";
import { Trophy, Crown, Zap, AlertCircle } from "lucide-react";

import {
  ClashRoyaleApiResponse,
  ClashRoyaleStats as ClashRoyaleStatsType,
} from "@/lib/types/clashroyale";
import Image from "next/image";

export default function ClashRoyaleStats() {
  const {
    data: apiData,
    error,
    isLoading,
  } = useRequest<ClashRoyaleApiResponse>("/api/clashroyale", {
    refreshInterval: 60_000,
    revalidateIfStale: true,
    revalidateOnFocus: false,
  });

  // Process battle log data to calculate stats
  const processBattleLog = (
    battles: ClashRoyaleApiResponse["battleLog"],
    playerTag: string
  ): ClashRoyaleStatsType => {
    const recentBattles = battles.slice(0, 10); // Last 10 battles

    let wins = 0;
    let losses = 0;
    const recentResults: ("W" | "L")[] = [];
    let totalTrophyChange = 0;
    let currentTrophies = 0;

    recentBattles.forEach((battle) => {
      const player = battle.team.find((p) => p.tag === playerTag);
      const opponent = battle.opponent.find((p) => p.tag !== playerTag);

      if (player && opponent) {
        const isWin = player.crowns > opponent.crowns;

        if (isWin) {
          wins++;
          recentResults.push("W");
        } else {
          losses++;
          recentResults.push("L");
        }

        totalTrophyChange += player.trophyChange;
        currentTrophies = player.startingTrophies + player.trophyChange;
      }
    });

    const totalBattles = wins + losses;
    const winRate =
      totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0;
    const averageTrophyChange =
      totalBattles > 0 ? Math.round(totalTrophyChange / totalBattles) : 0;

    return {
      totalBattles,
      wins,
      losses,
      winRate,
      recentResults,
      averageTrophyChange,
      currentTrophies,
    };
  };

  const stats =
    apiData?.battleLog && apiData?.player
      ? processBattleLog(apiData.battleLog, apiData.player.tag)
      : null;
  const playerInfo = apiData?.player;
  const isInitialLoading = isLoading;
  const hasError = error;
  const hasNoBattles = apiData?.battleLog && apiData.battleLog.length === 0;

  if (isInitialLoading) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/30 rounded-lg p-4 w-96">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-700 rounded"></div>
            <div className="h-3 bg-slate-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/30 rounded-lg p-4 w-96">
        <div className="text-red-400 text-center">
          Failed to load Clash Royale stats
        </div>
      </div>
    );
  }

  if (hasNoBattles) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/30 rounded-lg w-96">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white text-lg font-bold">
                {playerInfo?.name || "Clash Royale"}
              </h1>
              <p className="text-slate-400 text-sm">
                {playerInfo?.tag || "#8U0RPPUP"}
              </p>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs font-medium">LIVE</span>
          </div>
        </div>

        {/* No Battles Message */}
        <div className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">
            No Recent Battles
          </h3>
          <p className="text-slate-400 text-sm">
            Play some Clash Royale games to see your battle stats here!
          </p>
          <p className="text-slate-500 text-xs mt-2">
            Battle log only shows games from the last 24 hours
          </p>
        </div>
      </div>
    );
  }

  if (!stats || !playerInfo) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/30 rounded-lg p-4 w-96">
        <div className="text-slate-400 text-center">
          No battle data available
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/30 rounded-lg w-96"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/30">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br border-1 border-gray-500 rounded-lg flex items-center justify-center">
            <Image
              src="/images/tyniteprime-removebg.png"
              alt="Player Icon"
              width={120}
              height={120}
            />
          </div>
          <div>
            <h1 className="text-white text-lg font-bold">{playerInfo.name}</h1>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-white font-bold">
                {playerInfo.trophies}
              </span>
            </div>
          </div>
        </div>

        {/* Wins/Losses Counter */}
        <div className="flex items-center space-x-2">
          <div className="text-white flex flex-col items-center bg-slate-800/50 rounded-lg px-3 py-2 border  border-slate-700/30">
            {/* <p className="text-xs text-slate-400">W</p> */}
            <p className="text-sm font-bold text-green-400">{stats.wins}</p>
          </div>
          <div className="text-white flex flex-col items-center bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/30">
            {/* <p className="text-xs text-slate-400">L</p> */}
            <p className="text-sm font-bold text-red-400">{stats.losses}</p>
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div className="flex flex-col px-4 pb-3 items-start pt-3">
        <div className="flex justify-between w-full items-center mb-2">
          <p className="text-white text-md font-semibold">Last 10 Battles</p>
          <div className="text-white flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-slate-400 text-sm">Win Rate:</span>
            <span className="text-white font-bold">{stats.winRate}%</span>
          </div>
        </div>
        <div className="flex gap-1">
          {stats.recentResults.map((result: "W" | "L", index: number) => (
            <div
              key={index}
              className={`flex text-white rounded w-6 h-6 items-center justify-center text-xs font-bold ${
                result === "W" ? "bg-green-600" : "bg-red-500"
              }`}
            >
              {result}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
