/**
 * Custom force: gravitational pull of emotions toward their linked needs.
 *
 * Each emotion is pulled toward every need it links to, with strength
 * proportional to the link's strength value. Emotions with one strong
 * link cluster tightly; emotions with multiple links float in the
 * "between" space — the key nondualistic visual.
 */

import { PHYSICS } from '../core/constants.js';

// Module-level time counter for drift field
let driftTime = 0;

export function needGravityForce(needNodesById) {
  let emotionNodes = [];

  function force(alpha) {
    // Advance drift time — creates a slowly rotating "cosmic current"
    driftTime += 0.016; // ~60fps frame time

    // Slow rotating wind vector — each emotion feels a slightly different
    // direction based on its position, creating swirling motion
    const baseAngle = driftTime * PHYSICS.driftSpeed;

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

      // Cosmic drift — a slow, swirling current that varies spatially.
      // IMPORTANT: drift uses sqrt(alpha) so it stays visible even when
      // the simulation has settled to low alpha. This is what makes
      // the stars visibly float rather than appearing frozen.
      const spatialPhase = (node.x * 0.003 + node.y * 0.002);
      const driftAngle = baseAngle + spatialPhase + (node._driftSeed || 0);
      const driftAlpha = Math.sqrt(alpha); // much stronger than raw alpha at low values
      const driftMag = PHYSICS.driftStrength * driftAlpha;
      node.vx += Math.cos(driftAngle) * driftMag;
      node.vy += Math.sin(driftAngle) * driftMag;

      // Organic micro-perturbation — also uses sqrt(alpha) to stay
      // alive when simulation has settled. Creates the "floating in
      // warm water" quality with visible jitter.
      node.vx += (Math.random() - 0.5) * PHYSICS.perturbation * driftAlpha;
      node.vy += (Math.random() - 0.5) * PHYSICS.perturbation * driftAlpha;
    }
  }

  force.initialize = function (nodes) {
    emotionNodes = nodes;
    // Give each node a unique drift seed for organic variation
    for (const node of nodes) {
      node._driftSeed = Math.random() * Math.PI * 2;
    }
  };

  return force;
}
