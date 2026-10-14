const smooth = (start, end, value) => {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
};

// A reversible scroll story: reveal the core, assemble, then carry forward.
export function logoPose(progress, paused = false) {
  const p = paused ? 0 : Math.max(0, Math.min(1, progress));
  const open = smooth(.04, .3, p) * (1 - smooth(.36, .7, p));
  const resolve = smooth(.68, .92, p);
  return {
    open, resolve,
    crown: [-.48 * open, .72 * open, -.3 * open],
    lower: [.42 * open, -.62 * open, -.18 * open],
    coreZ: -.26 + open * 1.85,
    scale: 1 - open * .1 + resolve * .1,
    opacity: 1 - smooth(.94, 1, p),
  };
}

export function renderPixelRatio(width, height, dpr) {
  return Math.min(dpr, 1.25, Math.sqrt(1200000 / Math.max(1, width * height)));
}
