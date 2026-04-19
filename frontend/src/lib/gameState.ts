const STORAGE_KEY = "zentri_game_state";

export interface GameState {
  xp: number;
  completedLevels: string[];
  levelXpEarned: Record<string, number>; // maps levelId -> total XP earned so far
  currentStreak: number;
  lastPlayedDate: string | null;
}

const defaultState: GameState = {
  xp: 0,
  completedLevels: [],
  levelXpEarned: {},
  currentStreak: 0,
  lastPlayedDate: null,
};

export function loadGameState(): GameState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function completeLevel(
  levelId: string,
  xpEarned: number,
  maxXp: number,
): GameState {
  const state = loadGameState();

  const isFirstCompletion = !state.completedLevels.includes(levelId);

  if (isFirstCompletion) {
    state.completedLevels.push(levelId);
  }

  // Calculate XP award capped by the level's max XP
  const alreadyEarned = state.levelXpEarned[levelId] || 0;
  const actualXp = Math.max(0, Math.min(xpEarned, maxXp - alreadyEarned));
  state.levelXpEarned[levelId] = alreadyEarned + actualXp;
  state.xp += actualXp;

  const today = new Date().toISOString().split("T")[0];
  if (state.lastPlayedDate !== today) {
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    if (state.lastPlayedDate === yesterday) {
      state.currentStreak += 1;
    } else {
      state.currentStreak = 1;
    }
    state.lastPlayedDate = today;
  }

  saveGameState(state);
  return state;
}

/**
 * Determines if a level is unlocked.
 *
 * Uses a GLOBAL linear chain across all worlds:
 *   Level 1 → Level 2 → (skip 3-7) → Speed Recall → (skip 9-12) → Tower Rescue
 *
 * An implemented level is unlocked when the previous implemented level
 * (anywhere in the global list) has been completed.
 * The very first implemented level is always unlocked.
 */
export function isLevelUnlocked(
  levelId: string,
  completedLevels: string[],
  allLevels: { id: string; implemented: boolean }[],
): boolean {
  // In development, unlock all implemented levels for easy testing
  if (process.env.NODE_ENV === "development") return true;

  // Only implemented levels form the unlock chain
  const implementedLevels = allLevels.filter((l) => l.implemented);
  const chainIdx = implementedLevels.findIndex((l) => l.id === levelId);

  // Not an implemented level — always locked
  if (chainIdx === -1) return false;

  // First implemented level is always unlocked
  if (chainIdx === 0) return true;

  // Unlocked if the previous implemented level is completed
  return completedLevels.includes(implementedLevels[chainIdx - 1].id);
}
