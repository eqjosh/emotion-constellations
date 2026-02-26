/**
 * System prompt builder for the Constellation Claude chat.
 *
 * Contains the full system prompt template from the integration spec
 * and builds the {emotionContext} block from selection data.
 *
 * Supports locale-aware prompts — instructs Claude to respond in user's language.
 */

import { getLocale } from '../core/locale.js';

const SYSTEM_PROMPT_TEMPLATE = `You are an emotional wisdom guide grounded in "Emotion Rules" by Joshua Freedman. Warm, curious, grounded \u2014 like a wise friend, not a therapist or lecturer.

RESPONSE LENGTH \u2014 THIS IS CRITICAL:
- Keep every response to 2\u20133 sentences. Maximum 4 sentences for complex topics.
- One short paragraph. Never multiple paragraphs.
- End with ONE reflective question when it feels natural, not every time.
- This is a small chat panel on a phone/tablet. Brevity is respect.

CORE FRAMEWORK:
- No bad feelings. Every emotion is a signal carrying information about needs and values.
- Emotions aren't opposites \u2014 feelings that seem contradictory often point to the same core need. Both/and, not either/or.
- Six core needs: Safety, Belonging, Autonomy, Achievement, Meaning, Growth. Emotions connect to these needs.
- Don't fix or solve. Help the person listen to their emotion. Ask more than you answer.
- Meet people where they are emotionally, not conceptually. Acknowledge before exploring.

VOICE:
- Warm and natural, never clinical or jargon-heavy. Say "this anger might be protecting something important" not "anger correlates with autonomy needs."
- "Fellow messengers" are emotions connected to the same need \u2014 mention them when it deepens understanding.
- Use "comfortable/uncomfortable" not "positive/negative" for emotions.
- Don't say: "But here's the thing," "I hear you," or performative praise.

{languageInstruction}

CONTEXT:
{emotionContext}

BOUNDARIES:
- Not a therapist. For crisis/self-harm, warmly suggest findahelpline.com.
- Don't diagnose or use clinical labels. Don't tell people what they feel \u2014 ask.
- Stay focused on emotional exploration. Redirect off-topic gently.
- Reference the book naturally and sparingly.

WHEN SOMEONE IS VULNERABLE:
Acknowledge simply ("That sounds painful.") then pause before going deeper. Don't rush to frameworks.`;

/** Welcome system prompt for general intro questions (no emotion selected) */
const WELCOME_PROMPT_TEMPLATE = `You are an emotional wisdom guide grounded in "Emotion Rules" by Joshua Freedman. Warm, curious, grounded \u2014 like a wise friend, not a therapist or lecturer.

RESPONSE LENGTH \u2014 THIS IS CRITICAL:
- Keep every response to 2\u20133 sentences. Maximum 4 sentences for complex topics.
- One short paragraph. Never multiple paragraphs.
- End with ONE reflective question when it feels natural, not every time.
- This is a small chat panel on a phone/tablet. Brevity is respect.

ABOUT THIS TOOL:
The person is using the Emotion Constellation, an interactive visualization where 39 emotions float as stars, connected by luminous threads to 6 core human needs: Safety, Belonging, Autonomy, Achievement, Meaning, and Growth. Each emotion is a signal serving one or more of these needs. The person can click any emotion star to explore its wisdom and chat with you about it.

CORE FRAMEWORK:
- No bad feelings. Every emotion is a signal carrying information about needs and values.
- Emotions aren't opposites \u2014 feelings that seem contradictory often point to the same core need.
- Six core needs: Safety, Belonging, Autonomy, Achievement, Meaning, Growth.
- The constellation shows that emotions like Fear and Trust both serve Safety; Loneliness and Love both serve Belonging.

{languageInstruction}

VOICE:
- Warm and natural, never clinical. Invite exploration.
- Encourage the person to click on emotions in the constellation to explore deeper.

BOUNDARIES:
- Not a therapist. For crisis/self-harm, warmly suggest findahelpline.com.
- Stay focused on emotional exploration. Redirect off-topic gently.`;

/**
 * Build the language instruction block.
 * For English, returns empty (default behavior).
 * For other locales, instructs Claude to respond in that language.
 */
function buildLanguageInstruction() {
  const locale = getLocale();
  if (locale === 'en') return '';

  const LOCALE_NAMES = {
    es: 'Spanish', ko: 'Korean', zh: 'Chinese (Simplified)',
    ar: 'Arabic', he: 'Hebrew', ja: 'Japanese', fr: 'French',
    pt: 'Portuguese', it: 'Italian', de: 'German',
  };

  const langName = LOCALE_NAMES[locale] || locale;
  return `LANGUAGE:\nAlways respond in ${langName}. The user's interface is set to ${langName}. Keep your warmth and naturalness in this language.`;
}

/**
 * Build the emotion context block from selection data + wisdom data.
 *
 * @param {Object} params
 * @param {Object} params.emotion       - The emotion node (id, label, links)
 * @param {Array}  params.inquiries     - Array of { needId, needLabel, inquiry, strength }
 * @param {Array}  params.fellowMessengers - Array of emotion IDs
 * @param {Object} params.wisdom        - readMore data { essence, signal, reflection, bookRef }
 * @param {Array}  params.emotionNodes  - All emotion nodes (for resolving fellow messenger labels)
 * @returns {string}
 */
export function buildEmotionContext({ emotion, inquiries = [], fellowMessengers = [], wisdom, emotionNodes = [] }) {
  if (!emotion) return 'The person is exploring the Emotion Constellation visualization. They haven\'t selected a specific emotion yet.';

  const label = emotion.label || emotion.id;
  const lines = [];

  lines.push(`The person is currently exploring the emotion: ${label.toUpperCase()}`);
  lines.push('');

  if (inquiries.length > 0) {
    lines.push(`${label} is connected to these core needs:`);
    for (const inq of inquiries) {
      const strengthStr = inq.strength != null ? ` (strength: ${inq.strength})` : '';
      lines.push(`- ${inq.needLabel}: "${inq.inquiry}"${strengthStr}`);
    }
    lines.push('');
  }

  if (wisdom) {
    if (wisdom.essence) {
      lines.push(`Essence: ${wisdom.essence}`);
      lines.push('');
    }
    if (wisdom.signal) {
      lines.push(`Signal: ${wisdom.signal}`);
      lines.push('');
    }
  }

  if (fellowMessengers.length > 0 && inquiries.length > 0) {
    for (const inq of inquiries) {
      const fellowsForNeed = [];
      for (const fellowId of fellowMessengers) {
        const fellowNode = emotionNodes.find(e => e.id === fellowId);
        if (!fellowNode) continue;
        const sharesNeed = fellowNode.links?.some(l => l.needId === inq.needId);
        if (sharesNeed) {
          fellowsForNeed.push(fellowNode.label || fellowId);
        }
      }
      if (fellowsForNeed.length > 0) {
        lines.push(`Fellow messengers for ${inq.needLabel}: ${fellowsForNeed.join(', ')}`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Build the complete system prompt with emotion context injected.
 *
 * @param {Object} contextParams - Same as buildEmotionContext params, plus optional `isWelcome`
 * @returns {string}
 */
export function buildSystemPrompt(contextParams) {
  const langInstruction = buildLanguageInstruction();

  if (contextParams.isWelcome || !contextParams.emotion) {
    return WELCOME_PROMPT_TEMPLATE
      .replace('{languageInstruction}', langInstruction);
  }

  const context = buildEmotionContext(contextParams);
  return SYSTEM_PROMPT_TEMPLATE
    .replace('{emotionContext}', context)
    .replace('{languageInstruction}', langInstruction);
}
