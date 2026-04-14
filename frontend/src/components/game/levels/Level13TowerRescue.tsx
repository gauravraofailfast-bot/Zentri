"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  onComplete: (xpEarned: number) => void;
}

type Phase = "intro" | "scene" | "pick-ratio" | "compute" | "rescue" | "done";

interface Scenario {
  distance: number;
  angle: number;
  correctRatio: "sin" | "cos" | "tan";
  /** The trig value as a display string */
  trigValue: string;
  /** The numeric answer */
  height: string;
  /** All answer options */
  heightOptions: string[];
  description: string;
}

const scenarios: Scenario[] = [
  {
    distance: 15,
    angle: 60,
    correctRatio: "tan",
    trigValue: "\u221A3",
    height: "15\u221A3",
    heightOptions: ["15", "15\u221A3", "15/\u221A3", "\u221A3"],
    description:
      "A person is stranded on top of a tower. You\u2019re 15m away. Your protractor reads 60\u00B0.",
  },
  {
    distance: 20,
    angle: 45,
    correctRatio: "tan",
    trigValue: "1",
    height: "20",
    heightOptions: ["10", "20", "20\u221A2", "20\u221A3"],
    description:
      "Another rescue! This time you\u2019re 20m from a building. Angle of elevation: 45\u00B0.",
  },
  {
    distance: 30,
    angle: 30,
    correctRatio: "tan",
    trigValue: "1/\u221A3",
    height: "30/\u221A3",
    heightOptions: ["30", "30\u221A3", "30/\u221A3", "15"],
    description:
      "A child is on a balcony. You\u2019re 30m away. Angle of elevation: 30\u00B0.",
  },
];

export default function Level13TowerRescue({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(false);
  const [ladderExtended, setLadderExtended] = useState(false);

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
      if (answer === scenario.height) {
        setLadderExtended(true);
        setPhase("rescue");
        setTimeout(() => {
          if (scenarioIdx < scenarios.length - 1) {
            setScenarioIdx((s) => s + 1);
            setPhase("scene");
            setLadderExtended(false);
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
        <p className="text-xs uppercase tracking-[0.2em] text-white/25 mb-4">
          World 4 &middot; Level 13
        </p>
        <h2 className="text-2xl font-bold mb-4">Tower Rescue</h2>
        <p className="text-white/50 text-sm mb-2">
          People are stranded on rooftops. You know your distance and the angle
          of elevation. Calculate the exact height to extend the rescue ladder.
        </p>
        <p className="text-white/40 text-xs mb-2">
          Too short = rescue fails. Too long = wasted resources.
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

  // Scene visualization
  const towerHeight = 160;
  const groundY = 220;
  const towerX = 260;
  const observerX = 60;
  const towerTopY = groundY - towerHeight;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-white/30">
          Rescue {scenarioIdx + 1}/{scenarios.length}
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

      {/* Scenario description */}
      <p className="text-sm text-white/60 text-center mb-4">
        {scenario.description}
      </p>

      {/* Scene SVG */}
      <motion.div
        animate={shake ? { x: [0, -6, 6, -6, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <svg viewBox="0 0 320 260" className="w-full max-w-sm mx-auto mb-6">
          {/* Sky gradient */}
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(108,92,231,0.05)" />
              <stop offset="100%" stopColor="rgba(15,15,19,0)" />
            </linearGradient>
          </defs>
          <rect width="320" height="260" fill="url(#sky)" />

          {/* Ground */}
          <line
            x1="0"
            y1={groundY}
            x2="320"
            y2={groundY}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />

          {/* Tower */}
          <rect
            x={towerX - 15}
            y={towerTopY}
            width="30"
            height={towerHeight}
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            rx="2"
          />

          {/* Windows on tower */}
          {[0.2, 0.4, 0.6, 0.8].map((frac) => (
            <rect
              key={frac}
              x={towerX - 6}
              y={towerTopY + towerHeight * frac - 6}
              width="12"
              height="8"
              fill="rgba(253,203,110,0.15)"
              rx="1"
            />
          ))}

          {/* Person on top */}
          <motion.g
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Head */}
            <circle
              cx={towerX}
              cy={towerTopY - 15}
              r="6"
              fill="rgba(255,255,255,0.4)"
            />
            {/* Body */}
            <line
              x1={towerX}
              y1={towerTopY - 9}
              x2={towerX}
              y2={towerTopY - 1}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
            />
            {/* Arms waving */}
            <motion.line
              x1={towerX - 8}
              y1={towerTopY - 8}
              x2={towerX + 8}
              y2={towerTopY - 12}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ transformOrigin: `${towerX}px ${towerTopY - 9}px` }}
            />
          </motion.g>

          {/* Observer */}
          <circle
            cx={observerX}
            cy={groundY - 12}
            r="5"
            fill="rgba(162,155,254,0.5)"
          />
          <line
            x1={observerX}
            y1={groundY - 7}
            x2={observerX}
            y2={groundY}
            stroke="rgba(162,155,254,0.3)"
            strokeWidth="1.5"
          />

          {/* Dashed line of sight */}
          <line
            x1={observerX}
            y1={groundY - 12}
            x2={towerX}
            y2={towerTopY}
            stroke="rgba(162,155,254,0.2)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />

          {/* Angle arc */}
          <path
            d={`M ${observerX + 40},${groundY - 12} A 40 40 0 0 0 ${observerX + 30},${groundY - 35}`}
            fill="none"
            stroke="rgba(162,155,254,0.4)"
            strokeWidth="1"
          />
          <text
            x={observerX + 42}
            y={groundY - 22}
            fill="#a29bfe"
            fontSize="12"
            fontWeight="bold"
          >
            {scenario.angle}&deg;
          </text>

          {/* Distance label */}
          <line
            x1={observerX}
            y1={groundY + 12}
            x2={towerX}
            y2={groundY + 12}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />
          <text
            x={(observerX + towerX) / 2}
            y={groundY + 25}
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            fontSize="11"
          >
            {scenario.distance}m
          </text>

          {/* Height label with ? */}
          <text
            x={towerX + 25}
            y={(towerTopY + groundY) / 2}
            fill="rgba(253,203,110,0.5)"
            fontSize="12"
            fontWeight="bold"
          >
            h = ?
          </text>

          {/* Right angle indicator */}
          <polyline
            points={`${towerX - 10},${groundY} ${towerX - 10},${groundY - 10} ${towerX},${groundY - 10}`}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />

          {/* Rescue ladder animation */}
          {ladderExtended && (
            <motion.line
              x1={observerX}
              y1={groundY - 12}
              x2={towerX}
              y2={towerTopY}
              stroke="#00cec9"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          )}
        </svg>
      </motion.div>

      {/* Game interaction area */}
      {phase === "scene" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-white/50 mb-4">
            Which trig ratio connects the{" "}
            <span className="text-warning">height</span> and the{" "}
            <span className="text-white/70">distance</span>?
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
            Hint: You know the opposite and adjacent sides
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
          <p className="text-sm text-white/50 mb-2">
            tan {scenario.angle}&deg; = h / {scenario.distance}
          </p>
          <p className="text-sm text-white/50 mb-4">
            {scenario.trigValue} = h / {scenario.distance}
          </p>
          <p className="text-sm text-white/70 mb-4 font-medium">
            h = ?
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {scenario.heightOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleCompute(opt)}
                className="py-3 text-sm font-semibold rounded-xl border border-white/[0.1] bg-surface hover:bg-surface-hover transition-all duration-200"
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {phase === "rescue" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-success text-lg font-bold">Rescue successful!</p>
          <p className="text-white/40 text-sm mt-1">
            Height = {scenario.height}m
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
