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
  baseSize: 24,             // slightly smaller for denser 39-emotion field
  glowFalloff: 3.0,         // exponential falloff for soft glow
  coreBrightness: 0.6,      // how much white is mixed into the core
  coreSharpness: 12.0,      // how tight the bright core is
  breathSpeed: 0.4,         // individual particle breathing speed
  breathDepth: 0.2,         // particle breathing intensity variation
};

// Connection threads
export const CONNECTIONS = {
  baseOpacity: 0.30,        // slightly lower for denser field
  activeOpacity: 0.8,       // bright when selected
  dimmedOpacity: 0.04,      // nearly invisible when unrelated
  width: 3.0,               // slightly thinner for denser field
  shimmerSpeed: 2.0,        // subtle shimmer animation speed
};

// Physics simulation
export const PHYSICS = {
  gravityStrength: 0.03,    // softer gravity for 45-node field
  collisionRadiusEmotion: 10, // tighter collision for dense field
  collisionRadiusNeed: 35,  // reduced — 6 needs at 60° need less padding
  collisionStrength: 0.7,
  centeringStrength: 0.012, // slightly stronger to contain 39 emotions
  chargeStrength: -50,      // stronger repulsion for 39 emotions
  chargeMaxDistance: 280,    // wider repulsion range
  velocityDecay: 0.25,      // less friction — stars coast further after impulse
  alphaDecay: 0.0003,       // very slow decay — simulation stays alive
  alphaTarget: 0.03,        // much higher residual energy for visible motion
  perturbation: 0.20,       // slightly reduced to keep dense field calmer
  driftStrength: 0.40,      // slightly reduced for dense field
  driftSpeed: 0.12,         // slightly slower for graceful arcs
  warmupTicks: 180,         // more warmup for 45-node field to settle
};

// Layout
export const LAYOUT = {
  needRingRadius: 0.36,     // fraction of min(width, height) — wider spread for 6 needs
  needHorizontalStretch: 1.25, // stretch the ring wider on the X axis
  needRingOffset: 0.3,      // angular offset in radians for organic feel
  centerXOffset: -0.10,     // shift constellation center left by 10% of width (room for right panel)
};

// Interaction
export const INTERACTION = {
  transitionDuration: 650,      // ms for selection transitions (organic, unhurried)
  hitRadiusEmotion: 32,         // CSS px — generous for touch/dense field
  hitRadiusNeed: 65,            // CSS px — slightly tighter for 6 needs
  selectedBrightness: 1.6,      // brightness multiplier for selected node
  selectedSizeScale: 1.4,       // size multiplier for selected emotion
  relatedBrightness: 1.2,       // brightness for fellow messengers
  dimmedBrightness: 0.12,       // much stronger dimming for unrelated nodes
  dimmedSizeScale: 0.75,        // smaller unrelated emotions
  selectedNeedIntensity: 1.8,   // aurora intensity for selected/linked need
  dimmedNeedIntensity: 0.15,    // aurora nearly invisible for unrelated needs
  hoverBrightness: 1.15,        // subtle brightness on hover
  hoverSizeScale: 1.1,          // subtle size increase on hover
};

// Entry animation
export const ENTRY = {
  needsFadeInDuration: 800,     // ms for needs to fade in
  needsStagger: 100,            // ms between each need appearing
  emotionDelay: 800,            // ms after needs start before emotions begin
  emotionWave1Duration: 1200,   // ms for first wave of emotions to drift in
  emotionWave2Delay: 1300,      // ms after wave 1 starts before wave 2 begins
  emotionWave2Duration: 1200,   // ms for second wave to drift in
  // Total emotion reveal: ~2.5s (wave1 starts at 800ms, wave2 ends at ~3300ms)
  connectionDelay: 3500,        // ms before connection threads fade in
  connectionFadeDuration: 1000, // ms for connections to reach idle opacity
  hintDelay: 4800,              // ms before "tap to explore" hint appears
  hintDuration: 3000,           // ms hint is visible before fading out
};

// Ambient rotation
export const ROTATION = {
  speed: 0.001,                 // radians per second (~0.6 degrees per 10s)
  resumeEaseDuration: 1000,     // ms to ease back to rotation after selection clears
};
