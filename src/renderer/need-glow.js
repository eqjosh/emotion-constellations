/**
 * Need glow renderer — soft radial gradient behind each need.
 *
 * Draws instanced quads with a gaussian falloff to create
 * nebula-like "regions" around each need. Rendered BEFORE the
 * aurora pass so it sits behind everything, creating a sense
 * of place for each need.
 */

import * as twgl from 'twgl.js';
import needGlowVert from '../shaders/need-glow.vert';
import needGlowFrag from '../shaders/need-glow.frag';
import { NEED_GLOW } from '../core/constants.js';

export function createNeedGlowRenderer(gl, maxNeeds = 6) {
  const programInfo = twgl.createProgramInfo(gl, [needGlowVert, needGlowFrag]);

  // Quad geometry (shared across instances)
  const quadData = new Float32Array([
    -0.5, -0.5,
     0.5, -0.5,
    -0.5,  0.5,
    -0.5,  0.5,
     0.5, -0.5,
     0.5,  0.5,
  ]);

  // Instance buffers
  const positions = new Float32Array(maxNeeds * 2);
  const colors = new Float32Array(maxNeeds * 3);
  const opacities = new Float32Array(maxNeeds);

  // Create buffers manually for instanced rendering
  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, quadData, gl.STATIC_DRAW);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);

  const opacityBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, opacities, gl.DYNAMIC_DRAW);

  // VAO setup
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // Quad corners (per-vertex, divisor 0)
  const quadLoc = gl.getAttribLocation(programInfo.program, 'a_quadCorner');
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.enableVertexAttribArray(quadLoc);
  gl.vertexAttribPointer(quadLoc, 2, gl.FLOAT, false, 0, 0);

  // Position (per-instance, divisor 1)
  const posLoc = gl.getAttribLocation(programInfo.program, 'a_position');
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(posLoc, 1);

  // Color (per-instance, divisor 1)
  const colorLoc = gl.getAttribLocation(programInfo.program, 'a_color');
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.enableVertexAttribArray(colorLoc);
  gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(colorLoc, 1);

  // Opacity (per-instance, divisor 1)
  const opacityLoc = gl.getAttribLocation(programInfo.program, 'a_opacity');
  gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer);
  gl.enableVertexAttribArray(opacityLoc);
  gl.vertexAttribPointer(opacityLoc, 1, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(opacityLoc, 1);

  gl.bindVertexArray(null);

  let needCount = 0;

  return {
    /**
     * Update need glow data from simulation.
     * @param {Array} needs - Need nodes with positions, colors, intensity
     */
    updateNeeds(needs) {
      needCount = Math.min(needs.length, maxNeeds);

      for (let i = 0; i < needCount; i++) {
        const need = needs[i];
        // Use fixed positions (fx/fy)
        positions[i * 2] = need.fx ?? need.x;
        positions[i * 2 + 1] = need.fy ?? need.y;

        // Use primary color for the glow
        const color = need.color || [0.3, 0.3, 0.3];
        colors[i * 3] = color[0];
        colors[i * 3 + 1] = color[1];
        colors[i * 3 + 2] = color[2];

        // Opacity modulated by selection intensity
        // intensity is 1.0 at idle, ~1.8 when selected, ~0.15 when dimmed
        const intensity = need.intensity ?? 1.0;
        let opacity;
        if (intensity > 1.2) {
          // Selected — brighter glow
          opacity = NEED_GLOW.selectedOpacity;
        } else if (intensity < 0.5) {
          // Dimmed — very subtle
          opacity = NEED_GLOW.dimmedOpacity;
        } else {
          // Idle
          opacity = NEED_GLOW.baseOpacity;
        }
        opacities[i] = opacity;
      }

      // Upload to GPU
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, colors);

      gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, opacities);
    },

    /**
     * Draw the need glows.
     */
    draw(time, displayWidth, displayHeight, pixelRatio) {
      if (needCount === 0) return;

      gl.useProgram(programInfo.program);
      gl.bindVertexArray(vao);

      twgl.setUniforms(programInfo, {
        u_resolution: [displayWidth * pixelRatio, displayHeight * pixelRatio],
        u_time: time,
        u_pixelRatio: pixelRatio,
        u_radius: NEED_GLOW.radius,
      });

      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, needCount);
      gl.bindVertexArray(null);
    },

    destroy() {
      gl.deleteProgram(programInfo.program);
      gl.deleteBuffer(quadBuffer);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(colorBuffer);
      gl.deleteBuffer(opacityBuffer);
      gl.deleteVertexArray(vao);
    },
  };
}
