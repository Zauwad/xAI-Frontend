'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

function Mesh() {
  const groupRef = useRef<THREE.Group>(null!);
  const wireRef = useRef<THREE.Mesh>(null!);
  const solidRef = useRef<THREE.Mesh>(null!);
  const target = useRef({ rx: 0, ry: 0, sx: 1, sy: 1 });
  const current = useRef({ rx: 0, ry: 0, sx: 1, sy: 1 });
  const pointer = useRef({ x: 0, y: 0 });
  const hovered = useRef(false);

  const wireMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uHover: { value: 0 },
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
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            float rim = 1.0 - max(dot(vNormal, vViewDir), 0.0);
            float intensity = pow(rim, 2.2);
            vec3 col = mix(vec3(0.7), vec3(1.0), uHover);
            gl_FragColor = vec4(col, intensity);
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
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            float rim = 1.0 - max(dot(vNormal, vViewDir), 0.0);
            float intensity = pow(rim, 1.6);
            float alpha = intensity * (0.12 + uHover * 0.18);
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
    // targets: pointer-driven rotation, with slight idle wobble
    target.current.ry = pointer.current.x * 0.9 + Math.sin(t * 0.3) * 0.1;
    target.current.rx = pointer.current.y * 0.5 + Math.cos(t * 0.25) * 0.08;

    // damp
    current.current.rx += (target.current.rx - current.current.rx) * 0.08;
    current.current.ry += (target.current.ry - current.current.ry) * 0.08;

    groupRef.current.rotation.x = current.current.rx;
    groupRef.current.rotation.y = current.current.ry;
    groupRef.current.rotation.z += delta * 0.05;

    wireMat.uniforms.uTime.value = t;
    solidMat.uniforms.uTime.value = t;
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
      {/* orbit ring */}
      <mesh rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.2, 0.005, 8, 128]} />
        <meshBasicMaterial color="#fafafa" transparent opacity={0.18} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2.6]}>
        <torusGeometry args={[2.6, 0.005, 8, 128]} />
        <meshBasicMaterial color="#fafafa" transparent opacity={0.1} />
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
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      style={{ background: 'transparent' }}
    >
      <Rig />
      <Mesh />
    </Canvas>
  );
}