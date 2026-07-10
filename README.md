# Xai — Intelligence Workspace

A high-fidelity interactive product prototype. Single-page experience that visually walks through how Xai turns raw data into structured intelligence and actionable insight.

Built as a frontend challenge submission. The goal was taste, restraint, motion craft, and engineering discipline — not feature breadth.

## Quick start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **Framer Motion** — micro-interactions, layout animations, presence, count-ups
- **GSAP + ScrollTrigger** — pinned scroll stage in Insight Flow
- **React Three Fiber** (Three.js) — Hero particle field + Signature icosahedron
- **Geist Sans + Geist Mono** via `next/font` — zero CLS
- No UI kit. No chart library. No Lottie. Every component is hand-built.

## Page structure

1. **Hero** — 1,500-point particle field rendered as a custom GLSL shader. At rest, points drift in a chaotic cloud. As you scroll, they converge onto a 12-node icosahedral constellation (the "intelligence graph"). Pointer parallax throughout.
2. **Insight Flow** — Pinned GSAP scroll stage. Three steps (Ingest → Analyze → Surface) with an SVG connector line that draws as you scroll. Each card has its own geometric micro-visual.
3. **Dashboard Preview** — A real-looking product surface: sidebar nav, top bar with breadcrumbs/search/user, KPI grid with animated count-ups and custom SVG sparklines, dataset table, activity feed, three tabs (`Live now` / `Insights` / `Automations`) that swap with `AnimatePresence` + `layoutId` underline.
4. **Signature** — Cursor-reactive icosahedron with a custom rim-lighting shader, orbit rings, and four depth-based parallax layers (grid, denser grid, floating numerals, headline glow). A telemetry strip at the bottom shows live FPS, draw calls, and a typewriter-style boot log.

## Animation decisions

| Concern | Choice | Why |
|---|---|---|
| 3D centerpiece | Custom GLSL shader on R3F Points | Every pixel reasoned about. No stock particle libraries. |
| Scroll-tied animation | One GSAP context, two ScrollTriggers | Used only for things Framer can't do: pinning and stroke-dashoffset draw. |
| Micro-interactions | Framer Motion variants + Tailwind transitions | Cheap, composable, SSR-friendly. |
| State for shader uniforms | React refs written in `useFrame` | Zero re-renders. |
| Pointer parallax | `motionValue` + `useSpring` in Framer | Damped, cheap, no manual RAF. |
| First-frame determinism | `mulberry32(1337)` seeded RNG | No FOUT, no flicker on hydration. |
| Numbers animating in | `CountUp` over 1.1s with `out-quart` | Calm, not bouncy. |
| Tab swap | `AnimatePresence` + `layoutId="tab-underline"` | Shared layout animation, no jank. |
| Sparkline | Hand-written SVG path | No chart lib. Total control. 12 lines of code. |

## Engineering discipline

- **Single source of truth for tokens**: CSS variables in `globals.css` + Tailwind theme extension referencing them.
- **Reusable primitives**: `Container`, `Reveal`, `Marquee`, `Section`.
- **No copy-pasted components** — every dashboard surface is composed from `KpiCard`, `DataTable`, `ActivityFeed`, `Sidebar`, `TopBar`.
- **Determinism**: seeded RNG + static mock data. First paint is reproducible.
- **Performance**:
  - Hero: 60 fps target with 1,500 points; falls back to 600 under `prefers-reduced-motion`.
  - DPR clamped to `[1, 1.5]`.
  - R3F components lazy-loaded via `next/dynamic` with `ssr: false`.
  - Shader uniform writes in `useFrame` only — no React re-renders.
  - Total first-load JS: **182 KB** (production build).
- **Accessibility**:
  - Visible focus rings (1px white, 2px offset).
  - `prefers-reduced-motion: reduce` honored globally and per-component.
  - Color contrast: white on near-black, well above WCAG AAA.
  - Keyboard nav works end-to-end (tab, anchor, escape from interactive elements).
  - Semantic HTML (`<section>`, `<header>`, `<footer>`, `<aside>`, `<nav>`, `<table>`).

## File map

```
app/
  layout.tsx           Geist fonts, dark theme, grain overlay
  page.tsx             Section composition
  globals.css          Tokens, reset, grain, marquee keyframes
src/
  components/
    nav/TopNav.tsx
    hero/
      Hero.tsx                 Section + copy + scroll cue + marquee
      ParticleField.tsx        R3F canvas, pointer + scroll wiring
      shaders/
        particles.vert.ts      GLSL: chaos → constellation morph
        particles.frag.ts      GLSL: soft round point + twinkle
    flow/
      InsightFlow.tsx          Pinned GSAP stage
      FlowConnector.tsx        3-card grid (uses StepVisual)
      StepVisual.tsx           Per-step geometric micro-viz
    dashboard/
      DashboardPreview.tsx     Tabs + composition
      Sidebar.tsx
      TopBar.tsx
      KpiCard.tsx              Count-up KPI with sparkline
      CountUp.tsx              Out-quart number animation
      Sparkline.tsx            Hand-rolled SVG, hover tracking dot
      DataTable.tsx
      ActivityFeed.tsx         Live pulsing indicator
    signature/
      SignatureSection.tsx     Wrapper + telemetry strip
      ReactiveObject.tsx       R3F cursor-reactive icosahedron
      ParallaxLayers.tsx       4-layer pointer-driven parallax
    primitives/
      Container.tsx
      Reveal.tsx               IntersectionObserver-driven entrance
      Marquee.tsx
    Footer.tsx
  hooks/
    useReducedMotion.ts
    usePointer.ts
    useScrollProgress.ts       Per-section + page-level scroll 0..1
  lib/
    random.ts                  Seeded mulberry32 + attractor layout
    mockData.ts                KPIs, table rows, activity, flow steps
```

## Design system

- **Background**: `#08080B` — near-black with a subtle blue undertone.
- **Accent**: `#FAFAFA` — white. Single accent by design. Restraint signals taste.
- **Type**: Geist Sans (display + body), Geist Mono (numerals, labels, metadata).
- **Spacing**: 4pt grid via Tailwind defaults + custom container widths (920 / 1200 / 1440).
- **Radii**: `rounded-sm` (2px) for chips/buttons, `rounded-md` (6px) for the dashboard frame.
- **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)` (out-quart) as the single global default.

## Product UI plan

End-to-end overview of what the user sees and how the experience is structured. Detailed frame specs (dimensions, annotations, sharing settings) live in `FIGMA_PLAN.md`.

### User journey

A single-page scroll with four acts, each one a distinct rhythm:

1. **Hero — arrival.** The visitor lands on a near-black canvas. An eyebrow reads `INTELLIGENCE WORKSPACE`. A two-line headline states the product promise (`From raw data / to decisions.`, second line dimmed). Behind it, a 1,500-point particle field holds visual interest without competing with the copy. As they scroll, the field collapses into a constellation — the first signal that Xai organizes chaos into structure.
2. **Insight Flow — explanation.** The page pins. Three cards (`Ingest` → `Analyze` → `Surface`) explain the product's value proposition in plain language. An SVG line draws between them as the visitor scrolls, so progression is *felt*, not just read. Each card carries its own micro-visual to anchor the metaphor.
3. **Dashboard Preview — demonstration.** The product surface itself. Realistic chrome — sidebar, top bar, breadcrumbs, ⌘K, tabs — and real-feeling data: KPI cards with animated count-ups, a data table, an activity feed. The visitor should believe this thing could run a workflow.
4. **Signature — payoff.** A cursor-reactive icosahedron over four depth layers. The point is craft, not feature: the visitor should feel the difference between this and a template.

### Surface inventory

| Surface | Purpose | Key elements |
|---|---|---|
| Hero | First impression, product promise | Particle field, eyebrow, headline, sub, floating stats column, marquee strip |
| Insight Flow | Explain value in 3 steps | Pinned stage, 3 step cards with micro-visuals, drawn connector line |
| Dashboard | Demonstrate the actual product | Sidebar, top bar with search + user, KPI grid, data table, activity feed, 3 tabs |
| Signature | Showcase craft + close | Cursor-reactive icosahedron, 4 parallax layers, CTA, telemetry strip |
| Footer | Sign-off, links | Final mark, secondary nav |

### Design principles (UI-level)

- **One accent.** White on near-black. Restraint is the brand.
- **Honest motion.** Animation is tied to scroll, pointer, or real render metrics. No decorative looping.
- **No chart libraries, no UI kits.** Every pixel reasoned about.
- **Composed, not duplicated.** KPI cards, table rows, activity items all share primitives.
- **Deterministic first paint.** Seeded RNG, static mock data, no hydration flicker.
- **Reduced-motion parity.** Every animated surface has a still or simplified fallback.
- **Keyboard + screen-reader reachable.** Visible focus rings, semantic HTML, `prefers-reduced-motion` honored.

### Deliverables

- **Live prototype** — this Next.js app (Vercel-ready).
- **Figma file** — design tokens, components, and annotated frames per `FIGMA_PLAN.md`.
- **Walkthrough** — Loom script in `LOOM_SCRIPT.md`, ~2:30 with b-roll.

---

## Production build

```bash
npm run build
npm run start
```

Verified: ✓ Compiled successfully · 4 static pages · 182 KB first-load JS.

## Deploy

The app is framework-agnostic for static deploy. Recommended: **Vercel** (zero config). Also works on Netlify.

```bash
npx vercel --prod
```

## License

Prototype. All design decisions intentional.