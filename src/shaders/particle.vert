#version 300 es

// Per-vertex (quad corners)
in vec2 a_quadCorner;      // [-0.5, -0.5] to [0.5, 0.5]

// Per-instance (one per emotion particle)
in vec2 a_position;        // simulation position in pixels
in vec3 a_color;           // particle color (blended from need colors)
in float a_size;           // particle radius in pixels
in float a_phase;          // breathing phase offset

uniform vec2 u_resolution; // canvas size in pixels
uniform float u_time;
uniform float u_pixelRatio;

out vec3 v_color;
out float v_pulse;
out vec2 v_texCoord;

void main() {
  // Breathing modulation per particle
  float breath = 1.0 + 0.15 * sin(u_time * 0.4 + a_phase);
  float size = a_size * breath * u_pixelRatio;

  // Billboard quad in pixel space
  vec2 pixelPos = a_position + a_quadCorner * size * 2.0;

  // Convert to clip space
  vec2 clipPos = (pixelPos / u_resolution) * 2.0 - 1.0;
  clipPos.y = -clipPos.y; // flip Y for WebGL

  gl_Position = vec4(clipPos, 0.0, 1.0);

  v_color = a_color;
  v_pulse = a_phase;
  v_texCoord = a_quadCorner + 0.5; // remap to 0..1
}
