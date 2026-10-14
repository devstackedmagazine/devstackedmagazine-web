import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveRoute, routes, projects, buildBrief } from '../src/content.js';

test('main pages and project deep links resolve; unknown paths stay unknown', () => {
  for (const page of routes) assert.equal(resolveRoute(page + '/').page, page);
  for (const project of projects) assert.equal(resolveRoute(`/work/${project.slug}`).project, project);
  assert.equal(resolveRoute('/work/nonexistent').page, '/404');
  assert.equal(resolveRoute('/products/../../contact').page, '/404');
});

test('brief preserves actual details and includes only allowed services', () => {
  const brief = buildBrief({ name: '  Alex  ', email: 'alex@example.com', details: 'We need a new website for our architecture studio.', services: ['Websites & software', 'Untrusted category', 'Websites & software'] });
  assert.match(brief, /Name: Alex/);
  assert.match(brief, /Services: Websites & software\n/);
  assert.doesNotMatch(brief, /Untrusted category/);
  assert.match(brief, /architecture studio/);
});

test('brief rejects missing, invalid and oversized fields', () => {
  const valid = { name: 'Alex', email: 'alex@example.com', details: 'A clear website project description.' };
  for (const changes of [{ name: '' }, { email: 'not-email' }, { details: 'Too short' }, { details: 'a'.repeat(5001) }, { name: 'a'.repeat(121) }]) {
    assert.throws(() => buildBrief({ ...valid, ...changes }));
  }
});
