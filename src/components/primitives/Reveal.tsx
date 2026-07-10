'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { createElement, ReactNode, useRef } from 'react';

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const TAGS = {
  div: 'div',
  span: 'span',
  p: 'p',
  h2: 'h2',
  h3: 'h3',
  section: 'section',
} as const;

export function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof typeof TAGS;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });
  const props = {
    ref: ref as React.Ref<any>,
    className,
    variants,
    initial: 'hidden',
    animate: inView ? 'show' : 'hidden',
    transition: { delay },
    children,
  };
  // ponytail: motion() factory replaces 6-branch if/else ladder; same DOM, half the lines.
  return createElement(motion[TAGS[as]] as any, props);
}