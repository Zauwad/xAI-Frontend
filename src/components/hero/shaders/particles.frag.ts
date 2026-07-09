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

  float core = smoothstep(0.5, 0.0, d);
  float halo = smoothstep(0.5, 0.15, d) * 0.4;
  float intensity = core + halo;

  float twinkle = 0.7 + 0.3 * sin(uTime * 2.4 + vSeed * 12.566);

  float converge = mix(0.85, 1.0, uProgress);

  vec3 col = vec3(1.0) * intensity * twinkle * converge;

  gl_FragColor = vec4(col, intensity * vAlpha);
}
`;

export default frag;
