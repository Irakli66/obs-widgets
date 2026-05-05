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
              className="text-white text-2xl font-bold tracking-[0.05em]"
              style={{
                fontFamily: "BPG Nino Mtavruli",
                textShadow: `
      2px 2px 0 #000,
      -2px 2px 0 #000,
      2px -2px 0 #000,
      -2px -2px 0 #000,
      0px 2px 0 #000,
      2px 0px 0 #000,
      -2px 0px 0 #000,
      0px -2px 0 #000
    `,
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
