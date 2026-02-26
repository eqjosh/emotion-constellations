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
import { t } from '../core/ui-strings.js';

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

  function makePill(text, classes, dataAttrs, style) {
    const btn = document.createElement('button');
    btn.className = classes;
    btn.textContent = text;
    if (style) btn.setAttribute('style', style);
    for (const [k, v] of Object.entries(dataAttrs || {})) {
      btn.dataset[k] = v;
    }
    return btn;
  }

  // --- Content builders ---

  function showEmotion(data) {
    const { emotion, inquiries = [], fellowMessengers = [] } = data;
    if (!emotion) return;

    bar.textContent = ''; // safe clear

    const title = document.createElement('span');
    title.className = 'hud-bar__title';
    title.textContent = t('hud.fellowMessengers', { emotion: emotion.label });
    bar.appendChild(title);

    const pills = document.createElement('div');
    pills.className = 'hud-bar__pills';

    for (const inq of inquiries) {
      const color = toCSS(inq.needColor);
      const btn = makePill(inq.needLabel, 'hud-bar__pill hud-bar__pill--need', { needId: inq.needId },
        `--pill-color: ${color}`);
      pills.appendChild(btn);
    }

    for (const fellowId of fellowMessengers) {
      const btn = makePill(formatLabel(fellowId), 'hud-bar__pill hud-bar__pill--fellow', { emotionId: fellowId });
      pills.appendChild(btn);
    }

    bar.appendChild(pills);
    wireEvents();
    show();
  }

  function showNeed(data) {
    const { need, needEmotions = [] } = data;
    if (!need) return;

    bar.textContent = ''; // safe clear

    const needColor = toCSS(need.colorSecondary || need.color);

    const title = document.createElement('span');
    title.className = 'hud-bar__title';
    title.textContent = need.label;
    title.style.color = needColor;
    bar.appendChild(title);

    const pills = document.createElement('div');
    pills.className = 'hud-bar__pills';

    const hint = document.createElement('span');
    hint.className = 'hud-bar__hint';
    hint.textContent = t('hud.explore');
    pills.appendChild(hint);

    for (const item of needEmotions) {
      const btn = makePill(item.emotionLabel, 'hud-bar__pill hud-bar__pill--emotion', { emotionId: item.emotionId });
      pills.appendChild(btn);
    }

    bar.appendChild(pills);
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

    // Emotion pill clicks → navigate to that emotion + open wisdom panel
    for (const btn of bar.querySelectorAll('[data-emotion-id]')) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const emotionId = btn.dataset.emotionId;
        emit('input:emotion-click', { id: emotionId });
        emit('wisdom:open', { id: emotionId });
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
