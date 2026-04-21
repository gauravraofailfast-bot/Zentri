"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  onComplete: (xpEarned: number) => void;
}

type Phase =
  | "intro"
  | "scene"
  | "pick-ratio"
  | "compute"
  | "find-angle"
  | "success"
  | "done";

interface Scenario {
  description: string;
  correctRatio: "sin" | "cos" | "tan";
  ratioHint: string;
  equation: string;
  computeSteps: string;
  /** For scenarios that compute a distance/height */
  computeAnswer: string | null;
  computeOptions: string[];
  /** For scenarios that ask to identify an angle */
  angleAnswer: string | null;
  angleOptions: string[];
  /** Final display answer */
  finalAnswer: string;
  finalLabel: string;
  /** SVG config */
  poleHeight: number;
  shadowLen: number;
  findAngle: boolean;
}

const scenarios: Scenario[] = [
  {
    description:
      "A pole 6m tall casts a shadow 2\u221A3m long. Find the sun's altitude angle.",
    correctRatio: "tan",
    ratioHint: "You know the opposite (pole height) and adjacent (shadow length)",
    equation: "tan \u03B8 = 6 / 2\u221A3 = 3/\u221A3 = \u221A3",
    computeSteps: "tan \u03B8 = \u221A3",
    computeAnswer: "\u221A3",
    computeOptions: ["\u221A3", "1/\u221A3", "1", "\u221A3/2"],
    angleAnswer: "60\u00B0",
    angleOptions: ["30\u00B0", "45\u00B0", "60\u00B0", "90\u00B0"],
    finalAnswer: "60\u00B0",
    finalLabel: "sun's altitude",
    poleHeight: 6,
    shadowLen: 3.46,
    findAngle: true,
  },
  {
    description:
      "The sun's altitude is 45\u00B0. A tree is 12m tall. Find the shadow length.",
    correctRatio: "tan",
    ratioHint: "Opposite (tree height) and adjacent (shadow) with a known angle",
    equation: "tan 45\u00B0 = 12 / shadow",
    computeSteps: "1 = 12 / shadow  \u2192  shadow = 12",
    computeAnswer: "12",
    computeOptions: ["6", "12", "12\u221A3", "12\u221A2"],
    angleAnswer: null,
    angleOptions: [],
    finalAnswer: "12m",
    finalLabel: "shadow length",
    poleHeight: 12,
    shadowLen: 12,
    findAngle: false,
  },
  {
    description:
      "A tower's shadow is \u221A3 times its height. Find the sun's altitude angle.",
    correctRatio: "tan",
    ratioHint: "tan \u03B8 = height / shadow = h / (\u221A3 \u00D7 h)",
    equation: "tan \u03B8 = h / (\u221A3 \u00D7 h) = 1/\u221A3",
    computeSteps: "tan \u03B8 = 1/\u221A3",
    computeAnswer: "1/\u221A3",
    computeOptions: ["\u221A3", "1/\u221A3", "1", "1/2"],
    angleAnswer: "30\u00B0",
    angleOptions: ["30\u00B0", "45\u00B0", "60\u00B0", "90\u00B0"],
    finalAnswer: "30\u00B0",
    finalLabel: "sun's altitude",
    poleHeight: 8,
    shadowLen: 13.86,
    findAngle: true,
  },
];

export default function Level17ShadowHunter({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(false);

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
      if (answer === scenario.computeAnswer) {
        if (scenario.findAngle) {
          setPhase("find-angle");
        } else {
          setPhase("success");
          advanceOrFinish();
        }
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scenario],
  );

  const handleAngle = useCallback(
    (answer: string) => {
      if (answer === scenario.angleAnswer) {
        setPhase("success");
        advanceOrFinish();
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scenario],
  );

  function advanceOrFinish() {
    setTimeout(() => {
      if (scenarioIdx < scenarios.length - 1) {
        setScenarioIdx((s) => s + 1);
        setPhase("scene");
      } else {
        setPhase("done");
        const bonus = mistakes === 0 ? 20 : 0;
        onComplete(70 + bonus);
      }
    }, 2000);
  }

  if (phase === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
          World 4 &middot; Level 17
        </p>
        <h2 className="text-2xl font-bold mb-4">Shadow Hunter</h2>
        <p className="text-white/50 text-sm mb-2">
          The sun casts shadows. The altitude angle of the sun determines how
          long the shadow is. Given some measurements, figure out the rest.
        </p>
        <p className="text-white/40 text-xs mb-2">
          Sometimes you find the shadow. Sometimes you find the angle.
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
  const poleX = 140;
  const poleScale = 10; // px per meter for display
  const poleDisplayH = Math.min(scenario.poleHeight * poleScale, 140);
  const poleTopY = groundY - poleDisplayH;
  const shadowEndX = poleX + Math.min(scenario.shadowLen * poleScale, 130);
  const sunX = 280;
  const sunY = 35;

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
            <linearGradient id="sky17" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(253,203,110,0.04)" />
              <stop offset="100%" stopColor="rgba(15,15,19,0)" />
            </linearGradient>
          </defs>
          <rect width="320" height="260" fill="url(#sky17)" />

          {/* Sun */}
          <motion.circle
            cx={sunX}
            cy={sunY}
            r="16"
            fill="rgba(253,203,110,0.3)"
            animate={{ r: [16, 18, 16] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <circle cx={sunX} cy={sunY} r="10" fill="rgba(253,203,110,0.5)" />

          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={sunX + Math.cos(rad) * 20}
                y1={sunY + Math.sin(rad) * 20}
                x2={sunX + Math.cos(rad) * 28}
                y2={sunY + Math.sin(rad) * 28}
                stroke="rgba(253,203,110,0.2)"
                strokeWidth="1"
              />
            );
          })}

          {/* Diagonal sun ray to pole top */}
          <line
            x1={sunX}
            y1={sunY}
            x2={poleX}
            y2={poleTopY}
            stroke="rgba(253,203,110,0.08)"
            strokeWidth="1"
            strokeDasharray="6,4"
          />

          {/* Ground */}
          <line
            x1="0"
            y1={groundY}
            x2="320"
            y2={groundY}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />

          {/* Pole/tree */}
          <line
            x1={poleX}
            y1={groundY}
            x2={poleX}
            y2={poleTopY}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Tree crown (small) */}
          <circle
            cx={poleX}
            cy={poleTopY - 6}
            r="10"
            fill="rgba(0,184,148,0.15)"
          />

          {/* Shadow on ground */}
          <line
            x1={poleX}
            y1={groundY}
            x2={shadowEndX}
            y2={groundY}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Shadow tip line to pole top (line of sight) */}
          <line
            x1={shadowEndX}
            y1={groundY}
            x2={poleX}
            y2={poleTopY}
            stroke="rgba(162,155,254,0.2)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />

          {/* Angle arc at shadow tip */}
          <path
            d={`M ${shadowEndX - 25},${groundY} A 25 25 0 0 0 ${shadowEndX - 18},${groundY - 20}`}
            fill="none"
            stroke="rgba(162,155,254,0.4)"
            strokeWidth="1"
          />
          <text
            x={shadowEndX - 40}
            y={groundY - 8}
            fill="#a29bfe"
            fontSize="11"
            fontWeight="bold"
          >
            {scenario.findAngle ? "\u03B8?" : ""}
          </text>

          {/* Height label */}
          <text
            x={poleX - 30}
            y={(poleTopY + groundY) / 2}
            fill="rgba(253,203,110,0.5)"
            fontSize="11"
            fontWeight="bold"
          >
            {scenario.poleHeight}m
          </text>

          {/* Shadow label */}
          <text
            x={(poleX + shadowEndX) / 2}
            y={groundY + 18}
            textAnchor="middle"
            fill="rgba(255,255,255,0.3)"
            fontSize="10"
          >
            {scenario.findAngle
              ? `shadow`
              : "shadow = ?"}
          </text>

          {/* Right angle at pole base */}
          <polyline
            points={`${poleX + 8},${groundY} ${poleX + 8},${groundY - 8} ${poleX},${groundY - 8}`}
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
          <p className="text-sm text-white/50 mb-4">
            Which trig ratio relates the height and shadow?
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
          <p className="text-sm text-white/50 mb-2">{scenario.equation}</p>
          <p className="text-sm text-white/70 mb-4 font-medium">
            {scenario.findAngle ? "tan \u03B8 = ?" : `${scenario.finalLabel} = ?`}
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {scenario.computeOptions.map((opt) => (
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

      {phase === "find-angle" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-white/50 mb-2">{scenario.computeSteps}</p>
          <p className="text-sm text-white/70 mb-4 font-medium">
            What is the angle \u03B8?
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {scenario.angleOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAngle(opt)}
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
          <p className="text-success text-lg font-bold">Correct!</p>
          <p className="text-white/40 text-sm mt-1">
            {scenario.finalLabel} = {scenario.finalAnswer}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
