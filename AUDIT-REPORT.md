# Precasterz Website — Full Audit Report

Date: 2026-05-29 · Scope: all HTML, CSS, JS, config, content, and deployment files. No changes applied — this is audit-only.

---

## Project structure (confirmed inventory)

```
Precasterz/
├─ index.html                       (home)
├─ services.html                    (services overview)
├─ about.html
├─ careers.html
├─ contact.html
├─ Achievements.html
├─ README.md  LICENSE  BingSiteAuth.xml
├─ Catalog.pdf  HollowCoreSlab-Catalog.pdf  HollowCoreSlab-Manual.pdf
├─ .github/workflows/static.yml     (GitHub Pages deploy)
├─ assets/
│  ├─ css/  main.css  noscript.css  photo-slider.css  fontawesome-all.min.css
│  ├─ js/   main.js  util.js  email-form.js  photo-slider.js
│  │        jquery.min.js  jquery.scrollex.min.js  jquery.scrolly.min.js
│  │        breakpoints.min.js  browser.min.js
│  ├─ sass/ (source SCSS for main.css)
│  └─ webfonts/ (Font Awesome eot/svg/ttf/woff/woff2)
├─ images/   logo, hero, page images, favicon_io/ (icons + site.webmanifest)
└─ services/
   ├─ Detailed-Design.html              → Detailed-Design/Lifting.html
   ├─ Engineering-automation.html       → Engineering-Automation/
   │     ├─ Bills-of-Quantities.html
   │     ├─ ETABS-Load-Combination.html
   │     ├─ Concise-Beam-Autoprinter.html
   │     └─ HollowCoreSlab.html
   ├─ shop-drawings.html                → shop-drawings/
   │     ├─ manholes.html
   │     └─ foundation.html
   ├─ proposal/   (EMPTY — no files)
   └─ images/     (service images, LIFTING/, Conciser.mp4)
```

15 HTML pages total. The 4 Engineering-Automation detail pages are the highest-quality, most consistent pages; the root pages and the older service pages carry most of the defects.

---

## CRITICAL

### C1 — Contact form is broken on 4 pages (throws a JS error, never submits)
- **Files:** `services/Engineering-Automation/Bills-of-Quantities.html`, `ETABS-Load-Combination.html`, `Concise-Beam-Autoprinter.html`, `HollowCoreSlab.html` (they all load `email-form.js` but contain **no** `#error` element); root cause is `assets/js/email-form.js:16`
- **What's wrong:** `email-form.js` runs `error.style.display = 'none'` on every submit. On these 4 pages `document.getElementById('error')` returns `null`, so the line throws `TypeError` before `form.submit()` runs — the form silently fails for every visitor.
- **Fix (single fix in `assets/js/email-form.js`, makes it null-safe for all pages):**
```js
const form = document.getElementById('emailForm');
const emailInput = document.getElementById('email');
const error = document.getElementById('error');

if (form && emailInput) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      if (error) error.style.display = 'block';
      return;
    }

    if (error) error.style.display = 'none';
    form.submit();
  });
}
```

### C2 — Unclosed `</a>` in heading
- **File/line:** `index.html:125`
- **What's wrong:** `<h2><a href="Achievements.html">Achievements</h2>` — the anchor is never closed; the rest of the article gets absorbed into the link in some parsers.
- **Fix:**
```html
<h2><a href="Achievements.html">Achievements</a></h2>
```

### C3 — Duplicate `id="main"` (invalid; breaks JS targeting)
- **Files/lines:** `index.html:102` & `116`; `services.html:62` & `76`; `Achievements.html:62` & `76`
- **What's wrong:** Two elements share `id="main"`. IDs must be unique. `main.js` uses `$('#main')`, which matches only the **first** `#main`, so the intro-scroll/parallax behavior targets the wrong (empty) container. Closing/opening tags here are also unbalanced.
- **Fix:** Remove the duplicate `<!-- Main --> <div id="main">` block (the second opener) and the stray extra `</div>`, keeping a single `#main` wrapper around all content. e.g. in `index.html` delete lines 114–116 (`</div>` + comment + second `<div id="main">`) so the section content stays inside the one `#main`, and remove the matching extra `</div>` at line 177/183.

### C4 — Slideshow crashes after slide 2 on the Lifting page
- **File/lines:** `services/Detailed-Design/Lifting.html:136-161` (5 slides) vs `:170-173` (only 2 dots); fails in `assets/js/photo-slider.js:27`
- **What's wrong:** 5 `.mySlides` but only 2 `.dot` elements. `dots[slideIndex-1].className += ...` throws `TypeError` when navigating to slides 3–5 (`dots[2]` is undefined).
- **Fix:** Provide 5 dots to match 5 slides:
```html
<div style="text-align:center">
  <span class="dot" onclick="currentSlide(1)"></span>
  <span class="dot" onclick="currentSlide(2)"></span>
  <span class="dot" onclick="currentSlide(3)"></span>
  <span class="dot" onclick="currentSlide(4)"></span>
  <span class="dot" onclick="currentSlide(5)"></span>
</div>
```
(Optionally also harden `photo-slider.js:27`: `if (dots[slideIndex-1]) dots[slideIndex-1].className += " active";`)

---

## HIGH

### H1 — favicon.ico 404 + duplicate `href` attribute
- **File/line:** `index.html:23`
- **What's wrong:** `<link rel="icon" href="favicon.ico" href="images/favicon_io/favicon-32x32.png">` has two `href` attributes; the browser uses the first (`favicon.ico`), which does not exist at the site root → 404.
- **Fix (delete the line — the valid 16/32px icons on lines 20–21 already cover it):**
```html
<!-- remove line 23 entirely -->
```

### H2 — Missing `<h1>` on 6 pages (broken heading hierarchy)
- **Files:** `about.html` (starts at `<h2>` line 66), `services/Detailed-Design.html` (line 66), `services/shop-drawings.html` (line 66), `services/Detailed-Design/Lifting.html` (line 76), `services/shop-drawings/foundation.html` (line 75), `services/shop-drawings/manholes.html` (line 75)
- **What's wrong:** Each page's main topic heading is an `<h2>` with no `<h1>` above it. Hurts SEO and screen-reader document outline.
- **Fix (example, `manholes.html:75`):**
```html
<h1>Precast Manhole Shop Drawings</h1>
```
Apply the same pattern (promote the lead heading to `<h1>`) on each listed page.

### H3 — Multiple `<h1>` on the home page
- **File/lines:** `index.html:69` (`Welcome to precasterz`) and `index.html:107` (`Precasterz`)
- **What's wrong:** Two `<h1>` elements compete for the page's primary heading.
- **Fix:** Keep the intro `<h1>` (line 69) and demote line 107:
```html
<h2>Precaster<span class="yellow-z">z</span></h2>
```

### H4 — Wrong contact email in careers meta description
- **File/line:** `careers.html:12`
- **What's wrong:** Meta description says `contacts@precasters.com` — wrong domain (**precasters**, missing "z") and wrong mailbox. The page body correctly uses `careers@precasterz.com`.
- **Fix:**
```html
<meta name="description" content="Join Precasterz as a freelance civil engineer or draftsman. Work on innovative precast design projects with a dynamic team. Send your CV to careers@precasterz.com for exciting career opportunities." />
```

### H5 — Achievements page reuses the Services title, description, and body copy
- **File/lines:** `Achievements.html:9` (title), `:12` (description), `:71-73` (body text all copied from `services.html`)
- **What's wrong:** Duplicate `<title>` and meta description across two URLs (SEO duplicate-content), and the on-page intro talks about "services," not achievements.
- **Fix:**
```html
<title>Achievements | In-House Engineering Tools & Projects | Precasterz</title>
<meta name="description" content="Explore Precasterz milestones — including our in-house HollowCoreSlab plugin for AutoCAD 2021–2024 that automates precast slab layouts, openings, shop drawings, and BOQ export.">
```
And replace the `:71-73` heading/paragraph with achievement-specific copy.

### H6 — Unclosed `<dl>` list
- **File/line:** `services/Detailed-Design/Lifting.html:92` (opened) — never closed before the next `<hr>`/`<h2>`/`<dl>` at lines 109–113
- **What's wrong:** The first definition list is never closed with `</dl>`, producing invalid nesting.
- **Fix:** Add `</dl>` immediately before the `<hr />` on line 109:
```html
        </dd>
      </dl>
      <hr />
```

### H7 — Inverted tag nesting (`</div>` before `</section>`)
- **Files/lines:** `Lifting.html:174-175`, `foundation.html:149-150`, `manholes.html:161-162`
- **What's wrong:** `#main`'s `</div>` is written before the enclosing `<section class="post">`'s `</section>`, so the elements close out of order.
- **Fix (manholes.html, mirror for the others):**
```html
            </section>
        </div>
```

### H8 — Misleading "Learn More" links: 5 of 6 shop-drawing cards point to manholes
- **File/lines:** `services/shop-drawings.html` — chambers (`:76,:78,:81`), hollow-core (`:96,:98,:101`), boundary wall (`:106,:108,:111`), building elements (`:116,:118,:121`) all link to `./shop-drawings/manholes.html`
- **What's wrong:** Four distinct services route the visitor to the manhole page. Only `foundation.html` and `manholes.html` exist as detail pages.
- **Fix:** Either create the missing detail pages and link them, or remove the misleading "Learn More" buttons/links until pages exist. (Decision needed — see prioritized list.)

### H9 — Dead placeholder links (`href="#"`)
- **File/lines:** `services.html:97,:100,:103` ("Detailed Design / General Arrangement Drawings") and `:118,:120,:123` ("Proposal Preparation")
- **What's wrong:** Two service cards link to `#` (no destination). The `proposal/` folder is empty.
- **Fix:** Point to real pages once they exist, or remove the card links until then.

---

## MEDIUM

### M1 — Missing/empty `alt` text
- **Files/lines:** `about.html:84` (`alt=""`); `services/shop-drawings.html:78,:88,:98,:108,:118` (`alt=""`); `services/Detailed-Design/Lifting.html:138,:144,:149,:154,:159` (no `alt` attribute on slideshow images)
- **Fix (examples):**
```html
<!-- about.html:84 -->
<a href="contact.html" class="image main"><img src="images/Logo.png" alt="Precasterz logo" /></a>
<!-- Lifting.html:138 -->
<img src="../images/lifting-analysis.jpeg" alt="Precast lifting analysis calculation output" style="width:100%">
```

### M2 — LinkedIn icon labelled "Instagram"
- **Files/lines:** every page except the 5 Engineering-Automation pages — e.g. `index.html:94,:225`; `services.html:54,:158`; `about.html:52,:135`; `careers.html:54,:102`; `contact.html:54,:113`; `Achievements.html:54,:117`; `Detailed-Design.html:54,:96`; `shop-drawings.html:54,:146`; `Lifting.html:61,:218`; `foundation.html:60,:193`; `manholes.html:60,:205`
- **What's wrong:** `<span class="label">Instagram</span>` inside the LinkedIn `fa-linkedin` link — wrong accessible name for screen readers.
- **Fix:**
```html
<span class="label">LinkedIn</span>
```

### M3 — Broken Web App Manifest
- **File:** `images/favicon_io/site.webmanifest`
- **What's wrong:** `name` and `short_name` are empty; icon `src` values (`/android-chrome-192x192.png`, `/android-chrome-512x512.png`) point to the site root, but the files live in `/images/favicon_io/` → 404 icons on install.
- **Fix:**
```json
{"name":"Precasterz","short_name":"Precasterz","icons":[{"src":"/images/favicon_io/android-chrome-192x192.png","sizes":"192x192","type":"image/png"},{"src":"/images/favicon_io/android-chrome-512x512.png","sizes":"512x512","type":"image/png"}],"theme_color":"#212931","background_color":"#212931","display":"standalone"}
```

### M4 — Inconsistent contact email across the site
- **Files/lines:** footers use `contact@precasterz.com` (all pages); `contact.html:71` uses `info@precasterz.com`; `careers.html:81` uses `careers@precasterz.com`
- **What's wrong:** Three different addresses. `careers@` is intentional, but `info@` vs `contact@` is an inconsistency.
- **Fix:** Standardize the general inbox. e.g. `contact.html:71`:
```html
<a href="mailto:contact@precasterz.com"><span class="yellow-z">contact@precasterz.com</span></a>
```

### M5 — `user-scalable=no` disables pinch-zoom (WCAG 1.4.4 fail)
- **Files/line:** every page, the viewport meta (e.g. `index.html:11`)
- **What's wrong:** `user-scalable=no` blocks zoom on mobile — an accessibility failure.
- **Fix (all pages):**
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### M6 — Oversized images / no dimensions / no lazy-loading
- **Files:** `images/Gear-Icon-Service.png` (740 KB), `images/bg.jpg` (396 KB), `services/images/manholes-photo.png` (329 KB), `images/contact-home.jpg` (270 KB), `images/Achievements-home.jpg` (266 KB), `services/images/LIFTING/ACI-REQUIREMENTS.png` (219 KB), plus many 100–160 KB PNGs
- **What's wrong:** Large raster assets, no `width`/`height` attributes (causes layout shift / CLS), and no `loading="lazy"` on below-the-fold images.
- **Fix:** Compress/convert to WebP (target <150 KB for photos, <80 KB for the gear icon — it's a simple graphic), and add attributes:
```html
<img src="images/Gear-Icon-Service.png" alt="photo for the Service page" width="800" height="600" loading="lazy" />
```

### M7 — 21 MB demo video without `preload="none"`
- **File/line:** `services/Engineering-Automation/Concise-Beam-Autoprinter.html:96-97` (`services/images/Conciser.mp4` ≈ 21 MB)
- **What's wrong:** Even with a poster, browsers may fetch metadata/buffer eagerly; 21 MB is heavy for a self-hosted MP4.
- **Fix:**
```html
<video width="100%" height="auto" controls preload="none" poster="../../services/images/hollow-core-slabs.png">
```
(Consider hosting on YouTube like the HollowCoreSlab page already does.)

### M8 — Social/SEO metadata only on the home page
- **Files:** `og:*` tags and JSON-LD `Organization` schema exist only in `index.html:14-37`; all other pages lack Open Graph tags and structured data. `index.html:16` `og:image` points to a 32×32 favicon (too small; should be ≥1200×630).
- **Fix:** Add per-page `og:title`/`og:description`/`og:image`/`og:url` to each page, and set `og:image` to a real share image (e.g. `images/Achievements-home.jpg`). Add `BreadcrumbList`/`Service` JSON-LD to service pages.

### M9 — Headings used as body text
- **Files/lines:** `contact.html:71` (a full sentence + email wrapped in one `<h2>`); `about.html:67-82` (three `<p>` paragraphs inside `<header class="major">`)
- **What's wrong:** Non-semantic use of headings/headers for paragraph content.
- **Fix:** Make `contact.html:71` an `<h2>` with a short heading and move the sentence/email into a following `<p>`; keep only the heading inside `about.html`'s `<header>` and move paragraphs out.

---

## LOW

### L1 — Content typos
- `Lifting.html:76` "Deisgn" → "Design"; `Lifting.html:160` "Anhor Check In Shear" → "Anchor Check in Shear"; `shop-drawings.html:68` "drwaings" → "drawings"; `shop-drawings.html:116` "Bulding elements" → "Building elements".

### L2 — `photo-slider.css` global selectors
- **File/lines:** `assets/css/photo-slider.css:1` (`* {box-sizing:border-box}`) and `:75` (`.active`)
- **What's wrong:** A page-wide `*` reset and a generic `.active` class that collides conceptually with the nav's `li.active`. Nav keeps its style only because `#nav ul.links li.active` (main.css:3728) has higher specificity — fragile.
- **Fix:** Scope them, e.g. `.slideshow-container .dot.active, .slideshow-container .dot:hover { background-color:#717171; }` and drop the global `*` rule (Massively already sets box-sizing).

### L3 — Decorative anchors without `href`
- **File/lines:** `HollowCoreSlab.html:97,:143,:150,:157,:164,:171` use `<a class="image fit">` with no `href`.
- **Fix:** Use `<span class="image fit">…</span>` (as `foundation.html`/`manholes.html` already do for their photos).

### L4 — Nav label casing / path inconsistency
- **Files/lines:** every nav — `careers` is lowercase while other items are capitalized (e.g. `index.html:91`), and paths mix `./careers.html` with `services.html`/`careers.html`.
- **Fix:** Use `Careers` and a consistent relative-path style across all nav blocks.

### L5 — Facebook URL inconsistency
- **Files:** some pages append `&mibextid=ZbWKwL` (`Lifting.html:64`, `foundation.html:63`, `manholes.html:63`), others don't.
- **Fix:** Use one canonical Facebook URL everywhere.

---

## Notes on items that are FINE (checked, no action needed)
- No exposed secrets. The Formspree endpoint, GTM container `GTM-KRTZC5C2`, and Google Ads ID `AW-18140464176` are public-by-design identifiers, not credentials.
- Scripts load at end of `<body>` (not render-blocking). jQuery and Font Awesome are self-hosted, so there are no outdated third-party CDN links to patch.
- `.github/workflows/static.yml` is a correct, standard GitHub Pages deploy. `LICENSE`, `README.md`, `BingSiteAuth.xml` are valid.
- CSS background paths in `main.css`/`noscript.css` (`../../images/…`) resolve correctly.
- The 4 Engineering-Automation detail pages (BOQ, ETABS, Concise Beam, HollowCoreSlab) are well-structured: single `<h1>`, correct LinkedIn labels, alt text, matching slide/dot counts. Use them as the template for fixing the others.

---

## Prioritized fix list (what to do first and why)

1. **C1 — Fix `email-form.js` null guard.** One small change restores the contact form on 4 service pages; right now lead-capture is silently broken there. Highest business impact, lowest effort.
2. **C4 + H6 + H7 — Fix `Lifting.html` (5 dots, close `<dl>`, correct tag order).** The slideshow throws and the markup is malformed; this is a flagship "Detailed Design" page.
3. **C3 + C2 — Fix duplicate `id="main"` and the unclosed `</a>` on `index.html`/`services.html`/`Achievements.html`.** Invalid markup on the most-visited pages; also lets the intro/parallax JS target the correct container.
4. **H4 + H5 — Correct the careers meta email and de-duplicate the Achievements title/description/copy.** Direct SEO + contactability wins, trivial edits.
5. **H2 + H3 — Heading hierarchy (`<h1>` per page, demote the second home `<h1>`).** Sitewide SEO/accessibility; touches several files.
6. **H8 + H9 — Resolve misleading/dead links** (build the missing pages or remove the links). Needs a product decision on which detail pages to create.
7. **M2 + M5 + M1 — Accessibility batch:** fix LinkedIn labels, remove `user-scalable=no`, add `alt` text. Cheap, sitewide, high a11y value.
8. **M3 — Repair `site.webmanifest`** (names + icon paths).
9. **M6 + M7 — Performance:** compress the heavy images (start with the 740 KB gear icon and 396 KB hero), add `width`/`height` + `loading="lazy"`, set `preload="none"` on the 21 MB video.
10. **M8 — Roll out per-page OG/structured data;** then mop up the LOW items (typos, scoped slider CSS, casing, Facebook URL).
```
