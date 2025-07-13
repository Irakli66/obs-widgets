"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useBonusHuntStore } from "../../../store/bonusHuntStore";
import CreateBonusHunt from "./CreateBonusHunt";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function BonusHuntsList() {
  const { bonusHunts, deleteBonusHunt, loadFromStorage } = useBonusHuntStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Creation Section */}
      <div className="bg-slate-900 border border-purple-600/30 rounded-xl p-6 shadow-md shadow-purple-900/20">
        <h2 className="text-xl font-bold text-white mb-4">
          🎯 Create New Bonus Hunt
        </h2>
        <CreateBonusHunt />
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-black">📃 Your Bonus Hunts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bonusHunts.map((bonusHunt) => (
            <div
              key={bonusHunt.id}
              className="relative bg-gradient-to-br from-purple-700 via-purple-800 to-slate-900 p-5 rounded-xl shadow-lg shadow-purple-900/30 border border-purple-600/30 hover:ring-2 hover:ring-purple-400/50 transition"
            >
              <Link
                href={`/bonus-hunt/${bonusHunt.id}`}
                className="block space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {bonusHunt.name}
                  </h3>
                  <p className="text-sm text-purple-200">
                    {new Date(bonusHunt.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-purple-200">
                  <p>🎰 Start: ${bonusHunt.startBalance}</p>
                  <p>📈 Current: ${bonusHunt.currentBalance}</p>
                </div>
                <div className="text-xs text-purple-300 space-y-1">
                  <p>Break-even X: {bonusHunt.avrgBEX.toFixed(2)}</p>
                  <p>Current Avg X: {bonusHunt.currentAvrgX.toFixed(2)}</p>
                </div>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 text-red-400 hover:text-red-500"
                onClick={() => {
                  deleteBonusHunt(bonusHunt.id);
                  toast.success("Bonus hunt deleted!");
                }}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
