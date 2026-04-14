"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  onComplete: (xpEarned: number) => void;
}

/* ---------- Derivation step data ---------- */
interface DeriveStep {
  question: string;
  options: string[];
  correct: string;
  explanation?: string;
}

const deriveSecSteps: DeriveStep[] = [
  {
    question: "sin\u00B2A / cos\u00B2A = ?",
    options: ["tan\u00B2A", "cot\u00B2A", "sec\u00B2A", "cosec\u00B2A"],
    correct: "tan\u00B2A",
    explanation: "sin A / cos A = tan A, so sin\u00B2A / cos\u00B2A = tan\u00B2A",
  },
  {
    question: "cos\u00B2A / cos\u00B2A = ?",
    options: ["1", "0", "cos A", "sec A"],
    correct: "1",
  },
  {
    question: "1 / cos\u00B2A = ?",
    options: ["sec\u00B2A", "cosec\u00B2A", "tan\u00B2A", "cot\u00B2A"],
    correct: "sec\u00B2A",
    explanation: "sec A = 1/cos A, so 1/cos\u00B2A = sec\u00B2A",
  },
];

const deriveCosecSteps: DeriveStep[] = [
  {
    question: "sin\u00B2A / sin\u00B2A = ?",
    options: ["1", "0", "sin A", "cosec A"],
    correct: "1",
  },
  {
    question: "cos\u00B2A / sin\u00B2A = ?",
    options: ["cot\u00B2A", "tan\u00B2A", "sec\u00B2A", "cosec\u00B2A"],
    correct: "cot\u00B2A",
    explanation: "cos A / sin A = cot A, so cos\u00B2A / sin\u00B2A = cot\u00B2A",
  },
  {
    question: "1 / sin\u00B2A = ?",
    options: ["cosec\u00B2A", "sec\u00B2A", "cot\u00B2A", "tan\u00B2A"],
    correct: "cosec\u00B2A",
    explanation: "cosec A = 1/sin A, so 1/sin\u00B2A = cosec\u00B2A",
  },
];

/* ---------- Apply phase data ---------- */
interface ApplyQuestion {
  question: string;
  options: string[];
  correct: string;
  hint: string;
}

const applyQuestions: ApplyQuestion[] = [
  {
    question: "If tan A = 3/4, what is sec A?",
    options: ["5/4", "4/3", "3/5", "5/3"],
    correct: "5/4",
    hint: "sec\u00B2A = 1 + tan\u00B2A = 1 + 9/16 = 25/16",
  },
  {
    question: "If cot A = 12/5, what is cosec A?",
    options: ["13/5", "12/13", "5/12", "5/13"],
    correct: "13/5",
    hint: "cosec\u00B2A = 1 + cot\u00B2A = 1 + 144/25 = 169/25",
  },
  {
    question: "sec\u00B245\u00B0 \u2212 tan\u00B245\u00B0 = ?",
    options: ["1", "0", "2", "\u221A2"],
    correct: "1",
    hint: "The identity 1 + tan\u00B2A = sec\u00B2A rearranges to sec\u00B2A \u2212 tan\u00B2A = 1",
  },
  {
    question: "If sec A = 2, what is tan A?",
    options: ["\u221A3", "1", "2", "1/2"],
    correct: "\u221A3",
    hint: "tan\u00B2A = sec\u00B2A \u2212 1 = 4 \u2212 1 = 3, so tan A = \u221A3",
  },
];

type Phase = "derive-sec" | "derive-cosec" | "apply";

export default function Level11OtherTwoLaws({ onComplete }: Props) {
  const [showIntro, setShowIntro] = useState(true);
  const [phase, setPhase] = useState<Phase>("derive-sec");
  const [stepIdx, setStepIdx] = useState(0);
  const [shake, setShake] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const getStepsForPhase = (p: Phase) => {
    if (p === "derive-sec") return deriveSecSteps;
    if (p === "derive-cosec") return deriveCosecSteps;
    return applyQuestions;
  };

  const currentSteps = getStepsForPhase(phase);
  const totalSteps =
    deriveSecSteps.length + deriveCosecSteps.length + applyQuestions.length;
  const currentProgress =
    phase === "derive-sec"
      ? stepIdx
      : phase === "derive-cosec"
        ? deriveSecSteps.length + stepIdx
        : deriveSecSteps.length + deriveCosecSteps.length + stepIdx;

  const handleSelect = useCallback(
    (option: string) => {
      if (answered) return;

      const correct = currentSteps[stepIdx].correct;
      setSelected(option);

      if (option === correct) {
        setAnswered(true);
        setTimeout(() => {
          if (stepIdx < currentSteps.length - 1) {
            setStepIdx((i) => i + 1);
          } else if (phase === "derive-sec") {
            setPhase("derive-cosec");
            setStepIdx(0);
          } else if (phase === "derive-cosec") {
            setPhase("apply");
            setStepIdx(0);
          } else {
            const bonus = mistakes === 0 ? 20 : 0;
            onComplete(60 + bonus);
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
    [phase, stepIdx, answered, currentSteps, mistakes, onComplete],
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
          World 3 &middot; Level 11
        </p>
        <h2 className="text-2xl font-bold mb-4">The Other Two Laws</h2>
        <p className="text-white/50 text-sm mb-2">
          Two more identities derived from sin&sup2;A + cos&sup2;A = 1:
        </p>
        <div className="text-left max-w-xs mx-auto my-6 space-y-3 text-sm">
          <p className="text-accent-light">
            1 + tan&sup2;A = sec&sup2;A
          </p>
          <p className="text-success">
            1 + cot&sup2;A = cosec&sup2;A
          </p>
        </div>
        <p className="text-white/40 text-xs mb-8">
          Derive each by dividing the first law, then apply them.
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

  const stepData = currentSteps[stepIdx];
  const correct = stepData.correct;
  const isApply = phase === "apply";

  /* ---------- Phase label + derivation context ---------- */
  const phaseLabel =
    phase === "derive-sec"
      ? "Derive: sec\u00B2A"
      : phase === "derive-cosec"
        ? "Derive: cosec\u00B2A"
        : "Application";

  const deriveContext =
    phase === "derive-sec"
      ? "Starting from sin\u00B2A + cos\u00B2A = 1, divide both sides by cos\u00B2A:"
      : phase === "derive-cosec"
        ? "Starting from sin\u00B2A + cos\u00B2A = 1, divide both sides by sin\u00B2A:"
        : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-white/30">
          {stepIdx + 1}/{currentSteps.length}
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
            isApply
              ? "bg-success/10 text-success"
              : phase === "derive-sec"
                ? "bg-accent/10 text-accent-light"
                : "bg-warning/10 text-warning"
          }`}
        >
          {phaseLabel}
        </span>
      </div>

      {/* Derivation context */}
      {deriveContext && (
        <p className="text-xs text-white/40 text-center mb-4">
          {deriveContext}
        </p>
      )}

      {/* Identity being derived (visual) */}
      {!isApply && (
        <div className="flex justify-center gap-1 text-sm text-white/20 mb-6">
          {currentSteps.map((s, i) => (
            <span
              key={i}
              className={`px-2 py-1 rounded ${
                i < stepIdx
                  ? "bg-success/10 text-success"
                  : i === stepIdx
                    ? "bg-accent/10 text-accent-light"
                    : "bg-white/[0.03]"
              }`}
            >
              {i < stepIdx ? s.correct : "?"}
            </span>
          ))}
        </div>
      )}

      {/* Question */}
      <motion.div
        animate={shake ? { x: [0, -8, 8, -8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <p className="text-lg font-semibold mb-2">{stepData.question}</p>
        {isApply && (
          <p className="text-xs text-white/30">
            {(stepData as ApplyQuestion).hint}
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

      {/* Explanation on correct */}
      {answered && !isApply && (currentSteps[stepIdx] as DeriveStep).explanation && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-success/70 text-center mt-4"
        >
          {(currentSteps[stepIdx] as DeriveStep).explanation}
        </motion.p>
      )}

      {/* Result banner when derivation completes */}
      {answered && stepIdx === currentSteps.length - 1 && !isApply && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 text-center text-sm text-success font-semibold"
        >
          {phase === "derive-sec"
            ? "tan\u00B2A + 1 = sec\u00B2A \u2713"
            : "1 + cot\u00B2A = cosec\u00B2A \u2713"}
        </motion.div>
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
