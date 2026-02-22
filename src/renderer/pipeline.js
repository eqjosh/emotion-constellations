/**
 * Rendering pipeline — orchestrates the frame loop.
 *
 * Each frame:
 * 1. Tick the simulation
 * 2. Tick selection state (advance transitions)
 * 3. Apply selection visuals to node data
 * 4. Upload positions to GPU
 * 5. Clear canvas
 * 6. Draw aurora (need regions)
 * 7. Draw connections (emotion -> need threads)
 * 8. Draw particles (emotion nodes)
 * 9. Update HTML labels
 * 10. Update floating inquiry positions
 */

import { BG_COLOR } from '../core/constants.js';

export function createPipeline(gl, context, sim, auroraRenderer, particleRenderer, connectionRenderer, labels, selectionState, floatingInquiries) {
  let running = false;
  let startTime = 0;
  let lastTimestamp = 0;
  let frameCount = 0;

  function frame(timestamp) {
    if (!running) return;

    const time = (timestamp - startTime) / 1000; // seconds
    const dt = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 0.016;
    lastTimestamp = timestamp;

    // 1. Advance simulation
    sim.tick();

    // 2. Advance selection transitions
    if (selectionState) {
      selectionState.tick(dt);
    }

    // 3. Apply selection visuals to need intensities
    if (selectionState) {
      for (const need of sim.needNodes) {
        need.intensity = selectionState.getNeedIntensity(need);
      }
    }

    // 4. Update aurora renderer with (possibly modified) need data
    auroraRenderer.updateNeeds(sim.needNodes, context.width, context.height);

    // 5. Update particles — apply brightness and size from selection state
    if (selectionState) {
      // Build temporary visuals array with adjusted colors/sizes
      const adjustedEmotions = sim.emotionNodes.map(emotion => {
        const vis = selectionState.getEmotionVisual(emotion);
        return {
          ...emotion,
          displayColor: [
            Math.min(emotion.displayColor[0] * vis.brightness, 1.0),
            Math.min(emotion.displayColor[1] * vis.brightness, 1.0),
            Math.min(emotion.displayColor[2] * vis.brightness, 1.0),
          ],
          displaySize: emotion.displaySize * vis.sizeScale,
        };
      });
      particleRenderer.updateParticles(adjustedEmotions);
    } else {
      particleRenderer.updateParticles(sim.emotionNodes);
    }

    // 6. Update connections — apply opacity from selection state
    const connections = sim.getConnections();
    if (selectionState) {
      for (const conn of connections) {
        conn.opacity = selectionState.getConnectionOpacity(
          conn.emotionId, conn.needId, conn.opacity
        );
      }
    }
    connectionRenderer.updateConnections(connections);

    // 7. Clear to background
    gl.clearColor(BG_COLOR[0], BG_COLOR[1], BG_COLOR[2], BG_COLOR[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 8. Enable additive blending for all layers
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

    // 9. Update HTML labels (throttled to every 2nd frame for perf)
    if (labels && frameCount % 2 === 0) {
      labels.update(sim.needNodes, sim.emotionNodes);
    }

    // 10. Update floating inquiry positions (same throttle cadence)
    if (floatingInquiries && frameCount % 2 === 0) {
      floatingInquiries.updatePositions(sim.emotionNodes, sim.needNodes, sim.needNodesById);
    }

    frameCount++;
    requestAnimationFrame(frame);
  }

  return {
    start() {
      running = true;
      startTime = performance.now();
      lastTimestamp = 0;
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
