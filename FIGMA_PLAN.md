# Xai — Figma File Plan

Public-facing Figma deliverable structure for the Xai prototype. 8 frames organized across 8 pages.

**Link format**: `https://figma.com/file/XXXXX` (replace with your file ID).

---

## Page 1 — Cover

- Hero image (full canvas export from the running prototype at scroll ~15%).
- Title: **Xai — Intelligence Workspace**.
- One-line subtitle: "From raw data to decisions."
- Version stamp: `v0.1 · prototype`.

## Page 2 — Design Tokens

A single board documenting the system:

- **Color** — swatches: bg-base, bg-elev1, bg-elev2, fg, fg-muted, fg-dim, border, border-hi, accent, accent-glow.
- **Type** — Geist Sans at each step (12, 14, 16, 20, 28, 40, 64, 96) with tracking/leading values; Geist Mono equivalent.
- **Spacing** — 4, 8, 12, 16, 20, 24, 32, 48, 64, 96, 128.
- **Radii** — sm (2px), md (6px).
- **Motion** — duration tokens (200, 400, 800, 1400ms) + easing token (out-quart).
- **Border + glow** — outline samples.

## Page 3 — Components

Variants-driven:

- **Button** — variants: `default`, `hover`, `active`. Two sizes: `sm`, `md`. One variant: `ghost-inverted` (filled on hover).
- **Card** — `base`, `hover`, `with-border-hi`.
- **NavItem** — `default`, `hover`, `active` (with left indicator).
- **KPI Card** — `default`, `hover`.
- **Table Row** — `default`, `hover`, `zebra`.
- **Activity Item** — `default`, `live`, `past`.
- **Sparkline** — `default`, `with-hover-dot`.

All built with **Auto Layout** and proper padding/spacing derived from tokens page.

## Page 4 — Hero

Desktop 1440 × 900 frame:

- Headline: 88/96px display, two-line, "From raw data / to decisions." with second line in fg-muted.
- Eyebrow: "INTELLIGENCE WORKSPACE" mono.
- Sub: 18px, fg-muted, single line.
- Particle placeholder image (or live Figma embed if you capture the actual render).
- Right-aligned floating stat column: point count, attractor count, stage.
- Marquee strip at bottom edge.
- Crop marks + dimensions annotated.

## Page 5 — Insight Flow

Three frames showing pinned states:

- **A** (start) — three cards fully entered, line at 0%.
- **B** (mid) — cards still in view, line ~50% drawn.
- **C** (end) — line 100%, cards still in view.
- Step cards annotated with their micro-visual descriptions.

## Page 6 — Dashboard

Full surface @ 1440 × ~900:

- Sidebar (240px) with logo, nav, region footer.
- Top bar with breadcrumbs, ⌘K search, user chip.
- Tab strip below top bar: `Live now` (active), `Insights`, `Automations`.
- KPI row (4 cards).
- DataTable with 8 rows.
- ActivityFeed with 5 items, first pulsing.
- Telemetry strip at bottom.

## Page 7 — Signature

Centered layout:

- 4-layer parallax annotation (depth multiplier labels: 8x, 18x, 32x, 48x).
- 3D icosahedron placeholder (wireframe + solid).
- Two orbit rings.
- Copy stack: eyebrow, H2 "Built for clarity.", sub.
- CTA button (ghost, hover state).
- Telemetry strip mock at bottom.

## Page 8 — Responsive Notes

Three narrower frames showing graceful containment at 1024 / 768:

- 1024 — sidebar collapses to icons-only, KPI grid 4-up fits, table scrolls.
- 768 — sidebar hidden, KPI grid 2x2, table scrolls horizontally, signature canvas aspect-ratio preserved.

Annotations on what *doesn't* change between breakpoints (eyebrow + headline structure + footer signature).

---

## Sharing

- File set to `Anyone with the link can view`.
- All pages, frames, and components visible in presentation order.
- No master pages needed — flat organization.
