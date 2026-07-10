'use client';

import { Container } from '@/components/primitives/Container';
import { Reveal } from '@/components/primitives/Reveal';
import { PrimaryCTA } from '@/components/primitives/PrimaryCTA';
import { BrandMark } from '@/components/primitives/BrandMark';
import { StatusPulse } from '@/components/primitives/StatusPulse';

const NAV = [
  { href: '#ask', label: 'Ask' },
  { href: '#flow', label: 'Process' },
  { href: '#dashboard', label: 'Product' },
  { href: '#automations', label: 'Automations' },
  { href: '#signature', label: 'Signature' },
] as const;

export function Footer() {
  return (
    <footer className="relative w-full border-t border-border">
      <Container size="wide">
        <div className="grid grid-cols-1 gap-12 py-20 md:grid-cols-12 md:gap-8 md:py-28">
          {/* Brand column */}
          <div className="md:col-span-5">
            <Reveal>
              <BrandMark />
              <p className="mt-6 max-w-[360px] text-base leading-relaxed text-fg-muted">
                From raw data to decisions. Xai ingests, structures, and surfaces
                insight — automatically.
              </p>
              <div className="mt-8">
                <StatusPulse label="all systems normal" className="text-fg-dim" />
              </div>
            </Reveal>
          </div>

          {/* Nav column */}
          <div className="md:col-span-3">
            <Reveal delay={0.05}>
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim">
                navigate
              </span>
              <ul className="mt-5 flex flex-col gap-3">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <a
                      href={n.href}
                      className="group inline-flex items-center gap-2 text-sm text-fg-muted transition-colors duration-300 hover:text-fg"
                    >
                      <span className="font-mono text-[10px] text-fg-dim opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        →
                      </span>
                      <span>{n.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* CTA column */}
          <div className="md:col-span-4">
            <Reveal delay={0.1}>
              <div className="flex h-full flex-col justify-between gap-8">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim">
                    ready
                  </span>
                  <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-fg-muted">
                    Open the workspace. Connect a source. Ask the first
                    question.
                  </p>
                </div>
                <PrimaryCTA href="#signature" className="text-fg">
                  Open Xai →
                </PrimaryCTA>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-border py-6 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© 2025</span>
            <span>·</span>
            <span>xai / workspace</span>
            <span>·</span>
            <span>v0.1 · prototype</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>⌘ k · command palette</span>
            <span>·</span>
            <span>built with restraint</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}