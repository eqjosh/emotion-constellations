/**
 * Visual and physics constants for the Emotion Constellation.
 * Tuning these values changes the feel of the entire visualization.
 */

// Background
export const BG_COLOR = [0.039, 0.055, 0.102, 1.0]; // #0a0e1a

// Need colors — deep, atmospheric tones for the aurora regions
// These will be the nebula/curtain colors
export const NEED_COLORS = {
  meaning:     { primary: [0.29, 0.10, 0.42], secondary: [0.53, 0.27, 0.73] },  // deep purple/violet
  belonging:   { primary: [0.55, 0.41, 0.08], secondary: [0.83, 0.66, 0.20] },  // warm amber/gold
  achievement: { primary: [0.55, 0.23, 0.10], secondary: [0.88, 0.38, 0.19] },  // warm coral/orange
  safety:      { primary: [0.10, 0.23, 0.42], secondary: [0.20, 0.40, 0.80] },  // deep blue/indigo
  autonomy:    { primary: [0.05, 0.42, 0.43], secondary: [0.17, 0.77, 0.79] },  // teal/cyan
  growth:      { primary: [0.10, 0.42, 0.16], secondary: [0.20, 0.80, 0.33] },  // green/emerald
};

// Aurora shader tuning
export const AURORA = {
  driftSpeed: 0.12,         // how fast the aurora curtains drift (lower = more contemplative)
  breathSpeed: 0.25,        // breathing rhythm speed
  breathDepth: 0.15,        // how much the breathing modulates intensity (0-1)
  curtainStretchX: 4.0,     // horizontal noise frequency (higher = more vertical bands)
  curtainStretchY: 0.7,     // vertical noise scale (lower = taller curtains)
  falloffSharpness: 2.5,    // how tightly aurora clusters around need positions
  intensity: 0.35,          // overall aurora brightness (subtle, not overwhelming)
  fbmOctaves: 4,            // noise detail layers (reduce on mobile for performance)
};

// Particle rendering
export const PARTICLES = {
  baseSize: 28,             // base particle radius in pixels (increased for visibility)
  glowFalloff: 3.0,         // exponential falloff for soft glow
  coreBrightness: 0.6,      // how much white is mixed into the core
  coreSharpness: 12.0,      // how tight the bright core is
  breathSpeed: 0.4,         // individual particle breathing speed
  breathDepth: 0.2,         // particle breathing intensity variation
};

// Connection threads
export const CONNECTIONS = {
  baseOpacity: 0.25,        // visible at rest (increased)
  activeOpacity: 0.7,       // bright when selected
  width: 2.5,               // thread width in pixels
  shimmerSpeed: 2.0,        // subtle shimmer animation speed
};

// Physics simulation
export const PHYSICS = {
  gravityStrength: 0.08,    // base gravitational pull toward needs
  collisionRadiusEmotion: 14,
  collisionRadiusNeed: 50,
  collisionStrength: 0.7,
  centeringStrength: 0.015,
  chargeStrength: -30,      // repulsion between emotion nodes
  chargeMaxDistance: 200,
  velocityDecay: 0.4,       // high friction = "floating in warm water"
  alphaDecay: 0.0005,       // very slow decay — simulation stays alive
  alphaTarget: 0.008,       // tiny residual energy for perpetual breathing
  perturbation: 0.08,       // random micro-drift amplitude
  warmupTicks: 120,         // pre-settle before first render
};

// Layout
export const LAYOUT = {
  needRingRadius: 0.35,     // fraction of min(width, height) for need positions (wider spread)
  needRingOffset: 0.3,      // angular offset in radians for organic feel
};
