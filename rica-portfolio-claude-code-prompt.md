# Claude Code build brief — rica's portfolio

Send these **one phase at a time**. Wait for each phase to finish and look at the result
before sending the next. Don't paste the whole file in one go.

Before Phase 0: unzip `rica-portfolio-assets.zip` somewhere. It contains
`public/assets/` (82 WebP images), `src/data/manifest.json` and `src/data/content.json`.

---

## PHASE 0 — Context (paste this first, on its own)

```
I'm building a personal portfolio site for a graphic designer named Ricardo Jose Gagno,
who goes by "rica". This is a DESIGN portfolio, not a developer portfolio — the site
itself has to look like a piece of graphic design, not a template.

Stack: Vite + React + TypeScript + Tailwind CSS + GSAP (with ScrollTrigger) + Lenis
for smooth scroll. No Next.js, no CMS, no backend. Static site, deploys to Netlify.

I have an asset pack ready. Do not generate placeholder images or lorem ipsum — every
image and every line of copy already exists:

- public/assets/**  — 82 WebP images, organized into groups
- src/data/manifest.json — for each image: src, alt, width, height, ratio, and a tiny
  base64 blur placeholder (lqip). Grouped by folder key, e.g. "works/posters".
- src/data/content.json — all the real copy: about text, org history, education,
  skills, section labels, contact details.

ART DIRECTION — read carefully, this is the whole point of the project:

- Palette: pure grayscale for everything, PLUS one accent color. Accent is a hot
  signal red (#E63329). Accent is used sparingly and deliberately — cursor, active
  nav state, section counters, a tape/sticker edge, the scroll progress bar, and
  hover reveals. Never more than ~5% of any viewport.
- All artwork images render desaturated (filter: grayscale(1)) by default and
  animate back to full color on hover or when pinned/focused. This is the main
  interaction reward — the color IS the accent moment.
- The source photos are grainy, high-flash night photography. Lean into that: a
  persistent film grain overlay, subtle vignetting, slight chromatic edges.
- Typography is doing the heavy lifting. Three faces:
  * Display: a heavy condensed grotesk for huge slab headings (PORTFOLIO, PUBMATS,
    POSTERS). Use Anton or Archivo Black. Headings run oversized, tight leading,
    often bleeding past the viewport edge.
  * Body: a neutral grotesk — Inter or Archivo — lowercase, small, tight.
  * Annotation: a handwriting face — Caveat or Gloria Hallelujah — for margin notes,
    arrows, and scribbled labels.
- Layout mixes two references in roughly equal measure:
  * SCRAPBOOK: taped polaroids, sticky notes, slight random rotations (-3° to 3°),
    torn paper edges, hand-drawn arrows and circles, pushpins, a faint graph-paper
    or ruled-notebook background texture.
  * EDITORIAL: full-bleed image grids, enormous slab headings, hard black/white
    blocks, ruled hairlines, numbered section markers (01 / 02 / 03), asymmetric
    two-column splits.
  The rule: editorial gives the page its structure; scrapbook gives it personality.
  A section is editorial in skeleton and scrapbook in the details.
- Avoid the AI-design defaults entirely: no glassmorphism, no purple/blue gradients,
  no rounded-2xl card grids, no generic hero-with-centered-CTA, no soft drop shadows
  on everything.

For this phase, do nothing but confirm you've understood the stack and the art
direction, and tell me the section order you'll build in. Don't write code yet.
```

---

## PHASE 1 — Scaffold and design tokens

```
Scaffold the project.

1. Vite + React + TypeScript. Install: tailwindcss, gsap, lenis, clsx.
2. Copy my asset pack in: public/assets/** and src/data/*.json. Type the JSON with
   interfaces in src/types.ts (ImageAsset, AssetManifest, Content).
3. Set up Tailwind with a custom theme in tailwind.config.js:
   - colors: ink (#0A0A0A), paper (#F4F2ED), and a 9-step gray scale, plus
     accent (#E63329) with accent-dim for pressed states. No other colors exist.
   - fontFamily: display / body / hand, wired to the Google Fonts above, loaded
     with preconnect and font-display:swap.
   - fontSize: add clamp()-based fluid steps — display-xl should hit ~18vw on
     desktop and stay legible on mobile.
   - extend with a `grain` background utility and a `tape` utility.
4. Global CSS:
   - A fixed full-viewport film-grain overlay (SVG feTurbulence, animated at low
     opacity, pointer-events:none, z-index above content but below the cursor).
   - A subtle ruled-paper texture on light sections, CSS gradients only, no image.
   - Set `filter: grayscale(1)` as the default state on a `.artwork` class with a
     transition to grayscale(0).
5. Set up Lenis smooth scroll in a hook (src/hooks/useLenis.ts) and wire it to
   GSAP's ticker so ScrollTrigger and Lenis share one scroll loop. This matters —
   do not run them independently.
6. Add a `usePrefersReducedMotion` hook. Every animation you write from Phase 3
   onward must check it.
7. Build a src/components/Image.tsx that takes a manifest entry and renders the
   image with: width/height from the manifest to reserve layout space, loading="lazy",
   decoding="async", the lqip as a blurred background that cross-fades out on load,
   and the `.artwork` grayscale class.

Show me the running dev server with a blank page using the tokens before moving on.
```

---

## PHASE 2 — Page shell, nav, and section skeleton

```
Build the page shell.

1. App.tsx renders sections in this order, each a separate component in
   src/sections/: Hero, Contents, About, Background, Education, Skills, WorksIntro,
   Magazine, Photography, PubmatsCassayuran, PubmatsKapilas, PubmatsOrions,
   Posters, Vlogs, Contact.
2. A persistent fixed header: "RICA." in the top-left at small size, uppercase,
   letterspaced — this echoes the original portfolio where "RICA." repeats on every
   page. On the right, a section counter that updates on scroll (01 / 14).
3. A fixed 2px scroll-progress bar in accent red along the left edge of the viewport.
4. A custom cursor: a small accent-red ring that scales up and inverts over images
   and links, with a 0.15s lag (lerp toward the mouse position, not instant).
   Disable it entirely on touch devices and under prefers-reduced-motion.
5. Nav: no traditional navbar. Instead the Contents section (section 02) is the nav —
   the list from content.json, rendered as oversized handwritten-annotated links that
   smooth-scroll to their sections via Lenis. Add a small persistent dot-menu in the
   bottom-right that expands to the same list.
6. Every section gets an id matching content.json's nav hrefs, plus a data-section
   attribute so ScrollTrigger can track which one is active.

No animation yet beyond the cursor and progress bar. Just get the skeleton scrolling.
```

---

## PHASE 3 — The parallax and motion system

```
Now the motion. This is the core of the project — spend time here.

Build src/lib/motion.ts exporting reusable ScrollTrigger recipes, then apply them.
Every one must no-op when prefers-reduced-motion is set (elements render in their
final state, no transforms).

RECIPES:

1. parallaxLayer(el, speed) — translateY tied to scroll progress. Background images
   move at 0.6x scroll speed, mid-ground at 0.85x, foreground text at 1.15x. Use
   yPercent, not top/margin, and set will-change: transform. Scrub: 1 (not true) so
   there's a touch of easing lag.

2. pinnedReveal(section) — pins a section while its inner content advances. Use for
   the Hero and each Pubmats section.

3. maskReveal(el) — image enters behind a clip-path inset that opens from one edge,
   paired with a slight scale from 1.08 → 1. Stagger 0.08s when several are in a grid.

4. splitHeading(el) — split the big display headings per-character, each character
   rising from 110% with an overflow-hidden parent, staggered 0.02s. Use for
   PORTFOLIO, ABOUT ME, MY WORKS, PUBMATS, POSTERS, LET'S WORK.

5. velocityMarquee(el) — an infinite horizontal marquee whose base speed is constant
   but whose direction flips with scroll direction and whose speed scales with scroll
   velocity. THIS IS THE SIGNATURE MOVE — the original portfolio repeats
   "PUBMATS PUBMATS PUBMATS" running off both edges of the page, so make that strip
   literally react to how fast the user scrolls.

6. scrapbookDrift(el) — taped/polaroid elements drift a few pixels and rotate ±1.5°
   as they pass through the viewport, at slightly different rates per element, so the
   collage feels physically loose rather than pasted flat.

7. colorPop(el) — grayscale(1) → grayscale(0) as an element crosses the middle 40%
   of the viewport, so artwork blooms into color in the reading zone and drains again
   at the edges. Tie it to the accent-red section marker lighting up at the same time.

GLOBAL RULES:
- One ScrollTrigger.refresh() after all images report loaded, or pin positions will
  be wrong.
- Kill every trigger in the component's cleanup function.
- Never animate width/height/top/left. transform and opacity only.
- Under 60fps is a bug — if a section drops frames, reduce the number of
  simultaneously animating elements before reaching for will-change.
```

---

## PHASE 4 — Hero, Contents, About, Background, Education, Skills

```
Build the opening six sections using content.json and manifest.json. No invented copy.

HERO (section 01)
- Full viewport. assets/hero/hero-portrait.webp as a parallax background at 0.6x,
  grayscale, heavy vignette, grain on top.
- "portfolio" in display face at ~18vw, white, sitting across the portrait, with
  "by rica" small and lowercase tucked under its right shoulder. splitHeading on load.
- Pin the hero for ~80vh of scroll while the portrait scales 1 → 1.12 and the
  heading drifts up faster than the image.
- A small handwritten "scroll ↓" annotation in the bottom-left that fades on first scroll.

CONTENTS (section 02)
- Hard split: assets/hero/gate-mirror-night.webp full-bleed on the left half,
  paper-white on the right.
- "table of / contents" right-aligned, display face, "contents" much larger than
  "table of" — exactly like the original.
- The six nav items in a tight lowercase stack, each with a hand-drawn arrow that
  draws itself in on hover (animate an SVG stroke-dashoffset) and turns accent red.

ABOUT (section 03)
- assets/portraits/about-crawl.webp full-bleed with "about me" reversed out over it
  in the display face, mixed-weight like the original ("a" light, "bout" italic).
- Below, on paper: the about paragraph from content.json, centered, narrow measure,
  with "RICARDO JOSE GAGNO" highlighted with an accent-red marker swipe (animate an
  ::after that wipes left-to-right when it enters).
- Tape a polaroid of assets/portraits/background-wall.webp into the left margin,
  rotated -2°, with scrapbookDrift.

BACKGROUND (section 04)
- Two-column: taped portrait left, org list right.
- Each of the 5 orgs from content.json as a block: name bold, years in accent red,
  roles as a bulleted list with a star glyph. Stagger them in with maskReveal.
- "background" as an oversized display heading BELOW the list, bleeding off the
  right edge, moving at 1.15x parallax.

EDUCATION (section 05)
- Minimal and generous. "education" centered in display italic, the school, years,
  and degree in small type far below it — lots of empty paper, like the original.
- Then a full-bleed parallax band of assets/portraits/education-bushes.webp.

SKILLS (section 06)
- Paper panel on the left, assets/portraits/skills-fullbody.webp on the right at
  0.85x parallax.
- "technical skills:" heading, then the three groups from content.json. Each skill
  is a solid black chip with white text — matching the original's black label look.
  Chips flip in with a 3D rotateX stagger on enter, and invert to accent red on hover.
```

---

## PHASE 5 — The works sections

```
Build the works. This is the bulk of the site — 76 images across 7 sections.

WORKS INTRO
- assets/portraits/works-walking.webp full-bleed, "my / works" reversed out,
  pinned while the image scales. Same treatment family as the hero so it reads as
  a chapter break.

MAGAZINE
- Feature layout: the flipbook cover centered-left, tilted -1.5°, with a heavy
  paper shadow and a hand-drawn "<<< click here" annotation pointing at it.
- "MAGAZINE" in display at ~9vw on the right. If content.json's link is empty,
  render it as a non-clickable card and leave a TODO comment.

PHOTOGRAPHY — 8 images, TWO sections alternating sides
- Section A: 4 images in an irregular 2x2 where the tiles have different aspect
  ratios (read them from manifest), heading "PHOTO / GRAPHY" on the right.
- Section B: same idea mirrored, heading on the left.
- maskReveal with stagger, colorPop on each, and a slight parallax offset per tile
  so the grid breathes rather than moving as one block.

PUBMATS — three sections (cassayuran 23, kapilas-bayan 12, orions 12)
- Each: a horizontal scrolling strip of the pubmats, two rows, the rows drifting in
  OPPOSITE directions as you scroll (this is where the parallax reads hardest).
- Under the strip, the velocityMarquee: "PUBMATS PUBMATS PUBMATS" in display at
  ~8vw, clipped by the viewport so the words run off both edges, with the org name
  as a tiny uppercase credit tucked above it.
- Clicking any pubmat opens a lightweight lightbox: full-color (grayscale removed),
  keyboard navigable, Esc to close, focus trapped, scroll locked via Lenis.stop().

POSTERS — 12 images
- Collage, not a grid. Overlapping, varied sizes, rotations from -4° to 4°, some
  taped, some pinned, z-index layered. "POSTERS" reversed out in white, large,
  sitting ON TOP of the collage with mix-blend-mode: difference — exactly like the
  original where the word overlaps the artwork.
- scrapbookDrift on every poster at different rates. Hover lifts a poster to the
  front, straightens it to 0°, and pops it to full color.

VLOGS — 6 thumbnails
- Render CSS phone frames (rounded rect, notch, bezel — do NOT use an image for the
  frame) with the thumbnails inside, scattered at different depths and rotations.
- Two sections like the original: "YOUTUBE / VLOGS" bottom-right in one, top-left
  in the other, with the credit line from content.json in small type above.
- Phones parallax at different speeds so the scatter feels three-dimensional.
```

---

## PHASE 6 — Contact and close

```
CONTACT
- Full-bleed assets/portraits/contact-portrait.webp, dark, grain heavy.
- "let's / work" reversed out bottom-left in display face, huge.
- "contact:" and the three items from content.json bottom-right, small, in a tight
  label/value stack. Each is a real link (mailto, instagram, tel). Hover draws an
  accent-red underline left-to-right and turns the label red.
- A final handwritten annotation near the portrait, rotated slightly.
- Footer hairline: "© 2026 ricardo jose gagno" and "designed & built by rica" in
  tiny lowercase.
```

---

## PHASE 7 — Performance, accessibility, polish

```
Final pass. Report back with the numbers, don't just say it's done.

PERFORMANCE
- Verify every image has width/height from the manifest so CLS is ~0.
- Lazy-load everything below the fold; preload only the hero portrait.
- Confirm total transferred weight on first load is under 2 MB.
- Profile scroll in DevTools. Any section under 60fps gets fixed — reduce concurrent
  animations first, will-change only as a last resort.
- Run a production build and report the bundle size.

ACCESSIBILITY
- Every image uses its alt text from the manifest. Decorative ones get alt="".
- Full keyboard path: nav links, lightbox open/close/next/prev, all contact links.
  Visible focus rings in accent red.
- Check contrast on every text-over-image block. Add a scrim where it fails.
- prefers-reduced-motion: all parallax, marquee, drift, and cursor lag disabled;
  content renders in final position; color-pop becomes a static full-color state.
- Respects prefers-color-scheme? No — this site is intentionally one fixed look.
  Set color-scheme: only light and a meta theme-color.

RESPONSIVE
- Mobile (<768px): parallax depths halved, pins released, marquee speed reduced,
  collage sections become single-column stacks that keep the rotation but lose the
  overlap. Custom cursor off. Test that no section scrolls horizontally by accident.
- Check 375px, 768px, 1280px, 1920px.

SEO / SHARE
- Real <title> and meta description from content.json.
- Open Graph image: generate one from the hero portrait with the wordmark on it.
- A favicon built from the "R" in the display face.

Then give me a one-page summary: bundle size, first-load weight, Lighthouse scores
for performance and accessibility, and a list of anything you had to compromise on.
```

---

## Things to check yourself before you ship

- **Verify the copy.** The original SVG had all text outlined to paths, so every line
  in `content.json` was transcribed by eye. Check the org names, the year ranges, the
  degree title, and especially the contact details.
- **The magazine link is empty.** Add the real Heyzine flipbook URL to
  `content.json → works.sections[0].link`.
- **Vlog links.** The thumbnails aren't clickable yet — add YouTube URLs if you want
  them to open.
- **Fonts.** Anton/Archivo Black/Caveat are placeholders that match the vibe. If you
  know the actual faces you used in Canva, swap them in `tailwind.config.js` — one
  line, everything else follows.
