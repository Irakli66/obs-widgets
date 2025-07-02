"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import tmi, { ChatUserstate } from "tmi.js";

// replace string with you twitch username as a fallback
const TWITCH_CHANNEL = process.env.TWITCH_USERNAME || "tynite66";

type ChatMessage = {
  id: number;
  username: string;
  message: string;
  timestamp: string;
  badges: string[];
};

interface TwitchChatProps {
  className?: string;
}

export default function TwitchChat({ className = "" }: TwitchChatProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

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
      client.disconnect();
    };
  }, []);

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className={`w-80 bg-black/20 backdrop-blur-md border-l border-gray-700/30 flex flex-col ${className}`}
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
  );
}
