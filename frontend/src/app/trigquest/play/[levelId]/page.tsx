"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GameShell from "@/components/game/GameShell";
import LevelComplete from "@/components/game/LevelComplete";
import Level1NameSides from "@/components/game/levels/Level1NameSides";
import Level2RatioBuilder from "@/components/game/levels/Level2RatioBuilder";
import Level8SpeedRecall from "@/components/game/levels/Level8SpeedRecall";
import Level13TowerRescue from "@/components/game/levels/Level13TowerRescue";
import { getLevelById } from "@/lib/gameData";
import { loadGameState, completeLevel } from "@/lib/gameState";

interface PageProps {
  params: Promise<{ levelId: string }>;
}

const levelComponents: Record<
  string,
  React.ComponentType<{ onComplete: (xp: number) => void }>
> = {
  "name-the-sides": Level1NameSides,
  "ratio-builder": Level2RatioBuilder,
  "speed-recall": Level8SpeedRecall,
  "tower-rescue": Level13TowerRescue,
};

export default function PlayLevel({ params }: PageProps) {
  const { levelId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [xp, setXp] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [isRetry, setIsRetry] = useState(false);

  const level = getLevelById(levelId);

  useEffect(() => {
    const state = loadGameState();
    setXp(state.xp);
    // Determine if this is a retry: explicit query param or level already completed
    const retryParam = searchParams.get("retry") === "true";
    const alreadyCompleted = state.completedLevels.includes(levelId);
    setIsRetry(retryParam || alreadyCompleted);
  }, [searchParams, levelId]);

  const handleComplete = useCallback(
    (earned: number) => {
      const maxXp = level?.xpReward ?? earned;
      const newState = completeLevel(levelId, earned, maxXp);
      // Actual XP awarded may be less than `earned` due to the cap
      setXpEarned(newState.xp - xp);
      setTotalXp(newState.xp);
      setXp(newState.xp);
      setCompleted(true);
    },
    [levelId, level, xp],
  );

  if (!level) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">Level not found</p>
          <button
            onClick={() => router.push("/trigquest")}
            className="text-sm text-accent-light"
          >
            Back to map
          </button>
        </div>
      </div>
    );
  }

  const LevelComponent = levelComponents[levelId];

  if (!LevelComponent) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-2">
            Level &ldquo;{level.title}&rdquo;
          </p>
          <p className="text-white/30 text-sm mb-4">Coming soon</p>
          <button
            onClick={() => router.push("/trigquest")}
            className="text-sm text-accent-light"
          >
            Back to map
          </button>
        </div>
      </div>
    );
  }

  return (
    <GameShell levelId={levelId} xp={xp}>
      {completed ? (
        <LevelComplete
          levelId={levelId}
          xpEarned={xpEarned}
          totalXp={totalXp}
          maxXp={level?.xpReward ?? 0}
          isRetry={isRetry}
        />
      ) : (
        <LevelComponent onComplete={handleComplete} />
      )}
    </GameShell>
  );
}
