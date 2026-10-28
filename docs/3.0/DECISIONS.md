# Death Star 3.0 decisions

Recorded by Giulio on 2026-10-27 in the 3.0 decision workbook. A change marked "pending" is not approved: ask before building it.

## Phase 1 · Correct

- **1.1 Score per building, rank per person:** Option A, Rank on the person, score on the building (recommended)
  - Oct 27, at build: fixtures rescaled per building (every building has its own 0–100 score, no derived scores; class follows the score: A 80+, B 60+, C 40+, D 20+). The lift line shows on two owners: Marchetti (up from 3, team met him in 2019) and Adler (up from 8, team did a BOV on 64 Essex St in 2011). Built Oct 27.
- **1.2 The client's call outcomes:** Option A, The six, plus quick no-answer (recommended)
  - Note: Go with the recommend, but maybe a multiselect options for it could work
  - Oct 27, at build: one main outcome (Connected, Conversation, Not interested, Wrong person), then optional multi-select results (Meeting set, BOV request, Asked for texts) on a reached call; No answer and Voicemail stay quick links. Callback becomes a Call back follow-up chip, not an outcome. Built Oct 27.
- **1.3 Permanent opt-out:** Option A, One permanent switch in the tray (recommended)
  - Oct 27, at build: go-ahead confirmed. The one-year blast exclusion is removed everywhere; Kowalski's (212) 555-0175 is the demo's do-not-call-list number. Built Oct 27.
- **1.4 Meetings this week as the top number:** Option A, First tile in the pulse (recommended)
  - Oct 27, at build: Class A coverage leaves the pulse and becomes a line on Who to call's coverage card. Base count 3 (this week's owner meetings on the calendar), last week 1. Built Oct 27.
- **1.5 Class and trust labels:** Option A, Client's names; Likely holders becomes a list (recommended)
  - Oct 27, at build: Likely holders is defined by the Recent refinance signal; Baum becomes Class D. Reach words: Verified 75%+, Likely 50–74%, Unverified below 50%. Built Oct 27.
- **1.6 Freshness on screen:** Option A, One quiet line per list (recommended)
  - Oct 27, at build: go-ahead confirmed, including "deeds as of Sep 1" on Today's source line. Built Oct 27.
- **1.7 Small standards:** Option A, Apply as written (recommended)
  - Oct 27, at build: record pages carry the record's name ("Death Star | Daniel Marchetti"). Built Oct 27.

## Phase 2 · Core

- **2.1 Where the day starts:** Option B, Home becomes Today (recommended)
  - Oct 27, at build: Home's pulse, metric tabs, Up next and meetings become Dashboard › Overview (the Dashboard's first tab; Thomas's other names kept). Today's head is the greeting with Meetings this week, then Brain's line. Approvals joins the sidebar with 2.3. App tabs: Today, Brain, Database, More; the app's pulse is More › Overview (which keeps the navy hero). Built Oct 27.
- **2.2 The complete call card:** Option A, Extend the Overview (recommended)
  - Oct 27, at build: three buyers shown, the rest on request. The opener replaces the Suggested angle. Built Oct 27.
- **2.3 Approvals page:** Option A, An inbox (recommended)
  - Oct 27, at build: lane switches left for phase 4. In the app, Approvals is a tab with a count (Today, Approvals, Brain, Database, More). The web top bar shows a "N to approve" pill. Built Oct 27.
- **2.4 First touch on every Today row:** Option A, A small plan under the reason (recommended)
  - Oct 27, at build: on the case file the plan replaces the engagement-based Next touch line (the engagement becomes the because). Built Oct 27.
- **2.5 Changes note and restore:** Option A, Inline note plus a Changes page (recommended)
  - Oct 27, at build: the sidebar's System item turns on and opens System › Changes (Settings, Health, Controls drawn). The app has More › Changes. Built Oct 27.
- **2.6 One Brain, the client's assistant names:** Option A, One Brain with role labels (recommended)
  - Note: Maybe go with the label according to the scope chip, but maybe another option in the brain chat to select the role
  - Oct 27, at build: the composer gets a role menu (Auto plus the five roles); the chip shows the chosen role. Mapping as proposed (Who to call is Marketing Coordinator). Built Oct 27.
- **2.7 Teach line on every page:** Option A, Purpose line, example on request (recommended)
  - Oct 27, at build: lists and dashboards only (records explain themselves); the same lines in the app. Built Oct 27.

## Phase 3 · Extend

- **3.1 Cleaning queue:** Option A, A Cleaning tab in the Database (recommended)
  - Oct 27, at build: web only; the app stays in field mode (3.3). Bulk actions act on selected rows, with "Select the N at 85% or more"; the flagged item is never selectable. Built Oct 27.
- **3.2 The buyer side of a person:** Option A, A Buyer tab and a header chip (recommended)
  - Note: With a good layout
  - Oct 27, at build: summary-first layout picked over two columns. The app gets the chip and a Buyer section on the contact's Overview. Example: Michael Greene (sold Sep 3, so 1031 identify by Oct 18). Built Oct 27.
- **3.3 Mobile app as field mode:** Option A, Near me as a tab, Scan in the header (recommended)
  - Oct 27, at build: tabs Today · Near me · Approvals · Database · More; Brain moves to a header button (Approvals stays a tab from 2.3). More keeps Calendar, Activity, Changes and settings. Scan also on Near me's header. The app's look is kept. Built Oct 27.
- **3.4 Visual standard test:** Option A, A variant to compare (recommended)
  - Oct 28, at build: Look switch in the review menu (Current look / Standard test); warm white applies to the light theme only. Screenshots in docs/3.0/look/. Switching for real still needs a separate yes. Built Oct 28.
- **3.5 Calendar: booking page and sync:** Option A, A small card in the rail (recommended)
  - Oct 28, at build: web calendar only. A booking adds a meeting and counts in Meetings this week (preset booked=1). Built Oct 28.
- **3.6 Dashboard names and Funnel and trends:** Option A, Keep the video names, add the funnel to Performance (recommended)
  - Oct 28, at build: steps in funnel order (calls, confirmed numbers, conversations, meetings, valuations, listings), each with its change and conversion. Tab names unchanged. Built Oct 28.
- **3.7 Best way to reach, and why:** Option A, Add the why and the state (recommended)

## How to read the three notes

Each note opens a small question. Ask Giulio about it before building that change, recommended option first.

- **1.2, multiselect.** The client's own example taps "conversation, BOV request" together after one call (Orientation doc 1, section 5), so one call can lead to more than one result.
  - Recommended: one main outcome, single choice (connected, conversation, not interested, wrong person), then optional multi-select chips for what came out of it (meeting set, BOV request, asked for texts).
  - No answer and Voicemail stay as quick links.
  - Alternative: all six as one multi-select. This is more flexible but allows contradictions, such as "not interested" together with "meeting set".
- **2.6, a role selector in Brain.** The scope chip follows the page by default ("Brain · Marketing Coordinator" on Reporting).
  - Recommended: the composer gets a small role menu, "Auto (this page)" plus the client's five roles (Assistant, Data Scientist, Cartographer, Marketing Coordinator, Investigative Reporter), and the chip shows the chosen one.
  - It is still one Brain, with one history.
- **3.2, a good layout.** Before building, show two layout options for the Buyer tab and let Giulio pick:
  - Summary first: buy box sentence, 1031 window, last purchases, then the listings that fit.
  - Two columns: buy box and score on the left, matches on the right.
  - Keep the header chip quiet; it only appears when the person is an active buyer.
