"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  onComplete: (xpEarned: number) => void;
}

interface Question {
  equation: string;
  correct: string;
  options: string[];
}

const questions: Question[] = [
  { equation: "sin θ = 1/2", correct: "30°", options: ["0°", "30°", "45°", "60°"] },
  { equation: "cos θ = √3/2", correct: "30°", options: ["30°", "45°", "60°", "90°"] },
  { equation: "tan θ = 1", correct: "45°", options: ["0°", "30°", "45°", "60°"] },
  { equation: "sin θ = √3/2", correct: "60°", options: ["30°", "45°", "60°", "90°"] },
  { equation: "cos θ = 0", correct: "90°", options: ["0°", "45°", "60°", "90°"] },
  { equation: "tan θ = √3", correct: "60°", options: ["30°", "45°", "60°", "90°"] },
  { equation: "sin θ = 1", correct: "90°", options: ["0°", "30°", "60°", "90°"] },
  { equation: "cos θ = 1/2", correct: "60°", options: ["0°", "30°", "45°", "60°"] },
];

export default function Level9AngleDetective({ onComplete }: Props) {
  const [qIdx, setQIdx] = useState(0);
  const [shake, setShake] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [flash, setFlash] = useState(false);

  const handleAnswer = useCallback(
    (answer: string) => {
      const q = questions[qIdx];
      if (answer === q.correct) {
        setFlash(true);
        setTimeout(() => {
          setFlash(false);
          if (qIdx >= questions.length - 1) {
            const bonus = mistakes === 0 ? 20 : 0;
            onComplete(60 + bonus);
          } else {
            setQIdx((i) => i + 1);
          }
        }, 400);
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    [qIdx, mistakes, onComplete],
  );

  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/25 mb-4">
          World 2 &middot; Level 9
        </p>
        <h2 className="text-2xl font-bold mb-4">Angle Detective</h2>
        <p className="text-white/50 text-sm mb-2">
          You know the trig value. Can you find the angle?
        </p>
        <p className="text-white/40 text-xs mb-8">
          Use your knowledge of standard trig values to work backwards &mdash;
          given a ratio, identify the angle between 0&deg; and 90&deg;.
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-white/30">
          Question {qIdx + 1}/{questions.length}
        </span>
        <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent/50 rounded-full"
            animate={{
              width: `${(qIdx / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <motion.div
        key={qIdx}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={shake ? { x: [0, -8, 8, -8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          {/* Detective icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8"
                fill="none"
                stroke="#a29bfe"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Magnifying glass */}
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
                {/* Question mark inside */}
                <text
                  x="8"
                  y="14"
                  fill="#a29bfe"
                  stroke="none"
                  fontSize="10"
                  fontWeight="bold"
                >
                  ?
                </text>
              </svg>
            </div>
          </div>

          {/* Equation card */}
          <div
            className={`mx-auto max-w-xs px-6 py-5 rounded-2xl border transition-colors duration-300 mb-6 ${
              flash
                ? "bg-success/10 border-success/30"
                : "bg-surface border-white/[0.08]"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.15em] text-white/25 mb-3">
              Find the angle
            </p>
            <p className="text-2xl font-bold text-accent-light">
              {questions[qIdx].equation}
            </p>
            <p className="text-sm text-white/40 mt-2">
              &theta; = ?
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {questions[qIdx].options.map((opt) => (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(opt)}
                disabled={flash}
                className="px-4 py-3.5 text-base font-semibold rounded-xl border border-white/[0.1] bg-surface hover:bg-surface-hover transition-all duration-200 disabled:opacity-40"
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center mt-6 flex-wrap">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < qIdx
                  ? "bg-success"
                  : i === qIdx
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
