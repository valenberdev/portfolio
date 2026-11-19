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
  float aspect = u_resolution.x / u_resolution.y;
  vec2 q = uv * vec2(aspect, 1.0) * 2.0;
  vec2 warp = vec2(fbm(q + u_time * 0.04), fbm(q + vec2(5.2, 1.3) - u_time * 0.035));
  float glow = smoothstep(0.55, 0.0, distance(uv * vec2(aspect, 1.0), u_pointer * vec2(aspect, 1.0)));
  float field = fbm(q + 2.2 * warp + (u_pointer - 0.5) * 0.6) + 0.2 * glow;

  float f = fract(field * 8.0);
  float line = smoothstep(0.0, 0.05, f) - smoothstep(0.05, 0.12, f);
  float heat = smoothstep(0.38, 0.88, field);

  vec3 base = vec3(0.043, 0.039, 0.035);
  vec3 ember = vec3(0.45, 0.11, 0.05);
  vec3 hot = vec3(1.0, 0.35, 0.21);

  vec3 color = base + ember * heat * 0.75;
  color += hot * line * (0.05 + 0.4 * heat) * (0.6 + glow);
  color += hot * glow * 0.1;

  float fade = smoothstep(0.02, 0.6, uv.y);
  color = mix(base, color, fade);
  color += (hash(gl_FragCoord.xy) - 0.5) / 160.0;

  gl_FragColor = vec4(color, 1.0);
}
`;
