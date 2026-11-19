import { VERTEX_SHADER } from "./fragment";

export type ShaderRenderer = {
  start(): void;
  stop(): void;
  resize(): void;
  setPointer(x: number, y: number): void;
  destroy(): void;
};

const POINTER_EASING = 0.05;

function compile(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  fragmentSource: string,
): WebGLProgram | null {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

export function createShaderRenderer(
  canvas: HTMLCanvasElement,
  fragmentSource: string,
  pixelRatio: number,
): ShaderRenderer | null {
  const gl = canvas.getContext("webgl", {
    antialias: false,
    alpha: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const program = createProgram(gl, fragmentSource);
  if (!program) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const resolution = gl.getUniformLocation(program, "u_resolution");
  const time = gl.getUniformLocation(program, "u_time");
  const pointerUniform = gl.getUniformLocation(program, "u_pointer");

  const pointer = { x: 0.7, y: 0.6 };
  const target = { x: 0.7, y: 0.6 };
  let frame = 0;
  let lost = false;

  const onContextLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    stop();
    canvas.dispatchEvent(new CustomEvent("shader:lost"));
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  function draw(now: number) {
    pointer.x += (target.x - pointer.x) * POINTER_EASING;
    pointer.y += (target.y - pointer.y) * POINTER_EASING;
    gl!.uniform2f(resolution, canvas.width, canvas.height);
    gl!.uniform1f(time, now / 1000);
    gl!.uniform2f(pointerUniform, pointer.x, pointer.y);
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    frame = requestAnimationFrame(draw);
  }

  function start() {
    if (frame || lost) return;
    frame = requestAnimationFrame(draw);
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  function resize() {
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));
    gl!.viewport(0, 0, canvas.width, canvas.height);
  }

  function setPointer(x: number, y: number) {
    target.x = x;
    target.y = y;
  }

  function destroy() {
    stop();
    canvas.removeEventListener("webglcontextlost", onContextLost);
    gl!.getExtension("WEBGL_lose_context")?.loseContext();
  }

  resize();
  return { start, stop, resize, setPointer, destroy };
}
