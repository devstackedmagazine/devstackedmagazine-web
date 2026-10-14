# Stone studio website

User authorized implementation after the in-chat design discussion. Build in this repository; local preview is the review target.

## Intent
Present devstackedmagazine as a studio building client websites, landing pages, systems and software; graphic design, social creative and motion graphics; AI integrations and calling agents. Give owned SaaS and client work equal prominence.

## Experience
Use the supplied visual reference: dark volcanic terrain, pale stone logo, lime fissures, mist and water. Scrolling exposes the lime core, assembles the stone pieces, then resolves into the complete logo before revealing two equally weighted paths: client work and own products. Ordinary scrolling, visible navigation, keyboard access, mobile layout, reduced-motion and WebGL fallback are required.

## Pages
Home, client work, products, services, pricing, studio, contact; individual illustrative project previews. No fabricated shipped products, customer names, testimonials or metrics. Clearly label concept work and demo products until real content arrives.

## Pricing and contact
Use scope-based offers, no invented amounts. Distinguish one-off website/system work, ongoing creative work, and AI usage/operating costs. Product pricing belongs to each product. Prepare a downloadable/copyable inquiry brief locally; no fake delivery success or invented email address.

## Assets and implementation
Brand: #F5F3EE paper, #171717 ink, #D7FF3F lime; self-host Onest. Reference symbol is the user's logo. Trace its distinctive contours into extruded geometry pending final clear assets. Generated empty landscape and basalt texture are documented in docs/assets.md. Native HTML/CSS/JS with Vite and Three.js; content separate from scene construction. Dark surfaces throughout.

## Verification
Production build; route and brief unit tests; browser checks of desktop, mobile, scroll sequence, navigation, pricing/service selection, contact validation, reduced motion and fallback. Commit meaningful milestones. Missing final logo, portfolio, SaaS names, amounts and contact delivery remain documented launch requirements.

## Visual review revision

User rejected white interiors, approximate marks, Inter, Archivo Black and the rendered podium. Current typography is Onest; all above-heading labels/dots are removed. Current logo is an extruded reference tracing with pale textured stone and a lime inset. No gateway/podium geometry. Lenis smooths scrolling, anchors and programmatic movement; page transitions and action easing share reduced-motion behavior. “Good ideas. Given form.” displays all concept projects in a horizontal scroll-driven rail, with native horizontal overflow on mobile/reduced motion and keyboard/arrow controls.

Performance revision: render on scroll/pointer input, stop when settled, suspend offscreen/hidden, and consume Lenis scroll without another easing pass. Limit drawing to 1.2 million pixels, simplify bevel tessellation/materials, and retain native touch inertia. Assembly is reversible; reduced motion always shows the complete mark.
