"use client";

import { motion } from "framer-motion";

const levels = [
  { num: 1, title: "First Light", status: "complete" as const },
  { num: 2, title: "Water Hunt", status: "current" as const },
  { num: 3, title: "Carbon Trap", status: "locked" as const },
  { num: 4, title: "Sugar Factory", status: "locked" as const },
  { num: 5, title: "Full Bloom", status: "locked" as const },
];

export default function GamePreview() {
  return (
    <section className="py-32 md:py-44 px-6">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center text-sm uppercase tracking-[0.2em] text-white/30 mb-16"
      >
        A game built by AI
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-lg mx-auto"
      >
        {/* Game card */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-surface/60 backdrop-blur-sm overflow-hidden">
          {/* Top accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

          <div className="p-8 md:p-10">
            {/* Game header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-accent-light/60 mb-1.5">
                  Class 8 &middot; Science
                </p>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  Photosynthesis Quest
                </h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-full border border-success/30 text-success bg-success/[0.08]">
                Adventure
              </span>
            </div>

            {/* Story hook */}
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              &ldquo;A plant is dying. You have 5 days to save it. Collect
              sunlight, find water, and avoid the shade — or it won&rsquo;t
              survive.&rdquo;
            </p>

            {/* Level progress */}
            <div className="space-y-2.5 mb-8">
              {levels.map((level, i) => (
                <motion.div
                  key={level.num}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className={`flex items-center gap-3 text-sm py-2 px-3 rounded-lg transition-colors duration-300 ${
                    level.status === "complete"
                      ? "text-white/60"
                      : level.status === "current"
                        ? "text-foreground bg-white/[0.04]"
                        : "text-white/25"
                  }`}
                >
                  {/* Status indicator */}
                  <span className="w-5 text-center flex-shrink-0">
                    {level.status === "complete" && (
                      <span className="text-success">&#10003;</span>
                    )}
                    {level.status === "current" && (
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="inline-block w-1.5 h-1.5 rounded-full bg-accent-light"
                      />
                    )}
                    {level.status === "locked" && (
                      <span className="text-white/20">&#9679;</span>
                    )}
                  </span>

                  <span className="font-mono text-[11px] text-white/25 w-6">
                    {level.num}
                  </span>
                  <span>{level.title}</span>

                  {level.status === "locked" && (
                    <span className="ml-auto text-[10px] text-white/15">
                      locked
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* XP & Streak bar */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/40">
                  XP{" "}
                  <span className="text-accent-light font-semibold">120</span>
                </span>
                <span className="text-xs text-white/40">
                  Streak{" "}
                  <span className="text-warning font-semibold">3 days</span>
                </span>
              </div>
              <span className="text-xs text-white/20">1 of 5 complete</span>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        </div>
      </motion.div>

      {/* Caption */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center text-sm text-white/30 mt-8 max-w-md mx-auto"
      >
        This isn&rsquo;t a mock-up. It&rsquo;s a real game our AI built from a
        Class 8 Science chapter.
      </motion.p>
    </section>
  );
}
