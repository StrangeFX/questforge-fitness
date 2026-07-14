# QuestForge Fitness — Design Reference

A single grounded reference for anyone (human or Claude) doing design or UI
work on QuestForge. Every value below is taken from the live code, not
invented. When something here disagrees with the code, the code wins — update
this file to match.

**Canonical style master:** `docs/design/adventure-map.html` (the Walking
Tracker). It is the cleanest, most complete expression of the system. When in
doubt about a surface, spacing, or accent decision, open that file and match it.

---

## 1. What QuestForge is

An RPG-inspired fitness planner and tracker. It turns strength training,
walking/running, yoga, recovery, and nutrition into a class-based fantasy
campaign. It is a dependency-free static PWA (no build step), local-first
(browser storage), installable to an iPhone home screen, and hosted at
`https://strangefx.github.io/questforge-fitness/`.

**Audience:** one primary user training solo, on a phone, anywhere — home, work,
the store, outdoors. Design for a 390–430px portrait viewport first.

**Fantasy framing:** six DnD-style classes set training emphasis, not the
exercise universe. Barbarian (strength), Monk (yoga/mobility), Ranger
(endurance), Paladin (balanced), Rogue (conditioning), Druid (recovery).

---

## 2. Design principles

1. **Relative success over comparison.** Every metric, message, and reward
   measures a person against *their own* goal and their own improvement over
   time — never against another user's raw numbers. Reaching 100% of your own
   goal counts the same as anyone reaching 100% of theirs. Reward consistency
   and improvement, not intensity or competition. This is the product's spine;
   see the "Relative Success" section in `feature-backlog.md`.

2. **Immersive, but usable during a real workout.** Fantasy naming is welcome
   (Grimoire, Hall of Deeds, Provisions) but every immersive label carries a
   plain-English subtitle. Controls must stay obvious with sweaty hands. Never
   sacrifice clarity for theme.

3. **Safe, non-punishing tone.** Informational, not medical. Language like
   "adjust," "scale," "stop if sharp pain," "consult a professional." Never
   punish missed days; encourage showing up.

4. **One system across every page.** A screen should feel like it belongs to the
   same app as the Walking Tracker. Reuse the tokens and components below rather
   than inventing per-page treatments.

---

## 3. Color system

### Base tokens (from `styles.css` `:root`)

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#060916` | Deep indigo page ground |
| `--ink` | `#fff6df` | Warm off-white primary text |
| `--muted` | `#c9b8e9` | Lavender-grey secondary text |
| `--line` | `rgba(244,199,91,.42)` | Standard gold hairline border |
| `--gold` | `#f7c85f` | Primary gold accent |
| `--gold-2` | `#fff0a4` | Bright gold — headings, key numbers |
| `--stone` | `#9086a3` | Muted grey — inactive/locked, medal rings |
| `--panel-top` | `rgba(33,22,75,.92)` | Panel gradient top (violet) |
| `--panel-bottom` | `rgba(8,13,42,.94)` | Panel gradient bottom (navy) |
| `--panel-surface` | `linear-gradient(180deg, var(--panel-top), var(--panel-bottom))` | **The** panel background |
| `--emboss` | `0 1px 0 #3a1e00, 0 0 14px rgba(168,77,255,.22)` | Heading text-shadow |
| `--data-font` | `"Courier New", ui-monospace, monospace` | Numeric "ledger" font |

The page background is `--bg` plus two faint radial glows (violet top-left, sky
top-right) and a vertical darkening gradient. Do not use flat black.

### Semantic accents

These carry meaning; do not use them decoratively. The Walking Tracker names
them semantically; the rest of the app still has legacy aliases with the same or
near-identical hues. **Prefer the semantic names for new work.**

| Semantic | Hex | Legacy alias | Used for |
|----------|-----|--------------|----------|
| `--shrine` | `#a84dff` | `--violet` | Shrine nodes, character/profile |
| `--river` | `#31baff` | `--sky` | Walking/travel, water, cardio |
| `--ember` | `#ff7a45` | `--coral` | Boss gates, records/deeds, warnings |
| `--sanctuary` | `#6be5ab` | `--mint` (`#54e59d`) | Sanctuary, recovery, "synced/ok" |
| gold | `#f7c85f` | — | Quest/target, "done", primary action |

Semantic color is separate from the gold accent. Good/warning/ok states use
`--sanctuary`/`--ember`; they never replace gold as the primary accent.

**Rule:** spend boldness in one place. Gold is the primary accent everywhere;
each area gets one semantic tint on its icon/border, and everything else stays
the calm violet→navy surface. Avoid saturated flat blue fills (an earlier
version overused `rgba(20,86,207,…)` — it has been removed; don't reintroduce
it).

---

## 4. Typography

- **Display / body:** `Georgia, "Times New Roman", serif` — the whole app. The
  serif is deliberate; it carries the storybook/manuscript feel. Do not swap to
  a sans-serif.
- **Data / numbers:** `--data-font` (Courier New, tabular-nums). Use for every
  standalone figure — step counts, XP, stat values, macro grams, percentages,
  "3 / 7 days." This "ledger" contrast against Georgia is a signature of the
  system. Set `font-variant-numeric: tabular-nums` so digits align.
- **Headings:** `--gold-2` color + `text-shadow: var(--emboss)` + `text-wrap:
  balance`. Sizes roughly: page h1 30px, section h2 17–30px, card h3 18px,
  h4 15–16px.
- **Eyebrow labels:** 11–12px, `text-transform: uppercase`, `letter-spacing:
  .08–.1em`, color `--muted`. Used above headings to set context ("YOUR NEXT
  CHAPTER", "DAILY TASK", "CAMP").
- **Body copy:** `--muted`, `line-height ~1.5`, keep measure near 46ch.

---

## 5. Surfaces & elevation

**The one panel recipe** (memorize this — it is the backbone):

```css
border: 1px solid var(--line);
border-radius: 10px;
background: var(--panel-surface);
box-shadow: inset 0 0 0 1px rgba(255,255,255,.06);
```

- Radius is **10px** for panels/cards. No heavy drop shadows — a single soft
  inset highlight gives depth; the calm surface does the rest. (Pills and
  medallions use full-round `999px` / `50%`.)
- **Corner brackets** are the "framed / important" motif: two gilded L-shaped
  brackets at opposite corners (`--gold`, 2px), on the map frame, the hero, and
  the primary hub tile. Use sparingly to mark a hero surface, not every card.
- Accent glows: a hero surface may layer 1–2 faint radial gradients
  (`--river`/`--shrine` at ~.14 alpha) over the panel surface. Keep them subtle.

---

## 6. Iconography

Line-art glyphs inside **medallion** circles, matching the Walking Tracker's
route nodes:

```css
/* medallion */
border: 2px solid var(--stone);
border-radius: 50%;
background: radial-gradient(circle at 32% 26%, rgba(255,255,255,.14), transparent 60%),
            linear-gradient(180deg, #241a52, #0c0f2e);
/* glyph */
fill: none; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round;
```

- Glyphs are stroked SVG (24×24 viewBox), colored by the area's semantic accent
  (dumbbell = gold for workout, map-pin = `--river` for walking, etc.).
- Node/medallion **states:** done = gold ring + soft gold glow; current/target =
  brighter steady gold ring (not pulsing); locked = `--stone` ring, dimmed ~.55,
  muted text. A separate pulsing dot marks literal "you are here" position.
- "Done / complete" is always expressed as **gold** (a gold check medallion, a
  gold ring). Never a bare word crammed into a small circle.
- No emoji as UI icons. No filled/duotone icon sets — stroked line art only.

---

## 7. Component patterns

- **Stat strip:** row of 3 cards, each a big `--gold-2` number in `--data-font`
  over a small `--muted` uppercase label. Panel recipe surface.
- **Progress bar:** track `height:10px; border-radius:999px; background
  rgba(255,255,255,.08)` with `inset` ring; fill is a gradient
  `linear-gradient(90deg, var(--river), var(--gold))` with a soft gold glow.
- **Pill:** `min-height ~30px`, `border-radius:999px`, gold hairline, small
  bold gold text. Used for counts ("120 known", "3 of 7 complete") and TAP/OPEN
  affordances.
- **Primary / text buttons:** currently a blue gradient
  (`linear-gradient(180deg,#1456cf,#092f84)`) with gold text, uppercase,
  `.04em` tracking. This is the one place saturated blue still lives; a future
  pass may recolor it. Min touch target 44–48px.
- **Toggle row (Hero Status, tabs, page-nav):** unselected = transparent/muted;
  selected = gold gradient fill `linear-gradient(180deg,var(--gold-2),var(--gold))`
  with dark text — the "lit" state.
- **Expandable exercise card:** collapsed shows name + short prescription + a
  TAP pill; expanded reveals media, cues, progression/regression, logging
  inputs, and a Done action. Panel recipe surface.
- **Guided route / map:** vertical campaign path, node medallions alternating
  left/right, a single SVG path drawn 3× (glow/walked/remaining) sharing one
  geometry with `pathLength="100"` so solid↔dotted can't drift. See the master
  file's comments for the math.

---

## 8. Layout & navigation

- **Shell width:** `min(100%, 440px)`, centered. Design phone-first.
- **Spacing rhythm:** lay pages out as a flex column with `gap` (12–16px), not
  per-element margins. The Home page and the Walking Tracker both do this.
- **Safe areas:** the app shell pads with `max(…, env(safe-area-inset-*))` and
  the viewport uses `viewport-fit=cover` for iPhone standalone mode. Preserve
  this.
- **Navigation model:**
  - Persistent **top bar**: QuestForge wordmark
    (`assets/questforge-logo-transparent-color.png`) on the left, hamburger menu
    on the right.
  - **Page nav** below it: Home · Workout · Walking Tracker (gold-lit selected
    pill).
  - **Home** is the landing/hub: welcome card, current class, stat strip, and
    quick-action tiles into Workout and Walking.
  - **Workout** has sub-tabs: Today · Plan · Fuel · Wins.
  - **Walking Tracker** is its own page (`docs/design/adventure-map.html`).
  - The hamburger menu holds: User Info, Switch User, Character Creation, Relics
    and Amulets, All Exercises.

---

## 9. Motion

- Restrained. A gentle infinite pulse on the live "you are here" dot; subtle
  hover lifts (`translateY(-1px)`) and border brightening on tappable tiles.
- Always honor `@media (prefers-reduced-motion: reduce)` — disable pulses and
  non-essential animation.
- Avoid scattered ambient animation; it reads as generated. One deliberate
  motion beat per screen at most.

---

## 10. Voice & copy

- Immersive label + plain subtitle, always (e.g. **Grimoire** / "Every exercise,
  with guidance"). Active voice; a control says exactly what it does.
- Frame progress against the user's own goal ("77% of today's travel goal"),
  and say plainly that hitting your own goal counts the same as anyone hitting
  theirs.
- Errors explain what went wrong and how to fix it — no apologies, no vagueness.

---

## 11. Do / Don't

**Do**
- Start from the panel recipe and the semantic accents.
- Put numbers in the ledger font.
- Use stroked line-art glyphs in `--stone`-ringed medallions.
- Give locked/inactive things the `--stone` + dimmed treatment.
- Test at 390×844 and check both a short (Safari) and tall (standalone) viewport.

**Don't**
- Introduce saturated flat blue panel fills.
- Use emoji or filled icons as UI.
- Add heavy drop shadows; the system is flat-with-inset.
- Swap the serif for a sans-serif, or drop the ledger font on figures.
- Compare users by raw output anywhere.

---

## 12. Known inconsistencies to reconcile (as of 2026-07-13)

- **Token duplication:** the Walking Tracker defines `--shrine/--river/--ember/
  --sanctuary` inline; the main `styles.css` still carries legacy
  `--violet/--sky/--coral/--mint`. They should converge on the semantic names in
  one shared place.
- **Primary buttons** are still the legacy blue gradient — the last saturated
  blue in the app. A focused button pass is a good future task.
- The Walking Tracker is a **standalone HTML file** with its own inline copy of
  the tokens; the rest of the app is `index.html` + `styles.css`. If the tracker
  gets folded into the main shell, dedupe the tokens then.
