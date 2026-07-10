'use client';

import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ATTRACTORS } from '@/lib/random';

// 12 named categories with believable counts (add up to 18,429,501)
const CATEGORIES: { name: string; count: number }[] = [
  { name: 'orders', count: 4_210_840 },
  { name: 'users', count: 892_417 },
  { name: 'events', count: 3_081_206 },
  { name: 'revenue', count: 2_104_502 },
  { name: 'sessions', count: 1_892_341 },
  { name: 'support', count: 1_407_823 },
  { name: 'products', count: 1_286_114 },
  { name: 'campaigns', count: 942_008 },
  { name: 'regions', count: 1_104_902 },
  { name: 'partners', count: 488_116 },
  { name: 'segments', count: 612_334 },
  { name: 'signals', count: 406_898 },
];

// Timing — labels fade across the last 2s of the 6s morph, staggered per node.
const LABEL_START = 4.0;
const LABEL_END = 6.0;
const LABEL_FADE_DURATION = 0.5;

// Explicit per-node label placement to prevent overlap.
// pos: HTML offset relative to attractor anchor.
// align: 'left' (text reads left of anchor) | 'right' (reads right).
type Anchor = {
  pos: [number, number, number];
  align: 'left' | 'right';
};

// Index → explicit anchor. Picked by hand to splay labels away from each other.
const ANCHORS: Anchor[] = [
  { pos: [-0.18,  0.05, 0], align: 'right' }, // 0  orders
  { pos: [ 0.18,  0.00, 0], align: 'left'  }, // 1  users
  { pos: [-0.18, -0.05, 0], align: 'right' }, // 2  events
  { pos: [ 0.18, -0.05, 0], align: 'left'  }, // 3  revenue
  { pos: [ 0.18,  0.05, 0], align: 'left'  }, // 4  sessions
  { pos: [-0.18,  0.10, 0], align: 'right' }, // 5  support
  { pos: [-0.18, -0.05, 0], align: 'right' }, // 6  products
  { pos: [ 0.18,  0.10, 0], align: 'left'  }, // 7  campaigns
  { pos: [ 0.18, -0.05, 0], align: 'left'  }, // 8  regions
  { pos: [ 0.18,  0.05, 0], align: 'left'  }, // 9  partners
  { pos: [-0.18, -0.05, 0], align: 'right' }, // 10 segments
  { pos: [-0.18,  0.05, 0], align: 'right' }, // 11 signals
];

function CategoryNode({
  position,
  index,
  visible,
  totalCount,
}: {
  position: [number, number, number];
  index: number;
  visible: boolean;
  totalCount: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [labelVisible, setLabelVisible] = useState(false);
  const anchor = ANCHORS[index];

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Spread fade across LABEL_START..LABEL_END so labels "light up" over 2s
    const stagger = (LABEL_END - LABEL_START) * (index / 11);
    const sinceLabel = t - (LABEL_START + stagger);

    if (visible && sinceLabel >= 0 && !labelVisible) {
      setLabelVisible(true);
    }
    if ((!visible || sinceLabel < 0) && labelVisible) {
      setLabelVisible(false);
    }

    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = labelVisible ? 0.5 : 0;
    }
    groupRef.current.visible = visible;
  });

  const cat = CATEGORIES[index];
  const pct = ((cat.count / totalCount) * 100).toFixed(1);
  const alignment = anchor.align === 'right' ? 'text-right pr-2' : 'pl-2';

  return (
    <group ref={groupRef} position={position}>
      {/* outer ring — appears with label */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.075, 0.085, 32]} />
        <meshBasicMaterial
          color="#fafafa"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* center dot — always visible when triggered */}
      <mesh>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#fafafa" />
      </mesh>

      {/* HTML label — explicit per-node anchor to prevent overlap */}
      <Html
        position={anchor.pos}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        distanceFactor={6}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: labelVisible ? 1 : 0 }}
          transition={{ duration: LABEL_FADE_DURATION, ease: 'easeOut' }}
          className={`whitespace-nowrap -translate-y-1/2 ${alignment}`}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
            {cat.name}
          </div>
          <div className="font-mono text-[10px] tabular tracking-[0.18em] text-fg-dim">
            {cat.count.toLocaleString()} · {pct}%
          </div>
        </motion.div>
      </Html>
    </group>
  );
}

export function CategoryOverlay({ visible }: { visible: boolean }) {
  const total = CATEGORIES.reduce((s, c) => s + c.count, 0);
  return (
    <group>
      {ATTRACTORS.map((p, i) => (
        <CategoryNode
          key={i}
          position={[p[0], p[1], p[2]]}
          index={i}
          visible={visible}
          totalCount={total}
        />
      ))}
    </group>
  );
}