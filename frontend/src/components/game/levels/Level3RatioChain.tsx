"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: (xpEarned: number) => void;
}

interface RoundData {
  givenRatio: string;
  givenLabel: string;
  angle: string;
  opp: number;
  adj: number;
  hyp: number;
  missingLabel: "adjacent" | "opposite" | "hypotenuse";
  missingValue: number;
  discoveryOptions: number[];
  /** The 5 remaining ratios to chain-fill */
  chain: {
    name: string;
    num: number;
    den: number;
    distractors: [number, number][];
  }[];
}

const rounds: RoundData[] = [
  {
    givenRatio: "3/5",
    givenLabel: "sin A = 3/5",
    angle: "A",
    opp: 3,
    adj: 4,
    hyp: 5,
    missingLabel: "adjacent",
    missingValue: 4,
    discoveryOptions: [4, 6, 2, 7],
    chain: [
      { name: "cos A", num: 4, den: 5, distractors: [[3, 4], [5, 4], [5, 3]] },
      { name: "tan A", num: 3, den: 4, distractors: [[4, 3], [3, 5], [4, 5]] },
      { name: "cosec A", num: 5, den: 3, distractors: [[3, 5], [5, 4], [4, 3]] },
      { name: "sec A", num: 5, den: 4, distractors: [[4, 5], [5, 3], [3, 4]] },
      { name: "cot A", num: 4, den: 3, distractors: [[3, 4], [4, 5], [5, 3]] },
    ],
  },
  {
    givenRatio: "5/13",
    givenLabel: "cos B = 5/13",
    angle: "B",
    opp: 12,
    adj: 5,
    hyp: 13,
    missingLabel: "opposite",
    missingValue: 12,
    discoveryOptions: [12, 8, 10, 14],
    chain: [
      { name: "sin B", num: 12, den: 13, distractors: [[5, 12], [13, 12], [13, 5]] },
      { name: "tan B", num: 12, den: 5, distractors: [[5, 12], [12, 13], [5, 13]] },
      { name: "cosec B", num: 13, den: 12, distractors: [[12, 13], [13, 5], [5, 12]] },
      { name: "sec B", num: 13, den: 5, distractors: [[5, 13], [13, 12], [12, 5]] },
      { name: "cot B", num: 5, den: 12, distractors: [[12, 5], [5, 13], [13, 12]] },
    ],
  },
  {
    givenRatio: "8/15",
    givenLabel: "tan C = 8/15",
    angle: "C",
    opp: 8,
    adj: 15,
    hyp: 17,
    missingLabel: "hypotenuse",
    missingValue: 17,
    discoveryOptions: [17, 19, 16, 23],
    chain: [
      { name: "sin C", num: 8, den: 17, distractors: [[15, 17], [8, 15], [17, 8]] },
      { name: "cos C", num: 15, den: 17, distractors: [[8, 17], [15, 8], [17, 15]] },
      { name: "cosec C", num: 17, den: 8, distractors: [[8, 17], [17, 15], [15, 8]] },
      { name: "sec C", num: 17, den: 15, distractors: [[15, 17], [17, 8], [8, 15]] },
      { name: "cot C", num: 15, den: 8, distractors: [[8, 15], [15, 17], [17, 8]] },
    ],
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Level3RatioChain({ onComplete }: { onComplete: (xp: number) => void }) {
  const [showIntro, setShowIntro] = useState(true);
  const [roundIdx, setRoundIdx] = useState(0);
  const [phase, setPhase] = useState<"discover" | "chain" | "complete">("discover");
  const [chainIdx, setChainIdx] = useState(0);
  const [shake, setShake] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [discoveredSide, setDiscoveredSide] = useState(false);
  const [filledRatios, setFilledRatios] = useState<boolean[]>([false, false, false, false, false]);
  const [showCorrectFlash, setShowCorrectFlash] = useState(false);

  const round = rounds[roundIdx];

  // Total steps: 3 rounds x 6 steps each (1 discovery + 5 chain)
  const totalSteps = 3 * 6;
  const currentStep = roundIdx * 6 + (phase === "discover" ? 0 : 1 + chainIdx);
  const progress = currentStep / totalSteps;

  // Shuffle chain options per chain step (memoized on roundIdx + chainIdx)
  const chainOptions = useMemo(() => {
    if (phase !== "chain") return [];
    const item = round.chain[chainIdx];
    if (!item) return [];
    const correct: [number, number] = [item.num, item.den];
    const all: [number, number][] = [correct, ...item.distractors];
    return shuffle(all);
  }, [roundIdx, chainIdx, phase]);

  const handleDiscoveryAnswer = useCallback(
    (value: number) => {
      if (value === round.missingValue) {
        setDiscoveredSide(true);
        setShowCorrectFlash(true);
        setTimeout(() => {
          setShowCorrectFlash(false);
          setPhase("chain");
        }, 800);
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    [round.missingValue],
  );

  const handleChainAnswer = useCallback(
    (num: number, den: number) => {
      const item = round.chain[chainIdx];
      if (num === item.num && den === item.den) {
        const newFilled = [...filledRatios];
        newFilled[chainIdx] = true;
        setFilledRatios(newFilled);
        setShowCorrectFlash(true);

        setTimeout(() => {
          setShowCorrectFlash(false);
          if (chainIdx < 4) {
            setChainIdx((c) => c + 1);
          } else {
            // Round complete
            setPhase("complete");
            setTimeout(() => {
              if (roundIdx < 2) {
                setRoundIdx((r) => r + 1);
                setPhase("discover");
                setChainIdx(0);
                setDiscoveredSide(false);
                setFilledRatios([false, false, false, false, false]);
              } else {
                const bonus = mistakes === 0 ? 20 : 0;
                onComplete(60 + bonus);
              }
            }, 1200);
          }
        }, 600);
      } else {
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => setShake(false), 500);
      }
    },
    [round, chainIdx, filledRatios, roundIdx, mistakes, onComplete],
  );

  // ---------- Intro screen ----------
  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
          World 1 &middot; Level 3
        </p>
        <h2 className="text-2xl font-bold mb-4">The Ratio Chain</h2>
        <p className="text-white/50 text-sm mb-2">
          If you know just <span className="text-accent-light">one</span> trigonometric
          ratio, you can find <span className="text-accent-light">all six</span>.
        </p>
        <p className="text-white/40 text-xs mb-3">
          The secret? The Pythagorean theorem gives you the missing side.
          Then every ratio is just a fraction of the three sides.
        </p>
        <div className="text-left max-w-xs mx-auto my-6 space-y-1 text-xs text-white/30">
          <p>
            <span className="text-accent-light">Step 1:</span> Use Pythagoras to find the missing side.
          </p>
          <p>
            <span className="text-success">Step 2:</span> Build all remaining ratios from the three sides.
          </p>
        </div>
        <button
          onClick={() => setShowIntro(false)}
          className="px-8 py-3 text-sm uppercase tracking-[0.1em] font-medium text-accent-light border border-accent/30 rounded-full hover:border-accent/60 transition-all duration-300"
        >
          Start
        </button>
      </motion.div>
    );
  }

  // ---------- Triangle SVG ----------
  // Coordinates for a right triangle (right angle bottom-right)
  const P = { x: 40, y: 200 }; // bottom-left (angle vertex)
  const Q = { x: 250, y: 200 }; // bottom-right (right angle)
  const R = { x: 250, y: 50 }; // top-right

  const showAdj = phase !== "discover" || discoveredSide || round.missingLabel !== "adjacent";
  const showOpp = phase !== "discover" || discoveredSide || round.missingLabel !== "opposite";
  const showHyp = phase !== "discover" || discoveredSide || round.missingLabel !== "hypotenuse";

  const missingHighlight = !discoveredSide && phase === "discover";

  const TriangleSVG = (
    <svg viewBox="0 0 300 240" className="w-full max-w-xs mx-auto mb-6">
      {/* Triangle fill */}
      <polygon
        points={`${P.x},${P.y} ${Q.x},${Q.y} ${R.x},${R.y}`}
        fill="rgba(108,92,231,0.04)"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1.5"
      />

      {/* Right angle indicator at Q */}
      <polyline
        points={`${Q.x - 15},${Q.y} ${Q.x - 15},${Q.y - 15} ${Q.x},${Q.y - 15}`}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />

      {/* Angle highlight at P */}
      <circle
        cx={P.x}
        cy={P.y}
        r="16"
        fill="rgba(162,155,254,0.12)"
        stroke="rgba(162,155,254,0.3)"
        strokeWidth="1"
      />
      <text
        x={P.x + 24}
        y={P.y - 8}
        fill="#a29bfe"
        fontSize="13"
        fontWeight="bold"
      >
        {round.angle}
      </text>

      {/* Adjacent (bottom side) */}
      <text
        x={(P.x + Q.x) / 2}
        y={P.y + 22}
        textAnchor="middle"
        fill={
          round.missingLabel === "adjacent" && missingHighlight
            ? "#ff6b6b"
            : "#00cec9"
        }
        fontSize="13"
        fontWeight="600"
      >
        {showAdj ? round.adj : "?"}
      </text>
      <text
        x={(P.x + Q.x) / 2}
        y={P.y + 35}
        textAnchor="middle"
        fill="rgba(0,206,201,0.4)"
        fontSize="9"
      >
        adjacent
      </text>

      {/* Opposite (right side) */}
      <text
        x={Q.x + 18}
        y={(Q.y + R.y) / 2}
        fill={
          round.missingLabel === "opposite" && missingHighlight
            ? "#ff6b6b"
            : "#a29bfe"
        }
        fontSize="13"
        fontWeight="600"
      >
        {showOpp ? round.opp : "?"}
      </text>
      <text
        x={Q.x + 18}
        y={(Q.y + R.y) / 2 + 13}
        fill="rgba(162,155,254,0.4)"
        fontSize="9"
      >
        opp
      </text>

      {/* Hypotenuse */}
      <text
        x={(P.x + R.x) / 2 - 25}
        y={(P.y + R.y) / 2 - 5}
        fill={
          round.missingLabel === "hypotenuse" && missingHighlight
            ? "#ff6b6b"
            : "#fdcb6e"
        }
        fontSize="13"
        fontWeight="600"
        textAnchor="middle"
      >
        {showHyp ? round.hyp : "?"}
      </text>
      <text
        x={(P.x + R.x) / 2 - 25}
        y={(P.y + R.y) / 2 + 8}
        fill="rgba(253,203,110,0.4)"
        fontSize="9"
        textAnchor="middle"
      >
        hyp
      </text>
    </svg>
  );

  // ---------- Discover Phase ----------
  if (phase === "discover") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md mx-auto"
      >
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-white/30">
            Round {roundIdx + 1}/3
          </span>
          <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent/50 rounded-full"
              animate={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Given ratio badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-4"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-sm font-semibold">
            Given: {round.givenLabel}
          </span>
        </motion.div>

        <p className="text-center text-sm text-white/50 mb-4">
          Use the Pythagorean theorem to find the{" "}
          <span className="text-danger font-semibold">
            missing {round.missingLabel}
          </span>
          .
        </p>

        {/* Triangle */}
        <motion.div
          animate={shake ? { x: [0, -8, 8, -8, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {TriangleSVG}
        </motion.div>

        {/* Pythagoras hint */}
        <p className="text-center text-xs text-white/40 mb-4">
          a&sup2; + b&sup2; = c&sup2;
        </p>

        {/* Discovery options */}
        {!discoveredSide && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-center"
          >
            {round.discoveryOptions.map((val) => (
              <motion.button
                key={val}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDiscoveryAnswer(val)}
                className="w-14 h-14 text-lg font-bold rounded-xl border border-white/[0.1] bg-surface hover:bg-surface-hover transition-all duration-200"
              >
                {val}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Correct flash */}
        {showCorrectFlash && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-success text-sm font-semibold mt-4"
          >
            Correct! The missing side is {round.missingValue}.
          </motion.p>
        )}
      </motion.div>
    );
  }

  // ---------- Chain Phase ----------
  if (phase === "chain") {
    const currentChain = round.chain[chainIdx];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md mx-auto"
      >
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-white/30">
            Round {roundIdx + 1}/3
          </span>
          <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent/50 rounded-full"
              animate={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Given ratio badge */}
        <div className="text-center mb-3">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-xs font-semibold">
            {round.givenLabel}
          </span>
        </div>

        {/* Triangle (compact) */}
        {TriangleSVG}

        {/* Chain slots */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {round.chain.map((item, i) => {
            const filled = filledRatios[i];
            const active = i === chainIdx;

            return (
              <motion.div
                key={item.name}
                layout
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 ${
                  filled
                    ? "bg-success/10 border-success/30 text-success"
                    : active
                      ? "bg-accent/10 border-accent/40 text-accent-light"
                      : "bg-white/[0.02] border-white/[0.06] text-white/30"
                }`}
              >
                {item.name} = {filled ? `${item.num}/${item.den}` : "?/?"}
              </motion.div>
            );
          })}
        </div>

        {/* Current question */}
        <motion.div
          key={`${roundIdx}-${chainIdx}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <p className="text-sm text-white/50 mb-1">
            What is{" "}
            <span className="text-accent-light font-semibold">
              {currentChain.name}
            </span>
            ?
          </p>
        </motion.div>

        {/* Multiple choice fraction buttons */}
        <motion.div
          animate={shake ? { x: [0, -8, 8, -8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 gap-3 max-w-xs mx-auto"
        >
          <AnimatePresence mode="wait">
            {chainOptions.map(([num, den], i) => (
              <motion.button
                key={`${roundIdx}-${chainIdx}-${num}-${den}-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChainAnswer(num, den)}
                className="py-3 text-center text-lg font-bold rounded-xl border border-white/[0.1] bg-surface hover:bg-surface-hover transition-all duration-200"
              >
                <span className="text-white/80">{num}</span>
                <span className="text-white/30 mx-1">/</span>
                <span className="text-white/80">{den}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Correct flash */}
        {showCorrectFlash && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-success text-sm font-semibold mt-4"
          >
            Correct!
          </motion.p>
        )}
      </motion.div>
    );
  }

  // ---------- Complete Phase (brief animation between rounds) ----------
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-md mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 border border-success/30 flex items-center justify-center"
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00cec9"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </motion.div>
      <h3 className="text-xl font-bold mb-2">Round {roundIdx + 1} Complete!</h3>
      <p className="text-white/40 text-sm">
        All six ratios derived from {round.givenLabel}.
      </p>

      {/* Filled ratios summary */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-accent/10 border border-accent/20 text-accent-light">
          {round.givenLabel}
        </span>
        {round.chain.map((item) => (
          <motion.span
            key={item.name}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-success/10 border border-success/20 text-success"
          >
            {item.name} = {item.num}/{item.den}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
