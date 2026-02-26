/**
 * Subscription gate — after N interactions, shows a modal asking
 * the user to subscribe (free) to continue exploring.
 *
 * Tracks click count in localStorage. On form submit, calls constellationSubscribe
 * which handles Pardot, token generation, and sends a magic-link email.
 *
 * Country list loaded from /js/countries.js (shared with quiz app
 * on same Firebase hosting — exposes window.COUNTRIES,
 * window.PRIORITY_COUNTRIES, window.detectCountryFromTimezone).
 */

import { on, emit } from '../core/events.js';

const STORAGE_KEY = 'constellation_sub';
const SOFT_THRESHOLD = 5;   // first modal (dismissible)
const HARD_THRESHOLD = 8;   // second modal (no dismiss)
const ACCESS_EXPIRY_MS = 10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds

const SUBSCRIBE_URL = import.meta.env.VITE_SUBSCRIBE_ENDPOINT
  || 'https://us-central1-emotion-rules-quiz.cloudfunctions.net/constellationSubscribe';

export function createSubscriptionGate() {
  let clickCount = 0;
  let dismissed = false;     // true after "Maybe later" on soft gate
  let subscribed = false;
  let overlayEl = null;

  // --- Persistence ---

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const state = JSON.parse(raw);

      // Check verified subscription (email-confirmed access with expiry)
      if (state.subscribed) {
        const age = Date.now() - (state.subscribedAt || 0);
        if (age < ACCESS_EXPIRY_MS) {
          subscribed = true;
          return; // fully subscribed — nothing else to load
        }
        // Expired — wipe the entry and treat as a fresh visitor
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      // Not subscribed — load gate-tracking state
      if (state.dismissed) dismissed = true;
      if (typeof state.clicks === 'number') clickCount = state.clicks;
    } catch { /* ignore corrupt data */ }
  }

  function saveClicks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const state = raw ? JSON.parse(raw) : {};
      state.clicks = clickCount;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
  }

  function markSubscribed() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        subscribed: true,
        subscribedAt: Date.now(),
      }));
    } catch { /* ignore */ }
  }

  // --- Country dropdown builder ---

  function buildCountryOptions() {
    const countries = window.COUNTRIES || [];
    const priority = window.PRIORITY_COUNTRIES || [];
    const detected = typeof window.detectCountryFromTimezone === 'function'
      ? window.detectCountryFromTimezone()
      : null;

    let html = '<option value="" disabled selected>Country</option>';

    // Priority countries at top
    if (priority.length) {
      for (const c of priority) {
        const sel = (c === detected) ? ' selected' : '';
        html += `<option value="${c}"${sel}>${c}</option>`;
      }
      html += '<option disabled>──────────</option>';
    }

    // All countries (skip duplicates from priority)
    const prioritySet = new Set(priority);
    for (const c of countries) {
      if (prioritySet.has(c)) continue;
      const sel = (c === detected && !priority.includes(detected)) ? ' selected' : '';
      html += `<option value="${c}"${sel}>${c}</option>`;
    }

    return html;
  }

  // --- Modal DOM ---

  function createModal(hard) {
    overlayEl = document.createElement('div');
    overlayEl.className = 'sub-gate';
    if (hard) overlayEl.classList.add('sub-gate--hard');
    overlayEl.innerHTML = `
      <div class="sub-gate__card">
        <div class="sub-gate__header">
          <span class="sub-gate__star">&#10022;</span>
          <h2 class="sub-gate__title">Keep Exploring</h2>
        </div>
        <p class="sub-gate__copy">
          We're glad you're exploring the Emotion Constellation.
          Subscribe to continue &mdash; it's free, and you can unsubscribe any time.
        </p>

        <form class="sub-gate__form" novalidate>
          <input class="sub-gate__input" type="text" name="first_name"
                 placeholder="First name" required autocomplete="given-name" />
          <input class="sub-gate__input" type="email" name="email"
                 placeholder="Email" required autocomplete="email" />
          <select class="sub-gate__input sub-gate__select" name="country" required>
            ${buildCountryOptions()}
          </select>

          <button class="sub-gate__submit" type="submit">
            Subscribe &amp; Continue
          </button>

          <p class="sub-gate__consent">
            By submitting this form, you agree to receive email communications from
            <a href="https://6seconds.org" target="_blank" rel="noopener">Six Seconds</a>.
            You can unsubscribe anytime. See our
            <a href="https://6seconds.org/privacy" target="_blank" rel="noopener">Privacy Policy</a>.
          </p>

          <p class="sub-gate__error" aria-live="polite"></p>
        </form>

        ${hard ? '' : '<button class="sub-gate__dismiss">Maybe later</button>'}
      </div>
    `;

    document.body.appendChild(overlayEl);

    // Wire form
    const form = overlayEl.querySelector('.sub-gate__form');
    const errorEl = overlayEl.querySelector('.sub-gate__error');
    const submitBtn = overlayEl.querySelector('.sub-gate__submit');

    // "Maybe later" dismiss button (soft gate only)
    const dismissBtn = overlayEl.querySelector('.sub-gate__dismiss');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        dismissed = true;
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const state = raw ? JSON.parse(raw) : {};
          state.dismissed = true;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch { /* ignore */ }
        closeModal();
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.textContent = '';

      const firstName = form.first_name.value.trim();
      const email = form.email.value.trim();
      const country = form.country.value;

      // Validate
      if (!firstName) {
        errorEl.textContent = 'Please enter your first name.';
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorEl.textContent = 'Please enter a valid email address.';
        return;
      }
      if (!country) {
        errorEl.textContent = 'Please select your country.';
        return;
      }

      // Submit
      submitBtn.disabled = true;
      submitBtn.textContent = 'Subscribing...';

      try {
        const success = await subscribe({ firstName, email, country });
        if (success) {
          // Don't mark subscribed yet — they need to click the magic link first.
          // Temporarily dismiss the gate so they can keep exploring while they check email.
          dismissed = true;
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const state = raw ? JSON.parse(raw) : {};
            state.dismissed = true;
            state.pendingVerification = true;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          } catch { /* ignore */ }
          showCheckEmailAndClose();
        } else {
          errorEl.textContent = 'Something went wrong. Please try again.';
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Subscribe &amp; Continue';
        }
      } catch (err) {
        console.error('Subscription error:', err);
        errorEl.textContent = 'Connection error. Please try again.';
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Subscribe &amp; Continue';
      }
    });

    // Prevent clicks from falling through to canvas
    overlayEl.addEventListener('pointerdown', (e) => e.stopPropagation());
    overlayEl.addEventListener('click', (e) => e.stopPropagation());

    // Animate in
    requestAnimationFrame(() => {
      overlayEl.classList.add('sub-gate--visible');
    });
  }

  function showCheckEmailAndClose() {
    if (!overlayEl) return;
    const card = overlayEl.querySelector('.sub-gate__card');

    // Build "check your email" state using safe DOM methods
    card.textContent = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'sub-gate__success';

    const star = document.createElement('span');
    star.className = 'sub-gate__star';
    star.textContent = '✦';

    const heading = document.createElement('h2');
    heading.className = 'sub-gate__title';
    heading.textContent = 'You\'re in — temporarily!';

    const body = document.createElement('p');
    body.className = 'sub-gate__copy';
    body.style.marginTop = '12px';
    body.textContent = 'You\'ve unlocked the map for now. Click the link in your email for full access.';

    wrapper.appendChild(star);
    wrapper.appendChild(heading);
    wrapper.appendChild(body);
    card.appendChild(wrapper);

    // Close after 6s — give them time to read the instruction
    setTimeout(() => closeModal(), 6000);
  }

  function closeModal() {
    if (!overlayEl) return;
    overlayEl.classList.remove('sub-gate--visible');
    overlayEl.addEventListener('transitionend', () => {
      overlayEl.remove();
      overlayEl = null;
    }, { once: true });
  }

  // --- Subscription submission ---

  async function subscribe({ firstName, email, country }) {
    const params = new URLSearchParams(window.location.search);

    const response = await fetch(SUBSCRIBE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        email,
        country,
        utmSource: params.get('utm_source') || 'constellation',
        utmCampaign: params.get('utm_campaign') || 'constellation_subscribe',
      }),
    });

    const result = await response.json();
    // pending: 'verify_email' means the magic link email was sent
    return result.success && (result.pending === 'verify_email' || result.success);
  }

  // --- Public API ---

  function handleInteraction() {
    if (subscribed || overlayEl) return;

    clickCount++;
    saveClicks();

    if (!dismissed && clickCount >= SOFT_THRESHOLD) {
      // Soft gate — dismissible
      createModal(false);
    } else if (dismissed && clickCount >= HARD_THRESHOLD) {
      // Hard gate — no dismiss
      createModal(true);
    }
  }

  function init() {
    loadState();
    if (subscribed) return; // already subscribed, no gate needed

    // If they had prior clicks from a previous session, keep counting from there
    // Listen for selection events (emotions + needs)
    on('selection:changed', (data) => {
      if (data.mode !== 'idle') {
        handleInteraction();
      }
    });
  }

  return { init };
}
