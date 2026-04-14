"use client";

/**
 * Custom SVG line-art icons for each level.
 * Minimal, single-stroke, premium style. No emojis.
 */

interface IconProps {
  className?: string;
}

function Icon({ className = "", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-4 h-4 ${className}`}
    >
      {children}
    </svg>
  );
}

/** Triangle with labeled sides */
export function IconNameSides(props: IconProps) {
  return (
    <Icon {...props}>
      <polygon points="4,20 20,20 20,6" />
      <line x1="20" y1="17" x2="20" y2="20" strokeWidth="0" />
      <rect x="17" y="17" width="3" height="3" fill="none" strokeWidth="1" />
    </Icon>
  );
}

/** Fraction / ratio */
export function IconRatioBuilder(props: IconProps) {
  return (
    <Icon {...props}>
      <line x1="6" y1="12" x2="18" y2="12" />
      <text x="12" y="9" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">a</text>
      <text x="12" y="19" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">b</text>
    </Icon>
  );
}

/** Chain links */
export function IconRatioChain(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </Icon>
  );
}

/** Scaling arrows */
export function IconScale(props: IconProps) {
  return (
    <Icon {...props}>
      <polygon points="6,18 14,18 14,10" strokeDasharray="2,2" opacity="0.4" />
      <polygon points="4,20 20,20 20,6" />
    </Icon>
  );
}

/** Crystal / gem — 45 degree */
export function IconCrystal45(props: IconProps) {
  return (
    <Icon {...props}>
      <polygon points="12,2 20,10 12,22 4,10" />
      <line x1="4" y1="10" x2="20" y2="10" />
      <line x1="12" y1="2" x2="12" y2="22" opacity="0.3" />
    </Icon>
  );
}

/** Double crystal — 30/60 */
export function IconCrystal3060(props: IconProps) {
  return (
    <Icon {...props}>
      <polygon points="8,3 14,11 8,19 2,11" />
      <polygon points="16,5 22,13 16,21 10,13" opacity="0.5" />
    </Icon>
  );
}

/** Cracked stone — edge cases */
export function IconCracked(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3 L10 8 L13 12 L10 16 L12 21" />
    </Icon>
  );
}

/** Lightning bolt — speed */
export function IconSpeed(props: IconProps) {
  return (
    <Icon {...props}>
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="none" />
    </Icon>
  );
}

/** Magnifying glass — detective */
export function IconDetective(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
      <text x="11" y="14" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" fontWeight="bold">?</text>
    </Icon>
  );
}

/** Equals sign in circle — identity */
export function IconIdentity(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="16" y2="14" />
    </Icon>
  );
}

/** Double equals — more identities */
export function IconIdentity2(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="7" y1="9" x2="17" y2="9" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="7" y1="15" x2="17" y2="15" />
    </Icon>
  );
}

/** Balance scale — equation balancer */
export function IconBalance(props: IconProps) {
  return (
    <Icon {...props}>
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="4" y1="21" x2="20" y2="21" />
      <line x1="4" y1="8" x2="20" y2="8" />
      <path d="M4 8 L6 14 L10 14 L12 8" />
      <path d="M12 8 L14 14 L18 14 L20 8" />
    </Icon>
  );
}

/** Tower with person */
export function IconTower(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="9" y="4" width="6" height="16" rx="1" />
      <rect x="11" y="7" width="2" height="2" opacity="0.4" />
      <rect x="11" y="11" width="2" height="2" opacity="0.4" />
      <circle cx="12" cy="3" r="1.5" />
      <line x1="3" y1="20" x2="21" y2="20" />
    </Icon>
  );
}

/** Ladder at angle */
export function IconLadder(props: IconProps) {
  return (
    <Icon {...props}>
      <line x1="6" y1="20" x2="16" y2="4" />
      <line x1="10" y1="20" x2="20" y2="4" />
      <line x1="7.5" y1="16" x2="11.5" y2="16" />
      <line x1="9" y1="12" x2="13" y2="12" />
      <line x1="10.5" y1="8" x2="14.5" y2="8" />
    </Icon>
  );
}

/** Person with height marker */
export function IconObserver(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="8" cy="6" r="2.5" />
      <line x1="8" y1="8.5" x2="8" y2="16" />
      <line x1="5" y1="11" x2="11" y2="11" />
      <line x1="6" y1="20" x2="8" y2="16" />
      <line x1="10" y1="20" x2="8" y2="16" />
      <line x1="18" y1="4" x2="18" y2="20" strokeDasharray="2,2" />
      <line x1="16" y1="4" x2="20" y2="4" />
      <line x1="16" y1="20" x2="20" y2="20" />
    </Icon>
  );
}

/** Stacked blocks */
export function IconStacked(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="7" y="10" width="10" height="10" rx="1" />
      <rect x="9" y="4" width="6" height="6" rx="1" />
      <line x1="3" y1="20" x2="21" y2="20" />
    </Icon>
  );
}

/** Sun with shadow */
export function IconShadow(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="16" cy="6" r="3" />
      <line x1="16" y1="1" x2="16" y2="2" />
      <line x1="21" y1="6" x2="20" y2="6" />
      <line x1="19" y1="3" x2="18.3" y2="3.7" />
      <rect x="5" y="12" width="4" height="8" rx="1" />
      <line x1="3" y1="20" x2="15" y2="20" opacity="0.4" />
      <line x1="3" y1="20" x2="21" y2="20" />
    </Icon>
  );
}

/** Camera viewfinder */
export function IconCamera(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </Icon>
  );
}

/** Map level ID to icon component */
const iconMap: Record<string, React.ComponentType<IconProps>> = {
  "name-the-sides": IconNameSides,
  "ratio-builder": IconRatioBuilder,
  "ratio-chain": IconRatioChain,
  "size-doesnt-matter": IconScale,
  "the-45-stone": IconCrystal45,
  "the-30-60-stones": IconCrystal3060,
  "edge-stones": IconCracked,
  "speed-recall": IconSpeed,
  "angle-detective": IconDetective,
  "first-law": IconIdentity,
  "other-two-laws": IconIdentity2,
  "equation-balancer": IconBalance,
  "tower-rescue": IconTower,
  "ladder-mission": IconLadder,
  "dont-forget-height": IconObserver,
  "stacked-objects": IconStacked,
  "shadow-hunter": IconShadow,
  "the-real-world": IconCamera,
};

export function LevelIcon({ levelId, className }: { levelId: string; className?: string }) {
  const IconComponent = iconMap[levelId];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
}
