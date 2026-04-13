"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: (xpEarned: number) => void;
}

interface Question {
  prompt: string;
  answer: string;
  options: string[];
}

const questions: Question[] = [
  {
    prompt: "sin 30\u00B0",
    answer: "1/2",
    options: ["1/2", "\u221A3/2", "1/\u221A2", "0"],
  },
  {
    prompt: "cos 60\u00B0",
    answer: "1/2",
    options: ["1", "1/2", "\u221A3/2", "0"],
  },
  {
    prompt: "tan 45\u00B0",
    answer: "1",
    options: ["0", "1/\u221A3", "1", "\u221A3"],
  },
  {
    prompt: "sin 90\u00B0",
    answer: "1",
    options: ["0", "1/2", "\u221A3/2", "1"],
  },
  {
    prompt: "cos 0\u00B0",
    answer: "1",
    options: ["0", "1/2", "1", "undefined"],
  },
  {
    prompt: "tan 30\u00B0",
    answer: "1/\u221A3",
    options: ["\u221A3", "1", "1/\u221A3", "1/2"],
  },
  {
    prompt: "sin 45\u00B0",
    answer: "1/\u221A2",
    options: ["1/2", "1/\u221A2", "\u221A3/2", "1"],
  },
  {
    prompt: "cos 30\u00B0",
    answer: "\u221A3/2",
    options: ["1/2", "1/\u221A2", "\u221A3/2", "1"],
  },
  {
    prompt: "tan 60\u00B0",
    answer: "\u221A3",
    options: ["1/\u221A3", "1", "\u221A3", "undefined"],
  },
  {
    prompt: "sin 0\u00B0",
    answer: "0",
    options: ["0", "1/2", "1", "undefined"],
  },
  {
    prompt: "cos 45\u00B0",
    answer: "1/\u221A2",
    options: ["\u221A3/2", "1/\u221A2", "1/2", "0"],
  },
  {
    prompt: "cos 90\u00B0",
    answer: "0",
    options: ["1", "1/2", "0", "undefined"],
  },
  {
    prompt: "tan 0\u00B0",
    answer: "0",
    options: ["undefined", "0", "1", "1/\u221A3"],
  },
  {
    prompt: "sin 60\u00B0",
    answer: "\u221A3/2",
    options: ["1/2", "\u221A3/2", "1/\u221A2", "1"],
  },
  {
    prompt: "tan 90\u00B0",
    answer: "undefined",
    options: ["0", "1", "\u221A3", "undefined"],
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Level8SpeedRecall({ onComplete }: Props) {
  const [showIntro, setShowIntro] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [phase, setPhase] = useState<"intro" | "countdown" | "playing" | "result">("intro");
  const [qIdx, setQIdx] = useState(0);
  const [shuffledQuestions] = useState(() => shuffleArray(questions));
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3000);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const totalQuestions = shuffledQuestions.length;
  const currentQ = shuffledQuestions[qIdx];

  // Countdown timer
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      setPhase("playing");
      startTimeRef.current = Date.now();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Question timer
  useEffect(() => {
    if (phase !== "playing" || feedback) return;
    startTimeRef.current = Date.now();
    setTimeLeft(3000);
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, 3000 - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        // Time's up — wrong answer
        if (timerRef.current) clearInterval(timerRef.current);
        setFeedback("wrong");
        setStreak(0);
        setTimeout(() => advanceQuestion(), 800);
      }
    }, 50);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, qIdx, feedback]);

  const advanceQuestion = useCallback(() => {
    if (qIdx >= totalQuestions - 1) {
      setPhase("result");
      return;
    }
    setQIdx((q) => q + 1);
    setFeedback(null);
  }, [qIdx, totalQuestions]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (feedback) return;
      if (timerRef.current) clearInterval(timerRef.current);

      if (answer === currentQ.answer) {
        setFeedback("correct");
        setCorrect((c) => c + 1);
        setStreak((s) => {
          const newStreak = s + 1;
          setBestStreak((b) => Math.max(b, newStreak));
          return newStreak;
        });
      } else {
        setFeedback("wrong");
        setStreak(0);
      }

      setTimeout(() => advanceQuestion(), 600);
    },
    [feedback, currentQ, advanceQuestion],
  );

  // Result screen
  if (phase === "result") {
    const accuracy = Math.round((correct / totalQuestions) * 100);
    const baseXP = 50;
    const streakBonus = bestStreak >= 10 ? 30 : bestStreak >= 5 ? 15 : 0;
    const accuracyBonus = accuracy === 100 ? 20 : 0;
    const totalXP = baseXP + streakBonus + accuracyBonus;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center max-w-sm mx-auto"
      >
        <h2 className="text-2xl font-bold mb-6">Speed Recall Complete!</h2>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="py-4 rounded-xl bg-surface border border-white/[0.06]">
            <p className="text-2xl font-bold text-accent-light">{correct}</p>
            <p className="text-[10px] text-white/30 mt-1">Correct</p>
          </div>
          <div className="py-4 rounded-xl bg-surface border border-white/[0.06]">
            <p className="text-2xl font-bold text-warning">{bestStreak}</p>
            <p className="text-[10px] text-white/30 mt-1">Best Streak</p>
          </div>
          <div className="py-4 rounded-xl bg-surface border border-white/[0.06]">
            <p className="text-2xl font-bold text-success">{accuracy}%</p>
            <p className="text-[10px] text-white/30 mt-1">Accuracy</p>
          </div>
        </div>

        <button
          onClick={() => onComplete(totalXP)}
          className="px-8 py-3 text-sm uppercase tracking-[0.1em] font-medium text-accent-light border border-accent/30 rounded-full hover:border-accent/60 transition-all duration-300"
        >
          Claim {totalXP} XP &rarr;
        </button>
      </motion.div>
    );
  }

  // Intro screen
  if (phase === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/25 mb-4">
          World 2 &middot; Level 8
        </p>
        <h2 className="text-2xl font-bold mb-4">Speed Recall</h2>
        <p className="text-white/50 text-sm mb-2">
          15 questions. 3 seconds each.
        </p>
        <p className="text-white/40 text-xs mb-2">
          You&rsquo;ll be shown a trig expression like &ldquo;sin 30&deg;&rdquo;
          and 4 options. Pick the right value before time runs out.
        </p>
        <p className="text-warning text-xs mb-8">
          Build streaks for bonus XP!
        </p>
        <button
          onClick={() => {
            setShowIntro(false);
            setPhase("countdown");
          }}
          className="px-8 py-3 text-sm uppercase tracking-[0.1em] font-medium text-accent-light border border-accent/30 rounded-full hover:border-accent/60 transition-all duration-300"
        >
          Ready
        </button>
      </motion.div>
    );
  }

  // Countdown screen
  if (phase === "countdown") {
    return (
      <motion.div className="text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-7xl font-bold text-accent-light"
          >
            {countdown || "GO!"}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    );
  }

  // Playing screen
  const timerPercent = (timeLeft / 3000) * 100;
  const timerColor =
    timerPercent > 50
      ? "bg-success"
      : timerPercent > 25
        ? "bg-warning"
        : "bg-danger";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Top info bar */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/30">
          {qIdx + 1} / {totalQuestions}
        </span>
        {streak >= 2 && (
          <motion.span
            key={streak}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="text-xs font-bold text-warning"
          >
            {streak} streak!
          </motion.span>
        )}
      </div>

      {/* Timer bar */}
      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden mb-10">
        <motion.div
          className={`h-full rounded-full ${timerColor}`}
          style={{ width: `${timerPercent}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={qIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="text-center mb-10"
        >
          <p className="text-4xl md:text-5xl font-bold">{currentQ.prompt}</p>
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {currentQ.options.map((opt) => {
          let btnStyle = "border-white/[0.1] bg-surface hover:bg-surface-hover";

          if (feedback) {
            if (opt === currentQ.answer) {
              btnStyle = "border-success/50 bg-success/10 text-success";
            } else if (feedback === "wrong" && opt !== currentQ.answer) {
              btnStyle = "border-white/[0.05] bg-surface opacity-30";
            }
          }

          return (
            <motion.button
              key={opt}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAnswer(opt)}
              disabled={!!feedback}
              className={`py-4 px-3 text-lg font-semibold rounded-xl border transition-all duration-200 ${btnStyle}`}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback flash */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-center mt-6 text-sm font-semibold ${
              feedback === "correct" ? "text-success" : "text-danger"
            }`}
          >
            {feedback === "correct" ? "Correct!" : `Answer: ${currentQ.answer}`}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
