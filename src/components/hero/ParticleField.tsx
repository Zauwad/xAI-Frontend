'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ATTRACTORS, generatePoints, mulberry32 } from '@/lib/random';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import vert from './shaders/particles.vert';
import frag from './shaders/particles.frag';
import { CategoryOverlay } from './CategoryOverlay';

function Particles({
  count,
  progressRef,
}: {
  count: number;
  progressRef: React.MutableRefObject<number>;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const { positions, attractors, seeds } = useMemo(() => {
    const positions = generatePoints(count);
    const attractors = new Float32Array(count);
    const seeds = new Float32Array(count);
    const rng = mulberry32(42);
    for (let i = 0; i < count; i++) {
      const px = positions[i * 3];
      const py = positions[i * 3 + 1];
      const pz = positions[i * 3 + 2];
      let best = 0;
      let bestD = Infinity;
      for (let a = 0; a < ATTRACTORS.length; a++) {
        const ap = ATTRACTORS[a];
        const dx = px - ap[0];
        const dy = py - ap[1];
        const dz = pz - ap[2];
        const d = dx * dx + dy * dy + dz * dz;
        if (d < bestD) {
          bestD = d;
          best = a;
        }
      }
      attractors[i] = best;
      seeds[i] = rng();
    }
    return { positions, attractors, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
    }),
    [],
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    const target = progressRef.current;
    // Slow lerp — slider crawls 0→1 over ~3s so user feel data getting organized
    // (0.011 ≈ reaches ~0.95 at t=3s, full settle ~3.4s)
    uniforms.uProgress.value += (target - uniforms.uProgress.value) * 0.011;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aAttractor"
          args={[attractors, 1]}
        />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

function AttractorLines({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const matRef = useRef<THREE.LineBasicMaterial>(null!);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const dists: { i: number; j: number; d: number }[] = [];
    for (let i = 0; i < ATTRACTORS.length; i++) {
      for (let j = i + 1; j < ATTRACTORS.length; j++) {
        const a = ATTRACTORS[i];
        const b = ATTRACTORS[j];
        const d =
          (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
        dists.push({ i, j, d });
      }
    }
    dists.sort((x, y) => x.d - y.d);
    const edges: number[] = [];
    for (let k = 0; k < 18; k++) {
      const { i, j } = dists[k];
      edges.push(...ATTRACTORS[i], ...ATTRACTORS[j]);
    }
    g.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(edges), 3),
    );
    return g;
  }, []);

  useFrame(() => {
    const e = progressRef.current;
    matRef.current.opacity = 0.08 + e * 0.18;
  });

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        ref={matRef}
        color="#fafafa"
        transparent
        opacity={0.08}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function Rig() {
  // Camera locked at fixed position so category labels stay anchored to their attractors.
  // (Earlier breathing made screen-space labels drift relative to particles.)
  return null;
}

export function ParticleField({
  triggered = false,
}: {
  triggered?: boolean;
}) {
  const reduced = useReducedMotion();
  const progressRef = useRef(0);
  // triggered wins — once activated, fully converged regardless of scroll
  progressRef.current = triggered ? 1 : 0;

  const count = reduced ? 500 : 1000;

  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.5], fov: 45 }}
      style={{ background: 'transparent', pointerEvents: 'none' }}
    >
      <Rig />
      <Particles count={count} progressRef={progressRef} />
      <AttractorLines progressRef={progressRef} />
      <CategoryOverlay visible={triggered} />
    </Canvas>
  );
}