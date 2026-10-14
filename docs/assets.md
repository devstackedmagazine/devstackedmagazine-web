# Landscape asset

**File:** `public/assets/volcanic-valley.png`
**Created:** 2026-10-14 using the built-in imagegen tool.
**Reference:** User-supplied `ChatGPT Image Oct 14, 2026, 01_13_38 PM.png`, used for environment and mood. No text or logo from the reference is included in the background plate.

## Final prompt

Use case: stylized-concept. Asset type: background plate for a cinematic agency website with separately rendered WebGL foreground. Reference image: attached volcanic black-rock landscape with pale stone D monument and electric-lime fissures; use only its environment and mood as reference. Generate a photorealistic Unreal/Octane-quality volcanic valley at blue-black dusk. Wide panoramic landscape around 16:9. Jagged obsidian mountain peaks frame the outer left and right edges, a moody storm sky, subtle drifting low fog, still black water below with small electric lime #D7FF3F reflections near the center. At the center a low broad ancient basalt platform meets the water; completely empty above this platform, leaving a large clear dark area for a separately rendered 3D logo. The central platform is low, in the bottom third. Fine textured wet rocks in the foreground, enormous dark cliffs in the background, restrained lime fissures in the ground only, premium cinematic physically plausible materials. Center composition must have ample empty dark space from 20 to 70 percent image height for our own 3D monument. No logo, no letter, no symbol, no text, no UI, no people, no watermark. Deep charcoal, cold silver, lime highlights. Strong atmospheric depth. Maintain legible detail instead of crushing every shadow to black.

## Other assets

Concept project previews are native HTML/CSS compositions. Current logo uses the reference artwork on a plane. Gateway geometry and water reflections are rendered in Three.js; atmosphere is a CSS overlay. Fonts: Onest via Fontsource (OFL-1.1; license retained in the package).

## Reference-based hero revision — 2026-10-14

File: `public/assets/stone-monument.png`. Created with the built-in imagegen tool as an edit of the user-supplied reference. This is an interim raster plate; not final vector logo artwork or an interactive 3D model.

Final prompt:

Edit target: the attached agency reference image. Task: remove ALL typography and thin lime underlines in the left and right sides, and the small DEVSTACKED wordmark at top left. Inpaint only these text areas with matching dark volcanic landscape, mist and sky. Preserve the central stone D-shaped brand monument EXACTLY: its distinctive angular inner cuts, diagonal stone slash, luminous lime wedge, top curved stone edge, material, size, position and perspective. Do not redesign the logo or turn it into a generic letter D. Preserve the entire original dark volcanic environment, dramatic black rocky mountains, monumental vertical stone slabs, electric lime light, water reflections and cinematic lighting. Preserve central logo and its surroundings as closely to original pixels as possible. This is a clean image plate for a website, not a UI mockup. Keep the same wide cinematic aspect ratio. No text, no letters other than the original sculptural monument, no UI, no icons, no new objects, no watermarks. Changes limited to removing the left/right text and the tiny top-left wordmark.

Inter, IBM Plex Mono, Archivo Black, Manrope and invented SVG D marks were removed after review.

## Current typography — Onest

User rejected Archivo Black and selected clean, compact, bold type. Onest, self-hosted via Fontsource, is now the website's display and body family. The package declares OFL-1.1. Earlier typography notes are historical revisions.

The to3D conversion never started. User requested another effect; the site now renders a native stone gateway without a converted model.

## Basalt material — 2026-10-14

File: `public/assets/basalt-texture.png`. Generated with the built-in imagegen tool without a reference image. Used as color and bump texture on real stone geometry.

Final prompt:

Use case: product-mockup. Asset type: seamless tileable stone material texture for real-time WebGL rendering. Create a square, flat, front-facing surface scan of charcoal black volcanic basalt. Fine granular mineral grains, weathered hairline fissures, occasional tiny pits, a dense realistic natural stone texture. Dark graphite, black and cool grey only, no colored veins. Consistent even diffuse illumination across the entire surface, no cast shadows, no directional highlights, no reflections, no objects, no text, no borders. This is an albedo/bump texture tile: no perspective, no 3D scene composition, no landscape. Edges should tile seamlessly. Texture should read as premium dark sculptural stone at both macro and fine scale. Mid-dark grey detail that can be tinted darker in the renderer. Avoid broad swirling marble veins; basalt microtexture is the subject.
