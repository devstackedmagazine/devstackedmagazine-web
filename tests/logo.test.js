import test from 'node:test';
import assert from 'node:assert/strict';
import { ExtrudeGeometry } from 'three';
import { createLogoShapes } from '../src/logo-scene.js';

function contains(shape, x, y) {
  const points = shape.getPoints(64);
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i], b = points[j];
    if ((a.y > y) !== (b.y > y) && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

test('logo preserves upper opening, diagonal cut, lower opening and lime inset', () => {
  const { crown, lower, inset } = createLogoShapes();
  for (const shape of [crown, lower, inset]) {
    for (const [x, y] of [[0, 1.15], [0, .2], [.4, -1.1]]) assert.equal(contains(shape, x, y), false);
  }
  assert.equal(contains(crown, 0, 1.7), true);
  assert.equal(contains(lower, -1, -1.7), true);
  assert.equal(contains(inset, 0, -1), true);
});

test('logo contours extrude into finite geometry with actual thickness', () => {
  for (const shape of Object.values(createLogoShapes())) {
    const geometry = new ExtrudeGeometry(shape, { depth: .64, bevelEnabled: true, bevelSize: .035, bevelThickness: .035, bevelSegments: 4, curveSegments: 36 });
    geometry.computeBoundingBox();
    assert.ok(geometry.boundingBox.max.z - geometry.boundingBox.min.z > .64);
    for (const attribute of ['position', 'normal']) assert.ok([...geometry.attributes[attribute].array].every(Number.isFinite));
    assert.ok(geometry.groups.some(group => group.materialIndex === 1), 'side surfaces receive their own material');
    geometry.dispose();
  }
});
