/**
 * Simple pub/sub event bus.
 * Decouples simulation, renderer, and UI modules.
 */

const listeners = new Map();

export function on(event, callback) {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event).add(callback);
  // Return unsubscribe function
  return () => listeners.get(event)?.delete(callback);
}

export function emit(event, data) {
  const callbacks = listeners.get(event);
  if (callbacks) {
    for (const cb of callbacks) {
      cb(data);
    }
  }
}

export function off(event, callback) {
  listeners.get(event)?.delete(callback);
}
