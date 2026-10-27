# Kickoff prompt for Claude Code (3.0)

Open Claude Code in the prototype folder and paste everything below the line.

---

You are continuing the Death Star redesign prototype in this folder (Wattar Digital × Designli). We are starting version 3.0. Its goal is to make the prototype agree with the client's five orientation documents (Oct 24–26, 2026), with the best user experience and without making screens denser.

Read first, in this order:
1. AGENTS.md (the project rules; follow them).
2. PRODUCT.md, DESIGN.md and config/project.js.
3. docs/3.0/README.md. This is the plan: 21 changes in three phases, each with options, a recommendation, "done when" and a status.
4. docs/3.0/DECISIONS.md, if it exists. These are Giulio's choices. A choice recorded there is approved. A change with no recorded choice is not approved.
5. docs/client-walkthrough-gap-analysis.md, for background.

The client's source documents are PDFs in "/Users/gslo/Documents/Designli/Projects/Impact Weeks/Wattar Digital/PDFs/" (Orientation 1 to 5). The README quotes what matters, so open them only when a change needs more detail.

How to work:
- Work one phase at a time and one change at a time, in the README's order. Start the next phase only after Giulio approves the previous one.
- Before each change, check the current code first; the prototype may differ from the README's "Today" line. Then present the change in a few lines: what changes, the options, and your recommendation with its user-experience reason.
- If DECISIONS.md already approves an option, name it and ask only for a go-ahead. Otherwise ask Giulio with AskUserQuestion, recommended option first, and wait for the answer. If Giulio picks "Other", follow his words.
- Build only the approved option. Keep screens calm: summary first, detail one click down, and no new columns, panels or badges unless the option says so.
- Declare every new situation as a preset in config/project.js states.
- After each change: run python3 tools/check.py. Check the screen at 1440 wide and at 390 wide, plus the app screen when you touched it. Update PRODUCT.md, DESIGN.md and system.html when AGENTS.md says so. In the README, set the change's status to Done with the date and the option, and add the choice to DECISIONS.md.
- Commit each change on its own, for example "3.0 · 1.2 The client's call outcomes". Do not push until Giulio asks.
- At the end of each phase, give a short summary: what changed, where to look (screen and preset), and anything that needs Thomas.

Guardrails from the client's documents:
- Buildings are scored, people are called. Team history and engagement move an owner's rank, never the score. Never rank by number of buildings.
- Facts carry a dated source, and what an owner says is a claim with a source. No estimated loan dates, and never a price for the owner's own building in an opener.
- Nothing goes out without Thomas's click. Opt-out is permanent on every channel.
- Fictional data only.
- The web direction (5b Navy shell) is established. Change its tokens only through change 3.4's variant, unless Giulio explicitly says to switch.
- Disabled means a colour change, still focusable, with the tooltip "Not in this proposal yet".
- Never edit the design/ exports by hand. Do not edit docs/death-star-platform-changes.html unless asked.

Start with Phase 1, change 1.1. First tell me in five lines what you found in the code for 1.1, then ask.
