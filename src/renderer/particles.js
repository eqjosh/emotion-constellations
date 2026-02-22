/**
 * Particle renderer — draws emotion nodes as soft glowing points.
 *
 * Uses instanced rendering: one quad (4 vertices) instanced for each
 * emotion particle. Per-instance attributes carry position, color,
 * size, and breathing phase from the simulation.
 */

import * as twgl from 'twgl.js';
import particleVert from '../shaders/particle.vert';
import particleFrag from '../shaders/particle.frag';
import { PARTICLES } from '../core/constants.js';

export function createParticleRenderer(gl, maxParticles = 64) {
  const programInfo = twgl.createProgramInfo(gl, [particleVert, particleFrag]);

  // Quad corners (shared geometry for all instances)
  const quadCorners = new Float32Array([
    -0.5, -0.5,
     0.5, -0.5,
    -0.5,  0.5,
    -0.5,  0.5,
     0.5, -0.5,
     0.5,  0.5,
  ]);

  // Instance data buffers (updated each frame)
  const instancePositions = new Float32Array(maxParticles * 2);
  const instanceColors = new Float32Array(maxParticles * 3);
  const instanceSizes = new Float32Array(maxParticles);
  const instancePhases = new Float32Array(maxParticles);

  // Initialize phases with random offsets for organic feel
  for (let i = 0; i < maxParticles; i++) {
    instancePhases[i] = Math.random() * Math.PI * 2;
  }

  // Create buffers
  const quadBuffer = twgl.createBufferFromTypedArray(gl, quadCorners);
  const posBuffer = gl.createBuffer();
  const colorBuffer = gl.createBuffer();
  const sizeBuffer = gl.createBuffer();
  const phaseBuffer = gl.createBuffer();

  // Create VAO manually for instanced rendering
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // Quad corners — per-vertex, divisor 0
  const quadLoc = gl.getAttribLocation(programInfo.program, 'a_quadCorner');
  gl.enableVertexAttribArray(quadLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.vertexAttribPointer(quadLoc, 2, gl.FLOAT, false, 0, 0);

  // Position — per-instance, divisor 1
  const posLoc = gl.getAttribLocation(programInfo.program, 'a_position');
  gl.enableVertexAttribArray(posLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(posLoc, 1);

  // Color — per-instance, divisor 1
  const colorLoc = gl.getAttribLocation(programInfo.program, 'a_color');
  gl.enableVertexAttribArray(colorLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(colorLoc, 1);

  // Size — per-instance, divisor 1
  const sizeLoc = gl.getAttribLocation(programInfo.program, 'a_size');
  gl.enableVertexAttribArray(sizeLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
  gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(sizeLoc, 1);

  // Phase — per-instance, divisor 1
  const phaseLoc = gl.getAttribLocation(programInfo.program, 'a_phase');
  gl.enableVertexAttribArray(phaseLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, phaseBuffer);
  gl.vertexAttribPointer(phaseLoc, 1, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(phaseLoc, 1);

  gl.bindVertexArray(null);

  let particleCount = 0;

  return {
    /**
     * Update particle data from simulation.
     * @param {Array} emotions - Emotion nodes with x, y, color, etc.
     */
    updateParticles(emotions) {
      particleCount = Math.min(emotions.length, maxParticles);

      for (let i = 0; i < particleCount; i++) {
        const e = emotions[i];
        instancePositions[i * 2] = e.x;
        instancePositions[i * 2 + 1] = e.y;

        const color = e.displayColor || [0.7, 0.7, 0.7];
        instanceColors[i * 3] = color[0];
        instanceColors[i * 3 + 1] = color[1];
        instanceColors[i * 3 + 2] = color[2];

        instanceSizes[i] = e.displaySize || PARTICLES.baseSize;
      }

      // Upload to GPU
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, instancePositions, gl.DYNAMIC_DRAW);

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, instanceColors, gl.DYNAMIC_DRAW);

      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, instanceSizes, gl.DYNAMIC_DRAW);

      gl.bindBuffer(gl.ARRAY_BUFFER, phaseBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, instancePhases, gl.DYNAMIC_DRAW);
    },

    /**
     * Draw all particles.
     */
    draw(time, displayWidth, displayHeight, pixelRatio) {
      if (particleCount === 0) return;

      gl.useProgram(programInfo.program);
      gl.bindVertexArray(vao);

      twgl.setUniforms(programInfo, {
        u_time: time,
        u_resolution: [displayWidth, displayHeight],
        u_pixelRatio: pixelRatio,
      });

      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, particleCount);
    },

    destroy() {
      gl.deleteProgram(programInfo.program);
      gl.deleteVertexArray(vao);
      gl.deleteBuffer(posBuffer);
      gl.deleteBuffer(colorBuffer);
      gl.deleteBuffer(sizeBuffer);
      gl.deleteBuffer(phaseBuffer);
    },
  };
}
