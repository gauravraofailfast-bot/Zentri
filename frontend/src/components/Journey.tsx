"use client";

import { motion } from "framer-motion";

const steps = [
  {
    label: "You pick a topic",
    quote: '"Photosynthesis, Chapter 4"',
    detail: "From your CBSE syllabus — any class, any subject.",
  },
  {
    label: "AI turns it into a game",
    quote:
      '"Help a plant survive 5 days by collecting sunlight and water. Avoid the shade."',
    detail: "Adventure, puzzle, simulation — the AI picks the best format.",
  },
  {
    label: "You learn without realising",
    quote:
      '"You just learned the light reaction, carbon fixation, and chlorophyll function."',
    detail: "Concepts stick because you experienced them, not memorised them.",
  },
];

export default function Journey() {
  return (
    <section className="relative py-32 md:py-44 px-6">
      {/* Section title */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center text-sm uppercase tracking-[0.2em] text-white/30 mb-24 md:mb-32"
      >
        How it works
      </motion.p>

      <div className="max-w-xl mx-auto space-y-24 md:space-y-32">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
            className="relative"
          >
            {/* Step number — subtle */}
            <span className="text-xs font-mono text-white/15 uppercase tracking-widest mb-4 block">
              0{i + 1}
            </span>

            {/* Step label */}
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 text-foreground">
              {step.label}
            </h3>

            {/* Quote — the storytelling element */}
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="text-lg md:text-xl text-accent-light/70 italic leading-relaxed mb-3 pl-4 border-l-2 border-accent/20"
            >
              {step.quote}
            </motion.p>

            {/* Detail */}
            <p className="text-sm text-white/40 pl-4">{step.detail}</p>

            {/* Connecting line to next step */}
            {i < steps.length - 1 && (
              <div className="absolute left-0 -bottom-14 md:-bottom-18 h-8 md:h-12 w-px bg-gradient-to-b from-white/10 to-transparent" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
