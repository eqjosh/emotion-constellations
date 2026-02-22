/**
 * Selection state machine for interaction.
 *
 * Manages which emotion or need is selected, computes per-frame
 * visual derivations (brightness, size, opacity) that renderers consume,
 * and emits events for UI updates.
 *
 * States: idle | emotion | need
 *
 * The key design: this module pre-computes all visual values each frame
 * as the transition animates. The pipeline reads these values when
 * updating renderers. This keeps renderers dumb and state centralized.
 */

import { easeCubicInOut } from 'd3-ease';
import { emit } from '../core/events.js';
import { INTERACTION, CONNECTIONS } from '../core/constants.js';

export function createSelectionState(emotionNodes, needNodes, needNodesById) {
  // --- Internal state ---
  let mode = 'idle';           // 'idle' | 'emotion' | 'need'
  let selectedId = null;
  let transitionProgress = 0;  // 0..1
  let easedProgress = 0;
  let hoveredId = null;

  // Precomputed sets for the current selection.
  // These are kept alive during exit transitions so visual methods
  // can still reference them while animating back to idle.
  let linkedNeedIds = new Set();
  let linkedEmotionIds = new Set();
  let fellowMessengerIds = new Set();

  // Track the "previous" mode for exit transitions.
  // When we deselect, prevMode remembers whether we were in 'emotion' or 'need'
  // mode so the visual getters can still compute correct dimming during exit.
  let prevMode = 'idle';
  let prevSelectedId = null;

  // --- Helpers ---

  /** Find fellow messengers: emotions that share any need with the selected emotion */
  function computeFellowMessengers(emotionId) {
    const fellows = new Set();
    const emotion = emotionNodes.find(e => e.id === emotionId);
    if (!emotion) return fellows;

    const myNeedIds = new Set(emotion.links.map(l => l.needId));

    for (const other of emotionNodes) {
      if (other.id === emotionId) continue;
      for (const link of other.links) {
        if (myNeedIds.has(link.needId)) {
          fellows.add(other.id);
          break;
        }
      }
    }
    return fellows;
  }

  /** Collect inquiry data for the current selection */
  function collectInquiries(emotionId) {
    const emotion = emotionNodes.find(e => e.id === emotionId);
    if (!emotion) return [];
    return emotion.links.map(link => {
      const need = needNodesById.get(link.needId);
      return {
        needId: link.needId,
        needLabel: need?.label || link.needId,
        needColor: need?.colorSecondary || need?.color || [1, 1, 1],
        inquiry: link.inquiry,
        strength: link.strength,
      };
    });
  }

  /** Collect all emotions linked to a need, with their inquiries */
  function collectNeedEmotions(needId) {
    const result = [];
    for (const emotion of emotionNodes) {
      for (const link of emotion.links) {
        if (link.needId === needId) {
          result.push({
            emotionId: emotion.id,
            emotionLabel: emotion.label,
            inquiry: link.inquiry,
            strength: link.strength,
          });
        }
      }
    }
    return result;
  }

  // --- Public API ---

  const state = {
    get mode() { return mode; },
    get selectedId() { return selectedId; },

    selectEmotion(id) {
      // If already selected, toggle off
      if (mode === 'emotion' && selectedId === id) {
        state.deselect();
        return;
      }

      prevMode = 'emotion';
      prevSelectedId = id;
      mode = 'emotion';
      selectedId = id;
      transitionProgress = 0;

      // Find linked needs
      const emotion = emotionNodes.find(e => e.id === id);
      linkedNeedIds = new Set(emotion ? emotion.links.map(l => l.needId) : []);

      // Find all emotions linked to those needs (including this one)
      linkedEmotionIds = new Set();
      linkedEmotionIds.add(id);
      for (const other of emotionNodes) {
        for (const link of other.links) {
          if (linkedNeedIds.has(link.needId)) {
            linkedEmotionIds.add(other.id);
          }
        }
      }

      // Fellow messengers (linked emotions minus self)
      fellowMessengerIds = computeFellowMessengers(id);

      emit('selection:changed', {
        mode: 'emotion',
        id,
        emotion,
        linkedNeeds: [...linkedNeedIds],
        linkedEmotions: [...linkedEmotionIds],
        fellowMessengers: [...fellowMessengerIds],
        inquiries: collectInquiries(id),
      });
    },

    selectNeed(id) {
      // If already selected, toggle off
      if (mode === 'need' && selectedId === id) {
        state.deselect();
        return;
      }

      prevMode = 'need';
      prevSelectedId = id;
      mode = 'need';
      selectedId = id;
      transitionProgress = 0;

      linkedNeedIds = new Set([id]);

      // Find all emotions linked to this need
      linkedEmotionIds = new Set();
      for (const emotion of emotionNodes) {
        for (const link of emotion.links) {
          if (link.needId === id) {
            linkedEmotionIds.add(emotion.id);
          }
        }
      }

      fellowMessengerIds = new Set();

      const need = needNodesById.get(id);
      emit('selection:changed', {
        mode: 'need',
        id,
        need,
        linkedNeeds: [id],
        linkedEmotions: [...linkedEmotionIds],
        needEmotions: collectNeedEmotions(id),
      });
    },

    deselect() {
      if (mode === 'idle' && transitionProgress === 0) return;

      // Don't clear linked sets — they're needed for the exit transition visuals.
      // They'll be overwritten on the next selectEmotion/selectNeed call.
      mode = 'idle';
      selectedId = null;
      // Keep transitionProgress at its current value — tick() will animate it to 0.
      // If it was mid-transition-in, it'll start easing back from wherever it was.

      emit('selection:changed', { mode: 'idle', id: null });
    },

    setHover(id) {
      hoveredId = id;
    },

    /**
     * Advance transition animation.
     * @param {number} dt — frame delta time in seconds
     */
    tick(dt) {
      const duration = INTERACTION.transitionDuration / 1000;

      if (mode !== 'idle') {
        // Transition in
        if (transitionProgress < 1) {
          transitionProgress = Math.min(1, transitionProgress + dt / duration);
        }
      } else {
        // Transition out (slightly faster)
        if (transitionProgress > 0) {
          transitionProgress = Math.max(0, transitionProgress - dt / (duration * 0.8));
          // When transition fully completes, clean up
          if (transitionProgress === 0) {
            linkedNeedIds = new Set();
            linkedEmotionIds = new Set();
            fellowMessengerIds = new Set();
            prevMode = 'idle';
            prevSelectedId = null;
          }
        }
      }

      easedProgress = easeCubicInOut(transitionProgress);
    },

    /**
     * Get visual properties for an emotion node.
     * @returns {{ brightness: number, sizeScale: number }}
     */
    getEmotionVisual(emotion) {
      const t = easedProgress;
      let brightness = 1.0;
      let sizeScale = 1.0;

      if (t > 0.001) {
        // Use prevMode/prevSelectedId during exit transitions (mode === idle)
        const activeMode = mode !== 'idle' ? mode : prevMode;
        const activeId = mode !== 'idle' ? selectedId : prevSelectedId;

        if (emotion.id === activeId && activeMode === 'emotion') {
          // Selected emotion
          brightness = lerp(1.0, INTERACTION.selectedBrightness, t);
          sizeScale = lerp(1.0, INTERACTION.selectedSizeScale, t);
        } else if (linkedEmotionIds.has(emotion.id)) {
          // Related emotion (fellow messenger or linked to selected need)
          brightness = lerp(1.0, INTERACTION.relatedBrightness, t);
        } else {
          // Unrelated — dim
          brightness = lerp(1.0, INTERACTION.dimmedBrightness, t);
          sizeScale = lerp(1.0, INTERACTION.dimmedSizeScale, t);
        }
      }

      // Apply hover effect (additive, quick, no transition needed)
      if (hoveredId === emotion.id && mode === 'idle' && t < 0.01) {
        brightness = INTERACTION.hoverBrightness;
        sizeScale = INTERACTION.hoverSizeScale;
      }

      return { brightness, sizeScale };
    },

    /**
     * Get aurora intensity for a need node.
     * @returns {number}
     */
    getNeedIntensity(need) {
      const t = easedProgress;

      if (t > 0.001) {
        if (linkedNeedIds.has(need.id)) {
          return lerp(1.0, INTERACTION.selectedNeedIntensity, t);
        } else {
          return lerp(1.0, INTERACTION.dimmedNeedIntensity, t);
        }
      }

      return 1.0;
    },

    /**
     * Get connection opacity for a specific emotion-need link.
     * @returns {number}
     */
    getConnectionOpacity(emotionId, needId, baseOpacity) {
      const t = easedProgress;

      if (t > 0.001) {
        const activeMode = mode !== 'idle' ? mode : prevMode;
        const activeId = mode !== 'idle' ? selectedId : prevSelectedId;

        if (activeMode === 'emotion' && emotionId === activeId) {
          // Connection from the selected emotion — brighten
          return lerp(baseOpacity, CONNECTIONS.activeOpacity, t);
        }
        if (activeMode === 'need' && needId === activeId && linkedEmotionIds.has(emotionId)) {
          // Connection to the selected need from a linked emotion — brighten
          return lerp(baseOpacity, CONNECTIONS.activeOpacity, t);
        }
        // Unrelated connection — dim
        return lerp(baseOpacity, baseOpacity * 0.3, t);
      }

      return baseOpacity;
    },

    /** Check if a need is selected or linked */
    isNeedSelected(needId) {
      return linkedNeedIds.has(needId) && easedProgress > 0.1;
    },

    /** Check if a need is dimmed (not selected and not linked) */
    isNeedDimmed(needId) {
      return !linkedNeedIds.has(needId) && easedProgress > 0.1 && linkedNeedIds.size > 0;
    },

    /** Check if an emotion is highlighted (selected or related) */
    isEmotionHighlighted(emotionId) {
      return linkedEmotionIds.has(emotionId) && easedProgress > 0.1;
    },

    /** Check if an emotion is dimmed */
    isEmotionDimmed(emotionId) {
      return !linkedEmotionIds.has(emotionId) && easedProgress > 0.1 && linkedEmotionIds.size > 0;
    },
  };

  return state;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}
