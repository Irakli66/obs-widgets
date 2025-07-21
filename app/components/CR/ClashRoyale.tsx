"use client";

import { motion } from "framer-motion";

export default function ClashRoyale() {
  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-indigo-500/10 animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex">
        {/* Left Side - Mobile Screen */}
        <div className="w-[550px] pt-15 px-5 pb-5 flex flex-col justify-center items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-[550px] h-full bg-black/30 backdrop-blur-sm rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="h-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-sky-500/10 to-indigo-500/10" />
              <div className="relative z-10 text-center">
                <div className="text-white/70 text-sm font-medium">
                  MOBILE GAMEPLAY
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Camera and Socials */}
        <div className=" pt-15 px-5 pb-5 flex flex-col justify-between">
          {/* Camera Cutout */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-[590px]"
          ></motion.div>

          {/* <SocialsSlider /> */}
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
