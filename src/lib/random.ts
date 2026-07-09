// Seeded RNG (mulberry32) — first-frame determinism
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate `count` 3D points in a unit ball using seeded RNG
export function generatePoints(count: number, seed = 1337) {
  const rng = mulberry32(seed);
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Spherical distribution — wider spread so cloud feels volumetric, not clustered
    const r = Math.cbrt(rng()) * 2.4;
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    arr[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

// Pre-baked attractor layout — 12 nodes arranged in an icosahedral constellation
export const ATTRACTORS: [number, number, number][] = (() => {
  const phi = (1 + Math.sqrt(5)) / 2;
  const verts: [number, number, number][] = [
    [-1, phi, 0],
    [1, phi, 0],
    [-1, -phi, 0],
    [1, -phi, 0],
    [0, -1, phi],
    [0, 1, phi],
    [0, -1, -phi],
    [0, 1, -phi],
    [phi, 0, -1],
    [phi, 0, 1],
    [-phi, 0, -1],
    [-phi, 0, 1],
  ];
  const scale = 0.95;
  return verts.map((v) => [v[0] * scale, v[1] * scale, v[2] * scale]);
})();