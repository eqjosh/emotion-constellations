/**
 * Custom force: gravitational pull of emotions toward their linked needs.
 *
 * Each emotion is pulled toward every need it links to, with strength
 * proportional to the link's strength value. Emotions with one strong
 * link cluster tightly; emotions with multiple links float in the
 * "between" space — the key nondualistic visual.
 */

import { PHYSICS } from '../core/constants.js';

export function needGravityForce(needNodesById) {
  let emotionNodes = [];

  function force(alpha) {
    for (const node of emotionNodes) {
      if (node.type !== 'emotion' || !node.links) continue;

      for (const link of node.links) {
        const need = needNodesById.get(link.needId);
        if (!need) continue;

        const strength = link.strength * PHYSICS.gravityStrength * alpha;

        // Pull toward the need's fixed position
        node.vx += (need.fx - node.x) * strength;
        node.vy += (need.fy - node.y) * strength;
      }

      // Organic micro-perturbation — prevents static freeze,
      // creates the "floating in warm water" quality
      node.vx += (Math.random() - 0.5) * PHYSICS.perturbation * alpha;
      node.vy += (Math.random() - 0.5) * PHYSICS.perturbation * alpha;
    }
  }

  force.initialize = function (nodes) {
    emotionNodes = nodes;
  };

  return force;
}
