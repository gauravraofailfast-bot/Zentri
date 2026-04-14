"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Subtle radial glow — very faint, not a "gradient background" */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-2xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          Your CBSE chapters,{" "}
          <br />
          <span className="text-accent-light">turned into games.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          className="space-y-1 mb-10"
        >
          <p className="text-base sm:text-lg md:text-xl text-white/60">
            Class 8 Science becomes a survival quest.
          </p>
          <p className="text-base sm:text-lg md:text-xl text-white/60">
            Class 10 Math becomes a puzzle challenge.
          </p>
          <p className="text-base sm:text-lg md:text-xl text-white/50 mt-2">
            AI builds it. You play it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        >
          <Link
            href="/trigquest"
            className="group relative inline-block px-8 py-3.5 text-sm uppercase tracking-[0.15em] font-medium text-accent-light border border-accent/30 rounded-full hover:border-accent/60 hover:shadow-[0_0_30px_rgba(108,92,231,0.15)] transition-all duration-500"
          >
            Play a Math Game
            <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-white/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
