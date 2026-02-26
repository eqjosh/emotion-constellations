/**
 * Input handler — DOM pointer event listener.
 *
 * Listens to pointer events on the canvas and emits events
 * via the event bus. Handles touch vs mouse detection and
 * coordinate extraction.
 *
 * Uses a "consumed" flag so that UI overlays (like the ✦ wisdom icon)
 * can suppress the canvas tap when they handle a pointerdown first.
 *
 * Events emitted:
 *   'input:tap' — { x, y } in CSS pixels
 *   'input:hover' — { x, y } in CSS pixels (desktop only)
 *   'input:hover-end' — (no data)
 */

import { emit, on } from '../core/events.js';

export function createInputHandler(canvas) {
  let isTouch = false;
  let hoverThrottleId = null;
  let tapConsumed = false;

  // UI overlays emit this to suppress the next canvas tap
  const unsub = on('input:consume-tap', () => {
    tapConsumed = true;
  });

  function getCanvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function onPointerDown(event) {
    // Track whether this is a touch device
    isTouch = event.pointerType === 'touch';

    // If a UI overlay already handled this pointer event, skip
    if (tapConsumed) {
      tapConsumed = false;
      return;
    }

    const point = getCanvasPoint(event);
    emit('input:tap', point);
  }

  function onPointerMove(event) {
    // No hover on touch devices
    if (isTouch || event.pointerType === 'touch') return;

    // Throttle hover to ~30fps to avoid excessive work
    if (hoverThrottleId) return;
    hoverThrottleId = requestAnimationFrame(() => {
      hoverThrottleId = null;
      const point = getCanvasPoint(event);
      emit('input:hover', point);
    });
  }

  function onPointerLeave() {
    if (!isTouch) {
      emit('input:hover-end');
    }
  }

  // Bind events
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerleave', onPointerLeave);

  return {
    destroy() {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      if (hoverThrottleId) {
        cancelAnimationFrame(hoverThrottleId);
      }
      if (unsub) unsub();
    },
  };
}
