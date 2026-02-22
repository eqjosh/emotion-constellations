/**
 * D3-force simulation setup.
 *
 * Creates the physics simulation with need nodes (fixed positions)
 * and emotion nodes (free-floating, pulled by need gravity).
 * Used purely for position computation — never touches the DOM.
 */

import {
  forceSimulation,
  forceManyBody,
  forceCollide,
  forceCenter,
} from 'd3-force';
import { needGravityForce } from './forces.js';
import { PHYSICS, LAYOUT } from '../core/constants.js';

/**
 * Compute the weighted centroid of an emotion's linked needs.
 * This gives a natural starting position.
 */
function weightedCentroid(links, needNodesById) {
  let sumX = 0, sumY = 0, sumW = 0;
  for (const link of links) {
    const need = needNodesById.get(link.needId);
    if (!need) continue;
    sumX += need.fx * link.strength;
    sumY += need.fy * link.strength;
    sumW += link.strength;
  }
  if (sumW === 0) return { x: 0, y: 0 };
  return { x: sumX / sumW, y: sumY / sumW };
}

export function createSimulation(data, width, height) {
  const needNodesById = new Map();

  // Position needs in a loose organic ring
  const needCount = data.needs.length;
  const cx = width / 2;
  const cy = height / 2;
  const ringRadius = Math.min(width, height) * LAYOUT.needRingRadius;

  const needNodes = data.needs.map((need, i) => {
    const angle = (i / needCount) * Math.PI * 2 + LAYOUT.needRingOffset;
    const node = {
      id: need.id,
      type: 'need',
      label: need.label,
      description: need.description || '',
      color: need.color,
      colorSecondary: need.colorSecondary,
      intensity: 1.0,
      // Fixed position
      fx: cx + Math.cos(angle) * ringRadius,
      fy: cy + Math.sin(angle) * ringRadius,
    };
    needNodesById.set(need.id, node);
    return node;
  });

  // Create emotion nodes
  const emotionNodes = data.emotions.map((emotion) => {
    const centroid = weightedCentroid(emotion.links, needNodesById);

    // Compute display color: blend of linked need colors, weighted by strength
    const displayColor = computeEmotionColor(emotion.links, needNodesById);

    return {
      id: emotion.id,
      type: 'emotion',
      label: emotion.label,
      links: emotion.links,
      displayColor,
      displaySize: emotion.links.length > 1 ? 32 : 24, // bridge emotions notably larger
      // Initial position near centroid with small random offset
      x: centroid.x + (Math.random() - 0.5) * 30,
      y: centroid.y + (Math.random() - 0.5) * 30,
    };
  });

  const allNodes = [...needNodes, ...emotionNodes];

  // Build the simulation
  const simulation = forceSimulation(allNodes)
    .force('center', forceCenter(cx, cy).strength(PHYSICS.centeringStrength))
    .force('collide', forceCollide()
      .radius(d => d.type === 'need' ? PHYSICS.collisionRadiusNeed : PHYSICS.collisionRadiusEmotion)
      .strength(PHYSICS.collisionStrength)
      .iterations(2))
    .force('charge', forceManyBody()
      .strength(d => d.type === 'emotion' ? PHYSICS.chargeStrength : 0)
      .distanceMax(PHYSICS.chargeMaxDistance))
    .force('need-gravity', needGravityForce(needNodesById))
    .alphaDecay(PHYSICS.alphaDecay)
    .alphaTarget(PHYSICS.alphaTarget)
    .velocityDecay(PHYSICS.velocityDecay);

  // Warmup: pre-settle before first render
  for (let i = 0; i < PHYSICS.warmupTicks; i++) {
    simulation.tick();
  }

  return {
    simulation,
    needNodes,
    emotionNodes,
    allNodes,
    needNodesById,

    /** Advance one simulation step */
    tick() {
      simulation.tick();
    },

    /** Update layout when canvas resizes */
    resize(newWidth, newHeight) {
      const newCx = newWidth / 2;
      const newCy = newHeight / 2;
      const newRadius = Math.min(newWidth, newHeight) * LAYOUT.needRingRadius;

      needNodes.forEach((node, i) => {
        const angle = (i / needCount) * Math.PI * 2 + LAYOUT.needRingOffset;
        node.fx = newCx + Math.cos(angle) * newRadius;
        node.fy = newCy + Math.sin(angle) * newRadius;
      });

      simulation.force('center', forceCenter(newCx, newCy).strength(PHYSICS.centeringStrength));
      simulation.alpha(0.3).restart();
    },

    /** Get connection data for rendering */
    getConnections() {
      const connections = [];
      for (const emotion of emotionNodes) {
        for (const link of emotion.links) {
          const need = needNodesById.get(link.needId);
          if (!need) continue;
          connections.push({
            emotionId: emotion.id,
            needId: link.needId,
            startX: emotion.x,
            startY: emotion.y,
            endX: need.fx,
            endY: need.fy,
            color: need.colorSecondary || need.color,
            opacity: 0.25 + link.strength * 0.25,
          });
        }
      }
      return connections;
    },
  };
}

/**
 * Compute blended color for an emotion from its linked needs.
 * Weighted average of need secondary colors by link strength.
 */
function computeEmotionColor(links, needNodesById) {
  let r = 0, g = 0, b = 0, totalWeight = 0;

  for (const link of links) {
    const need = needNodesById.get(link.needId);
    if (!need) continue;
    const color = need.colorSecondary || need.color;
    r += color[0] * link.strength;
    g += color[1] * link.strength;
    b += color[2] * link.strength;
    totalWeight += link.strength;
  }

  if (totalWeight === 0) return [0.7, 0.7, 0.7];
  return [r / totalWeight, g / totalWeight, b / totalWeight];
}
