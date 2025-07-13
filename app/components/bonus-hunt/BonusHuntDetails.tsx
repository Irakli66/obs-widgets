"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  TrendingUp,
  TrendingDown,
  Zap,
  DollarSign,
  Trophy,
  Flame,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useBonusHuntStore } from "@/store/bonusHuntStore";
import { BonusHunt } from "@/app/bonus-hunt/page";
import BonusHuntManager from "./BonusHuntManager";
import { useParams } from "next/navigation";

export default function BonusHuntWidget() {
  const { bonusHunts, loadFromStorage } = useBonusHuntStore();
  const params = useParams();
  const huntId = Number(params.id);

  const [bonusHunt, setBonusHunt] = useState<BonusHunt | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isAutoScroll] = useState(true);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    const found = bonusHunts.find((hunt) => hunt.id === huntId);
    setBonusHunt(found || null);
  }, [bonusHunts, huntId]);

  useEffect(() => {
    if (!isAutoScroll || !bonusHunt || bonusHunt.bonuses.length <= 4) return;

    const interval = setInterval(() => {
      setScrollOffset((prev) => (prev + 1) % bonusHunt.bonuses.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [bonusHunt, isAutoScroll]);

  const getVisibleBonuses = () => {
    if (!bonusHunt) return [];
    if (bonusHunt.bonuses.length <= 4) return bonusHunt.bonuses;

    const result = [];
    for (let i = 0; i < 4; i++) {
      const index = (scrollOffset + i) % bonusHunt.bonuses.length;
      result.push(bonusHunt.bonuses[index]);
    }
    return result;
  };

  if (!bonusHunt) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-slate-900 text-white p-6 rounded-xl">
        Loading bonus hunt...
      </div>
    );
  }

  const completedBonuses = bonusHunt.bonuses.filter((b) => b.paid > 0);
  const totalInvested = bonusHunt.startBalance;
  const totalPaid = bonusHunt.bonuses.reduce((sum, b) => sum + b.paid, 0);
  const totalProfit = totalPaid - totalInvested;

  return (
    <div className="flex">
      <BonusHuntManager huntId={huntId} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto max-h-[500px] bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 animate-pulse pointer-events-none" />
        <div className="relative z-10 p-4 pb-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/25">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {bonusHunt.name}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-purple-300">
                  <span>{bonusHunt.bonuses.length} Bonuses</span>
                  <span>{completedBonuses.length} Completed</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  ${totalPaid.toFixed(2)}
                </div>
                <div
                  className={`text-sm font-medium ${
                    totalProfit >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {totalProfit >= 0 ? "+" : ""}${totalProfit.toFixed(2)}
                </div>
              </div>
              {totalProfit > 0 && (
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Flame className="w-6 h-6 text-orange-400" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              {
                icon: <Target className="w-4 h-4 text-blue-400" />,
                label: "Avg Bet",
                value: `$${bonusHunt.avrgBet.toFixed(2)}`,
              },
              {
                icon: <Zap className="w-4 h-4 text-yellow-400" />,
                label: "Avg Multi",
                value: `${bonusHunt.currentAvrgX.toFixed(2)}x`,
              },
              {
                icon: <DollarSign className="w-4 h-4 text-green-400" />,
                label: "Invested",
                value: `$${totalInvested.toFixed(2)}`,
              },
              {
                icon:
                  totalProfit >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  ),
                label: "Profit",
                value: `${totalProfit >= 0 ? "+" : ""}$${totalProfit.toFixed(
                  2
                )}`,
              },
            ].map(({ icon, label, value }, i) => (
              <div
                key={i}
                className="bg-black/40 rounded-lg p-3 border border-white/10 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-2 mb-1">
                  {icon}
                  <span className="text-purple-300 text-xs">{label}</span>
                </div>
                <div className="text-lg font-bold text-white">{value}</div>
              </div>
            ))}
          </div>

          <Separator className="bg-purple-500/20" />

          {/* Bonuses Display */}
          <div className="py-4">
            <h3 className="text-white text-sm font-semibold mb-3">Bonuses</h3>
            <div className="space-y-2 max-h-64 overflow-hidden">
              <AnimatePresence mode="wait">
                {getVisibleBonuses().map((bonus, index) => (
                  <motion.div
                    key={`${bonus.id}-${scrollOffset}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-black/40 rounded-lg p-3 border border-white/10 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            bonus.paid > 0 ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        />
                        <span className="text-white font-medium text-sm">
                          {bonus.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-300 text-xs">
                          ${bonus.betSize.toFixed(2)}
                        </span>
                        {bonus.paid > 0 && (
                          <span
                            className={`text-xs font-bold ${
                              bonus.paidX >= 1
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {bonus.paidX.toFixed(2)}x
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {bonusHunt.bonuses.length > 4 && (
              <div className="mt-3 text-center">
                <div className="flex justify-center space-x-1">
                  {Array.from({
                    length: Math.min(bonusHunt.bonuses.length, 8),
                  }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i >= scrollOffset && i < scrollOffset + 4
                          ? "bg-purple-500"
                          : "bg-purple-500/30"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-purple-300 mt-1">
                  Showing {Math.min(4, bonusHunt.bonuses.length)} of{" "}
                  {bonusHunt.bonuses.length} bonuses
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
