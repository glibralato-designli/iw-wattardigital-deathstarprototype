# Death Star — 5b Navy shell · Core 1.0

## Authority and intent
This document is the source of truth for the Death Star design system. CSS implements it; `system.html` demonstrates it. `PRODUCT.md` describes the product. `config/project.js` owns executable project settings.

## Visual direction
**Direction status: established.** Concept approved by the designer (Giulio Libralato) on October 2, 2026, after Checkpoint 2, before the first client call. New screens inherit this identity, its tokens, recipes and interaction patterns; changing the direction needs an explicit redesign request. Built from the Claude Design handoff (direction **5b · Navy shell**, `.claude/handoff/project/.design/death-star/DESIGN_TOKENS.css`, prototype `Death Star Prototype.dc.html`). Consolidation after approval kept the approved appearance and removed unused recipes (product filter select, funnel, stacked bar and shell kbd variants); the starter tertiary palette, starter aliases and mint theme were removed during concept work.

**Rationale.** Thomas wants "classic corporate", midnight blue, quiet, not data-dense, and fears saying something wrong to an owner. So: one navy frame (sidebar + top bar) holds white work panels; inside the panels the page is light, flat and bordered; trust is always explicit. Style led by Attio (precision, 13px UI, 1px borders), Asana (navy chrome, labelled sidebar groups) and ElevenLabs (Home order: greeting, metric strip, one detail area).

**Rules of the direction**
1. Navy lives in the frame (`--shell`). All content sits in `--bg` panels with a 1px `--border` and a 12px radius, an 8px navy gutter around them. No navy panels inside content.
2. Inside panels: no shadows on in-flow cards, borders only. Shadows only on things that float (menus, popovers, the peek, dialogs, the minimized Brain pill).
3. One filled primary (navy) button per panel. Everything else is outline (white + slate-200 border) or ghost. The "Next: Call" pill is the subtle variant.
4. Nothing filled navy touches the frame: primary buttons, the selected metric tab and the today bar always sit on white.
5. Top-bar controls on navy are translucent white or ghost. The exception is **Ask Brain**: a pill with the shell gradient border (the only gradient), solid white when the panel is open.
6. The selected metric tab is white on a slate-50 strip with a navy number; never filled navy.
7. Brand 300–700 are graphics only (bars, focus, progress). Link text uses `--link` (brand 800).
8. Status colour only inside badges, alerts and toasts; always colour + word + icon. Trust: Verified = success, Single source = warning, Stale = neutral, Disputed = danger.
9. Numbers use tabular figures. Zero values render in `--fg-disabled`; unknown values read "Not on record".
10. Sentence case. No capitals, no letter-spaced eyebrows (`.text-label` is sentence case in this direction).
11. Disabled is a colour change only (`--fg-disabled`, `--shell-disabled`), never opacity. Disabled controls stay focusable, carry the tooltip "Not in this proposal yet" and do nothing on click.
12. Focus: a 2px `--focus` outline inside panels, a white outline on navy (`--shell-focus`).
13. No single-side borders except the active-tab underline.

**Dark theme.** The frame stays navy (`#01183a`); panels become deep slate (`#0b1220`, subtle `#0f1828`, muted `#172235`). The primary fill flips to pale blue (`brand-primary-200`) with navy text so the one primary action still reads as the strongest thing on a dark panel; Class A uses the same pair. Status colours are re-tuned for AA on dark tints. Light is the default; the account menu has a Light/Dark switch (saved with the review menu's preference).

**Deviations from the concept**
- `--fg-subtle` is `#5b6b82` instead of slate-500 (`#64748b`): slate-500 is 4.34:1 on the slate-100 surface, below AA. The difference is barely visible.
- Icons are Phosphor regular instead of Hugeicons stroke (the template's icon library). Each concept icon maps to its closest Phosphor equivalent.
- Form text is 14px (raised from the concept's 13px for readability) instead of the template's 16px on desktop and tablet; on phones (under 768) fields switch to 16px so iOS never zooms on focus.
- The prototype guide's "Check the why now" flow is a state set of the case file on the portal (a portal flow needs its own screen).
- The case file's Home step reads "Call Ruth Adler back" (the concept said "Samuel Adler"; the contact is Ruth Adler).
- Every Dashboard tab carries one Brain nudge line under the tabs (IA §4.2); the concept had none drawn.
- The four display-only Dashboard tabs (Outreach performance, Reporting, Listings, Web analytics) were `specified` in the handoff; they are designed here from the IA and PRD §6.4.
- Responsive down to phones (designer request, Oct 2; the concept stopped at desktop): below 1360 Brain overlays the page (minimized on Home); below 1180 the sidebar defaults to the rail; below 1280 the database table drops its least useful column (Lead property, Gross SF); under 1024 records and right columns stack, search and Links collapse to icons; under 768 the sidebar is a drawer (menu button, scrim, Esc, closes on navigation), the top bar shows only the current page, Brain, the peek and dialogs go full screen, grids collapse to one column, odd stat tiles span the row, and the calendar opens on Day. Brain's chat history (designer request, Oct 20) is one list everywhere (`DS.chatHistory`: new chat, search, grouped chats, folders, stored documents): a column beside the conversation that hides with its sidebar button and comes back from the same button in the tab row (`chats=hidden`); under 768 it is a left drawer (`ui.chatDrawer`, `chats=open`) behind that button, with a scrim, Esc, 44 rows, and it closes when a chat is picked. Squeeze rules (designer request, Oct 19), at every width: a card title never drops below 14rem and a section heading never shrinks below its text, so badges, buttons, notes and segmented controls wrap under them instead of crushing them; the live-call band keeps the name on one line (ellipsis); compact stat rows bottom-align their values; Conversations columns stay at least 11rem and the board scrolls below that; coverage tiles are five across in a wide card and two across otherwise (a container query), so ten ZIPs never leave an orphan. Phone polish (same request): nudges put Ask Brain under the sentence; date toolbars keep steppers, date and range on one row with the title below; Home's primary action takes a full row and the secondary actions share the next; database filters are search-on-its-own-row then two by two, and the table becomes a list (class, name and score; why now; last touch and trust); report comparisons read as label-value rows; the to-do add row wraps; key/value values that don't fit beside the label drop under it; history and timeline rows put the field and its date on one line with the change below; data tables keep cells on one line and scroll inside their card; the live-call band drops the phone number; the Conversations board snaps a column at a time; empty chart bars drop their label.
- "Reset prototype data" stays in the account menu (or `?reset=1`) rather than on Home's primary action, which must stay "Open Attack Plan".

## The three layers
1. Core: `css/tokens.css`, `base.css`, `layout.css`, `components.css`, `mobile-components.css`, `js/components.js`, and `js/navigation.js`.
2. Product: `pages/`, `css/product.css`, `js/product-data.js` (fixtures), `js/product.js` (store, shell, Brain, ⌘K, peek, shared UI helpers), `js/screens/*.js` (one module per screen or screen family), and project assets.
3. Review: `prototype/` (including `system-patterns.js/.css`, which render product patterns in the showcase with the product helpers), `index.html`, `prototype.html`, `system.html`, `screens.html`, and `config/project.js`.
4. Export (generated, never edited): `design/` and `tools/export_portal.py`. See "Portal export".

Product pages must not import `prototype/` assets, depend on the parent frame, or include review UI. Each product page works directly by URL.

## Canonical tokens
Edit the CSS block below, then run `python3 tools/sync_tokens.py`. Run with `--check` to detect drift.

Primitive palette values feed semantic roles. Components use semantic colours. Spacing, typography, radius, shadow, motion, size and layer values use named tokens. Exceptions: structural values such as 0, 100%, layout fractions, icon geometry, calendar geometry (48px per hour), breakpoints, and review viewport dimensions.

<!-- tokens:start -->
```css
/* Generated from DESIGN.md. Edit its canonical token block, then run tools/sync_tokens.py. */
:root {
  --white:#ffffff;
  /* neutral: slate. Surfaces, borders and text inside the white panels. */
  --neutral-50:#f8fafc;
  --neutral-100:#f1f5f9;
  --neutral-200:#e2e8f0;
  --neutral-300:#cbd5e1;
  --neutral-400:#94a3b8;
  --neutral-500:#64748b;
  --neutral-600:#475569;
  --neutral-700:#334155;
  --neutral-800:#1e293b;
  --neutral-900:#0f172a;
  --neutral-950:#020617;
  /* brand-primary: the navy ramp. 950 is the dominant shell and action colour; 300–600 are for charts only. */
  --brand-primary-50:#e9f7ff;
  --brand-primary-100:#cfeeff;
  --brand-primary-200:#a9e2ff;
  --brand-primary-300:#6dd2ff;
  --brand-primary-400:#29b7ff;
  --brand-primary-500:#0098ff;
  --brand-primary-600:#0087ff;
  --brand-primary-700:#007aff;
  --brand-primary-800:#0067e3;
  --brand-primary-900:#0054b1;
  --brand-primary-950:#012756;
  /* brand-secondary: the accent blue used for Class B, links and the call-block calendar. */
  --brand-secondary-50:#eff6ff;
  --brand-secondary-100:#dbeafe;
  --brand-secondary-200:#bfdbfe;
  --brand-secondary-300:#93c5fd;
  --brand-secondary-400:#60a5fa;
  --brand-secondary-500:#3b82f6;
  --brand-secondary-600:#2468cc;
  --brand-secondary-700:#1e5bb8;
  --brand-secondary-800:#0067e3;
  --brand-secondary-900:#0054b1;
  --brand-secondary-950:#0e2140;
  /* Status colours are independent of the brand palettes. Trust: verified = success, single source = warning, stale = neutral, disputed = danger. */
  --status-success-light:#15803d; --status-success-light-bg:#f0fdf4; --status-success-light-border:#bbf7d0;
  --status-success-dark:#4ade80; --status-success-dark-bg:#0f2a1c; --status-success-dark-border:#1f5135;
  --status-danger-light:#b91c1c; --status-danger-light-bg:#fef2f2; --status-danger-light-border:#fecaca;
  --status-danger-dark:#f87171; --status-danger-dark-bg:#321415; --status-danger-dark-border:#5c2324;
  --status-warning-light:#b45309; --status-warning-light-bg:#fffbeb; --status-warning-light-border:#fde68a;
  --status-warning-dark:#fbbf24; --status-warning-dark-bg:#2e2210; --status-warning-dark-border:#594216;
  --status-info-light:#0054b1; --status-info-light-bg:#e9f7ff; --status-info-light-border:#a9e2ff;
  --status-info-dark:#8fd3ff; --status-info-dark-bg:#0c2647; --status-info-dark-border:#1d4a7e;
  /* Semantic roles: use these in components and product styles. */
  --bg:var(--white); --bg-subtle:var(--neutral-50); --bg-muted:var(--neutral-100); --bg-inverse:var(--neutral-800);
  --fg:var(--neutral-900); --fg-secondary:var(--neutral-700); --fg-muted:var(--neutral-600); --fg-subtle:#5b6b82;
  --fg-placeholder:#5b6b82; --fg-disabled:var(--neutral-400); --fg-inverse:var(--white);
  --border:var(--neutral-200); --border-strong:var(--neutral-300); --border-subtle:var(--neutral-100);
  --link:var(--brand-primary-800); --link-hover:var(--brand-primary-900);
  --brand-primary:var(--brand-primary-950);
  --brand-primary-hover:#0a3470;
  --brand-primary-pressed:#011d40;
  --brand-primary-on:var(--white);
  --brand-primary-subtle:var(--brand-primary-50);
  --brand-primary-muted:var(--brand-primary-100);
  --brand-primary-text:var(--brand-primary-900);
  --brand-primary-border:var(--brand-primary-700);
  --brand-secondary:var(--brand-secondary-800);
  --brand-secondary-hover:var(--brand-secondary-900);
  --brand-secondary-pressed:#003f86;
  --brand-secondary-on:var(--white);
  --brand-secondary-subtle:var(--brand-secondary-50);
  --brand-secondary-muted:var(--brand-secondary-100);
  --brand-secondary-text:var(--brand-secondary-900);
  --brand-secondary-border:var(--brand-secondary-800);
  --fg-brand-primary:var(--brand-primary-text); --fg-brand-secondary:var(--brand-secondary-text);
  --accent:var(--brand-primary); --accent-hover:var(--brand-primary-hover); --accent-pressed:var(--brand-primary-pressed);
  --accent-fg:var(--brand-primary-on); --accent-subtle:var(--brand-primary-subtle);
  --danger:var(--status-danger-light); --danger-bg:var(--status-danger-light-bg); --danger-border:var(--status-danger-light-border);
  --success:var(--status-success-light); --success-bg:var(--status-success-light-bg); --success-border:var(--status-success-light-border);
  --warning:var(--status-warning-light); --warning-bg:var(--status-warning-light-bg); --warning-border:var(--status-warning-light-border);
  --info:var(--status-info-light); --info-bg:var(--status-info-light-bg); --info-border:var(--status-info-light-border);
  --focus:var(--brand-primary-700); --focus-halo:var(--brand-primary-200); --scrim:#0f172a66;
  /* Shell: the navy frame that holds the sidebar and the top bar. Translucent roles sit on --shell only. */
  --shell:var(--brand-primary-950); --shell-raised:#0a3470; --shell-raised-hover:#11407f;
  --shell-fg:var(--neutral-200); --shell-fg-strong:var(--white); --shell-fg-icon:var(--neutral-300);
  --shell-muted:var(--neutral-400); --shell-disabled:#8395b0; --shell-focus:var(--white);
  --shell-hover:#ffffff1a; --shell-active:#ffffff1f; --shell-active-border:#ffffff29; --shell-chip:#ffffff24;
  --shell-gradient:linear-gradient(90deg,var(--brand-primary-300),var(--brand-primary-700));
  /* Charts */
  --chart-primary:var(--brand-primary-700); --chart-today:var(--brand-primary-950); --chart-empty:var(--neutral-200); --chart-goal:var(--neutral-300); --chart-muted:var(--neutral-400);
  /* Calendars: a fill for the selected event, a tint for the rest. */
  --cal-meeting:var(--brand-primary-950); --cal-meeting-bg:var(--brand-primary-50);
  --cal-call:var(--brand-primary-800); --cal-call-bg:var(--brand-secondary-50);
  --cal-tour:var(--status-success-light); --cal-tour-bg:var(--status-success-light-bg);
  --cal-marketing:var(--status-warning-light); --cal-marketing-bg:var(--status-warning-light-bg);
  --cal-now:#dc2626;
  /* Type: Inter, one family. 14px is the default UI size. */
  --font-body:'Inter',ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif; --font-display:var(--font-body); --font-mono:ui-monospace,monospace;
  --text-2xs:.6875rem; --text-xs:.8125rem; --text-sm:.875rem; --text-md:.9375rem; --text-base:1rem;
  --text-body-lg:1.0625rem; --text-lg:1.25rem; --text-xl:1.375rem;
  --text-2xl:1.625rem; --text-3xl:1.875rem; --text-4xl:2.125rem;
  --text-5xl:3rem; --text-6xl:3.75rem; --text-7xl:4.5rem; --text-8xl:6rem;
  --line-height-2xs:1rem; --line-height-xs:1.125rem; --line-height-sm:1.375rem; --line-height-md:1.5rem; --line-height-base:1.375rem;
  --line-height-body-lg:1.625rem; --line-height-lg:1.75rem; --line-height-xl:1.875rem; --line-height-2xl:2.125rem; --line-height-4xl:2.625rem;
  --line-height-tight:1.1; --line-height-snug:1.25;
  --line-height-normal:1.5; --line-height-relaxed:1.75;
  --line-height:var(--line-height-sm); --letter-spacing:0; --letter-spacing-tight:-.01em; --letter-spacing-tighter:-.02em;
  --weight-regular:400; --weight-medium:500; --weight-semibold:600; --weight-bold:700;
  /* Spacing: 4px base. */
  --space-0-5:.125rem; --space-1:.25rem; --space-1-5:.375rem; --space-2:.5rem; --space-2-5:.625rem; --space-3:.75rem; --space-3-5:.875rem; --space-4:1rem; --space-5:1.25rem;
  --space-6:1.5rem; --space-7:1.75rem; --space-8:2rem; --space-9:2.25rem; --space-10:2.5rem; --space-12:3rem; --space-16:4rem; --space-20:5rem;
  --page-pad-x:var(--space-8); --page-pad-top:var(--space-7); --section-gap:var(--space-7); --card-gap:var(--space-5);
  --radius-xs:.25rem; --radius-sm:.375rem; --radius-md:.5rem; --radius-lg:.625rem; --radius-xl:.75rem; --radius-2xl:1rem; --radius-full:999px;
  --border-width:1px; --focus-width:2px; --focus-offset:2px;
  --shadow-sm:0 1px 2px #0f172a14; --shadow-md:0 8px 24px #0f172a14,0 2px 6px #0f172a0a; --shadow-lg:0 20px 48px #0f172a29;
  --control-xs:1.5rem; --control-sm:1.75rem; --control-md:2rem; --control-lg:2.25rem; --touch-target:2.75rem;
  --topbar-h:3.5rem; --sidebar-w:14.5rem; --sidebar-rail:3.5rem; --brain-w:22.5rem; --gutter:var(--space-2);
  --content-sm:28rem; --content-md:48rem; --content-lg:76rem;
  --motion-fast:120ms; --motion-exit:140ms; --motion-collapse:160ms; --motion-pop:180ms; --motion-expand:200ms; --motion-panel:220ms; --motion-normal:220ms; --motion-view:280ms; --motion-count:700ms;
  --ease:cubic-bezier(.2,0,0,1); --ease-out:cubic-bezier(.16,1,.3,1); --ease-in:cubic-bezier(.4,0,1,1);
  --layer-sticky:10; --layer-shell:20; --layer-panel:30; --layer-overlay:30; --layer-popover:40; --layer-dialog:50; --layer-toast:60; --nav-height:4.5rem;
  color-scheme:light;
}
:root[data-theme="dark"] {
  --bg:#0b1220; --bg-subtle:#0f1828; --bg-muted:#172235; --bg-inverse:var(--neutral-200);
  --fg:var(--neutral-200); --fg-secondary:var(--neutral-300); --fg-muted:#a3b2c7; --fg-subtle:#9aa9bf;
  --fg-placeholder:#9aa9bf; --fg-disabled:#5d6b82; --fg-inverse:var(--neutral-900);
  --border:#24324a; --border-strong:#33445f; --border-subtle:#172235;
  --link:#7cc4ff; --link-hover:#a9e2ff;
  --brand-primary:var(--brand-primary-200);
  --brand-primary-hover:var(--brand-primary-100);
  --brand-primary-pressed:var(--brand-primary-300);
  --brand-primary-on:var(--brand-primary-950);
  --brand-primary-subtle:#0c2647;
  --brand-primary-muted:#123463;
  --brand-primary-text:#8fd3ff;
  --brand-primary-border:var(--brand-primary-300);
  --brand-secondary:var(--brand-secondary-700);
  --brand-secondary-hover:var(--brand-secondary-600);
  --brand-secondary-pressed:#184c9a;
  --brand-secondary-on:var(--white);
  --brand-secondary-subtle:var(--brand-secondary-950);
  --brand-secondary-muted:#13305c;
  --brand-secondary-text:var(--brand-secondary-300);
  --brand-secondary-border:var(--brand-secondary-400);
  --danger:var(--status-danger-dark); --danger-bg:var(--status-danger-dark-bg); --danger-border:var(--status-danger-dark-border);
  --success:var(--status-success-dark); --success-bg:var(--status-success-dark-bg); --success-border:var(--status-success-dark-border);
  --warning:var(--status-warning-dark); --warning-bg:var(--status-warning-dark-bg); --warning-border:var(--status-warning-dark-border);
  --info:var(--status-info-dark); --info-bg:var(--status-info-dark-bg); --info-border:var(--status-info-dark-border);
  --focus:#4db0ff; --focus-halo:#123463; --scrim:#020617b3;
  --shell:#01183a; --shell-raised:#0a2a55; --shell-raised-hover:#11366a;
  --chart-primary:#29b7ff; --chart-today:var(--brand-primary-200); --chart-empty:#24324a; --chart-goal:#33445f; --chart-muted:#5d6b82;
  --cal-meeting:var(--brand-primary-200); --cal-meeting-bg:#0c2647;
  --cal-call:#7cc4ff; --cal-call-bg:#13305c;
  --cal-tour:var(--status-success-dark); --cal-tour-bg:var(--status-success-dark-bg);
  --cal-marketing:var(--status-warning-dark); --cal-marketing-bg:var(--status-warning-dark-bg);
  --cal-now:#f87171;
  --shadow-sm:0 1px 2px #00000052; --shadow-md:0 8px 24px #00000066,0 2px 6px #00000040; --shadow-lg:0 20px 48px #0000008c;
  color-scheme:dark;
}
@media (prefers-color-scheme:dark) {
  :root:not([data-theme]) {
    --bg:#0b1220; --bg-subtle:#0f1828; --bg-muted:#172235; --bg-inverse:var(--neutral-200);
    --fg:var(--neutral-200); --fg-secondary:var(--neutral-300); --fg-muted:#a3b2c7; --fg-subtle:#9aa9bf;
    --fg-placeholder:#9aa9bf; --fg-disabled:#5d6b82; --fg-inverse:var(--neutral-900);
    --border:#24324a; --border-strong:#33445f; --border-subtle:#172235;
    --link:#7cc4ff; --link-hover:#a9e2ff;
    --brand-primary:var(--brand-primary-200);
    --brand-primary-hover:var(--brand-primary-100);
    --brand-primary-pressed:var(--brand-primary-300);
    --brand-primary-on:var(--brand-primary-950);
    --brand-primary-subtle:#0c2647;
    --brand-primary-muted:#123463;
    --brand-primary-text:#8fd3ff;
    --brand-primary-border:var(--brand-primary-300);
    --brand-secondary:var(--brand-secondary-700);
    --brand-secondary-hover:var(--brand-secondary-600);
    --brand-secondary-pressed:#184c9a;
    --brand-secondary-on:var(--white);
    --brand-secondary-subtle:var(--brand-secondary-950);
    --brand-secondary-muted:#13305c;
    --brand-secondary-text:var(--brand-secondary-300);
    --brand-secondary-border:var(--brand-secondary-400);
    --danger:var(--status-danger-dark); --danger-bg:var(--status-danger-dark-bg); --danger-border:var(--status-danger-dark-border);
    --success:var(--status-success-dark); --success-bg:var(--status-success-dark-bg); --success-border:var(--status-success-dark-border);
    --warning:var(--status-warning-dark); --warning-bg:var(--status-warning-dark-bg); --warning-border:var(--status-warning-dark-border);
    --info:var(--status-info-dark); --info-bg:var(--status-info-dark-bg); --info-border:var(--status-info-dark-border);
    --focus:#4db0ff; --focus-halo:#123463; --scrim:#020617b3;
    --shell:#01183a; --shell-raised:#0a2a55; --shell-raised-hover:#11366a;
    --chart-primary:#29b7ff; --chart-today:var(--brand-primary-200); --chart-empty:#24324a; --chart-goal:#33445f; --chart-muted:#5d6b82;
    --cal-meeting:var(--brand-primary-200); --cal-meeting-bg:#0c2647;
    --cal-call:#7cc4ff; --cal-call-bg:#13305c;
    --cal-tour:var(--status-success-dark); --cal-tour-bg:var(--status-success-dark-bg);
    --cal-marketing:var(--status-warning-dark); --cal-marketing-bg:var(--status-warning-dark-bg);
    --cal-now:#f87171;
    --shadow-sm:0 1px 2px #00000052; --shadow-md:0 8px 24px #00000066,0 2px 6px #00000040; --shadow-lg:0 20px 48px #0000008c;
    color-scheme:dark;
  }
}
```
<!-- tokens:end -->

### Colour roles
- Ramps: `neutral` (slate), `brand-primary` (navy, 950 dominant) and `brand-secondary` (accent blue). There is no tertiary palette. `tools/check_colors.py` derives brand families from the `--brand-<family>-text` roles.
- Surfaces: `--bg` (panel), `--bg-subtle` (rails, table heads, the metric strip), `--bg-muted` (chips, tracks, hover). `--bg-inverse` + `--fg-inverse` are tooltips only.
- Text: `--fg`, `--fg-secondary`, `--fg-muted` (metadata), `--fg-subtle` (low emphasis), `--fg-placeholder`, `--fg-disabled` (inactive controls and empty values only). `--link` / `--link-hover` for links.
- Borders: `--border` (structure), `--border-strong` (hover, C and LH class badges), `--border-subtle` (in-card dividers).
- Shell: `--shell`, `--shell-raised` (Ask Brain off), `--shell-fg`, `--shell-fg-strong`, `--shell-fg-icon`, `--shell-muted` (group labels), `--shell-disabled`, translucent `--shell-hover`, `--shell-active`, `--shell-active-border`, `--shell-chip`, and `--shell-gradient` (Ask Brain border only).
- Status: `--success`, `--warning`, `--danger`, `--info`, each with `-bg` and `-border`.
- Charts: `--chart-primary` (bars, progress), `--chart-today` (today, Class A share), `--chart-empty`, `--chart-goal` (dashed goal line), `--chart-muted`.
- Calendars: `--cal-meeting`, `--cal-call`, `--cal-tour`, `--cal-marketing` with `-bg` tints, and `--cal-now`.
- Class badges: A = `--brand-primary` fill, B = `--brand-secondary` fill, C = white with `--border-strong`, D = `--bg-muted`, LH = white with a dashed border.
- Checked pairs (`tools/check_colors.py`): all text roles on all surfaces, brand text on tints, on-colours on fills, status on status backgrounds, link and focus on surfaces, and the shell pairs (labels, muted, disabled and Ask Brain on navy), in light and dark.

## Typography and layout
Inter is the only family (Google Fonts, system fallback), with `cv11` and `ss01` on. The scale is compact and fixed (no fluid type). It was raised one step on 2026-10-02 (default UI 13 → 14px) for readability; every role kept its token:

| Token | Size / line | Use |
|---|---|---|
| `--text-2xs` | 11 / 16 | Notification count, calendar hours |
| `--text-xs` | 13 / 18 | Metadata, captions, chart labels, kbd, section labels |
| `--text-sm` | 14 / 22 | **Default UI**: nav, buttons, rows, links, body |
| `--text-md` | 15 / 24 | Card titles (600), Brain messages |
| `--text-base` | 16 / 22 | Mobile app only: list row titles, choice rows, buttons, body (16 / 24 in paragraphs) |
| `--text-body-lg` | 17 / 26 | The why-now sentence; in the app, bar, sheet and in-card titles |
| `--text-lg` | 20 / 28 | Stat and tile numbers (600) |
| `--text-xl` | 22 / 30 | Page title, greeting, record name (600, −0.01em) |
| `--text-2xl` | 26 / 34 | Dialog title input, emphasised stat |
| `--text-3xl` | 30 / 34 | Pulse numbers |
| `--text-4xl` | 34 / 42 | Predictive score (700) |
| `--text-5xl`–`--text-8xl` | 48–96 | Review hub display only |

Weights: 400 regular, 500 medium (labels, controls, row titles), 600 semibold (headings, numbers), 700 only for the predictive score and confidence percentages. Line heights are paired tokens (`--line-height-xs` … `--line-height-4xl`) plus the unitless tight/snug/normal/relaxed options. Letter spacing: 0, `--letter-spacing-tight` (−0.01em, titles and stats), `--letter-spacing-tighter` (−0.02em, large numbers). Semantic defaults: `h1` 22/30 semibold; `h2` 15/22 semibold; `h3` 13/18 medium muted (section labels in sentence case).

Layout: the main panel pads 28 top / 32 sides / 32 bottom; sections are 28 apart; cards 20 apart; display-tab section headings sit 16 above their content. Toolbar buttons (Today, This week, New event) use the standard 8px radius; the pill shape is reserved for the subtle "Next: Call" button. Meeting times never wrap; calendar event titles end in an ellipsis; compact key/value rows let a long value drop to its own right-aligned line. Rows breathe (designer request, Oct 2): sidebar items are 36 tall with group labels 16 above, list-rail and Brain history rows 36, menu and palette rows 36; cards pad 16 / 12 / 12 (`data-pad="all"` 16, `lg` 20) with 12 under the head, rail cards 16 with 16 between; key/value and timeline rows pad 12 (compact rail rows 10); goal rows 10; listing count tiles wrap to fill rows; wrapped toolbars keep 12 between lines; table rows are at least 68 tall with 12 vertical padding (heads 40); list rows (`.ds-row`) pad 14 vertically (dense 10), call rows and to-dos 12, evidence rows 14, ownership rows 16; two-line row bodies keep 2 between title and subline. Records use a main column plus a 300 rail; Dashboard tabs use main + a 300 right column. Breakpoints: 1360 (Brain overlays), 1180 (sidebar rail default), 1024 (tablet: stack rails and right columns, icon-only search and Links), 768 (phone: drawer, full-screen Brain, peek and dialogs, one column, 16px fields). See the responsive block at the end of `css/product.css`.

## Mandatory shared families (13)

| Family | API and defaults | This direction |
|---|---|---|
| Button | `.button`, `data-size="xs|sm|md|lg"` (24/28/32/36), `data-variant="solid|outline|subtle|ghost|danger"`, `data-shape="pill"`, `.button--icon` | Navy solid; outline is white with a slate-200 border; subtle is the pale-blue pill; 8px radius; press scales to 0.98; disabled is colour only |
| Field | `.field`, `__label`, `__control`, `__help`, `__error` | 32px, 14px, slate-200 border, navy focus with a pale halo; labels 13px medium muted |
| Checkbox | Native in `.choice` | Navy accent; product rows use `.ds-box` / `.ds-check` |
| Radio group | Native in a fieldset | Outcome choices use `.ds-opt` (role radio) |
| Switch | `.switch` | 32 × 18 navy track; product toggles use `.ds-tog` |
| Surface | `.surface` | 12px radius; raised adds a border and `--shadow-md` |
| Badge | `.badge`, `data-status` | 22px, 6px radius, bordered; trust badges add an icon |
| Tabs | `.tabs__list` + `.tabs__tab` (links with `aria-current` or buttons with `aria-selected`), `.tabs__divider`; `.segmented` | 36px, 24px gaps, 2px navy underline; segmented slate track with a white thumb |
| Alert | `.alert`, `data-status` | Bordered, 8px radius, icon + words |
| Dialog | Native `dialog.dialog` (system); product dialogs use the same recipe in an overlay | 12–16px radius, slate scrim |
| Avatar | `.avatar`, `data-size`, `data-shape="square"` | 28px tinted initials |
| Search field | `.field` + `.search` | Icon inset 10px |
| Dropdown menu | `.menu`, `.menu__item`, `.menu__label`, `.menu__divider` | 36px rows, 10px radius, `--shadow-md` |

Added core recipes for clear unmet needs: `.tooltip` (one pattern for every disabled control and icon-only button, 300ms delay), `.toast` (bottom centre, announced through a polite live region), `kbd`, `.segmented`.

## Product patterns (`css/product.css`, `js/product.js`)
Shell (`.ds-sidebar`, `.ds-nav`, `.ds-nav-group`, `.ds-topbar`, `.ds-crumbs`, `.ds-search-trigger`, `.ds-ask`), page head (`ui.pageHead`, `ui.tabs`, `ui.nudge`), cards and rows (`.ds-card`, `.ds-row`), class and trust badges (`ui.cls`, `ui.trust`), chips (`.ds-chip`, `ui.scoreChip`), progress and charts (`ui.progress`, `ui.bars`, `ui.hbars`, `ui.line`), the why-now card and evidence rows (`.ds-why`, `.ds-evidence`), the record header and rail (`.ds-rnav` holds Back and, on contacts, Next owner; `.ds-rhead` is identity on the left and actions on the right, labelled actions on top with quiet icon tools under them, dropping below the identity under 1280; `.ds-record`), the property record's key-facts strip (`.ds-statrow[data-compact]`, always one row), why-now lines and distress signals (`.ds-whylist`, `.ds-signals`, `.ds-signal[data-on]`), storefront override (`.ds-storefront`) and ownership row (`.ds-ownrow`), the accordion list (`ui.acc`, `ui.kv`), the live-call and outcome bars (`.ds-livebar`, `.ds-outcome`), the data table (`.ds-table`, `.ds-tr`), report blocks for the display tabs (`.ds-stat__label` with an optional disabled tool, `.ds-stat__cmp` comparisons, `.ds-delta` up / warn / flat with an arrow and the signed figure, `.ds-statrow[data-stack]`, `.ds-two[data-ratio="wide"|"even"]`, `.ds-effmetric`, coverage tiles `.ds-cov` sorted weakest first with `[data-thin]` under 5%, the funnel `.ds-funnel`, the plain data table `.ds-dtable` with right-aligned `[data-n]` numbers, listing cards led by an edge-to-edge street view (`.ds-listing__photo`: 12:5 on wide screens, 2:1 on phones and in the app; the art is drawn at 12:5 so the narrower crop only trims the neighbouring buildings), listing counts with Auto or a disabled Log, and the inquiry row `.ds-inq` with `[data-new]`), the peek drawer (`.ds-peek`), the ⌘K palette (`.ds-palette`), Brain (`.ds-brain`, `.ds-chat`, `.ds-composer`, `.ds-brain-min`), calendar (`.ds-calgrid`, `.ds-ev`, `.ds-draft`, `.ds-month`) and the conversations board (`.ds-board`, `.ds-conv`). `system.html` › Product patterns renders them with the same helpers.

**Behaviour.** Screens register with `DS.define()`. Every move between screens is a real link from `Nav.route()`, but in the running prototype it doesn't load a new document: the runtime fetches the target page, runs its screen script, re-renders in place and pushes the URL (back and forward work; links are warmed on hover). The shell, Brain and the live-call timer stay mounted, so a Brain answer keeps streaming while Thomas moves around. Modified clicks (new tab), exported portal files, `file://` and any fetch failure fall back to a normal page load. The player follows in-place switches through a `screenchange` event on the frame's window. Screen-level keyboard handling goes through `onKey` on the screen definition, never a document listener, so revisiting a screen never stacks handlers; a one-shot `act=call` / `act=log` trigger starts a call or a hand-logged outcome and then removes itself from the address. Demo data persists in local storage (`ds-proto-v2`); session UI (sidebar rail, Brain panel, chat, live call) in session storage. Presets that change demo data render a snapshot and never save. Keyboard: ⌘K palette (↑↓, ↵ open, ⇧↵ preview), ⌘J Brain, `[` sidebar, Esc closes the top overlay, ↑↓ step the peek, arrow keys move between in-page tabs.

**Motion.** Motion explains state and confirms actions; it never decorates (Operate mode). Tokens: `--motion-fast` 120 (hover, press), `--motion-exit` 140, `--motion-pop` 180 (menus, popovers), `--motion-expand` 200, `--motion-panel` 220, `--motion-view` 280 (screen changes, slides), `--motion-count` 700 (numbers); `--ease-out` `cubic-bezier(.16,1,.3,1)` for arrivals, `--ease-in` for exits (exits are faster than entrances).
- **Focal moment, the call loop:** the navy live-call band unrolls from the top of the panel; End call grows the outcome tray; the picked outcome gives a soft press; Save shows a busy state, folds the tray away and raises "Call logged"; the next screen counts the calls number up (6 → 7) and fills its bar from the old value. Counters (`data-count`) and bars (`data-bar`) remember the last value seen in this session, so the payoff carries across screens.
- **Continuity:** moving between pages or Dashboard tabs feels like one platform: the sidebar, top bar, Brain, the white panel and the page heading with its tabs stay exactly in place (swapped with no movement, resize or fade), and only the work below the heading fades in, in the same spot, over `--motion-normal` (`ds-content`, `ds-page-head` in `css/product.css`). No sliding, no expanding, no fade-out to an empty panel (designer feedback, Oct 2); the active-nav fill (`.ds-nav__ink`) and the page-tab underline (`.tabs__ink`) glide to the new item; the peek's avatar and name morph into the record header on "Open full page"; Brain morphs between the minimized pill and the panel; the theme switch crossfades the whole page. In-page indicators (state-tab underlines, segmented thumbs, switch knobs) slide with FLIP (`data-flip`), measured inside their control so page reflow never moves them. In-page content swaps (Attack Plan day and week, Calendar ranges, the Conversations week, record tabs, stepping the peek) use the same in-place fade, with no travel.
- **Feedback:** disclosures (accordions, Why this?, the outcome tray, notes) grow open and fold closed; completed to-dos fold out of the list; checks pop (`data-tick`) when they turn on, including the "Called" check seen on return; overlays (peek, palette, dialogs, toast, Brain) leave as well as arrive; buttons press to 0.98, icon buttons to 0.92; row chevrons and link arrows nudge 2px on hover; the Send arrow lifts; the Ask Brain sparkle turns.
- **Rules:** nothing animates on first paint (no load choreography); an element already on screen never replays its entrance; content stays visible by default; only transform and opacity, except height on single disclosures and width on progress fills. Reduced motion turns off View Transitions, FLIP, counting and bar growth, and keeps short fades. `?preview=still` settles everything.

### Sizes and interaction
Controls are 32px (sm 28, xs 24, lg 36); 44px targets apply on coarse pointers. Use native buttons for actions and anchors for navigation. Do not make a div clickable or nest controls inside a clickable surface (table rows are the documented exception: the row and its name button share one action).

### Surface freedom
Use a surface when content benefits from grouping. Lists inside cards are rows on white, not nested cards.

## Mandatory mobile primitives (5)
Kept from the template and shown in `system.html`; Death Star screens do not use them: it is responsive web, and on phones it keeps its own shell (drawer, compact top bar, full-screen Brain) rather than an app header and bottom navigation.
- App header, bottom navigation, sheet, sticky action bar, list row (see the template definitions in `css/mobile-components.css`).

## Project modes
Both modes are enabled (`enabledModes: ['responsive-web', 'mobile']`); `responsive-web` is the default. Review viewports: desktop 1440 × 900, tablet 1024 × 768, mobile 390 × 844 for the web's phone layout; the mobile app mode uses its own 390 × 844 device frame. The web's phone layout and the mobile app are different things: the first keeps the navy shell (drawer, compact top bar), the second is the app below.

## Mobile app (concept exploration)
**Direction status: concept exploration, not yet approved** (designer request, Oct 20, 2026). The app adapts the established web direction to native iOS patterns; tokens, type, colour roles, trust badges and class badges are shared and unchanged. References (Mobbin, iOS): Asana Home (date and greeting over stacked cards, one full-width action), Attio (records, lists, filter and view chips), Quo and OpenPhone (centred identity, square quick actions, label and value rows), ChatGPT and Perplexity (sources), Outlook and Toggl (week strip over a day timeline), ElevenLabs (tab bar). The app look (designer request, Oct 20): Neo Financial (spacing, type and buttons; grey canvas with borderless white cards), Public and Shopify (floating pill tab bar), Revolut and WHOOP (a gradient hero; here the web's navy, light everywhere else).

- **Structure.** Pages live in `pages/app/` with `body[data-shell="app"]`; `js/product.js` renders the app shell instead of the navy frame (`DS.app`). Routes keep the web names, so shared helpers and reused screen scripts link inside the app; the four reports reuse `js/screens/display.js`. Screens describe their header with `head()` and their floating button with `fab()`.
- **Frame.** No navy frame. A subtle slate canvas runs top to bottom (`--app-canvas-top` to `--app-canvas-bottom`: `--bg-muted` to `--border`; dark `--bg` to `--bg-subtle`) and content sits on borderless white cards (`--app-card`; dark `--bg-muted`). The 44-tall header floats over the content: transparent at rest, frosted canvas once something scrolls under it, the compact title fading in. Header controls are 40 round chips on the card colour, 8 apart, the outer ones on the page margin (44 hit areas); back is a blue text link with a chevron. Home opens on a navy hero (`--shell` with a blue glow top right, fading into the canvas and scrolling with the page) that carries the date, the greeting and the day's line in white, with translucent chips and the account at the leading edge (as in Revolut); its `theme-color` is navy and switches to slate once the hero scrolls away (`data-scrolled` on the meta). The tab bar is a floating pill (Public): five tabs, Home · Today · Brain · Database · More, with labels, 64 tall, 16 from the edges, frosted, the current tab in a soft inner pill with a **filled** icon and navy label. The call pill, the floating button and toasts sit above it; pages pad their bottom so the last row scrolls clear. Device insets come from `env(safe-area-*)` or the review frame (`--device-top`, `--device-bottom`).
- **Type** (Neo, designer request Oct 20). Large titles 26/34 bold with an optional 13 subline above; record names 26/34 bold; group labels above lists 15 medium (reused report section heads too); card titles 16 semibold (in-card report titles 17); bar titles 16 semibold, back links 17; rows 16 regular over 13 secondary lines, values 16; body in cards 14 (`.ds-why`), ledes 15; tile values 22 semibold; tab labels and badges 11, the smallest size used. Fields stay 17 so iOS never zooms. Bold is new for the app's titles (on the web 700 is only the predictive score).
- **Spacing.** Side margins 16, 20 from 414 wide (`--app-pad`, set on `[data-shell="app"]` so sheets, the chats drawer and the showcase frames share it). Sections 32 apart, a label 10 above its card; rows 64 tall, 14 × 16 inside with 40 lead tiles; tiles and cards 16 inside (plan cards 20 at the top and bottom).
- **Recipes** (`css/product.css`, the App shell section, then the App look section, which wins where both set a value): `.ds-apage` (page margins, 32 between sections), `ui.large`, `.ds-ahead`, `.ds-alist` + `.ds-arow` (inset dividers, 64 tall, optional 40 lead tile), `.ds-acard` (plan cards), `.ds-atiles`/`.ds-atile` (two-up stats), `.ds-qacts`/`.ds-qact` (square quick actions; the call one is the filled primary), `.ds-aid` (centred identity), `.ds-achips` + `.ds-fchip` (scrolling filter chips; pressed is pale blue), `.ds-asearch`, `.ds-daystrip`, `.ds-agenda`, `.ds-fab` (56 round, bottom right), `a.segmented__item` (segmented links between pages), `ui.sheet` + `.ds-opts`/`.ds-optrow` (bottom sheets with radio or check rows, a grabber, a sticky footer; `sheet=<name>` opens one as a preset), `.ds-callpill` and `.ds-callcard`, and the web's chat drawer (`ui.chatDrawer`) for Brain's history, opened from a sidebar button at the leading edge of Brain's header.
- **Targets.** Everything tappable is at least 44: icon buttons inside content and sheets (week steppers, call buttons) are 44 round; filter chips draw at 36 and extend their hit area to 44.
- **Rules.** One filled primary per screen (the Call tile drops to outline once a call is logged and "Call the next owner" takes over). Buttons are 48 tall with a 10 radius and 15 semibold labels; secondary buttons are filled light slate (`--app-btn2`), not outlined; compact buttons are 36. Segmented tracks sit a step darker than the canvas (`--app-seg`) and search fields are white, so both keep their shape on slate. Brain's composer floats on the canvas, its band fading in behind it. Polish pass (Oct 20): disabled secondary buttons stay filled and faded; reused report blocks (`.ds-metrics`, `.ds-statgrid`, `.ds-statrow`, `.ds-acc`) take the card treatment with `--app-divider` lines; report section heads are group labels (15 medium) and their card titles 16; the report date range is a white 44 control; an odd last tile spans the row; emails break after the @; search is a full-screen sheet with Cancel and no keyboard hints. Choices that open lists use sheets, never dropdown menus; selects stay native inside sheets. The navy live call is the one dark surface inside content (as the web's live-call band is): a card on the record, a floating pill above the tab bar elsewhere. Shadows only on things that float (sheets, the pill, the floating button, toasts).
- **Motion.** Sheets rise over `--motion-view` and drop on close; the chats drawer slides in from the left and back out; the call pill rises; tab icons press to 0.9. Everything else follows the web's motion rules.


## Accessibility and behavior
Landmarks (`nav` Main, `header`, `main`, Brain `aside`), a skip link, one `h1` per screen, labelled icon-only controls, `role="tablist"` with arrow keys, `aria-live` for toasts, the call timer and Brain streaming, `aria-current` on the active nav item and tab, `aria-pressed` / `aria-checked` on toggles and choices, focus restoration across re-renders. Disabled controls remain focusable with a tooltip. Trust and status never rely on colour alone. Reduced motion is honoured.

## Extension discipline
1. Check direction status first. The direction is established: extend with the existing tokens and recipes; add the smallest coherent extension only for a clear unmet need, and record it here.
2. Prefer composition; add a token or recipe only for a clear unmet need and record it here.
3. For any new core token or component, update DESIGN.md, CSS/behaviour and `system.html` together.
4. Keep review chrome isolated. Never solve a product layout problem with parent-frame styles.

## Icons
Phosphor 2.1.1 (`assets/phosphor/icons.svg`), **regular** weight for every interface icon at 16–18px, inheriting text colour; fill only for solid check states in the starter set and, in the mobile app, the current tab (24px, house, sun, sparkle, database, dots-three-circle). Brand art: the favicon (`assets/favicon.svg`). In static HTML use `<svg … data-phosphor="name-regular">` and run `python3 tools/sync_icons.py`; product JS renders icons from `js/phosphor.js` through `DS.icon(name)`. Concept mapping (Hugeicons → Phosphor), for example: Home01 → house, DashboardSquare01 → squares-four, Sparkles → sparkle, Database01 → database, Call02 → phone, CallEnd01 → phone-disconnect, Mail01 → envelope-simple, Message01 → chat-text, Building03 → buildings, CheckmarkBadge01 → seal-check, AlertCircle → warning-circle, AlertDiamond → warning-diamond, Calendar03 → calendar-blank, ArrowRight01 → caret-right, SidebarLeft01 → sidebar-simple, ArrowExpand01 → arrows-out-simple.

## Review hub presentation
The hub uses a typography-led landing-page layout with a spacious project-title hero and a separate top-right theme control. Two equal, generously padded outlined cards present mobile and responsive web, each with large Prototype and Canvas view buttons. They stack on mobile and form two columns from 768px. Review-only card minimum heights are 20rem on mobile, 24rem from 768px, and 26rem from 1000px; these are layout geometry, not core component sizes. A compact, visually quieter third card opens the shared design system. No hub preview, mode selector, or About section. Preserve the footer. Card composition belongs exclusively to prototype/shell.css and does not create a core card component.

## Shared review navigation
Prototype, canvas, and system use one fixed top-right hamburger at every viewport width and in both project modes. Home keeps its existing layout and theme toggle. The native auto-popover contains Light/Dark radio choices, Restart prototype only on prototypes (with a restart icon), Design system (paintbrush), and Back to home (back arrow). Below a divider, a Canvas/Prototype segmented navigation control sits above the Screen selector on prototypes or viewport/Scale controls on the canvas. Back to home is the final menu item, below all settings and a second divider. The selected view is marked with aria-current; on the design-system page neither view is selected. It uses native links and form controls, Tab navigation, Escape dismissal with focus restoration, and outside-click dismissal. It is navigation with form settings, not an ARIA action menu.

Prototype and canvas show only their content outside this menu; canvas screen labels are part of the canvas. The system removes its old utility header and mode selector while retaining its showcase title and section navigation. Mode, selected screen, canvas scale, and viewport filter travel in review URLs. Canvas Open links enter the review player at the chosen screen; internal product navigation updates the current screen when it matches the manifest. Restart resets the selected screen to the first entry in the current mode’s screens array and reloads its product document, even when that screen is already selected. Screen selection, canvas scale, and web viewport filtering live inside the menu.

The menu trigger is 48px square with an accessible name and visible keyboard focus. Its panel respects safe areas and scrolls in short viewports. Mobile prototypes below 700px retain an 80px top strip plus the top safe area; canvas and system reserve top space for the menu. Responsive-web prototypes instead place the menu over full-height content at every width. Review navigation and behavior are isolated in prototype/review-menu.js, prototype/shell.js, and review styles. Light is the initial default; theme changes preserve mode and selected screen and refresh previews in the chosen theme. Product-safe js/theme.js honors explicit URL or saved light/dark preferences.

Preview iframes use lazy loading in both the player and canvas; this resolved the in-app browser annotation failure in user verification. Keep that attribute when changing the shell. Mobile canvas previews default to 75% scale and responsive-web previews to 50%; an explicit scale URL parameter takes precedence.

Empty project manifests show a review-only empty state in player and canvas, with unavailable screen/restart/scale controls disabled. No product iframe is loaded until screens exist.

Home always retains both mode cards. config/project.js enabledModes determines which are active (null while undecided). Unselected cards use muted surfaces and disabled text, with aria-disabled links removed from tab order and without href destinations. The Design system card remains active.

## Portal export
The Designli Design Portal serves one self-contained HTML file per screen state, one folder per flow, and renames the files. The template keeps authoring simple (one page per screen, states as presets) and generates that format on demand with `tools/export_portal.py`.

### Declaring flows and states
In `config/project.js`, each mode lists `flows` in journey order (`id`, `title`, `goal`, `entry` screen id, optional `next: [{flow, on}]` for the portal's journey map). Each screen names its `flow`, its `kind` (`form`, `data`, `choice`, `confirmation`, `result`, `info`; this sets which states the portal expects), an optional `primaryAction`, its extra `states` (name → preset query, for example `SavedTab: 'tab=saved'`), and `waivers` for required states that cannot exist, each with a fact as the reason. State names use the portal vocabulary (Default, Loading, Empty, Validation, Submitting, Error, Success, Disabled, Selected, Partial, Stale); other names become `Custom-<Name>`. A project without `flows` exports as one flow named after the project.

The player lists each state under its screen (`?screen=<id>&state=<name>`), and the canvas shows each state as its own frame. Canvas frames load with `?preview=still`.

### Navigation contract (`js/navigation.js`)
`Nav.params` merges the URL with an exported file's baked-in preset. `Nav.go(name, query)` and `Nav.replace(name, query)` navigate through the page's link to that destination, so a host that renames screens still resolves them (`js/product.js` routes both through its in-place screen switch, keeping the same resolved link); script-driven destinations get a hidden link:

```html
<nav hidden data-routes aria-hidden="true"><a data-route="details" href="details.html">Finish recording</a></nav>
```

The link text is the transition label on the portal. `Nav.advance(fn, ms)` runs timed moves only in a real click-through (never with `?preview=still`, and in an exported file only when arriving from a sibling screen). `Nav.asset(path)` returns the embedded copy of an image in exported files. With `?preview=still`, finite entrance animations finish on load so frames render settled.

### Export output
`python3 tools/export_portal.py` (Node reads the manifest) writes `design/flows/<flow>/NN-Step-State[-Mobile].html` with local CSS, scripts, and images inlined (raster images shrunk to 800px when `sips` is available), links rewritten to exported names, and the preset baked in; `flow.json` per flow and `design/prototype.json` from the manifest, merged so the portal plugin's sync fields survive; and `design/export-stamp.json`, a fingerprint of `config/`, `pages/`, `css/`, `js/`, and `assets/`. Mobile projects export mobile files; responsive-web projects export a desktop and a mobile file per state. The export is committed with the project so the portal plugin's records stay beside it.

`tools/check.py` warns when the export is older than the source; `tools/export_portal.py --check` exits non-zero. The project hook in `.claude/settings.json` runs `--hook` before the portal plugin's publish (the MCP tool or `portal.mjs publish`) and blocks it while the export is stale. Links between flows remain relative paths the portal does not rewrite, so the portal's click-through stops at a flow boundary; the journey map shows the connection.
