# Emotion Constellation — Claude Context (Feb 22, 2026)

## What This Project Is

"Emotion Constellation" is an interactive, non-dualistic visualization of emotions and human needs from *Emotion Rules* by Joshua Freedman. The core insight: emotions aren't opposites — they're co-messengers serving shared human needs. Fear and Trust both serve Safety. Loneliness and Love both serve Belonging. The visualization makes this interconnectedness visible and explorable.

Live at: https://eqjosh.github.io/emotion-constellations/
Repo: https://github.com/eqjosh/emotion-constellations

## Tech Stack

- **WebGL2 + TWGL.js** — Three shader programs: aurora (fullscreen noise curtains), particles (instanced glow quads), connections (24-segment sinusoidal strips)
- **D3-force v3** — Physics simulation (math only, never touches DOM). Custom gravity force with `sqrt(alpha)` drift trick for persistent organic motion
- **Vite 6 + vite-plugin-glsl** — Build with GLSL `#include` imports
- **Vanilla JS + ES modules** — No framework. Event bus pub/sub for decoupling
- **GitHub Actions** → GitHub Pages deployment (`build_type=workflow`)

Bundle: ~61KB (21KB gzipped). 60fps desktop, 30fps+ mobile.

## What We Built (Phases 1–2b)

### Phase 1: Living Starscape (complete)
- Aurora curtain effect using layered simplex noise FBM with anisotropic sampling
- Ambient green aurora layer (`ambientAurora()` in `aurora.frag`)
- 14 emotion particles drifting in gravitational fields of 3 need nodes (Meaning, Belonging, Achievement)
- Sinusoidal connection threads (dual sine wave, width taper, white-blended luminous core)
- Cosmic drift force with per-particle spatial phase variation
- Need labels (HTML overlay, CSS absolute positioned, tracked each frame)

### Phase 2: Interaction Depth (complete)
- **Click/tap emotion star** → glows brighter (1.6x), grows (1.4x), threads brighten, linked need aurora intensifies (1.8x), unrelated nodes dim (0.4x). Floating inquiry questions appear near the star.
- **Click need label** → all linked emotions highlight (1.2x), unrelated dim, description text + HUD bar with explorable pills
- **Hover** (desktop only) → subtle 1.15x brightness/1.1x size, cursor pointer. Suppressed on touch devices.
- **Click background** → smooth 650ms exit transition back to idle
- **Toggle** — clicking same node again deselects

**Architecture: zero shader changes for interaction.** All visual feedback flows through existing data paths (displayColor, displaySize, opacity, need.intensity). Selection state modifies values CPU-side before GPU upload each frame.

### Phase 2b: HUD-Style Info Display (complete)
Replaced the Phase 2 slide-in info panel with a more organic, integrated UI:

- **Floating inquiry text** — Questions appear near emotion stars with need-colored text glow, subtle dark rounded backdrop (`#150f21` at 50% opacity, 10px radius), and organic fade-in (1.6s cubic-bezier with 10px upward drift)
- **Staggered appearance** — Bridge emotions show 2 inquiries fading in 400ms apart
- **Leader lines** — Dashed SVG lines always connect inquiry text to its star for bridge emotions (2-need emotions like Love, Jealousy, Pride, Doubt). Single-need emotions get leader lines only when text is pushed away by collision detection.
- **Need descriptions** — Selecting a need shows a description paragraph below it, positioned to avoid label overlap (tries below first, then above)
- **HUD bar** — Bottom bar with need title + navigable emotion pills. Pills for linked needs are highlighted with need color borders. Click any pill to navigate.
- **Collision detection** — AABB overlap system prevents floating inquiry text from covering emotion labels. Inquiry-to-inquiry collision avoidance for bridge emotions.
- **Aurora contrast fix** — Perceptual luminance correction in `aurora.frag` prevents warm-color needs (Belonging gold, Achievement coral) from washing out the starscape
- **Label click bug fix** — `pointerdown` stopPropagation on need labels prevents canvas double-fire that caused select-then-deselect

## Key Files

### Core
- `src/main.js` — Entry point, wires everything up via event bus
- `src/core/constants.js` — All tuning params (AURORA, PARTICLES, CONNECTIONS, PHYSICS, LAYOUT, INTERACTION)
- `src/core/events.js` — Simple pub/sub: `on(event, cb)`, `emit(event, data)`, `off(event, cb)`
- `src/core/data-loader.js` — Fetches `constellation-en.json`

### Simulation
- `src/simulation/force-layout.js` — D3-force setup. Need nodes in organic ring (fixed positions). Emotion nodes free-floating. `getConnections()` returns array with `{emotionId, needId, startX, startY, endX, endY, color, opacity}`. Also has `description` field on need nodes.
- `src/simulation/forces.js` — Custom need-gravity force with cosmic drift (`sqrt(alpha)` for persistent motion)

### Rendering
- `src/renderer/pipeline.js` — Frame loop: sim.tick() → selectionState.tick(dt) → apply visuals → clear → aurora → connections → particles → labels → floatingInquiries.updatePositions() (every 2nd frame)
- `src/renderer/aurora.js` — Fullscreen quad, needs `u_needIntensities[6]` uniform
- `src/renderer/particles.js` — Instanced quads, reads displayColor/displaySize per frame
- `src/renderer/connections.js` — 24-segment instanced strips with per-instance seed
- `src/renderer/context.js` — WebGL2 context, ResizeObserver, DPR cap at 2x

### Shaders
- `src/shaders/aurora.frag` — `auroraCurtain()` per need + `ambientAurora()` green layer. Has perceptual luminance correction: `luma = dot(color, vec3(0.299, 0.587, 0.114))` scaled inversely so warm colors don't wash out. Pow 2.2 contrast, 0.85 clamp, vignette.
- `src/shaders/connection.vert` — Dual sine wave displacement, width taper, width breathing
- `src/shaders/connection.frag` — Soft edge, shimmer, endpoint fade, 35% white blend
- `src/shaders/particle.vert` / `particle.frag` — Glow with bright core
- `src/shaders/noise/simplex3d.glsl` + `fbm.glsl` — Noise functions

### Interaction
- `src/interaction/selection-state.js` — Central state machine. States: idle/emotion/need. 650ms transitions via d3-ease cubicInOut. Methods: `selectEmotion(id)`, `selectNeed(id)`, `deselect()`, `tick(dt)`, `getEmotionVisual(node)` → `{brightness, sizeScale}`, `getNeedIntensity(need)`, `getConnectionOpacity(emotionId, needId, baseOpacity)`, `setHover(id)`. Emits `'selection:changed'` with full context.
- `src/interaction/hit-test.js` — `findHit(x, y, emotionNodes, needNodes)` → `{type, node}`. Emotions priority over needs.
- `src/interaction/input-handler.js` — Pointer events on canvas. Emits `'input:tap'`, `'input:hover'`, `'input:hover-end'`. Touch detection via `event.pointerType`.

### UI
- `src/ui/labels.js` — HTML labels positioned absolutely. Need labels are clickable (`pointer-events: auto`, emit `'input:need-click'`). Has `pointerdown` stopPropagation to prevent canvas double-fire. Subscribes to `'selection:changed'` for CSS classes.
- `src/ui/floating-inquiries.js` — Floating inquiry text near emotion stars. SVG leader line infrastructure. AABB collision detection against labels and other inquiries. Need description positioning (tries below, then above). Staggered fade-in (400ms between bridge emotion inquiries). `createInquiryElement()`, `createNeedDescription()`, `showEmotionInquiries()`, `showNeedDescription()`, `updatePositions()`.
- `src/ui/hud-bar.js` — Bottom HUD bar. `showEmotion()` and `showNeed()` content builders. Pill navigation emitting `'input:emotion-click'` and `'input:need-click'`. Need pills highlighted with colored borders for linked needs. CSS class `hud-bar--visible` toggled on selection.
- `src/ui/info-panel.js` — DELETED (replaced by floating-inquiries + hud-bar)

### Data
- `public/data/constellation-en.json` — 3 needs (Meaning, Belonging, Achievement), 14 emotions. Every link has an `inquiry` question string. Bridge emotions: Love (Belonging+Meaning), Jealousy (Belonging+Achievement), Pride (Achievement+Belonging), Doubt (Achievement+Meaning).

### Styles
- `styles/main.css` — Canvas fullscreen, label styles (0.6s cubic-bezier transitions), floating inquiry styles (1.6s fade-in with 10px upward drift, rounded backdrop `rgba(21,15,33,0.5)` with 10px radius), HUD bar (1.0s fade-in with 200ms delay), responsive breakpoint at 768px, `touch-action: none`

## Important Design Decisions & Gotchas

1. **Simulation space = screen space** (CSS pixels). No coordinate transforms needed for hit testing. Labels use `el.style.left = ${node.x}px` directly.
2. **Need nodes have fixed positions** (`fx`/`fy`). D3-force copies these to `x`/`y` automatically.
3. **Additive blending** for all WebGL layers — light accumulates naturally. Aurora uses pure additive (ONE,ONE), particles/connections use alpha-additive (SRC_ALPHA,ONE).
4. **sqrt(alpha) trick** in forces.js — drift and perturbation forces use `Math.sqrt(alpha)` instead of raw `alpha` so motion stays visible even when simulation has settled to low alpha (~0.03).
5. **Exit transitions**: When deselecting, `mode` changes to `'idle'` but linked sets and `transitionProgress` are preserved so the visual getters can animate back smoothly. Sets are cleaned up only when progress reaches 0.
6. **The event bus** is the coordination mechanism between input → selection state → renderers + UI. Events: `'input:tap'`, `'input:hover'`, `'input:hover-end'`, `'input:need-click'`, `'input:emotion-click'`, `'input:deselect'`, `'selection:changed'`.
7. **pointerdown stopPropagation** on need labels in `labels.js` prevents a bug where the canvas `pointerdown` handler also fires → `selectNeed()` is called twice → second call toggles selection off.
8. **Floating inquiry collision detection** uses AABB rects collected from emotion/need label DOM elements. Inquiries are nudged away from overlapping labels and from each other (for bridge emotions with diverging inquiries).
9. **Leader lines** are SVG elements in a dedicated overlay. Always shown for bridge emotions (2+ inquiries), only shown for single-inquiry emotions when text was pushed away from its natural position.
10. **Vite dev server** tends to die between sessions — restart with `npx vite --host`.
11. **GitHub Pages deploy** uses `build_type=workflow` (not legacy). The workflow has `workflow_dispatch` trigger for manual re-runs.

## Next Steps

### Phase 2.5: Expand to 6 Needs
- Add Safety, Autonomy, Growth needs + their ~13 additional emotions
- Data exists in the architecture doc (`docs/emotion-constellations-architecture.md`) — the full 6-need JSON with ~27 emotions
- Need colors already defined in `constants.js` for all 6

### Phase 3: Zoom & Pan
- Navigate the constellation map when more needs are added
- Pinch-zoom on mobile, scroll-wheel on desktop
- Camera transform in shaders (or transform the simulation coordinates)

### Phase 4: Right-Side Claude Chat Panel
- "Click anywhere or ask a question here..." prompt
- Conversational exploration of emotions and needs
- Text could flow in progressively (not all at once)

### Future Ideas (noted by Josh)
- **? icon** next to inquiry text — click once for message, click again for expanded "Emotional Wisdom of [emotion]" text on far right, as if asking the chatbot "tell me more" (text flows in progressively)
- Co-travel arcs (second connection type — learned habits vs. deep meaning)
- Personal constellation (user-customizable connections)
- i18n (Korean, etc.)
- Sub-needs zoom (32 expanded needs from p.84)
- Integration with quiz/assessment

## Useful Commands

```bash
cd /Users/joshuafreedman/Documents/emotion-constellations
npx vite --host          # Dev server (usually port 5173 or 5174)
npm run build            # Production build to dist/
git push origin main     # Triggers GitHub Actions deploy
```
