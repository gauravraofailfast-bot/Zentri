"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  onComplete: (xpEarned: number) => void;
}

type Phase = "intro" | "scene" | "pick-ratio" | "compute" | "success" | "done";

interface Scenario {
  description: string;
  known: string;
  unknown: string;
  unknownSide: "base" | "ladder" | "height";
  correctRatio: "sin" | "cos" | "tan";
  ratioHint: string;
  equation: string;
  computeSteps: string;
  answer: string;
  answerOptions: string[];
  /** SVG config */
  ladderLen: number | null;
  baseLen: number | null;
  heightLen: number | null;
  angle: number;
  angleWith: "ground" | "wall";
}

const scenarios: Scenario[] = [
  {
    description:
      "A ladder 10m long makes a 60\u00B0 angle with the ground. How far is its foot from the wall?",
    known: "Ladder (hypotenuse) = 10m, angle with ground = 60\u00B0",
    unknown: "base",
    unknownSide: "base" as const,
    correctRatio: "cos",
    ratioHint: "You know the hypotenuse and need the adjacent side",
    equation: "cos 60\u00B0 = base / 10",
    computeSteps: "1/2 = base / 10",
    answer: "5",
    answerOptions: ["5", "10\u221A3", "5\u221A3", "10"],
    ladderLen: 10,
    baseLen: null,
    heightLen: null,
    angle: 60,
    angleWith: "ground",
  },
  {
    description:
      "A ladder rests against a wall at 45\u00B0 with the ground. Its foot is 8m from the wall. How long is the ladder?",
    known: "Base = 8m, angle with ground = 45\u00B0",
    unknown: "ladder",
    unknownSide: "ladder" as const,
    correctRatio: "cos",
    ratioHint: "You know the adjacent side and need the hypotenuse",
    equation: "cos 45\u00B0 = 8 / ladder",
    computeSteps: "1/\u221A2 = 8 / ladder",
    answer: "8\u221A2",
    answerOptions: ["8", "8\u221A2", "8\u221A3", "16"],
    ladderLen: null,
    baseLen: 8,
    heightLen: null,
    angle: 45,
    angleWith: "ground",
  },
  {
    description:
      "A 15m ladder makes a 30\u00B0 angle with the wall. How high up the wall does it reach?",
    known: "Ladder = 15m, angle with wall = 30\u00B0 (so angle with ground = 60\u00B0)",
    unknown: "height",
    unknownSide: "height" as const,
    correctRatio: "sin",
    ratioHint: "Angle with ground is 60\u00B0. You need the opposite side (height) and know the hypotenuse",
    equation: "sin 60\u00B0 = height / 15",
    computeSteps: "\u221A3/2 = height / 15",
    answer: "15\u221A3/2",
    answerOptions: ["15/2", "15\u221A3/2", "15\u221A3", "15/\u221A3"],
    ladderLen: 15,
    baseLen: null,
    heightLen: null,
    angle: 60,
    angleWith: "ground",
  },
];

export default function Level14LadderMission({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [ladderSlid, setLadderSlid] = useState(false);

  const scenario = scenarios[scenarioIdx];

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
        setLadderSlid(true);
        setPhase("success");
        setTimeout(() => {
          if (scenarioIdx < scenarios.length - 1) {
            setScenarioIdx((s) => s + 1);
            setPhase("scene");
            setLadderSlid(false);
            setShowHint(false);
          } else {
            setPhase("done");
            const bonus = mistakes === 0 ? 20 : 0;
            onComplete(70 + bonus);
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
        <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
          World 4 &middot; Level 14
        </p>
        <h2 className="text-2xl font-bold mb-4">Ladder Mission</h2>
        <p className="text-white/50 text-sm mb-2">
          Ladders lean against walls at different angles. Use trigonometry to
          find the missing measurement — ladder length, distance from wall, or
          height reached.
        </p>
        <p className="text-white/40 text-xs mb-2">
          Cosine and sine are your friends here.
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
  const wallX = 250;
  const wallTopY = 60;
  const wallHeight = groundY - wallTopY;
  const footX = 80;
  // Ladder goes from footX, groundY to wallX, some Y on the wall
  const ladderTopY = wallTopY + 20;

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
            <linearGradient id="ladderSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(108,92,231,0.05)" />
              <stop offset="100%" stopColor="rgba(15,15,19,0)" />
            </linearGradient>
          </defs>
          <rect width="320" height="260" fill="url(#ladderSky)" />

          {/* Ground */}
          <line
            x1="0"
            y1={groundY}
            x2="320"
            y2={groundY}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />

          {/* Wall */}
          <rect
            x={wallX - 5}
            y={wallTopY}
            width="10"
            height={wallHeight}
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            rx="1"
          />

          {/* Bricks on wall */}
          {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((frac) => (
            <line
              key={frac}
              x1={wallX - 5}
              y1={wallTopY + wallHeight * frac}
              x2={wallX + 5}
              y2={wallTopY + wallHeight * frac}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
          ))}

          {/* Ladder */}
          <motion.line
            x1={footX}
            y1={groundY}
            x2={wallX - 5}
            y2={ladderTopY}
            stroke={ladderSlid ? "#00b894" : "rgba(253,203,110,0.6)"}
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Ladder rungs */}
          {[0.25, 0.5, 0.75].map((frac) => {
            const rx = footX + (wallX - 5 - footX) * frac;
            const ry = groundY + (ladderTopY - groundY) * frac;
            const dx = 4;
            const dy = (dx * (wallX - 5 - footX)) / (groundY - ladderTopY);
            return (
              <line
                key={frac}
                x1={rx - dy}
                y1={ry - dx}
                x2={rx + dy}
                y2={ry + dx}
                stroke={ladderSlid ? "rgba(0,184,148,0.4)" : "rgba(253,203,110,0.3)"}
                strokeWidth="1.5"
              />
            );
          })}

          {/* Angle arc at foot */}
          <path
            d={`M ${footX + 35},${groundY} A 35 35 0 0 0 ${footX + 22},${groundY - 28}`}
            fill="none"
            stroke="rgba(162,155,254,0.4)"
            strokeWidth="1"
          />
          <text
            x={footX + 36}
            y={groundY - 10}
            fill="#a29bfe"
            fontSize="11"
            fontWeight="bold"
          >
            {scenario.angle}&deg;
          </text>

          {/* Right angle at wall base */}
          <polyline
            points={`${wallX - 15},${groundY} ${wallX - 15},${groundY - 10} ${wallX - 5},${groundY - 10}`}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />

          {/* Labels */}
          {scenario.ladderLen && (
            <text
              x={(footX + wallX) / 2 - 25}
              y={(groundY + ladderTopY) / 2 - 8}
              fill="rgba(253,203,110,0.7)"
              fontSize="11"
              fontWeight="bold"
              transform={`rotate(-35, ${(footX + wallX) / 2 - 25}, ${(groundY + ladderTopY) / 2 - 8})`}
            >
              {scenario.ladderLen}m
            </text>
          )}
          {scenario.baseLen && (
            <text
              x={(footX + wallX) / 2}
              y={groundY + 18}
              textAnchor="middle"
              fill="rgba(162,155,254,0.6)"
              fontSize="11"
            >
              {scenario.baseLen}m
            </text>
          )}

          {/* Unknown label — positioned near the unknown side */}
          {scenario.unknownSide === "ladder" && (
            <text
              x={(footX + wallX) / 2 - 25}
              y={(groundY + ladderTopY) / 2 - 8}
              fill="rgba(253,203,110,0.5)"
              fontSize="12"
              fontWeight="bold"
              transform={`rotate(-35, ${(footX + wallX) / 2 - 25}, ${(groundY + ladderTopY) / 2 - 8})`}
            >
              ladder = ?
            </text>
          )}
          {scenario.unknownSide === "base" && (
            <text
              x={(footX + wallX) / 2}
              y={groundY + 18}
              textAnchor="middle"
              fill="rgba(253,203,110,0.5)"
              fontSize="12"
              fontWeight="bold"
            >
              base = ?
            </text>
          )}
          {scenario.unknownSide === "height" && (
            <text
              x={wallX + 12}
              y={(ladderTopY + groundY) / 2}
              fill="rgba(253,203,110,0.5)"
              fontSize="10"
              fontWeight="bold"
            >
              {"height"}
            </text>
          )}
          {scenario.unknownSide === "height" && (
            <text
              x={wallX + 12}
              y={(ladderTopY + groundY) / 2 + 14}
              fill="rgba(253,203,110,0.5)"
              fontSize="10"
              fontWeight="bold"
            >
              {"= ?"}
            </text>
          )}

          {/* Success checkmark */}
          {ladderSlid && (
            <motion.text
              x="160"
              y="40"
              textAnchor="middle"
              fill="#00b894"
              fontSize="22"
              fontWeight="bold"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              &#10003;
            </motion.text>
          )}
        </svg>
      </motion.div>

      {/* Interaction area */}
      {phase === "scene" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-white/50 mb-4">
            Which trig ratio should you use?
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
          <p className="text-[10px] text-white/35 mt-3">
            Hint: {scenario.ratioHint}
          </p>
        </motion.div>
      )}

      {phase === "pick-ratio" && null}

      {phase === "compute" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-white/70 mb-3 font-medium">
            {scenario.unknown} = ?
          </p>
          <button
            onClick={() => setShowHint((h) => !h)}
            className="text-[11px] text-accent-light/60 hover:text-accent-light transition-colors mb-4"
          >
            {showHint ? "Hide hint ▲" : "Need a hint? ▼"}
          </button>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] inline-block"
            >
              <p className="text-xs text-white/40">{scenario.equation}</p>
            </motion.div>
          )}
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
