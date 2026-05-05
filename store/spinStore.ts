import { create } from "zustand";
import type { SpinOutcome } from "@/lib/spin-config";

export type SpinEvent = {
  id: string;
  outcome: SpinOutcome;
  createdAt: number;
};

type SpinStore = {
  latestSpin: SpinEvent | null;
  isPreparing: boolean;
  isSpinning: boolean;
  result: SpinOutcome | null;
  rotation: number;
  spinDuration: number;

  setLatestSpin: (spin: SpinEvent | null) => void;
  startPrepare: () => void;
  startSpin: (duration?: number) => void;
  finishSpin: (outcome: SpinOutcome) => void;
  addRotation: (degrees: number) => void;
  setRotation: (rotation: number) => void;
};

export const useSpinStore = create<SpinStore>((set) => ({
  latestSpin: null,
  isPreparing: false,
  isSpinning: false,
  result: null,
  rotation: 0,
  spinDuration: 3.6,

  setLatestSpin: (spin) => set({ latestSpin: spin }),
  startPrepare: () =>
    set({
      isPreparing: true,
      isSpinning: false,
      result: null,
    }),
  startSpin: (duration = 3.6) =>
    set({
      isPreparing: false,
      isSpinning: true,
      result: null,
      spinDuration: duration,
    }),
  finishSpin: (outcome) =>
    set({ isPreparing: false, isSpinning: false, result: outcome }),
  addRotation: (degrees) =>
    set((state) => ({
      rotation: state.rotation + degrees,
    })),

  setRotation: (rotation) => set({ rotation }),
}));
