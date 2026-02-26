/**
 * Chat client for the Constellation Claude AI integration.
 *
 * Manages conversation history (in-memory), sends messages to the
 * Cloud Function SSE endpoint, parses streamed responses, and emits
 * events for the UI layer via the event bus.
 *
 * Uses fetch + ReadableStream (not EventSource, which only supports GET).
 * AbortController allows canceling mid-stream when the user changes emotion.
 *
 * Events emitted:
 *   chat:stream-start   {}
 *   chat:stream-chunk   { content, fullContent }
 *   chat:stream-end     { content } | { aborted: true }
 *   chat:error          { error }
 *   chat:turn-limit     { message }
 */

import { emit } from '../core/events.js';
import { getLocale } from '../core/locale.js';
import { t } from '../core/ui-strings.js';

const CHAT_ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT
  || 'https://us-central1-emotion-rules-quiz.cloudfunctions.net/constellationChat';

const MAX_TURNS = 10;

/**
 * Build a structured emotionContext payload from the stored emotionData.
 * The system prompt template lives server-side; the client only sends
 * validated structured fields that the server inserts into its own template.
 *
 * @param {Object} emotionData - Raw data from wisdom-panel.js
 * @returns {Object|null} - Structured context for the server, or null for welcome mode
 */
function buildEmotionContextPayload(emotionData) {
  if (!emotionData || emotionData.isWelcome || !emotionData.emotion) {
    return { isWelcome: true };
  }

  const { emotion, inquiries = [], fellowMessengers = [], wisdom = {}, emotionNodes = [] } = emotionData;

  // Pre-resolve fellow messenger IDs → labels grouped by need (matching server expectation)
  const fellowMessengersPerNeed = {};
  for (const inq of inquiries) {
    const fellows = [];
    for (const fellowId of fellowMessengers) {
      const fellowNode = emotionNodes.find(e => e.id === fellowId);
      if (!fellowNode) continue;
      const sharesNeed = fellowNode.links?.some(l => l.needId === inq.needId);
      if (sharesNeed) {
        fellows.push(fellowNode.label || fellowId);
      }
    }
    if (fellows.length > 0) {
      fellowMessengersPerNeed[inq.needId] = fellows;
    }
  }

  return {
    label: emotion.label || emotion.id,
    inquiries: inquiries.map(inq => ({
      needId: inq.needId,
      needLabel: inq.needLabel,
      inquiry: inq.inquiry,
      strength: typeof inq.strength === 'number' ? inq.strength : undefined,
    })),
    fellowMessengersPerNeed,
    wisdomEssence: wisdom.essence || '',
    wisdomSignal: wisdom.signal || '',
  };
}

export function createChatClient() {
  let conversationHistory = [];   // Array of { role, content }
  let currentEmotionId = null;
  let currentEmotionData = null;
  let isStreaming = false;
  let abortController = null;

  return {
    /**
     * Start a new conversation for the given emotion.
     * Clears any existing conversation.
     *
     * @param {Object} emotionData - Combined data:
     *   { emotion, inquiries, fellowMessengers, wisdom, emotionNodes }
     */
    startConversation(emotionData) {
      this.reset();
      currentEmotionId = emotionData.emotion?.id || emotionData.id;
      currentEmotionData = emotionData;
    },

    /**
     * Send a message and stream the response.
     * @param {string} userMessage
     */
    async sendMessage(userMessage) {
      if (isStreaming) return;
      if (!currentEmotionData) {
        emit('chat:error', { error: 'No emotion selected' });
        return;
      }

      // Check turn limit
      const userTurnCount = conversationHistory.filter(m => m.role === 'user').length;
      if (userTurnCount >= MAX_TURNS) {
        emit('chat:turn-limit', {
          message: t('chat.turnLimit'),
        });
        return;
      }

      // Add user message to history
      conversationHistory.push({ role: 'user', content: userMessage });

      isStreaming = true;
      abortController = new AbortController();
      emit('chat:stream-start', {});

      try {
        // Build structured context — server builds the actual system prompt from its own template
        const emotionContext = buildEmotionContextPayload(currentEmotionData);

        const response = await fetch(CHAT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emotionContext,
            locale: getLocale(),
            messages: conversationHistory,
            emotionId: currentEmotionId,
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        // Read SSE stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantContent = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop(); // Keep incomplete line in buffer

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                emit('chat:stream-chunk', {
                  content: parsed.content,
                  fullContent: assistantContent,
                });
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              // parsed.done signals stream end metadata (modelUsed etc)
            } catch (e) {
              // Ignore JSON parse errors for malformed chunks
              if (e.message && !e.message.startsWith('Unexpected')) {
                throw e; // Re-throw actual errors
              }
            }
          }
        }

        // Add assistant response to history
        if (assistantContent) {
          conversationHistory.push({ role: 'assistant', content: assistantContent });
        }
        emit('chat:stream-end', { content: assistantContent });

      } catch (error) {
        if (error.name === 'AbortError') {
          emit('chat:stream-end', { aborted: true });
        } else {
          emit('chat:error', { error: error.message });
          // Remove the user message that failed to get a response
          if (conversationHistory.length > 0 &&
              conversationHistory[conversationHistory.length - 1].role === 'user') {
            conversationHistory.pop();
          }
        }
      } finally {
        isStreaming = false;
        abortController = null;
      }
    },

    /** Cancel an in-progress stream */
    abort() {
      if (abortController) {
        abortController.abort();
      }
    },

    /** Reset conversation (called on emotion change or panel close) */
    reset() {
      this.abort();
      conversationHistory = [];
      currentEmotionId = null;
      currentEmotionData = null;
    },

    get isStreaming() { return isStreaming; },
    get emotionId() { return currentEmotionId; },
    get turnCount() { return conversationHistory.filter(m => m.role === 'user').length; },
    get history() { return [...conversationHistory]; },
    get emotionData() { return currentEmotionData; },
  };
}
