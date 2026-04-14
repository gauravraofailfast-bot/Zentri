"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: (xpEarned: number) => void;
}

type TrigRatio = "sin" | "cos" | "tan";

interface ScaleStep {
  sides: [number, number, number]; // [opp-relevant, adj-relevant, hyp]
  scaleFactor: number;
}

interface Round {
  angleName: string;
  ratio: TrigRatio;
  baseSides: [number, number, number]; // [opp, adj, hyp] of the base triangle
  /** The simplified fraction answer */
  simplified: { num: number; den: number };
  /** Scaled triangles the player must solve */
  scales: ScaleStep[];
}

const rounds: Round[] = [
  {
    angleName: "A",
    ratio: "sin",
    baseSides: [3, 4, 5],
    simplified: { num: 3, den: 5 },
    scales: [
      { sides: [6, 8, 10], scaleFactor: 2 },
      { sides: [9, 12, 15], scaleFactor: 3 },
    ],
  },
  {
    angleName: "B",
    ratio: "cos",
    baseSides: [5, 12, 13],
    simplified: { num: 12, den: 13 },
    scales: [{ sides: [10, 24, 26], scaleFactor: 2 }],
  },
  {
    angleName: "C",
    ratio: "tan",
    baseSides: [8, 15, 17],
    simplified: { num: 8, den: 15 },
    scales: [{ sides: [16, 30, 34], scaleFactor: 2 }],
  },
];

/** Get the unsimplified fraction for a given ratio and side set */
function getRatioFraction(
  ratio: TrigRatio,
  sides: [number, number, number],
): { num: number; den: number } {
  const [opp, adj, hyp] = sides;
  switch (ratio) {
    case "sin":
      return { num: opp, den: hyp };
    case "cos":
      return { num: adj, den: hyp };
    case "tan":
      return { num: opp, den: adj };
  }
}

function ratioLabel(ratio: TrigRatio): string {
  switch (ratio) {
    case "sin":
      return "Opp \u00F7 Hyp";
    case "cos":
      return "Adj \u00F7 Hyp";
    case "tan":
      return "Opp \u00F7 Adj";
  }
}

/** Generate 4 fraction choices — 1 correct + 3 distractors */
function generateChoices(
  correct: { num: number; den: number },
  sides: [number, number, number],
): { num: number; den: number }[] {
  const [opp, adj, hyp] = sides;
  const all = [
    { num: opp, den: hyp },
    { num: adj, den: hyp },
    { num: opp, den: adj },
    { num: hyp, den: opp },
    { num: adj, den: opp },
    { num: hyp, den: adj },
  ];

  const key = (f: { num: number; den: number }) => `${f.num}/${f.den}`;
  const correctKey = key(correct);

  const distractors = all
    .filter((f) => key(f) !== correctKey)
    .reduce(
      (acc, f) => {
        if (!acc.seen.has(key(f))) {
          acc.seen.add(key(f));
          acc.items.push(f);
        }
        return acc;
      },
      { seen: new Set<string>(), items: [] as { num: number; den: number }[] },
    ).items;

  const picked = distractors.slice(0, 3);
  const choices = [correct, ...picked];

  // Deterministic shuffle based on correct answer
  for (let i = choices.length - 1; i > 0; i--) {
    const j = (correct.num * 7 + correct.den * 13 + i * 3) % (i + 1);
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  return choices;
}

/** Total number of scale steps across all rounds (for progress bar) */
const totalScaleSteps = rounds.reduce((sum, r) => sum + r.scales.length, 0);

export default function Level4SizeDoesntMatter({
  onComplete,
}: {
  onComplete: (xp: number) => void;
}) {
  const [showIntro, setShowIntro] = useState(true);
  const [roundIdx, setRoundIdx] = useState(0);
  const [scaleIdx, setScaleIdx] = useState(0);
  const [phase, setPhase] = useState<"show" | "scale" | "reveal">("show");
  const [shake, setShake] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const round = rounds[roundIdx];
  const currentScale = round.scales[scaleIdx];

  // Calculate cumulative progress
  const completedSteps = useMemo(() => {
    let steps = 0;
    for (let r = 0; r < roundIdx; r++) {
      steps += rounds[r].scales.length;
    }
    if (phase === "show") return steps;
    return steps + scaleIdx + (phase === "reveal" ? 1 : 0);
  }, [roundIdx, scaleIdx, phase]);

  const progress = Math.min((completedSteps / totalScaleSteps) * 100, 100);

  const correctFraction = getRatioFraction(round.ratio, currentScale?.sides ?? round.baseSides);
  const choices = useMemo(
    () =>
      currentScale
        ? generateChoices(correctFraction, currentScale.sides)
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roundIdx, scaleIdx],
  );

  const handleChoice = useCallback(
    (choice: { num: number; den: number }) => {
      if (phase !== "scale") return;

      const key = `${choice.num}/${choice.den}`;
      setSelectedAnswer(key);

      if (
        choice.num === correctFraction.num &&
        choice.den === correctFraction.den
      ) {
        // Correct — show reveal phase
        setTimeout(() => {
          setPhase("reveal");
        }, 600);
      } else {
        // Wrong
        setShake(true);
        setMistakes((m) => m + 1);
        setTimeout(() => {
          setShake(false);
          setSelectedAnswer(null);
        }, 500);
      }
    },
    [phase, correctFraction],
  );

  const advanceFromReveal = useCallback(() => {
    setSelectedAnswer(null);

    if (scaleIdx < round.scales.length - 1) {
      // Next scale in this round
      setScaleIdx((s) => s + 1);
      setPhase("scale");
    } else if (roundIdx < rounds.length - 1) {
      // Next round
      setRoundIdx((r) => r + 1);
      setScaleIdx(0);
      setPhase("show");
    } else {
      // All rounds done
      const bonus = mistakes === 0 ? 20 : 0;
      onComplete(50 + bonus);
    }
  }, [scaleIdx, round, roundIdx, mistakes, onComplete]);

  const ratioColor =
    round.ratio === "sin"
      ? "text-accent-light"
      : round.ratio === "cos"
        ? "text-success"
        : "text-warning";

  const ratioColorHex =
    round.ratio === "sin"
      ? "#a29bfe"
      : round.ratio === "cos"
        ? "#00cec9"
        : "#fdcb6e";

  // ── INTRO SCREEN ──
  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
          World 1 &middot; Level 4
        </p>
        <h2 className="text-2xl font-bold mb-4">Size Doesn&apos;t Matter</h2>
        <p className="text-white/50 text-sm mb-2">
          A trigonometric ratio depends only on the <em>angle</em>, not how big
          the triangle is.
        </p>
        <p className="text-white/40 text-xs mb-2">
          If you scale every side of a right triangle by the same factor, the
          ratio stays identical &mdash; like zooming in on a photo doesn&apos;t
          change the proportions.
        </p>
        <div className="my-6 flex items-center justify-center gap-3">
          {/* Tiny visual: two similar triangles */}
          <svg viewBox="0 0 120 60" className="w-28 opacity-60">
            {/* Small triangle */}
            <polygon
              points="10,55 40,55 40,30"
              fill="rgba(108,92,231,0.08)"
              stroke="rgba(162,155,254,0.5)"
              strokeWidth="1"
            />
            {/* Large triangle */}
            <polygon
              points="10,55 90,55 90,10"
              fill="rgba(108,92,231,0.04)"
              stroke="rgba(162,155,254,0.25)"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            <text x="50" y="52" fill="#a29bfe" fontSize="8" fontWeight="bold">
              same angle
            </text>
          </svg>
        </div>
        <p className="text-white/30 text-xs mb-8">
          You&apos;ll see a small triangle and its ratio, then figure out the
          ratio for a scaled-up version.
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

  // ── SHOW PHASE ── Show the original small triangle and its ratio
  if (phase === "show") {
    const baseFrac = getRatioFraction(round.ratio, round.baseSides);
    const [opp, adj, hyp] = round.baseSides;

    return (
      <motion.div
        key={`show-${roundIdx}`}
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
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="text-center text-sm text-white/50 mb-4">
          Here&apos;s a{" "}
          <span className="text-white font-semibold">
            {opp}-{adj}-{hyp}
          </span>{" "}
          right triangle.
        </p>

        {/* SVG: single small triangle */}
        <TriangleSVG
          sides={round.baseSides}
          angleName={round.angleName}
          accentHex={ratioColorHex}
          scale={1}
          showGhost={false}
        />

        {/* Ratio display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-4 mb-6"
        >
          <p className="text-xs text-white/30 mb-1">{ratioLabel(round.ratio)}</p>
          <p className="text-xl font-bold">
            <span className={ratioColor}>
              {round.ratio} {round.angleName}
            </span>{" "}
            <span className="text-white/30">=</span>{" "}
            <span className="text-foreground">
              {baseFrac.num}/{baseFrac.den}
            </span>
          </p>
        </motion.div>

        <p className="text-center text-xs text-white/30 mb-6">
          Remember this ratio. Now let&apos;s scale the triangle up...
        </p>

        <div className="flex justify-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase("scale")}
            className="px-8 py-3 text-sm uppercase tracking-[0.1em] font-medium text-accent-light border border-accent/30 rounded-full hover:border-accent/60 transition-all duration-300"
          >
            Got it
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ── SCALE PHASE ── Show scaled triangle, ask player to identify ratio
  if (phase === "scale") {
    const scaledSides = currentScale.sides;

    return (
      <motion.div
        key={`scale-${roundIdx}-${scaleIdx}`}
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
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="text-center text-sm text-white/50 mb-4">
          Scaled <span className="text-white font-semibold">&times;{currentScale.scaleFactor}</span>{" "}
          &mdash; every side multiplied by {currentScale.scaleFactor}.
        </p>

        {/* SVG: ghost small + solid large */}
        <TriangleSVG
          sides={scaledSides}
          angleName={round.angleName}
          accentHex={ratioColorHex}
          scale={currentScale.scaleFactor}
          ghostSides={round.baseSides}
          showGhost={true}
        />

        {/* Question */}
        <motion.div
          animate={shake ? { x: [0, -8, 8, -8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mt-4 mb-4"
        >
          <p className="text-xs text-white/30 mb-2">{ratioLabel(round.ratio)}</p>
          <p className="text-lg font-bold mb-4">
            <span className={ratioColor}>
              {round.ratio} {round.angleName}
            </span>{" "}
            <span className="text-white/30">=</span>{" "}
            <span className="text-white/40">?</span>
          </p>
        </motion.div>

        {/* Multiple choice fraction buttons */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          {choices.map((c) => {
            const key = `${c.num}/${c.den}`;
            const isSelected = selectedAnswer === key;
            const isCorrect =
              c.num === correctFraction.num && c.den === correctFraction.den;

            return (
              <motion.button
                key={key}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChoice(c)}
                disabled={selectedAnswer !== null}
                className={`py-3 px-4 text-lg font-bold rounded-xl border transition-all duration-200 ${
                  isSelected && isCorrect
                    ? "border-success/60 bg-success/10 text-success"
                    : isSelected && !isCorrect
                      ? "border-danger/60 bg-danger/10 text-danger"
                      : "border-white/[0.1] bg-surface hover:bg-surface-hover text-foreground"
                } disabled:cursor-not-allowed`}
              >
                {c.num}/{c.den}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // ── REVEAL PHASE ── "The ratio is the same!"
  if (phase === "reveal") {
    const unsimplified = correctFraction;
    const simplified = round.simplified;
    const isLastScale = scaleIdx >= round.scales.length - 1;
    const isLastRound = roundIdx >= rounds.length - 1;
    const isFinalReveal = isLastScale && isLastRound;

    return (
      <motion.div
        key={`reveal-${roundIdx}-${scaleIdx}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md mx-auto text-center"
      >
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-white/30">
            Round {roundIdx + 1}/{rounds.length}
          </span>
          <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent/50 rounded-full"
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Simplification animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="my-8"
        >
          <div className="flex items-center justify-center gap-3 text-2xl font-bold mb-4">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-foreground"
            >
              {unsimplified.num}/{unsimplified.den}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/30"
            >
              =
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className={ratioColor}
            >
              {simplified.num}/{simplified.den}
            </motion.span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-success text-lg font-semibold"
          >
            Same ratio!
          </motion.p>
        </motion.div>

        {/* Insight text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          {isFinalReveal ? (
            <div className="my-6 p-4 rounded-xl border border-accent/20 bg-accent/[0.04]">
              <p className="text-sm text-white/70 leading-relaxed">
                Trigonometric ratios depend only on the{" "}
                <span className="text-accent-light font-semibold">angle</span>,
                not the size of the triangle.
              </p>
              <p className="text-xs text-white/30 mt-2">
                Scale the triangle as much as you like &mdash; the ratio
                never changes.
              </p>
            </div>
          ) : (
            <p className="text-sm text-white/40 mb-6">
              The ratio is the same because only the{" "}
              <span className="text-white/60">angle</span> matters, not the
              size.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-4"
        >
          <button
            onClick={advanceFromReveal}
            className="px-8 py-3 text-sm uppercase tracking-[0.1em] font-medium text-accent-light border border-accent/30 rounded-full hover:border-accent/60 transition-all duration-300"
          >
            {isFinalReveal ? "Finish" : "Continue"}
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────
// SVG Triangle Visualization
// ─────────────────────────────────────────────────────────

interface TriangleSVGProps {
  sides: [number, number, number]; // [opp, adj, hyp]
  angleName: string;
  accentHex: string;
  scale: number;
  ghostSides?: [number, number, number];
  showGhost: boolean;
}

function TriangleSVG({
  sides,
  angleName,
  accentHex,
  ghostSides,
  showGhost,
}: TriangleSVGProps) {
  const [opp, adj, hyp] = sides;

  // We draw the triangle so that angle A is at bottom-left.
  // The right angle is at bottom-right.
  // adj = bottom side (horizontal), opp = right side (vertical), hyp = diagonal.

  // Normalize to fit viewBox. Max side drives scaling.
  const maxSide = Math.max(opp, adj);
  const unitScale = 160 / maxSide;

  const A = { x: 30, y: 210 };
  const B = { x: 30 + adj * unitScale, y: 210 };
  const C = { x: 30 + adj * unitScale, y: 210 - opp * unitScale };

  // Ghost (small) triangle if provided
  let gA, gB, gC;
  if (showGhost && ghostSides) {
    const [gOpp, gAdj] = ghostSides;
    gA = { x: 30, y: 210 };
    gB = { x: 30 + gAdj * unitScale, y: 210 };
    gC = { x: 30 + gAdj * unitScale, y: 210 - gOpp * unitScale };
  }

  return (
    <svg viewBox="0 0 280 240" className="w-full max-w-xs mx-auto">
      {/* Ghost (small) triangle */}
      {showGhost && gA && gB && gC && (
        <motion.polygon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          points={`${gA.x},${gA.y} ${gB.x},${gB.y} ${gC.x},${gC.y}`}
          fill="rgba(108,92,231,0.04)"
          stroke="rgba(162,155,254,0.2)"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
      )}

      {/* Main triangle */}
      <motion.polygon
        initial={{ opacity: 0, scale: showGhost ? 0.5 : 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
        fill="rgba(108,92,231,0.06)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
      />

      {/* Right angle indicator at B */}
      <polyline
        points={`${B.x - 12},${B.y} ${B.x - 12},${B.y - 12} ${B.x},${B.y - 12}`}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />

      {/* Angle arc at A (bottom-left) */}
      <circle
        cx={A.x}
        cy={A.y}
        r="16"
        fill={`${accentHex}1A`}
        stroke={`${accentHex}66`}
        strokeWidth="1"
      />
      <text
        x={A.x + 22}
        y={A.y - 10}
        fill={accentHex}
        fontSize="13"
        fontWeight="bold"
      >
        {angleName}
      </text>

      {/* Side labels — bottom (adj) */}
      <text
        x={(A.x + B.x) / 2}
        y={A.y + 20}
        textAnchor="middle"
        fill="#00cec9"
        fontSize="13"
        fontWeight="600"
      >
        {adj}
      </text>

      {/* Right side (opp) */}
      <text
        x={B.x + 16}
        y={(B.y + C.y) / 2 + 4}
        fill="#a29bfe"
        fontSize="13"
        fontWeight="600"
      >
        {opp}
      </text>

      {/* Hypotenuse */}
      <text
        x={(A.x + C.x) / 2 - 18}
        y={(A.y + C.y) / 2 - 4}
        fill="#fdcb6e"
        fontSize="13"
        fontWeight="600"
        textAnchor="middle"
      >
        {hyp}
      </text>

      {/* Ghost side labels (faded) */}
      {showGhost && ghostSides && gA && gB && gC && (
        <>
          <text
            x={(gA.x + gB.x) / 2}
            y={gA.y + 34}
            textAnchor="middle"
            fill="rgba(0,206,201,0.3)"
            fontSize="10"
          >
            {ghostSides[1]}
          </text>
          <text
            x={gB.x + 16}
            y={(gB.y + gC.y) / 2 + 4}
            fill="rgba(162,155,254,0.3)"
            fontSize="10"
          >
            {ghostSides[0]}
          </text>
          <text
            x={(gA.x + gC.x) / 2 - 14}
            y={(gA.y + gC.y) / 2 - 4}
            fill="rgba(253,203,110,0.3)"
            fontSize="10"
            textAnchor="middle"
          >
            {ghostSides[2]}
          </text>
        </>
      )}
    </svg>
  );
}
