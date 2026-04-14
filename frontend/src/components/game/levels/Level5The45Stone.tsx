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

const ratioQuestions: Question[] = [
  { label: "sin 45°", correct: "1/√2", options: ["1/√2", "√3/2", "1/2", "√2"] },
  { label: "cos 45°", correct: "1/√2", options: ["1/2", "1/√2", "√3/2", "0"] },
  { label: "tan 45°", correct: "1", options: ["0", "1", "√3", "1/√3"] },
  { label: "cosec 45°", correct: "√2", options: ["2", "√2", "1", "√3"] },
  { label: "sec 45°", correct: "√2", options: ["√2", "2", "√3", "1/√2"] },
  { label: "cot 45°", correct: "1", options: ["1/√3", "√3", "1", "0"] },
];

export default function Level5The45Stone({ onComplete }: Props) {
  const [phase, setPhase] = useState<"intro" | "find-hyp" | "ratios">("intro");
  const [ratioIdx, setRatioIdx] = useState(0);
  const [shake, setShake] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [hypFound, setHypFound] = useState(false);
  const [showDerivation, setShowDerivation] = useState(false);

  const totalSteps = 1 + ratioQuestions.length; // 1 for hyp + 6 ratios
  const currentStep =
    phase === "find-hyp" ? 0 : phase === "ratios" ? 1 + ratioIdx : 0;

  const handleHypAnswer = useCallback(
    (answer: string) => {
      if (answer === "√2") {
        setHypFound(true);
        setShowDerivation(true);
        setTimeout(() => {
          setShowDerivation(false);
          setPhase("ratios");
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
      const q = ratioQuestions[ratioIdx];
      if (answer === q.correct) {
        if (ratioIdx >= ratioQuestions.length - 1) {
          const bonus = mistakes === 0 ? 20 : 0;
          onComplete(50 + bonus);
        } else {
          setTimeout(() => setRatioIdx((i) => i + 1), 400);
        }
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    [ratioIdx, mistakes, onComplete],
  );

  if (phase === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/25 mb-4">
          World 2 &middot; Level 5
        </p>
        <h2 className="text-2xl font-bold mb-4">The 45&deg; Stone</h2>
        <p className="text-white/50 text-sm mb-2">
          An isosceles right triangle has two equal sides and a 45&deg; angle.
        </p>
        <p className="text-white/40 text-xs mb-8">
          Derive all six trigonometric ratios for 45&deg; using a triangle with
          equal sides of length 1.
        </p>
        <button
          onClick={() => setPhase("find-hyp")}
          className="px-8 py-3 text-sm uppercase tracking-[0.1em] font-medium text-accent-light border border-accent/30 rounded-full hover:border-accent/60 transition-all duration-300"
        >
          Start
        </button>
      </motion.div>
    );
  }

  // Triangle coordinates for isosceles right triangle
  const A = { x: 50, y: 210 }; // bottom-left (45°)
  const B = { x: 250, y: 210 }; // bottom-right (90°)
  const C = { x: 250, y: 50 }; // top-right (45°)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-white/30">
          {phase === "find-hyp" ? "Find the hypotenuse" : `Ratio ${ratioIdx + 1}/${ratioQuestions.length}`}
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
      <svg viewBox="0 0 300 250" className="w-full max-w-xs mx-auto mb-6">
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

        {/* 45° angle highlight at A */}
        <circle
          cx={A.x}
          cy={A.y}
          r="18"
          fill="rgba(162,155,254,0.15)"
          stroke="rgba(162,155,254,0.4)"
          strokeWidth="1"
        />
        <text
          x={A.x + 28}
          y={A.y - 8}
          fill="#a29bfe"
          fontSize="13"
          fontWeight="bold"
        >
          45°
        </text>

        {/* 45° angle at C */}
        <circle
          cx={C.x}
          cy={C.y}
          r="18"
          fill="rgba(162,155,254,0.08)"
          stroke="rgba(162,155,254,0.2)"
          strokeWidth="1"
        />
        <text
          x={C.x - 40}
          y={C.y + 5}
          fill="rgba(162,155,254,0.5)"
          fontSize="12"
        >
          45°
        </text>

        {/* Side labels */}
        {/* Bottom: side = 1 */}
        <text
          x={(A.x + B.x) / 2}
          y={A.y + 22}
          textAnchor="middle"
          fill="#00cec9"
          fontSize="14"
          fontWeight="600"
        >
          1
        </text>

        {/* Right: side = 1 */}
        <text
          x={B.x + 16}
          y={(B.y + C.y) / 2}
          fill="#00cec9"
          fontSize="14"
          fontWeight="600"
        >
          1
        </text>

        {/* Hypotenuse */}
        <text
          x={(A.x + C.x) / 2 - 20}
          y={(A.y + C.y) / 2 - 8}
          textAnchor="middle"
          fill={hypFound ? "#fdcb6e" : "rgba(253,203,110,0.4)"}
          fontSize="14"
          fontWeight="600"
        >
          {hypFound ? "√2" : "?"}
        </text>
        <text
          x={(A.x + C.x) / 2 - 20}
          y={(A.y + C.y) / 2 + 6}
          textAnchor="middle"
          fill="rgba(253,203,110,0.3)"
          fontSize="9"
        >
          hyp
        </text>
      </svg>

      {/* Phase: find-hyp */}
      {phase === "find-hyp" && (
        <motion.div
          animate={shake ? { x: [0, -8, 8, -8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          {showDerivation ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <p className="text-sm text-success mb-2">Correct!</p>
              <p className="text-xs text-white/40">
                By Pythagoras: 1&sup2; + 1&sup2; = 2, so hypotenuse = &radic;2
              </p>
            </motion.div>
          ) : (
            <>
              <p className="text-sm text-white/60 mb-4">
                Two sides are 1. What is the hypotenuse?
              </p>
              <p className="text-xs text-white/30 mb-6">
                Hint: Use Pythagoras &mdash; 1&sup2; + 1&sup2; = ?
              </p>
              <div className="flex gap-3 justify-center">
                {["√2", "2", "√3", "1"].map((opt) => (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleHypAnswer(opt)}
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

      {/* Phase: ratios */}
      {phase === "ratios" && (
        <motion.div
          key={ratioIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={shake ? { opacity: 1, x: 0, ...(shake ? {} : {}) } : { opacity: 1, x: 0 }}
        >
          <motion.div
            animate={shake ? { x: [0, -8, 8, -8, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <p className="text-lg font-bold text-accent-light mb-2">
              {ratioQuestions[ratioIdx].label} = ?
            </p>
            <p className="text-xs text-white/30 mb-6">
              Triangle sides: 1, 1, &radic;2
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              {ratioQuestions[ratioIdx].options.map((opt) => (
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
            {ratioQuestions.map((_, i) => (
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
