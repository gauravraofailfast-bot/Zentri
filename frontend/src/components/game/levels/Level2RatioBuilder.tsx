"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  onComplete: (xpEarned: number) => void;
}

interface TriangleSet {
  sides: { opp: number; adj: number; hyp: number };
  label: string;
}

const triangles: TriangleSet[] = [
  { sides: { opp: 3, adj: 4, hyp: 5 }, label: "3-4-5" },
  { sides: { opp: 5, adj: 12, hyp: 13 }, label: "5-12-13" },
];

type Ratio = "sin" | "cos" | "tan";

const ratioOrder: Ratio[] = ["sin", "cos", "tan"];

function getRatioAnswer(
  ratio: Ratio,
  t: TriangleSet,
): { num: number; den: number } {
  switch (ratio) {
    case "sin":
      return { num: t.sides.opp, den: t.sides.hyp };
    case "cos":
      return { num: t.sides.adj, den: t.sides.hyp };
    case "tan":
      return { num: t.sides.opp, den: t.sides.adj };
  }
}

function getRatioExplanation(ratio: Ratio): string {
  switch (ratio) {
    case "sin":
      return "Opposite \u00F7 Hypotenuse";
    case "cos":
      return "Adjacent \u00F7 Hypotenuse";
    case "tan":
      return "Opposite \u00F7 Adjacent";
  }
}

export default function Level2RatioBuilder({ onComplete }: Props) {
  const [triIdx, setTriIdx] = useState(0);
  const [ratioIdx, setRatioIdx] = useState(0);
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [selectedDen, setSelectedDen] = useState<number | null>(null);
  const [phase, setPhase] = useState<"num" | "den" | "correct">("num");
  const [shake, setShake] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [completedRatios, setCompletedRatios] = useState<string[]>([]);

  const tri = triangles[triIdx];
  const ratio = ratioOrder[ratioIdx];
  const answer = getRatioAnswer(ratio, tri);
  const availableNums = [tri.sides.opp, tri.sides.adj, tri.sides.hyp];

  const handleNumberTap = useCallback(
    (num: number) => {
      if (phase === "correct") return;

      if (phase === "num") {
        setSelectedNum(num);
        if (num === answer.num) {
          setPhase("den");
        } else {
          setShake(true);
          setMistakes((m) => m + 1);
          setTimeout(() => {
            setShake(false);
            setSelectedNum(null);
          }, 500);
        }
      } else if (phase === "den") {
        setSelectedDen(num);
        if (num === answer.den) {
          setPhase("correct");
          const key = `${triIdx}-${ratio}`;
          setCompletedRatios((prev) => [...prev, key]);

          setTimeout(() => {
            if (ratioIdx < ratioOrder.length - 1) {
              setRatioIdx((r) => r + 1);
              setSelectedNum(null);
              setSelectedDen(null);
              setPhase("num");
            } else if (triIdx < triangles.length - 1) {
              setTriIdx((t) => t + 1);
              setRatioIdx(0);
              setSelectedNum(null);
              setSelectedDen(null);
              setPhase("num");
            } else {
              const bonus = mistakes === 0 ? 20 : 0;
              onComplete(50 + bonus);
            }
          }, 1000);
        } else {
          setShake(true);
          setMistakes((m) => m + 1);
          setTimeout(() => {
            setShake(false);
            setSelectedDen(null);
          }, 500);
        }
      }
    },
    [phase, answer, ratio, ratioIdx, triIdx, mistakes, onComplete],
  );

  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/25 mb-4">
          World 1 &middot; Level 2
        </p>
        <h2 className="text-2xl font-bold mb-4">Ratio Builder</h2>
        <p className="text-white/50 text-sm mb-2">
          Trigonometric ratios are fractions built from the sides of a right
          triangle.
        </p>
        <div className="text-left max-w-xs mx-auto my-6 space-y-2 text-sm">
          <p className="text-accent-light">
            sin A = Opposite &divide; Hypotenuse
          </p>
          <p className="text-success">
            cos A = Adjacent &divide; Hypotenuse
          </p>
          <p className="text-warning">
            tan A = Opposite &divide; Adjacent
          </p>
        </div>
        <p className="text-white/40 text-xs mb-8">
          Tap the correct numbers to build each ratio.
        </p>
        <button
          onClick={() => setShowIntro(false)}
          className="px-8 py-3 text-sm uppercase tracking-[0.1em] font-medium text-accent-light border border-accent/30 rounded-full hover:border-accent/60 transition-all duration-300"
        >
          Start
        </button>
      </motion.div>
    );
  }

  // Triangle SVG coordinates
  const A = { x: 40, y: 200 };
  const B = { x: 240, y: 200 };
  const C = { x: 240, y: 50 };

  const ratioColor =
    ratio === "sin"
      ? "text-accent-light"
      : ratio === "cos"
        ? "text-success"
        : "text-warning";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-white/30">
          Triangle {triIdx + 1}/{triangles.length}
        </span>
        <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent/50 rounded-full"
            animate={{
              width: `${((triIdx * 3 + ratioIdx) / (triangles.length * 3)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Triangle SVG */}
      <svg viewBox="0 0 280 230" className="w-full max-w-xs mx-auto mb-6">
        <polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
          fill="rgba(108,92,231,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />

        {/* Right angle at B */}
        <polyline
          points={`${B.x - 15},${B.y} ${B.x - 15},${B.y - 15} ${B.x},${B.y - 15}`}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />

        {/* Angle A highlight */}
        <circle
          cx={A.x}
          cy={A.y}
          r="16"
          fill="rgba(162,155,254,0.12)"
          stroke="rgba(162,155,254,0.3)"
          strokeWidth="1"
        />
        <text
          x={A.x + 22}
          y={A.y - 8}
          fill="#a29bfe"
          fontSize="13"
          fontWeight="bold"
        >
          A
        </text>

        {/* Side labels with values */}
        {/* Bottom: Adjacent */}
        <text
          x={(A.x + B.x) / 2}
          y={A.y + 22}
          textAnchor="middle"
          fill="#00cec9"
          fontSize="13"
          fontWeight="600"
        >
          {tri.sides.adj}
        </text>
        <text
          x={(A.x + B.x) / 2}
          y={A.y + 35}
          textAnchor="middle"
          fill="rgba(0,206,201,0.4)"
          fontSize="9"
        >
          adjacent
        </text>

        {/* Right: Opposite */}
        <text
          x={B.x + 18}
          y={(B.y + C.y) / 2}
          fill="#a29bfe"
          fontSize="13"
          fontWeight="600"
        >
          {tri.sides.opp}
        </text>
        <text
          x={B.x + 18}
          y={(B.y + C.y) / 2 + 13}
          fill="rgba(162,155,254,0.4)"
          fontSize="9"
        >
          opp
        </text>

        {/* Hypotenuse */}
        <text
          x={(A.x + C.x) / 2 - 25}
          y={(A.y + C.y) / 2 - 5}
          fill="#fdcb6e"
          fontSize="13"
          fontWeight="600"
          textAnchor="middle"
        >
          {tri.sides.hyp}
        </text>
        <text
          x={(A.x + C.x) / 2 - 25}
          y={(A.y + C.y) / 2 + 8}
          fill="rgba(253,203,110,0.4)"
          fontSize="9"
          textAnchor="middle"
        >
          hyp
        </text>
      </svg>

      {/* Ratio being built */}
      <motion.div
        animate={shake ? { x: [0, -8, 8, -8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <p className="text-xs text-white/30 mb-2">
          {getRatioExplanation(ratio)}
        </p>
        <div className="flex items-center justify-center gap-2 text-2xl font-bold">
          <span className={ratioColor}>{ratio} A</span>
          <span className="text-white/30">=</span>
          <div className="flex flex-col items-center">
            <span
              className={`px-4 py-1 min-w-[48px] border-b-2 ${
                selectedNum !== null
                  ? phase === "correct" || phase === "den"
                    ? "text-foreground border-success/50"
                    : "text-danger border-danger/50"
                  : "text-white/20 border-white/10"
              }`}
            >
              {selectedNum ?? "?"}
            </span>
            <span
              className={`px-4 py-1 min-w-[48px] ${
                selectedDen !== null
                  ? phase === "correct"
                    ? "text-foreground border-success/50"
                    : "text-danger border-danger/50"
                  : "text-white/20"
              }`}
            >
              {selectedDen ?? "?"}
            </span>
          </div>
        </div>
        <p className="text-xs text-white/25 mt-2">
          {phase === "num"
            ? "Tap the numerator"
            : phase === "den"
              ? "Tap the denominator"
              : "Correct!"}
        </p>
      </motion.div>

      {/* Number buttons */}
      <div className="flex gap-4 justify-center">
        {availableNums.map((num) => (
          <motion.button
            key={`${triIdx}-${num}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNumberTap(num)}
            disabled={phase === "correct"}
            className="w-16 h-16 text-lg font-bold rounded-xl border border-white/[0.1] bg-surface hover:bg-surface-hover transition-all duration-200 disabled:opacity-30"
          >
            {num}
          </motion.button>
        ))}
      </div>

      {/* Completed ratios indicator */}
      <div className="flex gap-2 justify-center mt-6">
        {ratioOrder.map((r, i) => {
          const key = `${triIdx}-${r}`;
          const done = completedRatios.includes(key);
          const active = i === ratioIdx;
          return (
            <div
              key={r}
              className={`w-2 h-2 rounded-full transition-colors ${
                done
                  ? "bg-success"
                  : active
                    ? "bg-accent-light"
                    : "bg-white/10"
              }`}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
