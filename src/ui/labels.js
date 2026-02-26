/**
 * HTML label overlays for needs and emotions.
 *
 * Labels are positioned via CSS absolute positioning,
 * updated each frame to track simulation node positions.
 * Using HTML rather than WebGL for text gives us proper
 * font rendering, subpixel antialiasing, and easy styling.
 *
 * Phase 2: Need labels are clickable (select that need).
 * Emotion labels show selection states via CSS classes.
 */

import { emit, on } from '../core/events.js';

export function createLabelManager(container) {
  const needLabels = new Map();
  const emotionLabels = new Map();
  let unsubscribe = null;

  return {
    /**
     * Create label elements for all needs and emotions.
     */
    init(needNodes, emotionNodes) {
      // Clear existing
      container.innerHTML = '';

      // Need labels — clickable
      for (const need of needNodes) {
        const el = document.createElement('div');
        el.className = 'need-label';
        el.textContent = need.label;
        el.dataset.id = need.id;
        // Stop pointerdown from reaching the canvas (which would also trigger
        // selectNeed via hit-test, causing an immediate toggle-off)
        el.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
        });
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          emit('input:need-click', { id: need.id });
        });
        container.appendChild(el);
        needLabels.set(need.id, el);
      }

      // Emotion labels
      for (const emotion of emotionNodes) {
        const el = document.createElement('div');
        el.className = 'emotion-label';
        el.textContent = emotion.label;
        el.dataset.id = emotion.id;
        container.appendChild(el);
        emotionLabels.set(emotion.id, el);
      }

      // Subscribe to selection changes for CSS state updates
      unsubscribe = on('selection:changed', (data) => {
        updateSelectionClasses(data);
      });
    },

    /**
     * Update label positions to match simulation.
     * Called each frame.
     */
    update(needNodes, emotionNodes) {
      for (const need of needNodes) {
        const el = needLabels.get(need.id);
        if (el) {
          el.style.left = `${need.fx}px`;
          el.style.top = `${need.fy}px`;
        }
      }

      for (const emotion of emotionNodes) {
        const el = emotionLabels.get(emotion.id);
        if (!el) continue;

        // Start from the emotion's simulation position
        let lx = emotion.x;
        let ly = emotion.y;

        // Emotion labels render at translate(-50%, -130%) so the text
        // sits ~15px above the star. Check from that offset position.
        const textY = ly - 15;

        // Push emotion label away from nearby need labels to prevent overlap
        for (const need of needNodes) {
          const dx = lx - need.fx;
          const dy = textY - need.fy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = 38; // px threshold

          if (dist < minDist && dist > 0) {
            const push = (minDist - dist);
            lx += (dx / dist) * push;
            ly += (dy / dist) * push;
          }
        }

        el.style.left = `${lx}px`;
        el.style.top = `${ly}px`;
      }
    },

    /**
     * Set per-element opacity during entry animation.
     * @param {Function} needOpacityFn - (index) => 0..1
     * @param {Function} emotionOpacityFn - (index) => 0..1
     */
    setEntryOpacities(needOpacityFn, emotionOpacityFn) {
      let i = 0;
      for (const [, el] of needLabels) {
        el.style.opacity = needOpacityFn(i);
        i++;
      }
      let j = 0;
      for (const [, el] of emotionLabels) {
        el.style.opacity = emotionOpacityFn(j);
        j++;
      }
    },

    /**
     * Update label text content (e.g. on locale change).
     * Nodes should already have updated labels.
     */
    updateLabels(needNodes, emotionNodes) {
      for (const need of needNodes) {
        const el = needLabels.get(need.id);
        if (el) el.textContent = need.label;
      }
      for (const emotion of emotionNodes) {
        const el = emotionLabels.get(emotion.id);
        if (el) el.textContent = emotion.label;
      }
    },

    destroy() {
      container.innerHTML = '';
      needLabels.clear();
      emotionLabels.clear();
      if (unsubscribe) unsubscribe();
    },
  };

  function updateSelectionClasses(data) {
    const { mode, linkedNeeds = [], linkedEmotions = [] } = data;
    const needSet = new Set(linkedNeeds);
    const emotionSet = new Set(linkedEmotions);

    for (const [id, el] of needLabels) {
      el.classList.toggle('need-label--selected', mode !== 'idle' && needSet.has(id));
      el.classList.toggle('need-label--dimmed', mode !== 'idle' && !needSet.has(id));
    }

    for (const [id, el] of emotionLabels) {
      el.classList.toggle('emotion-label--highlighted', mode !== 'idle' && emotionSet.has(id));
      el.classList.toggle('emotion-label--dimmed', mode !== 'idle' && !emotionSet.has(id));
    }
  }
}
