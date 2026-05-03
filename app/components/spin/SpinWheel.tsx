"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSpinStore } from "@/store/spinStore";

const segments = [
  { label: "Try Again" },
  { label: "Pushups" },
  { label: "Close Game" },
  { label: "Zoom Face" },
];

export default function SpinWheel() {
  const rotation = useSpinStore((s) => s.rotation);
  const isSpinning = useSpinStore((s) => s.isSpinning);
  const result = useSpinStore((s) => s.result);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="absolute -top-7 z-20 text-4xl">▼</div>

      <motion.div
        animate={{ rotate: rotation }}
        transition={{
          duration: 4,
          ease: [0.12, 0.8, 0.2, 1],
        }}
        className="relative h-[420px] w-[420px] rounded-full border-[10px] border-white/90 shadow-[0_0_35px_rgba(255,255,255,0.45)]"
        style={{
          background:
            "conic-gradient(#22c55e 0deg 216deg, #f97316 216deg 288deg, #ef4444 288deg 324deg, #3b82f6 324deg 360deg)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-white shadow-xl" />
        </div>

        {segments.map((segment, index) => {
          const angle = index * 90 + 45;

          return (
            <div
              key={segment.label}
              className="absolute left-1/2 top-1/2 origin-left text-xl font-black text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.9)]"
              style={{
                transform: `rotate(${angle}deg) translateX(95px) rotate(90deg)`,
              }}
            >
              {segment.label}
            </div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {result && !isSpinning && (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 rounded-2xl bg-black/70 px-8 py-4 text-center text-3xl font-black text-white shadow-2xl"
          >
            {result.label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
