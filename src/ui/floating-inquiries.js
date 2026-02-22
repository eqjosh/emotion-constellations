/**
 * Floating inquiry text — inquiry questions materialize near stars.
 *
 * When an emotion is selected, each inquiry question appears between
 * its emotion star and linked need, offset perpendicular to the
 * connection thread. For bridge emotions (e.g. Love → Belonging + Meaning),
 * two inquiries diverge toward their respective needs.
 *
 * When a need is selected, NO inquiries appear — the connected stars
 * brighten as an invitation to click and explore further. A need
 * description floats near the need label instead.
 *
 * Positions update every frame to track drifting stars.
 * Text has a colored glow matching the need's colorSecondary.
 * When inquiry text would overlap a label, it's pushed further out
 * and an SVG leader line connects it back to the star.
 */

import { on, emit } from '../core/events.js';

export function createFloatingInquiries(container) {
  const elements = [];  // Array of { el, emotionId, needId, leaderLine?, anchorX?, anchorY? }
  let descriptionEl = null;   // Single element for need descriptions
  let svgOverlay = null;      // SVG layer for leader lines
  let unsubscribe = null;
  let isShowing = false;

  // Ensure an SVG overlay exists for leader lines
  function ensureSvg() {
    if (svgOverlay) return svgOverlay;
    svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgOverlay.classList.add('leader-lines-svg');
    svgOverlay.setAttribute('width', '100%');
    svgOverlay.setAttribute('height', '100%');
    svgOverlay.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:14;';
    container.appendChild(svgOverlay);
    return svgOverlay;
  }

  function clearSvg() {
    if (svgOverlay) svgOverlay.innerHTML = '';
  }

  // --- Position math ---

  /**
   * Compute screen position for an inquiry element.
   * Places it along the emotion→need vector, offset perpendicular.
   */
  function computePosition(emotionX, emotionY, needX, needY, index, totalCount) {
    const vx = needX - emotionX;
    const vy = needY - emotionY;
    const dist = Math.sqrt(vx * vx + vy * vy) || 1;

    // Along-thread ratio: for short threads push further from the star
    const ratio = dist > 200 ? 0.28 : Math.min(0.45, 55 / dist);

    const px = emotionX + ratio * vx;
    const py = emotionY + ratio * vy;

    // Perpendicular offset — alternate sides, with stagger
    const side = index % 2 === 0 ? 1 : -1;
    const baseOffset = 26 + (totalCount > 3 ? 6 : 0);
    const stagger = Math.floor(index / 2) * 12;
    const offsetPx = baseOffset + stagger;
    const perpX = (-vy / dist) * offsetPx * side;
    const perpY = (vx / dist) * offsetPx * side;

    return {
      x: px + perpX,
      y: py + perpY,
    };
  }

  /**
   * Clamp a position to keep text visible within viewport.
   */
  function clampToViewport(x, y) {
    const pad = 20;
    const bottomPad = 130;  // room for HUD bar + breathing space
    const maxX = window.innerWidth - pad;
    const maxY = window.innerHeight - bottomPad;
    return {
      x: Math.max(pad, Math.min(x, maxX)),
      y: Math.max(pad, Math.min(y, maxY)),
    };
  }

  // --- Overlap detection ---

  /**
   * Collect bounding rects of all visible need/emotion labels.
   */
  function collectLabelRects() {
    const rects = [];
    for (const el of container.querySelectorAll('.need-label, .emotion-label')) {
      // Skip dimmed labels — they're nearly invisible so overlap is fine
      if (el.classList.contains('need-label--dimmed') ||
          el.classList.contains('emotion-label--dimmed')) continue;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        rects.push(r);
      }
    }
    return rects;
  }

  /**
   * Check if rect A overlaps any rect in the list.
   */
  function overlapsAny(rect, rects) {
    for (const r of rects) {
      if (rect.left < r.right && rect.right > r.left &&
          rect.top < r.bottom && rect.bottom > r.top) {
        return true;
      }
    }
    return false;
  }

  /**
   * Push a position outward (perpendicular to the thread) until it
   * doesn't overlap any existing labels. Returns the new position
   * and whether a leader line is needed.
   */
  function resolveOverlap(x, y, emotionX, emotionY, needX, needY, index, labelRects) {
    // Check current position — place a temporary rect (approx 200×40)
    const hw = 110, hh = 22;
    const testRect = { left: x - hw, right: x + hw, top: y - hh, bottom: y + hh };

    if (!overlapsAny(testRect, labelRects)) {
      return { x, y, needsLeader: false };
    }

    // Push further away from the thread
    const vx = needX - emotionX;
    const vy = needY - emotionY;
    const dist = Math.sqrt(vx * vx + vy * vy) || 1;
    const side = index % 2 === 0 ? 1 : -1;
    const perpDirX = (-vy / dist) * side;
    const perpDirY = (vx / dist) * side;

    // Try increasing perpendicular offset by increments of 40px
    for (let extra = 40; extra <= 160; extra += 40) {
      const nx = x + perpDirX * extra;
      const ny = y + perpDirY * extra;
      const clamped = clampToViewport(nx, ny);
      const tr = {
        left: clamped.x - hw, right: clamped.x + hw,
        top: clamped.y - hh, bottom: clamped.y + hh,
      };
      if (!overlapsAny(tr, labelRects)) {
        return { x: clamped.x, y: clamped.y, needsLeader: true };
      }
    }

    // If all attempts overlap, use the maximum push
    const nx = x + perpDirX * 160;
    const ny = y + perpDirY * 160;
    const clamped = clampToViewport(nx, ny);
    return { x: clamped.x, y: clamped.y, needsLeader: true };
  }

  // --- Leader lines ---

  function createLeaderLine(fromX, fromY, toX, toY, color) {
    const svg = ensureSvg();
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', fromX);
    line.setAttribute('y1', fromY);
    line.setAttribute('x2', toX);
    line.setAttribute('y2', toY);
    const [r, g, b] = color;
    const cssColor = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, 0.3)`;
    line.setAttribute('stroke', cssColor);
    line.setAttribute('stroke-width', '1');
    line.setAttribute('stroke-dasharray', '4,4');
    svg.appendChild(line);
    return line;
  }

  // --- Element creation ---

  function clearImmediate() {
    for (const item of elements) {
      item.el.remove();
    }
    elements.length = 0;
    clearSvg();
    if (descriptionEl) {
      descriptionEl.remove();
      descriptionEl = null;
    }
    isShowing = false;
  }

  function createInquiryElement(inquiry, needColor, emotionId, needId, fadeDelay) {
    const el = document.createElement('div');
    el.className = 'floating-inquiry';

    // Build the need-colored glow via text-shadow
    const [r, g, b] = needColor;
    const cr = Math.round(r * 255);
    const cg = Math.round(g * 255);
    const cb = Math.round(b * 255);
    el.style.textShadow = `0 0 18px rgba(${cr}, ${cg}, ${cb}, 0.5), 0 0 40px rgba(${cr}, ${cg}, ${cb}, 0.25)`;

    // Staggered fade-in delay for organic appearance
    if (fadeDelay > 0) {
      el.style.transitionDelay = `${fadeDelay}ms`;
    }

    el.textContent = `\u201C${inquiry}\u201D`;

    // Tap inquiry navigates to the linked need
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      emit('input:need-click', { id: needId });
    });

    container.appendChild(el);

    // Trigger reflow then add visible class for fade-in
    el.offsetHeight; // eslint-disable-line no-unused-expressions
    requestAnimationFrame(() => {
      el.classList.add('floating-inquiry--visible');
    });

    elements.push({ el, emotionId, needId, needColor, leaderLine: null, anchorX: 0, anchorY: 0 });
    return el;
  }

  function createNeedDescription(need) {
    const el = document.createElement('div');
    el.className = 'floating-inquiry floating-inquiry--description';

    const [r, g, b] = need.colorSecondary || need.color || [1, 1, 1];
    const cr = Math.round(r * 255);
    const cg = Math.round(g * 255);
    const cb = Math.round(b * 255);
    el.style.textShadow = `0 0 18px rgba(${cr}, ${cg}, ${cb}, 0.4), 0 0 40px rgba(${cr}, ${cg}, ${cb}, 0.2)`;

    el.textContent = need.description || '';

    container.appendChild(el);
    el.offsetHeight; // eslint-disable-line no-unused-expressions
    requestAnimationFrame(() => {
      el.classList.add('floating-inquiry--visible');
    });

    descriptionEl = el;
    return el;
  }

  // --- Public API ---

  const api = {
    show(data) {
      clearImmediate();

      if (data.mode === 'emotion') {
        showEmotionInquiries(data);
      } else if (data.mode === 'need') {
        showNeedDescription(data);
      }
    },

    hide() {
      if (!isShowing) return;

      // Fade out inquiries
      for (const item of elements) {
        item.el.classList.remove('floating-inquiry--visible');
        const el = item.el;
        setTimeout(() => { if (el.parentNode) el.remove(); }, 600);
      }
      elements.length = 0;

      // Fade out description
      if (descriptionEl) {
        descriptionEl.classList.remove('floating-inquiry--visible');
        const el = descriptionEl;
        setTimeout(() => { if (el.parentNode) el.remove(); }, 600);
        descriptionEl = null;
      }

      clearSvg();
      isShowing = false;
    },

    /**
     * Update positions to track drifting stars.
     * Called from the pipeline frame loop.
     */
    updatePositions(emotionNodes, needNodes, needNodesById) {
      if (!isShowing) return;

      // Update need description position (below the need label)
      if (descriptionEl && descriptionEl._needId) {
        const need = needNodesById.get(descriptionEl._needId);
        if (need) {
          const labelRects = collectLabelRects();
          const hw = 160, hh = 45;
          const maxY = window.innerHeight - 130;

          // Try below the need first
          let descY = need.fy + 70;
          let placed = false;

          for (let attempt = 0; attempt < 3; attempt++) {
            if (descY + hh > maxY) break;  // would go behind HUD bar
            const testRect = {
              left: need.fx - hw, right: need.fx + hw,
              top: descY - hh, bottom: descY + hh,
            };
            if (!overlapsAny(testRect, labelRects)) { placed = true; break; }
            descY += 35;
          }

          // If below didn't work, try above the need
          if (!placed) {
            descY = need.fy - 70;
            for (let attempt = 0; attempt < 3; attempt++) {
              if (descY - hh < 20) break;
              const testRect = {
                left: need.fx - hw, right: need.fx + hw,
                top: descY - hh, bottom: descY + hh,
              };
              if (!overlapsAny(testRect, labelRects)) { placed = true; break; }
              descY -= 35;
            }
          }

          // Fallback: just put it below the need, clamped
          if (!placed) descY = need.fy + 70;

          const clamped = clampToViewport(need.fx, descY);
          descriptionEl.style.left = `${clamped.x}px`;
          descriptionEl.style.top = `${clamped.y}px`;
        }
      }

      if (elements.length === 0) return;

      // Build emotion lookup
      const emotionMap = new Map();
      for (const e of emotionNodes) {
        emotionMap.set(e.id, e);
      }

      // Collect label rects once per update for overlap detection
      const labelRects = collectLabelRects();

      // Track placed inquiry rects so bridge-emotion inquiries don't overlap each other
      const placedInquiryRects = [];

      // Clear old leader lines
      clearSvg();

      for (let i = 0; i < elements.length; i++) {
        const item = elements[i];
        const emotion = emotionMap.get(item.emotionId);
        const need = needNodesById.get(item.needId);
        if (!emotion || !need) continue;

        const basePos = computePosition(emotion.x, emotion.y, need.fx, need.fy, i, elements.length);
        const baseClamped = clampToViewport(basePos.x, basePos.y);

        // Check for overlap with labels AND previously placed inquiries
        const allObstacles = labelRects.concat(placedInquiryRects);
        const resolved = resolveOverlap(
          baseClamped.x, baseClamped.y,
          emotion.x, emotion.y, need.fx, need.fy,
          i, allObstacles
        );

        item.el.style.left = `${resolved.x}px`;
        item.el.style.top = `${resolved.y}px`;

        // Record this inquiry's rect for subsequent collision checks
        const hw = 110, hh = 22;
        placedInquiryRects.push({
          left: resolved.x - hw, right: resolved.x + hw,
          top: resolved.y - hh, bottom: resolved.y + hh,
        });

        // Draw leader line:
        // - Always for bridge emotions (2+ inquiries) so user sees which text → which need
        // - For single inquiries, only when pushed away from overlap
        const isBridge = elements.length > 1;
        if (isBridge || resolved.needsLeader) {
          item.leaderLine = createLeaderLine(
            emotion.x, emotion.y,
            resolved.x, resolved.y,
            item.needColor || [1, 1, 1]
          );
        }
      }
    },

    destroy() {
      clearImmediate();
      if (unsubscribe) unsubscribe();
    },
  };

  // --- Selection mode handlers ---

  function showEmotionInquiries(data) {
    const { id: emotionId, emotion, inquiries = [] } = data;
    if (!emotion || inquiries.length === 0) return;

    isShowing = true;

    // Stagger fade-in: each subsequent inquiry gets an additional delay
    const staggerMs = 400;  // ms between each inquiry appearing
    for (let i = 0; i < inquiries.length; i++) {
      const inq = inquiries[i];
      const needColor = inq.needColor || [1, 1, 1];
      createInquiryElement(inq.inquiry, needColor, emotionId, inq.needId, i * staggerMs);
    }
  }

  function showNeedDescription(data) {
    const { id: needId, need } = data;
    if (!need) return;

    isShowing = true;

    const el = createNeedDescription(need);
    el._needId = needId;
  }

  // --- Subscribe to selection events ---
  unsubscribe = on('selection:changed', (data) => {
    if (data.mode === 'idle') {
      api.hide();
    } else {
      api.show(data);
    }
  });

  return api;
}
