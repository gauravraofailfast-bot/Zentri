"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getNextLevel, getLevelById } from "@/lib/gameData";
import { loadGameState } from "@/lib/gameState";

interface LevelCompleteProps {
  levelId: string;
  xpEarned: number;
  totalXp: number;
  maxXp: number;
  isRetry?: boolean;
  bonusMessage?: string;
}

export default function LevelComplete({
  levelId,
  xpEarned,
  totalXp,
  maxXp,
  isRetry,
  bonusMessage,
}: LevelCompleteProps) {
  const nextLevel = getNextLevel(levelId);
  const currentLevel = getLevelById(levelId);

  // Calculate leftover XP available on retry
  const state = loadGameState();
  const cumulativeEarned = state.levelXpEarned?.[levelId] || 0;
  const leftoverXp = Math.max(0, maxXp - cumulativeEarned);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center max-w-sm mx-auto"
    >
      {/* Celebration burst */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 border border-success/20 flex items-center justify-center"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="text-3xl"
        >
          &#10003;
        </motion.span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold mb-2"
      >
        Level Complete!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-white/50 text-sm mb-8"
      >
        {currentLevel?.title}
      </motion.p>

      {/* XP earned */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-6 mb-4"
      >
        <div>
          <p className="text-xs text-white/30 mb-1">Earned</p>
          <p className="text-2xl font-bold text-accent-light">+{xpEarned} XP</p>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div>
          <p className="text-xs text-white/30 mb-1">Total</p>
          <p className="text-2xl font-bold">{totalXp} XP</p>
        </div>
      </motion.div>

      {isRetry && xpEarned === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-xs text-white/40 mb-8"
        >
          You&apos;ve already earned all XP for this level!
        </motion.p>
      )}

      {bonusMessage && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-warning mb-8"
        >
          {bonusMessage}
        </motion.p>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col gap-3 mt-8"
      >
        {nextLevel?.implemented && (
          <Link
            href={`/trigquest/play/${nextLevel.id}`}
            className="px-6 py-3 text-sm uppercase tracking-[0.1em] font-medium text-accent-light border border-accent/30 rounded-full hover:border-accent/60 hover:shadow-[0_0_30px_rgba(108,92,231,0.15)] transition-all duration-500 text-center"
          >
            Next Level &rarr;
          </Link>
        )}
        {leftoverXp > 0 ? (
          <Link
            href={`/trigquest/play/${levelId}?retry=true`}
            className="px-6 py-3 text-sm text-white/30 border border-white/10 rounded-full hover:text-white/50 hover:border-white/20 transition-all duration-300 text-center"
          >
            Retry for up to {leftoverXp} more XP
          </Link>
        ) : (
          <Link
            href={`/trigquest/play/${levelId}?retry=true`}
            className="px-6 py-3 text-sm text-white/30 border border-white/10 rounded-full hover:text-white/50 hover:border-white/20 transition-all duration-300 text-center"
          >
            Play Again
          </Link>
        )}
        <Link
          href="/trigquest"
          className="px-6 py-3 text-sm text-white/40 hover:text-white/70 transition-colors text-center"
        >
          Back to Map
        </Link>
      </motion.div>
    </motion.div>
  );
}
