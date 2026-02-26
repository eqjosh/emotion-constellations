/**
 * Unified Constellation Panel — welcome + wisdom text + Claude AI chat in one panel.
 *
 * State machine: idle → welcome → wisdom → chat
 *
 * - idle:    Panel hidden.
 * - welcome: Generic greeting + 3 intro starter buttons. No emotion selected.
 * - wisdom:  Wisdom text types word-by-word, starter prompts appear, input visible.
 * - chat:    Messages flow, input at bottom, wisdom collapsed above.
 *
 * The ✦ icon appears to the right of the emotion LABEL when selected,
 * with a subtle pulse animation. Clicking it opens the panel.
 * The icon uses stopPropagation on pointerdown so the canvas
 * tap handler doesn't also fire (deselect).
 *
 * Subscribes to 'selection:changed', 'wisdom:open', and 'help:open' events.
 * Subscribes to chat events: chat:stream-start/chunk/end/error/turn-limit.
 */

import { on, emit } from '../core/events.js';
import { createChatClient } from '../chat/chat-client.js';
import { generateStarterPrompts } from '../chat/starter-prompts.js';
import { t } from '../core/ui-strings.js';
import { getLocale } from '../core/locale.js';

// ─── Wisdom data loader ──────────────────────────────────────────────────────

let wisdomData = null;
let rawWisdomJson = null;

async function loadWisdomData() {
  try {
    const resp = await fetch(`${import.meta.env.BASE_URL}data/emotion-constellation-more-info-data.json`);
    rawWisdomJson = await resp.json();
    buildWisdomForLocale(getLocale());
    console.log(`Wisdom data loaded: ${wisdomData.size} emotions`);
  } catch (err) {
    console.warn('Failed to load wisdom data:', err);
  }
}

function buildWisdomForLocale(locale) {
  if (!rawWisdomJson) return;
  wisdomData = new Map();
  for (const emotion of rawWisdomJson.emotions) {
    wisdomData.set(emotion.id, {
      label: emotion.label?.[locale] || emotion.label?.en || emotion.id,
      readMore: {
        essence: emotion.readMore?.essence?.[locale] || emotion.readMore?.essence?.en || '',
        signal: emotion.readMore?.signal?.[locale] || emotion.readMore?.signal?.en || '',
        reflection: emotion.readMore?.reflection?.[locale] || emotion.readMore?.reflection?.en || '',
        bookRef: emotion.readMore?.bookRef?.[locale] || emotion.readMore?.bookRef?.en || '',
      },
    });
  }
}

// Start loading immediately
const dataReady = loadWisdomData();

// ─── Panel factory ───────────────────────────────────────────────────────────

export function createWisdomPanel(container) {
  const chatClient = createChatClient();

  let panelEl = null;
  let iconEl = null;
  let currentEmotionId = null;
  let currentSelectionData = null;  // Full selection:changed data for chat context
  let isVisible = false;
  let panelState = 'idle';         // 'idle' | 'welcome' | 'wisdom' | 'chat'
  let typingTimeoutId = null;
  let privacyShown = false;
  let allEmotionNodes = [];        // Cached for fellow messenger label lookup

  // ─── Build DOM ─────────────────────────────────────────────────────────────

  panelEl = document.createElement('div');
  panelEl.className = 'wisdom-panel';
  panelEl.innerHTML = `
    <div class="wisdom-panel__header">
      <span class="wisdom-panel__icon">&#10022;</span>
      <span class="wisdom-panel__title">${t('wisdom.title')}</span>
      <button class="wisdom-panel__close" aria-label="${t('wisdom.close')}">&times;</button>
    </div>
    <div class="wisdom-panel__scroll-area">
      <div class="wisdom-panel__welcome-section" style="display:none;">
        <p class="wisdom-panel__welcome-greeting"></p>
        <div class="wisdom-panel__welcome-starters"></div>
      </div>
      <div class="wisdom-panel__wisdom-section">
        <h3 class="wisdom-panel__emotion-name"></h3>
        <div class="wisdom-panel__body"></div>
      </div>
      <div class="wisdom-panel__privacy-notice" style="display:none;">
        ${t('wisdom.privacyNotice')}
      </div>
      <div class="wisdom-panel__starters"></div>
      <div class="wisdom-panel__messages"></div>
    </div>
    <div class="wisdom-panel__input-area">
      <input type="text" class="wisdom-panel__input"
             placeholder="${t('wisdom.inputPlaceholder')}"
             maxlength="500" autocomplete="off" />
      <button class="wisdom-panel__send" aria-label="${t('wisdom.send')}">&#8594;</button>
    </div>
  `;
  container.appendChild(panelEl);

  // Cache element refs
  const scrollArea = panelEl.querySelector('.wisdom-panel__scroll-area');
  const welcomeSection = panelEl.querySelector('.wisdom-panel__welcome-section');
  const welcomeGreeting = panelEl.querySelector('.wisdom-panel__welcome-greeting');
  const welcomeStarters = panelEl.querySelector('.wisdom-panel__welcome-starters');
  const wisdomSection = panelEl.querySelector('.wisdom-panel__wisdom-section');
  const nameEl = panelEl.querySelector('.wisdom-panel__emotion-name');
  const bodyEl = panelEl.querySelector('.wisdom-panel__body');
  const startersEl = panelEl.querySelector('.wisdom-panel__starters');
  const messagesEl = panelEl.querySelector('.wisdom-panel__messages');
  const privacyEl = panelEl.querySelector('.wisdom-panel__privacy-notice');
  const inputEl = panelEl.querySelector('.wisdom-panel__input');
  const sendBtn = panelEl.querySelector('.wisdom-panel__send');
  const closeBtn = panelEl.querySelector('.wisdom-panel__close');
  const titleEl = panelEl.querySelector('.wisdom-panel__title');

  // ─── Event wiring ──────────────────────────────────────────────────────────

  // Close button
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hidePanel();
  });

  // Prevent canvas deselect when clicking inside the panel
  panelEl.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
  });

  // Input submit
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleInputSubmit();
    }
  });
  sendBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleInputSubmit();
  });

  // Selection events
  const unsubSelection = on('selection:changed', (data) => {
    if (data.mode === 'emotion') {
      currentEmotionId = data.id;
      currentSelectionData = data;
      showIcon(data);
      // If panel was open, transition to wisdom for this emotion
      if (isVisible) {
        showWisdom(data.id);
      } else {
        hidePanel();
      }
    } else {
      currentEmotionId = null;
      currentSelectionData = null;
      hideIcon();
      // Clicking background (deselect) closes the panel in any state
      if (isVisible) {
        hidePanel();
      }
    }
  });

  // External open request (e.g. from HUD bar pill click)
  const unsubWisdom = on('wisdom:open', ({ id }) => {
    requestAnimationFrame(() => {
      showPanel(id);
    });
  });

  // Help icon opens welcome mode
  const unsubHelp = on('help:open', () => {
    if (isVisible && panelState === 'welcome') {
      hidePanel();
    } else if (isVisible && currentEmotionId) {
      // Already showing wisdom/chat for an emotion — do nothing
    } else {
      showWelcome();
    }
  });

  // "About this App" copyright link → show static about text + starter prompts
  const unsubAbout = on('about:open', () => {
    showAbout();
  });

  // Locale change: rebuild wisdom data for new locale, refresh UI strings
  const unsubLocale = on('locale:changed', ({ locale }) => {
    buildWisdomForLocale(locale);
    updateLocaleStrings();
    // Refresh visible panel content for the new locale
    if (isVisible && panelState === 'welcome') {
      showWelcome();
    } else if (isVisible && panelState === 'about') {
      showAbout();
    } else if (isVisible && panelState === 'wisdom' && currentEmotionId) {
      showWisdom(currentEmotionId);
    }
  });

  // Chat events
  const unsubStreamStart = on('chat:stream-start', () => {
    const loadingEl = document.createElement('div');
    loadingEl.className = 'wisdom-panel__loading';
    loadingEl.innerHTML = `
      <div class="wisdom-panel__loading-dot" style="animation-delay: 0s"></div>
      <div class="wisdom-panel__loading-dot" style="animation-delay: 0.2s"></div>
      <div class="wisdom-panel__loading-dot" style="animation-delay: 0.4s"></div>
    `;
    messagesEl.appendChild(loadingEl);
    scrollToBottom();
  });

  const unsubStreamChunk = on('chat:stream-chunk', ({ content, fullContent }) => {
    const loading = messagesEl.querySelector('.wisdom-panel__loading');
    if (loading) loading.remove();

    let assistantBubble = messagesEl.querySelector('.wisdom-panel__message--streaming');
    if (!assistantBubble) {
      assistantBubble = document.createElement('div');
      assistantBubble.className = 'wisdom-panel__message wisdom-panel__message--assistant wisdom-panel__message--streaming';
      messagesEl.appendChild(assistantBubble);
    }
    assistantBubble.textContent = fullContent;
    scrollToBottom();
  });

  const unsubStreamEnd = on('chat:stream-end', ({ content, aborted }) => {
    const loading = messagesEl.querySelector('.wisdom-panel__loading');
    if (loading) loading.remove();

    const streamingBubble = messagesEl.querySelector('.wisdom-panel__message--streaming');
    if (streamingBubble) {
      streamingBubble.classList.remove('wisdom-panel__message--streaming');
    }

    inputEl.disabled = false;
    inputEl.focus();
  });

  const unsubError = on('chat:error', ({ error }) => {
    const loading = messagesEl.querySelector('.wisdom-panel__loading');
    if (loading) loading.remove();

    const streamingBubble = messagesEl.querySelector('.wisdom-panel__message--streaming');
    if (streamingBubble) streamingBubble.remove();

    const errEl = document.createElement('div');
    errEl.className = 'wisdom-panel__message wisdom-panel__message--error';
    errEl.textContent = error || t('chat.error');
    messagesEl.appendChild(errEl);
    scrollToBottom();

    inputEl.disabled = false;
  });

  const unsubTurnLimit = on('chat:turn-limit', ({ message }) => {
    const limitEl = document.createElement('div');
    limitEl.className = 'wisdom-panel__message wisdom-panel__message--system';
    limitEl.textContent = message;
    messagesEl.appendChild(limitEl);
    scrollToBottom();
    inputEl.disabled = true;
  });

  // ─── Locale helper ──────────────────────────────────────────────────────────

  function updateLocaleStrings() {
    titleEl.textContent = t('wisdom.title');
    closeBtn.setAttribute('aria-label', t('wisdom.close'));
    inputEl.placeholder = t('wisdom.inputPlaceholder');
    sendBtn.setAttribute('aria-label', t('wisdom.send'));
    privacyEl.textContent = t('wisdom.privacyNotice');
  }

  // ─── Icon management ───────────────────────────────────────────────────────

  function showIcon(data) {
    hideIcon();

    iconEl = document.createElement('button');
    iconEl.className = 'wisdom-icon';
    iconEl.innerHTML = '&#10022;'; // ✦
    iconEl.title = 'Discover emotional wisdom';
    iconEl.setAttribute('aria-label', `Learn about ${data.emotion?.label || 'this emotion'}`);

    iconEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isVisible) {
        hidePanel();
      } else {
        showPanel(currentEmotionId);
      }
    });

    iconEl.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
    });

    document.getElementById('labels').appendChild(iconEl);

    requestAnimationFrame(() => {
      iconEl.classList.add('wisdom-icon--visible');
    });
  }

  function hideIcon() {
    if (iconEl) {
      iconEl.classList.remove('wisdom-icon--visible');
      const el = iconEl;
      setTimeout(() => { if (el.parentNode) el.remove(); }, 400);
      iconEl = null;
    }
  }

  // ─── Panel state management ────────────────────────────────────────────────

  function showWelcome() {
    cancelTyping();
    chatClient.reset();
    panelState = 'welcome';
    isVisible = true;

    // Hide wisdom section, show welcome section
    wisdomSection.style.display = 'none';
    welcomeSection.style.display = '';
    startersEl.innerHTML = '';
    startersEl.classList.remove('wisdom-panel__starters--visible');
    messagesEl.innerHTML = '';
    inputEl.value = '';
    inputEl.disabled = false;
    inputEl.placeholder = t('wisdom.inputPlaceholder');

    // Build welcome content
    welcomeGreeting.textContent = t('welcome.greeting');
    welcomeStarters.innerHTML = '';

    const welcomeButtons = [
      { key: 'welcome.introBtn', text: t('welcome.introBtn') },
      { key: 'welcome.emotionsBtn', text: t('welcome.emotionsBtn') },
      { key: 'welcome.helpBtn', text: t('welcome.helpBtn') },
    ];

    for (const { text } of welcomeButtons) {
      const btn = document.createElement('button');
      btn.className = 'wisdom-panel__starter-btn';
      btn.textContent = text;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        transitionToWelcomeChat(text);
      });
      welcomeStarters.appendChild(btn);
    }

    panelEl.classList.add('wisdom-panel--visible');
    emit('panel:opened', {});

    // Fade in starters
    requestAnimationFrame(() => {
      welcomeStarters.classList.add('wisdom-panel__welcome-starters--visible');
    });
  }

  function showPanel(emotionId) {
    if (!emotionId) return;
    showWisdom(emotionId);
    isVisible = true;
    panelEl.classList.add('wisdom-panel--visible');
    emit('panel:opened', {});
  }

  function hidePanel() {
    if (!isVisible) return;
    isVisible = false;
    panelEl.classList.remove('wisdom-panel--visible');
    emit('panel:closed', {});

    // Reset everything
    cancelTyping();
    chatClient.reset();
    panelState = 'idle';
    messagesEl.innerHTML = '';
    startersEl.innerHTML = '';
    welcomeSection.style.display = 'none';
    wisdomSection.style.display = '';
    inputEl.value = '';
    inputEl.disabled = false;
  }

  function showWisdom(emotionId) {
    cancelTyping();
    chatClient.reset();
    panelState = 'wisdom';
    messagesEl.innerHTML = '';
    startersEl.innerHTML = '';
    inputEl.value = '';
    inputEl.disabled = false;

    // Show wisdom section, hide welcome
    welcomeSection.style.display = 'none';
    wisdomSection.style.display = '';

    if (!wisdomData) return;
    const wisdom = wisdomData.get(emotionId);
    if (!wisdom) return;

    nameEl.textContent = wisdom.label;
    bodyEl.innerHTML = '';

    // Type wisdom text word-by-word
    const textParts = [];
    if (wisdom.readMore.essence) {
      textParts.push({ text: wisdom.readMore.essence, className: 'wisdom-panel__essence' });
    }
    if (wisdom.readMore.signal) {
      textParts.push({ text: wisdom.readMore.signal, className: 'wisdom-panel__signal' });
    }
    if (wisdom.readMore.reflection) {
      textParts.push({ text: wisdom.readMore.reflection, className: 'wisdom-panel__reflection' });
    }
    if (wisdom.readMore.bookRef) {
      textParts.push({ text: wisdom.readMore.bookRef, className: 'wisdom-panel__book-ref' });
    }

    typeWisdomParts(textParts, () => {
      showStarters(emotionId);
    });
  }

  function typeWisdomParts(parts, onComplete) {
    if (parts.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    const part = parts[0];
    const el = document.createElement('p');
    el.className = part.className;
    bodyEl.appendChild(el);

    const words = part.text.split(' ');
    let i = 0;

    function typeNextWord() {
      if (i >= words.length) {
        typeWisdomParts(parts.slice(1), onComplete);
        return;
      }
      el.textContent += (i > 0 ? ' ' : '') + words[i];
      i++;
      scrollToBottom();
      typingTimeoutId = setTimeout(typeNextWord, 50);
    }

    typingTimeoutId = setTimeout(typeNextWord, 100);
  }

  function cancelTyping() {
    if (typingTimeoutId) {
      clearTimeout(typingTimeoutId);
      typingTimeoutId = null;
    }
  }

  function showAbout() {
    cancelTyping();
    chatClient.reset();
    panelState = 'about';
    isVisible = true;

    // Use the messages + starters area; hide wisdom/welcome sections
    wisdomSection.style.display = 'none';
    welcomeSection.style.display = 'none';
    startersEl.innerHTML = '';
    startersEl.classList.remove('wisdom-panel__starters--visible');
    messagesEl.innerHTML = '';
    inputEl.value = '';
    inputEl.disabled = false;

    // Show about text as an assistant message — inject book link into translated string
    const bookLink = '<a href="https://www.6seconds.org/emotionrules" target="_blank" rel="noopener">Emotion Rules</a>';
    const p1 = t('about.p1').replace('{book}', bookLink);
    const p2 = t('about.p2');

    const aboutMsg = document.createElement('div');
    aboutMsg.className = 'wisdom-panel__message wisdom-panel__message--assistant';
    aboutMsg.innerHTML = p1 + '<br><br>' + p2;
    messagesEl.appendChild(aboutMsg);

    // Starter questions — appended inside messagesEl (after the text) so they
    // appear below it, not above. The global startersEl sits before messagesEl
    // in the DOM, which would reverse the visual order.
    const aboutStartersEl = document.createElement('div');
    aboutStartersEl.className = 'wisdom-panel__starters';
    messagesEl.appendChild(aboutStartersEl);

    for (const text of [t('about.starter1'), t('about.starter2'), t('about.starter3')]) {
      const btn = document.createElement('button');
      btn.className = 'wisdom-panel__starter-btn';
      btn.textContent = text;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        transitionToWelcomeChat(text);
      });
      aboutStartersEl.appendChild(btn);
    }

    panelEl.classList.add('wisdom-panel--visible');
    emit('panel:opened', {});

    requestAnimationFrame(() => {
      aboutStartersEl.classList.add('wisdom-panel__starters--visible');
      scrollToBottom();
    });
  }

  function showStarters(emotionId) {
    if (panelState !== 'wisdom') return;
    startersEl.innerHTML = '';

    const emotion = currentSelectionData?.emotion;
    const fellows = currentSelectionData?.fellowMessengers || [];
    const prompts = generateStarterPrompts(emotion, fellows, allEmotionNodes);

    for (const promptText of prompts) {
      const btn = document.createElement('button');
      btn.className = 'wisdom-panel__starter-btn';
      btn.textContent = promptText;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        transitionToChat(promptText);
      });
      startersEl.appendChild(btn);
    }

    requestAnimationFrame(() => {
      startersEl.classList.add('wisdom-panel__starters--visible');
    });
  }

  // ─── Chat mode ─────────────────────────────────────────────────────────────

  /**
   * Transition from welcome state to chat (no emotion context).
   * Uses a general system prompt for intro questions.
   */
  function transitionToWelcomeChat(initialMessage) {
    panelState = 'chat';
    welcomeStarters.innerHTML = '';
    welcomeStarters.classList.remove('wisdom-panel__welcome-starters--visible');

    // Show privacy notice once
    if (!privacyShown) {
      privacyEl.style.display = '';
      privacyShown = true;
    }

    // Start a general (non-emotion-specific) conversation
    chatClient.startConversation({
      emotion: null,
      id: null,
      inquiries: [],
      fellowMessengers: [],
      wisdom: {},
      emotionNodes: allEmotionNodes,
      isWelcome: true,
    });

    appendUserMessage(initialMessage);
    inputEl.disabled = true;
    chatClient.sendMessage(initialMessage);
  }

  function transitionToChat(initialMessage) {
    panelState = 'chat';
    startersEl.innerHTML = '';
    startersEl.classList.remove('wisdom-panel__starters--visible');

    if (!privacyShown) {
      privacyEl.style.display = '';
      privacyShown = true;
    }

    const wisdom = wisdomData?.get(currentEmotionId);
    const chatData = {
      emotion: currentSelectionData?.emotion,
      id: currentEmotionId,
      inquiries: currentSelectionData?.inquiries || [],
      fellowMessengers: currentSelectionData?.fellowMessengers || [],
      wisdom: wisdom?.readMore || {},
      emotionNodes: allEmotionNodes,
    };

    chatClient.startConversation(chatData);
    appendUserMessage(initialMessage);
    inputEl.disabled = true;
    chatClient.sendMessage(initialMessage);
  }

  function handleInputSubmit() {
    const text = inputEl.value.trim();
    if (!text) return;
    if (chatClient.isStreaming) return;
    inputEl.value = '';

    if (panelState === 'welcome') {
      transitionToWelcomeChat(text);
    } else if (panelState === 'wisdom') {
      transitionToChat(text);
    } else if (panelState === 'chat') {
      appendUserMessage(text);
      inputEl.disabled = true;
      chatClient.sendMessage(text);
    }
  }

  function appendUserMessage(text) {
    const msgEl = document.createElement('div');
    msgEl.className = 'wisdom-panel__message wisdom-panel__message--user';
    msgEl.textContent = text;
    messagesEl.appendChild(msgEl);
    scrollToBottom();
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    });
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  return {
    /**
     * Update the ✦ icon position to track the selected emotion label.
     * Called from the pipeline frame loop.
     */
    updateIconPosition(emotionNodes) {
      allEmotionNodes = emotionNodes;

      if (!iconEl || !currentEmotionId) return;

      const labelEl = document.querySelector(`.emotion-label[data-id="${currentEmotionId}"]`);
      if (labelEl) {
        const labelRect = labelEl.getBoundingClientRect();
        iconEl.style.left = `${labelRect.right + 4}px`;
        iconEl.style.top = `${labelRect.top + labelRect.height / 2 - 12}px`;
      } else {
        const emotion = emotionNodes.find(e => e.id === currentEmotionId);
        if (!emotion) return;
        iconEl.style.left = `${emotion.x + 28}px`;
        iconEl.style.top = `${emotion.y - 16}px`;
      }
    },

    get isWisdomVisible() {
      return isVisible;
    },

    destroy() {
      hideIcon();
      hidePanel();
      chatClient.reset();
      if (panelEl && panelEl.parentNode) panelEl.remove();
      unsubSelection();
      unsubWisdom();
      unsubHelp();
      unsubAbout();
      unsubLocale();
      unsubStreamStart();
      unsubStreamChunk();
      unsubStreamEnd();
      unsubError();
      unsubTurnLimit();
    },
  };
}
