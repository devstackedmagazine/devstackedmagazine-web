import test from 'node:test';
import assert from 'node:assert/strict';
import { logoPose, renderPixelRatio } from '../src/logo-motion.js';

test('scroll exposes the core, then seats every piece before the final reveal', () => {
  const opening = logoPose(0), core = logoPose(.32), complete = logoPose(.75);
  assert.ok(opening.crown.every(value => value === 0));
  assert.ok(core.crown[1] > .6 && core.lower[1] < -.5);
  assert.ok(core.coreZ > 1.5, 'lime core moves in front of the stone');
  assert.equal(complete.open, 0, 'assembly finishes before the final message');
  assert.ok(complete.crown.every(value => value === 0));
  assert.ok(complete.lower.every(value => value === 0));
  assert.equal(complete.coreZ, -.26);
  assert.equal(complete.opacity, 1);
  assert.equal(logoPose(1).opacity, 0);
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
