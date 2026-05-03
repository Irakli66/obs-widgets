import { SpinOutcome, spinOutcomes } from "./spin-config";

export type SpinEvent = {
  id: string;
  outcome: SpinOutcome;
  createdAt: number;
};

let latestSpin: SpinEvent | null = null;

export function pickWeightedOutcome() {
  const totalChance = spinOutcomes.reduce((sum, item) => sum + item.chance, 0);
  const random = Math.random() * totalChance;

  let current = 0;

  for (const outcome of spinOutcomes) {
    current += outcome.chance;

    if (random <= current) {
      return outcome;
    }
  }

  return spinOutcomes[0];
}

export function createSpinEvent() {
  latestSpin = {
    id: crypto.randomUUID(),
    outcome: pickWeightedOutcome(),
    createdAt: Date.now(),
  };

  return latestSpin;
}

export function getLatestSpin() {
  return latestSpin;
}
