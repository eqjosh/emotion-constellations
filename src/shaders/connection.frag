#version 300 es
precision highp float;

in vec3 v_color;
in float v_alpha;
in float v_edgeDist;
in float v_along;

uniform float u_time;

out vec4 fragColor;

void main() {
  // Soft edge falloff — sharp center, gentle fade
  float edge = 1.0 - abs(v_edgeDist);
  edge = pow(edge, 2.0); // slightly wider bright core (was 2.5)

  // Subtle shimmer along the thread
  float shimmer = 0.90 + 0.10 * sin(u_time * 1.5 + v_along * 12.0);

  // Fade at endpoints for smooth attachment
  float endFade = smoothstep(0.0, 0.08, v_along) * smoothstep(1.0, 0.92, v_along);

  float alpha = edge * v_alpha * shimmer * endFade;

  // Blend toward white at the core for luminous thread appearance
  vec3 luminousColor = mix(v_color, vec3(1.0), 0.35);

  fragColor = vec4(luminousColor * alpha, alpha);
}
