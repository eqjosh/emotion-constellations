/**
 * Rendering pipeline — orchestrates the frame loop.
 *
 * Each frame:
 * 1. Tick the simulation
 * 2. Tick selection state (advance transitions)
 * 3. Tick entry animation
 * 4. Apply selection + entry visuals to node data
 * 5. Update aurora positions
 * 6. Update particles (brightness/size from selection)
 * 7. Update connections (opacity from selection)
 * 8. Clear canvas
 * 9. Draw aurora (need regions, pure additive)
 * 10. Draw connections (additive with alpha)
 * 11. Draw particles (additive with alpha, on top)
 * 12. Update HTML labels
 * 13. Update floating inquiry positions
 * 14. Update wisdom icon position
 */

import { BG_COLOR } from '../core/constants.js';

export function createPipeline(gl, context, sim, auroraRenderer, particleRenderer, connectionRenderer, labels, selectionState, floatingInquiries, entryAnimation, wisdomPanel) {
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

    // 3. Advance entry animation
    const entryActive = entryAnimation && !entryAnimation.isComplete;
    if (entryActive) {
      entryAnimation.tick(timestamp);
    }

    // 4. Apply selection visuals to need intensities
    if (selectionState) {
      for (let i = 0; i < sim.needNodes.length; i++) {
        const need = sim.needNodes[i];
        let intensity = selectionState.getNeedIntensity(need);

        // During entry, modulate need intensity by fade-in progress
        if (entryActive) {
          intensity *= entryAnimation.getNeedOpacity(i);
        }
        need.intensity = intensity;
      }
    }

    // 5. Update aurora renderer with (possibly modified) need data
    auroraRenderer.updateNeeds(sim.needNodes, context.width, context.height);

    // 7. Update particles — apply brightness and size from selection state + entry
    if (selectionState) {
      const adjustedEmotions = sim.emotionNodes.map((emotion, idx) => {
        const vis = selectionState.getEmotionVisual(emotion);
        const entryMul = entryActive ? entryAnimation.getEmotionOpacityAt(idx) : 1.0;
        return {
          ...emotion,
          displayColor: [
            Math.min(emotion.displayColor[0] * vis.brightness * entryMul, 1.0),
            Math.min(emotion.displayColor[1] * vis.brightness * entryMul, 1.0),
            Math.min(emotion.displayColor[2] * vis.brightness * entryMul, 1.0),
          ],
          displaySize: emotion.displaySize * vis.sizeScale * (entryActive ? Math.max(0.3, entryMul) : 1.0),
        };
      });
      particleRenderer.updateParticles(adjustedEmotions);
    } else {
      particleRenderer.updateParticles(sim.emotionNodes);
    }

    // 8. Update connections — apply opacity from selection state + entry
    const connectionOpacity = entryActive ? entryAnimation.getConnectionOpacity() : 1.0;
    const connections = sim.getConnections();
    if (selectionState) {
      for (const conn of connections) {
        conn.opacity = selectionState.getConnectionOpacity(
          conn.emotionId, conn.needId, conn.opacity
        ) * connectionOpacity;
      }
    } else {
      for (const conn of connections) {
        conn.opacity *= connectionOpacity;
      }
    }
    connectionRenderer.updateConnections(connections);

    // 9. Clear to background
    gl.clearColor(BG_COLOR[0], BG_COLOR[1], BG_COLOR[2], BG_COLOR[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 10. Enable additive blending for all layers
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

    // 11. Update HTML labels (throttled to every 2nd frame for perf)
    if (labels && frameCount % 2 === 0) {
      labels.update(sim.needNodes, sim.emotionNodes);

      // During entry, modulate label opacity (per-need and per-emotion)
      if (entryActive) {
        labels.setEntryOpacities(
          (index) => entryAnimation.getNeedOpacity(index),
          (index) => entryAnimation.getEmotionOpacityAt(index)
        );
      }
    }

    // 12. Update floating inquiry positions (same throttle cadence)
    if (floatingInquiries && frameCount % 2 === 0) {
      floatingInquiries.updatePositions(sim.emotionNodes, sim.needNodes, sim.needNodesById);
    }

    // 13. Update wisdom icon position
    if (wisdomPanel && frameCount % 2 === 0) {
      wisdomPanel.updateIconPosition(sim.emotionNodes);
    }

    frameCount++;
    requestAnimationFrame(frame);
  }

  return {
    start() {
      running = true;
      startTime = performance.now();
      lastTimestamp = 0;

      // Initialize entry animation
      if (entryAnimation) {
        entryAnimation.init(startTime, sim.needNodes.length, sim.emotionNodes.length);
      }

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
