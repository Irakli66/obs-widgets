"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import tmi, { ChatUserstate } from "tmi.js";

// ⚠️ Replace this with your actual Twitch channel
const TWITCH_CHANNEL = process.env.TWITCH_USERNAME || "tynite66";

type ChatMessage = {
  id: number;
  username: string;
  message: string;
  timestamp: string;
  badges: string[];
};

export default function StartingSoon() {
  const [countdown, setCountdown] = useState(300);
  const [currentTime, setCurrentTime] = useState(new Date());
  //   const [animationPhase, setAnimationPhase] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

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

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "moderator":
        return "bg-green-500";
      case "subscriber":
        return "bg-purple-500";
      case "vip":
        return "bg-yellow-500";
      case "follower":
        return "bg-blue-500";
      case "broadcaster":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  useEffect(() => {
    setIsClient(true);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    // const phaseTimer = setInterval(() => {
    //   setAnimationPhase((prev) => (prev + 1) % 4);
    // }, 3000);

    const client = new tmi.Client({
      options: { debug: false },
      connection: { secure: true, reconnect: true },
      channels: [TWITCH_CHANNEL],
    });

    client.connect();

    client.on(
      "message",
      (_channel, tags: ChatUserstate, message: string, self: boolean) => {
        if (self) return;

        const msg: ChatMessage = {
          id: Date.now(),
          username: tags["display-name"] || tags.username || "unknown",
          message,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          badges: Object.keys(tags.badges || {}),
        };

        setChatMessages((prev) => [...prev.slice(-19), msg]);
      }
    );

    return () => {
      clearInterval(timer);
      //   clearInterval(phaseTimer);
      client.disconnect();
    };
  }, []);

  //   const upcomingFeatures = [
  //     { icon: "🎮", text: "New Game Launch", active: animationPhase === 0 },
  //     { icon: "🎵", text: "Music Requests", active: animationPhase === 1 },
  //     { icon: "💬", text: "Subscriber Chat", active: animationPhase === 2 },
  //     { icon: "🎁", text: "Giveaway Event", active: animationPhase === 3 },
  //   ];

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
          {/* <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
          </motion.div> */}

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mb-4">
              TYNITE
            </h1>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl md:text-2xl text-white font-semibold"
            >
              Stream Starting Soon...
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl">
              <motion.div
                key={countdown}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
                className="text-4xl md:text-5xl font-mono font-bold text-white text-center"
              >
                {formatTime(countdown)}
              </motion.div>
              {/* <div className="text-center text-gray-300 mt-2 text-sm">
                Minutes : Seconds
              </div> */}
            </div>
          </motion.div>

          {/* <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-6"
          >
            <h3 className="text-lg text-white font-semibold mb-3 text-center">
              Coming Up Today:
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {upcomingFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-500 ${
                    feature.active
                      ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-400/50 text-white"
                      : "bg-black/20 border-gray-600/30 text-gray-400"
                  }`}
                  animate={
                    feature.active ? { scale: [1, 1.05, 1] } : { scale: 1 }
                  }
                  transition={{ duration: 0.5 }}
                >
                  <span>{feature.icon}</span>
                  <span className="text-xs font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div> */}

          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(147, 51, 234, 0.3)",
                "0 0 40px rgba(147, 51, 234, 0.6)",
                "0 0 20px rgba(147, 51, 234, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-full text-white font-semibold text-sm"
          >
            Get Ready to Stream!
          </motion.div>
          <div className="mt-3 text-gray-300 text-sm">
            Current Time: {isClient ? formatCurrentTime() : "--:--:--"}
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="w-80 bg-black/20 backdrop-blur-md border-l border-gray-700/30 flex flex-col"
      >
        <div className="p-4 border-b border-gray-700/30">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold">Stream Chat</h3>
            <div className="ml-auto bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
              {chatMessages.length} online
            </div>
          </div>
          <p className="text-gray-400 text-xs">Live from Twitch</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group hover:bg-white/5 p-2 rounded-lg transition-colors"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex gap-1">
                        {msg.badges.map((badge, index) => (
                          <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${getBadgeColor(
                              badge
                            )}`}
                            title={badge}
                          />
                        ))}
                      </div>
                      <span className="text-white font-semibold text-sm">
                        {msg.username}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
