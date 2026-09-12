# HADAB — Website Experience Plan
### Interactive 3D Hero, Scroll Narrative & Full Site Structure

---

## 0. The Core Idea (one sentence)

The website itself is crocheted in front of the visitor: it opens on a single strand of thread, a hook loops it into the first stitch, the camera pulls back as the stitches multiply into the HADAB logo/a bag, and from that moment on, **the thread becomes the scrollbar** — a literal line the visitor follows down the page, stitching together categories, featured pieces, and discounts the same way HADAB stitches together a bag.

This isn't decoration. It's the brand's own thesis — *"small details, made by hand, add up to something whole"* — rendered as an actual mechanic the visitor participates in by scrolling. That's the psychological hook: we're not showing them a metaphor, we're making them perform it.

---

## 1. UX Psychology — why this works (and where the limits are)

A few principles I'm building the whole plan around:

- **Peak-end rule**: people remember the peak moment and the ending of an experience, not the average. The hero *is* the peak. It needs to be the most polished thing on the site, even if that means everything after it is comparatively simpler — over-investing everywhere dilutes the one moment that defines the brand in memory.
- **Progressive disclosure / curiosity gap**: the hero shouldn't explain itself. A needle, a thread, a loop — the visitor's brain fills the gap ("oh, it's making something") a half-second before we confirm it. That half-second of "getting it" is worth more than any label.
- **Locus of control**: scroll-jacking (fully removing the user's ability to scroll at their own pace) frustrates people fast, especially on repeat visits. The fix: the animation should be **scroll-linked, not scroll-blocked** — the user's own scroll gesture drives the thread, needle and camera 1:1 (or close to it), so it always feels responsive, never like it's playing *at* them.
- **First-visit vs. repeat-visit tax**: a first-time visitor should get the full cinematic hero. A returning visitor (or someone on a slow connection/low-power device) should get a fast, elegant, static-first fallback. Forcing a 6-second animation on someone's 10th visit is how brands turn a signature moment into an annoyance. (Handled in Section 6.)
- **Texture and material honesty**: because HADAB's whole value prop is "you can feel the handmade quality," the 3D thread must *read* as the actual yarn in the reference photo — thick, matte, slightly fibrous "trapillo"/t-shirt yarn, not a thin shiny shoelace. Getting the material wrong undermines the brand's credibility in the first three seconds.
- **Reduce choice paralysis on entry**: the homepage should present one clear next step at a time as you scroll (browse → this category, or this discount, or this featured piece), not everything at once. The thread physically guides the eye to one thing before the next.

---

## 2. The Opening 3D Cinematic — shot by shot

Target: **4–7 seconds** for a first-time visitor if they don't scroll, or fully scrubbable if they do. Rendered in a WebGL canvas (real-time 3D, not a pre-baked video) so it can react to scroll and pointer, in a style that *reads* as "4K cinematic" through lighting, depth of field, and macro texture work rather than literal 4K raster export (the web can't afford that bitrate — see Section 6 on performance).

**Shot 1 — Macro thread (0.0s–1.5s)**
A single strand of the marled charcoal-and-cream yarn (from the reference photo) fills the frame, softly lit, shallow depth of field, slowly rotating. Individual fiber strands are visible — this is the "wow, that's real cotton" beat. Background is out-of-focus HADAB cream (`#F2E8DD`).

**Shot 2 — The hook enters (1.5s–3.0s)**
A crochet hook (matte deep-brown `#4A382F` finish, matching the brand's primary color) enters frame and catches the thread. First loop is pulled through in slow motion — this is a satisfying, tactile "pop" moment, both visually and audibly (a soft, subtle sound cue, muted by default, user-toggleable).

**Shot 3 — Stitches multiply (3.0s–5.0s)**
Camera pulls back smoothly as loops chain into rows. The stitching accelerates (this is where we can compress time — real crochet is slow, the animation shouldn't be) until it resolves into a recognizable shape: **the HADAB double-loop logo mark** forming out of the stitches, in the brand's deep brown against cream.

**Shot 4 — Reveal & settle (5.0s–6.5s)**
Logo mark holds for a beat, the lowercase "hadab" wordmark fades in beneath it, thread trails off both ends of the frame — one end trailing up (off-screen, implying "it continues"), one trailing down, which becomes the literal scroll guide for the rest of the page.
Tagline fades in under the wordmark, in soft deep-brown, understated:
*"a word inspired by the little details."*

**Shot 5 — Handoff to scroll (6.5s onward)**
A minimal, low-opacity down-chevron or "scroll" affordance pulses once. The moment the user scrolls (or after ~2s idle, gently auto-nudges), the camera un-docks from the fixed cinematic sequence and the thread becomes scroll-bound: from here on, *scroll position = thread position*, not time.

**Direction notes:**
- Keep the camera move minimal and physically plausible (dolly + slight parallax), not showy/gimbal-heavy — HADAB's brand voice is "warm and unhurried," not flashy.
- Lighting: single soft warm key light (as if near a window), consistent with the reference photo's natural light. No hard studio lighting.
- No pure black or pure white anywhere, per brand guide — even shadows lean toward deep brown, highlights toward cream.

---

## 3. The Thread-as-Scrollbar Mechanic (post-hero)

Once the hero resolves, the thread doesn't disappear — it becomes a **persistent visual spine** running down (or subtly weaving side to side) through the page, implemented as a curved SVG/3D path that:

1. **Physically connects each homepage section** — it stitches into a small loop icon or knot at the entry point of each new section, echoing "another stitch, another part of the piece."
2. **Draws itself in as the user scrolls** — using scroll-linked progress (not time-based), so scrolling fast draws fast, scrolling back up "unstitches" it. This reinforces the locus-of-control principle above.
3. **Changes color per section** to match what it's introducing — e.g. it might pick up a strand of burgundy right before the discounted-items section, or sage green before a "sustainability/handmade process" section — visually foreshadowing what's coming, like a preview thread color swatch.
4. **Thins out and becomes a simple scroll-progress line** once the user is deep into the Shop page or product listings, so it supports navigation without constantly stealing focus (the hero is the peak moment; deeper pages should get out of the way and let product photography lead).

This is the connective tissue answering your "is there a section that's good to add for the animation" question — the honest answer is: **every homepage section transition** is a candidate, but each should get a *small* thread gesture (a stitch, a knot, a color pickup), not a repeat of the full hero-level spectacle. Repeating the big moment cheapens it (peak-end rule again).

---

## 4. Full Site Structure

### Pages

1. **Home**
2. **Shop** (all products, filterable)
   - **Category views** (Bags / Clothing / Accessories) — could be filters on Shop rather than separate URLs, recommend filters for a smaller catalog
3. **Product Detail Page** (per item)
4. **About** (brand story, the هَدَب meaning, process/craft)
5. **Cart / Checkout**
6. **Contact / Support** (can be a simple page or a footer-embedded form for a shop this size)
7. *(Optional, phase 2)* **Journal/Process** — behind-the-scenes of making pieces; strong for repeat engagement and SEO, and a natural home for more "process" storytelling (hands, hook, yarn) without overloading the homepage.

### Homepage — Section-by-Section

| # | Section | What happens | Why (psychology/UX) |
|---|---|---|---|
| 1 | **Hero (3D cinematic)** | Described in Section 2 | Peak moment; establishes brand identity and craft credibility instantly |
| 2 | **Brand line-in** | Thread stitches a short intro line into place, one phrase at a time (e.g. "Handmade." → "One stitch at a time." → "For your everyday.") | Short repeated exposure to brand promise; builds anticipation before showing product |
| 3 | **Featured Products** | Thread loops from item to item in a horizontal or staggered grid; each product "ties off" with a small knot icon as it settles into place; hover reveals a close-up texture shot (macro yarn detail) before the full product photo | Featured-first taps into the "recognition heuristic" — visitors trust what's presented as curated; macro-texture-on-hover keeps reinforcing the tactile/handmade promise even at listing level |
| 4 | **Shop by Category** | Three (or however many) category tiles — Bags, Clothing, Accessories — each backed by a soft, different secondary color (blush pink / burgundy / sage) as a subtle wash, thread stitching a divider between them | Categorization reduces choice overload; color-coding builds a light wayfinding system used again in Shop filters |
| 5 | **Discounted / Sale Items** | Thread picks up burgundy here (urgency color without resorting to loud red banners or countdown timers, which clash with brand voice); items presented calmly, price-strike-through, no aggressive "HURRY" copy | Scarcity/urgency principle, applied *gently* — consistent with brand's anti-hype tone from the brand skill |
| 6 | **Process / Craft strip** | Short looping video or 3D snippet: hands crocheting, close-up of a stitch forming — 10–15s ambient, muted, autoplay-safe | Builds trust and justifies price point by making the "handmade" claim visible, not just stated; also a natural checkpoint to re-establish the hero's craft feeling for anyone who scrolled past too fast |
| 7 | **Testimonials / UGC** *(if available)* | Simple, quiet — photos of real people with their HADAB pieces in everyday settings | Social proof; reinforces "becomes part of your everyday life" line from the brand story |
| 8 | **About teaser** | One or two lines from the brand story + the هَدَب meaning, "Read our story →" linking to About | Curiosity gap again — give enough to intrigue, not the whole story, driving intentional traffic to About |
| 9 | **Newsletter / stay in the loop** | Thread ties a final knot around the email input as a small illustrative flourish | Low-friction final CTA; knot visual reinforces "you're joining something ongoing" |
| 10 | **Footer** | Standard: nav, socials, contact, policies | — |

### Shop Page

- Filter/sort bar: Category, Price, Color (using actual yarn-color swatches, not generic color dots — reinforces material honesty), In Stock/Sale.
- Grid of products; thread reduced to a thin scroll-progress indicator along one edge, not a full animated spine (keep this page fast and browsing-focused).
- Hover state: swap primary photo for a macro texture detail shot (consistent micro-interaction from the homepage featured section).

### Product Detail Page

- Large imagery first (multiple angles + at least one macro/texture shot, ideally a short 360° spin if feasible).
- A small, tasteful nod to the 3D thread motif: e.g. a thin animated stitch-line under the price that "completes" once the item is added to cart — a satisfying micro-moment that also doubles as add-to-cart confirmation.
- Details: materials (yarn type/weight — visitors who loved the hero's macro thread shot will want this), dimensions, care instructions.
- "You may also like" — same category or same color family.

### About Page

- Leads with the برند story (paraphrased, warm, not corporate — per brand voice).
- A dedicated, slightly more elaborate 3D/scroll moment is *earned* here: e.g. scrolling reveals the هَدَب word forming letter by letter out of thread, with a plain-language translation beneath. This is the one place outside the homepage hero where investing in a richer animation pays off, because the About page is where visitors go specifically to seek meaning/story.
- Photos of the maker/process if available — real hands, real yarn, matching the reference photo's natural-light aesthetic.

---

## 5. Micro-interactions (small, everywhere)

- **Cursor**: on desktop, consider a custom cursor that looks like a small crochet hook when hovering over interactive elements — subtle, not gimmicky (opacity-light, small).
- **Add to cart**: a stitch "ties off" (small knot animation) rather than a generic checkmark.
- **Loading states**: instead of a generic spinner, a small animated loop of yarn being pulled through a hook — reinforces brand even in "dead time."
- **Page transitions**: a thread briefly "sews" across the screen edge-to-edge as a wipe transition between Home → Shop or Shop → Product, echoing the spine motif without needing the full 3D scene every time (can be a lightweight 2D SVG animation for performance).

---

## 6. Technical Plan (so this is actually buildable)

Given your stack decisions from earlier (**MERN + Vite + TypeScript**, `client` on Vercel, `server` on Render):

**3D layer**
- **React Three Fiber** (Three.js wrapper for React) + `@react-three/drei` for helpers — fits cleanly into the Vite/React `client`.
- Model the hook + a stylized yarn strand (spline-based tube geometry with a fibrous/matte fabric shader — not photoreal, stylized-cinematic, which is both more on-brand and far cheaper to render than photorealism) in Blender, export as `.glb`, load via `drei`'s `useGLTF`.
- Keep polycount and texture sizes modest; lean on lighting/DOF/post-processing (via `@react-three/postprocessing`) for the "cinematic" feel rather than raw geometric or texture detail.

**Scroll linkage**
- **GSAP + ScrollTrigger** (or Framer Motion's scroll utilities) to drive both the hero's shot progression and the thread-spine path drawing, keyed to scroll progress, not elapsed time — this is what keeps it feeling responsive rather than scroll-jacked.
- **Lenis** (or similar) for smooth-scroll easing site-wide, so the thread's motion feels fluid rather than jumpy on trackpads/mouse wheels.

**Performance & fallback strategy (important — don't skip this)**
- Detect: connection speed, device memory/GPU tier (`navigator.deviceMemory`, WebGL capability check), and `prefers-reduced-motion`.
- **First-time visitor, capable device**: full 3D cinematic hero.
- **Reduced-motion or low-power device**: swap to a beautifully art-directed static hero image (crop of the reference-photo aesthetic, thread/hook styled shot) with a much lighter CSS/SVG stitch-line animation instead of full WebGL — same story beats, cheaper execution.
- **Repeat visitor (cookie/localStorage flag)**: skip straight to a shortened 2–3s version, or straight to the settled logo state with just the trailing thread scroll-cue — respect their time.
- Lazy-load the 3D bundle (code-split so Shop/Product pages never pay the Three.js cost).

**Content/CMS consideration**
- Since Discounted and Featured products need to update regularly, make sure those homepage sections pull from the `server`'s product API (flags like `isFeatured`, `discountPercent`) rather than being hardcoded — keeps the cinematic front-end reusable as the catalog changes.

---

## 7. Build Priority (phased, so this is achievable)

1. **Phase 1 — Foundation**: Static site structure, all pages, product/shop functionality, cart/checkout working end-to-end with real data. No 3D yet — ship a solid, fast, on-brand site first.
2. **Phase 2 — Signature hero**: Build the 3D cinematic hero + thread-spine scroll mechanic on the homepage, with the performance fallback strategy from Section 6 from day one (not bolted on later).
3. **Phase 3 — Micro-interactions & About page moment**: Cursor, add-to-cart stitch, loading states, page transitions, and the About page's thread-typography moment.
4. **Phase 4 — Polish/measure**: Watch real analytics — scroll depth on homepage, bounce rate pre/post hero, whether the reduced-motion fallback is being served more than expected (a signal to lighten the main experience further).

---

## 8. Open Questions to Settle Before Build

- Do you have (or can commission) an actual 3D model/rig of a crochet hook + yarn, or should this be built from scratch in Blender as part of the project?
- Target device priority — is this primarily a mobile-shopped brand (Instagram-driven traffic, likely) or desktop-first? This changes how much of the full cinematic hero survives on mobile vs. a lighter mobile-specific version.
- Do you want sound as part of the hero (soft stitch/thread sounds), muted-by-default with a toggle, or fully silent?
- Catalog size at launch — this affects whether Shop needs robust filtering now or can stay simple initially.
