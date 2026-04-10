"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-xl"
      >
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          <span className="text-accent-light">Zentri</span>
        </h1>
        <p className="text-xl text-muted mb-8">
          Learn any concept through games. Not quizzes.
        </p>

        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent-light transition-colors">
            Start Playing
          </button>
          <button className="px-6 py-3 bg-surface text-foreground rounded-xl font-medium hover:bg-surface-hover transition-colors border border-surface-hover">
            How it Works
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full"
      >
        {[
          {
            title: "Pick a Topic",
            desc: "Choose from CBSE chapters & concepts",
            icon: "📚",
          },
          {
            title: "Play the Game",
            desc: "Adventure, puzzle, simulation — AI picks the best format",
            icon: "🎮",
          },
          {
            title: "Level Up",
            desc: "Earn XP, maintain streaks, unlock new challenges",
            icon: "⚡",
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.15 }}
            className="bg-surface rounded-2xl p-6 text-left hover:bg-surface-hover transition-colors"
          >
            <span className="text-3xl mb-3 block">{item.icon}</span>
            <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
            <p className="text-muted text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
