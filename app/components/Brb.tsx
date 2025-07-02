"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coffee, Clock } from "lucide-react";
import TwitchChat from "./TwitchChat";

export default function Brb() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    setIsClient(true);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Main Content Area */}
      <div className="flex-1 relative">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/25">
              <Coffee className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 mb-4">
              TYNITE
            </h1>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl md:text-3xl text-white font-semibold mb-2"
            >
              Be Right Back
            </motion.div>
            <div className="text-lg text-gray-300">Taking a quick break...</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-blue-400" />
                <span className="text-white font-semibold">Current Time</span>
              </div>
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl md:text-4xl font-mono font-bold text-white text-center"
              >
                {isClient ? formatCurrentTime() : "--:--:--"}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-6"
          >
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/50 text-white"
              >
                <span>☕</span>
                <span className="text-sm font-medium">Coffee Break</span>
              </motion.div>
              <motion.div
                animate={{
                  rotate: [0, -5, 5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/50 text-white"
              >
                <span>💬</span>
                <span className="text-sm font-medium">Chat Active</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(251, 146, 60, 0.3)",
                "0 0 40px rgba(251, 146, 60, 0.6)",
                "0 0 20px rgba(251, 146, 60, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 px-6 py-3 rounded-full text-white font-semibold text-sm"
          >
            I&apos;ll be back shortly!
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-400 text-sm max-w-md">
              Thanks for your patience! Feel free to chat while I&apos;m away.
              I&apos;ll be back in just a few minutes.
            </p>
          </motion.div>
        </div>
      </div>

      <TwitchChat />
    </div>
  );
}
