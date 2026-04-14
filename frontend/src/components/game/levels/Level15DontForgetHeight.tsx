"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  onComplete: (xpEarned: number) => void;
}

type Phase =
  | "intro"
  | "scene"
  | "pick-height"
  | "pick-ratio"
  | "compute"
  | "success"
  | "done";

interface Scenario {
  description: string;
  observerHeight: number;
  objectHeight: number;
  effectiveHeight: number;
  effectiveHeightOptions: string[];
  correctRatio: "sin" | "cos" | "tan";
  ratioHint: string;
  equation: string;
  computeSteps: string;
  answer: string;
  answerOptions: string[];
  /** Label for the unknown */
  unknown: string;
  /** Prompt for the height pick phase */
  heightPrompt: string;
}

const scenarios: Scenario[] = [
  {
    description:
      "A boy 1.5m tall sees the top of a 31.5m building at 60\u00B0 elevation. How far is he from the building?",
    observerHeight: 1.5,
    objectHeight: 31.5,
    effectiveHeight: 30,
    effectiveHeightOptions: ["31.5", "30", "1.5", "33"],
    correctRatio: "tan",
    ratioHint: "You know the opposite (effective height) and need the adjacent (distance)",
    equation: "tan 60\u00B0 = 30 / distance",
    computeSteps: "\u221A3 = 30 / d  \u2192  d = 30 / \u221A3",
    answer: "10\u221A3",
    answerOptions: ["30\u221A3", "10\u221A3", "30", "10"],
    unknown: "distance",
    heightPrompt: "What effective height should we use in our calculation?",
  },
  {
    description:
      "A 1.2m-tall girl sees the top of a 7.2m pole at 30\u00B0 elevation. How far is she from the pole?",
    observerHeight: 1.2,
    objectHeight: 7.2,
    effectiveHeight: 6,
    effectiveHeightOptions: ["7.2", "6", "1.2", "8.4"],
    correctRatio: "tan",
    ratioHint: "Opposite (effective height) and adjacent (distance)",
    equation: "tan 30\u00B0 = 6 / distance",
    computeSteps: "1/\u221A3 = 6 / d  \u2192  d = 6\u221A3",
    answer: "6\u221A3",
    answerOptions: ["6", "6\u221A3", "6/\u221A3", "12"],
    unknown: "distance",
    heightPrompt: "The girl is 1.2m tall, the pole is 7.2m. What height matters for the angle?",
  },
  {
    description:
      "A man 1.5m tall stands on a 28.5m tower and sees a boat at 60\u00B0 depression. How far is the boat?",
    observerHeight: 1.5,
    objectHeight: 28.5,
    effectiveHeight: 30,
    effectiveHeightOptions: ["28.5", "1.5", "30", "27"],
    correctRatio: "tan",
    ratioHint: "Total height above the boat and the horizontal distance",
    equation: "tan 60\u00B0 = 30 / distance",
    computeSteps: "\u221A3 = 30 / d  \u2192  d = 30 / \u221A3 = 10\u221A3",
    answer: "10\u221A3",
    answerOptions: ["10\u221A3", "30\u221A3", "30", "10"],
    unknown: "distance",
    heightPrompt:
      "Man is 1.5m tall on a 28.5m tower. What is the total height above the boat?",
  },
];

export default function Level15DontForgetHeight({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(false);

  const scenario = scenarios[scenarioIdx];

  const handlePickHeight = useCallback(
    (val: string) => {
      if (val === String(scenario.effectiveHeight)) {
        setPhase("pick-ratio");
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    [scenario],
  );

  const handlePickRatio = useCallback(
    (ratio: string) => {
      if (ratio === scenario.correctRatio) {
        setPhase("compute");
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    [scenario],
  );

  const handleCompute = useCallback(
    (answer: string) => {
      if (answer === scenario.answer) {
        setPhase("success");
        setTimeout(() => {
          if (scenarioIdx < scenarios.length - 1) {
            setScenarioIdx((s) => s + 1);
            setPhase("scene");
          } else {
            setPhase("done");
            const bonus = mistakes === 0 ? 20 : 0;
            onComplete(60 + bonus);
          }
        }, 2000);
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    [scenario, scenarioIdx, mistakes, onComplete],
  );

  if (phase === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/25 mb-4">
          World 4 &middot; Level 15
        </p>
        <h2 className="text-2xl font-bold mb-4">Don&apos;t Forget Your Height</h2>
        <p className="text-white/50 text-sm mb-2">
          The observer has their own height! A boy on the ground, a girl near a
          pole, a man on a tower — you must account for the observer&apos;s height
          before doing the trig.
        </p>
        <p className="text-white/40 text-xs mb-2">
          Step 1: Find the effective height. Step 2: Solve with trig.
        </p>
        <p className="text-white/30 text-xs mb-8">
          NCERT Chapter 9 — Heights and Distances
        </p>
        <button
          onClick={() => setPhase("scene")}
          className="px-8 py-3 text-sm uppercase tracking-[0.1em] font-medium text-accent-light border border-accent/30 rounded-full hover:border-accent/60 transition-all duration-300"
        >
          Start Mission
        </button>
      </motion.div>
    );
  }

  // SVG layout
  const groundY = 220;
  const buildingX = 250;
  const observerX = 60;
  const buildingTopY = 50;
  const buildingH = groundY - buildingTopY;
  const observerTopY = groundY - 20; // small figure

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-white/30">
          Scenario {scenarioIdx + 1}/{scenarios.length}
        </span>
        <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent/50 rounded-full"
            animate={{
              width: `${(scenarioIdx / scenarios.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-white/60 text-center mb-4">
        {scenario.description}
      </p>

      {/* Scene SVG */}
      <motion.div
        animate={shake ? { x: [0, -8, 8, -8, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <svg viewBox="0 0 320 260" className="w-full max-w-sm mx-auto mb-6">
          <defs>
            <linearGradient id="sky15" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(108,92,231,0.05)" />
              <stop offset="100%" stopColor="rgba(15,15,19,0)" />
            </linearGradient>
          </defs>
          <rect width="320" height="260" fill="url(#sky15)" />

          {/* Ground */}
          <line
            x1="0"
            y1={groundY}
            x2="320"
            y2={groundY}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />

          {/* Building/pole */}
          <rect
            x={buildingX - 18}
            y={buildingTopY}
            width="36"
            height={buildingH}
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            rx="2"
          />

          {/* Windows */}
          {[0.2, 0.4, 0.6, 0.8].map((frac) => (
            <rect
              key={frac}
              x={buildingX - 8}
              y={buildingTopY + buildingH * frac - 6}
              width="16"
              height="8"
              fill="rgba(253,203,110,0.12)"
              rx="1"
            />
          ))}

          {/* Object height label */}
          <text
            x={buildingX + 24}
            y={(buildingTopY + groundY) / 2}
            fill="rgba(255,255,255,0.3)"
            fontSize="10"
          >
            {scenario.objectHeight}m
          </text>

          {/* Observer figure */}
          <circle
            cx={observerX}
            cy={observerTopY - 8}
            r="5"
            fill="rgba(162,155,254,0.5)"
          />
          <line
            x1={observerX}
            y1={observerTopY - 3}
            x2={observerX}
            y2={groundY}
            stroke="rgba(162,155,254,0.3)"
            strokeWidth="1.5"
          />

          {/* Observer height label */}
          <text
            x={observerX - 25}
            y={observerTopY + 5}
            fill="rgba(162,155,254,0.4)"
            fontSize="9"
          >
            {scenario.observerHeight}m
          </text>

          {/* Effective height dotted line */}
          <line
            x1={observerX}
            y1={observerTopY - 8}
            x2={buildingX - 18}
            y2={observerTopY - 8}
            stroke="rgba(253,203,110,0.15)"
            strokeWidth="1"
            strokeDasharray="3,3"
          />

          {/* Dashed line of sight to top */}
          <line
            x1={observerX}
            y1={observerTopY - 8}
            x2={buildingX}
            y2={buildingTopY}
            stroke="rgba(162,155,254,0.2)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />

          {/* Effective height brace */}
          <line
            x1={buildingX - 25}
            y1={observerTopY - 8}
            x2={buildingX - 25}
            y2={buildingTopY}
            stroke="rgba(253,203,110,0.3)"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <text
            x={buildingX - 50}
            y={(observerTopY - 8 + buildingTopY) / 2}
            fill="rgba(253,203,110,0.5)"
            fontSize="10"
            fontWeight="bold"
          >
            h?
          </text>

          {/* Angle arc */}
          <path
            d={`M ${observerX + 35},${observerTopY - 8} A 35 35 0 0 0 ${observerX + 25},${observerTopY - 30}`}
            fill="none"
            stroke="rgba(162,155,254,0.4)"
            strokeWidth="1"
          />
          <text
            x={observerX + 34}
            y={observerTopY - 16}
            fill="#a29bfe"
            fontSize="11"
            fontWeight="bold"
          >
            {scenarioIdx === 2 ? "60\u00B0\u2193" : "angle"}
          </text>

          {/* Right angle */}
          <polyline
            points={`${buildingX - 28},${groundY} ${buildingX - 28},${groundY - 10} ${buildingX - 18},${groundY - 10}`}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />
        </svg>
      </motion.div>

      {/* Interaction */}
      {phase === "scene" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-white/50 mb-4">{scenario.heightPrompt}</p>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {scenario.effectiveHeightOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handlePickHeight(opt)}
                className="py-3 text-sm font-semibold rounded-xl border border-white/[0.1] bg-surface hover:bg-surface-hover transition-all duration-200"
              >
                {opt}m
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {phase === "pick-height" && null}

      {phase === "pick-ratio" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-white/50 mb-2">
            Effective height = {scenario.effectiveHeight}m
          </p>
          <p className="text-sm text-white/50 mb-4">
            Which trig ratio connects height and distance?
          </p>
          <div className="flex gap-3 justify-center">
            {["sin", "cos", "tan"].map((r) => (
              <button
                key={r}
                onClick={() => handlePickRatio(r)}
                className="px-6 py-3 text-sm font-semibold rounded-xl border border-white/[0.1] bg-surface hover:bg-surface-hover transition-all duration-200"
              >
                {r}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-white/20 mt-3">
            Hint: {scenario.ratioHint}
          </p>
        </motion.div>
      )}

      {phase === "compute" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-white/50 mb-2">{scenario.equation}</p>
          <p className="text-sm text-white/50 mb-4">{scenario.computeSteps}</p>
          <p className="text-sm text-white/70 mb-4 font-medium">
            {scenario.unknown} = ?
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {scenario.answerOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleCompute(opt)}
                className="py-3 text-sm font-semibold rounded-xl border border-white/[0.1] bg-surface hover:bg-surface-hover transition-all duration-200"
              >
                {opt}m
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {phase === "success" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-success text-lg font-bold">Correct!</p>
          <p className="text-white/40 text-sm mt-1">
            {scenario.unknown} = {scenario.answer}m
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
