"use client";

import { motion } from "framer-motion";
import { useSpinStore } from "@/store/spinStore";
import {
  getSpinReelPattern,
  SPIN_REEL_REPEATS,
  SPIN_TILE_GAP,
  SPIN_TILE_WIDTH,
  SPIN_VIEWPORT_WIDTH,
  spinOutcomes,
} from "@/lib/spin-config";

const reelItems = Array.from({ length: SPIN_REEL_REPEATS }).flatMap(() =>
  getSpinReelPattern(),
);
const centerSpacer = SPIN_VIEWPORT_WIDTH / 2 - SPIN_TILE_WIDTH / 2;

function getTileTheme(id: string) {
  if (id === "try-again") {
    return {
      card: "border-white/25 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white",
      glow: "shadow-[0_10px_24px_rgba(0,0,0,0.7)]",
    };
  }

  const themes = [
    {
      card: "border-sky-200/50 bg-gradient-to-br from-sky-400 via-blue-500 to-blue-700 text-white",
      glow: "shadow-[0_10px_24px_rgba(37,99,235,0.5)]",
    },
    {
      card: "border-emerald-200/50 bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-700 text-white",
      glow: "shadow-[0_10px_24px_rgba(5,150,105,0.5)]",
    },
    {
      card: "border-amber-200/55 bg-gradient-to-br from-amber-300 via-orange-400 to-orange-600 text-zinc-950",
      glow: "shadow-[0_10px_24px_rgba(245,158,11,0.45)]",
    },
    {
      card: "border-fuchsia-200/55 bg-gradient-to-br from-fuchsia-400 via-pink-500 to-purple-700 text-white",
      glow: "shadow-[0_10px_24px_rgba(192,38,211,0.45)]",
    },
  ];

  const idx = spinOutcomes.findIndex((outcome) => outcome.id === id);
  return themes[idx % themes.length] ?? themes[0];
}

export default function SpinWheel() {
  const rotation = useSpinStore((s) => s.rotation);
  const spinDuration = useSpinStore((s) => s.spinDuration);
  const isPreparing = useSpinStore((s) => s.isPreparing);
  const isSpinning = useSpinStore((s) => s.isSpinning);
  const latestSpin = useSpinStore((s) => s.latestSpin);

  if (!latestSpin && !isSpinning) {
    return null;
  }
  const prepareAnimDuration = 0.9;

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-6">
      {isPreparing && (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.86 }}
          animate={{
            opacity: [0, 1, 1],
            y: [12, -4, -12],
            scale: [0.86, 1.08, 1],
            rotate: [0, -6, 6, -5, 5, 0],
          }}
          transition={{ duration: prepareAnimDuration, ease: "easeOut" }}
          className="pointer-events-none absolute -top-24 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2 rounded-xl border border-white/25 bg-black/70 px-6 py-4"
        >
          <motion.img
            src="/images/questionMark.png"
            alt="Lucky spin surprise"
            className="h-28 w-28 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
            animate={{
              rotate: [0, -9, 9, -7, 7, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: prepareAnimDuration, ease: "easeInOut" }}
          />
          <div className="text-2xl font-black uppercase tracking-wider text-white [text-shadow:0_2px_0_rgba(0,0,0,0.35)]">
            იღბლიანი დატრიალება!
          </div>
        </motion.div>
      )}

      {!isPreparing && (
        <>
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-40 h-40 w-[4px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.95)]" />
          <div className="pointer-events-none absolute left-1/2 top-[calc(50%-76px)] z-40 -translate-x-1/2 text-4xl text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.95)]">
            ▼
          </div>
          <div
            className="relative overflow-hidden rounded-2xl border border-white/20 bg-black/70 p-6 shadow-[0_25px_90px_rgba(0,0,0,0.75)] backdrop-blur-sm"
            style={{ width: `${SPIN_VIEWPORT_WIDTH}px` }}
          >
            <motion.div
              animate={{ x: -rotation }}
              transition={{
                duration: spinDuration,
                ease: [0.08, 0.72, 0.12, 1],
              }}
              className="flex items-center"
              style={{ gap: `${SPIN_TILE_GAP}px` }}
            >
              <div
                style={{ width: `${centerSpacer}px` }}
                className="shrink-0"
              />
              {reelItems.map((item, index) => {
                const theme = getTileTheme(item.id);
                return (
                  <div
                    key={`${item.id}-${index}`}
                    className={`flex h-32 shrink-0 items-center justify-center rounded-xl border-2 px-5 text-center text-3xl font-black uppercase tracking-wide [text-shadow:0_2px_0_rgba(0,0,0,0.35)] ${theme.card} ${theme.glow}`}
                    style={{ width: `${SPIN_TILE_WIDTH}px` }}
                  >
                    {item.label}
                  </div>
                );
              })}
              <div
                style={{ width: `${centerSpacer}px` }}
                className="shrink-0"
              />
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
