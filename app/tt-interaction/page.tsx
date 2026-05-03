"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  {
    id: "hat",
    image: "/images/HatMustache.png",
    text: "დატრიალება",
  },
  {
    id: "helmet",
    image: "/images/RacingHelmet.png",
    text: "დექის მოთხოვნა",
  },
];

export default function TTInteractionPage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000); // change speed here

    return () => clearInterval(interval);
  }, []);

  const current = items[index];

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <div className="w-[300px] h-[300px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <img
              src={current.image}
              alt={current.text}
              className="w-40 h-40 object-contain mb-4"
            />

            <div className="text-white text-2xl font-bold drop-shadow-lg">
              {current.text}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
