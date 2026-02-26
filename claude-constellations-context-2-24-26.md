# Emotion Constellation — Claude Context (updated Feb 25, 2026)

## Related Projects — READ BEFORE MAKING CHANGES

This app is part of the **Emotion Rules book ecosystem** — five interconnected apps sharing a Firebase project, Cloud Functions, and Pardot integrations. Changes here (especially to `firebase.json`, `firestore.rules`, `storage.rules`, or `functions/index.js`) can break other apps.

**Before modifying shared infrastructure, read these files:**
- **Ecosystem overview:** `/Users/joshuafreedman/Documents/emotion-rules-quiz/emotion-rules-quiz-app/EMOTION-RULES-ECOSYSTEM.md`
- **Quiz/Forms/Admin context:** `/Users/joshuafreedman/Documents/emotion-rules-quiz/emotion-rules-quiz-app/CLAUDE-context-emotion-rules-quiz-2-25-26.md`
- **Wisdom Wheel context:** `/Users/joshuafreedman/Documents/wheel/CLAUDE-wheel-context-2-20-26.md`

**Key cross-app risks from this project:**
- CSP headers in `firebase.json` affect all Firebase-hosted apps (quizzes, signup form, constellation). The Feb 24 security hardening broke iframes and Firebase Auth across apps.
- Cloud Functions in `functions/index.js` serve multiple apps (`submitToPardot` is shared).
- `npm run build` in the quiz app wipes `build/constellation/` — always rsync after.

---

## What This Project Is

"Emotion Constellation" is an interactive, non-dualistic visualization of emotions and human needs from *Emotion Rules* by Joshua Freedman. The core insight: emotions aren't opposites — they're co-messengers serving shared human needs. Fear and Trust both serve Safety. Loneliness and Love both serve Belonging. The visualization makes this interconnectedness visible and explorable, with a Claude AI chat guide for personal exploration.

**Live at (canonical):** https://emotion-rules.web.app/constellation
**Live at (legacy, still active):** https://emotion-rules-quiz.web.app/constellation
**Locale URLs:** https://emotion-rules.web.app/constellation/fr (any 2-letter code)
**Constellation repo:** https://github.com/eqjosh/emotion-constellations
**Quiz app (Firebase host):** /Users/joshuafreedman/Documents/emotion-rules-quiz/emotion-rules-quiz-app/

## Tech Stack

- **WebGL2 + TWGL.js** — Three shader programs: aurora (fullscreen noise curtains), particles (instanced glow quads), connections (24-segment sinusoidal strips)
- **D3-force v3** — Physics simulation (math only, never touches DOM). Custom gravity force with `sqrt(alpha)` drift trick for persistent organic motion
- **Vite 6 + vite-plugin-glsl** — Build with GLSL `#include` imports, `base: '/constellation/'`, `appType: 'spa'`
- **Vanilla JS + ES modules** — No framework. Event bus pub/sub for decoupling
- **Firebase Hosting (multi-site)** — Deployed as `/constellation/` route within the `emotion-rules-quiz` Firebase project, served from **two hosting sites**: `emotion-rules-quiz` and `emotion-rules`. Both deploy from the same `build/` directory. SPA rewrite: `/constellation/**` → `/constellation/index.html`
- **Firebase Cloud Functions v2** — `constellationChat` SSE streaming endpoint with Anthropic SDK; `submitToPardot` proxy for Pardot form handler submissions; `constellationSubscribe` for subscription + magic link email; `constellationVerifyToken` for email link token redemption
- **SendGrid** — Email delivery (used by quiz app, pattern available for constellation subscription emails)
- **Pardot** — Marketing automation. Constellation subscription form submits to Pardot form handler via Cloud Function proxy

Bundle: ~115KB JS (~41KB gzipped) + ~19KB CSS (~4KB gzipped). 60fps desktop, 30fps+ mobile.

## What's Been Built (Phases 1–9)

### Phase 1: Living Starscape
- Aurora curtain effect using layered simplex noise FBM with anisotropic sampling
- Ambient green aurora layer (`ambientAurora()` in `aurora.frag`)
- 39 emotion particles drifting in gravitational fields of 6 need nodes (Meaning, Belonging, Achievement, Safety, Autonomy, Growth)
- Sinusoidal connection threads (dual sine wave, width taper, white-blended luminous core)
- Cosmic drift force with per-particle spatial phase variation
- Need labels (HTML overlay, CSS absolute positioned, tracked each frame)

### Phase 2: Interaction Depth
- **Click/tap emotion star** → glows brighter (1.6x), grows (1.4x), threads brighten, linked need aurora intensifies (1.8x), unrelated nodes dim (0.12x). Floating inquiry questions appear near the star. Wisdom icon (✦) pulses.
- **Click need label** → all linked emotions highlight (1.2x), unrelated dim, description text + HUD bar with explorable pills
- **Hover** (desktop only) → subtle 1.15x brightness/1.1x size, cursor pointer. Suppressed on touch devices.
- **Click background** → smooth 650ms exit transition back to idle
- **Toggle** — clicking same node again deselects

### Phase 2b: HUD-Style Info Display
- **Floating inquiry text** — Questions near emotion stars with need-colored text glow, dark rounded backdrop
- **Staggered appearance** — Bridge emotions show 2 inquiries fading in 400ms apart
- **Leader lines** — Dashed SVG lines connecting inquiry text to its star
- **Need descriptions** — Selecting a need shows description below it
- **HUD bar** — Bottom bar with need title + navigable emotion pills
- **Collision detection** — AABB overlap system prevents text overlap

### Phase 3: Claude AI Chat Integration (Cloud Function)
- `constellationChat` Cloud Function in `emotion-rules-quiz-app/functions/index.js`
- SSE streaming via Anthropic SDK (`anthropic.messages.stream()`)
- Dual-model fallback: Sonnet → Haiku (configurable via Firestore `constellationConfig/modelConfig`)
- Rate limiting: 20 messages/hour per IP (SHA-256 hashed, in-memory Map with cleanup)
- Input validation: max 2000 chars/message, max 24 messages/request, system prompt max 8000 chars
- Dual timeouts: first-chunk (6s) + idle stall (15s)
- Fire-and-forget metadata logging to `constellationConversations` (no message content stored)
- CORS whitelist: emotion-rules-quiz.web.app, emotion-rules.web.app, *.firebaseapp.com, 6seconds.org, localhost

### Phase 4: Chat Client + Unified Panel
- **Chat client** (`src/chat/chat-client.js`) — fetch + ReadableStream SSE parser, AbortController, 10-turn cap, event bus integration
- **System prompt** (`src/chat/system-prompt.js`) — ~1,800 char template emphasizing brevity (2-3 sentences max), grounded in Emotion Rules framework, with emotion context injection. Locale-aware: instructs Claude to respond in the user's language.
- **Starter prompts** (`src/chat/starter-prompts.js`) — 2-3 contextual conversation starters per emotion, using i18n templates from `ui-strings.js`
- **Unified wisdom panel** (`src/ui/wisdom-panel.js`) — Full-height right panel, state machine: idle → wisdom (word-by-word typing) → chat (streaming bubbles)
- **Wisdom icon** (✦) — Pulsing icon near selected emotion, click to open panel
- Panel sizing: 30% width (320-420px) desktop, 60vh bottom drawer mobile
- Privacy notice shown once, auto-scroll, loading dots, error handling

### Phase 5: Admin Panel
- **Model Config editor** (`ConstellationConfigEditor.js`) — Firestore `constellationConfig/modelConfig` form
- **Conversations viewer** (`ConstellationConversationsView.js`) — Table of metadata with stats (total, most explored emotion, avg messages)
- Integrated into existing admin sidebar under "Constellation" section with Sparkles icon

### Phase 6: Subscription Gate
- **Two-stage gate** — Soft gate at 5 clicks (dismissible with "Maybe later"), hard gate at 8 clicks (no dismiss)
- **Interaction tracking** — Counts emotion/need clicks via `selection:changed` events, persists click count + dismissed/subscribed state in localStorage (`constellation_sub` key)
- **Subscription modal** (`src/ui/subscription-gate.js`) — Glassmorphic overlay card collecting first name, email, country
- **Country dropdown** — Uses shared `/js/countries.js` from quiz app (same Firebase hosting), loaded via `<script>` tag in `index.html`. Exposes `window.COUNTRIES`, `window.PRIORITY_COUNTRIES`, `window.detectCountryFromTimezone()`. Priority countries (US, UK, Canada, Australia, India) shown at top with separator; auto-detects country from browser timezone.
- **Pardot integration** — On form submit, `constellationSubscribe` Cloud Function submits to Pardot fire-and-forget, then sends a magic link email via SendGrid. The client never sends `pardotUrl` — it's hardcoded server-side.
- **Magic link email verification** — `constellationSubscribe` generates a 32-byte crypto token, stores it in Firestore `constellationVerificationTokens/{token}` with 24h TTL, and emails a link to `https://emotion-rules.web.app/constellation?verify_token={token}`. `constellationVerifyToken` validates the token via a Firestore transaction (checks existence, expiry, `used` flag) and marks it consumed.
- **Post-submit UX** — After submitting the form, gate shows "Check your email — We sent you a confirmation link." for 4s then closes. Sets `dismissed: true` + `pendingVerification: true` in localStorage. Does NOT set `subscribed: true` yet (that waits for email link click).
- **Token redemption in `main.js`** — On page load, `handleVerificationToken()` reads `?verify_token=` from the URL, immediately cleans the URL via `history.replaceState`, POSTs to `constellationVerifyToken`, and on success writes `{ subscribed: true, subscribedAt, verifiedViaEmail: true }` to localStorage. Shows a brief "✦ Access Granted" overlay. This runs before `subscriptionGate.init()` reads localStorage state.
- **✅ 10-day access expiry** — `loadState()` in `subscription-gate.js` compares `subscribedAt` age against `ACCESS_EXPIRY_MS = 10 * 24 * 60 * 60 * 1000`. If expired, wipes the localStorage entry and treats as a fresh visitor.
- **GDPR consent** — Passive text below submit button with links to 6seconds.org privacy policy.
- **Returning subscribers** — `subscribed: true` in localStorage (not expired) bypasses gate entirely.

### Phase 7: Full Multilingual / i18n Support (Feb 22–23, 2026)
- **11 supported locales**: English, Spanish, Korean, Chinese, Arabic, Hebrew, Japanese, French, Portuguese, Italian, German
- **Locale detection priority**: URL path → localStorage → browser language
- **URL-based locale routing** — `/constellation/es` for Spanish, `/constellation/fr` for French, etc. Uses `history.replaceState` so no page reload. The bare `/constellation/` auto-detects and updates the URL.
- **Language selector** (`src/ui/language-selector.js`) — Dropdown in the UI showing native language labels (e.g. "Français", "日本語"). Emits `locale:changed` event on selection.
- **Locale management** (`src/core/locale.js`) — `initLocale()` checks URL path first, then localStorage, then browser. `setLocale()` persists to localStorage, updates URL via `history.replaceState`, and emits `locale:changed`.
- **Per-locale constellation data** — Separate JSON files per locale: `constellation-en.json`, `constellation-es.json`, `constellation-fr.json`, etc. Each contains all 6 need labels/descriptions and 39 emotion labels/inquiry texts, fully translated.
- **Wisdom data** (`public/data/emotion-constellation-more-info-data.json`) — Single multilingual file with locale keys for every field: label, essence, signal, reflection, bookRef, plus need inquiry text. 37 emotions × 11 locales. `buildWisdomForLocale(locale)` extracts the right locale at runtime.
- **UI strings** (`src/core/ui-strings.js`) — All user-facing chrome text translated for all 11 locales: welcome panel, wisdom panel, starter prompts, HUD bar, entry hint, chat messages, subscription gate, book credit, language selector, about panel. Accessed via `t('key.path')` with optional `{variable}` interpolation.
- **RTL support** — Arabic and Hebrew locale codes supported. `document.documentElement.lang` is set for proper font/direction rendering.
- **Event-driven refresh** — On `locale:changed`: constellation data reloads, sim node labels update, wisdom data rebuilds, wisdom panel refreshes (welcome or wisdom state), labels re-render, HUD bar updates, selection re-triggers so all visible text updates.
- **Chat locale awareness** — System prompt includes locale so Claude responds in the user's language.

### Phase 8: Security Hardening (Feb 24, 2026)

All Critical and most High findings from the Security Audit were addressed:

- **SSRF fix** (`submitToPardot`) — Hardcoded Pardot URL server-side; client no longer sends `pardotUrl`. Added CORS origin whitelist (`pardotCorsHandler`). Added `PARDOT_ALLOWED_FIELDS` Set — any field not on the whitelist is silently stripped before forwarding.
- **System prompt moved server-side** — Full prompt templates (`CONSTELLATION_SYSTEM_PROMPT_TEMPLATE`, `CONSTELLATION_WELCOME_PROMPT_TEMPLATE`) now live in `functions/index.js`. `buildConstellationSystemPrompt(emotionContext, locale)` assembles the final prompt. `validateEmotionContext()` and `sanitizeContextText()` guard against injection. Client sends structured `{ emotionContext, locale }` — never raw prompt text.
- **Security headers** added to `firebase.json`: CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- **Firestore schema validation** — `quizResults` requires `['email', 'submittedAt']` with type checks and `size() <= 20`; `quickQuizResults` requires `['submittedAt']` with same guards. Unauthenticated `update` on `quizResults` removed.
- **Storage rules** restricted — `/receipts` now requires `request.auth != null`, content type must match `image/.*|application/pdf`, size < 10MB.
- **`hud-bar.js` innerHTML fix** — `showEmotion()` and `showNeed()` fully rewritten using `createElement`/`textContent`. No user-facing data ever touches `.innerHTML`.
- **Firestore-backed rate limiting** — Two-layer: in-memory Map as L1 (fast), Firestore `runTransaction` on `constellationRateLimit/{key}` as L2 for cross-instance accuracy. Fails open (Firestore error does not block legitimate users).
- **New Firestore collections** (server-only via Admin SDK): `constellationVerificationTokens` and `constellationRateLimit` — both have `allow read, write: if false` in Firestore rules.

**Status: Deployed Feb 24, 2026.** Full `firebase deploy` completed — all 6 functions updated/created, Firestore rules, Storage rules, and hosting all live.

### Phase 9: UX Polish + Multi-site Hosting (Feb 24, 2026)

#### iframe Embedding Fix
- **Root cause**: Security hardening (Phase 8) added `X-Frame-Options: DENY` and `frame-ancestors 'none'` to CSP, which broke existing embeds at `https://www.6seconds.org/emotionrules/quiz/` and `https://www.6seconds.org/emotionrules/emotion-rules-special-offers/`.
- **Fix**: Removed `X-Frame-Options` header entirely (it has no domain allowlist syntax — it's all-or-nothing). Updated CSP `frame-ancestors` from `'none'` to `'self' https://6seconds.org https://www.6seconds.org`.
- **Key lesson**: `X-Frame-Options` cannot allowlist specific domains. Must use CSP `frame-ancestors` for fine-grained iframe control. Both headers must be consistent — having one block all is enough to deny the embed.

#### Copyright Notice Readability
- `font-size: 10px` → `11px`
- `color` opacity: `0.18` → `0.38`
- Link opacity: `0.25` → `0.45`, hover `0.55` → `0.75`

#### "About this App" Panel
- Added `<button class="copyright-about-btn">` to the copyright line, rendered by `updateCopyright()` in `main.js`
- Click triggers `emit('about:open', {})` via event delegation on `copyrightEl` (survives locale re-renders)
- `wisdom-panel.js` subscribes to `about:open` and calls `showAbout()`
- `showAbout()` sets `panelState = 'about'`, clears the panel, renders two translated paragraphs + 3 starter question buttons
- **DOM order fix**: Starter buttons are appended inside `messagesEl` (after the text) as a new `div.wisdom-panel__starters`, NOT into the global `startersEl`. This prevents buttons appearing above text due to `startersEl` being declared before `messagesEl` in the DOM.
- **Locale-aware**: `panelState === 'about'` branch in locale change handler re-renders About panel in new language
- **Fully translated**: `about.btnLabel`, `about.p1` (with `{book}` link), `about.p2`, `about.starter1/2/3` — all 11 locales in `ui-strings.js`

#### HUD Gradient Backdrop
- Added gradient to `.hud-bar--visible` so emotion labels don't bleed through:
  ```css
  background: linear-gradient(to top, rgba(8, 5, 18, 0.78) 0%, rgba(8, 5, 18, 0) 100%);
  ```

#### Bug Fix: `emit is not defined`
- `main.js` only imported `on` from `./core/events.js`, not `emit`. Fixed: `import { on, emit } from './core/events.js'`

#### Multi-site Firebase Hosting
- Created second hosting site `emotion-rules` in the same `emotion-rules-quiz` Firebase project
- Set up deploy targets in `.firebaserc`: `quiz` → `emotion-rules-quiz`, `constellation` → `emotion-rules`
- Updated `firebase.json` from a single hosting object to an **array of two configs**, each with a `target` field, both pointing to the same `build/` directory
- Added both `https://emotion-rules-quiz.web.app` and `https://emotion-rules.web.app` to CSP `script-src`
- Now a single `firebase deploy --only hosting` deploys to **both URLs simultaneously**
- `emotion-rules.web.app/constellation` is the new **canonical URL** for social sharing

#### OG / Social Meta Tags Updated
- `og:url` → `https://emotion-rules.web.app/constellation/`
- `og:image` → `https://emotion-rules.web.app/constellation/images/og.jpeg`
- `twitter:image` → `https://emotion-rules.web.app/constellation/images/og.jpeg`
- Old URL (`emotion-rules-quiz.web.app`) remains fully functional — just no longer the OG canonical

### Post-Security-Hardening Bug Fixes (Feb 25, 2026)

Several issues discovered after Phase 8/9 went live, all caused by the new CSP and storage rules breaking existing functionality:

#### `emotion-rules-quiz.web.app/constellation` returning 404
- **Root cause**: A subsequent quiz app deploy (CSP header fix) ran `firebase deploy --only hosting:quiz` after `npm run build` had wiped `build/constellation/` — rsync step was skipped.
- **Detection**: `curl -sI https://emotion-rules-quiz.web.app/constellation` → HTTP 404. `emotion-rules.web.app/constellation` still worked (each Firebase Hosting target stores its own independent deployment snapshot).
- **Fix**: `rsync -a --delete dist/ build/constellation/` then redeploy.

#### CSP blocking Firebase Auth token refresh
- **Root cause**: Phase 8 CSP `connect-src` omitted Firebase Auth endpoints.
- **Cascade**: Auth can't refresh → Firestore receives `auth/network-request-failed` → goes offline → quiz results/confetti fail.
- **Fix**: Added `https://securetoken.googleapis.com`, `https://identitytoolkit.googleapis.com`, `https://firebasestorage.googleapis.com`, `https://emotion-rules-quiz.firebasestorage.app` to `connect-src`. Added `worker-src blob:` for canvas-confetti web workers.

#### Bonus form (`/signup.html`) — `storage is not defined`
- **Root cause**: `signup.html` loads Firebase compat SDKs from `https://www.gstatic.com/firebasejs/...`. Phase 8 CSP `script-src` didn't include `gstatic.com`, blocking the scripts silently.
- **Fix**: Added `https://www.gstatic.com` to `script-src` in both hosting configs in `firebase.json`.

#### Bonus form — `storage/unauthorized` on upload + `getDownloadURL()`
- **Root cause**: Phase 8 restricted `/receipts` storage rule to `request.auth != null`. The form is public-facing — submitters are unauthenticated.
- **Attempted fix**: `signInAnonymously()` → failed: Anonymous Authentication isn't enabled in the Firebase project (`auth/admin-restricted-operation`).
- **Final fix**: Changed `/receipts` storage rules to public write (10MB + image/PDF constraints) AND public read (`allow read: if true`). Public read is required because `BookSignupsView.js` uses `receiptUrl` directly in `img src`, `iframe src`, and `a href` — plain browser requests that carry no Firebase auth token. Even admins can't make browser-native elements pass auth headers.
- **Security model**: Filenames include `timestamp_email_filename` (unguessable). Firestore `submissions` collection (which contains the URLs) is admin-read-only.

### Visual Polish
- **Entry animation** — Two-wave emotion fade-in: first ~20 emotions drift in over 1.2s, second ~19 follow 1.3s later. Needs fade in first (staggered 100ms each), connections after both waves settle. Total reveal ~4.5s.
- **Ambient rotation** — Entire constellation slowly rotates (~0.06°/s). Need positions orbit center, emotions follow via gravity. Pauses on selection, resumes with smoothstep ease-in.
- **Label collision avoidance** — Emotion labels push away from nearby need labels (38px threshold)
- **Need label visibility** — Font-weight 500 (600 selected), opacity 0.78
- **Selected need background** — `rgba(21, 15, 33, 0.82)` for readable backdrop
- **Chat panel transparency** — `rgba(21, 15, 33, 0.45)` with 20px blur (glassmorphic)
- **Click detection fix** — Removed `input:consume-tap` event that was eating clicks. `stopPropagation()` on DOM siblings is sufficient.
- **Hit radius** — Emotion hit radius bumped to 32px for better touch targets

---

## Key Files

### Core
- `src/main.js` — Entry point, wires everything up via event bus (including subscription gate, locale:changed handler, `handleVerificationToken()`, About button event delegation). Import: `import { on, emit } from './core/events.js'` — both are needed.
- `src/core/constants.js` — All tuning params (AURORA, PARTICLES, CONNECTIONS, PHYSICS, LAYOUT, INTERACTION, ENTRY, ROTATION)
- `src/core/events.js` — Simple pub/sub: `on(event, cb)`, `emit(event, data)`, `off(event, cb)`
- `src/core/data-loader.js` — `loadConstellationData(locale)` fetches `constellation-{locale}.json`, falls back to English
- `src/core/locale.js` — Locale state management. `initLocale()` (URL → localStorage → browser), `setLocale(code)` (persists + updates URL + emits event), `getLocale()`. Supported: en, es, ko, zh, ar, he, ja, fr, pt, it, de
- `src/core/ui-strings.js` — `t(key, vars)` function for translated UI text. All 11 locales, dot-path keys, `{variable}` interpolation. Falls back to English. Keys include `about.btnLabel`, `about.p1`, `about.p2`, `about.starter1/2/3`.
- `src/core/entry-animation.js` — Two-wave entry sequence with per-need and per-emotion staggered progress

### Simulation
- `src/simulation/force-layout.js` — D3-force setup. Need nodes in organic ring (fixed positions, rotated each tick). Emotion nodes free-floating. Ambient rotation with pause/resume. `getConnections()` returns connection data array.
- `src/simulation/forces.js` — Custom need-gravity force with cosmic drift

### Rendering
- `src/renderer/pipeline.js` — Frame loop: sim.tick() → selectionState.tick(dt) → entryAnimation.tick() → apply per-emotion visuals → clear → aurora → connections → particles → labels → floatingInquiries → wisdomPanel icon
- `src/renderer/aurora.js` — Fullscreen quad with `u_needIntensities[6]` uniform
- `src/renderer/particles.js` — Instanced quads, reads displayColor/displaySize per frame
- `src/renderer/connections.js` — 24-segment instanced strips
- `src/renderer/context.js` — WebGL2 context, ResizeObserver, DPR cap at 2x
- `src/renderer/need-glow.js` — Radial glow effect behind need labels

### Shaders
- `src/shaders/aurora.frag` — `auroraCurtain()` per need + `ambientAurora()`. Perceptual luminance correction for warm colors.
- `src/shaders/connection.vert/frag` — Sinusoidal displacement, shimmer, endpoint fade
- `src/shaders/particle.vert/frag` — Glow with bright core
- `src/shaders/need-glow.vert/frag` — Radial glow behind needs
- `src/shaders/noise/simplex3d.glsl` + `fbm.glsl`

### Chat
- `src/chat/chat-client.js` — SSE streaming client, AbortController, 10-turn cap, event bus events. Sends structured `{ emotionContext, locale, messages, emotionId }` to the Cloud Function — no raw system prompt. `buildEmotionContextPayload()` pre-resolves fellow messenger IDs to labels grouped by `needId`.
- `src/chat/system-prompt.js` — Client-side module still exists but is no longer used for chat requests. System prompt is now built server-side in `functions/index.js`. This file can be cleaned up or repurposed.
- `src/chat/starter-prompts.js` — `generateStarterPrompts()` → 2-3 contextual starters using `t()` i18n templates

### Interaction
- `src/interaction/selection-state.js` — State machine (idle/emotion/need), 650ms transitions, emits `selection:changed`
- `src/interaction/hit-test.js` — `findHit(x, y)` with 32px emotion / 65px need hit radius
- `src/interaction/input-handler.js` — Pointer events on canvas, emits input events

### UI
- `src/ui/labels.js` — HTML labels, need labels clickable, emotion labels with per-element entry opacity, collision avoidance push-apart from need labels
- `src/ui/floating-inquiries.js` — Inquiry text near stars, leader lines, collision detection
- `src/ui/hud-bar.js` — Bottom HUD bar with navigable pills
- `src/ui/wisdom-panel.js` — Unified wisdom + chat panel. States: `idle` / `welcome` / `wisdom` / `chat` / **`about`**. Word-by-word typing, streaming chat. `showAbout()` renders About content with starters appended inside `messagesEl` (not global `startersEl`). On `locale:changed`, refreshes content for whichever state is active.
- `src/ui/subscription-gate.js` — Subscription gate modal. Two-stage (soft/hard). Tracks clicks in localStorage. `ACCESS_EXPIRY_MS = 10 days`. `loadState()` checks `subscribedAt` age; wipes and resets on expiry.
- `src/ui/help-icon.js` — Windrose help icon, opens welcome panel. Locale-aware tooltip.
- `src/ui/language-selector.js` — Language selector dropdown showing native labels. Calls `setLocale()` on change.

### Data
- `public/data/constellation-{locale}.json` — Per-locale data files (en, es, ko, zh, ar, he, ja, fr, pt, it, de). 6 needs, 39 emotions. Every link has a translated `inquiry` question. Loaded by `data-loader.js`.
- `public/data/emotion-constellation-more-info-data.json` — Single multilingual wisdom file. Each emotion has `label`, `readMore.essence`, `readMore.signal`, `readMore.reflection`, `readMore.bookRef` — all with per-locale keys. Also includes need labels/descriptions with locale keys.
- Country list: loaded at runtime from `/js/countries.js` (shared file in quiz app's `public/js/`). NOT bundled — loaded via `<script>` tag. Globals: `COUNTRIES`, `PRIORITY_COUNTRIES`, `detectCountryFromTimezone()`.

### Styles
- `styles/main.css` — Full styling: canvas, labels, floating inquiries, HUD bar (with gradient backdrop on `.hud-bar--visible`), wisdom panel (full-height right + mobile bottom drawer), entry hint, copyright (11px, 0.38 opacity), `.copyright-about-btn` styles, `.wisdom-panel__message--assistant a` link styles, subscription gate modal (glassmorphic overlay, form, success state, dismiss button), language selector

### Firebase Config
- `emotion-rules-quiz-app/firebase.json` — **Array of two hosting configs** (target: `quiz` and target: `constellation`), both pointing to `build/`. CSP allows scripts from both `emotion-rules-quiz.web.app` and `emotion-rules.web.app`. `frame-ancestors` allows `'self' https://6seconds.org https://www.6seconds.org`. No `X-Frame-Options` header.
- `emotion-rules-quiz-app/.firebaserc` — Deploy targets: `quiz` → `emotion-rules-quiz`, `constellation` → `emotion-rules`. Default project: `emotion-rules-quiz`.

---

## Deployment

The constellation is hosted as a sub-route within the emotion-rules-quiz Firebase project, served from **two hosting sites simultaneously**.

```bash
# Standard deploy workflow (frontend changes only)
cd /Users/joshuafreedman/Documents/emotion-constellations
npm run build

# IMPORTANT: Use rsync, not cp, to avoid stale files
rsync -a --delete dist/ /Users/joshuafreedman/Documents/emotion-rules-quiz/emotion-rules-quiz-app/build/constellation/

# Deploy to BOTH hosting sites in one command
cd /Users/joshuafreedman/Documents/emotion-rules-quiz/emotion-rules-quiz-app
firebase deploy --only hosting

# Verify (always check after deploy — CDN can cache old bundles)
curl -s https://emotion-rules.web.app/constellation/ | grep 'assets/index'
# Should show the new asset hash from the build output

# Full deploy (when Cloud Functions also changed)
firebase deploy
```

> ⚠️ **Always use `rsync -a --delete`** — never `cp -r` or `rm -rf + cp`. The `--delete` flag removes old files that no longer exist in `dist/`, preventing stale asset hashes from being served. This was the root cause of a CDN caching issue where old JS was served even after a new deploy.

> ⚠️ **Always verify with `curl` after deploying** — check that the asset hash in the page source matches the hash shown in the build output. Firebase CDN can sometimes serve a cached version. If hashes don't match, wait 30–60 seconds and check again.

**Firebase config** (`firebase.json`): Array of two hosting configs (targets `quiz` and `constellation`). Both use the same `build/` directory. Rewrites `/constellation` and `/constellation/**` → `/constellation/index.html` before the SPA catch-all. This enables locale URL routing (`/constellation/fr`, etc.).

**Environment variables** (in `.env.production` and `.env.development`):
- `VITE_CHAT_ENDPOINT` — Cloud Function URL for chat
- `VITE_PARDOT_PROXY` — Cloud Function URL for Pardot form handler proxy
- `VITE_SUBSCRIBE_ENDPOINT` — Cloud Function URL for `constellationSubscribe`
- `VITE_VERIFY_ENDPOINT` — Cloud Function URL for `constellationVerifyToken`

**Secrets**: `ANTHROPIC_API_KEY` and `SENDGRID_API_KEY` configured via `firebase functions:secrets:set`.

---

## Key Lessons Learned

### 1. Deploy Pipeline: Always rsync, Always Verify
The correct deploy sequence is:
1. `npm run build` (check the asset hash in the output)
2. `rsync -a --delete dist/ build/constellation/` ← **not** `cp -r`
3. `firebase deploy --only hosting`
4. `curl -s https://emotion-rules.web.app/constellation/ | grep assets/index` ← verify hash matches

**Why rsync**: `cp -r` doesn't remove files that no longer exist in `dist/`. Old asset files accumulate. The browser may reference and load stale JS/CSS bundles. `rsync --delete` ensures `build/constellation/` is an exact mirror of `dist/`.

**Why curl verification**: Firebase CDN caches aggressively. After a deploy, the edge nodes may still serve the previous version for a short window. If `curl` shows the old asset hash, wait 30–60s and check again before debugging.

**⚠️ Quiz app `npm run build` also wipes `build/constellation/`**: If a deploy is triggered from the **quiz app** side (e.g. CSP fix, quiz code change), CRA's build step deletes and recreates the entire `build/` directory, erasing `build/constellation/`. The rsync step must be re-run even when the constellation app hasn't changed. Skipping it causes `emotion-rules-quiz.web.app/constellation` to 404, while `emotion-rules.web.app/constellation` continues to work (each Firebase Hosting target stores its own deployment snapshot independently).

### 2. `X-Frame-Options` Has No Allowlist
`X-Frame-Options: DENY` blocks all iframes with no way to permit specific origins. To allow embedding only from certain domains:
- **Remove `X-Frame-Options` entirely** from `firebase.json`
- **Use CSP `frame-ancestors`** instead: `frame-ancestors 'self' https://6seconds.org https://www.6seconds.org`

If both headers are present and one says `DENY`, the embed is blocked regardless of the other header. Check both when debugging iframe issues.

### 3. Import What You Use — Including `emit`
When a module both listens for events (`on`) and fires them (`emit`), both must be imported:
```js
import { on, emit } from './core/events.js';  // ✅
import { on } from './core/events.js';         // ❌ — emit is not defined at runtime
```
This is a silent failure at import time but throws `ReferenceError: emit is not defined` the moment the function is called. Check the import line first when you see this error.

### 4. DOM Order Controls Visual Order
In a panel with a fixed DOM structure, appending to an element that's declared **earlier in the HTML** will always render **above** elements declared later — even if you append content to it last in JS.

The wisdom panel had `startersEl` before `messagesEl` in the DOM. Appending starter buttons to the global `startersEl` always placed them visually above the message text, regardless of JS execution order.

**Fix pattern**: Don't reuse a global container from a different position. Create a **local element** and append it where you need it:
```js
// Instead of: startersEl.appendChild(btn)  ← wrong position in DOM
const localStarters = document.createElement('div');
messagesEl.appendChild(aboutMsg);
messagesEl.appendChild(localStarters);  // ← appears after text ✅
```

### 5. Event Delegation for Dynamic UI Elements
When a UI element (like the About button in the copyright line) is re-rendered on locale change, any event listeners attached to it are destroyed. Use event delegation on the **stable parent** instead:
```js
// Attaches once to the stable copyrightEl wrapper
copyrightEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('copyright-about-btn')) {
    emit('about:open', {});
  }
});
```
This survives `updateCopyright()` re-renders because the listener is on `copyrightEl`, not the button itself.

### 6. Multi-site Firebase Hosting Setup
To serve the same app from two `*.web.app` subdomains in the same project:
1. `firebase hosting:sites:create <new-site-id>` — creates the site
2. `firebase target:apply hosting <target-name> <site-id>` — for each site
3. Update `firebase.json`: change `"hosting": { ... }` to `"hosting": [ { "target": "a", ... }, { "target": "b", ... } ]`
4. Update `.firebaserc`: set `"projects": { "default": "<project-id>" }` if not already set
5. `firebase deploy --only hosting` deploys to **all targets at once**

Both sites serve identical content from the same `build/` directory. The CSP `script-src` should include both `*.web.app` domains.

### 7. Editing Files With Non-ASCII Characters
When using grep or edit tools on files containing Arabic, Hebrew, or other non-ASCII text, **never use `\uXXXX` escape sequences** as the search string — the file stores actual Unicode code points. Use native character searches instead (copy-paste the actual characters, or use a byte-level search tool).

### 8. Hebrew File Edits
When editing the Hebrew locale in `ui-strings.js`, the text is stored as actual Unicode characters (not escape sequences). Use `grep` with the actual Hebrew text (copied from the file read output) to locate the right string before editing.

### 9. Firebase Storage Compat SDK Requires `gstatic.com` in CSP
The Firebase compat SDK libraries (`firebase-app-compat.js`, `firebase-storage-compat.js`, etc.) are loaded from `https://www.gstatic.com/firebasejs/...`. Without `https://www.gstatic.com` in `script-src`, the scripts are silently blocked. Any variable initialized from those SDKs (e.g. `const storage = firebase.storage()`) will be `undefined`, producing confusing runtime errors like "storage is not defined". Always include `https://www.gstatic.com` in `script-src` when using Firebase compat CDN scripts.

### 10. `getDownloadURL()` Also Requires Storage Read Permission
Calling `storageRef.getDownloadURL()` in code (not via browser URL bar) still checks the Firebase Storage `read` rule. If read requires `request.auth != null` and the caller is unauthenticated, it throws `storage/unauthorized` — the same error as a blocked upload. When a public-facing form needs to store a download URL, either make the storage path publicly readable or rearchitect to store just the path and resolve the URL server-side.

### 11. Browser-Native Elements Send No Firebase Auth Token
`img src`, `iframe src`, and `a href` make plain HTTP requests — they include no Firebase auth headers. If an admin panel displays receipt images/PDFs in a modal using these elements, the file must be publicly readable in storage rules. Authenticated Firebase SDK calls and browser-native element fetches are completely separate auth channels.

### 12. Firebase Anonymous Auth Must Be Explicitly Enabled
`firebase.auth().signInAnonymously()` throws `auth/admin-restricted-operation` if Anonymous Authentication has not been enabled in the Firebase Console (Authentication → Sign-in methods → Anonymous). It is disabled by default in all Firebase projects. If anonymous auth isn't enabled, the alternative is to relax storage rules for public-facing paths rather than relying on anonymous sessions.

### 13. `signup.html` Changes Must Be Manually Copied to `build/`
`public/signup.html` and `public/js/signup-app.js` are static files — CRA copies them verbatim during `npm run build`. If you edit these files WITHOUT running `npm run build`, you must manually copy them to `build/` before deploying:
```bash
cp public/signup.html build/signup.html
cp public/js/signup-app.js build/js/signup-app.js
```
Then rsync constellation and deploy as normal. Running a full `npm run build` also works but requires the rsync step afterward.

---

## Important Design Decisions & Gotchas

1. **Simulation space = screen space** (CSS pixels). No coordinate transforms needed for hit testing.
2. **Need nodes have fixed positions** (`fx`/`fy`) that rotate slowly. D3-force copies these to `x`/`y`.
3. **Additive blending** for all WebGL layers. Aurora: pure additive (ONE,ONE), particles/connections: alpha-additive (SRC_ALPHA,ONE).
4. **sqrt(alpha) trick** in forces.js — drift uses `Math.sqrt(alpha)` so motion stays visible at low alpha (~0.03).
5. **Exit transitions**: When deselecting, linked sets preserved during 650ms fadeout.
6. **Event bus** coordinates everything: input → selection state → renderers + UI.
7. **stopPropagation on need labels** prevents canvas double-fire. Do NOT use `input:consume-tap` (it was buggy — set a flag that ate the next click).
8. **System prompt is built server-side** in `functions/index.js`. The client sends a structured `emotionContext` object (label, inquiries, fellowMessengersPerNeed, wisdomEssence, wisdomSignal) and locale. `buildConstellationSystemPrompt()` assembles the final prompt. `sanitizeContextText()` strips control characters from all context fields. This prevents prompt injection — a malicious client can no longer override the "You are an emotional wisdom guide" template.
9. **Two-wave entry animation**: Emotions are split by index (first half = wave 1, second half = wave 2). Each wave has independent delay/duration. Labels also fade per-emotion.
10. **Ambient rotation**: Rotates need `fx`/`fy` positions around center. Emotions follow naturally via gravity force. Pauses during selection (would be disorienting), resumes with smoothstep ease.
11. **Subscription gate uses event bus** — listens to `selection:changed` (not raw input events), so it counts meaningful interactions only. `overlayEl` existence prevents double-showing. localStorage state machine: `clicks` (counter), `dismissed` (soft gate bypass), `pendingVerification` (submitted form but not yet clicked email link), `subscribed` (email link clicked and verified), `subscribedAt` (timestamp for 10-day expiry check). The `subscribed` flag is only set by `handleVerificationToken()` in `main.js` after a successful token API call — never by the subscription form itself.
12. **Country list is a shared runtime dependency** — loaded via `<script src="/js/countries.js">` from the quiz app's public directory on the same Firebase hosting. NOT bundled by Vite. Will be empty in local dev unless you copy the file to the constellation's `public/js/` folder.
13. **Pardot requires server-side proxy** — browser-side requests to Pardot don't trigger completion actions due to CORS. The existing `submitToPardot` Cloud Function in the quiz app handles this.
14. **i18n uses event bus** — `locale:changed` event triggers: wisdom data rebuild, constellation data reload, sim node label updates, label re-render, selection re-trigger, wisdom panel refresh. All modules subscribe independently.
15. **URL locale routing uses `history.replaceState`** — No page reload on locale change. `initLocale()` reads the path; `setLocale()` writes it. Firebase rewrite rule (`/constellation/**` → `index.html`) makes this work in production.
16. **Wisdom data is a single multilingual JSON** — Unlike constellation data (one file per locale), the wisdom file has all locales inline with per-field locale keys. This keeps it as a single fetch; `buildWisdomForLocale(locale)` extracts the right text.
17. **bookRef is a citation** — "Emotion Rules, pp. X, Y" stays largely the same across languages (it's a proper noun + page numbers). Locale-appropriate page abbreviations used (German "S.", Arabic "ص.", Hebrew "עמ'").
18. **About panel uses `panelState = 'about'`** — fifth state alongside `idle/welcome/wisdom/chat`. The locale change handler checks for this state and calls `showAbout()` to re-render in the new language. `showAbout()` resets `chatClient`, hides wisdom/welcome sections, and creates a local starters container inside `messagesEl`.
19. **Two hosting sites, one deploy** — `firebase.json` uses array syntax for `hosting`. Both targets deploy simultaneously. No extra steps needed vs. single-site workflow.

---

## Pardot Integration

### Current Setup
- **Form handler URL**: `https://eq.6seconds.org/l/446782/2026-02-22/9fbvh7`
- **Proxy Cloud Function**: `submitToPardot` in quiz app `functions/index.js`
- **Proxy URL**: `https://us-central1-emotion-rules-quiz.cloudfunctions.net/submitToPardot`
- **Field mapping** (External Field Name → Pardot Field):
  - `email` → Email (required)
  - `first_name` → First Name (required)
  - `last_name` → Last Name
  - `country` → Country (required)
  - `utm_source` → Source
  - `utm_campaign` → Campaign Lead Source
- **Guide**: See `/docs/PARDOT-INTEGRATION-GUIDE.md` for full details on the proxy pattern

### How It Works (magic link flow)
1. Client (`subscription-gate.js`) POSTs `{ firstName, email, country, utmSource, utmCampaign }` to `constellationSubscribe` Cloud Function
2. `constellationSubscribe` submits to Pardot form handler fire-and-forget (hardcoded URL server-side, field name whitelist applied)
3. Simultaneously generates a 32-byte crypto token, stores in Firestore `constellationVerificationTokens/{token}` with 24h expiry
4. Sends magic link email via SendGrid to the user: `https://emotion-rules.web.app/constellation?verify_token={token}`
5. Returns `{ success: true, pending: 'verify_email' }`
6. Client shows "Check your email" message (4s), sets `dismissed + pendingVerification` in localStorage
7. User clicks email link → page loads, `handleVerificationToken()` in `main.js` reads token from URL, cleans URL immediately
8. POSTs token to `constellationVerifyToken` Cloud Function
9. Firestore transaction checks token: existence, expiry, `used` flag → marks `used: true`
10. Client writes `{ subscribed: true, subscribedAt, verifiedViaEmail: true }` to localStorage, shows "Access Granted" overlay

### Cross-App Email Tracking (planned — not yet implemented)

The Constellation subscription gate, the Trust quiz (emotion-rules-quiz app), and the bonus offer form all capture email addresses through separate Pardot form handlers. The plan is **A+B**:

**A — Pardot as source of truth**: All three forms submit to Pardot with `utm_source` tags identifying the originating product. Pardot handles deduplication and marketing automation. *(Already working for Constellation after Phase 8.)*

**B — Firestore contact touches log**: Add a lightweight `contactTouches` collection logging `{ emailHash, product, touchedAt }` for each form submission. This gives the admin panel cross-product visibility (e.g., "this subscriber also completed the quiz").

**Known Pardot form handler endpoints:**
- **Constellation subscribe**: `https://eq.6seconds.org/l/446782/2026-02-22/9fbvh7` (via `constellationSubscribe` proxy)
- **Trust quiz**: `https://eq.6seconds.org/l/446782/2026-02-14/9f8kyb`
- **Bonus offer form**: `https://eq.6seconds.org/l/446782/2026-02-10/9f78g1`

Both the Trust quiz and bonus form: capture `utm_source` / `utm_campaign` from their iframes and pass to Pardot, and have "Success Location = Referring URL" set in Pardot. Neither currently logs to Firestore. Integration deferred — Josh to handle Trust quiz and bonus form Pardot → Firestore logging later.

---

## Security Audit (Feb 23, 2026)

Full codebase security review covering Cloud Functions, client-side UI, chat integration, data handling, and Firebase configuration. Findings ranked by severity.

**Implementation status as of Feb 24, 2026** — items marked ✅ are complete and deployed. Items marked ⏳ are planned. Items marked 🔵 are low priority / deferred.

### 🔴 CRITICAL

1. ✅ **SSRF in `submitToPardot` Cloud Function**
   - **Fix applied**: Hardcoded Pardot URL server-side. Added CORS whitelist (`pardotCorsHandler`). Added `PARDOT_ALLOWED_FIELDS` Set — unknown fields stripped before forwarding.

2. ✅ **Firestore rules allow unauthenticated creates**
   - **Fix applied**: `quizResults` requires `['email', 'submittedAt']` with type checks, `email.size() <= 300`, `size() <= 20`. `quickQuizResults` requires `['submittedAt']` with same guards. Unauthenticated `update` on quizResults removed.

3. ✅ **Firebase Storage allows unauthenticated uploads**
   - **Fix applied**: `/receipts` write restricted to content type `image/.*|application/pdf` + size < 10MB.
   - **Note (Feb 25)**: Auth requirement was subsequently removed from `/receipts` write AND read — the bonus form is public-facing, and `BookSignupsView.js` uses download URLs in `img`/`iframe` elements (plain browser requests with no Firebase auth token). Security model: unguessable filenames + admin-only Firestore `submissions` collection.

### 🟠 HIGH

4. ✅ **System prompt sent from client (prompt injection vector)**
   - **Fix applied**: System prompt templates moved to `functions/index.js`. Client sends structured `{ emotionContext, locale }`. Server calls `validateEmotionContext()` and `sanitizeContextText()` on all fields before building the prompt.

5. ✅ **Rate limiting is in-memory only**
   - **Fix applied**: Two-layer approach. In-memory Map as L1 fast check. Firestore `runTransaction` on `constellationRateLimit/{key}` as L2 cross-instance check. Fails open on Firestore error (does not block legitimate users).

6. ✅ **innerHTML with interpolated data in `hud-bar.js`**
   - **Fix applied**: `showEmotion()` and `showNeed()` fully rewritten using `createElement`/`textContent`. Added `makePill()` helper. No user-facing data touches `.innerHTML`.

7. ✅ **Missing Content Security Policy (CSP)**
   - **Fix applied**: CSP + `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` added to `firebase.json` headers section. `X-Frame-Options` removed in Phase 9 to allow 6seconds.org embeds; `frame-ancestors` in CSP handles embedding control instead.

8. ✅ **`submitToPardot` CORS allows all origins** — Fixed as part of #1 above.

9. ✅ **`submitToPardot` has no field name whitelist** — Fixed as part of #1 above.

### 🟡 MEDIUM

10. ⏳ **localStorage subscription state is trivially spoofable**
    - Partially mitigated by magic link verification + 10-day expiry. Acceptable for a newsletter gate — not a paywall.

11. **CSS selector injection in `wisdom-panel.js`**
    - Emotion IDs used in CSS selectors without sanitization. Low real-world risk but should validate IDs against known set.

12. ✅ **Email stored in plaintext localStorage** — Email no longer stored in localStorage at any point.

13. ✅ **Missing security headers** — Resolved in Phase 8 (and updated in Phase 9 re: `X-Frame-Options`).

14. **No stream timeout on chat client** — Client-side AbortController timeout not yet added.

15. **`resendQueuedEmail` has no authentication** — Not yet addressed.

16. **`sendQuizResults` has no rate limiting** — Not yet addressed.

### 🔵 LOW

17. **IP spoofing via X-Forwarded-For** — Use `req.ip` instead of parsing `X-Forwarded-For` manually.

18. **Event bus has no type safety** — Low priority. Could add event name constants if project grows.

19. **`.env` files contain endpoint URLs** — These are public URLs, not secrets. No action needed.

### Hardening Status (as of Feb 24, 2026)

**✅ Completed and deployed:**
1. ✅ Hardcode Pardot URL server-side (SSRF — Critical #1)
2. ✅ Add CORS whitelist to `submitToPardot` (#8)
3. ✅ Add field name whitelist to `submitToPardot` (#9)
4. ✅ Add security headers to `firebase.json` (#7, #13)
5. ✅ Tighten Firestore rules with schema validation (#2)
6. ✅ Move system prompt construction to server-side (#4)
7. ✅ Switch rate limiting to Firestore-backed (#5)
8. ✅ Replace `innerHTML` with safe DOM methods in `hud-bar.js` (#6)
9. ✅ Restrict Firebase Storage rules (#3)
10. ✅ Remove email from localStorage (#12)

**Remaining / deferred:**
- Add client-side stream timeout (#14)
- Add auth to `resendQueuedEmail` (#15)
- Add rate limiting to `sendQuizResults` (#16)
- Firebase App Check for client verification
- CSS selector injection in `wisdom-panel.js` (#11)

---

## To Do / Next Steps

### ✅ Complete (as of Feb 24, 2026)
- ✅ Security Hardening (Phase 8)
- ✅ Magic link email verification (subscription gate)
- ✅ 10-day access expiry (`ACCESS_EXPIRY_MS` in `subscription-gate.js`)
- ✅ iframe embedding fix (6seconds.org)
- ✅ Copyright readability
- ✅ "About this App" panel (fully translated, all 11 locales)
- ✅ HUD gradient backdrop
- ✅ Multi-site hosting (`emotion-rules.web.app`)
- ✅ OG canonical URL updated to `emotion-rules.web.app`

### Priority 1: i18n Polish & Remaining Gaps
✅ Core multilingual support is complete (11 locales, all data translated, URL routing). Remaining:
- **OG meta tags per locale** — Currently English-only. Could dynamically set or use server-side rendering for social sharing in other languages.
- **RTL layout polish** — Arabic and Hebrew text direction is set via `lang` attribute, but UI layout (panel positioning, text alignment) may need RTL-specific CSS tweaks.
- **Additional locales** — Framework is extensible. To add a new locale: add entry to `SUPPORTED_LOCALES` in locale.js, add translations to ui-strings.js, create `constellation-{code}.json`, add locale keys to wisdom JSON.

### Priority 2: Admin & Chat Improvements
- Warmup function for chat endpoint (easy win, pre-warm Cloud Function container)
- In admin, click on a chat to view the conversation (requires storing chat content, currently only metadata is stored)
- In admin, logging of faults to check for any API issues 
- Chat feedback — thumbs up/down from users; log like in eq-chat app
- In admin, track frequency of feelings and needs clicked to analyze usage
- Guidance database in admin with FAQs to support Claude integration

### Priority 3: UX Refinements
- Text size enlarger (alternative to zoom/pan)
- Update OG image with a better screenshot/design
- Update meta title and description by language
- Add sparkle or pulse to Windrose icon in top-right

### Priority 4: Admin integration
Currently the project includes: Quick quiz, Trust quiz, Bonus form, and Constellation. All are in the admin panel, but not fully integrated.
- Redesign admin dashboard to include Constellation utilization and email capture
- Cross-app Firestore contact touches log (see Pardot section)
- There is another app for the book, Emotional Wisdom Wheel, which is not in this project at all and could be integrated, it also uses a pardot form-handler-unlock function.


### Future Ideas
- Elegant degrading for slower internet or older devices
- Admin-configurable gate thresholds (move `SOFT_THRESHOLD` / `HARD_THRESHOLD` to Firestore so tunable without redeployment)
- Expand HUD to offer more related feelings
- Co-travel arcs (learned habits vs deep meaning — second connection type)
- Sub-needs zoom (32 expanded needs from book p.84)
- Integration with quiz/assessment results
- User accounts for exploration history / log-book
- Personal constellation (user-customizable connections)
- Zoom & Pan (lower priority) - More valuable when expanding to more emotions or the full 32 sub-needs from the book. Adds coordinate transform complexity for all hit-testing, labels, and shaders.

---

## Useful Commands

```bash
# Constellation development
cd /Users/joshuafreedman/Documents/emotion-constellations
npx vite --host          # Dev server (port 5173/5174)
npm run build            # Production build to dist/

# Quiz app / Cloud Functions
cd /Users/joshuafreedman/Documents/emotion-rules-quiz/emotion-rules-quiz-app
npm run build            # Build React admin + quiz app
cd functions && npm install  # Install function deps
firebase deploy --only functions  # Deploy functions only
firebase deploy --only hosting    # Deploy hosting only (both sites)
firebase deploy                   # Deploy everything

# Full frontend deploy (CORRECT workflow)
cd /Users/joshuafreedman/Documents/emotion-constellations && npm run build
rsync -a --delete dist/ /Users/joshuafreedman/Documents/emotion-rules-quiz/emotion-rules-quiz-app/build/constellation/
cd /Users/joshuafreedman/Documents/emotion-rules-quiz/emotion-rules-quiz-app && firebase deploy --only hosting

# Verify deploy went live (check asset hash matches build output)
curl -s https://emotion-rules.web.app/constellation/ | grep 'assets/index'
curl -s https://emotion-rules-quiz.web.app/constellation/ | grep 'assets/index'

# Testing subscription gate
# Clear localStorage key to reset: localStorage.removeItem('constellation_sub')
# Test expiry: set subscribedAt to old timestamp: JSON.parse(localStorage.constellation_sub)

# Testing locale URLs
# Visit: https://emotion-rules.web.app/constellation/fr
# Or locally: http://localhost:5173/constellation/fr

# Check live headers
curl -sI https://emotion-rules.web.app/constellation/ | grep -E 'content-security|frame-ancestors|x-frame'
```
