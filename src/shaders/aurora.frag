#version 300 es
precision highp float;

#include "./noise/simplex3d.glsl"
#include "./noise/fbm.glsl"

in vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform int u_needCount;

// Max 6 needs — arrays must have compile-time size in GLSL
uniform vec2 u_needPositions[6];
uniform vec3 u_needColors[6];
uniform float u_needIntensities[6];

out vec4 fragColor;

/**
 * Aurora curtain effect for a single need region.
 *
 * Creates vertically-striated bands of light (like Northern Lights)
 * anchored to a need position, with soft Gaussian falloff.
 *
 * The anisotropic noise sampling (stretched X, compressed Y) is what
 * creates the "curtain" rather than a "blob" — the key visual identity.
 */
float auroraCurtain(vec2 uv, vec2 center, float time, float index) {
  // Distance falloff — tighter Gaussian for more focused, less washy aurora
  vec2 delta = uv - center;
  float dist = length(delta);
  float falloff = exp(-dist * dist * 2.8);

  // Anisotropic noise coordinates:
  // High X frequency → many vertical bands (curtain striations)
  // Low Y frequency → tall, smooth vertical structure
  vec2 noiseCoord = vec2(
    uv.x * 5.0 + index * 3.7,   // more vertical bands for richer texture
    uv.y * 0.6
  );

  // Primary curtain shape — slow drift
  float n1 = fbm(vec3(noiseCoord, time * 0.12 + index * 10.0), 4);

  // Secondary detail layer — different scale, slower
  float n2 = fbm(vec3(noiseCoord * 2.3, time * 0.07 + index * 20.0 + 100.0), 3);

  // Tertiary: very large scale slow movement for overall shape variation
  float n3 = snoise(vec3(uv * 0.8, time * 0.04 + index * 5.0));

  // Combine layers
  float curtain = n1 * 0.55 + n2 * 0.3 + n3 * 0.15;

  // Remap from [-1,1] to [0,1] with stronger contrast — darker darks, vivid brights
  curtain = curtain * 0.5 + 0.5;
  curtain = pow(curtain, 2.2); // steeper contrast: more dark space, brighter peaks

  // Vertical gradient — aurora curtains tend to be brighter in the upper portion
  float verticalBias = smoothstep(0.0, 0.5, uv.y) * 0.3 + 0.7;

  // Breathing — gentle sinusoidal modulation unique to each need
  float breath = 0.85 + 0.15 * sin(time * 0.25 + index * 2.094);

  return curtain * falloff * verticalBias * breath;
}

/**
 * Ambient aurora — colored curtains that drift across the entire field,
 * not anchored to any specific need. Adds depth and the classic
 * Northern Lights palette (green, purple) to the spaces between needs.
 */
float ambientAurora(vec2 uv, float time, float indexOffset) {
  // Wide, slow-moving curtain that covers much of the canvas
  vec2 noiseCoord = vec2(
    uv.x * 3.5 + 50.0 + indexOffset * 17.0,
    uv.y * 0.5 + indexOffset * 8.0
  );

  // Very slow primary shape
  float n1 = fbm(vec3(noiseCoord, time * 0.06 + indexOffset * 30.0), 3);
  // Secondary detail
  float n2 = snoise(vec3(noiseCoord * 1.8, time * 0.04 + 200.0 + indexOffset * 50.0));

  float curtain = n1 * 0.65 + n2 * 0.35;
  curtain = curtain * 0.5 + 0.5;
  curtain = pow(curtain, 2.6); // contrasty — mostly dark, occasional bright bands

  // Gentle vertical bias
  float verticalBias = smoothstep(0.0, 0.6, uv.y) * 0.4 + 0.6;

  // Very slow breathing — different phase per layer
  float breath = 0.8 + 0.2 * sin(time * 0.12 + 7.0 + indexOffset * 4.0);

  return curtain * verticalBias * breath;
}

void main() {
  vec2 uv = v_uv;

  vec3 color = vec3(0.0);

  // === Ambient green/teal aurora — classic Northern Lights backdrop ===
  float greenIntensity = ambientAurora(uv, u_time, 0.0);
  vec3 greenDeep = vec3(0.03, 0.18, 0.12);
  vec3 greenBright = vec3(0.10, 0.50, 0.30);
  vec3 greenColor = mix(greenDeep, greenBright, greenIntensity * 0.6);
  color += greenColor * greenIntensity * 0.55;

  for (int i = 0; i < 6; i++) {
    if (i >= u_needCount) break;

    float intensity = auroraCurtain(uv, u_needPositions[i], u_time, float(i));
    intensity *= u_needIntensities[i];

    // Use deep saturated color; at peak intensity, blend toward a slightly brighter version
    // but NOT toward white — keep the hue rich like Northern Lights
    vec3 deepColor = u_needColors[i] * 0.9;
    vec3 brightColor = u_needColors[i] * 1.5; // saturated, vivid, not white
    vec3 needColor = mix(deepColor, brightColor, intensity * 0.5);

    // Moderate multiplier: rich aurora glow but dark enough for threads to show
    color += needColor * intensity * 0.45;
  }

  // Clamp — rich color but prevent wash-out at overlaps
  color = min(color, vec3(0.85));

  // Stronger vignette to deepen edges
  float vignette = 1.0 - 0.45 * pow(length(v_uv - 0.5) * 1.4, 2.0);
  color *= vignette;

  fragColor = vec4(color, 1.0);
}
