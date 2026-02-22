/**
 * Aurora renderer — draws the need-region nebula/curtain effect.
 *
 * Renders a fullscreen quad with a fragment shader that creates
 * Northern Lights-like curtains of colored light anchored to
 * need positions. Uses additive blending so overlapping needs
 * blend naturally.
 */

import * as twgl from 'twgl.js';
import auroraVert from '../shaders/aurora.vert';
import auroraFrag from '../shaders/aurora.frag';

export function createAuroraRenderer(gl) {
  // Compile shader program
  const programInfo = twgl.createProgramInfo(gl, [auroraVert, auroraFrag]);

  // Fullscreen quad — no vertex buffer needed, positions generated from gl_VertexID
  // But TWGL wants a VAO, so we create an empty one
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
    // Dummy attribute — TWGL needs at least one
    position: { numComponents: 2, data: [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1] },
  });
  const vao = twgl.createVAOFromBufferInfo(gl, programInfo, bufferInfo);

  // Uniform state — updated each frame
  const uniforms = {
    u_time: 0,
    u_resolution: [0, 0],
    u_needCount: 0,
    u_needPositions: new Float32Array(12),   // 6 needs × 2 components
    u_needColors: new Float32Array(18),       // 6 needs × 3 components
    u_needIntensities: new Float32Array(6),   // 6 needs × 1
  };

  return {
    /**
     * Update need data for the shader.
     * @param {Array} needs - Need nodes with positions and colors
     * @param {number} canvasWidth - Display width
     * @param {number} canvasHeight - Display height
     */
    updateNeeds(needs, canvasWidth, canvasHeight) {
      uniforms.u_needCount = needs.length;

      for (let i = 0; i < needs.length && i < 6; i++) {
        // Convert simulation coordinates to 0..1 UV space
        uniforms.u_needPositions[i * 2]     = needs[i].x / canvasWidth;
        uniforms.u_needPositions[i * 2 + 1] = 1.0 - (needs[i].y / canvasHeight); // flip Y

        // Colors
        const color = needs[i].color || [0.3, 0.3, 0.3];
        uniforms.u_needColors[i * 3]     = color[0];
        uniforms.u_needColors[i * 3 + 1] = color[1];
        uniforms.u_needColors[i * 3 + 2] = color[2];

        // Intensity (1.0 = normal, can be increased on selection)
        uniforms.u_needIntensities[i] = needs[i].intensity ?? 1.0;
      }
    },

    /**
     * Draw the aurora effect.
     * @param {number} time - Elapsed time in seconds
     * @param {number} bufferWidth - Render buffer width (pixels × dpr)
     * @param {number} bufferHeight - Render buffer height (pixels × dpr)
     */
    draw(time, bufferWidth, bufferHeight) {
      uniforms.u_time = time;
      uniforms.u_resolution[0] = bufferWidth;
      uniforms.u_resolution[1] = bufferHeight;

      gl.useProgram(programInfo.program);
      gl.bindVertexArray(vao);
      twgl.setUniforms(programInfo, uniforms);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },

    destroy() {
      gl.deleteProgram(programInfo.program);
    },
  };
}
