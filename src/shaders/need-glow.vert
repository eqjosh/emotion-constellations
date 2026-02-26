#version 300 es

// Per-vertex (quad corners)
in vec2 a_quadCorner;      // [-0.5, -0.5] to [0.5, 0.5]

// Per-instance (one per need)
in vec2 a_position;        // need position in pixels
in vec3 a_color;           // need primary color
in float a_opacity;        // center opacity (modulated by selection state)

uniform vec2 u_resolution; // canvas size in pixels
uniform float u_time;
uniform float u_pixelRatio;
uniform float u_radius;    // glow radius in CSS pixels

out vec3 v_color;
out float v_opacity;
out vec2 v_texCoord;

void main() {
  // Gentle breathing for organic feel
  float breath = 1.0 + 0.05 * sin(u_time * 0.2 + float(gl_InstanceID) * 1.7);
  float size = u_radius * breath * u_pixelRatio;

  // Billboard quad in pixel space
  vec2 pixelPos = a_position + a_quadCorner * size * 2.0;

  // Convert to clip space
  vec2 clipPos = (pixelPos / u_resolution) * 2.0 - 1.0;
  clipPos.y = -clipPos.y; // flip Y for WebGL

  gl_Position = vec4(clipPos, 0.0, 1.0);

  v_color = a_color;
  v_opacity = a_opacity;
  v_texCoord = a_quadCorner + 0.5; // remap to 0..1
}
