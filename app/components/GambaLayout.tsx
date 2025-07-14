"use client";

import { motion } from "framer-motion";

export default function GambaLayout() {
  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-indigo-500/10 animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      {/* Main Layout Container */}
      <div className="relative z-10 h-[800px] flex flex-col">
        {/* Top Bar - Reserved for your existing topbar */}

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Left Side - Camera on top, Chat below */}
          <div className="w-100 pt-15 px-5 pb-5 flex flex-col gap-4">
            {/* Camera Cutout - Top */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-64 bg-slate-900/95 backdrop-blur-sm rounded-2xl border border-blue-500/20 shadow-2xl overflow-hidden"
            >
              <div className="h-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-sky-500/10 to-indigo-500/10" />
                <div className="relative z-10 text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <div className="text-lg text-white font-semibold mb-1">
                    Camera
                  </div>
                  <div className="text-blue-300 text-sm">Face cam cutout</div>
                </div>
              </div>
            </motion.div>

            {/* Chat Cutout - Below Camera */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex-1 bg-slate-900/95 backdrop-blur-sm rounded-2xl border border-blue-500/20 shadow-2xl overflow-hidden"
            >
              <div className="h-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-sky-500/10 to-indigo-500/10" />
                <div className="relative z-10 text-center"></div>
              </div>
            </motion.div>
          </div>

          {/* Middle - Main Screen */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex-1 pt-15 px-5 pb-5"
          >
            <div className="h-[820px] bg-slate-900/95 backdrop-blur-sm rounded-2xl border border-blue-500/20 shadow-2xl overflow-hidden">
              <div className="h-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-sky-500/10 to-indigo-500/10" />
                <div className="relative z-10 text-center"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
            className="absolute bg-gradient-to-r from-blue-500 to-sky-500 rounded-full blur-sm"
            style={{
              width: 20 + i * 10,
              height: 20 + i * 10,
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
