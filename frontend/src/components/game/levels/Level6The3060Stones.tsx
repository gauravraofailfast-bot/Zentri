"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  onComplete: (xpEarned: number) => void;
}

interface Question {
  label: string;
  correct: string;
  options: string[];
}

const ratios30: Question[] = [
  { label: "sin 30°", correct: "1/2", options: ["1/2", "√3/2", "1/√3", "√3"] },
  { label: "cos 30°", correct: "√3/2", options: ["1/2", "√3/2", "√3", "1/√3"] },
  { label: "tan 30°", correct: "1/√3", options: ["1/√3", "√3", "1/2", "1"] },
];

const ratios60: Question[] = [
  { label: "sin 60°", correct: "√3/2", options: ["√3/2", "1/2", "√3", "1/√3"] },
  { label: "cos 60°", correct: "1/2", options: ["√3/2", "1/2", "1/√3", "√3"] },
  { label: "tan 60°", correct: "√3", options: ["1/√3", "1", "√3", "1/2"] },
];

export default function Level6The3060Stones({ onComplete }: Props) {
  const [phase, setPhase] = useState<"intro" | "slice" | "30-ratios" | "60-ratios">("intro");
  const [ratioIdx, setRatioIdx] = useState(0);
  const [shake, setShake] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [heightFound, setHeightFound] = useState(false);
  const [showSliceResult, setShowSliceResult] = useState(false);

  const totalSteps = 1 + ratios30.length + ratios60.length;
  const currentStep =
    phase === "slice"
      ? 0
      : phase === "30-ratios"
        ? 1 + ratioIdx
        : phase === "60-ratios"
          ? 1 + ratios30.length + ratioIdx
          : 0;

  const currentQuestions = phase === "30-ratios" ? ratios30 : ratios60;

  const handleHeightAnswer = useCallback(
    (answer: string) => {
      if (answer === "√3") {
        setHeightFound(true);
        setShowSliceResult(true);
        setTimeout(() => {
          setShowSliceResult(false);
          setPhase("30-ratios");
          setRatioIdx(0);
        }, 2000);
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    [],
  );

  const handleRatioAnswer = useCallback(
    (answer: string) => {
      const q = currentQuestions[ratioIdx];
      if (answer === q.correct) {
        if (ratioIdx >= currentQuestions.length - 1) {
          if (phase === "30-ratios") {
            setTimeout(() => {
              setPhase("60-ratios");
              setRatioIdx(0);
            }, 400);
          } else {
            const bonus = mistakes === 0 ? 20 : 0;
            onComplete(60 + bonus);
          }
        } else {
          setTimeout(() => setRatioIdx((i) => i + 1), 400);
        }
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    [phase, ratioIdx, currentQuestions, mistakes, onComplete],
  );

  if (phase === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/25 mb-4">
          World 2 &middot; Level 6
        </p>
        <h2 className="text-2xl font-bold mb-4">The 30&deg; &amp; 60&deg; Stones</h2>
        <p className="text-white/50 text-sm mb-2">
          Slice an equilateral triangle in half to create a 30-60-90 triangle.
        </p>
        <p className="text-white/40 text-xs mb-8">
          From this one triangle, you can derive all the standard values for
          both 30&deg; and 60&deg;.
        </p>
        <button
          onClick={() => setPhase("slice")}
          className="px-8 py-3 text-sm uppercase tracking-[0.1em] font-medium text-accent-light border border-accent/30 rounded-full hover:border-accent/60 transition-all duration-300"
        >
          Start
        </button>
      </motion.div>
    );
  }

  // Equilateral triangle coordinates
  const top = { x: 150, y: 30 };
  const bl = { x: 50, y: 220 };
  const br = { x: 250, y: 220 };
  const mid = { x: 150, y: 220 }; // base midpoint

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-white/30">
          {phase === "slice"
            ? "Slice the triangle"
            : phase === "30-ratios"
              ? `30° ratio ${ratioIdx + 1}/${ratios30.length}`
              : `60° ratio ${ratioIdx + 1}/${ratios60.length}`}
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

      {/* Triangle SVG */}
      <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto mb-6">
        {/* Full equilateral triangle */}
        <polygon
          points={`${top.x},${top.y} ${bl.x},${bl.y} ${br.x},${br.y}`}
          fill="rgba(108,92,231,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />

        {/* Altitude line (animated drop) */}
        {(heightFound || phase === "slice" || phase === "30-ratios" || phase === "60-ratios") && (
          <motion.line
            x1={top.x}
            y1={top.y}
            x2={mid.x}
            y2={mid.y}
            stroke="rgba(162,155,254,0.6)"
            strokeWidth="1.5"
            strokeDasharray="5 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
        )}

        {/* Right angle at midpoint */}
        {heightFound && (
          <polyline
            points={`${mid.x - 12},${mid.y} ${mid.x - 12},${mid.y - 12} ${mid.x},${mid.y - 12}`}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
        )}

        {/* Side labels for equilateral triangle */}
        {/* Left side = 2 */}
        <text
          x={(top.x + bl.x) / 2 - 18}
          y={(top.y + bl.y) / 2}
          fill="#fdcb6e"
          fontSize="14"
          fontWeight="600"
          textAnchor="middle"
        >
          2
        </text>

        {/* Right side = 2 */}
        <text
          x={(top.x + br.x) / 2 + 18}
          y={(top.y + br.y) / 2}
          fill="#fdcb6e"
          fontSize="14"
          fontWeight="600"
          textAnchor="middle"
        >
          2
        </text>

        {/* Bottom half = 1 (shown after slice) */}
        {heightFound && (
          <>
            <text
              x={(bl.x + mid.x) / 2}
              y={bl.y + 20}
              fill="#00cec9"
              fontSize="13"
              fontWeight="600"
              textAnchor="middle"
            >
              1
            </text>
            <text
              x={(mid.x + br.x) / 2}
              y={br.y + 20}
              fill="#00cec9"
              fontSize="13"
              fontWeight="600"
              textAnchor="middle"
            >
              1
            </text>
          </>
        )}

        {/* Height label */}
        {heightFound && (
          <text
            x={mid.x + 18}
            y={(top.y + mid.y) / 2}
            fill="#a29bfe"
            fontSize="13"
            fontWeight="600"
          >
            √3
          </text>
        )}

        {/* Angle labels for the 30-60-90 triangle (left half) */}
        {heightFound && (
          <>
            {/* 30° at top */}
            <text
              x={top.x - 28}
              y={top.y + 30}
              fill="#ff7675"
              fontSize="11"
              fontWeight="600"
            >
              30°
            </text>
            {/* 60° at bottom-left */}
            <text
              x={bl.x + 8}
              y={bl.y - 8}
              fill="#00b894"
              fontSize="11"
              fontWeight="600"
            >
              60°
            </text>
          </>
        )}

        {/* Highlight the active angle */}
        {phase === "30-ratios" && (
          <circle
            cx={top.x}
            cy={top.y}
            r="16"
            fill="rgba(255,118,117,0.15)"
            stroke="rgba(255,118,117,0.4)"
            strokeWidth="1"
          />
        )}
        {phase === "60-ratios" && (
          <circle
            cx={bl.x}
            cy={bl.y}
            r="16"
            fill="rgba(0,184,148,0.15)"
            stroke="rgba(0,184,148,0.4)"
            strokeWidth="1"
          />
        )}
      </svg>

      {/* Phase: slice */}
      {phase === "slice" && (
        <motion.div
          animate={shake ? { x: [0, -8, 8, -8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          {showSliceResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <p className="text-sm text-success mb-2">Correct!</p>
              <p className="text-xs text-white/40">
                By Pythagoras: 2&sup2; &minus; 1&sup2; = 3, so height = &radic;3
              </p>
            </motion.div>
          ) : (
            <>
              <p className="text-sm text-white/60 mb-2">
                An equilateral triangle (side = 2) is sliced from top to base midpoint.
              </p>
              <p className="text-sm text-white/50 mb-4">
                What is the height of the triangle?
              </p>
              <p className="text-xs text-white/30 mb-6">
                Hint: hyp = 2, base = 1, height = ?
              </p>
              <div className="flex gap-3 justify-center">
                {["√3", "2", "1", "√2"].map((opt) => (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleHeightAnswer(opt)}
                    className="px-5 py-3 text-sm font-semibold rounded-xl border border-white/[0.1] bg-surface hover:bg-surface-hover transition-all duration-200"
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Phase: 30-ratios or 60-ratios */}
      {(phase === "30-ratios" || phase === "60-ratios") && (
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
            <p className="text-xs text-white/30 mb-2">
              {phase === "30-ratios"
                ? "30° angle: opp = 1, adj = √3, hyp = 2"
                : "60° angle: opp = √3, adj = 1, hyp = 2"}
            </p>
            <p
              className={`text-lg font-bold mb-6 ${
                phase === "30-ratios" ? "text-[#ff7675]" : "text-success"
              }`}
            >
              {currentQuestions[ratioIdx].label} = ?
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              {currentQuestions[ratioIdx].options.map((opt) => (
                <motion.button
                  key={opt}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRatioAnswer(opt)}
                  className="px-4 py-3 text-sm font-semibold rounded-xl border border-white/[0.1] bg-surface hover:bg-surface-hover transition-all duration-200"
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
      )}
    </motion.div>
  );
}
