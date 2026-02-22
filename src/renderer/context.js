/**
 * WebGL2 context creation and canvas management.
 * Handles resize with devicePixelRatio for crisp rendering.
 */

export function createWebGLContext(canvasId = 'constellation') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    throw new Error(`Canvas element '#${canvasId}' not found`);
  }

  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,        // we handle our own AA via shader smoothing
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
  });

  if (!gl) {
    throw new Error('WebGL2 is not supported in this browser');
  }

  // State
  const state = {
    canvas,
    gl,
    width: 0,
    height: 0,
    pixelRatio: 1,
    resizeCallbacks: [],
  };

  // Resize handler
  function handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x for perf
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    const bufferWidth = Math.round(displayWidth * dpr);
    const bufferHeight = Math.round(displayHeight * dpr);

    if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
      canvas.width = bufferWidth;
      canvas.height = bufferHeight;
      gl.viewport(0, 0, bufferWidth, bufferHeight);

      state.width = displayWidth;
      state.height = displayHeight;
      state.pixelRatio = dpr;

      // Notify listeners
      for (const cb of state.resizeCallbacks) {
        cb(displayWidth, displayHeight, dpr);
      }
    }
  }

  // Observe resize
  const observer = new ResizeObserver(handleResize);
  observer.observe(canvas);
  handleResize(); // initial size

  return {
    gl,
    canvas,
    get width() { return state.width; },
    get height() { return state.height; },
    get bufferWidth() { return state.canvas.width; },
    get bufferHeight() { return state.canvas.height; },
    get pixelRatio() { return state.pixelRatio; },
    onResize(callback) {
      state.resizeCallbacks.push(callback);
      // Call immediately with current size
      callback(state.width, state.height, state.pixelRatio);
    },
    destroy() {
      observer.disconnect();
    },
  };
}
