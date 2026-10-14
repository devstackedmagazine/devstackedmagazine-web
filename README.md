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

The initial procedural Three.js monument and improvised D marks were rejected. They have been removed. The hero now uses a text-free edit of the supplied reference image with subtle pointer/scroll parallax, atmospheric overlay, and a transition into the page. **This is image-based art direction, not a finished interactive 3D scene.**

The next 3D pass must reconstruct the actual logo from the user's clear artwork and use properly textured terrain, materials, lighting and camera movement. Do not reintroduce a generic D or claim that scaling this image is a physical camera passage.

All agency page surfaces are dark; light areas inside illustrative project previews belong to those example interfaces. Onest is self-hosted. The rejected Inter, IBM Plex Mono, Archivo Black and Manrope packages are removed.

## Files

- `src/main.js`: page composition, History API routing, navigation, filters and inquiry flow.
- `src/content.js`: illustrative projects, service groups, engagement offers, route resolution and brief validation.
- `src/scene.js`: image-based parallax controller and motion settings; no WebGL model.
- `src/model-scene.js`: Three.js GLB renderer, waiting for the actual converted asset.
- `src/model-config.js`: generated model URL, currently null while conversion is pending.
- `src/style.css`: responsive layout, typography, dark surfaces, mock interfaces and reduced-motion treatment.
- `public/assets/stone-monument.png`: text-free reference-based hero edit.
- `public/assets/volcanic-valley.png`: supporting landscape plate.
- `docs/assets.md`: asset provenance and prompts.

## Launch requirements

- Final clear logo asset; SVG/vector outline preferred when available. Current navigation uses a text wordmark, with a neutral lime-dot favicon.
- Faithful 3D monument/terrain reconstruction from approved artwork.
- Actual client projects and verified outcomes. Concept previews are labeled; no testimonials or client metrics are invented.
- Actual SaaS names, screenshots, availability, URLs and plan links.
- Final pricing. Current pricing explains scope and engagement models without invented amounts.
- Contact delivery. Current form prepares a copyable/downloadable brief; it **does not send an inquiry**. Drafts remain in memory across navigation, not refresh. No server stores the data.
- Deployment and target-device performance review.

## Verification

Node tests cover deep links, unknown routes and brief validation. Production build passes. Browser review of the visual revision checks font loading, dark main page surfaces, 390/325 CSS-pixel layouts and menu behavior. Prior functional QA covered project filters, back navigation, safe plain-text brief rendering, draft retention and .txt download; the corresponding form logic is unchanged.

Motion can be reduced through the site control or OS preference. OS-level emulation is unavailable in this browser tooling. No analytics or runtime third-party requests are enabled.

## to3D and typography follow-up

User selected a clean, compact, bold font direction: Onest now replaces Archivo Black and Manrope. User explicitly requested the to3D plugin. Its native upload widget is open, but no image has been selected yet and no generation job has started. The widget exposes a local file picker that the available MCP Apps browser interface cannot automate.

`src/model-scene.js` provides a real Three.js GLTFLoader renderer with textured asset lighting, camera movement and disposal. `src/model-config.js` keeps `modelUrl` null until an actual generated asset is saved and inspected. The hero remains the reference image until then. Builds verify imports and syntax; successful GLB loading and visual quality remain untested pending the generated model. No procedural replacement logo is used.

Conversion input is `public/assets/stone-monument.png`. After conversion, download the GLB to `public/assets/models/monument.glb`, inspect its geometry and texture, set the model URL, then check orientation, camera framing, mobile view and disposal in the browser.
