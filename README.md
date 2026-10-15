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

The hero renders the reference-traced logo as actual extruded Three.js geometry: a split stone crown, diagonal stroke, lower outline and lime inset. Scroll exposes the lime core, then spreads the stone pieces more than twice as far before fading out. The camera pulls back to frame the wider separation. Scrolling backward reverses the sequence. Pointer movement adds a small tilt. The landscape remains a raster plate. Final vector artwork should replace the hand-traced contours when supplied.

Lenis 1.3.26 smooths wheel scrolling, anchors and back-to-top actions; touch scrolling uses native inertia, following its [official integration guidance](https://github.com/darkroomengineering/lenis). Native View Transitions animate routes with a Web Animations fallback. Controls, menus, filters, FAQ expansion and brief states share easing. Manual/OS reduced motion disables smoothing and nonessential animation. WebGL/texture failures retain a static reference image.

“Good ideas. Given form.” shows all four concepts in a horizontal reel. Desktop vertical scrolling moves a sticky project rail; mobile/reduced-motion views use native horizontal scrolling, with arrow and keyboard controls in both modes.

All agency page surfaces are dark; light areas inside illustrative project previews belong to those example interfaces. Onest is self-hosted. The rejected Inter, IBM Plex Mono, Archivo Black and Manrope packages are removed.

## Files

- `src/main.js`: page composition, History API routing, navigation, filters and inquiry flow.
- `src/content.js`: illustrative projects, service groups, engagement offers, route resolution and brief validation.
- `src/scene.js`: scroll, pointer, motion preferences and static fallback controller.
- `src/logo-scene.js`: reference contours, real extruded logo geometry, materials, lighting and camera.
- `src/logo-motion.js`: deconstruction choreography and drawing-resolution budget.
- `src/motion.js`: Lenis lifecycle, reduced-motion preference and action easing.
- `src/project-reel.js`: scroll-driven desktop rail and native horizontal fallback.
- `src/style.css`: responsive layout, typography, dark surfaces, mock interfaces and reduced-motion treatment.
- `public/assets/stone-monument.png`: text-free reference-based hero edit.
- `public/assets/volcanic-valley.png`: supporting landscape plate.
- `public/assets/basalt-texture.png`: generated stone material texture.
- `docs/assets.md`: asset provenance and prompts.

## Launch requirements

- Final clear logo asset; SVG/vector outline preferred when available. Current navigation uses a text wordmark, with a neutral lime-dot favicon.
- Final vector artwork to replace reference-traced logo contours; current logo has real 3D thickness.
- Actual client projects and verified outcomes. Concept previews are labeled; no testimonials or client metrics are invented.
- Actual SaaS names, screenshots, availability, URLs and plan links.
- Final pricing. Current pricing explains scope and engagement models without invented amounts.
- Contact delivery. Current form prepares a copyable/downloadable brief; it **does not send an inquiry**. Drafts remain in memory across navigation, not refresh. No server stores the data.
- Deployment and target-device performance review.

## Verification

Node tests cover deep links, unknown routes, brief validation, logo cutouts, finite extrusion geometry, assembly endpoints, static mode and render-resolution limits. Production build passes. Browser review checks live extruded-logo rendering, core reveal/assembly/completion, 1440/390 CSS-pixel framing, desktop/mobile project rail, keyboard/arrow controls, animated navigation, filters, anchor links, browser back, reduced-motion control and scene disposal/recreation. No console warnings/errors observed. Prior functional QA covered project filters, back navigation, safe plain-text brief rendering, draft retention and .txt download; the corresponding form logic is unchanged.

Motion can be reduced through the site control or OS preference. OS-level emulation is unavailable in this browser tooling. No analytics or runtime third-party requests are enabled.

Three.js loads only on the homepage. Vite reports a large-chunk advisory for that module (approximately 143 KB gzipped). Target-device performance remains a launch check. The abandoned GLB conversion scaffolding has been removed.

## 3D performance revision

Hover and focus states share easing in both directions. Buttons, header contact, filters and reel controls use a circular fill; the project orbit turns smoothly back on exit. Reduced motion disables these transitions. Logo motion tests sample the full forward scroll to prevent reassembly; static mode retains the complete mark.

Previous controller rendered continuously while idle, throttled updates to roughly 30–40 fps, and eased scroll a second time after Lenis. Current controller requests frames only for scroll/pointer changes, stops after pointer easing settles, and suspends work offscreen or in a hidden tab. It uses the already-smoothed scroll position directly; no artificial frame cap or idle floating motion remains. Background brightness stays constant and atmosphere has no blend-mode pass.

Drawing resolution is capped at 1.2 million pixels. Scene geometry uses 1,116 triangles (previously 2,588), with standard stone materials and no environment prefilter/clearcoat pass. At the 1440×900 browser check, drawing size dropped from 1713×1080 to 1379×869 (about 35% fewer pixels). DOM diagnostics on the scene mount expose submitted render count/state, active update rate and average CPU submission time; these are not GPU timing or a guaranteed presented-frame-rate measurement. Review on target devices remains appropriate.
