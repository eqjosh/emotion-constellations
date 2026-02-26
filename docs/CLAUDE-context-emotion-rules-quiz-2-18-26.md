# Emotion Rules Quiz App — Project Context

*Last updated: February 18, 2026*

## Overview

A React-based quiz application for the book "Emotion Rules" by Josh Freedman / Six Seconds (The Emotional Intelligence Network). Two quizzes + a book reward signup form, unified under one Firebase project with a shared admin panel.

- **Live URL:** https://emotion-rules-quiz.web.app
- **Firebase Project ID:** `emotion-rules-quiz`
- **Region:** us-central1
- **Admin contact:** josh@6seconds.org
- **Sender email:** emotionrules@6seconds.org
- **Short URLs:** `6sec.org/quiz` (Quick Quiz), `6sec.org/quiz2` (Trust Quiz)

---

## App Structure & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Redirect → `/trust` | Default landing |
| `/quick` | `QuickQuiz` | "What's Your Emotional Blind Spot?" — 5 binary pairs, ~60 sec |
| `/trust` | `DeepQuiz` | "Emotional Trust Quiz" — card sort + 3 scenarios, ~3 min |
| `/deep` | Redirect → `/trust` | Legacy alias |
| `/admin` | `AdminNew` | Admin panel (Firebase Auth protected) |
| `/signup.html` | Static HTML | Book reward redemption form (vanilla JS, not React) |
| `/init-db` | `DatabaseInit` | One-time Firestore seed utility |

**Router:** Uses `BrowserRouter` (clean URLs, no `#`). Firebase Hosting rewrites all paths to `index.html` except `/signup.html` and `/trust` (which has its own `build/trust/index.html` for OG meta tags).

**Iframe support:** App detects when embedded in an iframe and posts height changes to parent via `postMessage({ type: 'emotion-rules-resize', height })` using a debounced `MutationObserver`. Links to the Trust Quiz from within the Quick Quiz open in `target="_blank"` to avoid iframe nesting.

---

## The Three Apps (Unified in One Firebase Project)

### 1. Quick Quiz (`/quick`)
- **Flow:** Welcome → 5 binary pairs → Result
- **Scoring:** Counts pattern selections; highest wins. Tie-break: most recent answer's pattern.
- **4 blind spot types:** overthinking (sky blue #0EA5E9), pushingThrough (orange #F97316), fixing (emerald #10B981), doingItAll (violet #8B5CF6)
- **Keyword highlighting:** Result headlines highlight the blind spot keyword (e.g., "overthinking") with a subtle tinted background + colored underline using the type's accent color. The `keyword` field in `quickQuizContent.js` drives this; `QuickResult.js` parses and wraps it in a `<span className="keyword-highlight">`.
- **Result saves to:** `quickQuizResults` Firestore collection
- **Key files:** `QuickQuiz.js`, `QuickWelcome.js`, `QuickPairs.js`, `QuickResult.js`, `data/quickQuizContent.js`, `utils/quickQuizScoring.js`

### 2. Trust Quiz (`/trust`)
- **Flow:** Welcome → Card Sort (9 cards into 5 columns) → 3 Scenarios → Results → Share
- **Scoring:** Card column values (1–5) summed per domain + scenario bonuses (+1 per domain). Three domains: Emotional Data, Emotional Intelligence, Emotional Wisdom.
- **Score levels:** high (≥11), mid (≥8), low (<8)
- **Results include:** Venn diagram, 4 flip cards, email capture form (triggers personalized email with PNG Venn diagram)
- **Privacy link:** "We respect your privacy" links to `https://www.6seconds.org/about/policies/privacy/`
- **Result saves to:** `quizResults` Firestore collection
- **Key files:** `DeepQuiz.js`, `Welcome.js`, `CardSort.js`, `ScenariosNew.js`, `Results.js`, `Share.js`, `VennDiagram.js`, `EmailPopup.js`, `data/quizContent.js`, `utils/scoring.js`

### 3. Book Reward Signup (`/signup.html`)
- **Standalone vanilla HTML/JS** — NOT part of the React app
- **Form fields:** First Name, Last Name, Email, Country (with timezone auto-detect), Copies purchased (4 tiers), Receipt upload (max 10MB)
- **Flow:** Deadline check → Fill form → Upload receipt to Firebase Storage (`receipts/`) → Save to Firestore `submissions` → Submit to Pardot via Cloud Function proxy → Show success
- **Deadline control:** Reads `settings/general.submissionDeadline` from Firestore; shows "closed" message if past
- **Key files:** `public/signup.html`, `public/js/signup-app.js`, `public/js/signup-config.js`, `public/js/countries.js`, `public/css/signup-style.css`

---

## Admin Panel (`/admin`)

Protected by Firebase Auth (email/password). Sidebar navigation:

1. **Analytics** — `AnalyticsView` — Dashboard with quiz completion stats
2. **Quick Quiz** — Questions editor (`QuickQuestionsEditor`) + Results editor (`QuickResultsEditor`)
3. **Trust Quiz** — Questions editor (`TrustQuestionsEditor`) + Results editor (`TrustResultsEditor`)
4. **Book Signups** — `BookSignupsView` — View/export/manage submissions (tabs: Submissions, Export, Settings)
5. **Email Queue** — `EmailQueueView` — View/resend failed emails (filter: Failed/Sent/All)
6. **Share Images** — `ShareImagesEditor` — Manage social share images + OG preview images

Admin editors write to the `adminContent` Firestore collection. Quiz components load admin content at runtime, overriding hardcoded defaults in source data files.

### Share Images Editor slots:
- **Overthinking / Pushing Through / Fixing / Doing It All** — Instagram download images for each blind spot result
- **Quick Quiz Preview Image** (`ogQuickQuiz`) — social sharing preview for Quick Quiz links
- **Trust Quiz Preview Image** (`ogTrustQuiz`) — social sharing preview for Trust Quiz links
- **Generic Fallback OG Image** (`ogGeneric`) — used if quiz-specific image isn't uploaded

---

## Cloud Functions (`functions/index.js`)

All functions are Firebase v2 HTTP (`onRequest`), Node.js 20. Three exported functions:

### `submitToPardot`
- CORS-enabled proxy for Pardot form handler submissions
- Required because browser-direct Pardot requests don't trigger completion actions; server-side requests do
- Accepts `{ pardotUrl, fields }`, re-encodes as `application/x-www-form-urlencoded`

### `sendQuizResults`
- Sends personalized Trust Quiz results email
- **Secrets:** `SENDGRID_API_KEY`, `SES_SMTP_USER`, `SES_SMTP_PASS`
- Accepts `{ firstName, email, cardSort, scenarioChoices }`
- Recalculates scores server-side → renders PNG Venn diagram via `canvas` package → builds HTML email
- **Three-tier delivery:** SendGrid (primary) → AWS SES SMTP fallback → Firestore `emailQueue` + admin notification
- Email includes: Venn diagram (CID inline PNG), score grid, domain narratives, two Emotion Rules, practice suggestion, Amazon book link, Wisdom Wheel link

### `resendQueuedEmail`
- Re-sends a queued email from admin panel
- **Secrets:** same as above
- Accepts `{ queueId }`, fetches from `emailQueue`, recalculates and resends

---

## Email Delivery Architecture

**Primary:** SendGrid (free plan, 100/day limit)
**Fallback:** AWS SES SMTP (us-west-2, port 465, ~70k/day limit) via `nodemailer`
**Last resort:** Failed emails queued to `emailQueue` Firestore collection; admin notified at josh@6seconds.org; resendable from admin panel

**Secrets (Firebase Secret Manager):**
- `SENDGRID_API_KEY`
- `SES_SMTP_USER` — value: `AKIATMPK5MXY34EM7XUS`
- `SES_SMTP_PASS` — value: `BKVuK+ELfoPO59xhAraZvEts8hCUjYfL0e2zfBXpaAoI`

**SES Configuration:**
- Host: `email-smtp.us-west-2.amazonaws.com`
- Port: 465, secure: true
- From: `emotionrules@6seconds.org`
- Domain `6seconds.org` verified in SES
- SES SMTP user: `ses-smtp-user.20260214-160845`

---

## Firestore Collections

| Collection | Purpose | Public Access |
|------------|---------|---------------|
| `quizResults` | Trust Quiz completions | create, update |
| `quickQuizResults` | Quick Quiz completions | create |
| `adminContent` | CMS content for quizzes + share images | read |
| `submissions` | Book reward signups | create (validated fields) |
| `settings` | Admin settings (deadline, etc.) | read |
| `emailQueue` | Failed email retry queue | auth only |

---

## Firebase Storage Rules

| Path | Write | Read | Max Size |
|------|-------|------|----------|
| `receipts/{fileName}` | Public | Public | 10MB |
| `trust-quiz-cards/{fileName}` | Auth required | Public | 5MB |
| `quick-quiz-questions/{fileName}` | Auth required | Public | 5MB |
| `quick-quiz-results/{fileName}` | Auth required | Public | 5MB |
| `share-images/{fileName}` | Auth required | Public | 5MB |

---

## External Integrations

- **Pardot (Salesforce MCAE):** Two form handlers — book signup + trust quiz email capture. Server-side proxy required.
  - Book signup handler: `https://eq.6seconds.org/l/446782/2026-02-10/9f78g1`
  - Trust quiz handler: `https://eq.6seconds.org/l/446782/2026-02-14/9f8kyb`
- **SendGrid:** Primary transactional email
- **AWS SES:** Fallback email (SMTP, us-west-2)
- **Amazon:** Book links — `https://amzn.to/4rjsLbi` (trust quiz email/share) and `https://amzn.to/47MVf50` (quick quiz result)
- **6seconds.org:** Parent org; Privacy Policy: `https://www.6seconds.org/about/policies/privacy/`; Emotional Wisdom Wheel: `https://www.6seconds.org/emotionrules/wheel/`

---

## Key Technical Details

- **React 19** with Create React App (react-scripts 5.0.1)
- **react-router-dom v7** with BrowserRouter
- **Firebase SDK:** v12.9.0 (React app), v10.7.1 compat (signup.html)
- **Icons:** lucide-react
- **Confetti:** canvas-confetti
- **Server-side canvas:** `canvas` v3.2.1 (for PNG Venn diagram in Cloud Functions)
- **Scoring is mirrored** — scoring logic exists in both `src/utils/scoring.js` (client) and `functions/index.js` (server). Changes to scoring must be updated in both places.
- **Firebase Hosting headers:** `no-cache` for all HTML/routes (catch-all `**`); `max-age=31536000` for static assets (content-hashed filenames). Firebase applies the LAST matching header rule, so the static asset rule overrides the catch-all.

---

## Social Sharing / OG Meta Tags

Social crawlers don't execute JavaScript, so OG meta tags must be in the raw HTML served for each route. Since this is an SPA, there's a post-build script that handles this:

### How it works:
1. `public/index.html` has Quick Quiz meta tags (default — this is also the SPA shell)
2. `npm run build` runs `react-scripts build` then `node scripts/generate-meta-pages.js`
3. The script copies the built `index.html`, swaps meta tags, and writes to `build/trust/index.html`
4. Firebase Hosting serves static files before applying rewrites, so `/trust` gets the Trust-specific HTML
5. All other SPA routes (including `/quick`) fall through to the root `index.html` with Quick Quiz meta tags

### Current OG meta:
- **Quick Quiz** (`/quick`, `/`): title "What's Your Emotional Blind Spot?", image: `share_overthinking.png`
- **Trust Quiz** (`/trust`): title "How Well Do You Trust Your Emotions?", image: `og-trust-quiz.png` (placeholder — replace in `public/images/` or via admin Share Images editor)

### To add OG meta for a new route:
1. Add an entry to the `routes` object in `scripts/generate-meta-pages.js`
2. Run `npm run build` — it auto-generates `build/<route>/index.html`
3. Deploy

### Gotcha: `/trust` → `/trust/` redirect
Firebase Hosting returns a 301 redirect from `/trust` to `/trust/` when a directory `trust/` exists with an `index.html`. Social crawlers follow 301s, so this works fine. Direct browser navigation also works — React Router handles the route after the JS loads.

---

## Build & Deploy

### Standard build + deploy:
```bash
cd emotion-rules-quiz-app
npm run build          # builds React + generates OG meta pages
firebase deploy --only hosting
```

### Deploy functions (only needed when functions/index.js changes):
```bash
firebase deploy --only functions
```

### Deploy everything:
```bash
npm run build && firebase deploy --only hosting,functions
```

### Deploy rules only:
```bash
firebase deploy --only firestore   # Firestore rules
firebase deploy --only storage     # Storage rules
```

### Node.js 20 deprecation note:
Firebase will deprecate Node.js 20 on 2026-04-30 (decommission 2026-10-30). Plan to upgrade functions runtime before then.

---

## Embedding Instructions

### Quick Quiz (iframe)
```html
<iframe
  id="emotion-rules-quiz"
  src="https://emotion-rules-quiz.web.app/quick"
  style="width: 100%; max-width: 1600px; min-height: 700px; border: none;"
  allow="clipboard-write"
></iframe>
<script>
window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'emotion-rules-resize') {
    document.getElementById('emotion-rules-quiz').style.height = e.data.height + 'px';
  }
});
</script>
```

### Trust Quiz (iframe)
Same pattern, change `src` to `https://emotion-rules-quiz.web.app/trust`

### Book Reward Signup Form (iframe)
```html
<iframe
  id="emotionRulesForm"
  src="https://emotion-rules-quiz.web.app/signup.html"
  style="width:100%; min-height:1100px; border:none; border-radius:8px;"
  title="Emotion Rules - Claim Your Reward"
  loading="lazy">
</iframe>
<script>
// Pass UTM parameters from parent page to iframe
(function() {
  const iframe = document.getElementById('emotionRulesForm');
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = new URLSearchParams();
  ['utm_source', 'utm_campaign', 'utm_medium', 'utm_term', 'utm_content'].forEach(param => {
    if (urlParams.has(param)) {
      utmParams.set(param, urlParams.get(param));
    }
  });
  if (utmParams.toString()) {
    iframe.src = iframe.src + '?' + utmParams.toString();
  }
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'scrollToTop') {
      iframe.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();
</script>
```

**Notes:**
- The script automatically reads UTM params from the parent page URL and appends them to the iframe src, so Pardot + Firestore capture attribution data
- The signup form posts a `scrollToTop` message on successful submission so the parent page scrolls the form into view
- The quiz iframes post `emotion-rules-resize` messages for auto-height adjustment
- The old embed URL was `https://emotion-rules-signup.web.app` — now consolidated to `https://emotion-rules-quiz.web.app/signup.html`

---

## Lessons Learned / Gotchas

1. **Firebase Hosting headers order:** Firebase applies the LAST matching header rule. Put the catch-all (`**` → no-cache) FIRST, then the static assets pattern SECOND so it overrides. Not the other way around.

2. **Firebase Hosting rewrites vs static files:** Static files in the `build/` directory are served BEFORE rewrites are applied. This is how the `build/trust/index.html` approach works for per-route OG tags — no Cloud Function needed.

3. **Firebase Hosting + Gen2 Cloud Functions rewrites:** Getting Firebase Hosting to rewrite to Gen2 (v2) Cloud Functions is unreliable. The simpler approach of placing a static `<route>/index.html` in the build directory is more reliable, faster (no cold starts), and free.

4. **SPA cache busting:** HTML responses should be `no-cache` so browsers always get the latest `index.html` (which references content-hashed JS/CSS bundles). Static assets can be cached for a year since their filenames change on every build.

5. **CRA only processes `public/index.html`:** Other HTML files in `public/` are copied verbatim — `%PUBLIC_URL%` won't be replaced. That's why the meta pages are generated post-build from the already-processed output.

6. **Scoring is mirrored:** `src/utils/scoring.js` (client) and `functions/index.js` (server) both have scoring logic. If scoring changes, update both.

7. **SendGrid free tier:** 100 emails/day. SES fallback handles overflow automatically. Admin notified if both fail.

8. **Storage rules must match upload paths:** Each admin upload directory (`trust-quiz-cards/`, `quick-quiz-questions/`, etc.) needs an explicit match rule in `storage.rules`. Missing rules cause silent permission denied errors in the admin panel.

9. **iframe resize oscillation:** `ResizeObserver` creates feedback loops in iframes. Use `MutationObserver` + debounce + height threshold instead.

10. **Pardot form handlers require server-side submission:** Browser-direct fetch/XHR to Pardot form handler URLs doesn't trigger completion actions (autoresponders, list adds, etc.). Must proxy through a Cloud Function that sends `application/x-www-form-urlencoded` POST.

11. **OG images must be absolute URLs:** Social crawlers can't resolve relative paths. Always use full `https://emotion-rules-quiz.web.app/...` URLs in OG image meta tags.
