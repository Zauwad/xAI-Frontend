// Vertex shader: morph from chaotic cloud → 12 attractor constellation.
// After activation, each particle orbits its attractor at a stable radius.
const vert = /* glsl */ `
attribute float aAttractor;
attribute float aSeed;

uniform float uProgress;
uniform float uTime;

varying float vAlpha;
varying float vSeed;

vec3 attractorPos(int idx) {
  float phi = (1.0 + sqrt(5.0)) / 2.0;
  float s = 0.95;
  if (idx == 0)  return vec3(-1.0,  phi, 0.0) * s;
  if (idx == 1)  return vec3( 1.0,  phi, 0.0) * s;
  if (idx == 2)  return vec3(-1.0, -phi, 0.0) * s;
  if (idx == 3)  return vec3( 1.0, -phi, 0.0) * s;
  if (idx == 4)  return vec3( 0.0, -1.0,  phi) * s;
  if (idx == 5)  return vec3( 0.0,  1.0,  phi) * s;
  if (idx == 6)  return vec3( 0.0, -1.0, -phi) * s;
  if (idx == 7)  return vec3( 0.0,  1.0, -phi) * s;
  if (idx == 8)  return vec3( phi,  0.0, -1.0) * s;
  if (idx == 9)  return vec3( phi,  0.0,  1.0) * s;
  if (idx == 10) return vec3(-phi,  0.0, -1.0) * s;
  return            vec3(-phi,  0.0,  1.0) * s;
}

float hash11(float p) {
  return fract(sin(p * 91.3458) * 43758.5453);
}

void main() {
  vec3 home = position;
  vec3 attractor = attractorPos(int(aAttractor));

  // Orbital target: each particle lands on its own orbit around the attractor.
  // Radius derived from seed (varies 0.07..0.13); angle also seeded but advances with time
  // so each particle continuously circles its node.
  float baseAngle = aSeed * 6.2831853;
  float orbitSpeed = 0.18 + (hash11(aSeed * 3.17) - 0.5) * 0.12;
  float angle = baseAngle + uTime * orbitSpeed;
  float radius = 0.10 + (hash11(aSeed * 7.31) - 0.5) * 0.03;
  float zDepth = sin(angle * 1.7 + aSeed * 5.0) * radius * 0.35;

  vec3 orbit = attractor + vec3(
    cos(angle) * radius,
    sin(angle) * radius * 0.85,
    zDepth
  );

  // All groups lock in together — single slow morph (~3s), no per-attractor stagger.
  // uProgress crawls 0→1 over ~3s on JS side; shader uses full window so morph eases.
  float local = clamp(uProgress / 0.95, 0.0, 1.0);
  float e = 1.0 - pow(1.0 - local, 2.6);

  vec3 morphed = mix(home, orbit, e);

  // Chaotic drift when scattered (large when e=0, gone when converged)
  float drift = (1.0 - e) * 0.06;
  morphed += vec3(
    sin(uTime * 0.6 + aSeed * 6.28),
    cos(uTime * 0.5 + aSeed * 4.71),
    sin(uTime * 0.7 + aSeed * 3.14)
  ) * drift;

  // Subtle individual wobble persists even when orbiting, so dots don't feel glued
  float wobble = 0.012 + e * 0.008;
  morphed += vec3(
    sin(uTime * 1.4 + aSeed * 9.0),
    cos(uTime * 1.1 + aSeed * 7.0),
    sin(uTime * 0.9 + aSeed * 5.0)
  ) * wobble;

  vec4 mv = modelViewMatrix * vec4(morphed, 1.0);
  gl_Position = projectionMatrix * mv;

  // Smaller points when scattered, slightly larger (but still small) when orbiting
  float size = mix(1.4, 1.6, e);
  gl_PointSize = size * (60.0 / -mv.z);

  vAlpha = mix(0.7, 1.0, e);
  vSeed = aSeed;
}
`;

export default vert;