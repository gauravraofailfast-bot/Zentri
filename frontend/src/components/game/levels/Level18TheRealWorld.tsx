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

interface Step {
  prompt: string;
  ratioOptions: string[];
  correctRatio: string;
  equation: string;
  computeSteps: string;
  answer: string;
  answerOptions: string[];
  label: string;
}

interface Scenario {
  description: string;
  sceneId: "cliff" | "kite" | "flagstaff" | "twopoles" | "river";
  steps: Step[];
  finalAnswer: string;
  finalLabel: string;
}

const scenarios: Scenario[] = [
  {
    description:
      "From the top of a 60m cliff, angles of depression to two ships in line are 30\u00B0 and 60\u00B0. How far apart are the ships?",
    sceneId: "cliff",
    steps: [
      {
        prompt: "Find distance to the farther ship (30\u00B0 depression).",
        ratioOptions: ["sin", "cos", "tan"],
        correctRatio: "tan",
        equation: "tan 30\u00B0 = 60 / d\u2081",
        computeSteps: "1/\u221A3 = 60/d\u2081  \u2192  d\u2081 = 60\u221A3",
        answer: "60\u221A3",
        answerOptions: ["60\u221A3", "60/\u221A3", "30\u221A3", "20\u221A3"],
        label: "d\u2081 (far ship)",
      },
      {
        prompt: "Find distance to the nearer ship (60\u00B0 depression). Then subtract.",
        ratioOptions: ["sin", "cos", "tan"],
        correctRatio: "tan",
        equation: "tan 60\u00B0 = 60/d\u2082  \u2192  d\u2082 = 60/\u221A3 = 20\u221A3. Gap = 60\u221A3 - 20\u221A3",
        computeSteps: "Gap = 40\u221A3m",
        answer: "40\u221A3",
        answerOptions: ["40\u221A3", "60\u221A3", "20\u221A3", "80\u221A3"],
        label: "gap between ships",
      },
    ],
    finalAnswer: "40\u221A3",
    finalLabel: "distance between ships",
  },
  {
    description:
      "A kite string is 100m long and makes 60\u00B0 with the ground. Find the height of the kite.",
    sceneId: "kite",
    steps: [
      {
        prompt: "Which ratio connects height (opposite) and string (hypotenuse)?",
        ratioOptions: ["sin", "cos", "tan"],
        correctRatio: "sin",
        equation: "sin 60\u00B0 = h / 100",
        computeSteps: "\u221A3/2 = h/100  \u2192  h = 50\u221A3",
        answer: "50\u221A3",
        answerOptions: ["50\u221A3", "100\u221A3", "50", "100"],
        label: "kite height",
      },
    ],
    finalAnswer: "50\u221A3",
    finalLabel: "kite height",
  },
  {
    description:
      "From 30m away, angle of elevation to a tower = 30\u00B0. A flagstaff on it makes the total angle 45\u00B0. Find the flagstaff height.",
    sceneId: "flagstaff",
    steps: [
      {
        prompt: "Find the tower height using 30\u00B0 elevation. Distance = 30m.",
        ratioOptions: ["sin", "cos", "tan"],
        correctRatio: "tan",
        equation: "tan 30\u00B0 = H/30",
        computeSteps: "1/\u221A3 = H/30  \u2192  H = 30/\u221A3 = 10\u221A3",
        answer: "10\u221A3",
        answerOptions: ["10\u221A3", "30\u221A3", "30", "10"],
        label: "tower height",
      },
      {
        prompt: "Total angle is 45\u00B0: tan 45\u00B0 = (H+f)/30. Find flagstaff height f.",
        ratioOptions: ["sin", "cos", "tan"],
        correctRatio: "tan",
        equation: "1 = (10\u221A3 + f)/30  \u2192  f = 30 - 10\u221A3",
        computeSteps: "f = 30 - 10\u221A3m",
        answer: "30 - 10\u221A3",
        answerOptions: ["30 - 10\u221A3", "30 + 10\u221A3", "10\u221A3", "20\u221A3"],
        label: "flagstaff height",
      },
    ],
    finalAnswer: "30 - 10\u221A3",
    finalLabel: "flagstaff height",
  },
  {
    description:
      "Two equal-height poles stand on opposite sides of an 80m road. Angles of elevation from a point on the road are 60\u00B0 and 30\u00B0. Find the height.",
    sceneId: "twopoles",
    steps: [
      {
        prompt:
          "Let d = distance to the 60\u00B0 pole. tan 60\u00B0 = h/d and tan 30\u00B0 = h/(80-d). Solve for d.",
        ratioOptions: ["sin", "cos", "tan"],
        correctRatio: "tan",
        equation: "h = d\u221A3 = (80-d)/\u221A3  \u2192  3d = 80-d  \u2192  4d = 80",
        computeSteps: "d = 20m",
        answer: "20",
        answerOptions: ["20", "40", "60", "10"],
        label: "distance d",
      },
      {
        prompt: "Now find the height: h = d\u221A3 = 20\u221A3.",
        ratioOptions: ["sin", "cos", "tan"],
        correctRatio: "tan",
        equation: "h = 20 \u00D7 \u221A3",
        computeSteps: "h = 20\u221A3m",
        answer: "20\u221A3",
        answerOptions: ["20\u221A3", "40\u221A3", "20", "80\u221A3"],
        label: "pole height",
      },
    ],
    finalAnswer: "20\u221A3",
    finalLabel: "pole height",
  },
  {
    description:
      "A TV tower on a river bank. From the opposite bank, angle of elevation = 60\u00B0. Walk 20m back, angle = 30\u00B0. Find the river width.",
    sceneId: "river",
    steps: [
      {
        prompt:
          "Let w = river width, h = tower height. tan 60\u00B0 = h/w, tan 30\u00B0 = h/(w+20). Eliminate h.",
        ratioOptions: ["sin", "cos", "tan"],
        correctRatio: "tan",
        equation: "w\u221A3 = (w+20)/\u221A3  \u2192  3w = w+20  \u2192  2w = 20",
        computeSteps: "w = 10m",
        answer: "10",
        answerOptions: ["10", "20", "30", "40"],
        label: "river width",
      },
    ],
    finalAnswer: "10",
    finalLabel: "river width",
  },
];

export default function Level18TheRealWorld({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const scenario = scenarios[scenarioIdx];
  const currentStep = scenario.steps[stepIdx];
  const isLastStep = stepIdx === scenario.steps.length - 1;

  const handlePickRatio = useCallback(
    (ratio: string) => {
      if (ratio === currentStep.correctRatio) {
        if (phase === "step1-ratio" || phase === "scene") {
          setPhase("step1-compute");
        } else {
          setPhase("step2-compute");
          setShowHint(false);
        }
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    [currentStep, phase],
  );

  const handleCompute = useCallback(
    (answer: string) => {
      if (answer === currentStep.answer) {
        if (isLastStep) {
          setPhase("success");
          setTimeout(() => {
            if (scenarioIdx < scenarios.length - 1) {
              setScenarioIdx((s) => s + 1);
              setStepIdx(0);
              setPhase("scene");
              setShowHint(false);
            } else {
              setPhase("done");
              const bonus = mistakes === 0 ? 20 : 0;
              onComplete(100 + bonus);
            }
          }, 2000);
        } else {
          // Move to next step
          setStepIdx((s) => s + 1);
          setPhase("step2-ratio");
        }
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    [currentStep, isLastStep, scenarioIdx, mistakes, onComplete],
  );

  if (phase === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
          World 4 &middot; Level 18 &middot; FINAL BOSS
        </p>
        <h2 className="text-2xl font-bold mb-4">The Real World</h2>
        <p className="text-white/50 text-sm mb-2">
          Cliffs, kites, flagstaffs, poles, rivers — five challenging problems
          that combine everything you have learned. This is the ultimate test of
          Heights and Distances.
        </p>
        <p className="text-white/40 text-xs mb-2">
          5 scenarios. Multi-step. No mercy.
        </p>
        <p className="text-white/30 text-xs mb-8">
          NCERT Chapter 9 — Heights and Distances (Capstone)
        </p>
        <button
          onClick={() => setPhase("scene")}
          className="px-8 py-3 text-sm uppercase tracking-[0.1em] font-medium text-accent-light border border-accent/30 rounded-full hover:border-accent/60 transition-all duration-300"
        >
          Begin Final Challenge
        </button>
      </motion.div>
    );
  }

  // --- SVG scene rendering per scenario ---
  const groundY = 220;

  const renderScene = () => {
    switch (scenario.sceneId) {
      case "cliff":
        return (
          <>
            {/* Cliff */}
            <rect
              x="20"
              y="60"
              width="60"
              height={groundY - 60}
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              rx="2"
            />
            <text x="35" y="145" fill="rgba(255,255,255,0.3)" fontSize="10">
              60m
            </text>

            {/* Water */}
            <rect
              x="80"
              y={groundY}
              width="240"
              height="20"
              fill="rgba(108,92,231,0.06)"
            />
            {[100, 140, 180, 220, 260].map((x) => (
              <motion.path
                key={x}
                d={`M ${x},${groundY + 8} Q ${x + 10},${groundY + 4} ${x + 20},${groundY + 8}`}
                fill="none"
                stroke="rgba(162,155,254,0.15)"
                strokeWidth="1"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: x * 0.01 }}
              />
            ))}

            {/* Ship 1 (far) */}
            <polygon
              points="240,208 250,200 260,208"
              fill="rgba(253,203,110,0.3)"
            />
            <line
              x1="250"
              y1="200"
              x2="250"
              y2="192"
              stroke="rgba(253,203,110,0.3)"
              strokeWidth="1"
            />
            <text x="242" y={groundY + 18} fill="rgba(253,203,110,0.4)" fontSize="9">
              S1
            </text>

            {/* Ship 2 (near) */}
            <polygon
              points="130,208 140,200 150,208"
              fill="rgba(0,184,148,0.3)"
            />
            <line
              x1="140"
              y1="200"
              x2="140"
              y2="192"
              stroke="rgba(0,184,148,0.3)"
              strokeWidth="1"
            />
            <text x="132" y={groundY + 18} fill="rgba(0,184,148,0.4)" fontSize="9">
              S2
            </text>

            {/* Depression lines */}
            <line
              x1="50"
              y1="60"
              x2="250"
              y2={groundY}
              stroke="rgba(253,203,110,0.15)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <line
              x1="50"
              y1="60"
              x2="140"
              y2={groundY}
              stroke="rgba(0,184,148,0.15)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />

            {/* Horizontal from cliff top */}
            <line
              x1="50"
              y1="60"
              x2="280"
              y2="60"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              strokeDasharray="3,3"
            />

            {/* Angle labels */}
            <text x="90" y="78" fill="#a29bfe" fontSize="10">
              30&deg;
            </text>
            <text x="70" y="95" fill="rgba(0,184,148,0.6)" fontSize="10">
              60&deg;
            </text>

            {/* Observer on cliff */}
            <circle cx="50" cy="52" r="5" fill="rgba(162,155,254,0.5)" />

            {/* Gap label */}
            <line
              x1="140"
              y1={groundY + 25}
              x2="250"
              y2={groundY + 25}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
            <text
              x="195"
              y={groundY + 38}
              textAnchor="middle"
              fill="rgba(253,203,110,0.5)"
              fontSize="10"
              fontWeight="bold"
            >
              gap = ?
            </text>
          </>
        );

      case "kite":
        return (
          <>
            {/* Person */}
            <circle cx="60" cy={groundY - 12} r="5" fill="rgba(162,155,254,0.5)" />
            <line
              x1="60"
              y1={groundY - 7}
              x2="60"
              y2={groundY}
              stroke="rgba(162,155,254,0.3)"
              strokeWidth="1.5"
            />

            {/* Kite */}
            <motion.g
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <polygon
                points="230,45 240,60 230,70 220,60"
                fill="rgba(255,118,117,0.3)"
                stroke="rgba(255,118,117,0.5)"
                strokeWidth="1"
              />
              {/* Tail */}
              <path
                d="M 230,70 Q 235,80 228,90 Q 235,95 230,105"
                fill="none"
                stroke="rgba(255,118,117,0.3)"
                strokeWidth="1"
              />
            </motion.g>

            {/* String */}
            <line
              x1="60"
              y1={groundY - 12}
              x2="230"
              y2="60"
              stroke="rgba(253,203,110,0.3)"
              strokeWidth="1"
            />

            {/* String label */}
            <text
              x="130"
              y="110"
              fill="rgba(253,203,110,0.5)"
              fontSize="10"
              transform="rotate(-45, 130, 110)"
            >
              100m
            </text>

            {/* Angle */}
            <path
              d={`M 95,${groundY - 12} A 35 35 0 0 0 82,${groundY - 38}`}
              fill="none"
              stroke="rgba(162,155,254,0.4)"
              strokeWidth="1"
            />
            <text x="96" y={groundY - 22} fill="#a29bfe" fontSize="11" fontWeight="bold">
              60&deg;
            </text>

            {/* Height line */}
            <line
              x1="230"
              y1="60"
              x2="230"
              y2={groundY}
              stroke="rgba(253,203,110,0.15)"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            <text x="236" y="145" fill="rgba(253,203,110,0.5)" fontSize="10" fontWeight="bold">
              h = ?
            </text>
          </>
        );

      case "flagstaff":
        return (
          <>
            {/* Building */}
            <rect
              x="220"
              y="100"
              width="40"
              height={groundY - 100}
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              rx="2"
            />
            {/* Flagpole */}
            <line
              x1="240"
              y1="100"
              x2="240"
              y2="60"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
            <polygon
              points="240,60 255,66 240,72"
              fill="rgba(255,118,117,0.4)"
            />

            {/* Observer */}
            <circle cx="60" cy={groundY - 12} r="5" fill="rgba(162,155,254,0.5)" />
            <line
              x1="60"
              y1={groundY - 7}
              x2="60"
              y2={groundY}
              stroke="rgba(162,155,254,0.3)"
              strokeWidth="1.5"
            />

            {/* Lines of sight */}
            <line
              x1="60"
              y1={groundY - 12}
              x2="240"
              y2="100"
              stroke="rgba(162,155,254,0.15)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <line
              x1="60"
              y1={groundY - 12}
              x2="240"
              y2="60"
              stroke="rgba(253,203,110,0.15)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />

            {/* Angles */}
            <text x="100" y={groundY - 20} fill="#a29bfe" fontSize="10">
              30&deg;
            </text>
            <text x="100" y={groundY - 35} fill="rgba(253,203,110,0.6)" fontSize="10">
              45&deg;
            </text>

            {/* Distance */}
            <text
              x="140"
              y={groundY + 16}
              textAnchor="middle"
              fill="rgba(255,255,255,0.3)"
              fontSize="10"
            >
              30m
            </text>

            {/* Flag label */}
            <text x="250" y="85" fill="rgba(253,203,110,0.5)" fontSize="10" fontWeight="bold">
              f = ?
            </text>
          </>
        );

      case "twopoles":
        return (
          <>
            {/* Left pole */}
            <line
              x1="40"
              y1={groundY}
              x2="40"
              y2="80"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Right pole */}
            <line
              x1="280"
              y1={groundY}
              x2="280"
              y2="80"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Road */}
            <rect
              x="40"
              y={groundY}
              width="240"
              height="8"
              fill="rgba(255,255,255,0.04)"
            />
            <line
              x1="40"
              y1={groundY + 4}
              x2="280"
              y2={groundY + 4}
              stroke="rgba(253,203,110,0.15)"
              strokeWidth="1"
              strokeDasharray="8,6"
            />

            {/* Observer point */}
            <circle cx="100" cy={groundY - 5} r="4" fill="rgba(162,155,254,0.5)" />

            {/* Lines of sight */}
            <line
              x1="100"
              y1={groundY - 5}
              x2="40"
              y2="80"
              stroke="rgba(162,155,254,0.15)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <line
              x1="100"
              y1={groundY - 5}
              x2="280"
              y2="80"
              stroke="rgba(253,203,110,0.15)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />

            {/* Angle labels */}
            <text x="72" y={groundY - 14} fill="#a29bfe" fontSize="10">
              60&deg;
            </text>
            <text x="118" y={groundY - 14} fill="rgba(253,203,110,0.6)" fontSize="10">
              30&deg;
            </text>

            {/* Road width */}
            <text
              x="160"
              y={groundY + 22}
              textAnchor="middle"
              fill="rgba(255,255,255,0.3)"
              fontSize="10"
            >
              80m road
            </text>

            {/* Height label */}
            <text x="286" y="150" fill="rgba(253,203,110,0.5)" fontSize="10" fontWeight="bold">
              h?
            </text>
          </>
        );

      case "river":
        return (
          <>
            {/* Tower on far bank */}
            <rect
              x="135"
              y="60"
              width="30"
              height={groundY - 60}
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              rx="2"
            />

            {/* River */}
            <rect
              x="165"
              y={groundY - 4}
              width="60"
              height="12"
              fill="rgba(108,92,231,0.08)"
            />
            {[170, 190, 210].map((x) => (
              <motion.path
                key={x}
                d={`M ${x},${groundY + 2} Q ${x + 5},${groundY - 1} ${x + 10},${groundY + 2}`}
                fill="none"
                stroke="rgba(162,155,254,0.15)"
                strokeWidth="1"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            ))}

            {/* Near bank */}
            <line
              x1="225"
              y1={groundY}
              x2="320"
              y2={groundY}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />

            {/* Observer positions */}
            <circle cx="230" cy={groundY - 8} r="4" fill="rgba(0,184,148,0.5)" />
            <text x="222" y={groundY - 14} fill="rgba(0,184,148,0.4)" fontSize="8">
              P1
            </text>

            <circle cx="270" cy={groundY - 8} r="4" fill="rgba(253,203,110,0.5)" />
            <text x="262" y={groundY - 14} fill="rgba(253,203,110,0.4)" fontSize="8">
              P2
            </text>

            {/* 20m label between P1 and P2 */}
            <line
              x1="230"
              y1={groundY + 14}
              x2="270"
              y2={groundY + 14}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
            <text
              x="250"
              y={groundY + 26}
              textAnchor="middle"
              fill="rgba(255,255,255,0.3)"
              fontSize="9"
            >
              20m
            </text>

            {/* Lines of sight */}
            <line
              x1="230"
              y1={groundY - 8}
              x2="150"
              y2="60"
              stroke="rgba(0,184,148,0.15)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <line
              x1="270"
              y1={groundY - 8}
              x2="150"
              y2="60"
              stroke="rgba(253,203,110,0.15)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />

            {/* Angles */}
            <text x="208" y={groundY - 16} fill="rgba(0,184,148,0.6)" fontSize="10">
              60&deg;
            </text>
            <text x="258" y={groundY - 20} fill="rgba(253,203,110,0.6)" fontSize="10">
              30&deg;
            </text>

            {/* River width label */}
            <text
              x="195"
              y={groundY + 26}
              textAnchor="middle"
              fill="rgba(162,155,254,0.5)"
              fontSize="10"
              fontWeight="bold"
            >
              w = ?
            </text>
          </>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-white/30">
          Challenge {scenarioIdx + 1}/{scenarios.length}
        </span>
        <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent/50 rounded-full"
            animate={{
              width: `${(scenarioIdx / scenarios.length) * 100}%`,
            }}
          />
        </div>
        {scenarioIdx >= 3 && (
          <span className="text-[10px] text-warning/50">BOSS</span>
        )}
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
            <linearGradient id="sky18" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(108,92,231,0.05)" />
              <stop offset="100%" stopColor="rgba(15,15,19,0)" />
            </linearGradient>
          </defs>
          <rect width="320" height="260" fill="url(#sky18)" />

          {/* Ground */}
          <line
            x1="0"
            y1={groundY}
            x2="320"
            y2={groundY}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />

          {renderScene()}
        </svg>
      </motion.div>

      {/* Interaction */}
      {(phase === "scene" || phase === "step1-ratio") && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {scenario.steps.length > 1 && (
            <p className="text-xs text-white/30 mb-2">
              Step {stepIdx + 1} of {scenario.steps.length}
            </p>
          )}
          <p className="text-sm text-white/50 mb-4">{currentStep.prompt}</p>
          <p className="text-sm text-white/50 mb-3">Which ratio?</p>
          <div className="flex gap-3 justify-center">
            {currentStep.ratioOptions.map((r) => (
              <button
                key={r}
                onClick={() => handlePickRatio(r)}
                className="px-6 py-3 text-sm font-semibold rounded-xl border border-white/[0.1] bg-surface hover:bg-surface-hover transition-all duration-200"
              >
                {r}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {phase === "step1-compute" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {scenario.steps.length > 1 && (
            <p className="text-xs text-white/30 mb-2">
              Step {stepIdx + 1} of {scenario.steps.length}
            </p>
          )}
          <p className="text-sm text-white/70 mb-3 font-medium">
            {currentStep.label} = ?
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
              <p className="text-xs text-white/40">{currentStep.equation}</p>
            </motion.div>
          )}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {currentStep.answerOptions.map((opt) => (
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

      {phase === "step2-ratio" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-xs text-white/30 mb-2">
            Step {stepIdx + 1} of {scenario.steps.length}
          </p>
          <p className="text-sm text-success/70 mb-2">
            {scenario.steps[stepIdx - 1]?.label} = {scenario.steps[stepIdx - 1]?.answer} &#10003;
          </p>
          <p className="text-sm text-white/50 mb-4">{currentStep.prompt}</p>
          <p className="text-sm text-white/50 mb-3">Which ratio?</p>
          <div className="flex gap-3 justify-center">
            {currentStep.ratioOptions.map((r) => (
              <button
                key={r}
                onClick={() => handlePickRatio(r)}
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
          <p className="text-xs text-white/30 mb-2">
            Step {stepIdx + 1} of {scenario.steps.length}
          </p>
          <p className="text-sm text-white/70 mb-3 font-medium">
            {currentStep.label} = ?
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
              <p className="text-xs text-white/40">{currentStep.equation}</p>
            </motion.div>
          )}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {currentStep.answerOptions.map((opt) => (
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

      {phase === "success" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-success text-lg font-bold">
            {scenarioIdx === scenarios.length - 1
              ? "Challenge Complete!"
              : "Solved!"}
          </p>
          <p className="text-white/40 text-sm mt-1">
            {scenario.finalLabel} = {scenario.finalAnswer}m
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
