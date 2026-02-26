# Emotion Constellation — Claude Code Update Instructions

## Overview

We're making four categories of updates to the Emotion Constellation visualization:
1. Add 12 new emotions to the data model
2. Enhance need region visuals (soft radial glow backgrounds)
3. Improve selection contrast (more opaque label backgrounds, stronger dimming)
4. Add entry animation (needs appear first, then emotions drift in)
5. Add very slow ambient rotation to the whole constellation

---

## 1. NEW EMOTIONS TO ADD

Add these 12 emotions to the data model. Each has an `id`, `label`, and `needs` array with `needId`, `inquiry` (the question this emotion asks about that need), and `strength` (0-1, controls gravitational pull toward that need).

**IMPORTANT:** Many of these serve multiple needs — that's by design. They should appear in the gravitational overlap between their linked needs, not pinned to just one.

```json
{
  "id": "sadness",
  "label": { "en": "Sadness" },
  "needs": [
    {
      "needId": "belonging",
      "inquiry": { "en": "What connection has been lost or is missing?" },
      "strength": 0.8
    },
    {
      "needId": "meaning",
      "inquiry": { "en": "What do I care about so much that losing it hurts?" },
      "strength": 0.6
    }
  ]
},
{
  "id": "anxiety",
  "label": { "en": "Anxiety" },
  "needs": [
    {
      "needId": "safety",
      "inquiry": { "en": "What do I care about that feels at risk?" },
      "strength": 0.8
    },
    {
      "needId": "achievement",
      "inquiry": { "en": "Am I prepared enough for what's ahead?" },
      "strength": 0.5
    }
  ]
},
{
  "id": "gratitude",
  "label": { "en": "Gratitude" },
  "needs": [
    {
      "needId": "belonging",
      "inquiry": { "en": "What connections and gifts have I been given?" },
      "strength": 0.7
    },
    {
      "needId": "meaning",
      "inquiry": { "en": "What richness is already present in my life?" },
      "strength": 0.6
    }
  ]
},
{
  "id": "hope",
  "label": { "en": "Hope" },
  "needs": [
    {
      "needId": "meaning",
      "inquiry": { "en": "What opportunities do I see to move toward what I want?" },
      "strength": 0.7
    },
    {
      "needId": "growth",
      "inquiry": { "en": "What am I ready to grow into?" },
      "strength": 0.6
    }
  ]
},
{
  "id": "compassion",
  "label": { "en": "Compassion" },
  "needs": [
    {
      "needId": "belonging",
      "inquiry": { "en": "How can I stay present with suffering — mine or others'?" },
      "strength": 0.7
    },
    {
      "needId": "growth",
      "inquiry": { "en": "What is this pain teaching me about what matters?" },
      "strength": 0.5
    }
  ]
},
{
  "id": "grief",
  "label": { "en": "Grief" },
  "needs": [
    {
      "needId": "belonging",
      "inquiry": { "en": "What bond has been broken or transformed?" },
      "strength": 0.9
    },
    {
      "needId": "meaning",
      "inquiry": { "en": "How do I make sense of this loss?" },
      "strength": 0.7
    }
  ]
},
{
  "id": "stress",
  "label": { "en": "Stress" },
  "needs": [
    {
      "needId": "safety",
      "inquiry": { "en": "Are my challenges greater than my resources?" },
      "strength": 0.7
    },
    {
      "needId": "achievement",
      "inquiry": { "en": "What do I need to prioritize or let go of?" },
      "strength": 0.5
    }
  ]
},
{
  "id": "overwhelm",
  "label": { "en": "Overwhelm" },
  "needs": [
    {
      "needId": "safety",
      "inquiry": { "en": "What is too much right now?" },
      "strength": 0.7
    },
    {
      "needId": "autonomy",
      "inquiry": { "en": "Where have I lost the ability to choose?" },
      "strength": 0.6
    }
  ]
},
{
  "id": "contentment",
  "label": { "en": "Contentment" },
  "needs": [
    {
      "needId": "safety",
      "inquiry": { "en": "What is settled and at peace right now?" },
      "strength": 0.6
    },
    {
      "needId": "meaning",
      "inquiry": { "en": "Am I aligned with what matters?" },
      "strength": 0.6
    }
  ]
},
{
  "id": "courage",
  "label": { "en": "Courage" },
  "needs": [
    {
      "needId": "safety",
      "inquiry": { "en": "What am I willing to risk for what I care about?" },
      "strength": 0.6
    },
    {
      "needId": "growth",
      "inquiry": { "en": "What becomes possible if I move through this fear?" },
      "strength": 0.7
    }
  ]
},
{
  "id": "disgust",
  "label": { "en": "Disgust" },
  "needs": [
    {
      "needId": "safety",
      "inquiry": { "en": "What rules have been violated? Is this situation safe?" },
      "strength": 0.8
    },
    {
      "needId": "belonging",
      "inquiry": { "en": "Does this align with the values of my community?" },
      "strength": 0.4
    }
  ]
},
{
  "id": "exhaustion",
  "label": { "en": "Exhaustion" },
  "needs": [
    {
      "needId": "achievement",
      "inquiry": { "en": "Have I been pushing too hard without return?" },
      "strength": 0.7
    },
    {
      "needId": "meaning",
      "inquiry": { "en": "Has the purpose behind my effort disappeared?" },
      "strength": 0.6
    },
    {
      "needId": "belonging",
      "inquiry": { "en": "Am I trying to do this alone?" },
      "strength": 0.4
    }
  ]
}
```

This brings the total from ~27 to ~39 emotions. After adding, verify no existing emotions were removed or modified.

---

## 2. ENHANCE NEED REGION VISUALS

Each of the 6 need nodes should have a **soft radial gradient glow** behind it — like a nebula or warm light pool. This makes the needs feel like *places* or *regions*, not just labels among the emotions.

**Implementation:**
- Draw a radial gradient circle behind each need node, centered on the need's position
- Radius: approximately 120-180px (experiment to find the right size relative to the emotion cluster)
- Gradient: from the need's color at ~15-20% opacity in the center → fully transparent at the edge
- The glow should be rendered BEHIND the emotion nodes and connection lines (draw it first in the render order)
- The glow should move with the need node's position in the force simulation
- When a need is selected, its glow can intensify slightly (increase center opacity to ~30%)
- When a need is NOT selected and another element IS selected, the glow should dim along with everything else

**Color reference for each need's glow:**
- Safety: blue/indigo tones
- Belonging: warm amber/gold tones
- Autonomy: teal/cyan tones
- Achievement: coral/orange tones
- Meaning: purple/violet tones
- Growth: green/emerald tones

---

## 3. STRONGER SELECTION CONTRAST

When any element (need or emotion) is selected:

**A) Increase label background opacity:**
The existing rounded rectangle backgrounds behind labels should become MORE opaque for the selected item and its connected cluster. Currently they may be semi-transparent — make the selected item's label background ~80-90% opaque so it really pops.

**B) Dim unrelated items more aggressively:**
- Currently unrelated items may be at ~0.3-0.5 opacity. Reduce to **0.10-0.15 opacity** for truly unrelated nodes.
- Unrelated connection lines should drop to ~0.05 opacity (nearly invisible).
- The selected item + its directly connected needs/emotions should remain at full opacity (1.0).
- Items that are 1 hop away (e.g., emotions that share a need with the selected emotion, but aren't directly connected to it) can be at ~0.3 opacity — visible but clearly secondary.

**C) Transition:**
- The dimming/brightening should animate over ~300-400ms with easing, not snap instantly.

---

## 4. ENTRY ANIMATION

When the page first loads, instead of everything appearing at once:

**Sequence (total ~3-4 seconds):**

1. **0-800ms:** The background canvas fades in. The 6 need regions fade in with their radial glows, starting from 0 opacity → full opacity. Needs can fade in simultaneously or with a very slight stagger (100ms between each). No emotion nodes visible yet.

2. **800ms-2500ms:** Emotion nodes begin appearing. They can either:
   - **Option A (preferred):** Start at random positions outside the visible canvas and drift inward, finding their gravitational positions over ~1.5 seconds. This looks like stars materializing.
   - **Option B:** Fade in at their final positions with a stagger (simpler to implement).

3. **2500ms-3500ms:** Connection lines (the threads between emotions and needs) fade in last, at their idle-state low opacity. This completes the constellation.

4. **Optional:** A brief text hint fades in at the bottom: "Tap any feeling to explore" — then fades out after 3 seconds. Keep this very subtle (small font, low opacity).

**On subsequent interactions**, no replay of entry animation. It only plays once on page load.

---

## 5. SLOW AMBIENT ROTATION

Add an extremely slow rotation to the entire constellation to reinforce the "living cosmos" feeling.

**Parameters:**
- **Speed:** ~1-2 degrees per 10 seconds (very glacial — almost imperceptible moment-to-moment, but noticeable if you watch for 30 seconds)
- **Implementation:** Apply the rotation to the entire canvas coordinate system (rotate the whole force simulation's frame of reference), NOT to individual nodes. This keeps all the relative positions and physics intact.
- **Direction:** Clockwise
- **IMPORTANT — Pause on selection:** When any element is clicked/selected, pause the rotation. The constellation should be still while someone is reading the info panel. Resume rotation (smoothly, not snapping) when the selection is cleared/dismissed.
- **Smooth resume:** When resuming rotation after a pause, ease back into it over ~1 second rather than jumping instantly to rotation speed.

**Why this works:** It adds life and a sense of the cosmic without competing with the force simulation's positioning. Since labels rotate with their nodes, readability is maintained. The pause-on-interaction ensures it never fights against someone trying to explore.

**If it feels too complex or creates visual issues:** It's the lowest priority item here. Skip it rather than ship something that feels wrong.

---

## Testing Checklist

After implementing, verify:
- [ ] All 39 emotions render (original ~27 + 12 new)
- [ ] New emotions appear in correct gravitational positions (e.g., Exhaustion should float between Achievement, Meaning, and Belonging)
- [ ] Bridge emotions (those with 2-3 needs) visibly float in overlap zones, not pinned to one need
- [ ] Need regions have visible radial glow backgrounds
- [ ] Clicking a need dims everything else to very low opacity (~0.10-0.15)
- [ ] Clicking an emotion dims unrelated items aggressively
- [ ] Label backgrounds are more opaque for selected items
- [ ] Transitions animate smoothly (~300-400ms)
- [ ] Entry animation plays on page load (needs first, then emotions)
- [ ] Entry animation does NOT replay on interaction
- [ ] Slow rotation is visible over 30+ seconds of idle
- [ ] Rotation pauses when any element is selected
- [ ] Rotation resumes smoothly when selection is cleared
- [ ] Mobile tap targets still work correctly with the increased node count
- [ ] No existing emotions were accidentally removed or modified
- [ ] Performance is still smooth at 60fps with 39 emotion nodes + 6 need nodes
