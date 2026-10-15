const smooth = (start, end, value) => {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
};

// Reveal the core, then keep separating the pieces as the story unfolds.
export function logoPose(progress, paused = false) {
  const p = paused ? 0 : Math.max(0, Math.min(1, progress));
  const resolve = smooth(.36, .92, p);
  const reveal = smooth(.04, .3, p);
  const open = reveal + resolve * 1.15;
  return {
    open, resolve,
    crown: [-.48 * open, .72 * open, -.3 * open],
    lower: [.42 * open, -.62 * open, -.18 * open],
    coreZ: -.26 + reveal * 1.85 + resolve * .65,
    scale: 1 - reveal * .1 - resolve * .03,
    opacity: 1 - smooth(.94, 1, p),
  };
}

export function renderPixelRatio(width, height, dpr) {
  return Math.min(dpr, 1.25, Math.sqrt(1200000 / Math.max(1, width * height)));
}
