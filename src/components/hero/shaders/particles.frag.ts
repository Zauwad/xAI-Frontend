// Fragment shader: soft round point + twinkle
const frag = /* glsl */ `
precision highp float;

varying float vAlpha;
varying float vSeed;

uniform float uTime;
uniform float uProgress;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;

  // Tight falloff — mostly transparent halo, small bright core
  float core = smoothstep(0.15, 0.0, d);
  float halo = smoothstep(0.5, 0.35, d) * 0.12;
  float intensity = core + halo;

  // subtle twinkle, never blows out
  float twinkle = 0.85 + 0.15 * sin(uTime * 2.2 + vSeed * 12.566);

  // converge brightens slightly
  float converge = mix(0.7, 1.0, uProgress);

  vec3 col = vec3(intensity * twinkle * converge);

  // alpha = intensity only — additive blending will handle brightness
  gl_FragColor = vec4(col, intensity * vAlpha * 0.9);
}
`;

export default frag;
