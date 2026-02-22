/**
 * Hit testing — find which emotion or need node is closest to a point.
 *
 * Since simulation space IS screen space (CSS pixels), no
 * coordinate transform is needed. With only ~15 emotions and
 * ~3 needs, brute-force distance check is instantaneous.
 */

import { INTERACTION } from '../core/constants.js';

/**
 * Find the nearest node to a screen point.
 * Emotions take priority over needs (they're drawn on top).
 *
 * @param {number} x — CSS pixel x
 * @param {number} y — CSS pixel y
 * @param {Array} emotionNodes — array of emotion node objects
 * @param {Array} needNodes — array of need node objects
 * @returns {{ type: 'emotion'|'need'|null, node: object|null }}
 */
export function findHit(x, y, emotionNodes, needNodes) {
  // Check emotions first (drawn on top, higher priority)
  let closestEmotion = null;
  let closestEmotionDist = INTERACTION.hitRadiusEmotion;

  for (const emotion of emotionNodes) {
    const dx = x - emotion.x;
    const dy = y - emotion.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < closestEmotionDist) {
      closestEmotionDist = dist;
      closestEmotion = emotion;
    }
  }

  if (closestEmotion) {
    return { type: 'emotion', node: closestEmotion };
  }

  // Then check needs
  let closestNeed = null;
  let closestNeedDist = INTERACTION.hitRadiusNeed;

  for (const need of needNodes) {
    const dx = x - need.fx;
    const dy = y - need.fy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < closestNeedDist) {
      closestNeedDist = dist;
      closestNeed = need;
    }
  }

  if (closestNeed) {
    return { type: 'need', node: closestNeed };
  }

  return { type: null, node: null };
}
