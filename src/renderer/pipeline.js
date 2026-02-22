/**
 * Rendering pipeline — orchestrates the frame loop.
 *
 * Each frame:
 * 1. Tick the simulation
 * 2. Upload positions to GPU
 * 3. Clear canvas
 * 4. Draw aurora (need regions)
 * 5. Draw connections (emotion → need threads)
 * 6. Draw particles (emotion nodes)
 * 7. Update HTML labels
 */

import { BG_COLOR } from '../core/constants.js';

export function createPipeline(gl, context, sim, auroraRenderer, particleRenderer, connectionRenderer, labels) {
  let running = false;
  let startTime = 0;
  let frameCount = 0;

  function frame(timestamp) {
    if (!running) return;

    const time = (timestamp - startTime) / 1000; // seconds

    // 1. Advance simulation
    sim.tick();

    // 2. Update renderer data from simulation
    auroraRenderer.updateNeeds(sim.needNodes, context.width, context.height);
    particleRenderer.updateParticles(sim.emotionNodes);
    connectionRenderer.updateConnections(sim.getConnections());

    // 3. Clear to background
    gl.clearColor(BG_COLOR[0], BG_COLOR[1], BG_COLOR[2], BG_COLOR[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 4. Enable additive blending for all layers
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);

    // Aurora: pure additive
    gl.blendFunc(gl.ONE, gl.ONE);
    auroraRenderer.draw(time, context.bufferWidth, context.bufferHeight);

    // Connections: additive with alpha
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    connectionRenderer.draw(time, context.width, context.height, context.pixelRatio);

    // Particles: additive with alpha (drawn on top)
    particleRenderer.draw(time, context.width, context.height, context.pixelRatio);

    // 5. Update HTML labels (throttled to every 2nd frame for perf)
    if (labels && frameCount % 2 === 0) {
      labels.update(sim.needNodes, sim.emotionNodes);
    }

    frameCount++;
    requestAnimationFrame(frame);
  }

  return {
    start() {
      running = true;
      startTime = performance.now();
      requestAnimationFrame(frame);
    },

    stop() {
      running = false;
    },

    get isRunning() {
      return running;
    },
  };
}
