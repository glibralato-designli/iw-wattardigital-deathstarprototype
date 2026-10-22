# Client walkthrough vs. the new prototype: gap analysis

**Source:** Thomas Windels's three recorded walkthroughs of the current portal (APP_VIDEO_P1, P2 and P3; Oct 20–22, 2026; about 90 minutes in total), with their transcripts. These are compared with the prototype in this repo (direction 5b, navy shell) as of commit `c1dce6a`.
**Companion artifact:** "Death Star Walkthrough" (the Walkthrough tab has the module-by-module tour with screenshots; the Gaps tab mirrors this document).

**How to use this document.** It is input for the next design iteration. It does **not** widen scope by itself. Per `AGENTS.md`, nothing here should be built until the designer approves it. Each item has:
- **Thomas wants:** what he asked for, paraphrased, with a timestamp (P1 = Part 1 tour, P2 = Part 2 tour, P3 = backstory). P1 and P2 timestamps are approximate (±1 min) because those transcripts have no timestamps.
- **Prototype today:** LIVE, DRAWN (shown, disabled with "Not in this proposal yet") or ABSENT.
- **Gap / suggestion:** what is missing and a possible change, kept at proposal level.
- **Priority:** **P1** strengthens the core loop or answers something he stressed repeatedly; **P2** is a strong signal worth showing; **P3** is later, or belongs to the technical track rather than design.

---

## 1. What the prototype already gets right (keep)

These match the walkthrough closely, so it's worth pointing them out to Thomas.

| Thomas said | Prototype |
|---|---|
| Open a contact and get the "why now", with the full explanation and every detail verified or flagged (P1 ~24:00) | The why-now card with Verified / Single source / Stale / Disputed, "Why this?" drivers and evidence, and Flag as wrong. **Strong match.** |
| When a number is confirmed on a call, save it so the next export doesn't cycle through five numbers (P2 ~04:00–06:00) | The outcome tray has Save note to record, Mark number primary, Mark number bad, and "Remove from blasts for 1 year". The "Best way to reach" card ranks contact points ("Confirmed by us"). **Strong match** (but see the bug in §4.2). |
| A weekly rhythm: Tuesday social plus a Constant Contact blast, Wednesday mail merges… (P1 06:40–07:30) | The Attack Plan's "This week" strip has a per-day channel focus (Calls · Sourcing, Mail merge · Listings, LinkedIn · Market info…). **Good match.** |
| Conversations answer "what did I accomplish this week" (P1 ~07:50) | The Conversations board by weekday, with outcome tags and next steps; Connected calls add a card automatically. **Match.** |
| Listings should show **who** viewed, not just counts (P1 ~16:45) | Listings has "Viewed by · 30 days", with rows that link to the contact. **Match.** |
| See who downloads the OMs, which are higher-quality leads (P1 ~18:00) | Web analytics has "Documents and OMs" with downloads per file, and Known contacts. **Partial:** per-file *who* is missing (see §3.7). |
| Property page with all the PropertyShark detail: free-market vs stabilized units, SF, financials, violations (P1 25:30–26:50) | The property record has a key-facts strip, Units and rent (FM/RS), Debt and capital, Lot and zoning, Violations (DOB/ECB/HPD). **Strong match**, except the facade photo and mini map (§3.4). |
| Talk to the real owner, not the property manager (P1 ~26:30; P3 04:00–05:00) | The case file Details tab has "Behind the entity · NY Dept. of State", plus Real owner and Contact type. **Partial match.** |
| "Simpler, the better, without losing content" (P1 ~19:30) | "Summary first, detail on request" and one Brain line per tab. **Match in spirit.** |
| Everything for his approval; he stays the last touch point (P2 ~14:50) | "Brain proposes, Thomas approves" (the list-save approval bar). **Match, but only one instance.** |
| Keep his vocabulary and the tools he knows (P2 07:40, P2 12:20) | "Keep Thomas's labels and order." **Match.** |

---

## 2. Cross-cutting themes and how well the prototype covers them

### T1. "Maximum fluidity": any report becomes a new, precise list. **P1, biggest gap.**
- **Thomas wants:** to take any reporting view (blast openers, listing viewers, ZIP coverage) and filter it into new outreach, combining any variables. Examples:
  - "everyone who opened the blast who is a Class A seller with a fully free-market building" (P1 ~14:30–15:20, ~20:20)
  - "LinkedIn connections the team proposed to in 2017–2020 who own a fully free-market building over 10,000 SF in these neighborhoods" (P2 ~02:00)
  - "everyone who viewed 126 Pearl who owns in the same neighborhood, and not people who don't own" (P1 ~20:30)

  He said it at least eight times, including "cannot emphasize enough".
- **Prototype today:**
  - The Database filters are three single-choice selects (class, trust, signal) combined with AND. The "In territory" toggle does nothing.
  - ABSENT: a multi-criteria builder, multi-select, "save filter as list", and "push to outreach" from a table.
  - The Reporting "See who" and ZIP drill-downs, and Listings "View all", are DRAWN.
  - The Brain `/list` answer returns fixed chips, and the saved list shows up disabled.
- **Gap / suggestion:**
  1. **"Turn this into a list"** on every reporting surface (funnel stage, Clicked what, ZIP tile, listing viewers, OM downloads, known contacts). It opens the Database pre-filtered with editable criteria chips.
  2. A **criteria builder** in the Database: stack chips for Class, Signal, Trust, Building type (free market / RS / mixed), Units / SF range, Neighborhood / ZIP, Team history (proposal / first meeting / listing, with year range), Engagement (opened / clicked / viewed listing X / downloaded OM), Social connection, and Last team touch. Each chip can be edited. Show a live count. Actions: Save as list, Push to queue (Phone / Mail merge / Constant Contact).
  3. Brain's list answer should open in that builder, so chat and filters are the same object.
  4. Make the saved list show up as a working entry in Lists, not a disabled one.

  Present this as one demo path: Reporting › Clicked "41 Ludlow OM" → Turn into list → add "Class A" and "fully free market" → Save → Push to Phone.

### T2. "A broker, not an assistant": distil history, don't just log it. **P1.**
- **Thomas wants:**
  - Opening a contact years from now should give "a long history of outreach, here are the few substantive notes, here's your team history, here's what's happening now, this is why to reach out now". Not "on this date he hung up" (P1 ~09:30–11:00; P2 ~05:30; P3 33:17–34:01).
  - The system decides which notes matter.
- **Prototype today:**
  - Activity is a raw, month-grouped timeline. History is field changes.
  - Notes are a plain list.
  - The why now covers the *building* signals, not the *relationship*.
- **Gap / suggestion:**
  - A **Relationship summary** block on the case file Overview, next to the why now. It shows:
    - "N touches since 2014"
    - the 2–3 notes that matter (Brain-picked, each linking to the original)
    - team history ("John proposed on 118 Ludlow in 2012; it sold in 2017 to the current owner")
    - last reply
    - a suggested angle
  - Keep the raw timeline in Activity.
  - The contact screen in the current portal already has "Relationship / Why call now / Warmth / Who on the team knew them / What they said / Connected people". The redesign should carry these over (see §3.3).

### T3. Team history as a first-class layer. **P1.**
- **Thomas wants:**
  - His boss's imported archive (≈10,000 OneDrive documents plus messy Salesforce data) turned into a chronological team history, layered on top of the empirical model but kept separate from it (P2 21:03–22:42; P1 ~22:30).
  - Example: "we proposed on this building in 2012, it sold, the new owner has X going on, the team still knows the building."
- **Prototype today:**
  - ABSENT. Single user; every action is attributed to "Thomas W."
  - "Proposals" exist only as two Conversations cards.
  - "Accessibility" relationship strength exists on Intelligence.
- **Gap / suggestion:**
  - Add a team-history strand to the property record (Ownership history, currently a DRAWN tab) and to the case file. Show it as dated team events: proposal, BOV, first meeting, listing, sale, each with who on the team and a document link.
  - Show "Team knows this building" as a chip that is **visibly separate from the score**, to respect his "keep it separate from the empirical model".
  - Add it to the criteria builder (T1).

### T4. Everything becomes outreach. **P2.**
- **Thomas wants:** headlines, market data, listing views, OM downloads and email clicks each to lead to an action: a post, a tailored email, a call (P1 26:51–29:51; P2 ~10:00; P3 34:01–35:22).
- **Prototype today:**
  - Headlines and Market Data are DRAWN (under More).
  - The Brain "This week's market brief" suggestion is DRAWN.
  - Report actions are DRAWN.
- **Gap / suggestion:**
  - Give each display tab one primary next action (the T1 list action covers most of them).
  - Add one scripted Brain flow: "Turn this headline into a LinkedIn post for rent-stabilized owners in the LES". This shows story → audience → draft → approve.
  - Consider bringing Headlines into the proposal as a drawn read-only screen, since he spent about 4 minutes on it.

### T5. Proactive system, with Thomas as the last touch. **P2.**
- **Thomas wants:**
  - Suggested lists ("based on last week's outreach, here are the lists I suggest", P2 ~01:50).
  - Content pre-drafted for the week (P2 ~14:40).
  - Everything sent for his approval "until we have enough trust in the system" (P2 ~14:50).
- **Prototype today:**
  - A proactive Brain message on Home, one nudge line per Dashboard tab, and a list-save approval.
  - The Attack Plan's future days say "Brain builds this call list the morning of…".
- **Gap / suggestion:**
  - Generalise the approval bar into an **Approvals** pattern for drafts (mail merge, post, text) and suggested lists.
  - Show 2–3 "Suggested by Brain" lists on the Attack Plan or Outreach entry point, each with its reason ("12 owners opened the Q3 report and haven't been called").

### T6. Simplify. **P2 (design decision).**
- **Thomas wants:** "We're probably going to want to simplify the dashboard a bunch, kind of consolidate" (P1 ~20:00); "simplify, simplify, simplify" (P1 ~25:00).
- **Prototype today:** all seven Dashboard tabs are kept by design ("names the 7 Dashboard tabs" is a success test). The case file has 6 tabs plus a rail.
- **Gap / suggestion:** this tension is worth stating openly in the presentation. Keeping his vocabulary was right, but he has invited consolidation himself. Options:
  - (a) Group the four display tabs under one "Reports" tab with sub-views.
  - (b) Merge Reporting into Outreach performance.
  - (c) Keep all seven and test it.

  Decide before the client call.

### T7. Verified data and data trust. **Covered (P3 for the remainder).**
- Trust statuses, evidence and flags cover the design side.
- Still open:
  - The territory: his is **Main Body Manhattan, 100th St to the southern tip** (P3 01:55). PRODUCT.md and the fixtures use the "Lower East Side", and the "In territory" switch does nothing. **Done (phase 1):** see §4.1.
  - Scale: ~40,000 contacts (P3 25:14) vs 320 in the Lists. **Done (phase 1):** see §4.7.
- The data-stack audit (P1 ~21:40, P2 ~21:10) and subscription review (P2 ~22:50) are technical-track items, not design.

---

## 3. Module by module

### 3.1 Home. P1 01:27
- **Thomas wants:** one ecosystem. He is open to the starting point changing ("wherever it is in the new workflow").
- **Prototype:** LIVE and strong. It covers the greeting, Attack Plan card, pulse, metric tabs, Up next and meetings.
- **Gap:**
  - Home doesn't mention listings or website follow-ups, which he treats as daily work.
  - Consider one "Follow-ups from engagement" item: "3 people viewed 41 Ludlow; 2 are in your database." It already exists as the Listings nudge.
- **Priority:** P2.

### 3.2 Dashboard

**Attack Plan / Today** (P1 02:33–07:40)
- **Thomas wants:**
  - Day plan, week plan and goals that come from previous outreach and new intelligence, "not shots in the dark".
  - A repeatable weekly template.
  - Goals aligned with the plan.
- **Prototype:** LIVE. It has a ranked call list with a why now each, To-dos, the This week focus strip, and Daily/Weekly/Monthly goals with auto-counted progress.
- **Gaps:**
  - Goals can't be created or edited (P2).
  - The week template isn't editable; it should be "pretty similar week to week" (P2).
  - The plan doesn't explain where today's list comes from. Add a one-line source: "From LES maturities + 3 callbacks + 2 blast openers" (P2).

**Activity / Conversations** (P1 07:40–08:30)
- **Thomas wants:**
  - What was accomplished, what was important about each conversation, what to follow up, and what to save to the database.
  - A **cold-calling coach** that tracks which call styles produce conversations.
- **Prototype:** the board is LIVE.
- **Gaps:**
  - No weekly summary line ("9 conversations, 3 worth a follow-up, 1 first meeting booked") (P2).
  - The cold-calling coach is ABSENT. That's fine as a later item; mention it as a Brain capability (P3).

**Calendar** (P1 08:33–09:50)
- **Thomas wants:** meetings, scheduled calls, BOV pitches and tours, "not jamming this with LinkedIn posts". It should be stored as data so the system can later say "you had a call with him on Oct 19, here are the notes".
- **Prototype:** LIVE (create-only). The fixtures **include** a LinkedIn post, a Constant Contact send, mail merge and call blocks as calendar events.
- **Gaps:**
  - **Content conflicts with his request.** Either move outreach scheduling to the week plan, or keep a separate "Outreach" calendar that is off by default (P1, quick fix). **Done (phase 1):** moved to the week plan; see §4.3.
  - Events linked to a contact should show up in that contact's Activity (P2). **Done (phase 1):** past events in the timeline, upcoming ones under Upcoming and overdue.

**Performance** (P1 09:50–13:40)
- **Thomas wants:**
  - Calls → conversations → confirmed numbers as a measure of data accuracy *and* phone effectiveness.
  - Listings and first meetings over 90 days.
  - "If it's not trending in the right direction, what is wrong?" Fewer calls, bad numbers, weak calling, or bad data.
  - Outreach performance across all channels.
- **Prototype:** display-only. It counts automatically, shows hit rate and efficacy, logged business generation with deltas, workflow efficacy, and model accuracy.
- **Gaps:**
  - Add a **diagnosis line** when a metric drops, e.g. "Conversations down 40%: calls are flat but confirmed numbers fell, so check data quality on the LES list." This fits the existing one-line Brain nudge (P2).
  - Clicking any number should lead to the people behind it (T1) (P1).

**Reporting / coverage** (P1 13:40–16:30)
- **Thomas wants:** coverage across channels by ZIP. Click a ZIP to see campaigns, owners and who clicked, then create outreach from it. Low coverage means "cover the zip better" and see which topics work there.
- **Prototype:** ZIP tiles weakest first, the funnel, Clicked what, and engagement by channel. Drill-downs and filters are DRAWN.
- **Gaps:**
  - The ZIP drill-down, with a "Create outreach for this ZIP" action (P1, through T1).
  - Topic performance per ZIP is ABSENT (P3).

**Listings** (P1 16:30–17:40)
- **Thomas wants:**
  - The full list of everyone who viewed a listing, so he can mail-merge "saw you saw our listing".
  - Written offers organised for price-reduction follow-ups.
  - LinkedIn, Instagram and Facebook views as follow-up triggers.
- **Prototype:** viewers are LIVE links. The Log buttons, Open OM and View all are DRAWN.
- **Gaps:**
  - "Follow up with viewers" leading to a filtered list with an "owns in the same neighborhood" criterion. This is his own example of nuance: people view a listing to price their own building (P1).
  - Offers as a list with amounts, to support "we just reduced the price, any room to come up?" (P2).

**Website analytics** (P1 17:40–20:30)
- **Thomas wants:** who downloaded each OM, what pages people viewed, and event viewers who didn't register, so he can call them.
- **Prototype:** downloads per file and Known contacts.
- **Gaps:**
  - Who downloaded each file (P1).
  - An "Event viewers who didn't RSVP" segment (P2).
  - Custom date ranges ("93 days, 35 days"); currently DRAWN (P3).

### 3.3 Database: contact case file (P1 21:33–25:15)
- **Thomas wants:**
  - Simple: the why now on top, the full explanation underneath, every detail verified or marked unverifiable ("PropertyShark has X on record; no public record confirms it").
  - Contact data that keeps improving.
  - The whole portfolio, and notes "stored, period", with the system deciding what's important.
- **Prototype:** strong (see §1).
- **Gaps:**
  - The Relationship summary (T2) and team history (T3) (P1).
  - The current portal's contact page has **Warmth (0–100), "Who on the team knew them", "What they said" and "Connected people"** (co-owners across buildings). The prototype has warmth as "Accessibility" on Intelligence and no connected people. Bring connected people onto the Ownership tab or the rail (P2).
  - **Density check:** the why now, best way to reach, key facts, activity and notes on Overview, plus 5 more tabs and a 3-card rail. Test against "simple and to the point, so when I read it, I got it" (P2).

### 3.4 Database: property record (P1 25:15–26:50)
- **Thomas wants:** a facade photo, a little map, everything from PropertyShark, documents (deeds, BS documents), financials, and the real owner from the deed.
- **Prototype:** facts are strong. The facade, map and street view are DRAWN or placeholders, and Documents is DRAWN.
- **Gaps:**
  - Show an illustrated facade and a static map tile in the demo. Listings already uses illustrations (P2).
  - Documents: show the deed as the "layer of truth" behind the owner, linked from Ownership (P2).

### 3.5 Headlines and Market Data (P1 26:51–29:51)
- **Thomas wants:**
  - A system that tracks storylines over years and can say what the market looked like in 2026.
  - Summaries turned into posts.
  - Relevance per owner type, e.g. the rent freeze for rent-stabilized owners.
  - Graphs on request ("lending rates vs sale volume") to post.
  - Who's lending.
- **Prototype:** DRAWN (under More).
- **Gaps:**
  - The most-explained area that has no screen in the proposal.
  - Suggest at least one read-only Headlines screen, with each story tagged "Relevant to: N owners in your list" and a "Draft a post" action that goes through Brain approval (P2).
  - Market Data can stay out for now (P3).

### 3.6 Outreach Queue (P2 01:45–03:24)
- **Thomas wants:** the attack-list builder with proactive suggestions and maximum specificity, then push to Phone, Mail merge or Constant Contact.
- **Prototype:** DRAWN. "Add to queue" shows only a toast.
- **Gaps:** covered by T1 and T5. The criteria builder is the queue builder; consider putting it here rather than in the Database (P1).

### 3.7 Phone (Terrakotta) (P2 03:45–07:39)
- **Thomas wants:**
  - Push a queue to Terrakotta using only trusted numbers.
  - Conversation notes saved to the database.
  - Confirmed numbers become the primary cell.
  - Eventually automatic: substantive notes are kept, noise is dropped, and "confirmed" only marks the number.
- **Prototype:** the in-record call loop and the outcome tray are LIVE (strong). The Phone page is DRAWN. Terrakotta isn't named.
- **Gaps:**
  - **Bug:** "Mark number primary" and "Remove from blasts for 1 year" are not applied in `doSave` (`js/screens/contact.js`). Fix this so the demo matches the promise (P1). **Done (phase 1):** see §4.2.
  - Name the dialer ("Calls through Terrakotta") somewhere in the call band, for his recognition (P3).
  - The note-importance idea links to T2.

### 3.8 Email (P2 07:39–10:51)
- **Thomas wants:**
  - A Gmail-like command central for mail merges and single emails.
  - Lists that build themselves (e.g. "everyone I left call notes for today").
  - Campaign types: cold (signal-based), warm follow-up, and selling listings.
  - Delivered / viewed / clicked saved to the contact for years.
  - Capacity in the tens of thousands a day.
- **Prototype:** DRAWN. Engagement appears in Reporting and in the case file timeline (email opened).
- **Gaps:**
  - Out of scope for now. If shown, one key moment matters most: "End of day: follow up with today's 6 conversations". This builds a list from today's logged notes, drafts it, and he approves (P2, via T5).
  - Capacity is a technical item (P3).

### 3.9 Texting and cross-channel sequences (P2 10:51–12:15)
- **Thomas wants:** texting as a more human touch, used selectively. A pointed cross-channel sequence: they click an email → text "saw you took a look" → LinkedIn request mentioning the text.
- **Prototype:** DRAWN.
- **Gap:** no concept of a **sequence** across channels. Consider one illustration of a per-owner "next touch" suggestion on the case file ("Opened the Q3 report 2 days ago · Suggested: text, then LinkedIn") (P2).

### 3.10 Marketing (P2 12:15–13:27)
- **Thomas wants:** Constant Contact's workflow, with delivered/viewed/bounced reporting; brand items; channels working together.
- **Prototype:** DRAWN. Constant Contact data appears in Reporting.
- **Gap:** out of scope. Keep Constant Contact's vocabulary when it is designed (P3).

### 3.11 LinkedIn and Social (P2 13:27–15:00)
- **Thomas wants:**
  - Connect with everyone, warm contacts and owners with active signals first, as automated as possible without getting banned.
  - A repeatable weekly social plan with content the system pre-drafts and he approves.
  - Instagram and Facebook added.
- **Prototype:** DRAWN. The LinkedIn connection % is in Outreach performance.
- **Gap:** "Social connection" as a T1 criterion. The weekly content plan fits the Attack Plan week strip plus Approvals (T5) (P2).

### 3.12 Website (P2 15:00–16:42)
- **Thomas wants:**
  - Edit everything in the portal (new listing, price reduction, event) and publish it quickly.
  - A registration gate that captures purchase criteria and verifies phone and email by code.
- **Prototype:** DRAWN. Registrations appear as data in Listings.
- **Gap:** out of scope. One possible bridge: a "Price reduced" action on a Listings card that updates the site and offers "Tell the 12 viewers" (P3).

### 3.13 Map (P2 16:42–17:48)
- **Thomas wants:** list-building by layer (Class A, team listings, former team proposals) with peak fluidity, and coverage by channel.
- **Prototype:** DRAWN. ZIP coverage is in Reporting.
- **Gap:** the map is a natural view of the T1 builder ("same criteria, map view") (P3 for the POC).

### 3.14 Brain (P2 17:48–18:24, throughout)
- **Thomas wants:**
  - Learning mode, to "train it to become a broker".
  - Drop files anywhere for the system to take in.
  - Long-term memory of the market.
- **Prototype:** chat and scripted answers are LIVE. Learning Mode, attachments, Ask/Act, @ and / are decorative or DRAWN. Stored documents are read-only.
- **Gaps:**
  - Show **one teaching moment**: Thomas corrects an answer ("Okafor isn't a seller, she's refinancing") → Brain asks "Remember this for Okafor and similar family owners?" → approve. Flag as wrong already exists on evidence; this extends it to Brain (P2).
  - Add scripted answers for the walkthrough's core asks: a relationship summary (T2), a list from report criteria (T1), and headline → post (T4) (P2).
  - Make the attachment icon open a "Drop files" state, even if it's simulated (P3).

### 3.15 BOV and OM Generator (P2 18:24–21:03)
- **Thomas wants:**
  - Generate a BOV (pitch: comps and a price range) or an OM (marketing package) "in a second". Through the firm this takes about two months: "I'm kind of done with it".
  - The system knows the building, pulls comps his way, and every cell stays editable with its formula (change a rent and the totals update).
- **Prototype:** DRAWN ("BOV & OM" under More; "Open auto-BOV" and "Open OM" disabled). BOV proposals appear on Conversations.
- **Gap:**
  - **Personally urgent for him** and fully absent from the proposal.
  - Even one drawn screen would show we heard it: "BOV for 118 Ludlow: inputs pre-filled from the record, comps with trust badges, price-range table, Generate deck".
  - Alternatively, name it explicitly as the next phase in the presentation (P2).

### 3.16 Prediction model, team history, data and subscriptions (P2 21:03–24:00)
- **Thomas wants:**
  - An empirical model (reverse-engineered from recent sales).
  - Team history layered on top but kept separate.
  - A data-stack audit.
  - Constant scraping and cleaning (PropertyShark has no API).
  - A subscription review.
  - Microsoft Office as maybe "a folder in the system".
- **Prototype:** the score breakdown and model accuracy are LIVE. The Prediction Model page is DRAWN. Team history is ABSENT; Office and Integrations are DRAWN.
- **Gap:**
  - Team history: see T3 (P1).
  - The rest is the technical track (Guido): data stack, scraping, subscriptions (P3 for design).

---

## 4. Prototype fixes and alignment (quick, low risk)

1. **Territory:**
   - "In territory" in the Database is a no-op. Make it filter.
   - Align the persona and the toggle's label with **Main Body Manhattan (100th St to the southern tip)**. PRODUCT.md and the fixtures currently say the Lower East Side.
   - His territory is wider than the LES-heavy demo data. Consider at least one Upper East Side or Midtown record.
   - **Done (phase 1):** the switch filters contacts and properties (with a "matches outside the territory" empty state); PRODUCT.md, the fixtures and the switch's tooltip say Main Body Manhattan; added Upper East Side, Midtown West and Chelsea owners plus one Central Harlem owner outside the territory.
2. **Outcome tray:** apply "Mark number primary" and "Remove from blasts for 1 year" on save (`contact.js` `doSave`). Show the result: the number gets the Primary badge, and an "Excluded from blasts until Sep 30, 2027" chip appears in Details.
   - **Done (phase 1):** the tray picks the number reached; on save primary, bad and blast exclusion apply, the Primary badge moves in Best way to reach, the chip shows in Details › Email, and History records each change.
3. **Calendar fixtures:** remove or separate the LinkedIn post, Constant Contact send and mail merge events (§3.2 Calendar).
   - **Done (phase 1):** the Marketing calendar became BOV pitches; outreach stays in the Attack Plan week strip; linked events show in the contact's Activity.
4. **Database search:** the placeholder promises email, but email isn't searched. Either search email or change the placeholder.
   - **Done (phase 1):** the Database and ⌘K match personal and business email.
5. **Brain composer:** Ask/Act, @, / and the paperclip are visible but do nothing. Either disable them with the standard tooltip or wire minimal states.
   - **Done (phase 1):** all composer tools (and Learning) are disabled buttons with "Not in this proposal yet"; the paperclip gets its Drop files state in phase 3.
6. **Docs drift:** the Property Deals tab is live in the code but described as drawn in the changes doc.
   - **Done (phase 1):** the changes doc and PRODUCT.md describe Deals as live with its empty state.
7. **Scale cues:** Lists show 320 contacts; his database is ~40,000 (P3 25:14). Bigger counts in Lists and Reporting would make the demo feel like his system.
   - **Done (phase 1):** Lists, Database totals, the pager, Reporting (coverage, funnel, Clicked what, digest), LinkedIn reach and the Home tiles use a 40,212-contact database; the rows stay fictional.

---

## 5. Suggested priorities for the next iteration

1. **T1 "Turn any report into a list"** plus a criteria builder with Save and Push to queue. This is the core of his walkthrough.
2. **Relationship summary and team history** on the case file and property record (T2, T3).
3. **Fixes from §4** (territory, outcome actions, calendar content). Small changes that build trust in the demo.
4. **Proactive Brain:** suggested lists with reasons, a general Approvals pattern, and one teaching moment (T5, §3.14).
5. **One "intelligence → outreach" flow:** a headline or listing viewers → draft → approve (T4).
6. **BOV/OM:** one drawn screen, or an explicit "next phase" slide (§3.15).
7. **Decide the Dashboard consolidation question** (T6) before the client call.

## 6. Open questions to add to PRODUCT.md
- Which criteria does Thomas use most when building lists? (His examples: class, building type FM/RS, size, neighborhood/ZIP, team history with year range, engagement, social connection.)
- What form does the team-history data take after import (proposals, BOVs, meetings, listings, sales per building)? Is it attributable to individual team members?
- Should outreach scheduling (posts, blasts, merges) live in the Calendar or only in the week plan?
- Does he want the seven Dashboard tabs kept, or consolidated as he suggested?
- How much should Brain act on its own vs propose? He says approval "until we have enough trust". What would earn that trust?
