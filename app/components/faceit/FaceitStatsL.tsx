// "use client";

// import { motion } from "framer-motion";
// import { useRequest } from "@/lib/hooks/useRequest";
// import Image from "next/image";
// import { Separator } from "@/components/ui/separator";
// import {
//   Trophy,
//   Target,
//   Zap,
//   TrendingUp,
//   Skull,
//   TrendingDown,
//   Crosshair,
//   Shield,
// } from "lucide-react";

// import {
//   FaceitPlayerData,
//   FaceitStatsData,
//   Last30MatchesData,
// } from "@/lib/types/faceit";

// const SKILL_LEVEL_COLORS = {
//   1: "from-gray-600 to-gray-700",
//   2: "from-gray-500 to-gray-600",
//   3: "from-yellow-600 to-yellow-700",
//   4: "from-yellow-500 to-yellow-600",
//   5: "from-orange-500 to-orange-600",
//   6: "from-orange-400 to-orange-500",
//   7: "from-red-500 to-red-600",
//   8: "from-red-400 to-red-500",
//   9: "from-purple-500 to-purple-600",
//   10: "from-purple-400 to-red-500",
// } as const;

// export default function FaceitStatsL() {
//   const {
//     data: playerData,
//     error: playerError,
//     isLoading: playerLoading,
//   } = useRequest<FaceitPlayerData>("/api/faceit", {
//     refreshInterval: 60_000,
//     revalidateIfStale: true,
//     revalidateOnFocus: false,
//   });

//   const shouldFetchStats = Boolean(playerData?.player_id);

//   const {
//     data: statsData,
//     error: statsError,
//     isLoading: statsLoading,
//   } = useRequest<FaceitStatsData>(shouldFetchStats ? `/api/faceit/stats` : "", {
//     refreshInterval: 30_000,
//     revalidateIfStale: true,
//     revalidateOnFocus: false,
//   });

//   const {
//     data: matchData,
//     error: matchError,
//     isLoading: matchLoading,
//   } = useRequest<Last30MatchesData>(
//     shouldFetchStats ? `/api/faceit/matches` : "",
//     {
//       refreshInterval: 30_000,
//       revalidateIfStale: true,
//       revalidateOnFocus: false,
//     }
//   );

//   const csData = playerData?.games.cs2 || playerData?.games.csgo;
//   const isInitialLoading = playerLoading;
//   // const isDataLoading = statsLoading || matchLoading;
//   const hasError = playerError || statsError || matchError;

//   const getSkillLevelGradient = (level: number) => {
//     return (
//       SKILL_LEVEL_COLORS[level as keyof typeof SKILL_LEVEL_COLORS] ||
//       SKILL_LEVEL_COLORS[1]
//     );
//   };

//   const getMatchResultColor = (result: string) => {
//     return result === "1"
//       ? "bg-green-500 shadow-green-500/20"
//       : "bg-red-500 shadow-red-500/20";
//   };

//   const StatCard = ({
//     icon: Icon,
//     label,
//     value,
//     suffix = "",
//     trend,
//     className = "",
//   }: {
//     icon: any;
//     label: string;
//     value: string | number;
//     suffix?: string;
//     trend?: "up" | "down" | "neutral";
//     className?: string;
//   }) => (
//     <div
//       className={`bg-slate-800/60 backdrop-blur-sm rounded-lg p-3 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-200 ${className}`}
//     >
//       <div className="flex items-center justify-between mb-2">
//         <div className="flex items-center space-x-2">
//           <Icon className="w-4 h-4 text-slate-400" />
//           <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">
//             {label}
//           </span>
//         </div>
//         {trend && (
//           <div
//             className={`w-1.5 h-1.5 rounded-full ${
//               trend === "up"
//                 ? "bg-green-400"
//                 : trend === "down"
//                 ? "bg-red-400"
//                 : "bg-slate-400"
//             }`}
//           />
//         )}
//       </div>
//       <div className="text-lg font-bold text-white">
//         {value}
//         {suffix}
//       </div>
//     </div>
//   );

//   if (isInitialLoading) {
//     return (
//       <div className="w-full max-w-4xl mx-auto bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
//         <div className="flex items-center justify-center h-20">
//           <div className="flex items-center space-x-2">
//             <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
//             <span className="text-slate-300 font-medium">
//               Loading FACEIT stats...
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (hasError || !playerData) {
//     return (
//       <div className="w-full max-w-4xl mx-auto bg-gradient-to-r from-red-900/20 to-slate-900/95 backdrop-blur-sm border border-red-500/30 rounded-xl p-4">
//         <div className="flex items-center justify-center h-20">
//           <span className="text-red-400 font-medium">
//             Failed to load FACEIT data
//           </span>
//         </div>
//       </div>
//     );
//   }

//   if (matchLoading || statsLoading) {
//     return (
//       <div className="w-full max-w-4xl mx-auto bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
//         <div className="flex items-center justify-center h-20">
//           <div className="flex items-center space-x-2">
//             <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
//             <span className="text-slate-300 font-medium">
//               Loading FACEIT stats...
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="w-full relative max-w-4xl mx-auto bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden"
//     >
//       {/* Header Section */}
//       <div className="relative p-6 pb-4">
//         {/* Live indicator */}
//         <div className="absolute top-4 right-4 flex items-center space-x-2">
//           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
//           <span className="text-slate-300 text-sm font-medium">LIVE</span>
//         </div>

//         <div className="flex items-start justify-between">
//           {/* Avatar & Name */}
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 p-0.5">
//                 <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
//                   {playerData.avatar ? (
//                     <Image
//                       src={playerData.avatar}
//                       alt={playerData.nickname}
//                       width={60}
//                       height={60}
//                       className="rounded-full"
//                     />
//                   ) : (
//                     <span className="text-orange-400 font-bold text-xl">
//                       {playerData.nickname.charAt(0).toUpperCase()}
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-800 animate-pulse" />
//             </div>

//             <div className="space-y-1">
//               <h2 className="text-2xl font-bold text-white">
//                 {playerData.nickname}
//               </h2>
//               <div className="flex items-center space-x-3">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-2xl font-bold text-orange-400">
//                     {csData?.faceit_elo}
//                   </span>
//                   <span className="text-slate-400 text-sm">ELO</span>
//                 </div>
//                 {csData && (
//                   <div
//                     className={`bg-gradient-to-r ${getSkillLevelGradient(
//                       csData.skill_level
//                     )} px-3 py-1 rounded-lg shadow-lg`}
//                   >
//                     <div className="flex items-center space-x-2">
//                       <Trophy className="w-4 h-4 text-white" />
//                       <span className="text-white font-bold text-sm">
//                         Level {csData.skill_level}
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Results & Last Match Section */}
//       <div className="px-6 pb-4 space-y-4">
//         {/* Recent Results */}
//         <div className="space-y-2">
//           <h3 className="text-slate-300 text-sm font-medium uppercase tracking-wide">
//             Recent Results
//           </h3>
//           <div className="flex space-x-2">
//             {statsData?.lifetime["Recent Results"].map((result, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: index * 0.1 }}
//                 className={`flex text-white rounded-lg w-8 h-8 items-center justify-center font-bold text-sm shadow-lg ${getMatchResultColor(
//                   result
//                 )}`}
//               >
//                 {result === "1" ? "W" : "L"}
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         {/* Last Match Performance */}
//         {matchData?.lastGameStas && (
//           <div className="space-y-3">
//             <h3 className="text-slate-300 text-sm font-medium uppercase tracking-wide">
//               Last Match Performance
//             </h3>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//               <StatCard
//                 icon={Crosshair}
//                 label="K/D/A"
//                 value={`${matchData.lastGameStas.Kills}/${matchData.lastGameStas.Deaths}/${matchData.lastGameStas.Assists}`}
//               />
//               <StatCard
//                 icon={Target}
//                 label="K/D Ratio"
//                 value={matchData.lastGameStas["K/D Ratio"]}
//                 trend={
//                   Number(matchData.lastGameStas["K/D Ratio"]) > 1
//                     ? "up"
//                     : "down"
//                 }
//               />
//               <StatCard
//                 icon={Skull}
//                 label="Headshots"
//                 value={matchData.lastGameStas["Headshots %"]}
//                 suffix="%"
//                 trend={
//                   Number(matchData.lastGameStas["Headshots %"]) > 50
//                     ? "up"
//                     : "down"
//                 }
//               />
//               <StatCard
//                 icon={Shield}
//                 label="ADR"
//                 value={matchData.lastGameStas.ADR}
//                 trend={Number(matchData.lastGameStas.ADR) > 70 ? "up" : "down"}
//               />
//             </div>
//           </div>
//         )}
//       </div>

//       <Separator className="bg-slate-700/50" />

//       {/* Last 30 Matches Stats */}
//       <div className="p-6">
//         <div className="space-y-4">
//           <h3 className="text-white text-lg font-semibold">
//             Last 30 Matches Overview
//           </h3>

//           {statsData && (
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//               <StatCard
//                 icon={Target}
//                 label="Avg K/D"
//                 value={matchData?.kd || statsData.lifetime["Average K/D Ratio"]}
//                 trend={
//                   Number(
//                     matchData?.kd || statsData.lifetime["Average K/D Ratio"]
//                   ) > 1
//                     ? "up"
//                     : "down"
//                 }
//                 className="bg-gradient-to-br from-blue-900/20 to-slate-800/60"
//               />

//               <StatCard
//                 icon={Skull}
//                 label="Avg Headshots"
//                 value={
//                   matchData?.hsPercent ||
//                   statsData.lifetime["Average Headshots %"]
//                 }
//                 suffix="%"
//                 trend={
//                   Number(
//                     matchData?.hsPercent ||
//                       statsData.lifetime["Average Headshots %"]
//                   ) > 50
//                     ? "up"
//                     : "down"
//                 }
//                 className="bg-gradient-to-br from-red-900/20 to-slate-800/60"
//               />

//               <StatCard
//                 icon={
//                   matchData && Number(matchData.winRate) > 50
//                     ? TrendingUp
//                     : TrendingDown
//                 }
//                 label="Win Rate"
//                 value={matchData?.winRate || statsData.lifetime["Win Rate %"]}
//                 suffix="%"
//                 trend={
//                   Number(
//                     matchData?.winRate || statsData.lifetime["Win Rate %"]
//                   ) > 50
//                     ? "up"
//                     : "down"
//                 }
//                 className="bg-gradient-to-br from-green-900/20 to-slate-800/60"
//               />

//               <StatCard
//                 icon={Zap}
//                 label="Win Streak"
//                 value={statsData.lifetime["Current Win Streak"]}
//                 trend={
//                   Number(statsData.lifetime["Current Win Streak"]) > 3
//                     ? "up"
//                     : "neutral"
//                 }
//                 className="bg-gradient-to-br from-yellow-900/20 to-slate-800/60"
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// }
