# devstackedmagazine

Local agency website prototype: a cinematic volcanic landscape, a Three.js stone monument, scroll-driven camera approach/terrain awakening/logo passage, and equal client/product destinations.

## Run

Node 22.12+ (or a supported newer version).

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Dev preview: http://127.0.0.1:5173. Built files: `dist/`. Production hosting must rewrite non-asset paths to `index.html` for deep links.

## Structure

- `src/main.js`: History API routing, page composition, navigation, filters and inquiry flow.
- `src/content.js`: project concepts, service groups, scope-based offers, route resolution and brief validation.
- `src/scene.js`: disposable Three.js scene, procedural stone textures, temporary logo geometry, slabs, water and scroll choreography.
- `src/style.css`: responsive design, page layouts, interface concepts, reduced-motion treatment.
- `public/assets/volcanic-valley.png`: generated background plate, stored locally. Generation prompt and provenance in `docs/assets.md`.

Fonts are self-hosted via Fontsource. No analytics or runtime third-party calls are enabled. Three.js is loaded only on the homepage; the scene pauses rendering offscreen and when hidden, caps pixel ratio and rendering frequency, and disposes GPU resources on navigation. The scene's compressed JS chunk is approximately 144 kB; Vite reports a 500 kB uncompressed chunk warning for Three.js.

## Content and launch requirements

- Supply the final clear logo artwork. The monument and small marks are temporary tracings from the supplied reference, not final artwork. Replace `logoShape()`/`diagonalShape()` in `src/scene.js` and the SVG marks in `src/main.js`/`public/favicon.svg` with approved outlines. A vector outline or GLB will preserve the 3D camera passage better than a flat PNG.
- Replace concept studies with real client projects and verified outcomes. All illustrative work is explicitly labeled; no testimonials, client claims, or business metrics are invented.
- Replace product concepts with actual SaaS names, screenshots, availability, URLs, and plan links.
- Finalize scope and actual pricing; current offers explain engagement models without made-up amounts.
- Provide actual studio details and imagery if desired. Location and team size were not inferred from the reference image.
- Connect contact delivery to an approved email/form service. Current form validates and prepares a copyable/downloadable brief; it **does not send an inquiry**. Drafts persist in memory across local navigation, not after refresh, and are not stored on a server.
- Keep the generated landscape as art direction or replace it with final art. The camera travels through real geometry layered over the plate; the distant mountains are image-based rather than a complete 3D environment.

## Verification

Node tests cover known/unknown deep links and brief validation. Browser QA covered desktop (1440 CSS px) and mobile (390 CSS px plus narrow 325 CSS px), all main page layouts, mobile menu, portfolio filters, navigation/back, scene disposal, terrain awakening and logo passage, input validation, safe plain-text rendering, draft retention and text download. Runtime warning/error logs were empty in the tested browser.

Reduced-motion preferences and WebGL failure handling are implemented. Manual static-mode switching is browser-tested; OS-level reduced-motion emulation and forced context loss were not available in the browser tooling and were not tested. Target-device GPU/performance testing remains necessary before launch.

The design and compact implementation plan are in `docs/superpowers/`.
