"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface PromoSlide {
  id: string;
  src?: string;
  alt?: string;
  title?: string;
  code?: string;
  description?: string;
  backgroundColor?: string;
}

interface PromotionSliderProps {
  slides?: PromoSlide[];
  autoPlayInterval?: number;
  className?: string;
}

const defaultSlides: PromoSlide[] = [
  {
    id: "stake-casino",
    src: "/images/stake-logo.png",
    alt: "Stake Casino",
    code: "TYNITE",
    title: "Stake.com",
    description: "Get exclusive bonuses!",
    backgroundColor: "from-green-600/20 to-emerald-600/20",
  },
];

export default function PromotionSlider({
  slides = defaultSlides,
  autoPlayInterval = 6000,
  className = "",
}: PromotionSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [slides.length, autoPlayInterval, isClient]);

  if (!isClient) {
    return (
      <div
        className={`bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden h-32 ${className}`}
      >
        <div className="h-full flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden h-32 ${className}`}
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          slides[currentSlide]?.backgroundColor ||
          "from-purple-600/20 to-blue-600/20"
        } transition-all duration-1000`}
      />

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="text-center w-full max-w-md mx-auto"
          >
            <div className="flex items-center justify-center gap-6 text-left">
              {/* Logo/Image */}
              {slides[currentSlide]?.src && (
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative aspect-video h-20 sm:h-24 md:h-28 w-auto flex-shrink-0"
                >
                  <Image
                    src={slides[currentSlide].src!}
                    alt={slides[currentSlide].alt || "Logo"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 120px, 150px"
                  />
                </motion.div>
              )}

              {/* Promo Content */}
              <div className="space-y-1">
                {/* Domain/Brand name */}
                <h2 className="text-white font-semibold text-base sm:text-lg">
                  {slides[currentSlide]?.description} on <br />
                  <span className="text-blue-300 text-bold">
                    {slides[currentSlide]?.title}
                  </span>
                </h2>

                {/* Promo Text */}

                {/* Code Badge */}
                <div className="flex gap-2 items-center">
                  <p className="text-sm text-gray-300">Use code </p>
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-1.5 rounded-lg text-white font-mono font-bold text-sm border border-white/20">
                    TYNITE
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white shadow-lg"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
