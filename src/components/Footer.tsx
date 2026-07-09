'use client';

import { Container } from '@/components/primitives/Container';

export function Footer() {
  return (
    <footer className="relative border-t border-border py-12">
      <Container size="wide">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-fg-dim">
            <span className="grid h-6 w-6 place-items-center rounded-sm border border-border-hi bg-bg-elev1 text-[10px]">
              ✕
            </span>
            <span>xai / workspace</span>
            <span className="text-fg-dim">/</span>
            <span>v0.1 · prototype</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim">
            <span>built with restraint</span>
            <span className="text-fg-dim">·</span>
            <span>next · three · gsap · framer</span>
            <span className="text-fg-dim">·</span>
            <span className="text-fg-muted">© 2025</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}