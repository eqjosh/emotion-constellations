# Emotion Constellation: Architecture & Build Specification

## Project Vision

An interactive, non-dualistic visualization of emotions and human needs — a companion to the Emotional Wisdom Wheel (eqjosh.github.io/wheel/) that moves beyond Plutchik's opposite-based model. Instead of placing emotions on axes of opposition, this visualization treats **core human needs as gravitational centers** with **emotions as multiple messengers** orbiting and bridging between them.

The core insight from *Emotion Rules* (Chapter 4, "Wholeness — Beyond Opposites"): emotions that seem like opposites are actually different vantage points on the same mountain. Fear and Trust both serve Safety. Loneliness and Love both serve Belonging. The visualization should make this interconnectedness *visible and explorable*.

**Name candidates:** Emotion Constellation, Feeling Galaxy, Emotion Compass (non-directional), Signals Map

---

## Design Concept: Constellation + Living Network Hybrid

### Visual Metaphor
A dark, softly glowing canvas — like a night sky or deep ocean. Six (expandable) core needs exist as luminous regions/nebulae. Emotions float as particles/stars within and *between* these regions. The key non-dualistic move: emotions can belong to multiple needs simultaneously, appearing in overlap zones rather than pinned to a single axis.

### Interaction Model

**Idle state:** Gentle ambient motion. Need-regions softly pulse. Emotion nodes drift slowly in their gravitational zones. Faint connection lines hint at relationships.

**Click/tap a NEED:** 
- The need-region brightens and expands
- Its associated emotions animate inward, clustering around it
- Each emotion shows its inquiry question (from the book)
- Other needs dim but remain visible
- Emotions shared with other needs show visible "bridges" — luminous threads stretching to the other need(s) they also serve

**Click/tap an EMOTION:**
- The emotion pulses and centers
- All needs it serves light up with connecting threads (Visual Thesaurus-style reorganization)
- Fellow messenger emotions (those sharing a need) gently highlight
- An info panel reveals: the inquiry question, the need(s) it serves, and a brief description
- The network gently reorganizes around this emotion as focal point (force-directed rebalancing)

**Click/tap a CONNECTION (thread between emotion and need):**
- Reveals the specific inquiry question for that emotion-need pairing
- e.g., clicking the thread between "Anger" and "Achievement" shows: "What's blocking the way?"

### Visual Language
- **Needs:** Large, soft, glowing regions — not circles with hard edges, more like nebulae or warm light pools. Each has a distinct color palette.
- **Emotions:** Smaller luminous nodes/particles. Their color blends the palette of the need(s) they serve. Emotions serving two needs show gradient or dual coloring.
- **Connections:** Thin luminous threads, varying in opacity. Brighten on interaction.
- **No axes, no lines of opposition.** The spatial arrangement is organic, emerging from the force simulation — not from a predefined geometric structure.

### Color Palette (Suggested — needs refinement with Gent)
| Need | Primary Color | Mood |
|------|--------------|------|
| Safety | Deep blue / indigo | Grounding, stable |
| Belonging | Warm amber / gold | Warmth, connection |
| Autonomy | Teal / cyan | Freedom, space |
| Achievement | Warm coral / orange | Energy, drive |
| Meaning | Deep purple / violet | Depth, transcendence |
| Growth | Green / emerald | Vitality, emergence |

Background: Very dark navy/charcoal (#0a0e1a or similar) — dark enough for the glow effects to read, warm enough not to feel cold.

---

## Data Model

### Core Principle
The data model must support:
1. **Many-to-many relationships** between emotions and needs (the key non-dualistic feature)
2. **Internationalization** from day one (i18n-ready with locale files)
3. **Expandability** — more needs, more emotions, more languages over time
4. **Rich content** — each emotion-need pairing has its own inquiry question

### Schema

```typescript
// Core types
interface Need {
  id: string;                    // e.g., "safety", "belonging"
  label: LocalizedString;        // { en: "Safety", ko: "안전", ... }
  description: LocalizedString;  // Brief description from the book
  color: string;                 // Primary color hex
  colorSecondary: string;        // Secondary/glow color hex
}

interface Emotion {
  id: string;                    // e.g., "fear", "trust", "loneliness"
  label: LocalizedString;        // { en: "Fear", ko: "두려움", ... }
  needs: EmotionNeedLink[];      // Links to one or more needs
  description?: LocalizedString; // Optional general description
}

interface EmotionNeedLink {
  needId: string;                // Which need this emotion serves
  inquiry: LocalizedString;      // The specific question this emotion asks about this need
  strength?: number;             // 0-1, how strongly associated (affects gravitational pull)
}

interface LocalizedString {
  en: string;
  ko?: string;
  zh?: string;
  ja?: string;
  it?: string;
  es?: string;
  [key: string]: string | undefined;
}
```

### Initial Dataset (from Emotion Rules pp. 75-76, 81-83)

```json
{
  "needs": [
    {
      "id": "safety",
      "label": { "en": "Safety" },
      "description": { "en": "Deep in our neural architecture, the drive for safety is primary. Our brains are wired to detect and respond to threats." },
      "color": "#1a3a6b",
      "colorSecondary": "#3366cc"
    },
    {
      "id": "belonging",
      "label": { "en": "Belonging" },
      "description": { "en": "These social emotions run deep. They shape behavior, values, even self-image. They invite reflection on how and where we seek connection." },
      "color": "#8b6914",
      "colorSecondary": "#d4a832"
    },
    {
      "id": "autonomy",
      "label": { "en": "Autonomy" },
      "description": { "en": "A quiet need, until it's taken away; then emotions flare. These signals push us to reclaim authorship of our own lives." },
      "color": "#0d6b6e",
      "colorSecondary": "#2cc4c9"
    },
    {
      "id": "achievement",
      "label": { "en": "Achievement" },
      "description": { "en": "This family of emotions energizes action and asks us to recalibrate. They guide us through ambition, readiness, and challenge." },
      "color": "#8b3a1a",
      "colorSecondary": "#e06030"
    },
    {
      "id": "meaning",
      "label": { "en": "Meaning" },
      "description": { "en": "These emotions reflect the search for something beyond survival, for what makes life feel meaningful. They orient us toward values and vision." },
      "color": "#4a1a6b",
      "colorSecondary": "#8844bb"
    },
    {
      "id": "growth",
      "label": { "en": "Growth" },
      "description": { "en": "Growth is rarely linear. These feelings often come in waves, pointing us toward discomfort that precedes insight." },
      "color": "#1a6b2a",
      "colorSecondary": "#33cc55"
    }
  ],
  "emotions": [
    {
      "id": "trust",
      "label": { "en": "Trust" },
      "needs": [
        {
          "needId": "safety",
          "inquiry": { "en": "Do I have support and protection?" },
          "strength": 0.9
        },
        {
          "needId": "belonging",
          "inquiry": { "en": "Are the bonds around me reliable?" },
          "strength": 0.5
        }
      ]
    },
    {
      "id": "fear",
      "label": { "en": "Fear" },
      "needs": [
        {
          "needId": "safety",
          "inquiry": { "en": "What is it that I care about, and what is the risk?" },
          "strength": 0.9
        }
      ]
    },
    {
      "id": "vigilance",
      "label": { "en": "Vigilance" },
      "needs": [
        {
          "needId": "safety",
          "inquiry": { "en": "What's coming next?" },
          "strength": 0.8
        }
      ]
    },
    {
      "id": "surprise",
      "label": { "en": "Surprise" },
      "needs": [
        {
          "needId": "safety",
          "inquiry": { "en": "What just changed, and how do I need to adapt?" },
          "strength": 0.7
        },
        {
          "needId": "growth",
          "inquiry": { "en": "What is new here for me to learn?" },
          "strength": 0.4
        }
      ]
    },
    {
      "id": "loneliness",
      "label": { "en": "Loneliness" },
      "needs": [
        {
          "needId": "belonging",
          "inquiry": { "en": "Am I disconnected from others or myself?" },
          "strength": 0.9
        }
      ]
    },
    {
      "id": "love",
      "label": { "en": "Love" },
      "needs": [
        {
          "needId": "belonging",
          "inquiry": { "en": "What bonds are worth cherishing and strengthening?" },
          "strength": 0.9
        },
        {
          "needId": "safety",
          "inquiry": { "en": "What do I care so much about that I fear losing it?" },
          "strength": 0.4
        }
      ]
    },
    {
      "id": "jealousy",
      "label": { "en": "Jealousy" },
      "needs": [
        {
          "needId": "belonging",
          "inquiry": { "en": "Do I want what others seem to have?" },
          "strength": 0.8
        },
        {
          "needId": "achievement",
          "inquiry": { "en": "Am I falling behind where I want to be?" },
          "strength": 0.4
        }
      ]
    },
    {
      "id": "shame",
      "label": { "en": "Shame" },
      "needs": [
        {
          "needId": "belonging",
          "inquiry": { "en": "Have I fallen short of expectations?" },
          "strength": 0.8
        },
        {
          "needId": "growth",
          "inquiry": { "en": "Am I living up to my own standards?" },
          "strength": 0.5
        }
      ]
    },
    {
      "id": "frustrated",
      "label": { "en": "Frustration" },
      "needs": [
        {
          "needId": "autonomy",
          "inquiry": { "en": "What is preventing me from making my own way?" },
          "strength": 0.9
        },
        {
          "needId": "achievement",
          "inquiry": { "en": "Why can't I move forward?" },
          "strength": 0.5
        }
      ]
    },
    {
      "id": "guilty",
      "label": { "en": "Guilt" },
      "needs": [
        {
          "needId": "autonomy",
          "inquiry": { "en": "Did I make a choice that violated my own standards?" },
          "strength": 0.7
        },
        {
          "needId": "belonging",
          "inquiry": { "en": "Have I damaged a relationship that matters to me?" },
          "strength": 0.5
        },
        {
          "needId": "growth",
          "inquiry": { "en": "Am I holding back from doing better?" },
          "strength": 0.4
        }
      ]
    },
    {
      "id": "free",
      "label": { "en": "Freedom" },
      "needs": [
        {
          "needId": "autonomy",
          "inquiry": { "en": "What is the path I want to take?" },
          "strength": 0.9
        }
      ]
    },
    {
      "id": "trapped",
      "label": { "en": "Trapped" },
      "needs": [
        {
          "needId": "autonomy",
          "inquiry": { "en": "What is limiting my power to act?" },
          "strength": 0.9
        }
      ]
    },
    {
      "id": "anger",
      "label": { "en": "Anger" },
      "needs": [
        {
          "needId": "achievement",
          "inquiry": { "en": "What's blocking the way?" },
          "strength": 0.8
        },
        {
          "needId": "autonomy",
          "inquiry": { "en": "What boundary or value is being threatened?" },
          "strength": 0.7
        }
      ]
    },
    {
      "id": "excitement",
      "label": { "en": "Excitement" },
      "needs": [
        {
          "needId": "achievement",
          "inquiry": { "en": "What's fueling me to move?" },
          "strength": 0.8
        },
        {
          "needId": "growth",
          "inquiry": { "en": "What new possibility am I sensing?" },
          "strength": 0.4
        }
      ]
    },
    {
      "id": "urgency",
      "label": { "en": "Urgency" },
      "needs": [
        {
          "needId": "achievement",
          "inquiry": { "en": "What do I need to prioritize?" },
          "strength": 0.8
        }
      ]
    },
    {
      "id": "pride",
      "label": { "en": "Pride" },
      "needs": [
        {
          "needId": "achievement",
          "inquiry": { "en": "Can I honor my own contribution?" },
          "strength": 0.8
        },
        {
          "needId": "belonging",
          "inquiry": { "en": "Do others see my value?" },
          "strength": 0.3
        }
      ]
    },
    {
      "id": "doubt",
      "label": { "en": "Doubt" },
      "needs": [
        {
          "needId": "achievement",
          "inquiry": { "en": "Am I prepared enough, or is something missing?" },
          "strength": 0.7
        },
        {
          "needId": "meaning",
          "inquiry": { "en": "How open am I to what's new and possible?" },
          "strength": 0.5
        }
      ]
    },
    {
      "id": "awe",
      "label": { "en": "Awe" },
      "needs": [
        {
          "needId": "meaning",
          "inquiry": { "en": "Where do I fit in the face of this greater whole?" },
          "strength": 0.9
        }
      ]
    },
    {
      "id": "despair",
      "label": { "en": "Despair" },
      "needs": [
        {
          "needId": "meaning",
          "inquiry": { "en": "Has something I counted on disappeared?" },
          "strength": 0.8
        },
        {
          "needId": "safety",
          "inquiry": { "en": "Is there still a way forward?" },
          "strength": 0.4
        }
      ]
    },
    {
      "id": "inspiration",
      "label": { "en": "Inspiration" },
      "needs": [
        {
          "needId": "meaning",
          "inquiry": { "en": "What is calling me forward?" },
          "strength": 0.9
        },
        {
          "needId": "growth",
          "inquiry": { "en": "What am I ready to become?" },
          "strength": 0.5
        }
      ]
    },
    {
      "id": "emptiness",
      "label": { "en": "Emptiness" },
      "needs": [
        {
          "needId": "meaning",
          "inquiry": { "en": "What's missing?" },
          "strength": 0.8
        }
      ]
    },
    {
      "id": "delight",
      "label": { "en": "Delight" },
      "needs": [
        {
          "needId": "meaning",
          "inquiry": { "en": "What's beyond what I could have imagined?" },
          "strength": 0.7
        },
        {
          "needId": "growth",
          "inquiry": { "en": "Am I noticing my own aliveness?" },
          "strength": 0.5
        }
      ]
    },
    {
      "id": "curiosity",
      "label": { "en": "Curiosity" },
      "needs": [
        {
          "needId": "growth",
          "inquiry": { "en": "What is here for me to learn or discover?" },
          "strength": 0.9
        },
        {
          "needId": "meaning",
          "inquiry": { "en": "What limits can I expand?" },
          "strength": 0.4
        }
      ]
    },
    {
      "id": "joy",
      "label": { "en": "Joy" },
      "needs": [
        {
          "needId": "growth",
          "inquiry": { "en": "Am I noticing my own expansion or aliveness?" },
          "strength": 0.7
        },
        {
          "needId": "meaning",
          "inquiry": { "en": "What makes life feel worth living right now?" },
          "strength": 0.5
        }
      ]
    },
    {
      "id": "impatience",
      "label": { "en": "Impatience" },
      "needs": [
        {
          "needId": "growth",
          "inquiry": { "en": "What's holding me back?" },
          "strength": 0.7
        },
        {
          "needId": "achievement",
          "inquiry": { "en": "Why isn't progress happening faster?" },
          "strength": 0.5
        }
      ]
    },
    {
      "id": "depression",
      "label": { "en": "Depression" },
      "needs": [
        {
          "needId": "growth",
          "inquiry": { "en": "Do I really want to move forward?" },
          "strength": 0.7
        },
        {
          "needId": "meaning",
          "inquiry": { "en": "What has lost its purpose?" },
          "strength": 0.6
        }
      ]
    },
    {
      "id": "boredom",
      "label": { "en": "Boredom" },
      "needs": [
        {
          "needId": "growth",
          "inquiry": { "en": "Is it time to learn or explore?" },
          "strength": 0.8
        }
      ]
    }
  ]
}
```

### Notes on the Dataset
- **Emotions serving multiple needs** are the most interesting nodes visually — they form bridges in the constellation. Guilt bridges Autonomy, Belonging, and Growth. Anger bridges Achievement and Autonomy. These are the nodes that make the visualization sing.
- **Strength values** affect gravitational pull in the physics simulation — an emotion with 0.9 strength to Safety and 0.4 to Growth will float closer to Safety but still show a visible connection to Growth.
- **This is the starter set.** The book references many more emotions (the "1,000 feelings on my word list" at 6sec.org/feel). The architecture should make it trivial to add more.

---

## Technical Architecture

### Option A: Firebase (Recommended if admin functions needed)
Add to existing Firebase project. Benefits: already has infra, admin panel patterns, easy to add content management for emotions/needs data.

**Structure:**
```
/emotion-constellation
  /public
    index.html
    /js
      main.js          # App initialization, routing
      constellation.js # Force simulation & rendering
      data.js          # Data loading & locale management  
      interactions.js  # Click/tap/hover handlers
      ui.js            # Info panels, overlays
    /css
      styles.css
    /data
      emotions-en.json
      emotions-ko.json  # (future)
      ...
    /assets
      (any textures/sprites for particles)
```

**Admin (later):**
- Firestore collection for emotions/needs data
- Admin UI to add/edit emotions, needs, translations
- Publish workflow: edit in admin → approve → deploy to static JSON

### Option B: AWS (if preferred for infrastructure alignment)
S3 + CloudFront for static hosting. Same frontend code. Could use DynamoDB + Lambda for future admin API.

### Recommendation
**Start as a static site** (like the wheel at eqjosh.github.io/wheel/). All data lives in JSON files. Deploy to GitHub Pages or Firebase Hosting. This lets you iterate on the visualization without backend complexity. Add admin/CMS later when the data model stabilizes and you're ready to manage translations at scale.

---

## Technology Stack

### Rendering: Canvas + D3 Force Simulation
- **D3.js (d3-force)** for the physics simulation — handles gravitational clustering, collision detection, link forces. This is the engine that makes emotions cluster around needs and bridge between them.
- **HTML Canvas** for rendering — needed for the glow/blur effects, particle trails, and smooth 60fps animation. SVG would struggle with the visual effects at this node count.
- **No WebGL/Three.js for V1** — Canvas is sufficient and much simpler to build/debug. WebGL can be added later for fancier effects if needed.

### Framework
- **Vanilla JS or lightweight framework** — keeping it simple like the wheel app. No React needed for V1.
- OR if the Firebase project already uses React, match that for consistency.

### Key Libraries
```
d3-force          # Physics simulation
d3-selection      # DOM manipulation  
d3-scale          # Color interpolation
d3-ease           # Animation easing
```

### i18n Approach
- Locale JSON files: `emotions-en.json`, `emotions-ko.json`, etc.
- URL parameter or dropdown for language selection: `?lang=ko`
- All display strings come from data files, never hardcoded
- Fallback chain: requested locale → English → key ID

---

## Physics Simulation Design

This is the heart of what makes it feel alive and non-dualistic.

### Force Model

```
NEED nodes: Fixed positions (arranged in a loose circle/organic layout)
  - Large mass, high charge (repel each other to maintain spacing)
  - Positions can be manually tuned for aesthetic balance

EMOTION nodes: Free-floating, governed by forces:
  1. GRAVITY toward each linked need (strength proportional to link.strength)
     - Emotions with one strong link cluster tightly around that need
     - Emotions with multiple links float in the "between" space
  2. COLLISION avoidance (prevent overlapping)
  3. CENTERING force (gentle pull toward canvas center to prevent drift)
  4. DAMPING (friction to prevent endless oscillation)
```

### Interaction Physics
When a need is clicked:
- Temporarily increase gravity toward that need for its linked emotions
- Decrease gravity for unrelated nodes (they drift outward/dim)
- Animate over ~800ms with easing

When an emotion is clicked:
- The emotion becomes a temporary fixed point
- Its linked needs brighten
- Fellow messengers (emotions sharing a need) cluster nearby
- Gentle force reorganization (~600ms)

When nothing is selected (idle):
- Very slow drift/breathing motion
- Subtle random perturbation to prevent static feeling
- Connection lines at low opacity

---

## UI Components

### Info Panel
Appears on click/tap. Slides in from bottom on mobile, appears as a card on desktop.

**When a NEED is selected:**
```
┌─────────────────────────────┐
│  ☀ BELONGING                │
│                             │
│  These social emotions run  │
│  deep. They shape behavior, │
│  values, even self-image.   │
│                             │
│  Feelings connected to      │
│  Belonging:                 │
│                             │
│  ● Loneliness               │
│    "Am I disconnected from  │
│     others or myself?"      │
│                             │
│  ● Love                     │
│    "What bonds are worth    │
│     cherishing?"            │
│                             │
│  ● Jealousy                 │
│    "Do I want what others   │
│     seem to have?"          │
│                             │
│  ● Shame                    │
│    "Have I fallen short of  │
│     expectations?"          │
│                             │
│  From Emotion Rules p.82    │
│  [Learn more →]             │
└─────────────────────────────┘
```

**When an EMOTION is selected:**
```
┌─────────────────────────────┐
│  ◉ ANGER                    │
│                             │
│  This feeling serves        │
│  multiple needs:            │
│                             │
│  → Achievement              │
│    "What's blocking         │
│     the way?"               │
│                             │
│  → Autonomy                 │
│    "What boundary or value  │
│     is being threatened?"   │
│                             │
│  Fellow messengers for      │
│  Achievement:               │
│  Excitement · Urgency ·     │
│  Pride · Doubt              │
│                             │
│  From Emotion Rules p.82    │
│  [Learn more →]             │
└─────────────────────────────┘
```

### Language Selector
Dropdown in top-right corner. Same pattern as the wheel app.

### Legend / Help
Brief overlay explaining the visual language:
- "Glowing regions = core human needs"
- "Floating points = emotions"  
- "Threads = emotions serve these needs"
- "Click any element to explore"

### Book CTA
Subtle, persistent link: "From *Emotion Rules* by Joshua Freedman" with link to emotionrules.com

---

## Responsive Design

### Desktop (>768px)
- Full canvas with info panel as floating card (right side or bottom-right)
- Mouse hover shows tooltip previews before click
- Scroll to zoom (optional)

### Mobile (<768px)  
- Full-screen canvas
- Tap to select (no hover state)
- Info panel slides up from bottom as a drawer (half-screen)
- Swipe down to dismiss
- Pinch to zoom (optional for V2)
- Need labels always visible (emotion labels appear on tap)

### Accessibility
- All info available via keyboard navigation (tab through nodes)
- ARIA labels on interactive elements
- High-contrast mode option (solid colors instead of glow effects)
- Screen reader: list-based fallback of all emotions grouped by need

---

## Build Phases

### Phase 1: Core Visualization (MVP)
- [ ] Static data file with 6 needs + ~27 emotions from the book
- [ ] Canvas rendering with D3 force simulation
- [ ] Need regions with glow effects
- [ ] Emotion nodes with gravitational clustering
- [ ] Connection lines (emotion → need)
- [ ] Click to select need (cluster animation)
- [ ] Click to select emotion (info + connections highlight)
- [ ] Info panel with inquiry questions
- [ ] Responsive layout (desktop + mobile)
- [ ] English only
- [ ] Deploy to GitHub Pages or Firebase Hosting

### Phase 2: Polish & Feel
- [ ] Idle breathing animation
- [ ] Smooth transitions between selection states
- [ ] Visual Thesaurus-style reorganization on emotion click
- [ ] Particle effects / ambient atmosphere
- [ ] Color blending for multi-need emotions
- [ ] Legend/help overlay
- [ ] Book CTA integration

### Phase 3: i18n & Content
- [ ] Language selector UI
- [ ] Korean translation file
- [ ] Locale loading and fallback chain
- [ ] RTL support preparation (for future Arabic)
- [ ] Expanded emotion set (beyond the initial 27)

### Phase 4: Admin & CMS (if needed)
- [ ] Firestore data model for emotions/needs
- [ ] Admin UI for editing content and translations
- [ ] Publish/preview workflow
- [ ] Analytics (which emotions/needs are most explored)

---

## Key Design Principles (for the developer)

1. **No opposites anywhere.** Never position emotions "across from" each other. The spatial layout should feel organic, not geometric.

2. **Overlap is the feature.** The most visually interesting moments are when an emotion bridges multiple needs. Make these bridge-emotions visually prominent.

3. **Gentle, not flashy.** The aesthetic should feel contemplative — like stargazing, not like a video game. Slow animations, soft glows, breathing rhythms.

4. **The inquiry questions are the payload.** The visualization is beautiful, but the real value is surfacing those questions: "What is this feeling trying to help me understand?" Every interaction path should lead to a question.

5. **Mobile-first feel.** This will be shared on social media and explored on phones. The tap experience matters more than the desktop experience.

6. **Expandable data model.** The book lists 32 needs on p.84 (acceptance, appreciation, autonomy, beauty, belonging, competence, connection, contribution, creativity, emotional safety, freedom, fun, growth, health, honesty, intimacy, love, meaning, movement, nourishment, physical safety, play, prosperity, purpose, recognition, relaxation, respect, rest, security, self-expression, understanding). We start with 6 but the architecture should handle 30+ needs and hundreds of emotions without redesign.

---

## Reference: Complete Needs List from p.84

These are all the needs mentioned in the book. The initial 6 (Safety, Belonging, Autonomy, Achievement, Meaning, Growth) are the "Signals of What Matters" framework from pp.81-83. The expanded list could become sub-needs or a second layer:

**Expanded needs (from the practice on p.84):**
Acceptance, Appreciation, Autonomy, Beauty, Belonging, Competence, Connection, Contribution, Creativity, Emotional Safety, Freedom, Fun, Growth, Health, Honesty, Intimacy, Love, Meaning, Movement, Nourishment, Physical Safety, Play, Prosperity, Purpose, Recognition, Relaxation, Respect, Rest, Security, Self-expression, Understanding

**Possible future hierarchy:** The 6 core needs could become "clusters" that contain sub-needs. E.g., Safety contains Physical Safety, Emotional Safety, Security. Belonging contains Connection, Intimacy, Love, Acceptance. This would create a zoom-in interaction: click Safety → see its sub-needs → see their emotions.

---

## Reference: Existing Wheel App

The current Emotional Wisdom Wheel lives at: https://eqjosh.github.io/wheel/
- GitHub Pages deployment
- Already supports EN, ES, IT, JA
- Plutchik-based (8 basic emotions, opposites structure)
- The Constellation should complement, not replace, the wheel
- Consider linking between them: "See this emotion on the Wheel →" and vice versa

---

## Open Questions for Josh

1. **Naming:** Emotion Constellation? Feeling Galaxy? Signals Map? Something from the book's metaphors (e.g., "Lights Along the Path")?
2. **Hosting:** GitHub Pages (simplest), Firebase Hosting (matches existing infra), or AWS?
3. **Should emotions that serve only one need look different** from bridge-emotions that serve multiple needs? (I'd say yes — make the bridges visually special.)
4. **Sound?** Subtle ambient tones could reinforce the contemplative feel. Or too much?
5. **Should users be able to add their own emotion-need connections?** (e.g., "I experience anger as connected to belonging, not just achievement") — this would be powerful but adds significant complexity.
6. **Integration with the quiz/assessment system?** e.g., "Take the quiz, then see YOUR emotional constellation highlighted"

---

*This document is intended as a build specification for Claude Code. The developer should start with Phase 1, using vanilla JS + D3 + Canvas, deploying as a static site. All content comes from the JSON data file, making i18n and content expansion straightforward.*
