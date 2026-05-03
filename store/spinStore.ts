import { create } from "zustand";

export type SpinOutcome = {
  id: string;
  label: string;
  chance: number;
};

export type SpinEvent = {
  id: string;
  outcome: SpinOutcome;
  createdAt: number;
};

type SpinStore = {
  latestSpin: SpinEvent | null;
  isSpinning: boolean;
  result: SpinOutcome | null;
  rotation: number;

  setLatestSpin: (spin: SpinEvent) => void;
  startSpin: () => void;
  finishSpin: (outcome: SpinOutcome) => void;
  addRotation: (degrees: number) => void;
};

export const useSpinStore = create<SpinStore>((set) => ({
  latestSpin: null,
  isSpinning: false,
  result: null,
  rotation: 0,

  setLatestSpin: (spin) => set({ latestSpin: spin }),
  startSpin: () => set({ isSpinning: true, result: null }),
  finishSpin: (outcome) => set({ isSpinning: false, result: outcome }),
  addRotation: (degrees) =>
    set((state) => ({
      rotation: state.rotation + degrees,
    })),
}));
