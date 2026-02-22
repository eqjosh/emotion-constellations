/**
 * Info panel — shows inquiry questions and emotional connections.
 *
 * DOM-based floating card with frosted glass aesthetic.
 * Desktop: bottom-right card, slides from right.
 * Mobile: full-width bottom drawer, slides up.
 *
 * Subscribes to 'selection:changed' events to show/hide content.
 * Fellow messenger names are clickable to navigate between emotions.
 */

import { on, emit } from '../core/events.js';

export function createInfoPanel(parentContainer) {
  // Create the panel element
  const panel = document.createElement('div');
  panel.className = 'info-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Emotion details');
  parentContainer.appendChild(panel);

  let unsubscribe = null;
  let isVisible = false;

  /** Build and show content for a selected emotion */
  function showEmotion(data) {
    const { id, emotion, inquiries, fellowMessengers = [] } = data;
    if (!emotion) return;

    // Build need color map for styling
    const needColorCSS = {};
    for (const inq of inquiries) {
      const [r, g, b] = inq.needColor;
      needColorCSS[inq.needId] = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    }

    let html = `
      <button class="info-panel__close" aria-label="Close">&times;</button>
      <h2 class="info-panel__title">${emotion.label}</h2>
      <div class="info-panel__inquiries">
    `;

    for (const inq of inquiries) {
      html += `
        <div class="info-panel__need-group">
          <span class="info-panel__need-name" style="color: ${needColorCSS[inq.needId]}">${inq.needLabel}</span>
          <p class="info-panel__inquiry">&ldquo;${inq.inquiry}&rdquo;</p>
        </div>
      `;
    }

    html += '</div>';

    // Fellow messengers section
    if (fellowMessengers.length > 0) {
      html += '<div class="info-panel__fellows">';
      html += '<span class="info-panel__fellows-label">Fellow messengers</span>';
      html += '<div class="info-panel__fellows-list">';
      for (const fellowId of fellowMessengers) {
        html += `<button class="info-panel__fellow" data-emotion-id="${fellowId}">${formatLabel(fellowId)}</button>`;
      }
      html += '</div></div>';
    }

    panel.innerHTML = html;

    // Wire close button
    panel.querySelector('.info-panel__close')?.addEventListener('click', () => {
      emit('input:deselect');
    });

    // Wire fellow messenger clicks
    for (const btn of panel.querySelectorAll('.info-panel__fellow')) {
      btn.addEventListener('click', () => {
        const emotionId = btn.dataset.emotionId;
        emit('input:emotion-click', { id: emotionId });
      });
    }

    show();
  }

  /** Build and show content for a selected need */
  function showNeed(data) {
    const { id, need, needEmotions = [] } = data;
    if (!need) return;

    const [r, g, b] = need.colorSecondary || need.color;
    const needColor = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;

    let html = `
      <button class="info-panel__close" aria-label="Close">&times;</button>
      <h2 class="info-panel__title" style="color: ${needColor}">${need.label}</h2>
    `;

    if (need.description) {
      html += `<p class="info-panel__description">${need.description}</p>`;
    }

    if (needEmotions.length > 0) {
      html += '<div class="info-panel__emotion-list">';
      for (const item of needEmotions) {
        html += `
          <div class="info-panel__emotion-item">
            <button class="info-panel__emotion-name" data-emotion-id="${item.emotionId}">${item.emotionLabel}</button>
            <p class="info-panel__inquiry">&ldquo;${item.inquiry}&rdquo;</p>
          </div>
        `;
      }
      html += '</div>';
    }

    panel.innerHTML = html;

    // Wire close button
    panel.querySelector('.info-panel__close')?.addEventListener('click', () => {
      emit('input:deselect');
    });

    // Wire emotion name clicks
    for (const btn of panel.querySelectorAll('.info-panel__emotion-name')) {
      btn.addEventListener('click', () => {
        const emotionId = btn.dataset.emotionId;
        emit('input:emotion-click', { id: emotionId });
      });
    }

    show();
  }

  function show() {
    // Force reflow before adding visible class for CSS transition
    panel.offsetHeight; // eslint-disable-line no-unused-expressions
    panel.classList.add('info-panel--visible');
    isVisible = true;
  }

  function hide() {
    panel.classList.remove('info-panel--visible');
    isVisible = false;
  }

  /** Format an emotion ID to a readable label */
  function formatLabel(id) {
    return id.charAt(0).toUpperCase() + id.slice(1);
  }

  // Subscribe to selection events
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
      panel.remove();
    },
  };
}
