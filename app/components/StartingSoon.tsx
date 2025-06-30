"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Play,
  //   Users,
  //   Heart,
  //   MessageCircle,
  //   Zap,
  //   Gamepad2,
  //   Music,
  //   Headphones,
} from "lucide-react";

export default function StartingSoon() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  //   const [animationPhase, setAnimationPhase] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Static particles data to avoid hydration mismatch
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: (i * 7.13) % 100, // Deterministic positioning
    y: (i * 11.37) % 100,
    size: 2 + (i % 4),
    speed: 1 + (i % 2),
    opacity: 0.3 + (i % 5) * 0.1,
  }));

  useEffect(() => {
    setIsClient(true);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    // const phaseTimer = setInterval(() => {
    //   setAnimationPhase((prev) => (prev + 1) % 4);
    // }, 3000);

    return () => {
      clearInterval(timer);
      //   clearInterval(phaseTimer);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  //   const socialStats = [
  //     { icon: Users, label: "Followers", value: "8.9K", color: "text-blue-400" },
  //     { icon: Heart, label: "Likes", value: "24.1K", color: "text-red-400" },
  //     {
  //       icon: MessageCircle,
  //       label: "Comments",
  //       value: "1.2K",
  //       color: "text-green-400",
  //     },
  //   ];

  //   const upcomingFeatures = [
  //     { icon: Gamepad2, text: "New Game Launch", active: animationPhase === 0 },
  //     { icon: Music, text: "Music Requests", active: animationPhase === 1 },
  //     { icon: Headphones, text: "Subscriber Chat", active: animationPhase === 2 },
  //     { icon: Zap, text: "Giveaway Event", active: animationPhase === 3 },
  //   ];

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

        {/* Floating Particles - Only render on client */}
        {isClient &&
          particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-white/20"
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: particle.opacity,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [
                  particle.opacity,
                  particle.opacity * 0.3,
                  particle.opacity,
                ],
              }}
              transition={{
                duration: particle.speed * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
        {/* Brand Logo */}
        {/* <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
            <span className="text-white font-bold text-3xl">T</span>
          </div>
        </motion.div> */}

        {/* Main Title */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mb-4">
            TYNITE
          </h1>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl md:text-3xl text-white font-semibold"
          >
            Stream Starting Soon...
          </motion.div>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <div className="bg-black/40 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
            <motion.div
              key={countdown}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="text-6xl md:text-7xl font-mono font-bold text-white text-center"
            >
              {formatTime(countdown)}
            </motion.div>
            {/* <div className="text-center text-gray-300 mt-2 text-lg">
              Minutes : Seconds
            </div> */}
          </div>
        </motion.div>

        {/* Upcoming Features */}
        {/* <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mb-8"
        >
          <h3 className="text-xl text-white font-semibold mb-4 text-center">
            Coming Up Today:
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {upcomingFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 ${
                  feature.active
                    ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-400/50 text-white"
                    : "bg-black/20 border-gray-600/30 text-gray-400"
                }`}
                animate={
                  feature.active ? { scale: [1, 1.05, 1] } : { scale: 1 }
                }
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div> */}

        {/* Social Stats */}
        {/* <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex gap-6 mb-8"
        >
          {socialStats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center min-w-[100px]"
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="text-white font-bold text-lg">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div> */}

        {/* Call to Action */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-center"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(147, 51, 234, 0.3)",
                "0 0 40px rgba(147, 51, 234, 0.6)",
                "0 0 20px rgba(147, 51, 234, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-full text-white font-semibold text-lg"
          >
            <Play className="w-5 h-5" />
            Get Ready to Stream!
          </motion.div>
          <div className="mt-4 text-gray-300">
            Current Time: {isClient ? formatCurrentTime() : "--:--:--"}
          </div>
        </motion.div>
      </div>

      {/* Animated Border */}
      <motion.div
        className="absolute inset-0 border-8 border-transparent"
        style={{
          background:
            "linear-gradient(45deg, rgba(147, 51, 234, 0.4), rgba(59, 130, 246, 0.4), rgba(6, 182, 212, 0.4)) border-box",
          WebkitMask:
            "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "exclude",
        }}
        animate={{
          background: [
            "linear-gradient(0deg, rgba(147, 51, 234, 0.4), rgba(59, 130, 246, 0.4), rgba(6, 182, 212, 0.4))",
            "linear-gradient(90deg, rgba(147, 51, 234, 0.4), rgba(59, 130, 246, 0.4), rgba(6, 182, 212, 0.4))",
            "linear-gradient(180deg, rgba(147, 51, 234, 0.4), rgba(59, 130, 246, 0.4), rgba(6, 182, 212, 0.4))",
            "linear-gradient(270deg, rgba(147, 51, 234, 0.4), rgba(59, 130, 246, 0.4), rgba(6, 182, 212, 0.4))",
            "linear-gradient(360deg, rgba(147, 51, 234, 0.4), rgba(59, 130, 246, 0.4), rgba(6, 182, 212, 0.4))",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
