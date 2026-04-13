"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { worlds, allLevels } from "@/lib/gameData";
import { loadGameState, isLevelUnlocked } from "@/lib/gameState";
import type { GameState } from "@/lib/gameState";

export default function TrigQuestHub() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    setGameState(loadGameState());
  }, []);

  const allLevelIds = allLevels.map((l) => l.id);
  const completedLevels = gameState?.completedLevels ?? [];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/[0.06]"
      >
        <Link
          href="/"
          className="text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          &larr; Home
        </Link>

        <div className="flex items-center gap-4">
          {gameState && gameState.currentStreak > 0 && (
            <span className="text-xs text-warning">
              {gameState.currentStreak} day streak
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-white/40">XP</span>
            <span className="text-sm font-bold">{gameState?.xp ?? 0}</span>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-white/25 mb-3">
            Chapter 8 &amp; 9 &mdash; Trigonometry
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            TrigTrek
          </h1>
          <p className="text-sm text-white/40 max-w-md mx-auto">
            Master trigonometry through 18 levels across 4 worlds. Every concept
            follows the NCERT curriculum exactly.
          </p>
        </motion.div>

        {/* Worlds */}
        <div className="space-y-16 md:space-y-24">
          {worlds.map((world, wi) => {
            const worldComplete = world.levels.every((l) =>
              completedLevels.includes(l.id),
            );

            return (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: wi * 0.1, duration: 0.5 }}
              >
                {/* World header */}
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border ${
                      worldComplete
                        ? "border-success/30 text-success bg-success/10"
                        : "border-white/[0.1] text-white/30 bg-surface"
                    }`}
                  >
                    {worldComplete ? "\u2713" : world.number}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{world.title}</h2>
                    <p className="text-xs text-white/30 mt-0.5">
                      {world.ncertRef} &middot; {world.subtitle}
                    </p>
                  </div>
                </div>

                {/* World description */}
                <p className="text-sm text-white/40 mb-6 pl-12 italic">
                  &ldquo;{world.description}&rdquo;
                </p>

                {/* Levels */}
                <div className="pl-12 space-y-1">
                  {world.levels.map((level, li) => {
                    const isComplete = completedLevels.includes(level.id);
                    const unlocked = isLevelUnlocked(
                      level.id,
                      completedLevels,
                      allLevelIds,
                    );
                    const isPlayable = level.implemented && unlocked;
                    const isLocked = !unlocked;

                    return (
                      <motion.div
                        key={level.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: wi * 0.1 + li * 0.04 }}
                      >
                        {isPlayable ? (
                          <Link
                            href={`/trigquest/play/${level.id}`}
                            className="group flex items-center gap-3 py-3 px-3 -mx-3 rounded-lg hover:bg-white/[0.03] transition-all duration-300"
                          >
                            <span className="w-6 text-center flex-shrink-0">
                              {isComplete ? (
                                <span className="text-success text-sm">
                                  &#10003;
                                </span>
                              ) : (
                                <motion.span
                                  animate={{ opacity: [0.4, 1, 0.4] }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                  }}
                                  className="inline-block w-2 h-2 rounded-full bg-accent-light"
                                />
                              )}
                            </span>
                            <span className="font-mono text-[11px] text-white/20 w-5">
                              {level.number}
                            </span>
                            <div className="flex-1">
                              <span className="text-sm text-white/70 group-hover:text-foreground transition-colors">
                                {level.title}
                              </span>
                              <span className="block text-[11px] text-white/25">
                                {level.subtitle}
                              </span>
                            </div>
                            <span className="text-xs text-white/15 group-hover:text-white/30 transition-colors">
                              {level.xpReward} XP
                            </span>
                          </Link>
                        ) : (
                          <div
                            className={`flex items-center gap-3 py-3 px-3 -mx-3 ${
                              isLocked ? "opacity-30" : "opacity-50"
                            }`}
                          >
                            <span className="w-6 text-center flex-shrink-0 text-white/15 text-xs">
                              {isLocked ? "\u25CF" : "\u25CB"}
                            </span>
                            <span className="font-mono text-[11px] text-white/15 w-5">
                              {level.number}
                            </span>
                            <div className="flex-1">
                              <span className="text-sm text-white/40">
                                {level.title}
                              </span>
                              <span className="block text-[11px] text-white/15">
                                {level.subtitle}
                              </span>
                            </div>
                            <span className="text-[10px] text-white/10">
                              {!level.implemented
                                ? "coming soon"
                                : "locked"}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Divider between worlds */}
                {wi < worlds.length - 1 && (
                  <div className="mt-8 h-px bg-white/[0.04]" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
