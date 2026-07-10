"use client";

/**
 * Cinematic chrome state stores (letterbox refcount + cursor lamp).
 * Pull-based: subscribers immediately receive the current value on
 * subscribe, so remounts (StrictMode / Fast Refresh) can never miss
 * an event that fired while they were detached.
 */

type Listener<T> = (value: T) => void;

function createStore<T>(initial: T) {
  let value = initial;
  const subs = new Set<Listener<T>>();
  return {
    get: () => value,
    set(next: T) {
      if (next === value) return;
      value = next;
      subs.forEach((fn) => fn(value));
    },
    subscribe(fn: Listener<T>) {
      subs.add(fn);
      fn(value);
      return () => {
        subs.delete(fn);
      };
    },
  };
}

/* ---- letterbox: refcount, several cinematic scenes may overlap ---- */
let count = 0;
const letterboxStore = createStore(false);

export const letterbox = {
  enter() {
    count += 1;
    letterboxStore.set(count > 0);
  },
  leave() {
    count = Math.max(0, count - 1);
    letterboxStore.set(count > 0);
  },
  subscribe: letterboxStore.subscribe,
};

/* ---- cursor lamp: single boolean ---- */
const lampStore = createStore(false);

export const cursorLamp = {
  set: lampStore.set,
  subscribe: lampStore.subscribe,
};
