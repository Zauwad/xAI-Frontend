'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Container } from '@/components/primitives/Container';
import { Reveal } from '@/components/primitives/Reveal';
import { FlowStage } from './FlowConnector';
import { useReducedMotion } from '@/hooks/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function InsightFlow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !sectionRef.current || !lineRef.current) return;

    const ctx = gsap.context(() => {
      const path = lineRef.current!;
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 70%',
          scrub: 0.6,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="flow"
      ref={sectionRef}
      className="relative w-full border-t border-border py-32 md:py-48"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <Container className="relative">
        <div className="mb-20 flex flex-col gap-6 md:mb-28">
          <Reveal delay={0.1}>
            <h2 className="max-w-[760px] text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-6xl">
              Three steps.
              <br />
              <span className="text-fg-muted">One continuous flow.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="max-w-[520px] text-base leading-relaxed text-fg-muted">
              Data enters messy. Xai structures it. Insight exits clear. No
              pipelines to maintain.
            </p>
          </Reveal>
        </div>

        {/* SVG connector above cards */}
        <div className="relative">
          <svg
            className="absolute -top-12 left-0 hidden h-12 w-full md:block"
            viewBox="0 0 1200 48"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              ref={lineRef}
              d="M 0 24 L 1200 24"
              stroke="rgba(250,250,250,0.4)"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
          <FlowStage />
        </div>
      </Container>
    </section>
  );
}