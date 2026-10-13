# devstackedmagazine — visual brand guide

Status: Draft visual direction. Only the naming rule is confirmed; all other guidance below is proposed until approved.

## Direction

An editorial identity for a company building websites, publishing content, and developing SaaS products. Use strong typography, generous space, visible structure, and one sharp accent. Aim for clear, considered, and technically capable.

The name suggests a magazine; use that as a visual cue, without implying that publishing is the company's only business.

## Name and wordmark

Proposed treatment:

- Set the wordmark as live text in the primary sans-serif, weight 700.
- Keep it on one line. Never stretch, outline, rotate, or add effects.
- Use ink on paper or paper on ink. Keep the accent for supporting elements.
- Reserve clear space of at least one lowercase letter height on every side.
- Increase its size until every letter remains readable at the final display size.
- Use a separate descriptor when needed; keep it outside the wordmark's clear space.

Custom logo artwork, compact marks, and minimum sizes remain open until tested with final assets.

## Color

| Role | Color | Hex | Use |
| --- | --- | --- | --- |
| Paper | Warm white | `#F5F3EE` | Main backgrounds, light text on ink |
| Ink | Near black | `#171717` | Main text, dark backgrounds, wordmark |
| Accent | Electric lime | `#D7FF3F` | Primary actions, selected details, highlights |
| Secondary text | Gray | `#62625C` | Supporting text on paper |
| Rule | Light gray | `#D8D6CE` | Dividers and decorative boundaries on paper |

Keep most surfaces paper or ink. Use lime sparingly so it retains emphasis. Put ink text on lime; avoid lime text on paper. Treat rule gray as decorative, not as the sole boundary of a form control.

Error, success, and warning colors belong to each product's accessible interface system. Do not use the brand accent to communicate every status.

## Typography

| Role | Proposed family | Treatment |
| --- | --- | --- |
| Wordmark, headings, body | Inter | 400 body, 500 labels, 600–700 headings |
| Code and technical annotations | IBM Plex Mono | 400–500; use sparingly |
| Sans fallback | `system-ui, sans-serif` | Use when Inter is unavailable |
| Mono fallback | `ui-monospace, monospace` | Use when IBM Plex Mono is unavailable |

- Web body text: 16–18 px, line height 1.5–1.65.
- Long-form reading width: roughly 60–75 characters.
- Headlines: compact, sentence case, line height 1.05–1.2. Scale to fit the medium without clipping.
- Labels: short and legible; uppercase only for brief section markers.
- Avoid thin weights, extended all-caps paragraphs, and decorative type effects.
- Keep the exact brand name lowercase; ordinary copy uses normal capitalization.

Font selection is provisional. Verify licensing and language coverage before production use.

## Layout and spacing

- Start from an 8 px spacing rhythm; use 4 px for small optical adjustments.
- Use consistent outer margins and align titles, text, and media to shared edges.
- Prefer an editorial grid: a dominant headline, supporting copy, and one focal image or product view.
- Use thin rules and whitespace to separate content. Add a container only when it clarifies grouping or interaction.
- Keep corners restrained: 0–8 px for panels and controls; larger rounding only for a clear functional reason.
- Build mobile layouts around reading order. Stack columns and preserve comfortable margins.
- Give each composition one obvious entry point and one primary action when an action is needed.

## Images and illustration

Use real work: website captures, product screens, process details, and original photography. Crop deliberately and preserve the information being discussed.

- Show interfaces at readable sizes; use detail crops when a full screen becomes too small.
- Use neutral surroundings and natural lighting for photography.
- Build illustrations from simple lines, grids, blocks, and diagrams that explain a specific idea.
- Use lime for annotations or one focal detail, not a tint over every image.
- Label conceptual mockups when they could be mistaken for shipped work.
- Avoid generic stock imagery, arbitrary 3D objects, and decorative code with no connection to the subject.

## Icons and interface details

Use one consistent icon family per surface, with matching stroke weight and optical size. Pair unfamiliar icons with text. Reserve filled shapes for emphasis or state changes.

Buttons need a clear label, visible hover and focus states, and sufficient contrast. A lime primary button uses ink text; secondary actions can use an ink outline on paper. Preserve familiar control behavior.

## Motion

Use motion to explain hierarchy, navigation, or state changes.

- Interface transitions: usually 150–250 ms with gentle easing.
- Prefer opacity and small position changes; keep reading content stable.
- Marketing motion can be more expressive when it serves the story.
- Respect reduced-motion preferences. Provide a static alternative to nonessential movement.
- Avoid constant bouncing, scroll hijacking, and effects that delay access to content.

## Social and presentation graphics

Lead with one idea per frame. Use a strong headline, a useful visual, and a small consistent brand signature. Keep text inside the platform's safe area and check readability at phone size.

Carousels follow a clear sequence: opening idea, supporting evidence or steps, then a useful takeaway. Product and website work should retain its own visual identity inside the surrounding brand layout.

## Production checks

- Check normal text contrast at 4.5:1 or better; large text at 3:1 or better.
- Check meaningful control boundaries, icons, and focus indicators against adjacent colors at 3:1 or better.
- Never communicate meaning through color alone.
- Supply useful alt text for informative images and captions for spoken video.
- Review mobile reading order, text wrapping, keyboard focus, and reduced motion where applicable.
- Inspect graphics at their actual delivery size before export.
- Store source artwork and exports in their dedicated media or design locations; link them from this handbook.

## Decisions still needed

Approve or revise the palette, fonts, and editorial direction. Then define final wordmark artwork, small-size variants, export specifications, and asset links. Once approved, update this document's status; keep visual rules here as the single source of truth.
