'use client';

import { ReactNode } from 'react';
import { Reveal } from './Reveal';

type Props = {
  title: ReactNode;
  muted?: ReactNode;
  body?: ReactNode;
  maxWidth?: string;
};

export function SectionHeading({ title, muted, body, maxWidth = '760px' }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <Reveal delay={0.1}>
        <h2
          className="text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-6xl"
          style={{ maxWidth }}
        >
          {title}
          {muted && (
            <>
              <br />
              <span className="text-fg-muted">{muted}</span>
            </>
          )}
        </h2>
      </Reveal>
      {body && (
        <Reveal delay={0.2}>
          <p className="max-w-[520px] text-base leading-relaxed text-fg-muted">{body}</p>
        </Reveal>
      )}
    </div>
  );
}