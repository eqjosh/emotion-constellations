#version 300 es
precision highp float;

in vec3 v_color;
in float v_pulse;
in vec2 v_texCoord;

uniform float u_time;

out vec4 fragColor;

void main() {
  // Distance from quad center (0 at center, 1 at edge)
  float dist = length(v_texCoord - 0.5) * 2.0;

  // Discard pixels outside the circle for clean edges
  if (dist > 1.0) discard;

  // Soft glow: exponential falloff
  float glow = exp(-dist * dist * 3.0);

  // Bright core: tight, intense center
  float core = exp(-dist * dist * 12.0);

  // Breathing modulation
  float breath = 0.8 + 0.2 * sin(u_time * 0.4 + v_pulse);

  // Color: blend between particle color and white at the core
  vec3 color = mix(v_color, vec3(1.0), core * 0.6);
  color *= glow * breath;

  // Alpha for additive blending
  float alpha = glow * breath;

  fragColor = vec4(color * alpha, alpha);
}
