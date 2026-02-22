/**
 * Connection renderer — draws luminous threads between emotions and needs.
 *
 * Each connection is a thin quad (instanced) with soft edges and
 * a subtle shimmer. Additive blending makes overlapping threads
 * accumulate light naturally.
 */

import * as twgl from 'twgl.js';
import connectionVert from '../shaders/connection.vert';
import connectionFrag from '../shaders/connection.frag';
import { CONNECTIONS } from '../core/constants.js';

export function createConnectionRenderer(gl, maxConnections = 128) {
  const programInfo = twgl.createProgramInfo(gl, [connectionVert, connectionFrag]);

  // Quad template — thin rectangle, 6 vertices (2 triangles)
  // x: 0..1 along connection length, y: -0.5..0.5 across width
  const quadCorners = new Float32Array([
    0.0, -0.5,
    1.0, -0.5,
    0.0,  0.5,
    0.0,  0.5,
    1.0, -0.5,
    1.0,  0.5,
  ]);

  // Instance data
  const startPositions = new Float32Array(maxConnections * 2);
  const endPositions = new Float32Array(maxConnections * 2);
  const colors = new Float32Array(maxConnections * 3);
  const opacities = new Float32Array(maxConnections);

  // Create buffers
  const quadBuffer = twgl.createBufferFromTypedArray(gl, quadCorners);
  const startBuffer = gl.createBuffer();
  const endBuffer = gl.createBuffer();
  const colorBuffer = gl.createBuffer();
  const opacityBuffer = gl.createBuffer();

  // VAO
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // Quad corners — per vertex
  const quadLoc = gl.getAttribLocation(programInfo.program, 'a_quadCorner');
  gl.enableVertexAttribArray(quadLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.vertexAttribPointer(quadLoc, 2, gl.FLOAT, false, 0, 0);

  // Start position — per instance
  const startLoc = gl.getAttribLocation(programInfo.program, 'a_startPos');
  gl.enableVertexAttribArray(startLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, startBuffer);
  gl.vertexAttribPointer(startLoc, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(startLoc, 1);

  // End position — per instance
  const endLoc = gl.getAttribLocation(programInfo.program, 'a_endPos');
  gl.enableVertexAttribArray(endLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, endBuffer);
  gl.vertexAttribPointer(endLoc, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(endLoc, 1);

  // Color — per instance
  const colorLoc = gl.getAttribLocation(programInfo.program, 'a_color');
  gl.enableVertexAttribArray(colorLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(colorLoc, 1);

  // Opacity — per instance
  const opacityLoc = gl.getAttribLocation(programInfo.program, 'a_opacity');
  gl.enableVertexAttribArray(opacityLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer);
  gl.vertexAttribPointer(opacityLoc, 1, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(opacityLoc, 1);

  gl.bindVertexArray(null);

  let connectionCount = 0;

  return {
    /**
     * Update connection data from simulation.
     * @param {Array} links - Array of { startX, startY, endX, endY, color, opacity }
     */
    updateConnections(links) {
      connectionCount = Math.min(links.length, maxConnections);

      for (let i = 0; i < connectionCount; i++) {
        const link = links[i];
        startPositions[i * 2] = link.startX;
        startPositions[i * 2 + 1] = link.startY;
        endPositions[i * 2] = link.endX;
        endPositions[i * 2 + 1] = link.endY;

        const color = link.color || [0.5, 0.5, 0.5];
        colors[i * 3] = color[0];
        colors[i * 3 + 1] = color[1];
        colors[i * 3 + 2] = color[2];

        opacities[i] = link.opacity ?? CONNECTIONS.baseOpacity;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, startBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, startPositions, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, endBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, endPositions, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, opacities, gl.DYNAMIC_DRAW);
    },

    draw(time, displayWidth, displayHeight, pixelRatio) {
      if (connectionCount === 0) return;

      gl.useProgram(programInfo.program);
      gl.bindVertexArray(vao);

      twgl.setUniforms(programInfo, {
        u_time: time,
        u_resolution: [displayWidth, displayHeight],
        u_lineWidth: CONNECTIONS.width,
        u_pixelRatio: pixelRatio,
      });

      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, connectionCount);
    },

    destroy() {
      gl.deleteProgram(programInfo.program);
      gl.deleteVertexArray(vao);
    },
  };
}
