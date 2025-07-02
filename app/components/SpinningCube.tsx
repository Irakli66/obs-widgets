"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ChevronRight,
  Activity,
  Camera,
  BarChart3,
  Clock,
  Zap,
  Users,
  Trophy,
  Settings,
  Music,
} from "lucide-react";
import { useRouter } from "next/navigation";

const navigationItems = [
  {
    id: "faceit",
    title: "FaceIT Stats",
    description: "View your competitive performance and statistics",
    icon: Trophy,
    color: "from-orange-500 to-red-500",
    route: "/faceit-stats",
    features: ["Real-time stats", "Match history", "Skill progression"],
  },
  {
    id: "spotify",
    title: "Spotify music",
    description: "Showing currently playing song on spotify",
    icon: Music,
    color: "from-blue-500 to-cyan-500",
    route: "/spotify/now-playing",
    features: ["Live preview", "Custom design", "Scene transitions"],
  },
  {
    id: "camera",
    title: "Camera Frame",
    description: "Customizable overlay for streaming setup",
    icon: Camera,
    color: "from-blue-500 to-cyan-500",
    route: "/camera-frame",
    features: ["Live preview", "Custom overlays", "Scene transitions"],
  },
  {
    id: "topbar",
    title: "Top Bar Widget",
    description: "Essential information display for your stream",
    icon: BarChart3,
    color: "from-emerald-500 to-teal-500",
    route: "/top-bar?twitch=true",
    features: ["Custom metrics", "Live updates", "Minimal design"],
  },
  {
    id: "startingsoon",
    title: "Starting Soon",
    description: "Countdown and pre-stream engagement screen",
    icon: Clock,
    color: "from-purple-500 to-pink-500",
    route: "/starting-soon",
    features: ["Countdown timer", "Chat interaction", "Custom branding"],
  },
];

import React from "react";

const FloatingElement = ({
  delay = 0,
  children,
  className = "",
}: {
  delay?: number;
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

type NavigationItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  route: string;
  features: string[];
};

interface NavigationCardProps {
  item: NavigationItem;
  index: number;
  onNavigate: (route: string) => void;
}

const NavigationCard = ({ item, index, onNavigate }: NavigationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onNavigate(item.route)}
    >
      {/* Glow effect */}
      <motion.div
        className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-1000`}
        animate={{ opacity: isHovered ? 0.75 : 0 }}
      />

      {/* Main card */}
      <div className="relative bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className={`p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-lg`}
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>

          <motion.div
            animate={{ x: isHovered ? 5 : 0, opacity: isHovered ? 1 : 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
            {item.title}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed">
            {item.description}
          </p>

          {/* Features */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 pt-2 border-t border-gray-800"
              >
                {item.features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 text-xs text-gray-500"
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.color}`}
                    />
                    {feature}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default function TyniteNavigation() {
  const router = useRouter();
  const handleNavigation = (route: string) => {
    router.push(route);
    // Replace with actual navigation logic
    // router.push(route);
  };

  return (
    <div className="md:min-h-screen max-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-y-auto lg:overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <FloatingElement>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text">
                TYNITE
              </h1>
            </motion.div>
          </FloatingElement>

          <FloatingElement delay={0.2}>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Your all-in-one streaming toolkit. Professional widgets and
              overlays to elevate your content.
            </p>
          </FloatingElement>

          <FloatingElement delay={0.4}>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span>Live Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Multi-Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-purple-400" />
                <span>Fully Customizable</span>
              </div>
            </div>
          </FloatingElement>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {navigationItems.map((item, index) => (
            <NavigationCard
              key={item.id}
              item={item}
              index={index}
              onNavigate={handleNavigation}
            />
          ))}
        </div>

        {/* Footer */}
        <FloatingElement delay={0.8} className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>All systems operational</span>
          </div>
        </FloatingElement>
      </div>
    </div>
  );
}
