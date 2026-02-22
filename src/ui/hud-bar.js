/**
 * HUD bar — subtle bottom navigation pills.
 *
 * Persistent but invisible zone at screen bottom. On selection, shows
 * floating pills: need name colored pills, fellow messenger chips,
 * or linked emotion pills. No background, no border, no box —
 * just a flex layout that fades in.
 *
 * Subscribes to 'selection:changed' events internally.
 * Fellow messenger / emotion name pills are clickable for navigation.
 */

import { on, emit } from '../core/events.js';

export function createHudBar(parentContainer) {
  // Create the bar element
  const bar = document.createElement('div');
  bar.className = 'hud-bar';
  bar.setAttribute('role', 'navigation');
  bar.setAttribute('aria-label', 'Emotion navigation');
  parentContainer.appendChild(bar);

  let unsubscribe = null;
  let isVisible = false;

  // --- Helpers ---

  function toCSS([r, g, b]) {
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  }

  function formatLabel(id) {
    return id.charAt(0).toUpperCase() + id.slice(1);
  }

  // --- Content builders ---

  function showEmotion(data) {
    const { id, emotion, inquiries = [], fellowMessengers = [] } = data;
    if (!emotion) return;

    let html = '';

    // Title
    html += `<span class="hud-bar__title">${emotion.label}</span>`;

    // Need pills
    html += '<div class="hud-bar__pills">';
    for (const inq of inquiries) {
      const color = toCSS(inq.needColor);
      html += `<button class="hud-bar__pill hud-bar__pill--need" style="--pill-color: ${color}" data-need-id="${inq.needId}">${inq.needLabel}</button>`;
    }

    // Fellow messenger pills
    for (const fellowId of fellowMessengers) {
      html += `<button class="hud-bar__pill hud-bar__pill--fellow" data-emotion-id="${fellowId}">${formatLabel(fellowId)}</button>`;
    }
    html += '</div>';

    bar.innerHTML = html;
    wireEvents();
    show();
  }

  function showNeed(data) {
    const { id, need, needEmotions = [] } = data;
    if (!need) return;

    const needColor = toCSS(need.colorSecondary || need.color);

    let html = '';

    // Title (colored)
    html += `<span class="hud-bar__title" style="color: ${needColor}">${need.label}</span>`;

    // Exploration hint + linked emotion pills
    html += '<div class="hud-bar__pills">';
    html += `<span class="hud-bar__hint">explore:</span>`;
    for (const item of needEmotions) {
      html += `<button class="hud-bar__pill hud-bar__pill--emotion" data-emotion-id="${item.emotionId}">${item.emotionLabel}</button>`;
    }
    html += '</div>';

    bar.innerHTML = html;
    wireEvents();
    show();
  }

  function wireEvents() {
    // Need pill clicks
    for (const btn of bar.querySelectorAll('[data-need-id]')) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        emit('input:need-click', { id: btn.dataset.needId });
      });
    }

    // Emotion pill clicks (fellow messengers or linked emotions)
    for (const btn of bar.querySelectorAll('[data-emotion-id]')) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        emit('input:emotion-click', { id: btn.dataset.emotionId });
      });
    }
  }

  function show() {
    bar.offsetHeight; // eslint-disable-line no-unused-expressions
    bar.classList.add('hud-bar--visible');
    isVisible = true;
  }

  function hide() {
    bar.classList.remove('hud-bar--visible');
    isVisible = false;
  }

  // --- Subscribe to selection events ---
  unsubscribe = on('selection:changed', (data) => {
    if (data.mode === 'emotion') {
      showEmotion(data);
    } else if (data.mode === 'need') {
      showNeed(data);
    } else {
      hide();
    }
  });

  return {
    get isVisible() { return isVisible; },

    destroy() {
      if (unsubscribe) unsubscribe();
      bar.remove();
    },
  };
}
