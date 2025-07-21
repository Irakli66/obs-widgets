// components/SocialsSlider.tsx
"use client";

import { motion } from "framer-motion";
import { Twitch, Twitter, Youtube } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function SocialsSlider() {
  const [currentSocial, setCurrentSocial] = useState(0);

  const socials = [
    {
      platform: "Twitch",
      handle: "@tynite66",
      icon: Twitch,
      color: "from-purple-500 to-purple-600",
    },
    {
      platform: "YouTube",
      handle: "@tynite",
      icon: Youtube,
      color: "from-red-500 to-red-600",
    },
    {
      platform: "Twitter",
      handle: "@tynite66",
      icon: Twitter,
      color: "from-blue-400 to-blue-500",
    },
    {
      platform: "Kick",
      handle: "@tynite", // Change to your actual handle
      icon: "/images/kickLogo.png", // Use image path instead of icon component
      color: "from-green-500 to-green-600",
      isImage: true,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSocial((prev) => (prev + 1) % socials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const social = socials[currentSocial];
  const isImage = social.isImage;

  return (
    <motion.div
      key={currentSocial}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative w-90 max-w-md p-6 rounded-lg shadow-2xl backdrop-blur-sm bg-black/30 border border-blue-500/20 overflow-hidden"
    >
      {/* Matching background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-indigo-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      {/* Animated shimmer border */}
      <motion.div
        className="absolute inset-0 rounded-lg border"
        animate={{
          borderColor: [
            "rgba(59, 130, 246, 0.3)",
            "rgba(14, 165, 233, 0.5)",
            "rgba(99, 102, 241, 0.4)",
            "rgba(59, 130, 246, 0.3)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Actual content */}
      <div className="relative z-10 flex items-center justify-center gap-4">
        <div className="text-white/80 text-base sm:text-lg font-medium">
          Follow me on
        </div>

        <div
          className={`p-3 rounded-xl bg-gradient-to-r ${social.color} flex items-center justify-center`}
        >
          {isImage ? (
            <Image
              src={social.icon}
              alt={social.platform}
              width={24}
              height={24}
              className="w-6 h-6 object-contain"
            />
          ) : (
            <social.icon className="w-6 h-6 text-white" />
          )}
        </div>

        <div className="text-left">
          <div className="text-white text-xl font-bold">{social.platform}</div>
          <div className="text-white/70 text-sm sm:text-base">
            {social.handle}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
