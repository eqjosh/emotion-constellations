#version 300 es
precision highp float;

in vec3 v_color;
in float v_opacity;
in vec2 v_texCoord;

out vec4 fragColor;

void main() {
  // Distance from quad center (0 at center, 1 at edge)
  float dist = length(v_texCoord - 0.5) * 2.0;

  // Discard pixels outside the circle
  if (dist > 1.0) discard;

  // Very soft radial falloff — gaussian-like
  float glow = exp(-dist * dist * 2.5);

  // Apply opacity and color
  float alpha = glow * v_opacity;
  vec3 color = v_color * alpha;

  fragColor = vec4(color, alpha);
}
