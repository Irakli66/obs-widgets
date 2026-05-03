export type SpinOutcome = {
  id: string;
  label: string;
  chance: number;
};

export const spinOutcomes: SpinOutcome[] = [
  {
    id: "try-again",
    label: "Try Again",
    chance: 60,
  },
  {
    id: "pushups",
    label: "Pushups",
    chance: 20,
  },
  {
    id: "close-game",
    label: "Close Game",
    chance: 10,
  },
  {
    id: "zoom-face",
    label: "Zoom Face",
    chance: 10,
  },
];
