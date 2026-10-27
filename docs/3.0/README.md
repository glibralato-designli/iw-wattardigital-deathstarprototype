# Death Star 3.0: plan of changes

Version 3.0 makes the prototype agree with the client's five orientation documents (Oct 24–26, 2026), with the best user experience and without making screens denser. The baseline is prototype 2.0 at commit `5956fe3` (Oct 22, 2026).

Client documents: `/Users/gslo/Documents/Designli/Projects/Impact Weeks/Wattar Digital/PDFs/` (Orientation 1 Text, 2 Drawings, 3 Feature inventory, 4 Outbound lanes, 5 Scenarios).

## How this works

- Every change has a few options, a **recommended** one, and "done when".
- Giulio picked an option for every change on Oct 27, 2026. The choices are in `docs/3.0/DECISIONS.md`, and three of them carry a note to discuss before building.
- Claude Code works one phase and one change at a time and asks before building anything without a recorded decision. The kickoff prompt is in `docs/3.0/PROMPT.md`.
- How the recommendations were chosen: summary first, detail one click down, no new columns or panels where a line will do, the client's vocabulary, and the established 5b Navy shell look.

## Phases

| Phase | Focus | Changes |
|---|---|---|
| 1 · Correct | Make what exists say the right thing | 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 |
| 2 · Core | The call card and the human gate | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7 |
| 3 · Extend | Daily upkeep, buyers, the field and the look | 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7 |
| 4 · Later | Pages the loop can wait for | Map, BOV and deals, model and Controls, lanes, two looks |

## Already done in 2.0 (keep, verify only)

- Today as a ranked list with a why-now line and trust on every row
- One why now, evidence with sources, Why this? and Flag as wrong
- The list builder, Turn into a list on every report, Save as list and Push to queue
- Team history on the property, kept apart from the score
- Relationship block: notes that matter, who on the team knew them, suggested angle, Next touch
- Brain proposes, Thomas approves (lists, suggestions, lessons) and Learning Mode
- Headlines to a post and a list; BOV drawn as the next phase
- The peek and ⌘K search

## Phase 1 · Correct: Make what exists say the right thing

Small changes with the biggest effect on trust. They fix places where the prototype contradicts the client's own documents.

### 1.1 Score per building, rank per person

**Status:** Done, Oct 27, 2026 (Option A) · **Decision:** Option A approved, Oct 27 · **Effort:** M · **Screens:** Today, Database, case file, property record, peek, Brain answers, app

- **The brief:** Buildings are scored, people are called. Each building has a score (0–100 in the examples) and a class. The owner is ranked by their most pressing building, and every row and card names it. Team history moves rank, never score. (Doc 1 §7 and §21, doc 2 §4)
- **Today:** One owner score (Marchetti 132) on the owner and the property. Rows show a lead property.

**Options**

- **A. Rank on the person, score on the building** **(recommended)**: Rows show the class badge and "Rank 6". A building chip reads "118 Ludlow St · 88". A muted line appears only when history moved the rank: "Up from 11: team met him in 2019". *Least dense. Each number sits next to the thing it describes.*
- **B. Two number columns**: Tables get a Rank column and a Score column. The card shows both in the header. *Precise but denser. Two similar numbers side by side invite confusion.*
- **C. Score only, rank by order**: Show the building score. The rank is implied by position, and the lift is explained in the peek. *Cleanest, but it hides the team-history effect the brief wants visible.*

**Why the recommendation:** It matches the brief's own drawing and adds no new column. The lift line only appears when it means something.

**Done when:** No owner-level score remains anywhere. Every ranked row and card names one building with its score. Fixtures use 0–100 per building, and the lift line shows where history moved the rank.

**Ask Giulio:** Confirm option A, and that fixtures can be rescaled (Marchetti's 118 Ludlow becomes about 88).

### 1.2 The client's call outcomes

**Status:** Done, Oct 27, 2026 (Option A, main outcome + result chips) · **Decision:** Option A approved, Oct 27 (see the note in DECISIONS.md) · **Effort:** S · **Screens:** Outcome tray (web), outcome sheet (app), Activity, Home counters

- **The brief:** One tap after the call: connected · conversation · meeting set · BOV request · not interested · wrong person. Capture "asked for texts". What the owner said is stored as a claim with its source. (Doc 2 §5, doc 3 Today, doc 4 §11)
- **Today:** Connected, Callback, Voicemail, No answer, Not interested, Bad number, plus save actions.

**Options**

- **A. The six, plus quick no-answer** **(recommended)**: The client's six are the main choices. "No answer" and "Voicemail" sit as small quick links underneath, because most dials end there. Add an "Asked for texts" toggle and a "What they said" field saved as a claim. *Keeps the two-click no-answer from the success test. Uses the client's vocabulary.*
- **B. Exactly the six**: Only the six choices. A missed call is logged with a separate "Not reached" button. *Purest to the brief, but adds a second control for the most common case.*
- **C. Keep the current set**: No change. *Contradicts the brief.*

**Why the recommendation:** Thomas's six describe what happened on a reached call, and on call days most attempts are not reached. Option A keeps both fast.

**Done when:** The tray and sheet show the six plus the quick links. "BOV request" opens a valuation request, and "Meeting set" adds to the meetings count. The toggle and claim field save to the record.

**Ask Giulio:** Confirm option A, and whether to show "Callback" as a follow-up chip instead of an outcome.

### 1.3 Permanent opt-out

**Status:** Done, Oct 27, 2026 (Option A) · **Decision:** Option A approved, Oct 27 · **Effort:** S · **Screens:** Outcome tray and sheet, case file header, Details

- **The brief:** A person who asks not to be contacted is never contacted again, on any channel. A text STOP counts the same. Numbers on do-not-call lists show a warning, never a block. (Doc 1 §9)
- **Today:** A "Do not contact" status chip exists, but the tray offers "Remove from blasts for 1 year".

**Options**

- **A. One permanent switch in the tray** **(recommended)**: Replace the one-year option with "Do not contact, every channel". A one-line confirmation reads "This stops every channel, permanently". Do-not-call numbers get a small warning chip. *Fast during the call. The confirmation prevents mis-taps.*
- **B. Only in the record menu**: Opt-out moves to the record's ⋯ menu. *Safer from mis-taps, but slower when the owner asks on the call.*

**Why the recommendation:** Owners ask for this on the call, so it should be where the outcome is logged, with a guard.

**Done when:** No time-limited opt-out remains. Opting out shows the existing chip and disables every outreach button with a reason. Do-not-call shows a warning, not a block.

**Ask Giulio:** Confirm option A.

### 1.4 Meetings this week as the top number

**Status:** Done, Oct 27, 2026 (Option A) · **Decision:** Option A approved, Oct 27 · **Effort:** S · **Screens:** Home pulse, Dashboard › Today goals, app Home

- **The brief:** The one number that matters is owner meetings scheduled this week. Everything else exists to move it. (Doc 1 §2, doc 3 Dashboard)
- **Today:** Home leads with calls today, conversations, Class A coverage and follow-ups due.

**Options**

- **A. First tile in the pulse** **(recommended)**: The first pulse tile becomes "Meetings this week 3 · last week 1". Calls, conversations and follow-ups stay as drivers, and Class A coverage moves to Who to call. *Same layout, new priority. Nothing added.*
- **B. A line under the greeting**: "3 meetings this week, 1 last week." The pulse stays as it is. *Very calm, but the top number is text, not the strongest element.*
- **C. Dashboard only**: Show it on the Dashboard and leave Home. *Misses the start of the day.*

**Why the recommendation:** It keeps Home's quiet structure and puts the client's north-star number first.

**Done when:** Meetings this week is the first and strongest number on Home and the app Home. "Meeting set" from 1.2 updates it with the count-up motion.

**Ask Giulio:** Confirm option A, and which tile leaves the pulse.

### 1.5 Class and trust labels

**Status:** Done, Oct 27, 2026 (Option A) · **Decision:** Option A approved, Oct 27 · **Effort:** S · **Screens:** Badges everywhere, Database lists, best way to reach

- **The brief:** Classes are A act now, B high probability, C monitor, D informational. Contact reach uses Verified / Likely / Unverified. (Doc 1 §21, doc 3 across the portal)
- **Today:** A Immediate seller, B High probability, C Monitor, D Informational, plus LH Likely holder. Reach shows confidence percentages only.

**Options**

- **A. Client's names; Likely holders becomes a list** **(recommended)**: Class A reads "Act now". LH stops being a class badge and stays as a saved list ("Likely holders"). Phones and emails get Verified / Likely / Unverified next to the percentage. Facts keep their four trust states. *Matches the brief with no new badge styles.*
- **B. Client's names, keep LH as a fifth class**: Same as A, but LH keeps its badge. *Keeps a class the brief never mentions.*

**Why the recommendation:** The brief defines four classes. A long hold is a signal, so it reads better as a list.

**Done when:** Badges use the four client names. LH appears only as a list. Reach labels show on every phone and email.

**Ask Giulio:** Confirm option A, or ask Thomas about LH first.

### 1.6 Freshness on screen

**Status:** Done, Oct 27, 2026 (Option A) · **Decision:** Option A approved, Oct 27 · **Effort:** S · **Screens:** Evidence lists, Why this?, property record, Today header

- **The brief:** City deed records arrive monthly, violations daily, tax liens when published. Freshness belongs on screen so a quiet signal is not mistaken for a bug. (Doc 3 insights, doc 1 §8)
- **Today:** "Updated 2d ago" on the why now and a date on each evidence row.

**Options**

- **A. One quiet line per list** **(recommended)**: Under each evidence list: "Deeds update monthly · last Oct 1". A source with no feed reads "No feed yet" instead of empty. *Adds one line where it matters.*
- **B. A badge on every fact**: Each fact gets a freshness badge. *Precise but dense.*

**Why the recommendation:** Freshness is about the source, not each fact, so one line per list says it without noise.

**Done when:** Every evidence list and the property record show the source rhythm. Empty sources say "No feed yet".

**Ask Giulio:** Confirm option A.

### 1.7 Small standards

**Status:** Done, Oct 27, 2026 (Option A) · **Decision:** Option A approved, Oct 27 · **Effort:** S · **Screens:** Every page

- **The brief:** Browser tab reads "Death Star | Page". Pages use the whole screen on wide monitors, nothing fixed-width. (Doc 3 across the portal)
- **Today:** Tab titles read "Home — Death Star".

**Options**

- **A. Apply as written** **(recommended)**: Change every title. Check wide screens for fixed-width blocks. *No design choice involved.*

**Why the recommendation:** A standard from the brief, with no trade-off.

**Done when:** All titles follow the pattern. No fixed-width content at 1920.

**Ask Giulio:** No question needed; just confirm before committing.

## Phase 2 · Core: The call card and the human gate

The screens the brief describes in the most detail, and the ones every scenario passes through.

### 2.1 Where the day starts

**Status:** Done, Oct 27, 2026 (Option B) · **Decision:** Option B approved, Oct 27 · **Effort:** M · **Screens:** Sidebar, Home, Dashboard › Today, app tabs

- **The brief:** Today is the daily starting point and Approvals is a main page. The Dashboard is the command centre. (Doc 1 §10, doc 3 Today)
- **Today:** Home summarises the day and links to Today, which is a Dashboard tab.

**Options**

- **A. Keep Home, add Approvals**: Home stays as the briefing and Today stays a Dashboard tab. Approvals becomes a top-level item. *Smallest change, but two places still compete to start the day.*
- **B. Home becomes Today** **(recommended)**: The first sidebar item is Today: greeting, meetings this week, then the ranked list with its call cards. Home's other tiles move to the Dashboard. Approvals is the second item. *One starting point, one click less, and it matches the brief's page list.*
- **C. Today as its own page, Home kept**: Add Today to the sidebar next to Home. *Breaks "one place per destination".*

**Why the recommendation:** Thomas starts every day on the call list. Merging removes a step and a duplicate summary, with less on screen overall.

**Done when:** One starting page named Today. Approvals sits under it with a count. The Dashboard keeps its analytics tabs. The prototype guide and success test are updated.

**Ask Giulio:** This is the biggest structural decision. Confirm B, or keep A for this round.

### 2.2 The complete call card

**Status:** Done, Oct 27, 2026 (Option A) · **Decision:** Option A approved, Oct 27 · **Effort:** M · **Screens:** Case file Overview (web and app), live call state

- **The brief:** Before dialing, one screen holds why now, which building, team history in date order, three to five buyers who fit, the opener in Thomas's voice (never a price), and the next step. (Doc 2 §5)
- **Today:** The case file has the why now with evidence and a Relationship block with a suggested angle and Next touch. Missing: which building, buyers who fit, the opener.

**Options**

- **A. Extend the Overview** **(recommended)**: Add "Which building: 118 Ludlow St · 88" inside the why-now card. Under it, a two-part row: Opener (two lines, expand for the rest) and Buyers who fit (three names, expand). Next touch becomes the line under the Call button. During a live call, the lower sections fold away. *One screen, no new mode, calm during the call.*
- **B. A focused call mode**: Pressing Call switches the case file into a call card: why, building, opener, buyers, outcome. Everything else hides until the call ends. *Very calm, but a second layout of the same content.*
- **C. A Call card tab**: A new tab next to Overview. *Hides the card one click away at the worst moment.*

**Why the recommendation:** Everything sits where Thomas already looks, and the fold during a live call gives option B's calm without a new mode.

**Done when:** The four missing parts are on the card, collapsed by default except the building. The opener never contains a price. The app shows the same order.

**Ask Giulio:** Confirm option A, and how many buyers to show (three suggested).

### 2.3 Approvals page

**Status:** Done, Oct 27, 2026 (Option A) · **Decision:** Option A approved, Oct 27 · **Effort:** L · **Screens:** New page, sidebar, top bar, Brain suggests, outcome follow-ups

- **The brief:** One queue for every planned email, text, letter, LinkedIn step, valuation and data push, each with its reason. Preview and edit, bulk approve, the first-wave button, and a count in the top bar. (Doc 1 §10, doc 3 Approvals, doc 4 §5 and §8)
- **Today:** An inline approval bar for lists, suggestions and lessons. No page and no count.

**Options**

- **A. An inbox** **(recommended)**: A sidebar item with a count. On the left, items grouped by lane (Email, Text, Letter, LinkedIn, Valuation, Data push); each row shows the owner, the building, the reason and any check warnings. On the right, a preview to edit. Approve or Hold, bulk approve per group, and First wave at the top of Email. *A pattern everyone knows (Gmail, Linear inbox). Calm at any volume.*
- **B. A Dashboard tab**: The same list inside the Dashboard. *One level deeper, against "the approval point is visible".*
- **C. A top-bar drawer**: A drawer opened from the count. *Fast, but no room to preview and edit.*

**Why the recommendation:** Approval is a daily task with drafts to read. An inbox gives each item room without crowding.

**Done when:** The page has states for empty, mixed lanes, a draft open, bulk approve and a blocked check. The top bar shows the count on every page, and every planned touch elsewhere says "Waiting for your click" and links here.

**Ask Giulio:** Confirm option A, and whether lane switches are drawn now (disabled) or left for phase 4.

### 2.4 First touch on every Today row

**Status:** Not started · **Decision:** Option A approved, Oct 27 · **Effort:** M · **Screens:** Today rows, peek, case file

- **The brief:** The first touch is chosen per owner: call, email then call on day 2 or 3, email only, or a letter. Screens show the "because" behind every planned touch. (Doc 1 §6, doc 2 §3, doc 3 insights)
- **Today:** Today is a call list only.

**Options**

- **A. A small plan under the reason** **(recommended)**: A channel icon and a short plan, "Email tonight · call Wed", under the why-now line. The full reason ("cold, with a phone") shows in the peek. *Adds one short line per row.*
- **B. A Next touch column**: A separate column with the plan and its reason. *Clear, but widens the table.*
- **C. Group Today by channel**: Sections: Call now, Email first, Letters. *Strong overview, but breaks the single ranked order.*

**Why the recommendation:** The rank order stays the spine of the day. The plan reads in a glance, and detail is one click down.

**Done when:** Every row shows its planned touch. A sequence shows its step and why it stopped (reply, bounce, opt-out, conversation).

**Ask Giulio:** Confirm option A.

### 2.5 Changes note and restore

**Status:** Not started · **Decision:** Option A approved, Oct 27 · **Effort:** S · **Screens:** Shared component, System › Changes page

- **The brief:** When behaviour changes, a quiet note sits where the old behaviour was, with Restore. A full history lives in Controls. Undo and "what changed" deserve first-class placement. (Doc 1 §9, doc 3 across the portal)
- **Today:** None.

**Options**

- **A. Inline note plus a Changes page** **(recommended)**: One quiet line component ("Ranking changed Oct 25: paid-off loans weigh more · Restore") and a Changes page under System, in plain words. *Visible where it matters, complete in one place.*
- **B. Toast with Undo**: A toast after each change. *It disappears, and the brief wants the note to stay.*

**Why the recommendation:** The brief asks for a lasting note, and a toast cannot do that.

**Done when:** The component is in the showcase and used in at least two places (Today ranking and a Brain lesson). The Changes page lists items with Restore.

**Ask Giulio:** Confirm option A.

### 2.6 One Brain, the client's assistant names

**Status:** Not started · **Decision:** Option A approved, Oct 27 (see the note in DECISIONS.md) · **Effort:** S · **Screens:** Brain panel, page scope chip

- **The brief:** Every page has its own assistant (Assistant on records, Data Scientist, Cartographer, Marketing Coordinator, Investigative Reporter), and there is a floating assistant with Tasks and Conversations. (Doc 3 across the portal)
- **Today:** One assistant, Brain, scoped to the page.

**Options**

- **A. One Brain with role labels** **(recommended)**: Keep one Brain. The scope chip shows the page role: "Brain · Marketing Coordinator" on Reporting, "Brain · Investigative Reporter" on Headlines. *Thomas keeps his names, and there is still one thing to learn.*
- **B. Separate named assistants**: Each page gets its own named assistant. *Closer to the current portal, but brings back the scattered assistants discovery flagged.*

**Why the recommendation:** It honors his vocabulary without returning to five assistants.

**Done when:** The scope chip shows the role on each page that has one. The Tasks part of the floating assistant is noted for phase 4.

**Ask Giulio:** Confirm option A.

### 2.7 Teach line on every page

**Status:** Not started · **Decision:** Option A approved, Oct 27 · **Effort:** S · **Screens:** Page heads

- **The brief:** A one-line "what this page is for" and one worked example on every page, plus a getting-started guide. (Doc 3 across the portal)
- **Today:** One Brain line per Dashboard tab.

**Options**

- **A. Purpose line, example on request** **(recommended)**: One muted line under the page title. The worked example sits behind "See an example". *Teaches without adding weight.*
- **B. Example always visible**: Purpose and example both shown. *Helpful the first week, noise after.*
- **C. Brain line only**: No change. *Misses the brief.*

**Why the recommendation:** Thomas learns once and works daily, so the example should be there when asked and quiet otherwise.

**Done when:** Every page has a purpose line, and the main pages have an example.

**Ask Giulio:** Confirm option A.

## Phase 3 · Extend: Daily upkeep, buyers, the field and the look

Features that close the loop between calls, plus the visual standard test.

### 3.1 Cleaning queue

**Status:** Not started · **Decision:** Option A approved, Oct 27 · **Effort:** M · **Screens:** New Database tab, sidebar count

- **The brief:** Ten minutes a day across four queues (contact, ownership, property, context). Each item shows the current value, the proposed value, confidence, source and a plain reason. Bulk approve or reject, defer. (Doc 1 §15, doc 3 Cleaning)
- **Today:** None.

**Options**

- **A. A Cleaning tab in the Database** **(recommended)**: Four sub-tabs. Each item is one row (current → proposed, confidence, source, reason) with Approve, Reject and Defer, and bulk actions. A count shows in the sidebar. *Data upkeep stays with the data.*
- **B. A lane inside Approvals**: Cleaning items mixed into Approvals. *One queue, but it mixes outbound sends with data fixes.*

**Why the recommendation:** Approving a send and approving a correction are different jobs, so keeping them apart keeps both calm.

**Done when:** The tab has the four queues with the brief's examples (a confirmed mobile, a new deed owner, a unit count, a class rise) and one flagged item left alone.

**Ask Giulio:** Confirm option A.

### 3.2 The buyer side of a person

**Status:** Not started · **Decision:** Option A approved, Oct 27 (see the note in DECISIONS.md) · **Effort:** M · **Screens:** Case file, Buyers who fit, Listings

- **The brief:** Every person is one record with a seller side and a buyer side: buy box, buyer score, 1031 clock, recent purchases. Three to five buyers who fit appear on every owner card. (Doc 1 §14 and §23)
- **Today:** Listings show who viewed. No buyer profile.

**Options**

- **A. A Buyer tab and a header chip** **(recommended)**: The case file gets a Buyer tab. A header chip ("Also a buyer · 1031 window to Jan 12") appears only when relevant. This feeds Buyers who fit in 2.2. *The same person, one more tab, shown only when it matters.*
- **B. A separate buyer record**: A second record page for the buyer side. *Contradicts "one record per person".*

**Why the recommendation:** The brief is explicit that a buyer and a seller are two sides of one person.

**Done when:** K. Levy-style example data, a Buyer tab with buy box and clock, and Buyers who fit populated from it.

**Ask Giulio:** Confirm option A.

### 3.3 Mobile app as field mode

**Status:** Not started · **Decision:** Option A approved, Oct 27 · **Effort:** M · **Screens:** App tabs, Today, More

- **The brief:** Field mode shows only what makes sense on a phone: Today, the card, the pop-up record, texting, email and the tracker, plus Near me, Building scan, tap to call and a two-tap outcome. Not marketing, valuations, the model or settings. (Doc 3 Mobile, doc 5 scenario 7)
- **Today:** Five tabs; More holds Calendar, Activity, the four reports, Headlines and BOV & OM.

**Options**

- **A. Near me as a tab, Scan in the header** **(recommended)**: Tabs: Today · Near me · Brain · Database · More. Scan is a button in Today's header. More keeps Calendar and Activity; reports, Headlines and BOV leave the phone. The outcome sheet adds a voice note. *Thumb-first, and matches the brief's list.*
- **B. Keep the tabs, Near me inside Today**: Near me becomes a segment on Today. *Fewer changes, but buries the street use case.*
- **C. Drop the app**: Keep only the website's phone layout. *Loses the field experience the brief describes.*

**Why the recommendation:** In the street, the next owner and what is near matter most, so both earn a tab.

**Done when:** Near me lists nearby owners with a reason. Scan opens a record (typed address as a fallback). More is trimmed, and the outcome sheet has a voice note.

**Ask Giulio:** Confirm option A, and that the app's look is still the one to keep.

### 3.4 Visual standard test

**Status:** Not started · **Decision:** Option A approved, Oct 27 · **Effort:** S · **Screens:** Tokens, review menu

- **The brief:** Midnight-blue navigation, warm-white surfaces, one royal-blue action colour. References: Attio, Linear, Juniper Square. (Doc 1 §11, doc 3 page 1)
- **Today:** Navy shell, cool white and slate, navy action buttons.

**Options**

- **A. A variant to compare** **(recommended)**: A token variant behind a review-menu switch: warm-white surfaces and royal-blue primary buttons, navigation unchanged. Compare side by side, then decide. *No risk. The decision is made on real screens.*
- **B. Switch now**: Change the tokens directly. *Faster, but changes the established direction without a look.*
- **C. Keep the current look**: No change. *Ignores the client's written standard.*

**Why the recommendation:** DESIGN.md treats a direction change as a deliberate decision, and a variant makes that decision easy.

**Done when:** The variant passes contrast checks in both themes. Screenshots of Today, the case file and Approvals in both looks.

**Ask Giulio:** Confirm option A. Switching for real needs a separate yes.

### 3.5 Calendar: booking page and sync

**Status:** Not started · **Decision:** Option A approved, Oct 27 · **Effort:** S · **Screens:** Dashboard › Calendar

- **The brief:** Meetings are synced from Microsoft 365, plus a public booking page. Meetings, valuation pitches and tours feed the funnel. (Doc 3 Dashboard)
- **Today:** Meetings, call blocks, BOV pitches and tours. Booking pages were left out.

**Options**

- **A. A small card in the rail** **(recommended)**: A "Booking page · Copy link" card and a "Synced with Microsoft 365 · 2 min ago" line in the calendar rail. *Two quiet additions.*

**Why the recommendation:** Both are in the brief and need very little space.

**Done when:** The card and sync line are present. A meeting booked shows in the meetings count.

**Ask Giulio:** Confirm option A.

### 3.6 Dashboard names and Funnel and trends

**Status:** Not started · **Decision:** Option A approved, Oct 27 · **Effort:** S · **Screens:** Dashboard tabs, Performance

- **The brief:** Doc 3 lists Attack Plan, Calendar, Conversation Tracker, Outreach Performance, Reporting, Listing Activity, plus Funnel and trends (90 days versus the prior period). (Doc 3 Dashboard)
- **Today:** Today, Activity, Who to call, Calendar, Performance, Listings, Website (from the Oct 22 video).

**Options**

- **A. Keep the video names, add the funnel to Performance** **(recommended)**: Keep the Oct 22 names. Add a "Funnel and trends" section at the top of Performance: calls, conversations, confirmed numbers, meetings, valuations and listings, 90 days versus the prior 90. *No new tab, and his latest names.*
- **B. Switch back to the document names**: Use the doc 3 names. *Doc 3 was compiled from code and may lag his newer names.*
- **C. An eighth tab**: Funnel and trends as its own tab. *More tabs, less summary.*

**Why the recommendation:** The video is Thomas speaking, so it is the newer source. The funnel is a summary that belongs at the top of Performance.

**Done when:** Performance opens with the funnel. Tab names are unchanged unless Thomas says otherwise.

**Ask Giulio:** Confirm option A, or ask Thomas which names are current.

### 3.7 Best way to reach, and why

**Status:** Not started · **Decision:** Option A approved, Oct 27 · **Effort:** S · **Screens:** Case file, app contact

- **The brief:** Several phones and emails per person, each with a confidence, a source and a history, re-ranked by outcomes. Show "best way to reach, and why", not a flat list. (Doc 3 insights, doc 1 §8)
- **Today:** A Best way to reach card with confidence percentages.

**Options**

- **A. Add the why and the state** **(recommended)**: Each channel gets a one-line "why this one" ("answered Oct 21, 22 s") and a state chip: Confirmed, Candidate or Rejected. *Small additions to a card that already works.*

**Why the recommendation:** The card exists. It only needs the reason and the lifecycle.

**Done when:** Every channel shows why and its state. A wrong-person outcome moves a number to Rejected.

**Ask Giulio:** Confirm option A.

## Phase 4 · Later

Design these once phases 1 to 3 are approved.

- **Map:** Signal layers, territory switch, draw and select, make a list from a selection, Cartographer, coverage by channel. References: Felt and Apple Maps.
- **BOV in full and the deals workroom:** Comps you can swap, Thomas's price range, inferred figures marked, the internal-only panel; then CAs, tours, bids, underbidders and first-look emails per listing.
- **Prediction model page and Controls:** Weights with their evidence, backtest cards, the Data Scientist, lane switches with preconditions and a master switch, spend and job health.
- **The outbound lanes:** Email (Gmail-like, capacity by domain), Texting (Salesmsg-like, opt-ins), LinkedIn (buckets, 20 a day).
- **Two looks:** A switch between the current look and the new look, with a function parity checklist.
- **Smaller later items:** Seller clocks, Owners to Research, the inbound feed with a suggested next move, and the floating assistant's Tasks.

## Working rules for every change

- Check the code before trusting the "Today" line.
- Build only the approved option; a recorded decision is the approval.
- A preset in `config/project.js` for every new state.
- `python3 tools/check.py`, then a check at 1440 and 390 (and in the app when touched).
- Update PRODUCT.md, DESIGN.md and system.html as AGENTS.md requires.
- One commit per change, named "3.0 · <id> <title>". Push only when Giulio asks.
