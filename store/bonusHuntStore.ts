import { create } from "zustand";
import { Bonus, BonusHunt } from "@/app/bonus-hunt/page";

interface BonusHuntState {
  bonusHunts: BonusHunt[];
  addBonusHunt: (hunt: BonusHunt) => void;
  deleteBonusHunt: (id: number) => void;
  loadFromStorage: () => void;
  addBonusToHunt: (huntId: number, bonus: Bonus) => void;
  updateBonusPaid: (huntId: number, bonusId: number, paid: number) => void;
  removeBonusFromHunt: (huntId: number, bonusId: number) => void;
}

export const useBonusHuntStore = create<BonusHuntState>((set) => ({
  bonusHunts: [],

  addBonusHunt: (hunt) => {
    set((state) => {
      const updated = [...state.bonusHunts, hunt];
      localStorage.setItem("bonusHunts", JSON.stringify(updated));
      return { bonusHunts: updated };
    });
  },

  deleteBonusHunt: (id) => {
    set((state) => {
      const updated = state.bonusHunts.filter((hunt) => hunt.id !== id);
      localStorage.setItem("bonusHunts", JSON.stringify(updated));
      return { bonusHunts: updated };
    });
  },

  loadFromStorage: () => {
    const stored = localStorage.getItem("bonusHunts");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored).map((hunt: BonusHunt) => ({
        ...hunt,
        createdAt: new Date(hunt.createdAt),
      }));
      set({ bonusHunts: parsed });
    } catch (e) {
      console.error("Failed to parse stored bonus hunts", e);
    }
  },

  addBonusToHunt: (huntId: number, bonus: Bonus) => {
    set((state) => {
      const updated = state.bonusHunts.map((hunt) => {
        if (hunt.id === huntId) {
          const updatedBonuses = [...hunt.bonuses, bonus];

          const totalBets = updatedBonuses.reduce(
            (sum, b) => sum + b.betSize,
            0
          );
          const avrgBet = totalBets / updatedBonuses.length;

          // Calculate break-even X = (start / totalBet)
          const avrgBEX = avrgBet > 0 ? hunt.startBalance / totalBets : 0;

          return {
            ...hunt,
            bonuses: updatedBonuses,
            avrgBet,
            avrgBEX,
          };
        }
        return hunt;
      });

      localStorage.setItem("bonusHunts", JSON.stringify(updated));
      return { bonusHunts: updated };
    });
  },

  updateBonusPaid: (huntId: number, bonusId: number, paid: number) => {
    set((state) => {
      const updatedHunts = state.bonusHunts.map((hunt) => {
        if (hunt.id === huntId) {
          const updatedBonuses = hunt.bonuses.map((bonus) => {
            if (bonus.id === bonusId) {
              const paidX = bonus.betSize > 0 ? paid / bonus.betSize : 0;
              return { ...bonus, paid, paidX };
            }
            return bonus;
          });

          const totalPaidX = updatedBonuses.reduce(
            (sum, b) => sum + b.paidX,
            0
          );
          const currentAvrgX =
            updatedBonuses.length > 0 ? totalPaidX / updatedBonuses.length : 0;

          const currentBalance = updatedBonuses.reduce(
            (sum, b) => sum + b.paid,
            0
          );

          return {
            ...hunt,
            bonuses: updatedBonuses,
            currentAvrgX,
            currentBalance,
          };
        }
        return hunt;
      });

      localStorage.setItem("bonusHunts", JSON.stringify(updatedHunts));
      return { bonusHunts: updatedHunts };
    });
  },
  removeBonusFromHunt: (huntId, bonusId) => {
    set((state) => {
      const updatedHunts = state.bonusHunts.map((hunt) => {
        if (hunt.id === huntId) {
          const updatedBonuses = hunt.bonuses.filter(
            (bonus) => bonus.id !== bonusId
          );

          const totalBets = updatedBonuses.reduce(
            (sum, b) => sum + b.betSize,
            0
          );
          const avrgBet =
            updatedBonuses.length > 0 ? totalBets / updatedBonuses.length : 0;
          const avrgBEX = avrgBet > 0 ? hunt.startBalance / totalBets : 0;

          const totalPaidX = updatedBonuses.reduce(
            (sum, b) => sum + b.paidX,
            0
          );
          const currentAvrgX =
            updatedBonuses.length > 0 ? totalPaidX / updatedBonuses.length : 0;
          const currentBalance = updatedBonuses.reduce(
            (sum, b) => sum + b.paid,
            0
          );

          return {
            ...hunt,
            bonuses: updatedBonuses,
            avrgBet,
            avrgBEX,
            currentAvrgX,
            currentBalance,
          };
        }
        return hunt;
      });

      localStorage.setItem("bonusHunts", JSON.stringify(updatedHunts));
      return { bonusHunts: updatedHunts };
    });
  },
}));
