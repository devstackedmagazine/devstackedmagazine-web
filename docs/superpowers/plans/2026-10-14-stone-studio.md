# Stone studio implementation plan

**Goal:** Build the agreed local agency website with a 3D scroll journey and equally prominent client and owned-product work.

**Architecture:** Vite serves static HTML and ES modules. A small History API router renders content; a disposable Three.js scene runs only on the homepage. Generated landscape and self-hosted fonts stay in the project.

**Tech stack:** HTML, CSS, JavaScript, Three.js, Vite, Node test runner.

**Spec:** ../specs/2026-10-14-stone-studio-design.md

## Constraints
- Brand colors #F5F3EE / #171717 / #D7FF3F; lowercase devstackedmagazine.
- No invented clients, product availability, metrics, prices or contact delivery.
- Respect reduced motion, keyboard access and mobile reading order.
- Local implementation and preview; native execution by this agent.

## Review focus
Deep links and back/forward restore routes; narrow layouts do not overflow; reduced motion disables camera movement; WebGL failures leave usable content; contact input is rendered safely and no false submission occurs.

## Tasks
- [x] Foundation: package scripts, generated landscape, routing/content helpers; test valid and unknown routes plus brief validation.
- [x] Experience: scene.js owns camera/terrain/logo/water and disposal; main.js owns accessible navigation and all pages; style.css owns responsive compositions.
- [x] Verify: unit tests and production build pass; desktop/mobile/scroll/menu/forms/static-mode browser checks completed. OS motion emulation and forced WebGL loss unavailable, documented in README. Local preview opened; source ready for commit.

## Review revision

The initial implementation is retained in commit 478ac1c. User rejected its light interiors, Inter and approximate 3D logo. Revision replaces fonts with Archivo Black/Manrope, makes main surfaces dark, removes invented marks, and restores reference-based art. Current hero motion is image parallax. Faithful interactive 3D remains an outstanding task pending the user's actual logo artwork; it is not marked complete by this revision.
