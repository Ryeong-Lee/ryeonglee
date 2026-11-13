// Spring engine: damped springs stepped on one shared rAF loop.
// Springs are "stiffness damping", the same numbers as the original motion tokens.

const reduce =
  typeof matchMedia !== "undefined" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

export const S = (x, k = 400, c = 30) => ({ x, v: 0, t: x, k, c: reduce ? 2 * Math.sqrt(k) : c });
export const tune = (s, k, c) => {
  s.k = k;
  s.c = reduce ? 2 * Math.sqrt(k) : c;
};
export const step = (s, dt) => {
  const a = -s.k * (s.x - s.t) - s.c * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
};
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// shared presets and component springs (stiffness, damping)
export const SPRINGS = {
  follow: [900, 50],
  settle: [280, 22],
  fade: [420, 32],
  lensFollow: [180, 17],
  lensZoom: [260, 26],
  roll: [380, 24],
  wave: [260, 22],
  waveFocus: [150, 22],
};
export const LENS = { zoom: 1.7, press: 2.4, size: 150 };

const timers = [];
export const after = (sec, fn) => {
  const t = { t: sec, fn };
  timers.push(t);
  return t;
};
export const cancel = (t) => {
  const i = timers.indexOf(t);
  if (i > -1) timers.splice(i, 1);
};

const comps = new Set();
let last = 0;
let running = false;

function loop(now) {
  const dt = Math.min((now - last) / 1000, 1 / 30);
  last = now;
  for (let i = timers.length - 1; i >= 0; i--) {
    if ((timers[i].t -= dt) <= 0) timers.splice(i, 1)[0].fn();
  }
  const sub = 4;
  for (let k = 0; k < sub; k++) comps.forEach((c) => c.active() && c.frame(dt / sub));
  comps.forEach((c) => c.active() && c.render());
  requestAnimationFrame(loop);
}

// register a component; returns an unregister function.
// `active` lets off-screen components skip work.
export function register(c) {
  const comp = { active: () => true, ...c };
  comps.add(comp);
  if (!running) {
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);
  }
  return () => comps.delete(comp);
}

export const prefersReducedMotion = reduce;
