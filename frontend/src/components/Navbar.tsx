"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-500 ${
        scrolled
          ? "bg-[rgba(15,15,19,0.85)] backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <span className="text-lg font-bold tracking-tight text-foreground">
        Zentri
      </span>

      <button className="text-sm text-white/70 px-5 py-2 rounded-full border border-white/[0.12] hover:border-white/[0.25] hover:text-white transition-all duration-300">
        Sign In
      </button>
    </motion.nav>
  );
}
