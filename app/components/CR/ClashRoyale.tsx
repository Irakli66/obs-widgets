"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const themes = {
  black: {
    background: "from-black via-zinc-900 to-black",
    gradient: "from-zinc-500/5 via-slate-500/5 to-zinc-500/5",
    radial: "rgba(161,161,170,0.08)",
    orbs: "from-zinc-400 via-slate-300 to-zinc-400",
    shine: "via-zinc-400/5",
  },
  blue: {
    background: "from-slate-900 via-blue-900 to-slate-900",
    gradient: "from-blue-500/10 via-sky-500/10 to-indigo-500/10",
    radial: "rgba(59,130,246,0.1)",
    orbs: "from-blue-500 to-sky-500",
    shine: "via-blue-400/5",
  },
  green: {
    background: "from-black via-emerald-950 to-black",
    gradient: "from-emerald-500/8 via-teal-500/8 to-emerald-500/8",
    radial: "rgba(16,185,129,0.1)",
    orbs: "from-emerald-400 via-teal-300 to-emerald-400",
    shine: "via-emerald-400/5",
  },
  purple: {
    background: "from-black via-purple-950 to-black",
    gradient: "from-purple-500/8 via-fuchsia-500/8 to-purple-500/8",
    radial: "rgba(168,85,247,0.1)",
    orbs: "from-purple-400 via-fuchsia-300 to-purple-400",
    shine: "via-purple-400/5",
  },
};

function ClashRoyaleContent() {
  const searchParams = useSearchParams();
  const themeParam = searchParams.get("theme") || "black";
  const theme = themes[themeParam as keyof typeof themes] || themes.black;

  return (
    <div
      className={`h-screen w-full relative overflow-hidden bg-gradient-to-br ${theme.background}`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} animate-pulse`}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--radial-color),transparent_50%)]"
          style={{ "--radial-color": theme.radial } as React.CSSProperties}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(161,161,170,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(161,161,170,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex">
        {/* Left Side - Mobile Screen */}
        <div className="w-[550px] pt-15 px-5 pb-5 flex flex-col justify-center items-center"></div>

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
              opacity: [0.15, 0.35, 0.15],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
            className={`absolute bg-gradient-to-r ${theme.orbs} rounded-full blur-xl`}
            style={{
              width: 20 + i * 10,
              height: 20 + i * 10,
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Subtle shine effect overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2,
          }}
          className={`absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent ${theme.shine} to-transparent skew-x-12`}
        />
      </div>
    </div>
  );
}

export default function ClashRoyale() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-black" />}>
      <ClashRoyaleContent />
    </Suspense>
  );
}
