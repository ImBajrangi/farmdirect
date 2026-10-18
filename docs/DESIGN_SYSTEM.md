# FarmDirect — Design System: Dayos-Inspired Design Language

> **Reference Spec**: Dayos (https://www.dayos.com, fetched 17 Oct 2026)  
> **Permanent Memory**: Dark cinematic canvas, outcome-first declarative copy, hero demo player with 1.5× playback, triptych narrative columns, infinite marquee, and 1:1 square category cards.

---

## 0. Confidence Legend

| Tag | Meaning |
|---|---|
| **[OBSERVED]** | Directly visible in the page content/markup |
| **[INFERRED]** | Reasonable conclusion from observed signals |
| **[PROPOSED]** | Platform token adaptation configured in `src/styles/variables.css` |

---

## 1. Design Philosophy

- **Positioning:** "Direct from the soil. Not passed through 5 middlemen." — confident, enterprise/platform-grade, outcome-first. [OBSERVED]
- **Tone:** Short declarative statements, big claims backed by numbers ("Harvested in <18 hours", "0% commission", "1,200+ verified growers"). [OBSERVED]
- **Show, don't tell:** Hero features an interactive/product demo player with play/pause and 1.5× speed toggle, not abstract illustrations. [OBSERVED]
- **Dark, cinematic canvas:** Rich dark surfaces (`#0A0B0F`, `#12141A`, `#171A22`) with hairline borders (`rgba(255,255,255,0.10)`). [INFERRED]
- **Calm density:** One idea per section, generous whitespace, large type, few elements per viewport. [INFERRED]

---

## 2. Page Architecture (Top → Bottom)

| # | Section | Pattern | Implementation in FarmDirect |
|---|---|---|---|
| 1 | Sticky Header | Logo · Platform · Marketplace · FPOs · Resources · **Cart / Sourcing CTA** | Floating pill nav with `backdrop-filter: blur(16px)` |
| 2 | Hero | Eyebrow label + 2-line display headline + sub-copy + proof line + 2 CTAs + **Demo Player** | Direct from soil H1 + live sensor telemetry player with 1.5× speed toggle |
| 3 | Demo Example Tabs | 3 groups: HARVEST (4 examples) · LOGISTICS (3) · BULK (2), each with a count badge | Swaps active preview, metrics, and caption with ARIA `role="tablist"` |
| 4 | "Partnered with" Strip | Logo row with monochromatic translucency (`opacity 0.7 → 1.0`) | Sahyadri Farms, MahaFPO, NABARD, Nashik APMC, Pune ColdGrid, Mahabhulekh |
| 5 | Triptych | 3 columns, one-word uppercase title + period (`DIRECT.` `FAIR.` `FRESH.`) | Problem → Gap → Solution narrative structure |
| 6 | Manifesto + Flywheel Film | Uppercase H2, statements revealed sequentially + looping flywheel visual | Interactive 3-part breakdown + circular flow orb with Play toggle |
| 7 | "Supercharge your fresh supply…" | Section intro + use-case carousel (3 slides, indicators, Play/Pause) | Households · Restaurants · Retail FPOs with user-stoppable autoplay |
| 8 | Infinite Logo Marquee | Headline + infinite CSS marquee (`animation: marquee 40s linear infinite`) | APMC Nashik, Sahyadri, ColdGrid, Mahabhulekh, UPI, FSSAI, PGS-India |
| 9 | "Run a better business" | Image card carousel (5 departments) with 1:1 square aspect ratio | Vegetables, Fruits, Grains, Dairy, Bulk with square cards and "More details →" |
| 10 | Department List | Text-only list version of the same 5 departments | High-density fast navigation with chevron/link-arrow |
| 11 | Live Harvest Grid | Real products loaded from Supabase / live marketplace service | 4-column responsive grid with integer-paise pricing |
| 12 | CTA Band | Headline + subhead + primary button + about card | "Let's transform the way fresh produce reaches your door." |
| 13 | Footer | Contact, Slack/WhatsApp community, 4 link columns, address, **Back to top** | Cinematic `#12141A` footer with smooth scroll to top |

---

## 3. Typography Hierarchy

```css
--font-display: "Inter Tight", "Inter", system-ui, sans-serif;
--font-body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, monospace; /* eyebrows, chips, telemetry */

--fs-display: clamp(2.75rem, 5.5vw + 1rem, 5.25rem); /* H1 */
--fs-h2:      clamp(1.75rem, 3vw + 0.5rem, 3rem);     /* UPPERCASE H2 */
--fs-h3:      clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem);
--fs-body:    clamp(1rem, 0.3vw + 0.95rem, 1.125rem);
--fs-small:   0.8125rem;
--lh-tight: 1.05;
--lh-body: 1.55;
--tracking-caps: 0.06em;
```

### Typographic Rules:
- **Eyebrow:** Monospace, uppercase, tracked (`0.06em`), with a dot separator (`●`).
- **Section H2:** Always **UPPERCASE** (`text-transform: uppercase;`).
- **Triptych Titles:** One word, uppercase, period-terminated (`DIRECT.`, `FAIR.`, `FRESH.`).
- **Secondary Actions:** Always end with an arrow glyph `→` (`Explore Home Delivery →`).
- **Paragraphs:** Keep body text concise (max 2 sentences per block).

---

## 4. Color System

```css
:root {
  /* Surfaces */
  --bg:            #0A0B0F;                      /* Canvas background */
  --bg-elevated:   #12141A;                      /* Nav pill, elevated chips, field fill */
  --bg-card:       #171A22;                      /* High-contrast dark cards */
  --border:        rgba(255, 255, 255, 0.10);    /* Hairlines */
  --border-subtle: rgba(255, 255, 255, 0.05);    /* Dividers */

  /* Text */
  --text:          #F5F6F8;                      /* High contrast foreground */
  --text-muted:    #A3A8B3;                      /* Secondary descriptions */
  --text-faint:    #6B7280;                      /* Captions, metadata */

  /* Brand / Action */
  --accent:        #5B8CFF;                      /* Electric Cobalt Accent */
  --accent-hover:  #7AA2FF;                      /* Hover highlight */
  --on-accent:     #0A0B0F;                      /* Dark text on primary button */

  /* Feedback */
  --success:       #3DD68C;
  --warning:       #F5B94A;
  --danger:        #FF6B6B;
}
```

### Color Rules:
1. **One Accent Only:** `--accent: #5B8CFF;` is strictly reserved for primary CTA buttons, active tabs, and focus rings. Everything else is neutral dark surfaces.
2. **Surface Elevation:** Depth is achieved by contrast between `#0A0B0F` (canvas), `#12141A` (elevated), and `#171A22` (cards) with 1px `rgba(255,255,255,0.10)` borders.

---

## 5. Spacing, Geometry & Shapes

- **Max Container:** `1280px` (`padding: 0 clamp(1rem, 4vw, 3rem)`).
- **Vertical Rhythm:** `clamp(4rem, 8vw, 8rem)`.
- **Card Geometry:** `20px` to `24px` radius (`--radius-card: 20px;`).
- **Button Geometry:** Stadium pill (`9999px`) or `12px`.
- **Department/Category Images:** Strictly square `1:1` aspect ratio (`aspect-ratio: 1 / 1;`).
- **Triptych Columns:** 3 equal columns on desktop (`≥ 1024px`), cleanly stacked on mobile.

---

## 6. Motion & Accessibility

- **Transitions:** 150–200ms ease for hovers; 600ms cubic-bezier for reveals.
- **Marquee:** 35s linear infinite loop, pauses on `:hover`.
- **Reduced Motion:** When `@media (prefers-reduced-motion: reduce)` is active, autoplay, marquee animations, and rotating flywheels are completely disabled.
- **Contrast & Focus:** Focus-visible ring is `2px solid var(--accent)` with `2px` offset. Contrast ratio exceeds WCAG 2.1 AAA on dark backgrounds.
