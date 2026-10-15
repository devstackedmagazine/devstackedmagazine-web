import test from 'node:test';
import assert from 'node:assert/strict';
import { logoPose, renderPixelRatio } from '../src/logo-motion.js';

test('scroll exposes the core, then deconstructs further through the final reveal', () => {
  const opening = logoPose(0), core = logoPose(.32), expanded = logoPose(.92);
  assert.ok(opening.crown.every(value => value === 0));
  assert.ok(core.crown[1] > .6 && core.lower[1] < -.5);
  assert.ok(core.coreZ > 1.5, 'lime core moves in front of the stone');
  assert.ok(expanded.open > core.open * 2, 'final pieces spread beyond the initial core reveal');
  assert.ok(expanded.crown[1] > core.crown[1]);
  assert.ok(expanded.lower[1] < core.lower[1]);
  assert.ok(expanded.coreZ > core.coreZ);
  assert.equal(expanded.opacity, 1);
  assert.equal(logoPose(1).opacity, 0);
  let previous = opening;
  for (let step = 1; step <= 100; step++) {
    const pose = logoPose(step / 100);
    assert.ok(pose.open >= previous.open, 'forward scroll never reassembles the logo');
    assert.ok(pose.coreZ >= previous.coreZ, 'core continues forward');
    previous = pose;
  }
});

test('static mode always presents the complete logo, regardless of scroll', () => {
  for (const progress of [-1, .32, .7, 2]) assert.deepEqual(logoPose(progress, true), logoPose(0));
});

test('render resolution stays within the pixel budget on wide and retina screens', () => {
  for (const [width, height, dpr] of [[390, 843, 3], [1440, 900, 1.2], [3840, 2160, 2]]) {
    const ratio = renderPixelRatio(width, height, dpr);
    assert.ok(ratio > 0 && ratio <= dpr && ratio <= 1.25);
    assert.ok(width * height * ratio ** 2 <= 1200000.001);
  }
});
