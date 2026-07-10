'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Container } from '@/components/primitives/Container';
import { SectionHeading } from '@/components/primitives/SectionHeading';
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
      <Container size="wide" className="relative">
        <div className="mb-20 md:mb-28">
          <SectionHeading
            title="Three steps."
            muted="One continuous flow."
            body="Data enters messy. Xai structures it. Insight exits clear. No pipelines to maintain."
          />
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