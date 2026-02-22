/**
 * Visual and physics constants for the Emotion Constellation.
 * Tuning these values changes the feel of the entire visualization.
 */

// Background — deep space, almost black with a hint of midnight blue
export const BG_COLOR = [0.02, 0.025, 0.065, 1.0]; // deeper, darker space

// Need colors — rich, saturated tones for the aurora regions
// Inspired by Northern Lights: deep magentas, teals, ambers — never washed out
export const NEED_COLORS = {
  meaning:     { primary: [0.35, 0.08, 0.50], secondary: [0.58, 0.22, 0.80] },  // rich violet/magenta
  belonging:   { primary: [0.60, 0.42, 0.05], secondary: [0.88, 0.68, 0.15] },  // deep amber/gold
  achievement: { primary: [0.60, 0.18, 0.08], secondary: [0.92, 0.35, 0.15] },  // rich coral/vermillion
  safety:      { primary: [0.08, 0.20, 0.48], secondary: [0.18, 0.38, 0.85] },  // deep indigo
  autonomy:    { primary: [0.03, 0.45, 0.45], secondary: [0.12, 0.80, 0.82] },  // teal/cyan
  growth:      { primary: [0.08, 0.45, 0.14], secondary: [0.18, 0.82, 0.30] },  // emerald
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
  baseOpacity: 0.35,        // visible at rest — brighter against dark aurora
  activeOpacity: 0.8,       // bright when selected
  width: 3.0,               // thread width in pixels (wider for visibility)
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
  driftStrength: 0.20,      // gentle cosmic drift — slow orbital motion
  driftSpeed: 0.18,         // how fast the drift field rotates (radians per second)
  warmupTicks: 120,         // pre-settle before first render
};

// Layout
export const LAYOUT = {
  needRingRadius: 0.35,     // fraction of min(width, height) for need positions (wider spread)
  needRingOffset: 0.3,      // angular offset in radians for organic feel
};
