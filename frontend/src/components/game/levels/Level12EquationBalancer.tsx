"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  onComplete: (xpEarned: number) => void;
}

/* ---------- Round data ---------- */
interface RoundStep {
  prompt: string;
  options: string[];
  correct: string;
}

interface Round {
  title: string;
  expression: string;
  steps: RoundStep[];
  result: string;
}

const rounds: Round[] = [
  {
    title: "Simplify",
    expression: "(1 \u2212 cos\u00B2A) \u00D7 cosec\u00B2A",
    steps: [
      {
        prompt: "1 \u2212 cos\u00B2A = ?",
        options: ["sin\u00B2A", "tan\u00B2A", "cos\u00B2A", "sec\u00B2A"],
        correct: "sin\u00B2A",
      },
      {
        prompt: "sin\u00B2A \u00D7 cosec\u00B2A = sin\u00B2A \u00D7 ?",
        options: ["1/sin\u00B2A", "1/cos\u00B2A", "sin\u00B2A", "cos\u00B2A"],
        correct: "1/sin\u00B2A",
      },
      {
        prompt: "Final answer = ?",
        options: ["0", "1", "sin\u00B2A", "cos\u00B2A"],
        correct: "1",
      },
    ],
    result: "= 1",
  },
  {
    title: "Simplify",
    expression: "(sec\u00B2A \u2212 1) / sec\u00B2A",
    steps: [
      {
        prompt: "sec\u00B2A \u2212 1 = ?",
        options: ["tan\u00B2A", "cot\u00B2A", "sin\u00B2A", "1"],
        correct: "tan\u00B2A",
      },
      {
        prompt:
          "tan\u00B2A / sec\u00B2A = (sin\u00B2A/cos\u00B2A) \u00F7 (1/cos\u00B2A) = ?",
        options: ["sin\u00B2A", "cos\u00B2A", "tan\u00B2A", "1"],
        correct: "sin\u00B2A",
      },
    ],
    result: "= sin\u00B2A",
  },
  {
    title: "Prove",
    expression: "(sinA + cosA)\u00B2 + (sinA \u2212 cosA)\u00B2 = 2",
    steps: [
      {
        prompt: "Expand (sinA + cosA)\u00B2 = ?",
        options: [
          "sin\u00B2A + 2sinAcosA + cos\u00B2A",
          "sin\u00B2A + cos\u00B2A",
          "sin\u00B2A \u2212 cos\u00B2A",
          "2sinAcosA",
        ],
        correct: "sin\u00B2A + 2sinAcosA + cos\u00B2A",
      },
      {
        prompt: "Expand (sinA \u2212 cosA)\u00B2 = ?",
        options: [
          "sin\u00B2A \u2212 2sinAcosA + cos\u00B2A",
          "sin\u00B2A + cos\u00B2A",
          "sin\u00B2A \u2212 cos\u00B2A",
          "\u22122sinAcosA",
        ],
        correct: "sin\u00B2A \u2212 2sinAcosA + cos\u00B2A",
      },
      {
        prompt:
          "Add them: 2sin\u00B2A + 2cos\u00B2A = 2(sin\u00B2A + cos\u00B2A) = ?",
        options: ["2", "1", "0", "4"],
        correct: "2",
      },
    ],
    result: "= 2 \u2713 Proved!",
  },
  {
    title: "Simplify",
    expression: "cosA/(1+sinA) + (1+sinA)/cosA",
    steps: [
      {
        prompt:
          "Common denominator \u2192 numerator: cos\u00B2A + (1+sinA)\u00B2. Expand cos\u00B2A + 1 + 2sinA + sin\u00B2A = ?",
        options: ["2 + 2sinA", "2cosA", "1 + sinA", "2"],
        correct: "2 + 2sinA",
      },
      {
        prompt:
          "Factor: 2(1 + sinA) / [cosA(1 + sinA)] = ?",
        options: ["2/cosA", "2cosA", "1/cosA", "2sinA"],
        correct: "2/cosA",
      },
      {
        prompt: "2/cosA = ?",
        options: ["2secA", "2cosecA", "secA", "2tanA"],
        correct: "2secA",
      },
    ],
    result: "= 2secA",
  },
];

export default function Level12EquationBalancer({ onComplete }: Props) {
  const [showIntro, setShowIntro] = useState(true);
  const [roundIdx, setRoundIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [shake, setShake] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const totalSteps = rounds.reduce((sum, r) => sum + r.steps.length, 0);
  const stepsBeforeRound = rounds
    .slice(0, roundIdx)
    .reduce((sum, r) => sum + r.steps.length, 0);
  const currentProgress = stepsBeforeRound + stepIdx;

  const round = rounds[roundIdx];
  const step = round.steps[stepIdx];

  const handleSelect = useCallback(
    (option: string) => {
      if (answered) return;

      setSelected(option);

      if (option === step.correct) {
        setAnswered(true);
        setCompletedSteps((prev) => [...prev, `${roundIdx}-${stepIdx}`]);

        setTimeout(() => {
          if (stepIdx < round.steps.length - 1) {
            setStepIdx((i) => i + 1);
          } else if (roundIdx < rounds.length - 1) {
            setRoundIdx((r) => r + 1);
            setStepIdx(0);
          } else {
            const bonus = mistakes === 0 ? 20 : 0;
            onComplete(70 + bonus);
            return;
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
    [roundIdx, stepIdx, round, step, answered, mistakes, onComplete],
  );

  /* ---------- Intro ---------- */
  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/25 mb-4">
          World 3 &middot; Level 12
        </p>
        <h2 className="text-2xl font-bold mb-4">The Equation Balancer</h2>
        <p className="text-white/50 text-sm mb-2">
          Simplify and prove identity expressions step by step.
        </p>
        <p className="text-white/40 text-xs mb-2">
          Each expression is like a machine &mdash; feed in the right
          transformations and the simplified result comes out.
        </p>
        <div className="flex justify-center my-6 gap-2">
          {["\u2699\uFE0F", "\u2699\uFE0F", "\u2699\uFE0F", "\u2699\uFE0F"].map((g, i) => (
            <span key={i} className="text-2xl opacity-30">
              {g}
            </span>
          ))}
        </div>
        <p className="text-white/30 text-xs mb-8">
          4 rounds. Pick the correct transformation at each step.
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
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-white/30">
          Round {roundIdx + 1}/{rounds.length}
        </span>
        <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent/50 rounded-full"
            animate={{ width: `${(currentProgress / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Round badge */}
      <div className="text-center mb-3">
        <span className="text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full bg-accent/10 text-accent-light">
          {round.title}
        </span>
      </div>

      {/* Expression */}
      <div className="text-center mb-6">
        <p className="text-base font-semibold text-warning/80">
          {round.expression}
        </p>
      </div>

      {/* Forge slots: show completed steps + current step */}
      <div className="space-y-2 mb-6">
        {round.steps.map((s, i) => {
          const key = `${roundIdx}-${i}`;
          const isDone = completedSteps.includes(key);
          const isCurrent = i === stepIdx;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-300 ${
                isDone
                  ? "border-success/30 bg-success/5"
                  : isCurrent
                    ? "border-accent/30 bg-accent/5"
                    : "border-white/[0.05] bg-white/[0.02]"
              }`}
            >
              {/* Gear icon */}
              <span
                className={`text-sm ${
                  isDone
                    ? "text-success"
                    : isCurrent
                      ? "text-accent-light animate-spin"
                      : "text-white/15"
                }`}
                style={isCurrent ? { animationDuration: "3s" } : undefined}
              >
                {isDone ? "\u2713" : "\u2699"}
              </span>

              {/* Slot content */}
              <div className="flex-1 text-sm">
                {isDone ? (
                  <span className="text-success">{s.correct}</span>
                ) : isCurrent ? (
                  <span className="text-white/50">{s.prompt}</span>
                ) : (
                  <span className="text-white/15">Step {i + 1}</span>
                )}
              </div>
            </div>
          );
        })}

        {/* Result slot */}
        <div
          className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-300 ${
            answered && stepIdx === round.steps.length - 1
              ? "border-success/30 bg-success/5"
              : "border-white/[0.05] bg-white/[0.02]"
          }`}
        >
          <span
            className={
              answered && stepIdx === round.steps.length - 1
                ? "text-success text-sm"
                : "text-white/15 text-sm"
            }
          >
            =
          </span>
          <span
            className={
              answered && stepIdx === round.steps.length - 1
                ? "text-success text-sm font-bold"
                : "text-white/15 text-sm"
            }
          >
            {answered && stepIdx === round.steps.length - 1
              ? round.result
              : "?"}
          </span>
        </div>
      </div>

      {/* Multiple choice */}
      <motion.div
        animate={shake ? { x: [0, -8, 8, -8, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <div className="grid grid-cols-1 gap-2">
          {step.options.map((option) => {
            const isCorrectOption = option === step.correct;
            const isSelected = selected === option;

            let btnClass =
              "px-4 py-3 text-sm font-medium rounded-xl border transition-all duration-200 text-left ";

            if (answered && isCorrectOption) {
              btnClass += "border-success/50 bg-success/10 text-success";
            } else if (isSelected && !answered) {
              btnClass += "border-danger/50 bg-danger/10 text-danger";
            } else {
              btnClass +=
                "border-white/[0.1] bg-surface hover:bg-surface-hover text-white/70";
            }

            return (
              <motion.button
                key={option}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(option)}
                disabled={answered}
                className={btnClass}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

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
