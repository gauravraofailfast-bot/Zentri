"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  onComplete: (xpEarned: number) => void;
}

/* ---------- derive phase data ---------- */
interface DeriveStep {
  question: string;
  options: string[];
  correct: string;
  explanation?: string;
}

const deriveSteps: DeriveStep[] = [
  {
    question: "What is sin A?",
    options: ["a/c", "b/c", "a/b", "c/a"],
    correct: "a/c",
    explanation: "sin A = Opposite / Hypotenuse = a / c",
  },
  {
    question: "What is cos A?",
    options: ["a/c", "b/c", "b/a", "c/b"],
    correct: "b/c",
    explanation: "cos A = Adjacent / Hypotenuse = b / c",
  },
  {
    question: "What is sin\u00B2A + cos\u00B2A in terms of a, b, c?",
    options: [
      "(a\u00B2+b\u00B2)/c\u00B2",
      "a\u00B2/b\u00B2",
      "(a+b)/c",
      "c\u00B2/(a\u00B2+b\u00B2)",
    ],
    correct: "(a\u00B2+b\u00B2)/c\u00B2",
    explanation:
      "(a/c)\u00B2 + (b/c)\u00B2 = a\u00B2/c\u00B2 + b\u00B2/c\u00B2 = (a\u00B2+b\u00B2)/c\u00B2",
  },
  {
    question: "By Pythagoras, a\u00B2 + b\u00B2 = ?",
    options: ["c\u00B2", "a\u00B2", "(a+b)\u00B2", "2c"],
    correct: "c\u00B2",
  },
  {
    question: "So sin\u00B2A + cos\u00B2A = ?",
    options: ["c\u00B2/c\u00B2", "c\u00B2/a\u00B2", "a\u00B2/b\u00B2", "1"],
    correct: "1",
    explanation: "(a\u00B2+b\u00B2)/c\u00B2 = c\u00B2/c\u00B2 = 1",
  },
];

/* ---------- apply phase data ---------- */
interface ApplyQuestion {
  question: string;
  options: string[];
  correct: string;
  hint: string;
}

const applyQuestions: ApplyQuestion[] = [
  {
    question: "If sin A = 3/5, what is cos A?",
    options: ["4/5", "3/4", "5/3", "5/4"],
    correct: "4/5",
    hint: "cos\u00B2A = 1 \u2212 sin\u00B2A = 1 \u2212 9/25 = 16/25",
  },
  {
    question: "If cos A = 12/13, what is sin A?",
    options: ["5/13", "12/5", "1/13", "13/12"],
    correct: "5/13",
    hint: "sin\u00B2A = 1 \u2212 144/169 = 25/169",
  },
  {
    question: "sin\u00B230\u00B0 + cos\u00B230\u00B0 = ?",
    options: ["1", "0", "\u221A3/2", "1/2"],
    correct: "1",
    hint: "The identity holds for every angle!",
  },
  {
    question: "If sin A = 1/\u221A2, what is cos\u00B2A?",
    options: ["1/2", "1/\u221A2", "\u221A2", "1"],
    correct: "1/2",
    hint: "cos\u00B2A = 1 \u2212 (1/\u221A2)\u00B2 = 1 \u2212 1/2 = 1/2",
  },
];

export default function Level10FirstLaw({ onComplete }: Props) {
  const [showIntro, setShowIntro] = useState(true);
  const [phase, setPhase] = useState<"derive" | "apply">("derive");
  const [stepIdx, setStepIdx] = useState(0);
  const [shake, setShake] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const totalSteps = deriveSteps.length + applyQuestions.length;
  const currentProgress =
    phase === "derive" ? stepIdx : deriveSteps.length + stepIdx;

  const handleSelect = useCallback(
    (option: string) => {
      if (answered) return;

      const isDerive = phase === "derive";
      const correct = isDerive
        ? deriveSteps[stepIdx].correct
        : applyQuestions[stepIdx].correct;

      setSelected(option);

      if (option === correct) {
        setAnswered(true);
        setTimeout(() => {
          if (isDerive) {
            if (stepIdx < deriveSteps.length - 1) {
              setStepIdx((i) => i + 1);
            } else {
              setPhase("apply");
              setStepIdx(0);
            }
          } else {
            if (stepIdx < applyQuestions.length - 1) {
              setStepIdx((i) => i + 1);
            } else {
              const bonus = mistakes === 0 ? 20 : 0;
              onComplete(60 + bonus);
              return;
            }
          }
          setSelected(null);
          setAnswered(false);
        }, 800);
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => {
          setShake(false);
          setSelected(null);
        }, 500);
      }
    },
    [phase, stepIdx, answered, mistakes, onComplete],
  );

  /* ---------- Intro Screen ---------- */
  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
          World 3 &middot; Level 10
        </p>
        <h2 className="text-2xl font-bold mb-4">The First Law</h2>
        <p className="text-white/50 text-sm mb-2">
          The most important identity in trigonometry:
        </p>
        <p className="text-accent-light text-lg font-bold my-6">
          sin&sup2;A + cos&sup2;A = 1
        </p>
        <p className="text-white/40 text-xs mb-8">
          Derive it from Pythagoras, then apply it to find missing values.
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

  /* ---------- Active data ---------- */
  const isDerive = phase === "derive";
  const stepData = isDerive ? deriveSteps[stepIdx] : applyQuestions[stepIdx];
  const correct = stepData.correct;

  /* ---------- Triangle coords for derive phase ---------- */
  const A = { x: 40, y: 200 };
  const B = { x: 240, y: 200 };
  const C = { x: 240, y: 50 };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-white/30">
          {isDerive ? "Derive" : "Apply"} {stepIdx + 1}/
          {isDerive ? deriveSteps.length : applyQuestions.length}
        </span>
        <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent/50 rounded-full"
            animate={{ width: `${(currentProgress / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Phase badge */}
      <div className="text-center mb-4">
        <span
          className={`text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full ${
            isDerive
              ? "bg-accent/10 text-accent-light"
              : "bg-success/10 text-success"
          }`}
        >
          {isDerive ? "Derivation" : "Application"}
        </span>
      </div>

      {/* Triangle (only during derive phase) */}
      {isDerive && (
        <svg viewBox="0 0 280 230" className="w-full max-w-[200px] mx-auto mb-4">
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
          {/* Angle A */}
          <circle
            cx={A.x}
            cy={A.y}
            r="16"
            fill="rgba(162,155,254,0.12)"
            stroke="rgba(162,155,254,0.3)"
            strokeWidth="1"
          />
          <text x={A.x + 22} y={A.y - 8} fill="#a29bfe" fontSize="13" fontWeight="bold">
            A
          </text>
          {/* Labels */}
          <text
            x={(A.x + B.x) / 2}
            y={A.y + 22}
            textAnchor="middle"
            fill="#00cec9"
            fontSize="13"
            fontWeight="600"
          >
            b
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
          <text x={B.x + 18} y={(B.y + C.y) / 2} fill="#a29bfe" fontSize="13" fontWeight="600">
            a
          </text>
          <text x={B.x + 18} y={(B.y + C.y) / 2 + 13} fill="rgba(162,155,254,0.4)" fontSize="9">
            opp
          </text>
          <text
            x={(A.x + C.x) / 2 - 25}
            y={(A.y + C.y) / 2 - 5}
            fill="#fdcb6e"
            fontSize="13"
            fontWeight="600"
            textAnchor="middle"
          >
            c
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
      )}

      {/* Question */}
      <motion.div
        animate={shake ? { x: [0, -8, 8, -8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <p className="text-lg font-semibold mb-2">{stepData.question}</p>
        {!isDerive && (
          <p className="text-xs text-white/30">
            {"hint" in stepData ? (stepData as ApplyQuestion).hint : ""}
          </p>
        )}
      </motion.div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {stepData.options.map((option) => {
          const isCorrectOption = option === correct;
          const isSelected = selected === option;

          let btnClass =
            "px-4 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ";

          if (answered && isCorrectOption) {
            btnClass +=
              "border-success/50 bg-success/10 text-success";
          } else if (isSelected && !answered) {
            btnClass += "border-danger/50 bg-danger/10 text-danger";
          } else {
            btnClass +=
              "border-white/[0.1] bg-surface hover:bg-surface-hover text-white/70";
          }

          return (
            <motion.button
              key={option}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={btnClass}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation on correct answer during derive */}
      {answered && isDerive && deriveSteps[stepIdx].explanation && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-success/70 text-center mt-4"
        >
          {deriveSteps[stepIdx].explanation}
        </motion.p>
      )}

      {/* Step dots */}
      <div className="flex gap-2 justify-center mt-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i < currentProgress
                ? "bg-success"
                : i === currentProgress
                  ? "bg-accent-light"
                  : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
