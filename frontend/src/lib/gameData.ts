export interface Level {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  worldId: string;
  xpReward: number;
  implemented: boolean;
}

export interface World {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  ncertRef: string;
  levels: Level[];
}

export const worlds: World[] = [
  {
    id: "triangle-lab",
    number: 1,
    title: "The Triangle Lab",
    subtitle: "Trigonometric Ratios",
    description:
      "You crash-land in an abandoned lab. Master the instruments on the wall — right triangles.",
    ncertRef: "NCERT 8.2",
    levels: [
      {
        id: "name-the-sides",
        number: 1,
        title: "Name the Sides",
        subtitle: "Label opposite, adjacent, hypotenuse",
        worldId: "triangle-lab",
        xpReward: 50,
        implemented: true,
      },
      {
        id: "ratio-builder",
        number: 2,
        title: "Ratio Builder",
        subtitle: "Build sin, cos, tan from sides",
        worldId: "triangle-lab",
        xpReward: 50,
        implemented: true,
      },
      {
        id: "ratio-chain",
        number: 3,
        title: "The Ratio Chain",
        subtitle: "Find all ratios from one",
        worldId: "triangle-lab",
        xpReward: 60,
        implemented: false,
      },
      {
        id: "size-doesnt-matter",
        number: 4,
        title: "Size Doesn't Matter",
        subtitle: "Ratios stay constant across scale",
        worldId: "triangle-lab",
        xpReward: 50,
        implemented: false,
      },
    ],
  },
  {
    id: "sacred-angles",
    number: 2,
    title: "The Sacred Angles",
    subtitle: "Standard Values",
    description:
      "Five ancient stones, each carved with an angle: 0, 30, 45, 60, 90. Learn the power of each.",
    ncertRef: "NCERT 8.3",
    levels: [
      {
        id: "the-45-stone",
        number: 5,
        title: "The 45\u00B0 Stone",
        subtitle: "Derive values from isosceles triangle",
        worldId: "sacred-angles",
        xpReward: 50,
        implemented: false,
      },
      {
        id: "the-30-60-stones",
        number: 6,
        title: "The 30\u00B0 & 60\u00B0 Stones",
        subtitle: "Slice an equilateral triangle",
        worldId: "sacred-angles",
        xpReward: 60,
        implemented: false,
      },
      {
        id: "edge-stones",
        number: 7,
        title: "The Edge Stones",
        subtitle: "What happens at 0\u00B0 and 90\u00B0",
        worldId: "sacred-angles",
        xpReward: 50,
        implemented: false,
      },
      {
        id: "speed-recall",
        number: 8,
        title: "Speed Recall",
        subtitle: "Timed flashcard sprint",
        worldId: "sacred-angles",
        xpReward: 80,
        implemented: true,
      },
      {
        id: "angle-detective",
        number: 9,
        title: "Angle Detective",
        subtitle: "Reverse-lookup angles from ratios",
        worldId: "sacred-angles",
        xpReward: 60,
        implemented: false,
      },
    ],
  },
  {
    id: "identity-forge",
    number: 3,
    title: "Identity Forge",
    subtitle: "Trigonometric Identities",
    description:
      "Deep in the lab, a machine transforms equations. Master it to unlock the final door.",
    ncertRef: "NCERT 8.4",
    levels: [
      {
        id: "first-law",
        number: 10,
        title: "The First Law",
        subtitle: "sin\u00B2A + cos\u00B2A = 1",
        worldId: "identity-forge",
        xpReward: 60,
        implemented: false,
      },
      {
        id: "other-two-laws",
        number: 11,
        title: "The Other Two Laws",
        subtitle: "sec\u00B2 and cosec\u00B2 identities",
        worldId: "identity-forge",
        xpReward: 60,
        implemented: false,
      },
      {
        id: "equation-balancer",
        number: 12,
        title: "The Equation Balancer",
        subtitle: "Prove identities step by step",
        worldId: "identity-forge",
        xpReward: 70,
        implemented: false,
      },
    ],
  },
  {
    id: "height-seeker",
    number: 4,
    title: "Height Seeker",
    subtitle: "Real-World Applications",
    description:
      "You escape the lab. Real terrain, real buildings. Use trig to map the world and rescue people.",
    ncertRef: "NCERT Ch 9",
    levels: [
      {
        id: "tower-rescue",
        number: 13,
        title: "Tower Rescue",
        subtitle: "Calculate tower height to save someone",
        worldId: "height-seeker",
        xpReward: 70,
        implemented: true,
      },
      {
        id: "ladder-mission",
        number: 14,
        title: "Ladder Mission",
        subtitle: "Find ladder length and base distance",
        worldId: "height-seeker",
        xpReward: 70,
        implemented: false,
      },
      {
        id: "dont-forget-height",
        number: 15,
        title: "Don't Forget Your Height",
        subtitle: "Account for observer height",
        worldId: "height-seeker",
        xpReward: 60,
        implemented: false,
      },
      {
        id: "stacked-objects",
        number: 16,
        title: "Stacked Objects",
        subtitle: "Building + flagstaff problems",
        worldId: "height-seeker",
        xpReward: 70,
        implemented: false,
      },
      {
        id: "shadow-hunter",
        number: 17,
        title: "Shadow Hunter",
        subtitle: "Sun altitude and shadow puzzles",
        worldId: "height-seeker",
        xpReward: 70,
        implemented: false,
      },
      {
        id: "the-real-world",
        number: 18,
        title: "The Real World",
        subtitle: "Camera + protractor — measure reality",
        worldId: "height-seeker",
        xpReward: 100,
        implemented: false,
      },
    ],
  },
];

export const allLevels = worlds.flatMap((w) => w.levels);

export function getLevelById(id: string): Level | undefined {
  return allLevels.find((l) => l.id === id);
}

export function getWorldForLevel(levelId: string): World | undefined {
  return worlds.find((w) => w.levels.some((l) => l.id === levelId));
}

export function getNextLevel(currentId: string): Level | undefined {
  const idx = allLevels.findIndex((l) => l.id === currentId);
  if (idx === -1 || idx >= allLevels.length - 1) return undefined;
  return allLevels[idx + 1];
}
