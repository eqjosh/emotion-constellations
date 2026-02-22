/**
 * Emotion Constellation — main entry point.
 *
 * Initializes WebGL, loads data, creates the simulation and renderers,
 * wires up interaction handling, and starts the frame loop.
 */

import { createWebGLContext } from './renderer/context.js';
import { loadConstellationData } from './core/data-loader.js';
import { createSimulation } from './simulation/force-layout.js';
import { createAuroraRenderer } from './renderer/aurora.js';
import { createParticleRenderer } from './renderer/particles.js';
import { createConnectionRenderer } from './renderer/connections.js';
import { createPipeline } from './renderer/pipeline.js';
import { createLabelManager } from './ui/labels.js';
import { createSelectionState } from './interaction/selection-state.js';
import { createInputHandler } from './interaction/input-handler.js';
import { createFloatingInquiries } from './ui/floating-inquiries.js';
import { createHudBar } from './ui/hud-bar.js';
import { findHit } from './interaction/hit-test.js';
import { on } from './core/events.js';

async function init() {
  // 1. Create WebGL context
  const context = createWebGLContext('constellation');
  const { gl } = context;

  console.log('WebGL2 context created:', gl.getParameter(gl.VERSION));
  console.log(`Canvas: ${context.width}x${context.height} @ ${context.pixelRatio}x`);

  // 2. Load constellation data
  const data = await loadConstellationData('en');
  console.log(`Loaded: ${data.needs.length} needs, ${data.emotions.length} emotions`);

  // 3. Create simulation
  const sim = createSimulation(data, context.width, context.height);
  console.log('Simulation created and pre-settled');

  // 4. Create renderers
  const auroraRenderer = createAuroraRenderer(gl);
  const particleRenderer = createParticleRenderer(gl, data.emotions.length);
  const connectionRenderer = createConnectionRenderer(gl);

  // 5. Create labels
  const labelContainer = document.getElementById('labels');
  const labels = createLabelManager(labelContainer);
  labels.init(sim.needNodes, sim.emotionNodes);

  // 6. Create interaction system
  const selectionState = createSelectionState(
    sim.emotionNodes, sim.needNodes, sim.needNodesById
  );
  const inputHandler = createInputHandler(context.canvas);
  const floatingInquiries = createFloatingInquiries(labelContainer);
  const hudBar = createHudBar(document.body);

  // 7. Wire input events to selection state
  on('input:tap', ({ x, y }) => {
    const hit = findHit(x, y, sim.emotionNodes, sim.needNodes);
    if (hit.type === 'emotion') {
      selectionState.selectEmotion(hit.node.id);
    } else if (hit.type === 'need') {
      selectionState.selectNeed(hit.node.id);
    } else {
      selectionState.deselect();
    }
  });

  on('input:need-click', ({ id }) => {
    selectionState.selectNeed(id);
  });

  on('input:emotion-click', ({ id }) => {
    selectionState.selectEmotion(id);
  });

  on('input:deselect', () => {
    selectionState.deselect();
  });

  // Hover (desktop only)
  on('input:hover', ({ x, y }) => {
    const hit = findHit(x, y, sim.emotionNodes, sim.needNodes);
    if (hit.type === 'emotion') {
      selectionState.setHover(hit.node.id);
      context.canvas.style.cursor = 'pointer';
    } else if (hit.type === 'need') {
      selectionState.setHover(null);
      context.canvas.style.cursor = 'pointer';
    } else {
      selectionState.setHover(null);
      context.canvas.style.cursor = '';
    }
  });

  on('input:hover-end', () => {
    selectionState.setHover(null);
    context.canvas.style.cursor = '';
  });

  // 8. Handle resize
  context.onResize((width, height) => {
    sim.resize(width, height);
  });

  // 9. Create and start the pipeline
  const pipeline = createPipeline(
    gl, context, sim,
    auroraRenderer, particleRenderer, connectionRenderer,
    labels, selectionState, floatingInquiries
  );

  pipeline.start();
  console.log('Emotion Constellation is alive ✨');
}

// Start
init().catch(err => {
  console.error('Failed to initialize Emotion Constellation:', err);
  document.body.innerHTML = `
    <div style="color: #667; font-family: sans-serif; padding: 2em; text-align: center;">
      <h2>Emotion Constellation</h2>
      <p>Something went wrong initializing the visualization.</p>
      <p style="color: #e06030; font-size: 0.9em;">${err.message}</p>
      <p style="font-size: 0.8em;">This requires WebGL2 support. Try a modern browser.</p>
    </div>
  `;
});
