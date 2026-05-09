"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Statically reflect the two curricula that exist in Supabase
const subjects = [
  {
    id: "class10-math-standard",
    name: "Class 10 Mathematics (Standard)",
    detail: "14 chapters · 159 PYQs",
  },
  {
    id: "class10-math-basic",
    name: "Class 10 Mathematics (Basic)",
    detail: "14 chapters · 211 PYQs",
  },
];

export default function SubjectBrowser() {
  return (
    <section className="py-32 md:py-44 px-6">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center text-2xl md:text-3xl font-semibold tracking-tight mb-16 md:mb-20"
      >
        What do you want to play?
      </motion.h2>

      <div className="max-w-xl mx-auto">
        <div className="h-px bg-white/[0.08]" />

        {subjects.map((subject, i) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Link
              href={`/explore/${subject.id}`}
              className="group w-full flex items-center justify-between py-5 md:py-6 text-left transition-all duration-300"
            >
              <span className="text-base md:text-lg text-white/60 group-hover:text-foreground group-hover:translate-x-2 transition-all duration-300">
                {subject.name}
              </span>
              <span className="flex items-center gap-2 text-sm text-white/40 group-hover:text-white/50 transition-all duration-300">
                <span>{subject.detail}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  &rarr;
                </span>
              </span>
            </Link>
            <div className="h-px bg-white/[0.06]" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
