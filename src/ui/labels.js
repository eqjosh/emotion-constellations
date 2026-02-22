/**
 * HTML label overlays for needs and emotions.
 *
 * Labels are positioned via CSS absolute positioning,
 * updated each frame to track simulation node positions.
 * Using HTML rather than WebGL for text gives us proper
 * font rendering, subpixel antialiasing, and easy styling.
 */

export function createLabelManager(container) {
  const needLabels = new Map();
  const emotionLabels = new Map();

  return {
    /**
     * Create label elements for all needs and emotions.
     */
    init(needNodes, emotionNodes) {
      // Clear existing
      container.innerHTML = '';

      // Need labels
      for (const need of needNodes) {
        const el = document.createElement('div');
        el.className = 'need-label';
        el.textContent = need.label;
        container.appendChild(el);
        needLabels.set(need.id, el);
      }

      // Emotion labels (initially visible for Phase 1 — can hide later)
      for (const emotion of emotionNodes) {
        const el = document.createElement('div');
        el.className = 'emotion-label';
        el.textContent = emotion.label;
        container.appendChild(el);
        emotionLabels.set(emotion.id, el);
      }
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
        if (el) {
          el.style.left = `${emotion.x}px`;
          el.style.top = `${emotion.y}px`;
        }
      }
    },

    destroy() {
      container.innerHTML = '';
      needLabels.clear();
      emotionLabels.clear();
    },
  };
}
