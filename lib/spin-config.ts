export type SpinOutcome = {
  id: string;
  label: string;
  chance: number;
};

export const spinOutcomes: SpinOutcome[] = [
  {
    id: "try-again",
    label: "სცადე ხელახლა",
    chance: 70,
  },
  {
    id: "pushups",
    label: "აზიდვები",
    chance: 10,
  },
  {
    id: "close-game",
    label: "გათიშე თამაში",
    chance: 10,
  },
  {
    id: "zoom-face",
    label: "გაზუმე კამერა",
    chance: 10,
  },
];

export const SPIN_TILE_WIDTH = 180;
export const SPIN_TILE_GAP = 16;
export const SPIN_REEL_REPEATS = 24;
export const SPIN_VIEWPORT_WIDTH = 960;
export const SPIN_PATTERN_SLOTS = 40;

function shufflePattern<T>(array: T[]) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function getSpinReelPattern() {
  const validOutcomes = spinOutcomes.filter((outcome) => outcome.chance > 0);
  if (validOutcomes.length === 0) return [];

  const totalChance = validOutcomes.reduce(
    (sum, outcome) => sum + outcome.chance,
    0,
  );

  if (totalChance <= 0) return [];

  const exactCounts = validOutcomes.map((outcome) => ({
    outcome,
    exact: (outcome.chance / totalChance) * SPIN_PATTERN_SLOTS,
  }));

  const baseCounts = exactCounts.map((item) => ({
    outcome: item.outcome,
    count: Math.floor(item.exact),
    fraction: item.exact - Math.floor(item.exact),
  }));

  const assigned = baseCounts.reduce((sum, item) => sum + item.count, 0);
  let remaining = SPIN_PATTERN_SLOTS - assigned;

  if (remaining > 0) {
    const byFractionDesc = [...baseCounts].sort(
      (a, b) => b.fraction - a.fraction,
    );

    let cursor = 0;

    while (remaining > 0) {
      byFractionDesc[cursor % byFractionDesc.length].count += 1;
      remaining -= 1;
      cursor += 1;
    }
  }

  const pattern: SpinOutcome[] = [];

  for (const item of baseCounts) {
    for (let i = 0; i < item.count; i += 1) {
      pattern.push(item.outcome);
    }
  }

  return shufflePattern(pattern);
}
