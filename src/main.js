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
import { createWisdomPanel } from './ui/wisdom-panel.js';
import { createEntryAnimation } from './core/entry-animation.js';
import { createSubscriptionGate } from './ui/subscription-gate.js';
import { createHelpIcon } from './ui/help-icon.js';
import { createLanguageSelector } from './ui/language-selector.js';
import { findHit } from './interaction/hit-test.js';
import { on, emit } from './core/events.js';
import { initLocale, getLocale } from './core/locale.js';
import { t } from './core/ui-strings.js';

const VERIFY_ENDPOINT = import.meta.env.VITE_VERIFY_ENDPOINT
  || 'https://us-central1-emotion-rules-quiz.cloudfunctions.net/constellationVerifyToken';

/**
 * Check the URL for a ?verify_token= param on load.
 * If found, call the verification endpoint, and if valid, mark the user as subscribed.
 * Shows a brief "Access Granted" overlay so the user knows verification succeeded.
 */
async function handleVerificationToken() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('verify_token');
  if (!token) return;

  // Clean the token from the URL immediately (before any async work)
  const cleanUrl = window.location.pathname + window.location.hash;
  window.history.replaceState({}, '', cleanUrl);

  // Only call if it looks like a valid token (64 hex chars)
  if (!/^[0-9a-f]{64}$/.test(token)) return;

  try {
    const response = await fetch(VERIFY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();

    if (data.success) {
      // Write subscription state so the gate initializes as bypassed
      try {
        localStorage.setItem('constellation_sub', JSON.stringify({
          subscribed: true,
          subscribedAt: Date.now(),
          verifiedViaEmail: true,
        }));
      } catch { /* ignore */ }

      // Show a brief "Access Granted" overlay
      showVerificationSuccess();
    }
    // If invalid/expired, we just continue silently — the gate will still show when thresholds hit
  } catch (err) {
    console.warn('Token verification failed:', err.message);
  }
}

function showVerificationSuccess() {
  const overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'display:flex', 'align-items:center', 'justify-content:center',
    'background:rgba(13,10,26,0.92)', 'z-index:9999', 'opacity:0',
    'transition:opacity 0.4s ease',
  ].join(';');

  const card = document.createElement('div');
  card.style.cssText = 'text-align:center;';

  const star = document.createElement('div');
  star.style.cssText = 'font-size:36px;color:#a78bfa;margin-bottom:16px;';
  star.textContent = '✦';

  const heading = document.createElement('h2');
  heading.style.cssText = 'font-size:24px;font-weight:600;color:#e8e0ff;margin:0 0 8px;';
  heading.textContent = 'Access Granted';

  const sub = document.createElement('p');
  sub.style.cssText = 'font-size:15px;color:#9d8ec0;margin:0;';
  sub.textContent = 'Welcome to the Emotion Constellation.';

  card.appendChild(star);
  card.appendChild(heading);
  card.appendChild(sub);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => { overlay.style.opacity = '1'; });
  setTimeout(() => {
    overlay.style.opacity = '0';
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  }, 2200);
}

async function init() {
  // 0a. Check for email verification token in the URL (magic link flow)
  await handleVerificationToken();

  // 0b. Initialize locale (detect from browser or localStorage)
  const locale = initLocale();
  console.log(`Locale: ${locale}`);

  // 1. Create WebGL context
  const context = createWebGLContext('constellation');
  const { gl } = context;

  console.log('WebGL2 context created:', gl.getParameter(gl.VERSION));
  console.log(`Canvas: ${context.width}x${context.height} @ ${context.pixelRatio}x`);

  // 2. Load constellation data (locale-aware with English fallback)
  const data = await loadConstellationData(locale);
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
  const wisdomPanel = createWisdomPanel(document.body);

  // 7. Create entry animation & subscription gate
  const entryAnimation = createEntryAnimation();
  const subscriptionGate = createSubscriptionGate();
  subscriptionGate.init();

  // 7b. Create help icon (windrose) and language selector
  const helpIcon = createHelpIcon(document.body);
  const languageSelector = createLanguageSelector(document.body);

  // 7c. Create copyright line (rotated left edge)
  const copyrightEl = document.createElement('div');
  copyrightEl.className = 'copyright-line';
  function updateCopyright() {
    const raw = t('copyright.line');
    copyrightEl.innerHTML = raw
      .replace('{author}', '<a href="https://jmfreedman.com" target="_blank" rel="noopener">Joshua Freedman</a>')
      .replace('{book}', '<a href="https://emotionrules.com" target="_blank" rel="noopener">Emotion Rules</a>')
      .replace('{tool}', 'Claude')
      + `\u00a0\u00a0|\u00a0\u00a0<button class="copyright-about-btn" type="button">${t('about.btnLabel')}</button>`;
  }
  updateCopyright();
  document.body.appendChild(copyrightEl);

  // Wire About button — use event delegation so it survives updateCopyright() re-renders
  copyrightEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('copyright-about-btn')) {
      e.stopPropagation();
      emit('about:open', {});
    }
  });

  // 8. Wire input events to selection state
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

  // 8b. Pause/resume ambient rotation on selection
  on('selection:changed', (data) => {
    if (data.mode === 'idle') {
      sim.resumeRotation();
    } else {
      sim.pauseRotation();
    }
  });

  // 8c. Locale change — reload data and refresh ALL text
  on('locale:changed', async ({ locale: newLocale }) => {
    console.log(`Locale changed to: ${newLocale}`);
    try {
      const newData = await loadConstellationData(newLocale);

      // Update need nodes: label + description
      for (const need of newData.needs) {
        const simNeed = sim.needNodes.find(n => n.id === need.id);
        if (simNeed) {
          simNeed.label = need.label;
          simNeed.description = need.description;
        }
      }

      // Update emotion nodes: label + link inquiry text
      for (const emotion of newData.emotions) {
        const simEmotion = sim.emotionNodes.find(e => e.id === emotion.id);
        if (simEmotion) {
          simEmotion.label = emotion.label;
          // Update inquiry text in links
          for (const newLink of emotion.links) {
            const simLink = simEmotion.links.find(l => l.needId === newLink.needId);
            if (simLink) simLink.inquiry = newLink.inquiry;
          }
        }
      }

      // Re-render labels
      labels.updateLabels(sim.needNodes, sim.emotionNodes);
      // Update help icon tooltip and copyright line
      helpIcon.updateLocale();
      updateCopyright();

      // If something is currently selected, re-trigger selection so
      // HUD bar, floating inquiries, and wisdom panel refresh with new text
      if (selectionState.mode === 'emotion') {
        selectionState.selectEmotion(selectionState.selectedId);
      } else if (selectionState.mode === 'need') {
        selectionState.selectNeed(selectionState.selectedId);
      }
    } catch (err) {
      console.warn('Failed to reload data for locale:', err);
    }
  });

  // 9. Handle resize
  context.onResize((width, height) => {
    sim.resize(width, height);
  });

  // 10. Create and start the pipeline
  const pipeline = createPipeline(
    gl, context, sim,
    auroraRenderer, particleRenderer, connectionRenderer,
    labels, selectionState, floatingInquiries,
    entryAnimation, wisdomPanel
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
