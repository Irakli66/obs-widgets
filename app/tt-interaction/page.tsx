"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const items = [
  {
    id: "hat",
    image: "/images/HatMustache.png",
    text: "ბორბლის დატრიალება",
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
    }, 5000);

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
            <Image
              src={current.image}
              alt={current.text}
              width={160}
              height={160}
              className="w-40 h-40 object-contain"
            />

            <div
              className="text-white text-3xl font-bold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              style={{
                WebkitTextStroke: "1px black",
                fontFamily: "BPG Nino Mtavruli",
              }}
            >
              {current.text}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
