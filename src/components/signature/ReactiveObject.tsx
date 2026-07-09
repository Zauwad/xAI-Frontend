'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { ATTRACTORS } from '@/lib/random';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function Shards({
  explodeRef,
}: {
  explodeRef: React.MutableRefObject<{ active: boolean; t0: number }>;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const shards = useRef<(THREE.Mesh | null)[]>([]);

  useEffect(() => {
    const handler = () => {
      explodeRef.current = { active: true, t0: performance.now() };
    };
    window.addEventListener('xai:explode', handler);
    return () => window.removeEventListener('xai:explode', handler);
  }, [explodeRef]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const elapsed = (performance.now() - (explodeRef.current.t0 || 0)) / 1000;
    const duration = 1.4;
    const p = explodeRef.current.active
      ? easeOutCubic(Math.min(elapsed / duration, 1))
      : 0;
    // post-explode: slow orbital drift
    const post = explodeRef.current.active ? Math.max(0, elapsed - duration) : 0;

    for (let i = 0; i < ATTRACTORS.length; i++) {
      const m = shards.current[i];
      if (!m) continue;
      const a = ATTRACTORS[i];
      // Each shard eases OUTWARD from origin to its attractor position
      // then continues outward slowly.
      const outward = 1 + post * 0.04;
      m.position.x = a[0] * p * outward;
      m.position.y = a[1] * p * outward;
      m.position.z = a[2] * p * outward;
      // gentle tumble
      m.rotation.x = t * 0.25 + i * 1.3;
      m.rotation.y = t * 0.32 + i * 0.9;
      // visible size — feels solid, not gems
      const s = (0.28 + p * 0.08) * 0.7;
      m.scale.setScalar(s);
      const mat = m.material as THREE.MeshBasicMaterial;
      // appear as we explode, fade in over first 0.4s of p
      mat.opacity = Math.min(p * 2.5, 1) * 0.95;
    }
  });

  return (
    <group ref={groupRef}>
      {ATTRACTORS.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            shards.current[i] = el;
          }}
        >
          {/* small octahedron fragments — feels like pieces, not gems */}
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            color="#fafafa"
            wireframe
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Mesh({
  explodeRef,
}: {
  explodeRef: React.MutableRefObject<{ active: boolean; t0: number }>;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const wireRef = useRef<THREE.Mesh>(null!);
  const solidRef = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.MeshBasicMaterial>(null!);
  const ring2Ref = useRef<THREE.MeshBasicMaterial>(null!);
  const ring1Base = 0.18;
  const ring2Base = 0.1;
  const current = useRef({ rx: 0, ry: 0 });
  const pointer = useRef({ x: 0, y: 0 });
  const hovered = useRef(false);

  const wireMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uHover: { value: 0 },
          uFade: { value: 1 },
        },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vViewDir = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform float uHover;
          uniform float uFade;
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            float rim = 1.0 - max(dot(vNormal, vViewDir), 0.0);
            float intensity = pow(rim, 2.2);
            vec3 col = mix(vec3(0.7), vec3(1.0), uHover);
            gl_FragColor = vec4(col, intensity * uFade);
          }
        `,
        transparent: true,
        wireframe: true,
        depthWrite: false,
      }),
    [],
  );

  const solidMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uHover: { value: 0 },
          uFade: { value: 1 },
        },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vViewDir = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform float uHover;
          uniform float uFade;
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            float rim = 1.0 - max(dot(vNormal, vViewDir), 0.0);
            float intensity = pow(rim, 1.6);
            float alpha = intensity * (0.12 + uHover * 0.18) * uFade;
            gl_FragColor = vec4(vec3(1.0), alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onOver = () => (hovered.current = true);
    const onOut = () => (hovered.current = false);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver);
    window.addEventListener('pointerout', onOut);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerout', onOut);
    };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    current.current.ry = pointer.current.x * 0.9 + Math.sin(t * 0.3) * 0.1;
    current.current.rx = pointer.current.y * 0.5 + Math.cos(t * 0.25) * 0.08;

    // explode fade
    const elapsed = (performance.now() - (explodeRef.current.t0 || 0)) / 1000;
    const p = explodeRef.current.active
      ? easeOutCubic(Math.min(elapsed / 1.6, 1))
      : 0;
    const fade = 1 - p;

    // also keep rotation responding to pointer when not exploded
    if (fade > 0.01) {
      groupRef.current.rotation.x = current.current.rx;
      groupRef.current.rotation.y = current.current.ry;
      groupRef.current.rotation.z += delta * 0.05;
    }

    wireMat.uniforms.uTime.value = t;
    solidMat.uniforms.uTime.value = t;
    wireMat.uniforms.uFade.value = fade;
    solidMat.uniforms.uFade.value = fade;

    if (ring1Ref.current) ring1Ref.current.opacity = ring1Base * fade;
    if (ring2Ref.current) ring2Ref.current.opacity = ring2Base * fade;

    const h = hovered.current ? 1 : 0;
    wireMat.uniforms.uHover.value += (h - wireMat.uniforms.uHover.value) * 0.08;
    solidMat.uniforms.uHover.value += (h - solidMat.uniforms.uHover.value) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={wireRef} material={wireMat}>
        <icosahedronGeometry args={[1.4, 3]} />
      </mesh>
      <mesh ref={solidRef} material={solidMat}>
        <icosahedronGeometry args={[1.3, 2]} />
      </mesh>
      <mesh rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.2, 0.005, 8, 128]} />
        <meshBasicMaterial ref={ring1Ref} color="#fafafa" transparent opacity={0.18} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2.6]}>
        <torusGeometry args={[2.6, 0.005, 8, 128]} />
        <meshBasicMaterial ref={ring2Ref} color="#fafafa" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

function Rig() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.1) * 0.2;
    camera.position.y = Math.cos(t * 0.12) * 0.1;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function ReactiveObject() {
  const explodeRef = useRef({ active: false, t0: 0 });

  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      style={{ background: 'transparent' }}
    >
      <Rig />
      <Mesh explodeRef={explodeRef} />
      <Shards explodeRef={explodeRef} />
    </Canvas>
  );
}