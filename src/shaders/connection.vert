#version 300 es

// Connection threads rendered as sinusoidal instanced strips.
// Each instance is one connection (emotion → need), subdivided into
// many segments so the sine wave displacement is visible.

// Per-vertex: which point in the strip
in vec2 a_quadCorner;      // x: 0..1 along length, y: -0.5..0.5 across width

// Per-instance
in vec2 a_startPos;        // emotion position (pixels)
in vec2 a_endPos;          // need position (pixels)
in vec3 a_color;           // thread color
in float a_opacity;        // base opacity
in float a_seed;           // unique phase offset for this connection

uniform vec2 u_resolution;
uniform float u_lineWidth;  // width in pixels
uniform float u_pixelRatio;
uniform float u_time;

out vec3 v_color;
out float v_alpha;
out float v_edgeDist;      // -1 to 1 across width, for soft edges
out float v_along;          // 0..1 along the connection, for shimmer

void main() {
  float t = a_quadCorner.x; // 0..1 along the connection

  // Direction and perpendicular
  vec2 dir = a_endPos - a_startPos;
  float len = length(dir);
  vec2 forward = dir / max(len, 0.001);
  vec2 perp = vec2(-forward.y, forward.x);

  // Sinusoidal displacement — perpendicular to the connection direction.
  // Amplitude scales with connection length (longer = bigger wave),
  // tapers to zero at endpoints for smooth attachment.
  float endTaper = sin(t * 3.14159); // zero at both ends, max at middle
  float waveFreq = 2.5; // ~2.5 full waves along the thread
  float waveSpeed = 0.6; // slow undulation
  float amplitude = len * 0.04 * endTaper; // 4% of length, tapered

  // Two overlapping sine waves for organic feel (not perfectly periodic)
  float wave = sin(t * waveFreq * 6.28318 + a_seed + u_time * waveSpeed)
             + 0.4 * sin(t * waveFreq * 2.0 * 6.28318 + a_seed * 1.7 + u_time * waveSpeed * 0.7);
  wave *= 0.7; // normalize back a bit

  float sineOffset = wave * amplitude;

  // Position along the connection with sine displacement
  vec2 pos = mix(a_startPos, a_endPos, t);
  pos += perp * sineOffset;

  // Width variation along the thread:
  // Thin at endpoints (1px), thick in the middle (up to lineWidth),
  // with gentle sinusoidal modulation for organic "breathing" feel
  float widthTaper = sin(t * 3.14159); // 0 at ends, 1 at middle
  widthTaper = 0.3 + 0.7 * widthTaper; // range: 0.3..1.0 (never fully vanish)
  float widthBreath = 0.85 + 0.15 * sin(t * 8.0 + a_seed * 2.3 + u_time * 0.4);
  float halfWidth = u_lineWidth * u_pixelRatio * 0.5 * widthTaper * widthBreath;
  pos += perp * a_quadCorner.y * halfWidth * 2.0;

  // To clip space
  vec2 clipPos = (pos / u_resolution) * 2.0 - 1.0;
  clipPos.y = -clipPos.y;

  gl_Position = vec4(clipPos, 0.0, 1.0);

  v_color = a_color;
  v_alpha = a_opacity;
  v_edgeDist = a_quadCorner.y * 2.0; // -1 to 1
  v_along = t;
}
