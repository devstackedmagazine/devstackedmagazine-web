import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveRoute, routes, projects, buildBrief } from '../src/content.js';

test('main pages and project deep links resolve; unknown paths stay unknown', () => {
  for (const page of routes) assert.equal(resolveRoute(page + '/').page, page);
  for (const project of projects) assert.equal(resolveRoute(`/work/${project.slug}`).project, project);
  assert.equal(resolveRoute('/work/nonexistent').page, '/404');
  assert.equal(resolveRoute('/products/../../contact').page, '/404');
});

