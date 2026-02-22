/**
 * Emotion Constellation — main entry point.
 *
 * Initializes WebGL, loads data, creates the simulation and renderers,
 * and starts the frame loop.
 */

import { createWebGLContext } from './renderer/context.js';
import { loadConstellationData } from './core/data-loader.js';
import { createSimulation } from './simulation/force-layout.js';
import { createAuroraRenderer } from './renderer/aurora.js';
import { createParticleRenderer } from './renderer/particles.js';
import { createConnectionRenderer } from './renderer/connections.js';
import { createPipeline } from './renderer/pipeline.js';
import { createLabelManager } from './ui/labels.js';

async function init() {
  // 1. Create WebGL context
  const context = createWebGLContext('constellation');
  const { gl } = context;

  console.log('WebGL2 context created:', gl.getParameter(gl.VERSION));
  console.log(`Canvas: ${context.width}×${context.height} @ ${context.pixelRatio}x`);

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

  // 6. Handle resize
  context.onResize((width, height) => {
    sim.resize(width, height);
  });

  // 7. Create and start the pipeline
  const pipeline = createPipeline(
    gl, context, sim,
    auroraRenderer, particleRenderer, connectionRenderer,
    labels
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
