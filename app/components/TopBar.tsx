"use client";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect, SVGProps } from "react";
import { Youtube, Users, Eye, Clock, Twitch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function TopBar() {
  const searchParams = useSearchParams();
  const isTwitch = searchParams.get("twitch") === "true";

  const [time, setTime] = useState(new Date());
  const [streamData, setStreamData] = useState({
    isLive: false,
    viewers: 0,
    followers: 0,
    uptime: "00:00:00",
    startedAt: null as Date | null,
    title: "",
    game: "",
    fps: "60 FPS",
  });

  const fetchStreamData = async () => {
    try {
      const res = await fetch(isTwitch ? "/api/twitch" : "/api/kick/stream");
      const data = await res.json();

      if (isTwitch) {
        const stream = data.stream;
        setStreamData((prev) => ({
          ...prev,
          isLive: !!stream,
          viewers: stream?.viewer_count || 0,
          followers: data.followers || 0,
          startedAt: stream?.started_at ? new Date(stream.started_at) : null,
          title: stream?.title || "",
          game: stream?.game_name || "",
        }));
      } else {
        setStreamData((prev) => ({
          ...prev,
          isLive: data.isLive,
          viewers: data?.viewers || 0,
          followers: data.followers || 0,
          startedAt: data?.startedAt
            ? new Date(data.startedAt.replace(" ", "T") + "Z") // Kick fix
            : null,
          title: data?.title || "",
          game: data?.game || "",
        }));
      }
    } catch (err) {
      console.error("Failed to fetch stream data", err);
    }
  };

  const calculateUptime = () => {
    if (!streamData.startedAt) return "00:00:00";
    const now = new Date();
    const diff = now.getTime() - streamData.startedAt.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const timeTimer = setInterval(() => setTime(new Date()), 1000);
    fetchStreamData();
    const dataTimer = setInterval(fetchStreamData, 30000);
    return () => {
      clearInterval(timeTimer);
      clearInterval(dataTimer);
    };
  }, [isTwitch]);

  useEffect(() => {
    if (!streamData.isLive) return;
    const uptimeTimer = setInterval(() => {
      setStreamData((prev) => ({
        ...prev,
        uptime: calculateUptime(),
      }));
    }, 1000);
    return () => clearInterval(uptimeTimer);
  }, [streamData.isLive, streamData.startedAt]);

  const formattedTime = time.toUTCString().split(" ")[4];
  const formattedDate = time.toUTCString().split(" ").slice(0, 4).join(" ");

  const XIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M21.5 2h-3.6l-5.3 6.7L7 2H2l7.8 10.4L2 22h3.6l5.3-6.7L17 22h5l-7.8-10.4L21.5 2z" />
    </svg>
  );
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full relative flex items-center justify-between px-4 py-2 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-slate-900/95 backdrop-blur-md border-b border-blue-500/20 shadow-2xl"
      >
        {/* Animated background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-indigo-500/10 animate-pulse" />

        {/* Left Section - Brand & Live Status */}
        <div className="flex items-center gap-4 z-10">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
            <span className="text-white font-bold text-sm">T</span>
          </div> */}
            <Image
              src="/images/tyniteprime-removebg.png"
              width={32}
              height={32}
              alt="T"
              className="w-full h-full"
            />
            <h2 className="text-white text-sm font-bold tracking-wide">
              TYNITE
            </h2>
          </motion.div>

          {/* Live Indicator */}
          <motion.div
            className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              streamData.isLive
                ? "bg-red-500/20 border border-red-500/40"
                : "bg-blue-600/20 border border-blue-600/40"
            }`}
            animate={streamData.isLive ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                streamData.isLive ? "bg-red-500" : "bg-blue-400"
              } ${streamData.isLive ? "animate-pulse" : ""}`}
            />
            <span className="text-white text-xs font-semibold">
              {streamData.isLive ? "LIVE" : "OFFLINE"}
            </span>
          </motion.div>
        </div>

        {/* Center Section - Stream Stats */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-6 z-10 pointer-events-none">
          <motion.div
            className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.6)" }}
          >
            <Eye className="w-3 h-3 text-sky-400" />
            <span className="text-white text-xs font-semibold">
              {streamData.viewers.toLocaleString()}
            </span>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.6)" }}
          >
            <Users className="w-3 h-3 text-green-400" />
            <span className="text-white text-xs font-semibold">
              {streamData.followers.toLocaleString()}
            </span>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.6)" }}
          >
            <Clock className="w-3 h-3 text-yellow-400" />
            <span className="text-white text-xs font-semibold">
              {streamData.uptime}
            </span>
          </motion.div>
        </div>

        {/* Right Section - Social & Time */}
        <div className="flex items-center gap-4 z-10">
          {/* Social Links */}
          <div className="flex items-center gap-3">
            <motion.div
              className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.6)" }}
              whileTap={{ scale: 0.95 }}
            >
              <XIcon className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-semibold">
                @tynite66
              </span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,0,0,0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Youtube className="w-4 h-4 text-red-500" />
              <span className="text-white text-xs font-semibold">tynite</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(0,255,0,0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/images/kickLogo.png"
                width={16}
                height={16}
                alt="kick logo"
              />
              <span className="text-white text-xs font-semibold">tynite</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,0,0,0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Twitch className="w-4 h-4 text-violet-500" />
              <span className="text-white text-xs font-semibold">tynite66</span>
            </motion.div>
          </div>

          {/* Connection Status */}

          {/* Date & Time */}
          <div className="text-right">
            <div className="text-white text-xs font-bold">{formattedTime}</div>
            <div className="text-blue-300 text-xs">{formattedDate}</div>
          </div>
        </div>

        {/* Subtle animated border */}
        {/* <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500"
        animate={{ width: ["0%", "100%", "0%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      /> */}
      </motion.div>
      <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-200 p-4 rounded shadow text-center">
        Currently showing <strong>{isTwitch ? "Twitch" : "Kick"}</strong> stream
        data.
        <br />
        To view <strong>{isTwitch ? "Kick" : "Twitch"}</strong> data instead,
        set <code>twitch={isTwitch ? "false" : "true"}</code> in the URL or
        click{" "}
        <Link
          href={`/top-bar?twitch=${isTwitch ? "false" : "true"}`}
          className="underline cursor-pointer"
        >
          HERE
        </Link>
        .
      </p>
    </div>
  );
}
