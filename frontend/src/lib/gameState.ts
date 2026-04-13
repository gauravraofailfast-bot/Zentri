const STORAGE_KEY = "zentri_game_state";

export interface GameState {
  xp: number;
  completedLevels: string[];
  currentStreak: number;
  lastPlayedDate: string | null;
}

const defaultState: GameState = {
  xp: 0,
  completedLevels: [],
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

export function completeLevel(levelId: string, xpEarned: number): GameState {
  const state = loadGameState();

  if (!state.completedLevels.includes(levelId)) {
    state.completedLevels.push(levelId);
  }

  state.xp += xpEarned;

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

export function isLevelUnlocked(
  levelId: string,
  completedLevels: string[],
  allLevels: { id: string; implemented: boolean }[],
): boolean {
  const idx = allLevels.findIndex((l) => l.id === levelId);
  if (idx === 0) return true;

  // Find the nearest PREVIOUS implemented level
  // Skip over unimplemented levels so players aren't blocked
  for (let i = idx - 1; i >= 0; i--) {
    if (allLevels[i].implemented) {
      return completedLevels.includes(allLevels[i].id);
    }
  }

  // No implemented level before this one — it's unlocked
  return true;
}
