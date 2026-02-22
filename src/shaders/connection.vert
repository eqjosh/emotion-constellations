#version 300 es

// Connection threads rendered as thin instanced quads.
// Each instance is one connection (emotion → need).

// Per-vertex: which corner of the thin quad
in vec2 a_quadCorner;      // x: 0..1 along length, y: -0.5..0.5 across width

// Per-instance
in vec2 a_startPos;        // emotion position (pixels)
in vec2 a_endPos;          // need position (pixels)
in vec3 a_color;           // thread color
in float a_opacity;        // base opacity

uniform vec2 u_resolution;
uniform float u_lineWidth;  // width in pixels
uniform float u_pixelRatio;

out vec3 v_color;
out float v_alpha;
out float v_edgeDist;      // -1 to 1 across width, for soft edges
out float v_along;          // 0..1 along the connection, for shimmer

void main() {
  // Direction and perpendicular
  vec2 dir = a_endPos - a_startPos;
  float len = length(dir);
  vec2 forward = dir / max(len, 0.001);
  vec2 perp = vec2(-forward.y, forward.x);

  // Position along the connection
  vec2 pos = mix(a_startPos, a_endPos, a_quadCorner.x);

  // Offset perpendicular for width
  float halfWidth = u_lineWidth * u_pixelRatio * 0.5;
  pos += perp * a_quadCorner.y * halfWidth * 2.0;

  // To clip space
  vec2 clipPos = (pos / u_resolution) * 2.0 - 1.0;
  clipPos.y = -clipPos.y;

  gl_Position = vec4(clipPos, 0.0, 1.0);

  v_color = a_color;
  v_alpha = a_opacity;
  v_edgeDist = a_quadCorner.y * 2.0; // -1 to 1
  v_along = a_quadCorner.x;
}
