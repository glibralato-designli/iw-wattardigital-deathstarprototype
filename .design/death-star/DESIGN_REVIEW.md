# Design review: Death Star prototype (final build)

Reviewed against: `.claude/handoff/project/.design/death-star/DESIGN_BRIEF.md`, `PRODUCT.md`, `DESIGN.md`
Philosophy: 5b · Navy shell (Attio precision, Asana navy chrome, ElevenLabs Home order; calm, flat, trust-first)
Date: 2026-10-02
Build: `pages/` (13 screens), Core 1.0 plus the product layer, direction established Oct 2

## Screenshots Captured

> Later the same day the product became responsive down to 390 phones (designer request). The 1024 and 390 captures below predate that and show the old laptop floor.

All are in `.design/death-star/screenshots/` (69 files). Mobile and tablet are out of scope by the brief; the agreed floor is 1024 wide, so those captures show the 1024 floor and one 390 capture for the record.

| Screenshot | Breakpoint | Description |
| --- | --- | --- |
| `review-<screen>-desktop-1440.png` (13) | Desktop 1440×900, full page | Every screen, light |
| `review-<screen>-dark-mode-desktop-1440.png` (13) | Desktop 1440×900 | Every screen, dark |
| `review-{home,attack-plan,contact,contacts,calendar,brain}-desktop-1280.png` | 1280×800 | Brain overlays below 1360 |
| `review-{…same six…}-laptop-1024.png`, `review-conversations-laptop-1024.png` | 1024×768 | Laptop floor, sidebar rail |
| `review-home-mobile-390.png` | 390×844 | Out of scope: page holds its 1024 minimum and scrolls sideways |
| `review-state-contact-{livecall,outcome,whythis,logged,dnc,disputed}-1440.png` | 1440 | Call loop and trust states |
| `review-state-contacts-{peek,peekcenter,loading,error,empty,palette}-1440.png` | 1440 | Database states, ⌘K results |
| `review-state-attack-plan-{empty,week,picker}-1440.png` | 1440 | Plan states |
| `review-state-brain-{empty,thinking,list}-1440.png` | 1440 | Brain states |
| `review-state-calendar-{dialog-clash,month}-1440.png`, `review-state-conversations-dialog-1440.png` | 1440 | Dialogs, month view |
| `review-state-home-{guide,menu,rail}-1440.png` | 1440 | Guide, account menu with theme switch, rail |
| `review-state-*-dark-mode-1440.png` (3) | 1440 | Outcome, peek, clash dialog in dark |
| `review-interaction-pulse-hover-1440.png`, `review-interaction-focus-ring-1440.png` | 1440 | Hover and keyboard focus |

## Summary

The build carries the 5b direction faithfully: one navy frame, a calm white work panel, and one Brain. The trust language (colour, word and icon) is the same on Home, the Attack Plan, the peek and the record. The core loop runs with no dead ends or console errors, and every success-test step works at 1440×900. The biggest finding was a trust contradiction on the golden-path owner, Marchetti: the why-now card showed "Verified" and "One fact is disputed" side by side, which undermines success-test step 2 ("safe to say out loud?"). It's fixed, along with a page-change flash the designer flagged and a board that hid two of its columns.

## Must Fix

1. **The why-now card contradicted itself for Marchetti.** "Verified" sat next to a red "One fact is disputed. Check before you say it." The disputed fact (mailing address) isn't part of the why now. See `review-state-contact-outcome-1440.png`. _Fixed in `js/screens/contact.js`:_
   - A disputed fact outside the why now gets a warning that names it: "Mailing address is disputed. It isn't part of this why now."
   - A fact the user flags as wrong turns the badge Disputed, with a red "Check before you say it." (`review-state-contact-disputed-1440.png`).
   - Documented under principle 2 in `PRODUCT.md`.
2. **Page and tab changes flashed (designer feedback).** The main panel faded out over 140ms, then faded back in after a 40ms delay, so every move between pages showed a blank frame, which read as a reload. _Fixed in `css/product.css`:_
   - Revised after a second round of designer feedback: on page and tab changes, the shell, the white panel and the page heading with its tabs stay exactly in place, and only the content below the heading fades in where it sits (220ms). Nothing slides or expands, and the panel never fades to empty.
   - Third round ("it's still loading the page"): every screen was its own HTML document, so each move was a real page load, which a transition can only soften. Screens now switch in place, like the concept prototype: links stay real links for the portal, but the runtime fetches the target screen, re-renders it inside the same document and pushes the URL. A 14-move tour (sidebar, Dashboard tabs, back and forward, peek to full record, owner link, ⌘K, Brain) made 0 document loads with no errors. All 75 declared states still load directly, and exported portal files keep normal page loads.
   - The nav and tab indicators still glide, and the peek still morphs into the record.
   - In-page View Transitions (Brain, rail, theme, peek) are unchanged.
   - Verified 40ms after a tab click: the new page is fully drawn. `DESIGN.md` Motion was updated.
3. **Conversations hid Friday and Proposals at 1440.** Fixed 17rem columns overflowed 1,134px with no visible scrollbar, so the board ended at Thursday while the nudge talked about "two proposals". See `review-conversations-desktop-1440.png`. _Fixed: the columns are fluid (`flex:1 1 0; min-width:10.5rem`), so all six fit at 1440 and scroll sideways only at the 1024 floor (`review-conversations-laptop-1024.png`)._

## Should Fix

1. **Heading order.** On Listings and Web analytics, card titles were `h3` straight under the page `h1`. Brain with an open chat had no heading at all. _Fixed:_
   - The card titles are now `h2`, with the same style.
   - Brain has a visually hidden `h1` ("Brain · <chat title>").
2. **Owner's portfolio rail on the property record.** The "This property" row sat 4px left of the linked rows. See `review-property-desktop-1440.png`. _Fixed: same inline padding._
3. **Small inline targets.** These controls are under 24px tall:
   - table sort headers (16px)
   - the "Ask Brain" link in nudges
   - the to-do checkboxes (18px)
   - the Goals segmented control (22px)
   - month-view event chips (18px)

   They pass WCAG 2.5.8 through spacing or the inline exception, and this is a mouse-first desktop product, but the to-do check and month chips are the tightest. _Fixed for `.ds-check`: a pseudo-element gives it a 26px hit area without changing how it looks. Month chips stay 18px: they're stacked, so a bigger hit area would overlap the next chip._ Open, low priority.

## Could Improve

1. **Outreach performance stat strip.** "Weekly marketing blasts" wraps to two lines, and the emphasised Conversations cell sets its number a few pixels lower than its neighbours. _Suggestion: shorten the label to "Marketing blasts" and align the value baseline across the row._
2. **New-event day preview.** The timeline opens scrolled so "7 AM" is half clipped at the top (`review-state-calendar-dialog-clash-dark-mode-1440.png`). _Suggestion: scroll to the first hour on the hour, or pad the top._
3. **Brain page header.** With a chat open, the chat title repeats the first user message verbatim at the top right (`review-state-brain-list-1440.png`). _Suggestion: a short generated title ("LES debt due 2026") or drop it._
4. **Native date field locale.** The outcome's follow-up date shows the browser's locale pattern (dd/mm/yyyy in a non-US browser). It's fine for the demo. In production, use a US-formatted picker to match the rest of the product.

## What Works Well

- **The shell is a structure, not decoration.** The navy frame, grouped sidebar, white panel and docked Brain read as distinct surfaces in both themes. The dark theme is designed, not inverted: deep navy shell, light-blue primary, and status tints that keep contrast (110 checked pairs, minimum 4.73:1).
- **Summary first holds up.** Every page leads with a sentence or a number (greeting plus lede, the nudge line, "6 of 40 calls"). Tables only appear inside Database, and lists stop at about six items with "View all".
- **The call loop is fast.** Home to the first owner takes 1 click, and a no-answer is logged in 2 clicks. Next owner, the live-call bar unrolling and the outcome bar folding make the loop feel continuous without slowing it down.
- **Disabled is complete.** Unbuilt destinations look finished, use colour rather than opacity, and carry the "Not in this proposal yet" tooltip. The Guide's Structure view makes the proposal's scope legible to the client (`review-state-home-guide-1440.png`).
- **The states are real presets.** All 77 declared states load from URL parameters (loading, error, empty, dialogs, peeks, Brain stages), and none needs a manual toggle.
- **Accessibility basics are solid.**
  - No unnamed controls on any screen.
  - A visible 2px focus ring on the navy shell (`review-interaction-focus-ring-1440.png`).
  - Esc, ↑↓, ⌘K, ⌘J and `[` all work.
  - Reduced motion is honoured throughout.
- **Laptop floor.** At 1280, Brain becomes an overlay; at 1024, the sidebar becomes an icon rail. Content reflows rather than shrinking (`review-home-laptop-1024.png`).

## Verification

- `python3 tools/check.py` passes after the fixes.
- Scripted click-through (core loop, persistence, ⌘K, peek, Brain answer and list approval, calendar draft and dialog, rail, ⌘J, Conversations): all steps pass with no page errors. The peek close and ⌘J toggle were re-checked separately, since the script's 100ms sample catches the peek's exit animation.
- All 13 screens were re-captured where fixes landed, with no page errors.
