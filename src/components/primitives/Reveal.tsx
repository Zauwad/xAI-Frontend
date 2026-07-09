'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { ReactNode, useRef } from 'react';

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'span' | 'p' | 'h2' | 'h3' | 'section';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });

  if (as === 'span') {
    return (
      <motion.span
        ref={ref}
        className={className}
        variants={variants}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        transition={{ delay }}
      >
        {children}
      </motion.span>
    );
  }
  if (as === 'p') {
    return (
      <motion.p
        ref={ref}
        className={className}
        variants={variants}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        transition={{ delay }}
      >
        {children}
      </motion.p>
    );
  }
  if (as === 'h2') {
    return (
      <motion.h2
        ref={ref}
        className={className}
        variants={variants}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        transition={{ delay }}
      >
        {children}
      </motion.h2>
    );
  }
  if (as === 'h3') {
    return (
      <motion.h3
        ref={ref}
        className={className}
        variants={variants}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        transition={{ delay }}
      >
        {children}
      </motion.h3>
    );
  }
  if (as === 'section') {
    return (
      <motion.section
        ref={ref}
        className={className}
        variants={variants}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        transition={{ delay }}
      >
        {children}
      </motion.section>
    );
  }
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}