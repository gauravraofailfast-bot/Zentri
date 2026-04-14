"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  onComplete: (xpEarned: number) => void;
}

interface Question {
  label: string;
  correct: string;
  options: string[];
  explanation?: string;
}

const zeroRatios: Question[] = [
  { label: "sin 0°", correct: "0", options: ["0", "1", "∞", "undefined"] },
  { label: "cos 0°", correct: "1", options: ["0", "1", "1/2", "undefined"] },
  { label: "tan 0°", correct: "0", options: ["0", "1", "undefined", "∞"] },
];

const ninetyRatios: Question[] = [
  { label: "sin 90°", correct: "1", options: ["0", "1", "∞", "undefined"] },
  { label: "cos 90°", correct: "0", options: ["0", "1", "1/2", "undefined"] },
  {
    label: "tan 90°",
    correct: "undefined",
    options: ["0", "1", "undefined", "∞"],
    explanation: "cos 90° = 0, so tan 90° = sin/cos = 1/0 → not defined!",
  },
];

export default function Level7EdgeStones({ onComplete }: Props) {
  const [phase, setPhase] = useState<
    "intro" | "visualize" | "zero-ratios" | "visualize-90" | "ninety-ratios"
  >("intro");
  const [ratioIdx, setRatioIdx] = useState(0);
  const [shake, setShake] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [animAngle, setAnimAngle] = useState(45); // degrees for the animated triangle
  const [showExplanation, setShowExplanation] = useState(false);

  const totalSteps = zeroRatios.length + ninetyRatios.length;
  const currentStep =
    phase === "zero-ratios"
      ? ratioIdx
      : phase === "ninety-ratios"
        ? zeroRatios.length + ratioIdx
        : phase === "visualize-90"
          ? zeroRatios.length
          : 0;

  // Animate angle for visualization phases
  useEffect(() => {
    if (phase === "visualize") {
      setAnimAngle(45);
      const interval = setInterval(() => {
        setAnimAngle((prev) => {
          if (prev <= 2) return 2;
          return prev - 1;
        });
      }, 50);
      return () => clearInterval(interval);
    } else if (phase === "visualize-90") {
      setAnimAngle(45);
      const interval = setInterval(() => {
        setAnimAngle((prev) => {
          if (prev >= 88) return 88;
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const currentQuestions = phase === "zero-ratios" ? zeroRatios : ninetyRatios;

  const handleAnswer = useCallback(
    (answer: string) => {
      const q = currentQuestions[ratioIdx];
      if (answer === q.correct) {
        if (q.explanation) {
          setShowExplanation(true);
          setTimeout(() => {
            setShowExplanation(false);
            advanceAfterCorrect();
          }, 2500);
        } else {
          advanceAfterCorrect();
        }
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, ratioIdx, currentQuestions, mistakes],
  );

  function advanceAfterCorrect() {
    if (phase === "zero-ratios") {
      if (ratioIdx >= zeroRatios.length - 1) {
        setTimeout(() => {
          setPhase("visualize-90");
          setRatioIdx(0);
        }, 400);
      } else {
        setTimeout(() => setRatioIdx((i) => i + 1), 400);
      }
    } else if (phase === "ninety-ratios") {
      if (ratioIdx >= ninetyRatios.length - 1) {
        const bonus = mistakes === 0 ? 20 : 0;
        onComplete(50 + bonus);
      } else {
        setTimeout(() => setRatioIdx((i) => i + 1), 400);
      }
    }
  }

  if (phase === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/25 mb-4">
          World 2 &middot; Level 7
        </p>
        <h2 className="text-2xl font-bold mb-4">The Edge Stones</h2>
        <p className="text-white/50 text-sm mb-2">
          What happens to trig ratios at the extremes &mdash; 0&deg; and 90&deg;?
        </p>
        <p className="text-white/40 text-xs mb-8">
          Watch how the triangle changes as the angle shrinks to zero or grows
          to a right angle.
        </p>
        <button
          onClick={() => setPhase("visualize")}
          className="px-8 py-3 text-sm uppercase tracking-[0.1em] font-medium text-accent-light border border-accent/30 rounded-full hover:border-accent/60 transition-all duration-300"
        >
          Start
        </button>
      </motion.div>
    );
  }

  // Animated triangle based on animAngle
  // Fixed hypotenuse — both sides computed from the angle so the triangle
  // visually morphs: at 0° adjacent fills the hyp, at 90° opposite fills it.
  const originX = 50;
  const originY = 200;
  const hyp = 200; // fixed hypotenuse length
  const rad = (animAngle * Math.PI) / 180;
  const adjLen = hyp * Math.cos(rad);
  const oppLen = hyp * Math.sin(rad);
  const rightX = originX + adjLen;
  const rightY = originY;
  const topX = rightX;
  const topY = originY - oppLen;
  const baseX = originX;
  const baseY = originY;

  // Visualization phases
  if (phase === "visualize" || phase === "visualize-90") {
    const isZero = phase === "visualize";
    const displayAngle = isZero ? Math.max(2, animAngle) : Math.min(88, animAngle);
    const ready = isZero ? displayAngle <= 2 : displayAngle >= 88;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md mx-auto"
      >
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-white/30">
            {isZero ? "Approaching 0°" : "Approaching 90°"}
          </span>
          <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent/50 rounded-full"
              animate={{
                width: `${(currentStep / totalSteps) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Animated triangle */}
        <svg viewBox="0 0 300 230" className="w-full max-w-xs mx-auto mb-4">
          <polygon
            points={`${baseX},${baseY} ${rightX},${rightY} ${topX},${topY}`}
            fill="rgba(108,92,231,0.04)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />

          {/* Right angle at bottom-right */}
          {adjLen > 20 && oppLen > 20 && (
            <polyline
              points={`${rightX - 12},${rightY} ${rightX - 12},${rightY - 12} ${rightX},${rightY - 12}`}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
          )}

          {/* Angle A at bottom-left */}
          <circle
            cx={baseX}
            cy={baseY}
            r="16"
            fill="rgba(162,155,254,0.15)"
            stroke="rgba(162,155,254,0.4)"
            strokeWidth="1"
          />
          <text
            x={baseX + 24}
            y={baseY - 8}
            fill="#a29bfe"
            fontSize="12"
            fontWeight="bold"
          >
            {displayAngle}°
          </text>

          {/* Side labels */}
          {adjLen > 30 && (
            <text
              x={(baseX + rightX) / 2}
              y={baseY + 20}
              textAnchor="middle"
              fill="#00cec9"
              fontSize="11"
            >
              adjacent
            </text>
          )}
          {oppLen > 30 && (
            <text
              x={rightX + 14}
              y={(baseY + topY) / 2}
              fill="#a29bfe"
              fontSize="11"
            >
              opp
            </text>
          )}
          {/* Hypotenuse label */}
          <text
            x={(baseX + topX) / 2 - 20}
            y={(baseY + topY) / 2}
            textAnchor="middle"
            fill="#fdcb6e"
            fontSize="11"
            opacity={0.5}
          >
            hyp
          </text>
        </svg>

        <div className="text-center mb-6">
          <p className="text-sm text-white/60 mb-2">
            {isZero
              ? "As the angle approaches 0°, the opposite side disappears."
              : "As the angle approaches 90°, the adjacent side disappears."}
          </p>
          <p className="text-xs text-white/30">
            {isZero
              ? "Opposite → 0, Adjacent → Hypotenuse"
              : "Adjacent → 0, Opposite → Hypotenuse"}
          </p>
        </div>

        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={() => {
                if (isZero) {
                  setPhase("zero-ratios");
                  setRatioIdx(0);
                } else {
                  setPhase("ninety-ratios");
                  setRatioIdx(0);
                }
              }}
              className="px-8 py-3 text-sm uppercase tracking-[0.1em] font-medium text-accent-light border border-accent/30 rounded-full hover:border-accent/60 transition-all duration-300"
            >
              {isZero ? "Find 0° ratios" : "Find 90° ratios"}
            </button>
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Quiz phases
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-white/30">
          {phase === "zero-ratios"
            ? `0° ratio ${ratioIdx + 1}/${zeroRatios.length}`
            : `90° ratio ${ratioIdx + 1}/${ninetyRatios.length}`}
        </span>
        <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent/50 rounded-full"
            animate={{
              width: `${(currentStep / totalSteps) * 100}%`,
            }}
          />
        </div>
      </div>

      <motion.div
        key={`${phase}-${ratioIdx}`}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <motion.div
          animate={shake ? { x: [0, -8, 8, -8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          {/* Static reference triangle */}
          <div className="mb-4">
            <p className="text-xs text-white/25">
              {phase === "zero-ratios"
                ? "At 0°: opposite = 0, adjacent = hypotenuse"
                : "At 90°: adjacent = 0, opposite = hypotenuse"}
            </p>
          </div>

          <p className="text-lg font-bold text-accent-light mb-6">
            {currentQuestions[ratioIdx].label} = ?
          </p>

          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-3 rounded-xl bg-warning/10 border border-warning/20"
            >
              <p className="text-xs text-warning">
                {currentQuestions[ratioIdx].explanation}
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {currentQuestions[ratioIdx].options.map((opt) => (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(opt)}
                disabled={showExplanation}
                className="px-4 py-3 text-sm font-semibold rounded-xl border border-white/[0.1] bg-surface hover:bg-surface-hover transition-all duration-200 disabled:opacity-30"
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Ratio dots */}
        <div className="flex gap-2 justify-center mt-6">
          {currentQuestions.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < ratioIdx
                  ? "bg-success"
                  : i === ratioIdx
                    ? "bg-accent-light"
                    : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
