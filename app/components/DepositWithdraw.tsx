"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export default function DepositWithdraw() {
  const searchParams = useSearchParams();
  const deposit = searchParams.get("deposit") || "0";
  const withdraw = searchParams.get("withdraw") || "0";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative bg-black/30  backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 shadow-2xl overflow-hidden w-full max-w-sm"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-indigo-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      {/* Animated subtle border shimmer */}
      <motion.div
        className="absolute inset-0 rounded-2xl border"
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

      <div className="relative z-10">
        <div className="grid grid-cols-2 gap-2">
          {/* Deposit */}
          <motion.div
            className="bg-gradient-to-br from-red-600/20 to-red-500/10 border border-red-400/30  rounded-xl p-4 shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownCircle className="text-red-400 w-5 h-5" />
              <span className="text-sm text-red-300 font-medium">Deposit</span>
            </div>
            <p className="text-xl text-white font-bold">${deposit}</p>
          </motion.div>

          {/* Withdraw */}
          <motion.div
            className="bg-gradient-to-br from-green-600/20 to-green-500/10 border border-green-400/30  rounded-xl p-4 shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpCircle className="text-green-400  w-5 h-5" />
              <span className="text-sm  text-green-300  font-medium">
                Withdraw
              </span>
            </div>
            <p className="text-xl text-white font-bold">${withdraw}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
