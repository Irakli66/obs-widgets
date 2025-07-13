"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus } from "lucide-react";
import { useBonusHuntStore } from "@/store/bonusHuntStore";
import { Bonus, BonusHunt } from "@/app/bonus-hunt/page";

interface Props {
  huntId: number;
}

export default function BonusHuntManager({ huntId }: Props) {
  const {
    bonusHunts,
    loadFromStorage,
    updateBonusPaid,
    removeBonusFromHunt,
    addBonusToHunt,
  } = useBonusHuntStore();

  const [bonusHunt, setBonusHunt] = useState<BonusHunt | null>(null);
  const [newBonusName, setNewBonusName] = useState("");
  const [newBonusBet, setNewBonusBet] = useState("");

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    const found = bonusHunts.find((hunt) => hunt.id === huntId);
    setBonusHunt(found ?? null);
  }, [bonusHunts, huntId]);

  const handleAddBonus = () => {
    const name = newBonusName.trim();
    const bet = parseFloat(newBonusBet);

    if (!name || isNaN(bet) || bet <= 0) return;

    const newBonus: Bonus = {
      id: Date.now(),
      name,
      betSize: bet,
      paid: 0,
      paidX: 0,
    };

    addBonusToHunt(huntId, newBonus);
    setNewBonusName("");
    setNewBonusBet("");
  };

  if (!bonusHunt) {
    return (
      <div className="text-center text-purple-300">Loading bonus hunt...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-slate-900/90 border border-purple-600/20 rounded-xl p-6 text-white">
      <h2 className="text-xl font-bold mb-4">{bonusHunt.name} — Manager</h2>
      <Separator className="mb-4 bg-purple-600/20" />

      {/* Add Bonus Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2 text-purple-200">
          Add New Bonus
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder="Bonus name"
            value={newBonusName}
            onChange={(e) => setNewBonusName(e.target.value)}
            className="bg-black/40 border-purple-500/30 text-white placeholder-purple-300"
          />
          <Input
            placeholder="Bet size"
            type="number"
            step="0.01"
            value={newBonusBet}
            onChange={(e) => setNewBonusBet(e.target.value)}
            className="bg-black/40 border-purple-500/30 text-white placeholder-purple-300 max-w-28"
          />
          <Button
            onClick={handleAddBonus}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {bonusHunt.bonuses.length === 0 ? (
        <p className="text-purple-300">No bonuses yet.</p>
      ) : (
        <div className="space-y-4">
          {bonusHunt.bonuses.map((bonus) => (
            <div
              key={bonus.id}
              className="flex items-center justify-between bg-slate-800/60 p-3 rounded-md border border-white/10"
            >
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium text-sm">{bonus.name}</span>
                  <span className="text-xs text-purple-300">
                    Bet: ${bonus.betSize.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    step="0.01"
                    defaultValue={bonus.paid}
                    placeholder="Enter paid amount"
                    onBlur={(e) => {
                      const paid = parseFloat(e.target.value);
                      if (!isNaN(paid)) {
                        updateBonusPaid(huntId, bonus.id, paid);
                      }
                    }}
                    className="bg-black/50 border-purple-500/30 text-white h-8 text-sm"
                  />
                  <span className="text-sm text-green-400 font-bold min-w-[60px]">
                    ${bonus.paid.toFixed(2)}{" "}
                    {bonus.paid > 0 && (
                      <span className="text-purple-400 ml-1">
                        ({bonus.paidX.toFixed(2)}x)
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeBonusFromHunt(huntId, bonus.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
