# devstackedmagazine

Local agency website prototype. Current art direction: dark volcanic terrain, lime light, and clean, compact, bold Onest typography. Client services and owned SaaS receive equal prominence.

## Run

Node 22.12+.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Preview: http://127.0.0.1:5173. Build: `dist/`. Hosting must rewrite non-asset deep links to `index.html`.

## Current visual revision

The hero renders a real Three.js stone gateway: textured beveled slabs, lime seams, a stepped platform, floating fragments and planar water reflections. Scroll raises and separates the slabs, then moves the camera through the gateway. Pointer movement changes perspective. No conversion service is needed.

The central logo remains reference artwork on a feathered plane within the scene; it is not an extruded logo mesh. The background landscape is a raster plate. WebGL/texture failures restore the reference image. Manual and OS reduced-motion modes stop animation and shorten the hero.

All agency page surfaces are dark; light areas inside illustrative project previews belong to those example interfaces. Onest is self-hosted. The rejected Inter, IBM Plex Mono, Archivo Black and Manrope packages are removed.

## Files

- `src/main.js`: page composition, History API routing, navigation, filters and inquiry flow.
- `src/content.js`: illustrative projects, service groups, engagement offers, route resolution and brief validation.
- `src/scene.js`: scroll, pointer, motion preferences and static fallback controller.
- `src/terrain-scene.js`: disposable WebGL geometry, materials, lighting, artwork plane, camera and water reflections.
- `src/style.css`: responsive layout, typography, dark surfaces, mock interfaces and reduced-motion treatment.
- `public/assets/stone-monument.png`: text-free reference-based hero edit.
- `public/assets/volcanic-valley.png`: supporting landscape plate.
- `public/assets/basalt-texture.png`: generated stone material texture.
- `docs/assets.md`: asset provenance and prompts.

## Launch requirements

- Final clear logo asset; SVG/vector outline preferred when available. Current navigation uses a text wordmark, with a neutral lime-dot favicon.
- Optional final 3D logo reconstruction from approved artwork; current gateway effect is functional.
- Actual client projects and verified outcomes. Concept previews are labeled; no testimonials or client metrics are invented.
- Actual SaaS names, screenshots, availability, URLs and plan links.
- Final pricing. Current pricing explains scope and engagement models without invented amounts.
- Contact delivery. Current form prepares a copyable/downloadable brief; it **does not send an inquiry**. Drafts remain in memory across navigation, not refresh. No server stores the data.
- Deployment and target-device performance review.

## Verification

Node tests cover deep links, unknown routes and brief validation. Production build passes. Browser review checks live WebGL rendering, all three scroll stages, 1440/390 CSS-pixel framing, reduced-motion control and disposal/recreation across navigation. No console warnings/errors observed. Prior functional QA covered project filters, back navigation, safe plain-text brief rendering, draft retention and .txt download; the corresponding form logic is unchanged.

Motion can be reduced through the site control or OS preference. OS-level emulation is unavailable in this browser tooling. No analytics or runtime third-party requests are enabled.

Three.js loads only on the homepage. Vite reports a large-chunk advisory for that module (approximately 148 KB gzipped). Target-device performance remains a launch check. The abandoned GLB conversion scaffolding has been removed.
