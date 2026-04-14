"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { worlds, allLevels } from "@/lib/gameData";
import { loadGameState, isLevelUnlocked } from "@/lib/gameState";
import type { GameState } from "@/lib/gameState";
import { LevelIcon } from "@/components/game/LevelIcon";
import WorldIcon from "@/components/game/WorldIcon";

export default function TrigQuestHub() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    setGameState(loadGameState());
  }, []);

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
          <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/20 rounded-full px-3 py-1">
            <span className="text-xs text-accent-light/70 font-medium">XP</span>
            <span className="text-sm font-bold text-accent-light">{gameState?.xp ?? 0}</span>
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
                    className={`w-8 h-8 flex items-center justify-center ${
                      worldComplete
                        ? "text-success"
                        : "text-white/50"
                    }`}
                  >
                    <WorldIcon worldId={world.id} isComplete={worldComplete} />
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
                      allLevels,
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
                            <span className="font-mono text-[11px] text-white/35 w-5">
                              {level.number}
                            </span>
                            <div className="flex-1">
                              <span className="flex items-center gap-2 text-sm text-white/70 group-hover:text-foreground transition-colors">
                                <LevelIcon levelId={level.id} className="w-3.5 h-3.5 opacity-50 group-hover:opacity-80 transition-opacity" />
                                {level.title}
                              </span>
                              <span className="block text-[11px] text-white/25 ml-[22px]">
                                {level.subtitle}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-accent-light/50 group-hover:text-accent-light/80 transition-colors">
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
                            <span className="font-mono text-[11px] text-white/35 w-5">
                              {level.number}
                            </span>
                            <div className="flex-1">
                              <span className="flex items-center gap-2 text-sm text-white/40">
                                <LevelIcon levelId={level.id} className="w-3.5 h-3.5 opacity-30" />
                                {level.title}
                              </span>
                              <span className="block text-[11px] text-white/15 ml-[22px]">
                                {level.subtitle}
                              </span>
                            </div>
                            <span className="text-[10px] text-white/40">
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
