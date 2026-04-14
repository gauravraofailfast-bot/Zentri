"use client";

import { motion } from "framer-motion";

interface WorldIconProps {
  worldId: string;
  className?: string;
  isComplete?: boolean;
}

function TriangleLabIcon({ isComplete }: { isComplete: boolean }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-8 h-8"
    >
      {/* Right triangle */}
      <motion.path
        d="M6 26 L6 8 L26 26 Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ rotate: 0, scale: 1 }}
        animate={{
          rotate: [0, 3, 0, -3, 0],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "center" }}
      />
      {/* Right-angle marker */}
      <motion.path
        d="M6 21 L11 21 L11 26"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Small measurement tick marks */}
      <motion.g
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <line x1="3" y1="12" x2="5" y2="12" strokeWidth="1" />
        <line x1="3" y1="16" x2="5" y2="16" strokeWidth="1" />
        <line x1="3" y1="20" x2="5" y2="20" strokeWidth="1" />
      </motion.g>
      {isComplete && (
        <motion.circle
          cx="26"
          cy="6"
          r="3"
          fill="currentColor"
          stroke="none"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      )}
    </svg>
  );
}

function SacredAnglesIcon({ isComplete }: { isComplete: boolean }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-8 h-8"
    >
      {/* Outer gem shape */}
      <motion.path
        d="M16 3 L26 12 L22 28 L10 28 L6 12 Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Inner facet lines */}
      <motion.g
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <line x1="16" y1="3" x2="10" y2="28" />
        <line x1="16" y1="3" x2="22" y2="28" />
        <line x1="6" y1="12" x2="26" y2="12" />
      </motion.g>
      {/* Pulsing glow — subtle scale on center facet */}
      <motion.path
        d="M16 3 L6 12 L16 12 L26 12 Z"
        strokeWidth="1"
        initial={{ opacity: 0.15 }}
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        fill="currentColor"
      />
      {isComplete && (
        <motion.circle
          cx="26"
          cy="4"
          r="3"
          fill="currentColor"
          stroke="none"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      )}
    </svg>
  );
}

function IdentityForgeIcon({ isComplete }: { isComplete: boolean }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-8 h-8"
    >
      {/* Large gear */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ transformOrigin: "11px 16px" }}
      >
        <circle cx="11" cy="16" r="5" />
        {/* Gear teeth */}
        <line x1="11" y1="9" x2="11" y2="11" strokeWidth="2" strokeLinecap="round" />
        <line x1="11" y1="21" x2="11" y2="23" strokeWidth="2" strokeLinecap="round" />
        <line x1="4" y1="16" x2="6" y2="16" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="16" x2="18" y2="16" strokeWidth="2" strokeLinecap="round" />
        <line x1="6.05" y1="11.05" x2="7.46" y2="12.46" strokeWidth="2" strokeLinecap="round" />
        <line x1="14.54" y1="19.54" x2="15.95" y2="20.95" strokeWidth="2" strokeLinecap="round" />
        <line x1="6.05" y1="20.95" x2="7.46" y2="19.54" strokeWidth="2" strokeLinecap="round" />
        <line x1="14.54" y1="12.46" x2="15.95" y2="11.05" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
      {/* Small gear — counter-rotating */}
      <motion.g
        animate={{ rotate: -360 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ transformOrigin: "23px 13px" }}
      >
        <circle cx="23" cy="13" r="3.5" />
        <line x1="23" y1="8" x2="23" y2="9.5" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="23" y1="16.5" x2="23" y2="18" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="13" x2="19.5" y2="13" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="26.5" y1="13" x2="28" y2="13" strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>
      {/* Equals sign beneath gears */}
      <motion.g
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <line x1="19" y1="24" x2="28" y2="24" strokeLinecap="round" />
        <line x1="19" y1="27.5" x2="28" y2="27.5" strokeLinecap="round" />
      </motion.g>
      {isComplete && (
        <motion.circle
          cx="28"
          cy="4"
          r="3"
          fill="currentColor"
          stroke="none"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      )}
    </svg>
  );
}

function HeightSeekerIcon({ isComplete }: { isComplete: boolean }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-8 h-8"
    >
      {/* Tower / building */}
      <rect x="10" y="6" width="8" height="22" rx="1" strokeLinejoin="round" />
      {/* Tower windows */}
      <rect x="12" y="9" width="4" height="3" rx="0.5" strokeWidth="1" />
      <rect x="12" y="15" width="4" height="3" rx="0.5" strokeWidth="1" />
      <rect x="12" y="21" width="4" height="3" rx="0.5" strokeWidth="1" />
      {/* Antenna */}
      <line x1="14" y1="3" x2="14" y2="6" strokeLinecap="round" />
      {/* Ground line */}
      <line x1="5" y1="28" x2="27" y2="28" strokeLinecap="round" />
      {/* Measurement line — animated dash drawing */}
      <motion.line
        x1="23"
        y1="6"
        x2="23"
        y2="28"
        strokeDasharray="22"
        initial={{ strokeDashoffset: 22 }}
        animate={{ strokeDashoffset: [22, 0, 0, 22] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.7, 1],
        }}
        strokeWidth="1"
      />
      {/* Measurement arrows */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.7, 1],
        }}
      >
        {/* Top arrow */}
        <path d="M21.5 7.5 L23 6 L24.5 7.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" />
        {/* Bottom arrow */}
        <path d="M21.5 26.5 L23 28 L24.5 26.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" />
      </motion.g>
      {/* Dashed sight line from top */}
      <motion.line
        x1="5"
        y1="28"
        x2="14"
        y2="3"
        strokeDasharray="3 3"
        strokeWidth="0.75"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0.4, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.7, 1],
          delay: 0.5,
        }}
      />
      {isComplete && (
        <motion.circle
          cx="27"
          cy="4"
          r="3"
          fill="currentColor"
          stroke="none"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      )}
    </svg>
  );
}

const iconMap: Record<string, React.FC<{ isComplete: boolean }>> = {
  "triangle-lab": TriangleLabIcon,
  "sacred-angles": SacredAnglesIcon,
  "identity-forge": IdentityForgeIcon,
  "height-seeker": HeightSeekerIcon,
};

export default function WorldIcon({
  worldId,
  className = "",
  isComplete = false,
}: WorldIconProps) {
  const Icon = iconMap[worldId];

  if (!Icon) {
    return null;
  }

  return (
    <div
      className={`inline-flex items-center justify-center ${
        isComplete ? "text-emerald-400" : "text-current"
      } ${className}`}
    >
      <Icon isComplete={isComplete} />
    </div>
  );
}
