# Xai — Loom / Video Walkthrough Script

A 2–3 minute narration walking through the prototype, narrating the design + animation decisions.

---

**[0:00] Cold open — scrolling the hero**

> "This is Xai. The headline reads *From raw data, to decisions.* And underneath — the particle field — is a custom GLSL shader I wrote. Fifteen hundred points begin as a chaotic cloud. As I scroll, they converge onto a twelve-node constellation. Each node is one intelligence cluster. The transition is one uniform — `uProgress` — driven by page scroll, eased with out-quart, and damped against the actual scroll velocity."

**[0:25] Idle camera tilt**

> "Even when I'm not scrolling, the field responds. Watch the camera tilt as my cursor moves — small parallax, never abrupt. Reduced motion users get a static field with a lower point count. Six hundred points. No drift."

**[0:45] Insight Flow**

> "Section two is the process. Three steps — Ingest, Analyze, Surface. Pinned with GSAP ScrollTrigger. Watch the connector line draw as I scroll — it's an SVG path with `stroke-dashoffset` animated by scroll position, scrubbed at 0.6 for that slightly trailing feel. Each card has its own geometric micro-visual. A rotating ring. A connected node graph with a packet traveling along the edges. A pulsing bar chart."

**[1:20] Dashboard Preview**

> "Section three is the actual product surface. Sidebar. Top bar. Four KPIs that count up with out-quart. A hand-written SVG sparkline — no chart library — with a tracking dot that follows the path on hover. A dataset table. An activity feed with a pulsing live indicator. Click between the tabs — Live, Insights, Automations — and the content swaps with `AnimatePresence`, with a `layoutId` underline that slides between tabs. Shared layout animation. No jank."

**[1:55] Signature**

> "Section four is the signature interaction. A cursor-reactive icosahedron rendered in R3F with a custom rim-lighting shader. The mesh follows the pointer with spring damping. Behind it, four depth layers translate at different multipliers — eight, eighteen, thirty-two, forty-eight pixels per pointer unit. The bottom telemetry strip samples real FPS once a second. It's connected to the actual render loop. Not a fake number."

**[2:30] Decisions**

> "Three decisions I want to call out. *One*: White as the only accent. No brand color. Restraint is the brand. *Two*: Hand-built shader instead of a particles library. Twelve lines of GLSL beats fifty KB of dependencies. *Three*: One GSAP context, many Framer triggers. Separation of concerns — scroll-timeline goes to GSAP, micro-interaction goes to Framer."

**[2:55] Close**

> "Source on GitHub. Live on Vercel. Figma file is in the deliverables. Thanks for watching."

---

## B-roll checklist

- [ ] Slow scroll through hero (10s)
- [ ] Cursor move while hovering hero
- [ ] Quick scroll through Insight Flow (show line draw)
- [ ] Hover over a KPI card (lift)
- [ ] Hover over dashboard sparkline (tracking dot)
- [ ] Tab swap Live → Insights → Automations (2x)
- [ ] Slow cursor move across signature section
- [ ] Slow zoom on telemetry strip
- [ ] Reload once to show first-frame determinism (no flicker)

Total runtime: ~2:45 + b-roll cut to 2:30.
