# EQ Chat Project — Session Context & Lessons Learned
**Date**: February 17, 2026
**Purpose**: Document key learnings, architecture decisions, and recommendations for future Claude Code sessions

---

## Project Overview

**Six Seconds EQ Chat + Search** — A unified Firebase backend serving:
1. **Chatbot widget** (embedded on 6seconds.org via `widget-embed.js`)
2. **AI-powered search** (server-side rendered by a thin WordPress plugin)
3. **Admin dashboard** (React app on Firebase Hosting)

Three previously separate systems (WordPress PSE Search, WordPress Gemini Summary, Firebase EQ Chatbot) consolidated into one architecture: **1 Firebase backend + 1 WordPress micro-plugin**.

---

## Architecture at a Glance

```
WordPress (www.6seconds.org)          Firebase (us-central1)
┌──────────────────────┐              ┌─────────────────────────────┐
│ sixcs-search-connector│──server───▶ │ /search (Cloud Function)    │
│ (PHP plugin, v1.2.0)  │  side call  │   → Google PSE API          │
│                        │             │   → AI summary (Claude)     │
│ Renders HTML results   │◀─JSON──────│   → Guidance matching       │
│ on 6seconds.org        │             │   → Firestore cache/logs    │
└──────────────────────┘              │                             │
                                       │ /chat, /chatStream          │
┌──────────────────────┐              │   → Claude (primary)        │
│ Chatbot Widget        │──client───▶ │   → Claude fallback         │
│ (widget-embed.js)     │  side SSE   │   → Gemini fallback         │
│ Loaded from Firebase  │             │                             │
│ Hosting, NOT from WP  │             │ /invalidateCache            │
└──────────────────────┘              │ /getBlocklist               │
                                       │ /auditSearchLogs            │
┌──────────────────────┐              │                             │
│ Admin Dashboard       │──authed───▶ │ Firestore (direct reads)    │
│ React + Vite + TS     │  Firebase   │   guidance, promptConfig,   │
│ Firebase Hosting      │  Auth       │   conversations, searchLogs │
└──────────────────────┘              └─────────────────────────────┘
```

**Key insight**: The chatbot widget loads from Firebase Hosting and calls Cloud Functions directly. It does NOT pass through WordPress, AWS ALB, or Cloudflare. This means server infrastructure changes (AWS autoscale, Cloudflare proxy) don't affect the chatbot — but we added SSE anti-buffering headers proactively.

---

## Key Files

| File | Purpose |
|------|---------|
| `functions/index.js` | All Cloud Functions — chat, search, admin endpoints (~2600 lines) |
| `app/src/components/admin/SearchTab.tsx` | Admin search analytics, blocklist, cache management |
| `app/src/components/admin/ModelsTab.tsx` | Model configuration, API testing, load testing |
| `app/src/lib/firestore.ts` | Client-side Firestore helpers and API wrappers |
| `wordpress-plugin/sixcs-search-connector/` | WordPress plugin for server-side search rendering |
| `firestore.rules` | Security rules for all Firestore collections |
| `app/public/widget-embed.js` | Chatbot embed script loaded by WordPress |

---

## Caching Architecture (Critical Knowledge)

### Three Cache Layers

1. **In-memory prompt cache** (2-minute TTL, per Cloud Function instance)
   - Caches: guidance data, style content, context sections, model config
   - Invalidated by: version number bump OR TTL expiry
   - Always checks `promptConfig/cacheVersion` doc first (1 lightweight read)
   - Falls back to hardcoded data if Firestore is unavailable

2. **Firestore search cache** (`searchCache` collection, 12-hour default TTL)
   - Key: MD5 of `"${query.toLowerCase()}|${type}|${dateRange}|${page}"`
   - Stores: full search response (results + AI summary + guidance)
   - Hit counter incremented async on cache hits
   - **No search log entry for cache hits** (prevents double-counting)

3. **Blocklist cache** (5-minute TTL, in-memory)
   - Loaded on first request, refreshed every 5 minutes
   - Also synced hourly from Firebase → WordPress DB table

### The Double-Logging Problem (Fixed)

**Bug**: Search logs were being written twice per search — once on the initial search and once on cache hits. This inflated analytics.

**Root cause**: The logging code ran before the cache-hit early return.

**Fix**: Moved search log write to AFTER the cache check. Cache hits return early with `cached: true` in the response but no new log entry. The original log from the uncached search is the single source of truth.

### Cache + Prompt Changes Interaction

**Gotcha**: When you update the AI summary prompt, all existing cached searches still serve the OLD prompt's output for up to 12 hours. This is why we added the "Clear Search Cache" button.

**Solution**: The `invalidateCache` endpoint accepts `{ clearSearchCache: true }` which batch-deletes up to 500 docs from `searchCache`. The admin SearchTab has a button for this.

**Recommendation**: After any prompt engineering changes, always clear the search cache to see results immediately.

---

## AI Summary Prompt Engineering (Lessons Learned)

### The Repetition Problem

We identified and fixed three types of repetition in AI search summaries:

1. **Guidance seed idea = AI summary opening**
   The "seed idea" from matched guidance is displayed in a separate box ABOVE the AI summary. But the AI prompt originally said to "incorporate this guidance naturally" — so it restated the same content.
   **Fix**: Tell the AI explicitly that the guidance is "shown separately above your summary, so do NOT repeat it."

2. **AI summary opening = Bullet point 1**
   The model would synthesize a theme in the opening sentences, then repeat the same theme as the first bullet.
   **Fix**: Added rule #5 — "Each bullet point must cover a DIFFERENT angle or sub-topic than the opening sentences."

3. **Between bullet points**
   Less common, but the strict format rules help prevent this.

### Current Prompt Rules (in `buildSearchSummaryPrompt`)

```
1. Write exactly 2 complete sentences (synthesize main insights)
2. Then a blank line
3. Then exactly 3 bullet points (each starts with •)
4. Each bullet must be a complete, actionable insight
5. IMPORTANT: Each bullet must cover a DIFFERENT angle than the opening. Do NOT repeat or rephrase.
```

Plus: Each bullet MUST reference a specific article by its exact title in quotes (enables hyperlink injection).

### Guidance Context Block

When matched guidance exists, the prompt includes:
```
IMPORTANT — EDITORIAL GUIDANCE (this will be shown separately above your summary, so do NOT repeat it):
"${top.guidance}"
Your summary will appear directly below this text. Do NOT restate or paraphrase it.
Instead, build on it with fresh angles, specific data, or practical how-to advice.
```

If the guidance has a link, the prompt also says: `A link to "${top.link}" is already displayed, so focus your summary on other resources.`

---

## Rate Limiting Architecture

### Design

- **In-memory** Map with 1-minute sliding window
- **Namespaced keys**: `search:${ipHash}`, `chat:${ipHash}`, `stream:${ipHash}`
- **Limits**: Search = 20/min, Chat = 15/min (both per IP)
- **Cleanup**: Periodic purge of expired entries every 60s

### IP Detection (Priority Order)

```
1. cf-connecting-ip    (Cloudflare)
2. x-real-ip           (AWS ALB / nginx)
3. x-forwarded-for     (general reverse proxy)
4. req.ip              (Express default)
```

Extracted into shared `getClientIp(req)` helper used by all endpoints.

### IP Hashing

- **Method**: HMAC-SHA256 with salt from `promptConfig/syncToken`
- **Stored**: Only the hash (first 32 hex chars) in search logs
- **Purpose**: Rate limiting + blocklist matching without storing raw IPs

### Limitations

Rate limiting is per Cloud Function instance (not distributed). This is acceptable because:
- Firebase auto-scales instances, so a determined attacker could hit different instances
- The blocklist provides a secondary defense for persistent abuse
- For real DDoS protection, use Cloudflare rules at the edge

---

## Streaming & Multi-Server Configuration

### SSE Headers (Critical for Cloudflare + nginx)

```javascript
res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
res.setHeader("Connection", "keep-alive");
res.setHeader("X-Accel-Buffering", "no");       // Disables nginx buffering
res.setHeader("X-Content-Type-Options", "nosniff");
```

Without `X-Accel-Buffering: no`, Cloudflare and nginx will buffer the entire SSE response before sending, defeating the purpose of streaming.

### Timeout Strategy

- **Initial timeout**: 6 seconds (configurable) — if no first chunk arrives, fall back to next model
- **Idle timeout**: 15 seconds — if stream starts but stalls (no chunks for 15s), fall back
- **Idle check interval**: Every 5 seconds via `setInterval`

### Model Fallback Chain (Streaming)

```
Primary (claude-sonnet) → Fallback1 (claude-haiku) → [no Gemini for streaming]
```

Gemini is excluded from streaming because the SDK doesn't support SSE in the same way.

### Model Fallback Chain (Non-Streaming)

```
Primary → Fallback1 → Fallback2 (can be Gemini or "none")
```

Rate limit errors (429, "overloaded", "capacity") trigger fallback. Other errors fail immediately.

---

## WordPress Plugin (sixcs-search-connector v1.2.0)

### What It Does

- Registers `[sixcs_search]` shortcode for the search form + results page
- Makes server-side API calls to Firebase `/search` endpoint
- Renders results as HTML (SEO-friendly, not client-side JS)
- Maintains local blocklist table, synced hourly from Firebase
- Handles `/?s=` redirect to the search page

### Production Server Notes

- Deployed on WordPress behind **Cloudflare + AWS autoscale** (multiple www servers)
- WP pseudo-cron may not fire reliably on multi-server setups
- **Recommendation**: Set `DISABLE_WP_CRON` in `wp-config.php` and use a real system cron:
  ```
  */5 * * * * wget -q -O /dev/null https://www.6seconds.org/wp-cron.php
  ```

### Settings Location

WP Admin → Search Connector → Settings page with:
- API URL, PSE CX, sync token
- Form labels/placeholder text
- Test API button
- Manual blocklist sync button

---

## Firestore Security Rules Summary

| Collection | Public Read | Public Write | Auth Read | Auth Write | Notes |
|------------|-------------|-------------|-----------|------------|-------|
| conversations | - | create, update msgs | yes | yes (delete) | Widget creates anonymously |
| guidance | - | - | yes | yes | Admin-managed |
| promptConfig | - | - | yes | yes | Config singleton docs |
| searchCache | - | - | - | - | Cloud Functions only (Admin SDK) |
| searchLogs | - | - | yes | - | Cloud Functions write via Admin SDK |
| searchBlocklist | - | - | yes | yes | Admin approves entries |
| feedbackItems | - | - | yes | yes | Auto-created + admin-managed |
| apiErrors | - | - | yes | - | Cloud Functions write only |
| ctaClicks | - | yes (create only) | yes | - | Widget tracks clicks |

---

## Deployment Commands

```bash
# Deploy all Cloud Functions
firebase deploy --only functions

# Build and deploy admin app
cd app && npm run build && cd .. && firebase deploy --only hosting

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy everything
firebase deploy

# Build WordPress plugin zip (for upload to WP)
cd wordpress-plugin && zip -r sixcs-search-connector.zip sixcs-search-connector/
```

**Firebase project**: `sixseconds-eq-chat`
**Hosting URL**: `https://sixseconds-eq-chat.web.app`
**Functions region**: `us-central1`

---

## Recommendations for Future Claude Code Sessions

### Before Making Changes

1. **Read `functions/index.js`** — it's the monolith. All endpoints, caching, prompt logic, and matching are here (~2600 lines).
2. **Check the current model config** in Firestore `promptConfig/modelConfig` via the admin dashboard, not just the code defaults.
3. **Check if search cache needs clearing** after prompt changes — use the admin SearchTab button or call `invalidateCache` with `{ clearSearchCache: true }`.

### Common Pitfalls

- **Prompt changes don't take effect immediately** — the 12-hour search cache serves old summaries. Clear cache after prompt updates.
- **Search logs: don't double-count** — cache hits must NOT write a new search log entry.
- **Rate limiting is per-instance** — don't rely on it for absolute rate control across scaled instances.
- **Guidance matching is substring-based** — a topic "trust" matches "mistrust", "trustworthy", etc. This is intentional but can cause unexpected matches.
- **The chatbot widget bypasses WordPress entirely** — changes to WP, Cloudflare, or AWS don't affect the chat. The widget talks directly to Firebase Cloud Functions.
- **Streaming needs anti-buffering headers** — if streaming feels slow through a reverse proxy, check for `X-Accel-Buffering: no`.

### Testing Workflow

1. Make code changes
2. `firebase deploy --only functions` (for backend changes)
3. `cd app && npm run build && firebase deploy --only hosting` (for admin UI changes)
4. Clear search cache if prompt was changed
5. Test searches on the admin dashboard or WP staging site
6. Check search logs in SearchTab for any errors

### Architecture Principles

- **WordPress is a thin renderer** — all logic lives in Firebase. The WP plugin just calls the API and renders HTML.
- **Guidance is the single source of truth** — both chat and search use the same `guidance` collection and `findMatchingGuidance()` function.
- **The admin dashboard is the control plane** — model config, guidance management, blocklist, analytics, and cache clearing all happen here.
- **Fallback everything** — models fall back, caches fall back to hardcoded data, IP detection falls back through header chains.

### Pending / Future Work

- **Post-production verification**: After devops deploys staging2 to production (www.6seconds.org), verify search through Cloudflare + AWS autoscale
- **Spam audit**: Run after a few days of production search logs accumulate
- **WP cron**: Recommend `DISABLE_WP_CRON` + real system cron for multi-server environment
- **Guidance coverage monitoring**: Review auto-created feedback items where no guidance matched
- **Cost monitoring**: Track Haiku vs Sonnet usage for search summaries
- **Fuzzy matching**: Consider upgrading from substring to fuzzy/embedding-based guidance matching

---

## Key Constants Reference

```javascript
// Caching
CACHE_TTL_MS         = 120000    // 2 min (prompt data in-memory)
BLOCKLIST_CACHE_TTL  = 300000    // 5 min (blocklist in-memory)
searchCacheTtlHours  = 12        // Firestore search cache (configurable)

// Rate Limiting
RATE_LIMIT_WINDOW_MS = 60000     // 1 minute window
SEARCH_RATE_LIMIT    = 20        // searches/min/IP
CHAT_RATE_LIMIT      = 15        // messages/min/IP

// Timeouts
timeoutMs            = 6000      // Initial stream timeout (configurable)
IDLE_TIMEOUT         = 15000     // Stream stall detection
IDLE_CHECK_INTERVAL  = 5000      // How often to check for stalls

// Validation
MAX_MESSAGE_LENGTH   = 10000     // 10KB per chat message
MAX_MESSAGES         = 50        // Max messages per request
MAX_SEARCH_QUERY     = 200       // Max search query chars
```
