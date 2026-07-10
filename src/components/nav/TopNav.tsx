'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PrimaryCTA } from '@/components/primitives/PrimaryCTA';
import { BrandMark } from '@/components/primitives/BrandMark';
import { PaletteTrigger } from '@/components/palette/CommandPalette';

const NAV = [
  { href: '#flow', label: 'Process' },
  { href: '#dashboard', label: 'Product' },
  { href: '#signature', label: 'Signature' },
];

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? 'border-b border-border bg-bg-base/70 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6 md:px-10">
        <BrandMark />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-sm px-3 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-fg-muted transition-colors duration-300 hover:text-fg"
            >
              {n.label}
            </a>
          ))}
          <div className="ml-2 pl-2 border-l border-border">
            <PaletteTrigger />
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden font-mono text-xs uppercase tracking-[0.18em] text-fg-dim md:inline">
            v0.1
          </span>
          <PrimaryCTA
            href="#signature"
            variant="outline"
            size="sm"
            className="border-border-hi bg-bg-elev1 transition-colors duration-300 hover:border-fg"
          >
            Launch
          </PrimaryCTA>
        </div>
      </div>
    </motion.header>
  );
}