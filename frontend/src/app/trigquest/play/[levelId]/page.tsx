"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GameShell from "@/components/game/GameShell";
import LevelComplete from "@/components/game/LevelComplete";
import Level1NameSides from "@/components/game/levels/Level1NameSides";
import Level2RatioBuilder from "@/components/game/levels/Level2RatioBuilder";
import Level3RatioChain from "@/components/game/levels/Level3RatioChain";
import Level4SizeDoesntMatter from "@/components/game/levels/Level4SizeDoesntMatter";
import Level5The45Stone from "@/components/game/levels/Level5The45Stone";
import Level6The3060Stones from "@/components/game/levels/Level6The3060Stones";
import Level7EdgeStones from "@/components/game/levels/Level7EdgeStones";
import Level8SpeedRecall from "@/components/game/levels/Level8SpeedRecall";
import Level9AngleDetective from "@/components/game/levels/Level9AngleDetective";
import Level10FirstLaw from "@/components/game/levels/Level10FirstLaw";
import Level11OtherTwoLaws from "@/components/game/levels/Level11OtherTwoLaws";
import Level12EquationBalancer from "@/components/game/levels/Level12EquationBalancer";
import Level13TowerRescue from "@/components/game/levels/Level13TowerRescue";
import Level14LadderMission from "@/components/game/levels/Level14LadderMission";
import Level15DontForgetHeight from "@/components/game/levels/Level15DontForgetHeight";
import Level16StackedObjects from "@/components/game/levels/Level16StackedObjects";
import Level17ShadowHunter from "@/components/game/levels/Level17ShadowHunter";
import Level18TheRealWorld from "@/components/game/levels/Level18TheRealWorld";
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
  "ratio-chain": Level3RatioChain,
  "size-doesnt-matter": Level4SizeDoesntMatter,
  "the-45-stone": Level5The45Stone,
  "the-30-60-stones": Level6The3060Stones,
  "edge-stones": Level7EdgeStones,
  "speed-recall": Level8SpeedRecall,
  "angle-detective": Level9AngleDetective,
  "first-law": Level10FirstLaw,
  "other-two-laws": Level11OtherTwoLaws,
  "equation-balancer": Level12EquationBalancer,
  "tower-rescue": Level13TowerRescue,
  "ladder-mission": Level14LadderMission,
  "dont-forget-height": Level15DontForgetHeight,
  "stacked-objects": Level16StackedObjects,
  "shadow-hunter": Level17ShadowHunter,
  "the-real-world": Level18TheRealWorld,
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
  const [playKey, setPlayKey] = useState(0); // increment to force remount

  const level = getLevelById(levelId);

  useEffect(() => {
    const state = loadGameState();
    setXp(state.xp);
    // Determine if this is a retry: explicit query param or level already completed
    const retryParam = searchParams.get("retry") === "true";
    const alreadyCompleted = state.completedLevels.includes(levelId);
    setIsRetry(retryParam || alreadyCompleted);
    // Reset game state on retry navigation
    if (retryParam) {
      setCompleted(false);
      setXpEarned(0);
      setPlayKey((k) => k + 1);
    }
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
        <LevelComponent key={playKey} onComplete={handleComplete} />
      )}
    </GameShell>
  );
}
