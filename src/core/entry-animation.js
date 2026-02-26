/**
 * Entry animation — orchestrates the reveal sequence on page load.
 *
 * Sequence:
 * 1. Needs fade in (0–800ms, staggered)
 * 2. Emotions drift in from outside (800–2300ms)
 * 3. Connections fade in (2500–3500ms)
 * 4. Optional "tap to explore" hint (3500–6500ms)
 *
 * The animation controller exposes per-frame multipliers that the
 * pipeline uses to modulate opacity/visibility of each layer.
 * Plays once, never replays.
 */

import { ENTRY } from './constants.js';
import { t } from './ui-strings.js';
import { easeCubicOut } from 'd3-ease';

export function createEntryAnimation() {
  let startTime = -1;
  let completed = false;

  // Per-need staggered progress (0–1 each)
  let needProgresses = [];
  // Per-emotion staggered progress (0–1 each), two-wave
  let emotionProgresses = [];
  let emotionCount = 0;
  let connectionProgress = 0; // 0–1

  // Hint
  let hintElement = null;

  return {
    /** Has the animation finished? */
    get isComplete() { return completed; },

    /**
     * Initialize with the current time.
     * Call once when the pipeline starts.
     */
    init(timestamp, needCount, emotionNodeCount) {
      startTime = timestamp;
      needProgresses = new Array(needCount).fill(0);
      emotionCount = emotionNodeCount || 0;
      emotionProgresses = new Array(emotionCount).fill(0);
    },

    /**
     * Tick the animation forward.
     * @param {number} timestamp - current time in ms (from performance.now or rAF)
     * @returns {void}
     */
    tick(timestamp) {
      if (completed || startTime < 0) return;

      const elapsed = timestamp - startTime;

      // Phase 1: Needs fade in (staggered)
      for (let i = 0; i < needProgresses.length; i++) {
        const needStart = i * ENTRY.needsStagger;
        const needElapsed = elapsed - needStart;
        if (needElapsed <= 0) {
          needProgresses[i] = 0;
        } else {
          needProgresses[i] = Math.min(1, needElapsed / ENTRY.needsFadeInDuration);
        }
      }

      // Phase 2: Emotions drift in — two waves
      // Wave 1: first half of emotions, Wave 2: second half
      const half = Math.ceil(emotionCount / 2);
      for (let i = 0; i < emotionCount; i++) {
        const isWave2 = i >= half;
        const waveDelay = isWave2
          ? ENTRY.emotionDelay + ENTRY.emotionWave2Delay
          : ENTRY.emotionDelay;
        const waveDuration = isWave2
          ? ENTRY.emotionWave2Duration
          : ENTRY.emotionWave1Duration;
        const emotionElapsed = elapsed - waveDelay;
        if (emotionElapsed <= 0) {
          emotionProgresses[i] = 0;
        } else {
          emotionProgresses[i] = Math.min(1, emotionElapsed / waveDuration);
        }
      }

      // Phase 3: Connections fade in
      const connElapsed = elapsed - ENTRY.connectionDelay;
      if (connElapsed <= 0) {
        connectionProgress = 0;
      } else {
        connectionProgress = Math.min(1, connElapsed / ENTRY.connectionFadeDuration);
      }

      // Show hint text
      if (elapsed >= ENTRY.hintDelay && !hintElement) {
        showHint();
      }

      // Check if all phases complete
      const totalDuration = ENTRY.connectionDelay + ENTRY.connectionFadeDuration + 200;
      if (elapsed >= totalDuration) {
        completed = true;
      }
    },

    /**
     * Get opacity multiplier for a need (by index).
     * Returns 0–1 during fade-in, 1.0 after complete.
     */
    getNeedOpacity(index) {
      if (completed) return 1.0;
      if (index >= needProgresses.length) return 0;
      return easeCubicOut(needProgresses[index]);
    },

    /**
     * Get opacity multiplier for a single emotion (by index).
     * Returns 0–1 during its wave's drift-in, 1.0 after complete.
     */
    getEmotionOpacityAt(index) {
      if (completed) return 1.0;
      if (index >= emotionProgresses.length) return 0;
      return easeCubicOut(emotionProgresses[index]);
    },

    /**
     * Get overall emotion opacity (min across all — used for labels).
     * Returns 0–1 during drift-in, 1.0 after complete.
     * @deprecated Use getEmotionOpacityAt(index) for per-emotion control.
     */
    getEmotionOpacity() {
      if (completed) return 1.0;
      // Return the max progress so labels become visible as their wave arrives
      let maxP = 0;
      for (let i = 0; i < emotionProgresses.length; i++) {
        if (emotionProgresses[i] > maxP) maxP = emotionProgresses[i];
      }
      return easeCubicOut(maxP);
    },

    /**
     * Get drift scale for a single emotion (by index).
     * Returns 1.0 at start (fully outside), 0.0 when settled.
     */
    getEmotionDriftScaleAt(index) {
      if (completed) return 0;
      if (index >= emotionProgresses.length) return 1.0;
      return 1.0 - easeCubicOut(emotionProgresses[index]);
    },

    /**
     * Get scale for emotion drift-in (overall fallback).
     * @deprecated Use getEmotionDriftScaleAt(index) for per-emotion control.
     */
    getEmotionDriftScale() {
      if (completed) return 0;
      let maxP = 0;
      for (let i = 0; i < emotionProgresses.length; i++) {
        if (emotionProgresses[i] > maxP) maxP = emotionProgresses[i];
      }
      return 1.0 - easeCubicOut(maxP);
    },

    /**
     * Get opacity multiplier for connection threads.
     * Returns 0–1 during fade-in, 1.0 after complete.
     */
    getConnectionOpacity() {
      if (completed) return 1.0;
      return easeCubicOut(connectionProgress);
    },
  };

  function showHint() {
    hintElement = document.createElement('div');
    hintElement.className = 'entry-hint';
    hintElement.textContent = t('entry.hint');
    document.body.appendChild(hintElement);

    // Fade in
    requestAnimationFrame(() => {
      hintElement.classList.add('entry-hint--visible');
    });

    // Fade out after duration
    setTimeout(() => {
      if (hintElement) {
        hintElement.classList.remove('entry-hint--visible');
        setTimeout(() => {
          if (hintElement && hintElement.parentNode) {
            hintElement.remove();
          }
          hintElement = null;
        }, 800);
      }
    }, ENTRY.hintDuration);
  }
}
