export const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 q = uv * vec2(u_resolution.x / u_resolution.y, 1.0) * 2.2;
  vec2 warp = vec2(fbm(q + u_time * 0.05), fbm(q + vec2(5.2, 1.3) - u_time * 0.04));
  float glow = smoothstep(0.45, 0.0, distance(uv, u_pointer));
  float v = fbm(q + 2.0 * warp + (u_pointer - 0.5) * 0.8) + 0.25 * glow;

  vec3 base = vec3(0.051, 0.059, 0.078);
  vec3 violet = vec3(0.32, 0.29, 0.72);
  vec3 teal = vec3(0.11, 0.55, 0.45);

  vec3 color = mix(base, violet, smoothstep(0.35, 0.9, v));
  color = mix(color, teal, smoothstep(0.62, 1.05, v) * 0.6);
  color *= 0.55 + 0.45 * (1.0 - uv.y * 0.5);
  color = mix(base, color, smoothstep(0.0, 0.35, uv.y));

  gl_FragColor = vec4(color, 1.0);
}
`;
