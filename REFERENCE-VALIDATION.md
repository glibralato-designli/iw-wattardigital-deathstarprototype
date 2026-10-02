## 2026-09-28 — Mobile chrome overlays

Verified using tools/preview.py and the in-app browser with temporary mobile manifest screens, removed after testing; the original empty manifest was restored.
- At 1440px browser width, device and iframe measured 390 × 844 with the same top position. Status/home overlays measured 44px/28px, absolute, transparent, and pointer-events:none.
- Product root received data-device=framed; app-header top padding measured 56px (12 + 44), sticky-actions bottom padding 28px. Product background extends behind both overlays.
- Plain in-frame links, theme switching, first-screen Restart, and screen selection retained framed insets; URL screen state followed navigation.
- Resizing to 390px cleared the signal; iframe began at y=80 with height=764 in an 844px viewport. Header/actions reverted to 12px/16px padding. Directly opened product page had the same native-only padding and no framed marker.
- Canvas iframes remained 390 × 844, loading=lazy, empty names, and no framed marker.
- Existing responsive-web overrides remain intact; no product web fixture or physical-device safe-area test was performed. Real env() insets are preserved by max() rules.
- Browser testing required synchronizing contentWindow.name as well as the iframe name attribute. Products still read only their own window.name.

# Current starter status — 2026-09-25

Sample product screens and their styles/interactions have been removed. Reference observations and product checks below are historical, not current shipped screens. The starter now supports concept exploration with an editable shared foundation, user concept approval, then consolidation and consistent expansion. Empty manifests retain player/canvas navigation without loading a product iframe. The iframe diagnostic is retained with neutral inline content.

Verification for this change: project checks pass (token sync, 112 color pairs, typography, references, IDs, labels, and layer boundaries). A temporary typography fixture confirmed new shared styles are accepted and raw numeric overrides rejected. Browser checks covered empty mobile prototype/menu, dark mobile canvas at 390px, and empty web prototype. Annotation behavior itself was not re-tested.

# Reference validation

Inspected 23 September 2026. These references inform architecture, not a full visual clone.

## PetConnect attachment
Read the attached archive's index.html, styles/responsive.css, styles/app.css, theme tokens and product/design documentation.

Observed in styles/responsive.css:
- Base state hides review sidebar, viewport controls, and canvas note.
- From 700px the phone frame is fixed to its configured dimensions and gains rounded edges and shadow.
- From 1000px the sidebar and canvas note appear.
- Theme tokens define a 390 × 844 primary viewport and safe-area-relevant app geometry.

Current mapping: prototype/mobile-shell.css retains the reference’s frameless mobile / framed desktop distinction at 700px. The reference sidebar and canvas note are not part of the current starter; a shared hamburger menu is available at every width. Product content lives in separate documents, preventing device/frame styling from entering product CSS. Generic app header, navigation, sheet, list row and sticky action behavior live in mobile-components.css. Care search, provider layouts, and booking details stay in product.css / product.js.

## Orthodontic Network
Reference: https://orthodontic-network.designli.io/

Observed the live public sign-in screen in the browser. Its Mobile / Responsive review selector exposes a compact authentication layout versus a desktop split layout with a community message and form. The web text-fetch tool could not retrieve the site; browser inspection succeeded.

Mapping: pages/web-signin.html uses one responsive document with an informational side panel from 768px. screens.html loads that same URL into independent 390px and 1440px iframes, with optional 768px tablet. No review-mode switch is injected into the product page.

The sample member directory is an original stress test of shared search, avatar, menu, field, surface and responsive navigation patterns. It is not an inspected authenticated screen from the reference site.

## Chakra
Reference: https://chakra-ui.com/docs/theming/overview

Borrowed the architecture of primitive values → semantic roles → recipes with defaults, sizes, variants and states. Implemented in plain CSS and native HTML. No Chakra runtime, React, Tailwind, or copied client assets.

## Validation record
The checks below record the initial implementation. Later changes supersede the historical shell behavior; see the current review behavior section below and DESIGN.md for the current specification.

### Initial implementation checks (historical)
- Static checks passed: canonical token synchronization, local references, unique HTML IDs, label targets, CSS variable definitions, and product/review isolation.
- JavaScript syntax checks passed for all scripts.
- All seven content/review pages checked at measured CSS widths of 320, 390, 768, and 1440px. No document-level horizontal overflow; the review canvas scrolls intentionally inside its region.
- Mobile player checked at 390, 699, 700, 999, 1000, and 1440px. At 699px and below it fills the viewport without a frame or controls. At 700px the 390 × 844 frame and controls appear. At 1000px the sidebar appears.
- Responsive canvas confirmed identical page URLs at 390px and 1440px. At 50% zoom the visual widths halve while the iframe layout widths stay unchanged. Tablet preview uses 768px.
- Dialog and full-screen sheet: opening, Escape, forward/backward focus wrapping, and return to trigger checked. Menu → dialog → trigger focus return checked.
- Tabs: keyboard arrow selection and panel activation checked.
- Dropdown: arrow navigation, selection, Escape, and expanded-state behavior checked.
- Pet-care search, clear, category filtering, date entry, and local request confirmation checked.
- Web sign-in, show-password toggle, directory search, career-stage filter, empty state, profile dialog, account menu and mobile navigation checked.
- Light and dark showcase rendering inspected.

### Practical limits
Browser checks used the available desktop browser with emulated CSS viewport sizes, not physical iOS/Android devices or a full cross-browser test suite. Safe-area behavior is implemented but needs device testing in a real project. Native controls may differ across browsers.

The browser tool emitted unattributed MutationObserver errors during inspection. No template script uses MutationObserver or loads a third-party JavaScript library; these messages could not be attributed to template code. Static script checks and the interactions above passed.

## Foundation expansion — 2026-09-23
- Added replaceable/established direction guidance: broad exploration when defining identity; consistent reuse and justified additions during product growth. Layout freedom and product/review isolation remain intact.
- Added four 50–950 ramps (neutral plus three brands), independent status colors, text hierarchy, branded text, inverse roles, and brand action states. Third brand palette is optional. Existing accent names remain aliases to the primary brand.
- `tools/check_colors.py` checks 112 explicit light/dark role pairs, including action hover/pressed colors, plus parity of explicit and system dark definitions. Readable text targets 4.5:1; borders/focus target 3:1 for the documented pairs. Disabled text is excluded; arbitrary product combinations still require review.
- Browser checks: foundation showcase has no horizontal overflow at CSS 320px and 1440px; palette disclosure reveals 44 swatches; secondary palette button triggers its example status. Inspected light desktop and dark mobile foundations and dark desktop button recipes.
- Mobile home and responsive directory remain free of outer horizontal overflow at CSS 320px and 1440px in both themes.

## Default visual theme — 2026-09-24
- Visual references inspected: [Supabase light dashboard on Mobbin](https://mobbin.com/screens/2e0ffd2d-c588-4513-bd84-d3effa2e31ed) and [Supabase dark dashboard](https://mobbin.com/screens/782baf2b-1d87-4a1c-a461-a87acc585ba9). Applied neutral surfaces and mint emphasis only, not reference components or layouts. Plus Jakarta Sans is the user's chosen family for headings and UI.
- Bright mint fills use dark text; green text/icons and selected tab borders use separate contrast-safe roles. Secondary/tertiary and status palettes remain available.
- All 112 light/dark color-pair checks pass, minimum readable-text contrast 4.89:1. Architecture and token-sync checks pass.
- Compared with the prior files: component/product recipe changes are color-only; geometry, layout utilities, JavaScript, and project configuration are unchanged.
- Browser verification: hub, system showcase, and all four product pages at CSS 320px and 1440px in light and dark themes (24 views) report no outer horizontal overflow and the Plus Jakarta Sans font stack. Visually inspected the light hub and dark component showcase.

## Hub presentation — 2026-09-24
- Consulted [Supabase project overview on Mobbin](https://mobbin.com/screens/2438c4be-09e2-4dd4-bfce-d54927affdf1) for restrained outlined cards and whitespace. Built original Mobile app and Responsive web launch cards, plus a smaller shared design-system card. Removed the hub iframe preview, mode selector, About section, and their unused styles/orchestration. Footer retained.
- Replaced theme dropdowns with native Light/Dark radio toggles on hub, canvas, and system. Light is the default. Keyboard arrow selection preserves focus; themes carry through links and iframe previews without resetting canvas filter or scale.
- All five hub destinations were exercised in the browser: mobile prototype, mobile canvas, web prototype, web canvas, and design system. Verified correct mode and configured entry routing.
- Hub, canvas, and system show no horizontal page overflow at CSS 320px and 1440px in both themes (12 views). Visually inspected desktop light and mobile dark hub layouts.
- Verified no hub iframe, mode selector, or About disclosure remains. All token, color contrast, local-reference, ID, label, variable, and layer-isolation checks pass.

## Shared typography — 2026-09-24
- Adopted Chakra-inspired named text styles with a custom compact scale: XS 12, SM 14, MD 16, LG 20, XL 24, 2XL 32px. Only Regular 400, Medium 500, and Bold 700 are loaded and used. Fixed line-height ratio 1.5 and letter spacing 0 apply throughout.
- Removed semibold, the larger type sizes, fluid font sizes, and per-page tracking/line-height overrides. The hub and system page titles now have identical computed typography: 32px, 700, 48px line height, normal (zero extra) letter spacing.
- Added a dedicated Typography section and navigation link to system.html, listing all 18 size/weight combinations, shared metrics, usage, and the common home-title example. Verified every specimen's computed size, weight, line height, and tracking in the browser.
- Added tools/check_typography.py to the standard check command to catch undeclared sizes/weights and local line-height/tracking overrides. All architecture, token, color, and typography checks pass.
- Verified eight review/product pages at CSS 320px and 1440px in light and dark themes: no outer horizontal overflow. Visually inspected desktop light and mobile dark typography specimens and the desktop hub.

## Current review behavior — 24 September 2026
This section supersedes the initial sidebar and review-control behavior above. Reference observations remain a record of the original projects, not requirements to recreate their review UI.

- Prototype, canvas, and system share a top-right hamburger at every width; no prototype sidebar or caption remains.
- Mobile prototypes remove device chrome below 700px and reserve an 80px menu strip plus the top safe area. Desktop mobile prototype frames are 390 × 844 overall, including the 44px status bar and 28px home-indicator area; the product iframe is 390 × 772. Canvas mobile previews remain 390 × 844 without device chrome.
- Responsive-web prototypes fill the browser viewport. The hamburger overlays the content; there is no reserved top strip. Desktop and mobile geometry were checked after this change.
- The menu presents Light/Dark, Restart prototype (player only), Design system, and Back to home. Below the first divider, Canvas/Prototype navigation precedes Screen or viewport/Scale settings. Back to home is last, below a second divider.
- Restart now reloads the first screen in the selected mode’s manifest. Returning from Find care to Home was verified in the browser.
- Mobile canvas scale defaults to 75%; responsive-web defaults to 50%. An explicit URL scale takes precedence.
- Both player and canvas use lazy-loaded iframes. The user confirmed annotations work after adding lazy loading to the isolated test and then the player; no iframe removal was needed.
- Local preview now uses tools/preview.py with no-cache responses and server-injected automatic reload. A file-change test verified reload of the top page and embedded screen while preserving screen, theme, and scale URL settings. Unsaved form input may reset. This helper is not written into exported product HTML.

These updates do not constitute a fresh full cross-browser or physical-device test. The practical testing limits above still apply.

## Design Portal export — 2026-09-30
- Added `js/navigation.js` (route links, state presets, guarded timed moves, still previews, embedded asset lookup), `tools/export_portal.py`, and a PreToolUse hook in `.claude/settings.json` that blocks the portal plugin's publish (MCP tool or `portal.mjs publish`) while the export is stale. Manifests gained `flows` and per-screen `flow`, `kind`, `states`, `waivers`, and `primaryAction`; both stay empty in the master.
- The player lists declared states under their screen (`?state=`), and the canvas renders one frame per state; canvas frames load with `?preview=still`.
- `tools/check.py` and `tools/check_typography.py` skip `.claude/` and the generated `design/` folder, and `check.py` warns (does not fail) on a stale export. `tools/preview.py` also accepts its port from `PORT`.
- Verified on a scratch copy with four screens in two flows (a state preset, an embedded image set by script, a script-driven move, a cross-flow link): the export wrote five files, `--check` passed, and a source edit made it report stale. The designli-design 0.3.0 bundler accepted both flows: mobile-only screens at 390 × 844, the state as its own screen, transitions inferred (including from the state), entry points and `next` carried. In a browser, the player loaded "Library · Saved Tab" with its preset, the canvas showed the state frame with `preview=still`, the exported state file loaded with no external stylesheet or script and its embedded image, and the script-driven Continue reached the exported Library file. The hook blocked the MCP publish and a `portal.mjs publish` command, and let other shell commands through.
- Not verified here: a real portal upload from a fresh project (Memory Lane on its own export is the precedent), and responsive-web exports in a browser.
