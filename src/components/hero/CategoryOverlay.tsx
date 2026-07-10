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

// Timing — labels fade in immediately after the 3s morph completes
const LABEL_START_BASE = 3.1; // seconds, right after morph ends
const LABEL_STAGGER = 0.12; // seconds between consecutive labels
const LABEL_FADE_DURATION = 0.5; // seconds

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

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Labels start AFTER the morph completes
    const labelStart = LABEL_START_BASE + index * LABEL_STAGGER;
    const sinceLabel = t - labelStart;

    // Trigger label fade-in
    if (visible && sinceLabel >= 0 && !labelVisible) {
      setLabelVisible(true);
    }
    if ((!visible || sinceLabel < 0) && labelVisible) {
      setLabelVisible(false);
    }

    // Ring appears with label
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = labelVisible ? 0.5 : 0;
    }
    groupRef.current.visible = visible;
  });

  const cat = CATEGORIES[index];
  const pct = ((cat.count / totalCount) * 100).toFixed(1);

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

      {/* HTML label — fade in only after morph + stagger */}
      <Html
        position={[0.18, 0, 0]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        distanceFactor={6}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: labelVisible ? 1 : 0 }}
          transition={{ duration: LABEL_FADE_DURATION, ease: 'easeOut' }}
          className="translate-y-[-50%] whitespace-nowrap pl-2"
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