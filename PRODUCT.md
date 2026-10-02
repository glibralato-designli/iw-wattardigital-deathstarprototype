# Death Star — POC prototype

## Purpose
A redesign proposal for the Stewart Group's internal commercial real-estate prospecting portal (client: Wattar Digital). The portal tells a broker who is most likely to sell, and why now. The POC proves that a calm navy shell, with Home summarising the day, lets the broker reach the right owner, judge whether the why-now is safe to say out loud, and log the call in seconds.

**The question every screen answers:** who is most likely to sell, and why now?

**Core loop:** Home → today's Attack Plan → open the first owner → read the why now and its trust → Call → log the outcome → Next owner.

## Audience
**Thomas Windels** (fictional demo persona), NYC multifamily broker at Stewart Group, Lower East Side. Non-technical, on the phone all day, used to Salesforce-style horizontal tabs. Wants "classic corporate", midnight blue, quiet, not data-dense. His fear: saying something wrong to an owner. Secondary: Mira W., the builder at Wattar Digital, and Giulio Libralato (Designli), who presents the proposal.

## Success test (first client call, 1440 × 900, no guidance)
1. From Home, Thomas reaches the first owner to call in ≤ 2 clicks and ≤ 10 seconds, without scrolling.
2. After one glance at the why-now card, he says whether it's safe to say out loud.
3. He logs a no-answer call in 2 clicks after ending it.
4. He finds any area from the sidebar on the first try, and names the 7 Dashboard tabs.
5. He reacts to the shell (navy frame, grouped sidebar, Home tiles) as a structure: keep, change or reject.

## Experience principles
1. **Summary first, detail on request.** Every page leads with a sentence or a number, never a table. Tables live inside a tab or after a click; a section shows about 6 items, then "View all".
2. **Trust before persuasion.** A why now never looks more certain than its evidence. Every claim carries its trust status: Verified · Single source · Stale · Disputed, always colour + word + icon. Single-source facts read "public records suggest". A disputed fact outside the why now shows a warning that names it ("Mailing address is disputed. It isn’t part of this why now."); flagging a fact as wrong turns the why now Disputed with "Check before you say it."
3. **One of everything.** One why now, one score, one assistant (Brain), one place per destination. Keep Thomas's labels and order; change the structure, not the vocabulary.

## Tone
Plain, broker-to-broker. One real figure per sentence, no hype, no exclamation marks. Sentence case. Missing data reads "Not on record".

## Platform
web

Responsive web, designed at 1440 × 900 and fluid from 1920 down to a 390 phone. Desktop: labelled sidebar, Brain docked beside the page on Home. Below about 1360 Brain overlays the page (and starts minimized on Home); below about 1180 the sidebar is the icon rail. Tablet (under 1024): records and the Dashboard's right columns stack under the main column, the search and Links collapse to icons, tables scroll sideways inside their card. Phone (under 768): the sidebar is a drawer behind a menu button, the top bar shows the current page, Brain, the peek and dialogs take the whole screen, grids become one column, the calendar opens on Day, and fields use 16px text. Brain opened on a phone stays on that screen only.

## Navigation model
- **Sidebar** (navy, labelled groups in Thomas's order): Home, Dashboard, Brain · Prospecting (Database, Map, Outreach) · Channels (Phone, Email, Texting, LinkedIn, Social) · Marketing (Marketing, Website) · More · System. Collapses to a 56px icon rail (`[`).
- **Top bar** (navy): breadcrumb, search (⌘K), Links menu, notifications (disabled), Ask Brain toggle (⌘J).
- **Page tabs** under each page title. Every destination appears once; views are tabs, never sidebar items.
- **Brain panel**: docked right inside the frame. Open on Home, minimized elsewhere, hidden on the Brain page.
- Interactive roots: Home, Dashboard, Database, Brain. Everything else is drawn complete but disabled ("Not in this proposal yet").

## Screens and flows
| Flow | Screens |
|---|---|
| Start the day | Home, Dashboard › Attack Plan (+ prototype guide) |
| Live call | Contact case file (live call, outcome, why this?, disputed) |
| Ask Brain | Brain page (empty, thinking, streaming, answers) |
| Find anything | Database › Contacts (peek, ⌘K), Database › Properties, Property record |
| Plan the week | Dashboard › Calendar (draft, new event dialog), Conversations, Outreach performance, Reporting, Listings, Web analytics |

**Property record** carries everything the client's current property page shows, reorganised like the case file: a five-number key-facts strip (units, gross SF, last sale, debt, open violations); why now with the record's lines and the five distress signals (loan maturity, pre-2005 owner, lis pendens, high debt, unused FAR) as present or not; Overview accordions for Building, Units and rent, Debt and capital, Sale and taxes, Lot and zoning; Violations (DOB, ECB, HPD, HPD litigation, storefront registry with an Auto / Vacant / Occupied override, and the list); Ownership (linked contacts with role, phone, email, primary); Deals; Evidence (safe lines to copy, owner summary PDF later). The side column holds the primary contact, location (map and street view later), property notes, owner activity and the owner's portfolio. Map, comps, PDF, delete and linking contacts are drawn but disabled.

"Check the why now" is part of the Live call flow on the portal (its only screen is the case file); the in-product guide still lists it as its own flow.

## Naming
Brain (the assistant, panel and page) · Contact (UI) / owner (why-now copy) · Case file (docs only) · Property record · Why now · Score · Class (A, B, C, D, LH) · Verified / Single source / Stale / Disputed · Call next · Attack Plan · Outcome · Conversations · Listings · Web analytics (the sidebar page stays Website) · "Not in this proposal yet" · "Not on record" · List.

## Demo data and state
All fictional. Lead owner Daniel Marchetti, Ludlow 118 Holdings LLC, 118 Ludlow St, $9.375M loan due June 9, 2026. 11 contacts, 13 properties, evidence in all four trust statuses, a week of calendar events, conversations, goals and Home metrics. "Today" is Wednesday, September 30, 2026. Logged calls, notes, flags, to-dos, events and conversations persist in browser local storage; "Reset prototype data" in the account menu (or `?reset=1`) restores the seed. Brain answers are scripted.

Demo presets (URL parameters): `home.html?layout=classic`, `?lead=upnext`, `?upnext=0`; `?nav=rail`; `?brain=open|min|closed`; `contacts.html?data=loading|error`; `?calls=3..6` (Call next minimum); `brain.html?think=ms`.

## Accessibility
WCAG AA contrast in both themes; focus ring on every control (white ring on navy); landmarks and a skip link; `role="tablist"` with arrow keys; `aria-live` for toasts and streaming; keyboard ⌘K, ⌘J, `[`, Esc. Disabled controls change colour only (never opacity), stay focusable with the tooltip "Not in this proposal yet", and do nothing on click. Trust is never colour alone.

## Out of scope
Detailed redesign of Outreach, Phone, Email, Texting, Marketing, LinkedIn, Social, Map, Website, More and System (drawn complete but disabled). Native mobile apps, roles, backend and data work. Customize sidebar, drag-to-reorder, calendar editing, bulk actions, exports. The 5-area IA from `UX_REDESIGN_PLAN.md`.

## Open questions (for the client)
- Should existing calendar events be editable in the final build, or stay read-only with a link to the source calendar?
- Which real calendar (Google or Outlook) feeds the Calendar tab, and do user-created events write back to it?
- Do the four display-only Dashboard tabs need filters or date ranges, or are they fixed snapshots?
- Class thresholds in production, and whether Likely holder is a class.

## Review presentation
The hub, player and canvas follow the template. Only the Responsive web card is active; the Mobile app card stays visible and greyed out. The player opens on Home.
