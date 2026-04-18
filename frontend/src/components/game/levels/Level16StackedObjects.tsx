"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  onComplete: (xpEarned: number) => void;
}

type Phase =
  | "intro"
  | "scene"
  | "step1-ratio"
  | "step1-compute"
  | "step2-ratio"
  | "step2-compute"
  | "success"
  | "done";

interface Scenario {
  description: string;
  /** Step 1 */
  step1Prompt: string;
  step1Ratio: "sin" | "cos" | "tan";
  step1Equation: string;
  step1ComputeSteps: string;
  step1Answer: string;
  step1Options: string[];
  step1Label: string;
  /** Step 2 */
  step2Prompt: string;
  step2Ratio: "sin" | "cos" | "tan";
  step2Equation: string;
  step2ComputeSteps: string;
  step2Answer: string;
  step2Options: string[];
  step2Label: string;
  /** Display */
  angleLow: number;
  angleHigh: number;
}

const scenarios: Scenario[] = [
  {
    description:
      "From a point, the angle of elevation to the top of a 10m building is 30\u00B0, and to the top of a flagstaff on it is 45\u00B0. Find the flagstaff height.",
    step1Prompt: "First, find the distance from the point to the building.",
    step1Ratio: "tan",
    step1Equation: "tan 30\u00B0 = 10 / d",
    step1ComputeSteps: "1/\u221A3 = 10 / d  \u2192  d = 10\u221A3",
    step1Answer: "10\u221A3",
    step1Options: ["10", "10\u221A3", "10/\u221A3", "20"],
    step1Label: "distance",
    step2Prompt: "Now find the flagstaff height using the 45\u00B0 angle.",
    step2Ratio: "tan",
    step2Equation: "tan 45\u00B0 = (10 + h) / 10\u221A3  \u2192  10 + h = 10\u221A3",
    step2ComputeSteps: "h = 10\u221A3 - 10 = 10(\u221A3 - 1)",
    step2Answer: "10(\u221A3-1)",
    step2Options: ["10(\u221A3-1)", "10\u221A3", "10", "10(\u221A3+1)"],
    step2Label: "flagstaff height",
    angleLow: 30,
    angleHigh: 45,
  },
  {
    description:
      "From 20m away, the angle of elevation to a building top is 45\u00B0 and to a flagstaff on it is 60\u00B0. Find the building height and flagstaff height.",
    step1Prompt: "Find the building height using the 45\u00B0 angle. Distance = 20m.",
    step1Ratio: "tan",
    step1Equation: "tan 45\u00B0 = H / 20",
    step1ComputeSteps: "1 = H / 20  \u2192  H = 20",
    step1Answer: "20",
    step1Options: ["10", "20", "20\u221A3", "20\u221A2"],
    step1Label: "building height",
    step2Prompt: "Now find the flagstaff height using the 60\u00B0 angle.",
    step2Ratio: "tan",
    step2Equation: "tan 60\u00B0 = (20 + f) / 20  \u2192  20 + f = 20\u221A3",
    step2ComputeSteps: "f = 20\u221A3 - 20 = 20(\u221A3 - 1)",
    step2Answer: "20(\u221A3-1)",
    step2Options: ["20(\u221A3-1)", "20\u221A3", "20", "20(\u221A3+1)"],
    step2Label: "flagstaff height",
    angleLow: 45,
    angleHigh: 60,
  },
  {
    description:
      "A 5m flagstaff on a building. Angle of elevation to the building top is 45\u00B0, to the flag top is 60\u00B0. Find the building height.",
    step1Prompt:
      "Let H = building height, d = distance. From tan 45\u00B0 = H/d, what do we get?",
    step1Ratio: "tan",
    step1Equation: "tan 45\u00B0 = H / d  \u2192  d = H",
    step1ComputeSteps: "So distance = H (they are equal!)",
    step1Answer: "d = H",
    step1Options: ["d = H", "d = 2H", "d = H/2", "d = H\u221A3"],
    step1Label: "relationship",
    step2Prompt:
      "Now: tan 60\u00B0 = (H+5)/d. Since d = H: \u221A3 = (H+5)/H. Solve for H.",
    step2Ratio: "tan",
    step2Equation: "\u221A3 = 1 + 5/H  \u2192  H = 5/(\u221A3 - 1)",
    step2ComputeSteps: "H = 5(\u221A3+1)/2  (after rationalizing)",
    step2Answer: "5(\u221A3+1)/2",
    step2Options: ["5(\u221A3+1)/2", "5\u221A3", "5(\u221A3-1)", "10"],
    step2Label: "building height",
    angleLow: 45,
    angleHigh: 60,
  },
];

export default function Level16StackedObjects({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [flagVisible, setFlagVisible] = useState(false);

  const scenario = scenarios[scenarioIdx];

  const handleStep1Ratio = useCallback(
    (ratio: string) => {
      if (ratio === scenario.step1Ratio) {
        setPhase("step1-compute");
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    [scenario],
  );

  const handleStep1Compute = useCallback(
    (answer: string) => {
      if (answer === scenario.step1Answer) {
        setPhase("step2-ratio");
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    [scenario],
  );

  const handleStep2Ratio = useCallback(
    (ratio: string) => {
      if (ratio === scenario.step2Ratio) {
        setPhase("step2-compute");
        setShowHint(false);
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    [scenario],
  );

  const handleStep2Compute = useCallback(
    (answer: string) => {
      if (answer === scenario.step2Answer) {
        setFlagVisible(true);
        setPhase("success");
        setTimeout(() => {
          if (scenarioIdx < scenarios.length - 1) {
            setScenarioIdx((s) => s + 1);
            setPhase("scene");
            setFlagVisible(false);
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
          World 4 &middot; Level 16
        </p>
        <h2 className="text-2xl font-bold mb-4">Stacked Objects</h2>
        <p className="text-white/50 text-sm mb-2">
          A building with a flagstaff on top. Two angles of elevation — one to
          the building, one to the flag. Solve in two steps: first find one
          measurement, then the next.
        </p>
        <p className="text-white/40 text-xs mb-2">
          Two-step trig problems. Stay focused.
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
  const groundY = 230;
  const buildingX = 240;
  const buildingTopY = 100;
  const flagTopY = 55;
  const buildingH = groundY - buildingTopY;
  const observerX = 50;

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
            <linearGradient id="sky16" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(108,92,231,0.05)" />
              <stop offset="100%" stopColor="rgba(15,15,19,0)" />
            </linearGradient>
          </defs>
          <rect width="320" height="260" fill="url(#sky16)" />

          {/* Ground with subtle texture */}
          <rect x="0" y={groundY} width="320" height="5" fill="rgba(60,50,80,0.15)" />
          <line x1="0" y1={groundY} x2="320" y2={groundY} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {[30, 90, 160, 220].map((x) => (
            <path key={x} d={`M ${x},${groundY} Q ${x+3},${groundY-5} ${x+7},${groundY}`} fill="none" stroke="rgba(80,160,60,0.12)" strokeWidth="1.5" />
          ))}

          {/* Building — realistic facade */}
          {/* Foundation */}
          <rect x={buildingX - 22} y={groundY - 5} width="44" height="5" fill="rgba(140,130,170,0.15)" stroke="rgba(200,185,230,0.2)" strokeWidth="1" />
          {/* Main body */}
          <rect x={buildingX - 20} y={buildingTopY + 8} width="40" height={buildingH - 13} fill="rgba(140,130,170,0.07)" stroke="rgba(200,185,230,0.18)" strokeWidth="1" />
          {/* Rooftop cornice */}
          <rect x={buildingX - 22} y={buildingTopY} width="44" height="10" fill="rgba(140,130,170,0.14)" stroke="rgba(200,185,230,0.25)" strokeWidth="1" />
          {/* Side depth */}
          <rect x={buildingX + 20} y={buildingTopY + 2} width="4" height={buildingH - 2} fill="rgba(0,0,0,0.1)" />
          {/* Floor dividers */}
          {[0.33, 0.66].map((frac) => (
            <line key={frac} x1={buildingX - 20} y1={buildingTopY + 8 + (buildingH - 13) * frac} x2={buildingX + 20} y2={buildingTopY + 8 + (buildingH - 13) * frac} stroke="rgba(200,185,230,0.07)" strokeWidth="1" />
          ))}
          {/* Windows — 2 columns × 4 rows */}
          {[0.13, 0.37, 0.61, 0.85].map((frac) =>
            [-11, 3].map((xOff) => (
              <rect key={`${frac}-${xOff}`} x={buildingX + xOff} y={buildingTopY + 8 + (buildingH - 20) * frac} width="8" height="8" fill="rgba(253,203,110,0.2)" rx="1" />
            ))
          )}

          {/* Flagpole */}
          <line
            x1={buildingX}
            y1={buildingTopY}
            x2={buildingX}
            y2={flagTopY}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
          />

          {/* Flag */}
          <motion.polygon
            points={`${buildingX},${flagTopY} ${buildingX + 15},${flagTopY + 6} ${buildingX},${flagTopY + 12}`}
            fill={flagVisible ? "rgba(0,184,148,0.6)" : "rgba(255,118,117,0.4)"}
            animate={flagVisible ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
          />

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

          {/* Line of sight to building top */}
          <line
            x1={observerX}
            y1={groundY - 12}
            x2={buildingX}
            y2={buildingTopY}
            stroke="rgba(162,155,254,0.15)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />

          {/* Line of sight to flag top */}
          <line
            x1={observerX}
            y1={groundY - 12}
            x2={buildingX}
            y2={flagTopY}
            stroke="rgba(253,203,110,0.15)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />

          {/* Angle arcs */}
          <path
            d={`M ${observerX + 40},${groundY - 12} A 40 40 0 0 0 ${observerX + 32},${groundY - 32}`}
            fill="none"
            stroke="rgba(162,155,254,0.3)"
            strokeWidth="1"
          />
          <text
            x={observerX + 42}
            y={groundY - 18}
            fill="#a29bfe"
            fontSize="10"
          >
            {scenario.angleLow}&deg;
          </text>

          <path
            d={`M ${observerX + 50},${groundY - 12} A 50 50 0 0 0 ${observerX + 36},${groundY - 42}`}
            fill="none"
            stroke="rgba(253,203,110,0.3)"
            strokeWidth="1"
          />
          <text
            x={observerX + 50}
            y={groundY - 32}
            fill="rgba(253,203,110,0.6)"
            fontSize="10"
          >
            {scenario.angleHigh}&deg;
          </text>

          {/* Right angle */}
          <polyline
            points={`${buildingX - 30},${groundY} ${buildingX - 30},${groundY - 10} ${buildingX - 20},${groundY - 10}`}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />

          {/* Labels */}
          <text
            x={buildingX + 25}
            y={(buildingTopY + groundY) / 2}
            fill="rgba(255,255,255,0.3)"
            fontSize="10"
          >
            building
          </text>
          <text
            x={buildingX + 10}
            y={(flagTopY + buildingTopY) / 2 + 3}
            fill="rgba(253,203,110,0.4)"
            fontSize="10"
          >
            flag?
          </text>
        </svg>
      </motion.div>

      {/* Interaction — multi-step */}
      {phase === "scene" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-xs text-white/30 mb-2">Step 1 of 2</p>
          <p className="text-sm text-white/50 mb-4">{scenario.step1Prompt}</p>
          <p className="text-sm text-white/50 mb-3">Which ratio?</p>
          <div className="flex gap-3 justify-center">
            {["sin", "cos", "tan"].map((r) => (
              <button
                key={r}
                onClick={() => handleStep1Ratio(r)}
                className="px-6 py-3 text-sm font-semibold rounded-xl border border-white/[0.1] bg-surface hover:bg-surface-hover transition-all duration-200"
              >
                {r}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {phase === "step1-ratio" && null}

      {phase === "step1-compute" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-xs text-white/30 mb-2">Step 1 of 2</p>
          <p className="text-sm text-white/70 mb-3 font-medium">
            {scenario.step1Label} = ?
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
              <p className="text-xs text-white/40">{scenario.step1Equation}</p>
            </motion.div>
          )}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {scenario.step1Options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleStep1Compute(opt)}
                className="py-3 text-sm font-semibold rounded-xl border border-white/[0.1] bg-surface hover:bg-surface-hover transition-all duration-200"
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {phase === "step2-ratio" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-xs text-white/30 mb-2">Step 2 of 2</p>
          <p className="text-sm text-success/70 mb-2">
            {scenario.step1Label} = {scenario.step1Answer} &#10003;
          </p>
          <p className="text-sm text-white/50 mb-4">{scenario.step2Prompt}</p>
          <p className="text-sm text-white/50 mb-3">Which ratio?</p>
          <div className="flex gap-3 justify-center">
            {["sin", "cos", "tan"].map((r) => (
              <button
                key={r}
                onClick={() => handleStep2Ratio(r)}
                className="px-6 py-3 text-sm font-semibold rounded-xl border border-white/[0.1] bg-surface hover:bg-surface-hover transition-all duration-200"
              >
                {r}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {phase === "step2-compute" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-xs text-white/30 mb-2">Step 2 of 2</p>
          <p className="text-sm text-white/70 mb-3 font-medium">
            {scenario.step2Label} = ?
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
              <p className="text-xs text-white/40">{scenario.step2Equation}</p>
            </motion.div>
          )}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {scenario.step2Options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleStep2Compute(opt)}
                className="py-3 text-sm font-semibold rounded-xl border border-white/[0.1] bg-surface hover:bg-surface-hover transition-all duration-200"
              >
                {opt}
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
          <p className="text-success text-lg font-bold">Solved!</p>
          <p className="text-white/40 text-sm mt-1">
            {scenario.step2Label} = {scenario.step2Answer}m
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
