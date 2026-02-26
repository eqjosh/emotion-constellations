/**
 * Generate contextual starter prompts for the selected emotion.
 *
 * Uses i18n templates from ui-strings.js for multilingual support.
 *
 * Templates:
 * 1. "I'm feeling {emotion} right now -- what might it be telling me?"
 * 2. "How do {emotion} and {fellowMessenger} relate?"
 * 3. "Help me explore what need this connects to for me"
 *
 * The second prompt picks a non-obvious fellow messenger for surprise/delight.
 */

import { t } from '../core/ui-strings.js';

/**
 * @param {Object} emotion       - The emotion node ({ id, label, links })
 * @param {Array}  fellowMessengers - Array of fellow messenger emotion IDs
 * @param {Array}  emotionNodes  - All emotion nodes (for label lookup)
 * @returns {string[]} 2-3 starter prompt strings
 */
export function generateStarterPrompts(emotion, fellowMessengers = [], emotionNodes = []) {
  if (!emotion) return [];

  const label = (emotion.label || emotion.id).toLowerCase();
  const prompts = [];

  // Template 1: Personal reflection
  prompts.push(t('starters.feeling', { emotion: label }));

  // Template 2: Fellow messenger pairing (pick a non-obvious one)
  if (fellowMessengers.length > 0) {
    const pickIndex = fellowMessengers.length > 2
      ? 1 + Math.floor(Math.random() * (fellowMessengers.length - 1))
      : 0;
    const fellowId = fellowMessengers[pickIndex];
    const fellowNode = emotionNodes.find(e => e.id === fellowId);
    const fellowLabel = (fellowNode?.label || fellowId).toLowerCase();
    prompts.push(t('starters.relate', { emotion: label, fellow: fellowLabel }));
  }

  // Template 3: Need exploration
  prompts.push(t('starters.need'));

  return prompts.slice(0, 3);
}
