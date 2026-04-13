"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getLevelById, getWorldForLevel } from "@/lib/gameData";

interface GameShellProps {
  levelId: string;
  xp: number;
  children: React.ReactNode;
}

export default function GameShell({ levelId, xp, children }: GameShellProps) {
  const level = getLevelById(levelId);
  const world = getWorldForLevel(levelId);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/[0.06]"
      >
        <Link
          href="/trigquest"
          className="text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          &larr; Back
        </Link>

        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/25">
            {world?.title}
          </p>
          <p className="text-sm font-medium">{level?.title}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-white/40">XP</span>
          <motion.span
            key={xp}
            initial={{ scale: 1.3, color: "#a29bfe" }}
            animate={{ scale: 1, color: "#f5f5f7" }}
            className="text-sm font-bold"
          >
            {xp}
          </motion.span>
        </div>
      </motion.div>

      {/* Game area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {children}
      </div>
    </div>
  );
}
