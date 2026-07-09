'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ATTRACTORS, generatePoints, mulberry32 } from '@/lib/random';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { usePageScroll } from '@/hooks/useScrollProgress';
import vert from './shaders/particles.vert';
import frag from './shaders/particles.frag';

function Particles({
  count,
  progressRef,
  pointerRef,
}: {
  count: number;
  progressRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
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
      uPointer: { value: new THREE.Vector2(0, 0) },
    }),
    [],
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    const target = progressRef.current;
    uniforms.uProgress.value += (target - uniforms.uProgress.value) * 0.06;
    const tx = pointerRef.current.x;
    const ty = pointerRef.current.y;
    uniforms.uPointer.value.x += (tx - uniforms.uPointer.value.x) * 0.05;
    uniforms.uPointer.value.y += (ty - uniforms.uPointer.value.y) * 0.05;
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
        blending={THREE.AdditiveBlending}
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
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.z = 4.2 + Math.sin(t * 0.15) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function ParticleField() {
  const reduced = useReducedMotion();
  const scroll = usePageScroll();
  const progressRef = useRef(0);
  progressRef.current = Math.min(scroll / 0.3, 1);

  const pointerRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const count = reduced ? 600 : 1500;

  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      style={{ background: 'transparent', pointerEvents: 'none' }}
    >
      <Rig />
      <Particles
        count={count}
        progressRef={progressRef}
        pointerRef={pointerRef}
      />
      <AttractorLines progressRef={progressRef} />
    </Canvas>
  );
}