// Vertex shader: morph from chaotic cloud to 12 attractor constellation
const vert = /* glsl */ `
attribute float aAttractor;
attribute float aSeed;

uniform float uProgress;
uniform float uTime;
uniform vec2 uPointer;

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
  vec3 target = attractorPos(int(aAttractor));
  float jitter = (hash11(aSeed) - 0.5) * 0.32;
  target += vec3(jitter, jitter * 1.3, jitter * 0.7);

  float t = uProgress;
  float e = 1.0 - pow(1.0 - t, 4.0);

  vec3 morphed = mix(home, target, e);

  float drift = (1.0 - e) * 0.06;
  morphed += vec3(
    sin(uTime * 0.6 + aSeed * 6.28),
    cos(uTime * 0.5 + aSeed * 4.71),
    sin(uTime * 0.7 + aSeed * 3.14)
  ) * drift;

  float wobble = e * 0.03;
  morphed += vec3(
    sin(uTime * 1.2 + aSeed * 9.0),
    cos(uTime * 1.0 + aSeed * 7.0),
    sin(uTime * 0.9 + aSeed * 5.0)
  ) * wobble;

  vec3 cam = vec3(uPointer * (0.15 + e * 0.05), 0.0);
  morphed -= cam;

  vec4 mv = modelViewMatrix * vec4(morphed, 1.0);
  gl_Position = projectionMatrix * mv;

  // Small points — half previous size. Converged points barely grow.
  float size = mix(1.6, 2.2, e);
  gl_PointSize = size * (60.0 / -mv.z);

  vAlpha = mix(0.7, 1.0, e);
  vSeed = aSeed;
}
`;

export default vert;
