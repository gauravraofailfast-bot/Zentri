"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: (xpEarned: number) => void;
}

interface Round {
  /** Which angle is highlighted: "A" (bottom-left) or "B" (top) */
  highlightedAngle: "A" | "B";
  /** The correct mapping: which side index is opp, adj, hyp */
  correct: { opposite: number; adjacent: number; hypotenuse: number };
}

const rounds: Round[] = [
  {
    highlightedAngle: "A",
    correct: { opposite: 1, adjacent: 0, hypotenuse: 2 },
  },
  {
    highlightedAngle: "B",
    correct: { opposite: 0, adjacent: 1, hypotenuse: 2 },
  },
  {
    highlightedAngle: "A",
    correct: { opposite: 1, adjacent: 0, hypotenuse: 2 },
  },
];

const sideLabels = ["Opposite", "Adjacent", "Hypotenuse"] as const;
type SideLabel = (typeof sideLabels)[number];

/**
 * Level 1: Name the Sides
 *
 * SVG right triangle. An angle is highlighted.
 * One side pulses at a time. Student picks the correct label.
 * After labeling all 3 sides, the highlighted angle changes.
 */
export default function Level1NameSides({ onComplete }: Props) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [currentSide, setCurrentSide] = useState(0); // 0, 1, 2 = three sides to label
  const [labels, setLabels] = useState<(SideLabel | null)[]>([
    null,
    null,
    null,
  ]);
  const [shake, setShake] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const round = rounds[roundIdx];

  // Side ordering for labeling: ask about each side in order
  const sideOrder = [0, 1, 2]; // bottom, right-side, hypotenuse

  const currentSideIdx = sideOrder[currentSide];

  const handleAnswer = useCallback(
    (answer: SideLabel) => {
      const correctLabel =
        currentSideIdx === round.correct.opposite
          ? "Opposite"
          : currentSideIdx === round.correct.adjacent
            ? "Adjacent"
            : "Hypotenuse";

      if (answer === correctLabel) {
        const newLabels = [...labels];
        newLabels[currentSideIdx] = answer;
        setLabels(newLabels);

        if (currentSide >= 2) {
          // All sides labeled in this round
          if (roundIdx >= rounds.length - 1) {
            // All rounds done
            const bonus = mistakes === 0 ? 20 : 0;
            onComplete(50 + bonus);
          } else {
            // Next round
            setTimeout(() => {
              setRoundIdx((r) => r + 1);
              setCurrentSide(0);
              setLabels([null, null, null]);
            }, 800);
          }
        } else {
          setCurrentSide((s) => s + 1);
        }
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    [currentSide, currentSideIdx, labels, round, roundIdx, mistakes, onComplete],
  );

  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
          World 1 &middot; Level 1
        </p>
        <h2 className="text-2xl font-bold mb-4">Name the Sides</h2>
        <p className="text-white/50 text-sm mb-2">
          A right triangle has three sides. Their names change depending on
          which angle you&rsquo;re looking from.
        </p>
        <p className="text-white/40 text-xs mb-8">
          For each highlighted angle, identify which side is the{" "}
          <span className="text-accent-light">opposite</span>,{" "}
          <span className="text-success">adjacent</span>, and{" "}
          <span className="text-warning">hypotenuse</span>.
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

  // Triangle coordinates (SVG viewBox 0 0 300 250)
  // C = right angle (bottom-right), A = bottom-left, B = top-right
  const A = { x: 40, y: 210 };
  const B = { x: 260, y: 40 };
  const C = { x: 260, y: 210 };

  // Sides: 0 = AC (bottom), 1 = BC (right), 2 = AB (hypotenuse)
  const sides = [
    { from: A, to: C, mid: { x: (A.x + C.x) / 2, y: A.y + 20 } },
    { from: C, to: B, mid: { x: C.x - 35, y: (C.y + B.y) / 2 } },
    { from: A, to: B, mid: { x: (A.x + B.x) / 2 - 20, y: (A.y + B.y) / 2 - 10 } },
  ];

  const anglePos =
    round.highlightedAngle === "A" ? { x: A.x + 35, y: A.y - 15 } : { x: B.x - 15, y: B.y + 35 };

  const usedLabels = labels.filter(Boolean) as SideLabel[];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-white/30">
          Round {roundIdx + 1}/{rounds.length}
        </span>
        <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent/50 rounded-full"
            animate={{
              width: `${((roundIdx * 3 + currentSide) / (rounds.length * 3)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Instruction */}
      <p className="text-center text-sm text-white/50 mb-4">
        Looking from angle{" "}
        <span className="text-accent-light font-semibold">
          {round.highlightedAngle}
        </span>
        , what is the{" "}
        <span className="text-white font-semibold">
          highlighted side
        </span>
        ?
      </p>

      {/* Triangle SVG */}
      <motion.div
        animate={shake ? { x: [0, -8, 8, -8, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <svg viewBox="0 0 300 250" className="w-full max-w-xs mx-auto mb-8">
          {/* Triangle fill */}
          <polygon
            points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
            fill="rgba(108,92,231,0.04)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />

          {/* Right angle indicator at C */}
          <polyline
            points={`${C.x - 15},${C.y} ${C.x - 15},${C.y - 15} ${C.x},${C.y - 15}`}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />

          {/* Highlighted angle arc */}
          <circle
            cx={round.highlightedAngle === "A" ? A.x : B.x}
            cy={round.highlightedAngle === "A" ? A.y : B.y}
            r="18"
            fill="rgba(162,155,254,0.15)"
            stroke="rgba(162,155,254,0.4)"
            strokeWidth="1"
          />

          {/* Angle label */}
          <text
            x={anglePos.x}
            y={anglePos.y}
            fill="#a29bfe"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {round.highlightedAngle}
          </text>

          {/* Vertex labels */}
          <text x={A.x - 15} y={A.y + 5} fill="rgba(255,255,255,0.3)" fontSize="12">
            A
          </text>
          <text x={B.x + 8} y={B.y + 5} fill="rgba(255,255,255,0.3)" fontSize="12">
            B
          </text>
          <text x={C.x + 8} y={C.y + 5} fill="rgba(255,255,255,0.3)" fontSize="12">
            C
          </text>

          {/* Sides */}
          {sides.map((side, i) => {
            const isActive = i === currentSideIdx && !labels[i];
            const isLabeled = labels[i] !== null;
            const labelColor =
              labels[i] === "Opposite"
                ? "#a29bfe"
                : labels[i] === "Adjacent"
                  ? "#00cec9"
                  : labels[i] === "Hypotenuse"
                    ? "#fdcb6e"
                    : "#fff";

            return (
              <g key={i}>
                {/* Side line highlight */}
                {isActive && (
                  <motion.line
                    x1={side.from.x}
                    y1={side.from.y}
                    x2={side.to.x}
                    y2={side.to.y}
                    stroke="#a29bfe"
                    strokeWidth="4"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* Label on side */}
                {isLabeled && (
                  <motion.text
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    x={side.mid.x}
                    y={side.mid.y}
                    fill={labelColor}
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {labels[i]}
                  </motion.text>
                )}
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Answer buttons */}
      <div className="flex gap-3 justify-center">
        <AnimatePresence>
          {sideLabels.map((label) => {
            const isUsed = usedLabels.includes(label);
            const color =
              label === "Opposite"
                ? "border-accent-light/30 text-accent-light hover:border-accent-light/60"
                : label === "Adjacent"
                  ? "border-success/30 text-success hover:border-success/60"
                  : "border-warning/30 text-warning hover:border-warning/60";

            return (
              <motion.button
                key={label}
                layout
                onClick={() => !isUsed && handleAnswer(label)}
                disabled={isUsed}
                className={`px-4 py-2.5 text-sm rounded-xl border transition-all duration-300 ${
                  isUsed ? "opacity-20 cursor-not-allowed" : color
                }`}
              >
                {label}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
