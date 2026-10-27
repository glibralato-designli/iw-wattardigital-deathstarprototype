/* Death Star demo fixtures. All people, entities, addresses and BBLs are fictional.
   "Today" is Wednesday, September 30, 2026. Offsets (off) count days from today. */
(() => {
  const TODAY = new Date(2026, 8, 30);
  const addD = n => { const d = new Date(TODAY); d.setDate(d.getDate() + n); return d; };

  const C = [
    ['marchetti', 'Daniel Marchetti', 'Ludlow 118 Holdings LLC', 'A', 'p118', 'Loan maturity', '$9.4M loan due in June on 37 units', 'Daniel Marchetti has a $9.4M loan coming due in June on his 37-unit Ludlow Street building. He’ll need to refinance or sell, so now’s the time to get in front of him.', 'verified', '41d ago · No answer', '(212) 555-0147', 'Contacted', 19, 'Debt Clock', 'Rising', 'Domestic LLC · Family owner', 1],
    ['feld', 'Aaron Feld', 'Orchard 27 Realty LLC', 'A', 'p27o', 'Estate transition', 'Inherited in March; estate in probate', 'Aaron Feld inherited 27 Orchard St in March, and public records suggest the estate is still in probate. Heirs often sell within two years.', 'single', 'Never called', '(212) 555-0182', 'New', 1, 'Estate Transition', 'Rising', 'Domestic LLC · Heir', 0],
    ['okafor', 'Grace Okafor', 'Clinton Street Partners LP', 'A', 'p90c', 'Loan maturity', '$6.1M loan due in August; held 22 years', 'Grace Okafor’s $6.1M loan on 90 Clinton St matures in August, and her family has held the building for 22 years. A sale or recap is likely this year.', 'verified', '12d ago · Voicemail', '(212) 555-0164', 'Contacted', 22, 'Debt Clock', 'Steady', 'Limited partnership · Family office', 1],
    ['adler', 'Ruth Adler', 'Adler Family Trust', 'B', 'p64e', 'Long hold', 'Held 31 years; partners in their 70s', 'Ruth Adler’s family has held 64 Essex St for 31 years, and both partners are in their 70s. Long holds like this often trade when the next generation takes over.', 'verified', '3d ago · Callback set', '(212) 555-0121', 'Engaged', 31, 'Legacy Hold', 'Steady', 'Trust · Family owner', 1],
    ['rivera', 'Marisol Rivera', 'Rivera Holdings LLC', 'B', 'p212e', 'Unused FAR', '9,400 SF of unused air rights', 'Marisol Rivera’s building at 212 E 3rd St has 9,400 SF of unused development rights. Developers are paying for air rights in the East Village, which could prompt a sale.', 'verified', '27d ago · No answer', '(212) 555-0138', 'Contacted', 18, 'Fund Exit', 'Rising', 'Domestic LLC · Private owner', 1],
    ['kowalski', 'Peter Kowalski', 'Avenue B Owners LLC', 'B', 'p31b', 'Loan maturity', '$3.2M loan due in November', 'Peter Kowalski has a $3.2M loan on 31 Avenue B coming due in November. With rates where they are, he may prefer to sell than refinance.', 'verified', 'Never called', '(212) 555-0175', 'New', 14, 'Debt Clock', 'Rising', 'Domestic LLC · Private owner', 0],
    ['chen', 'Wei Chen', 'Delancey Owners LLC', 'B', 'p155d', 'Lis pendens', 'Lis pendens filed in August', 'A lis pendens was filed against 155 Delancey St in August. Owners facing a foreclosure action often look for a quick sale.', 'stale', '64d ago · Not interested', '(212) 555-0193', 'Nurture', 9, 'Partner Split', 'Falling', 'Domestic LLC · Partnership', 0],
    ['shah', 'Anita Shah', 'Allen Street Realty LLC', 'C', 'p48a', 'Long hold', 'Held 26 years, no recent activity', 'Anita Shah has held 48 Allen St for 26 years with no refinance or listing. Worth a check-in, not a pitch.', 'single', '90d ago · Voicemail', '(212) 555-0110', 'Contacted', 26, 'Legacy Hold', 'Steady', 'Domestic LLC · Private owner', 0],
    ['greene', 'Michael Greene', 'Rivington 19 LLC', 'C', 'p19r', 'Nearby sale', 'Listed a nearby building last year', 'Michael Greene listed a nearby building last year and pulled it. He may be open to talking about 19 Rivington St.', 'stale', '5mo ago · Connected', '(212) 555-0156', 'Nurture', 11, 'Fund Exit', 'Falling', 'Domestic LLC · Investor', 0],
    ['morales', 'Elena Morales', 'Stanton 7 LLC', 'D', 'p7s', 'Long hold', 'Long hold; few signals', 'Elena Morales has owned 7 Stanton St for 15 years. There are few signals right now, so keep her informed rather than calling.', 'single', 'Never called', '(212) 555-0149', 'New', 15, 'Legacy Hold', 'Steady', 'Domestic LLC · Private owner', 0],
    ['baum', 'Harold Baum', 'Norfolk 120 Associates', 'D', 'p120n', 'Recent refinance', 'Refinanced in 2024 on a 10-year term', 'Harold Baum refinanced 120 Norfolk St in 2024 on a 10-year term. He’s likely to hold.', 'verified', '2mo ago · Not interested', '(212) 555-0187', 'Do not contact', 21, 'Legacy Hold', 'Steady', 'Domestic LLC · Private owner', 0],
    // Outside the Lower East Side: Upper East Side, Midtown and Chelsea are in the territory; Central Harlem (north of 100th St) is not.
    ['lindqvist', 'Erik Lindqvist', 'East 82nd Street Associates LLC', 'A', 'p311e', 'Loan maturity', '$7.8M loan due in March on 30 units', 'Erik Lindqvist’s $7.8M loan on 311 E 82nd St matures in March, and the building has had no refinance since 2015. Owners in this spot often test a sale before they refinance.', 'verified', '19d ago · Voicemail', '(212) 555-0131', 'Contacted', 17, 'Debt Clock', 'Rising', 'Domestic LLC · Family owner', 1],
    ['osei', 'Kwame Osei', 'West 46th Holdings LLC', 'B', 'p418w', 'Long hold', 'Held 28 years; owner in his late 60s', 'Kwame Osei has held 418 W 46th St for 28 years and is in his late 60s. Long holds in Midtown West tend to trade when the owner starts planning the estate.', 'verified', 'Never called', '(212) 555-0168', 'New', 28, 'Legacy Hold', 'Steady', 'Domestic LLC · Private owner', 0],
    ['brennan', 'Claire Brennan', 'Chelsea 22 Realty LLC', 'C', 'p236w', 'Nearby sale', 'Two buildings on the block sold this year', 'Two walk-ups on Claire Brennan’s block of W 22nd St sold this year. Public records suggest she has been approached before. Worth a check-in with the comps.', 'single', '4mo ago · Connected', '(212) 555-0114', 'Nurture', 12, 'Fund Exit', 'Steady', 'Domestic LLC · Investor', 1],
    ['dubois', 'Marc Dubois', 'Lenox 130 LLC', 'B', 'p130w', 'Loan maturity', '$2.6M loan due in May', 'Marc Dubois has a $2.6M loan on 130 W 130th St due in May. The building is in Central Harlem, outside the territory.', 'single', 'Never called', '(212) 555-0172', 'New', 9, 'Debt Clock', 'Rising', 'Domestic LLC · Private owner', 0],
  ].map(([id, name, entity, cls, pid, signal, why, whyFull, trust, last, phone, status, years, narrative, momentum, meta, warm]) => ({ id, name, entity, cls, pid, signal, why, whyFull, trust, last, phone, status, years, narrative, momentum, meta, warm }));

  const P = [
    ['p118', '118 Ludlow St', 'Lower East Side', '10002', '1-00412-0033', 'marchetti', 37, 12, 25, 21400, 1910, '$9.4M', 'Jun 9, 2026', 4, 88],
    ['p22h', '22 Hester St', 'Chinatown', '10002', '1-00301-0018', 'marchetti', 16, 10, 6, 9800, 1925, '$2.1M', 'Mar 2029', 1, 46],
    ['p9l', '9 Ludlow St', 'Lower East Side', '10002', '1-00296-0041', 'marchetti', 12, 4, 8, 7200, 1920, 'Not on record', 'Not on record', 1, 31],
    ['p27o', '27 Orchard St', 'Lower East Side', '10002', '1-00297-0012', 'feld', 24, 24, 0, 14100, 1915, '$3.8M', 'Jan 2028', 2, 91],
    ['p90c', '90 Clinton St', 'Lower East Side', '10002', '1-00348-0025', 'okafor', 41, 20, 21, 26800, 1928, '$6.1M', 'Aug 2026', 3, 89],
    ['p64e', '64 Essex St', 'Lower East Side', '10002', '1-00352-0007', 'adler', 20, 6, 14, 12400, 1905, '$1.4M', 'Dec 2030', 2, 68],
    ['p155d', '155 Delancey St', 'Lower East Side', '10002', '1-00346-0031', 'chen', 30, 18, 12, 19600, 1931, '$4.9M', 'Feb 2027', 2, 66],
    ['p212e', '212 E 3rd St', 'East Village', '10009', '1-00385-0044', 'rivera', 18, 8, 10, 11300, 1900, '$1.9M', 'Oct 2029', 2, 74],
    ['p31b', '31 Avenue B', 'East Village', '10009', '1-00384-0002', 'kowalski', 22, 12, 10, 13800, 1910, '$3.2M', 'Nov 2026', 2, 72],
    ['p48a', '48 Allen St', 'Lower East Side', '10002', '1-00308-0019', 'shah', 14, 6, 8, 8600, 1915, 'Not on record', 'Not on record', 1, 52],
    ['p19r', '19 Rivington St', 'Lower East Side', '10002', '1-00425-0036', 'greene', 10, 10, 0, 6400, 1925, '$1.1M', 'Jul 2031', 1, 44],
    ['p7s', '7 Stanton St', 'Lower East Side', '10002', '1-00426-0003', 'morales', 8, 2, 6, 5100, 1910, 'Not on record', 'Not on record', 0, 28],
    ['p120n', '120 Norfolk St', 'Lower East Side', '10002', '1-00354-0028', 'baum', 26, 14, 12, 16200, 1930, '$5.5M', 'May 2034', 0, 11],
    ['p311e', '311 E 82nd St', 'Upper East Side', '10028', '1-01545-0021', 'lindqvist', 30, 30, 0, 22600, 1920, '$7.8M', 'Mar 2027', 3, 82],
    ['p418w', '418 W 46th St', 'Midtown West', '10036', '1-01055-0034', 'osei', 20, 8, 12, 13200, 1910, '$1.6M', 'Sep 2030', 1, 70],
    ['p236w', '236 W 22nd St', 'Chelsea', '10011', '1-00773-0045', 'brennan', 14, 9, 5, 9900, 1900, 'Not on record', 'Not on record', 1, 48],
    ['p130w', '130 W 130th St', 'Central Harlem', '10027', '1-01914-0012', 'dubois', 16, 6, 10, 12100, 1905, '$2.6M', 'May 2027', 2, 63],
  ].map(([id, addr, hood, zip, bbl, owner, units, fm, rs, sf, built, debt, mat, signals, score]) => ({ id, addr, hood, zip, bbl, owner, units, fm, rs, sf, built, debt, mat, signals, score }));

  /* Thomas's territory: Main Body Manhattan, from 100th St to the southern tip. */
  const TERRITORY = { name: 'Main Body Manhattan', sub: '100th St to the southern tip', outside: ['Central Harlem'] };
  P.forEach(p => { p.terr = !TERRITORY.outside.includes(p.hood); });

  const cById = Object.fromEntries(C.map(c => [c.id, c]));
  const pById = Object.fromEntries(P.map(p => [p.id, p]));

  /* Buildings are scored (0–100) and classed; people are ranked by their most pressing building (pid).
     Team history can lift a rank, never a score: [places up, what the team did]. */
  P.forEach(p => { p.cls = p.score >= 80 ? 'A' : p.score >= 60 ? 'B' : p.score >= 40 ? 'C' : 'D'; });
  const LIFT = { marchetti: [2, 'team met him in 2019'], adler: [3, 'team did a BOV on 64 Essex St in 2011'] };
  const ranked = C.slice().sort((a, b) => pById[b.pid].score - pById[a.pid].score), base = new Map(ranked.map((c, i) => [c, i + 1]));
  Object.entries(LIFT).forEach(([id, [n]]) => { const i = ranked.indexOf(cById[id]); ranked.splice(i - n, 0, ...ranked.splice(i, 1)); });
  ranked.forEach((c, i) => { c.rank = i + 1; c.lift = LIFT[c.id] ? { from: base.get(c), why: LIFT[c.id][1] } : null; });

  /* The client's four classes (Orientation doc 1 §21). A long hold is a signal, not a class: Likely holders is a saved list. */
  const CLASS = { A: 'Act now', B: 'High probability', C: 'Monitor', D: 'Informational' };
  const TIER = { A: 'Tier 1 · Hot', B: 'Tier 2 · Warm', C: 'Tier 3 · Watch', D: 'Tier 4 · Inform' };
  const TRUST = {
    verified: { word: 'Verified', icon: 'seal-check', status: 'success' },
    single: { word: 'Single source', icon: 'warning-circle', status: 'warning' },
    stale: { word: 'Stale', icon: 'clock', status: '' },
    disputed: { word: 'Disputed', icon: 'warning-diamond', status: 'danger' },
  };

  /* Evidence per contact: [label, value, source, trust]. */
  const evidence = c => {
    const p = pById[c.pid];
    if (c.id === 'marchetti') return [
      ['Debt maturity', '$9,375,000 due Jun 9, 2026', 'ACRIS · Tier A · Aug 12', 'verified'],
      ['Lender', 'Brookline Capital', 'PropertyShark · Tier B · Sep 2', 'single'],
      ['Years held', '19 years, no sale since 2006', 'ACRIS · Tier A · Aug 12', 'verified'],
      ['Units', '37 (12 free market, 25 rent stabilized)', 'DOF · Tier A · Jul 30', 'verified'],
      ['Open HPD violations', '6 open, 2 hazardous', 'HPD · Tier A · checked 41d ago', 'stale'],
      ['Mailing address', 'Scarsdale, NY', 'Apollo and NY DOS disagree', 'disputed'],
    ];
    const src = c.trust === 'verified' ? 'ACRIS · Tier A · Aug 12' : c.trust === 'single' ? 'PropertyShark · Tier B · Sep 2' : 'UniCourt · Tier A · checked 64d ago';
    return [[c.signal, c.why, src, c.trust], ['Years held', c.years + ' years', 'ACRIS · Tier A · Aug 12', 'verified'], ['Units', p.units + ' (' + p.fm + ' free market, ' + p.rs + ' rent stabilized)', 'DOF · Tier A · Jul 30', 'verified']];
  };

  const drivers = c => c.id === 'marchetti'
    ? [['Loan matures June 9, 2026', '+42'], ['Held 19 years, no refinance since 2016', '+24'], ['Debt is 68% of estimated value', '+18']]
    : [[c.why, '+36'], ['Held ' + c.years + ' years', '+18'], [c.meta.split(' · ')[1], '+9']];
  const antis = c => c.id === 'marchetti' ? ['Refinanced once, in 2016', 'Owns two other buildings, so less pressure to sell'] : ['None on record'];

  const baseTimeline = c => c.id === 'marchetti'
    ? [['Email', 'Opened the Q3 market report again', 'Sep 28'], ['Call', 'No answer', 'Aug 21'], ['Email', 'Opened the Q3 market report', 'Aug 3'], ['Call', 'Voicemail', 'Jul 14'], ['Text', 'Replied: “Talk to me after the summer. I’ll know where the refi lands.”', 'Jul 2'], ['Broadcast', 'Q2 LES market report · opened', 'Jun 18'], ['Note', 'Met at the REBNY breakfast; open to talking next year', 'Jun 2', 'n3'], ['Note', 'The 2016 Brookline refi resets in 2026. He’s already worried about the rate.', 'Nov 4, 2021', 'n2'], ['Note', 'Would only sell into a 1031 upstate; his wife wants out of managing tenants.', 'Mar 12, 2019', 'n1']]
    : (c.last === 'Never called' ? [] : [['Call', c.last.split(' · ')[1] || 'Call', c.last.split(' · ')[0]]]);

  /* Numbers on a do-not-call list (fictional). They show a warning, never a block. */
  const dncList = ['(212) 555-0175'];
  const contactPoints = c => {
    const first = c.name.split(' ')[0].toLowerCase(), last = c.name.split(' ')[1].toLowerCase();
    return c.id === 'marchetti'
      ? [['phone', c.phone, 'Primary', 'ACRIS, Apollo'], ['phone', '(917) 555-0123', 'Verified', 'Apollo'], ['phone', '(212) 555-0199', 'Bad', 'PropertyShark'], ['envelope-simple', 'd.marchetti@example.com', 'Verified', 'Apollo']]
      : [['phone', c.phone, 'Primary', 'Apollo'], ['envelope-simple', first + '.' + last + '@example.com', 'Verified', 'Apollo']];
  };

  /* Today's call list, in order. Daniel Marchetti is first. */
  const callIds = ['marchetti', 'feld', 'okafor', 'adler', 'rivera', 'kowalski'];

  /* Home metric tiles: [name, icon, label, number] and the detail panel for each. */
  const D7 = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Today'], W7 = ['Aug 18', 'Aug 25', 'Sep 1', 'Sep 8', 'Sep 15', 'Sep 22', 'This wk'];
  const tiles = [
    { name: 'Activity', icon: 'pulse', label: 'Calls today', num: '6 / 40', title: 'Calls per day, last 7 days', sub: 'Activity · goal 40 a day', head: '112', headL: 'calls this week', go: 'Go to Performance', to: 'outreach-performance', goal: 40, labels: D7, vals: [28, 31, 0, 0, 14, 33, 6], max: 40, zero: 'No calls' },
    { name: 'Database', icon: 'database', label: 'New Class A', num: '4', title: 'New signals per week', sub: 'Database · last 7 weeks', head: '26', headL: 'new signals this week', go: 'Go to Database', to: 'contacts', labels: W7, vals: [14, 18, 11, 22, 19, 24, 26] },
    { name: 'Outreach', icon: 'list-bullets', label: 'Queues ready', num: '3', title: 'Contacts queued per week', sub: 'Outreach · last 7 weeks', head: '1,480', headL: 'in 3 ready queues', go: 'Go to Outreach', labels: W7, vals: [900, 1100, 950, 1300, 1200, 1420, 1480], fmt: 'loc' },
    { name: 'Phone', icon: 'phone', label: 'Conversations', num: '2', title: 'Conversations per day', sub: 'Phone · last 7 days', head: '9', headL: 'conversations this week', go: 'Go to Phone', labels: D7, vals: [3, 2, 0, 0, 1, 1, 2] },
    { name: 'Email', icon: 'envelope-simple', label: 'Replies', num: '5', title: 'Replies per day', sub: 'Email · last 7 days', head: '17', headL: 'replies this week', go: 'Go to Email', labels: D7, vals: [3, 4, 0, 1, 2, 2, 5] },
    { name: 'Texting', icon: 'chat-text', label: 'Unread', num: '3', title: 'Texts sent per day', sub: 'Texting · last 7 days', head: '64', headL: 'texts sent this week', go: 'Go to Texting', labels: D7, vals: [12, 15, 0, 0, 9, 22, 6] },
    { name: 'Marketing', icon: 'megaphone', label: 'Last open rate', num: '44%', title: 'Last campaign funnel', sub: 'Marketing · Q3 market report', head: '44%', headL: 'open rate', go: 'Go to Marketing', labels: ['Sent', 'Delivered', 'Opened', 'Clicked'], vals: [12400, 11980, 5270, 712], fmt: 'loc' },
    { name: 'LinkedIn', icon: 'linkedin-logo', label: 'New connections', num: '12', title: 'New connections per week', sub: 'LinkedIn · last 7 weeks', head: '12', headL: 'new this week', go: 'Go to LinkedIn', labels: W7, vals: [6, 9, 4, 11, 8, 10, 12] },
    { name: 'Social', icon: 'users', label: 'Engagement', num: '230', title: 'Engagement per week', sub: 'Social · last 7 weeks', head: '230', headL: 'engagements this week', go: 'Go to Social', labels: W7, vals: [140, 165, 120, 190, 210, 175, 230] },
    { name: 'Map', icon: 'map-trifold', label: 'ZIP coverage', num: '8%', title: 'Owners called by ZIP', sub: 'Map · share called at least once', head: '8%', headL: 'territory coverage', go: 'Go to Map', labels: ['10002', '10003', '10009', '10012', '10013', '10028', '10038'], vals: [14, 9, 6, 11, 4, 9, 3], fmt: 'pct', flat: true },
    { name: 'Web analytics', icon: 'globe', label: 'Visitors this week', num: '1,284', title: 'Visitors per week', sub: 'Website · last 7 weeks', head: '1,284', headL: 'visitors this week', go: 'Go to Website', to: 'web-analytics', labels: W7, vals: [880, 940, 1020, 990, 1110, 1190, 1284], fmt: 'loc' },
  ];

  const meetings = [['9:30 AM', 'Tour · 41 Ludlow St', 'Priya Venkataraman'], ['12:00 PM', 'Lunch · Grace Okafor', 'Okafor family office'], ['3:00 PM', 'Pipeline review', 'Zoom · Mira W.'], ['5:30 PM', 'Lender update', 'Brookline Capital']];

  const tasks = [
    { id: 1, g: 'Follow up', t: 'Send Ruth Adler the Q3 comps', m: 'Promised on Monday’s call' },
    { id: 2, g: 'Follow up', t: 'Confirm Thursday tour on Franklin St', m: 'With the Okafor family', done: true },
    { id: 3, g: 'Research', t: 'Check probate status for 27 Orchard St', m: 'NYSCEF' },
    { id: 4, g: 'Marketing', t: 'Approve the LES digest draft', m: 'Goes out Thursday' },
    { id: 5, g: 'Admin', t: 'Prep Q4 pipeline review', m: 'Weekly on Wednesday', rep: true },
  ];
  const cats = ['Follow up', 'Research', 'Marketing', 'Admin'];
  const goals = {
    Daily: [['40 calls', 40, 'calls'], ['5 conversations', 5, 'convos'], ['Update 10 contact points', 10, 4], ['Send the LES digest', 0, 0]],
    Weekly: [['150 dials', 150, 'dials'], ['3 first meetings', 3, 'meetings'], ['Post one market note on LinkedIn', 0, 0]],
    Monthly: [['2 proposals delivered', 2, 1], ['1 new listing', 1, 0], ['Refresh the Q4 owner list', 0, 0]],
  };
  const weekFocus = [['Calls · Sourcing', '14 dials done'], ['Mail merge · Listings', '1 blast sent'], ['Calls · LES maturities', 'calls'], ['LinkedIn · Market info', 'Planned'], ['Constant Contact · Listings', 'Planned']];
  const weekAlt = [['Calls · Class A', 'Calls'], ['Mail merge · Market report', 'Blast'], ['Calls · Probate leads', 'Calls'], ['LinkedIn · Listings', 'Posts'], ['Constant Contact · Digest', 'Email']];

  /* Calendars: key → [label]. Events: [weekday 0–4, start hour, hours, calendar, title, with, contact]. */
  /* Meetings, scheduled calls, BOV pitches and tours only (Thomas, P1 08:33). Posts, blasts and mail merges are planned in Today's week strip. */
  const calendars = { mtg: 'Meetings', call: 'Call blocks', tour: 'Tours', bov: 'BOV pitches' };
  const events = [[0, 9, 2, 'call', 'Calls · Sourcing', 'Class A list'], [0, 14, 1, 'mtg', 'Lender coffee', 'Brookline Capital'], [1, 10, 1, 'call', 'Callbacks', 'Ruth Adler and 2 more'], [1, 15, 0.5, 'mtg', 'Adler callback', 'Ruth Adler', 'adler'],
    [2, 9.5, 1, 'tour', 'Tour · 41 Ludlow St', 'Priya Venkataraman'], [2, 12, 1, 'mtg', 'Lunch · Grace Okafor', 'Okafor family office', 'okafor'], [2, 13.5, 1.5, 'call', 'Calls · LES maturities', 'Daniel Marchetti first', 'marchetti'], [2, 15.5, 0.5, 'mtg', 'Pipeline review', 'Zoom · Mira W.'], [2, 17, 0.5, 'mtg', 'Lender update', 'Brookline Capital'],
    [3, 11, 1, 'bov', 'BOV pitch · 64 Essex St', 'Ruth Adler', 'adler'], [3, 14, 1, 'tour', 'Tour · 90 Clinton St', 'Grace Okafor', 'okafor'], [4, 10, 1, 'mtg', 'Team meeting', 'Stewart Group'], [4, 13, 1, 'call', 'Calls · Upper East Side', 'Erik Lindqvist first', 'lindqvist']];

  /* Conversations board for this week: [weekday or 'prop', contact, topic, outcome, next step]. */
  const conversations = {
    0: [['0', 'adler', 'Open to a pricing opinion on 64 Essex St', 'Interested', 'Send comps Fri'], ['1', 'rivera', 'Asked who is buying air rights in the East Village', 'Interested', 'Intro a developer'], ['2', 'okafor', 'Lunch recap: family wants a number before the loan is due', 'Callback', 'Call Oct 6'], ['prop', 'okafor', 'BOV for 90 Clinton St', 'Sent', 'Follow up Oct 8'], ['prop', 'adler', 'Pricing opinion · 64 Essex St', 'Draft', 'Due Fri']],
    prev: [['1', 'greene', 'Would revisit 19 Rivington in spring', 'Not now', 'Nurture'], ['3', 'shah', 'Check-in, no plans to sell', 'Not now', 'Q1 check-in'], ['prop', 'okafor', 'BOV for 90 Clinton St', 'Draft', 'Sent Sep 30']],
    next: [['prop', 'okafor', 'BOV for 90 Clinton St', 'Sent', 'Follow up Oct 8']],
  };

  const chats = [
    { id: 'p1', g: 'Pinned', pin: true, t: 'LES owners with debt due before year end', m: [{ role: 'user', text: '/list LES owners with debt due before year end' }, { role: 'bot', text: '12 owners match: Lower East Side and East Village, debt due by Dec 31, 2026, Class A and B. Marchetti, Okafor and Kowalski are the top three.', acts: [['Open in builder', 'contacts', 'crit=hood:Lower East Side,East Village;debt:2026-12-31;cls:A,B&from=brain', false]] }] },
    { id: 'today', g: 'Today', t: 'Marchetti’s loan is due in June', m: null },
    { id: 'c1', g: 'Today', t: 'Who should I call first today?', m: [{ role: 'user', text: 'Who should I call first today?' }, { role: 'bot', text: 'Start with Daniel Marchetti. His $9.4M loan matures June 9, and he hasn’t had a call in 41 days. Then Aaron Feld and Grace Okafor.', trust: 'Verified · ACRIS, Aug 12', acts: [['Open record', 'contact', 'id=marchetti', true]] }] },
    { id: 'c2', g: 'Previous 7 days', t: 'Summarize the LES maturity list', m: [{ role: 'user', text: 'Summarize the LES maturity list' }, { role: 'bot', text: '12 Lower East Side owners have debt due before the end of 2026: $61.2M across 214 units. Five are Class A, and three of those haven’t been called this quarter.' }] },
    { id: 'c3', g: 'Previous 7 days', t: 'Draft a note to a family owner', m: [{ role: 'user', text: 'Draft a short note to Ruth Adler about 64 Essex St' }, { role: 'bot', text: '“Hi Ruth, I’ve followed 64 Essex St for a while. If you’re weighing what to do with the building, I’m happy to share what similar buildings traded for this year. Thomas”' }] },
    { id: 'c4', g: 'Older', t: 'Estate owners on the UES', m: [{ role: 'user', text: 'Which UES owners hold through an estate?' }, { role: 'bot', text: 'Nine Upper East Side owners hold buildings through an estate or heirs. Public records suggest three have open probate filings.' }] },
    { id: 'c5', g: 'Older', t: 'Q3 rent-stabilized comps', m: [{ role: 'user', text: 'Rent-stabilized comps from Q3, LES and East Village' }, { role: 'bot', text: 'Seven rent-stabilized walk-ups traded in Q3, from $310 to $425 per square foot. The median was $362, down 4% from Q2.' }] },
  ];
  const proactive = { role: 'bot', time: '8:02 AM', text: 'Marchetti’s loan is due in June. He’s first on today’s list. Open his record?', acts: [['Open record', 'contact', 'id=marchetti', false], ['Not now', null, '', false]], proactive: true };
  const docs = [['Rent roll, 118 Ludlow St.pdf', '2.1 MB · added Sep 12'], ['LES maturities Q4.xlsx', '480 KB · added Sep 20'], ['Stewart Group pitch.pdf', '6.4 MB · added Aug 30']];

  /* Sidebar: [label, icon, page or null (disabled), badge]. Strings are group labels. */
  // Today is where the day starts (3.0 · 2.1, Orientation doc 1 §10); the Dashboard is the command centre and opens on Overview.
  const nav = [['Today', 'sun', 'attack-plan'], ['Approvals', 'tray', 'approvals'], ['Dashboard', 'squares-four', 'home'], ['Brain', 'sparkle', 'brain'],
    'Prospecting', ['Database', 'database', 'contacts'], ['Map', 'map-trifold'], ['Outreach', 'list-bullets'],
    'Channels', ['Phone', 'phone'], ['Email', 'envelope-simple', null, '4'], ['Texting', 'chat-text', null, '2'], ['LinkedIn', 'linkedin-logo'], ['Social', 'users'],
    'Marketing', ['Marketing', 'megaphone'], ['Website', 'globe']];
  const more = [['Field Mode', 'device-mobile'], ['Headlines', 'newspaper', 'headlines'], ['Market Data', 'chart-line'], ['Ledger', 'book'], ['Prediction Model', 'brain'], ['BOV & OM', 'file-text', 'bov'], ['Integrations', 'puzzle-piece']];
  const links = [{ h: 'Research', items: ['PincusCo', 'UniCourt', 'LoopNet', 'Zillow', 'StreetEasy', 'Hunter', 'PropertyShark', 'Apollo', 'CoStar', 'NYC ACRIS', 'NYC Open Data'] }, { h: 'Media', items: ['The Real Deal', 'Bisnow', 'Commercial Observer', 'WSJ Real Estate', 'Crain’s New York', 'YIMBY NY', 'GlobeSt'] }];

  /* Page tabs. A null page is drawn but disabled. */
  // Thomas's current tab names and order (his portal as shown in the Oct 22 video), in sentence case. Today is the Attack Plan,
  // Activity the conversation tracker, Who to call the coverage and engagement report (every row turns into a call list).
  const dashboardTabs = [['home', 'Overview'], ['conversations', 'Activity'], ['reporting', 'Who to call'], ['calendar', 'Calendar'], '|', ['outreach-performance', 'Performance'], ['listings', 'Listings'], ['web-analytics', 'Website']];
  const databaseTabs = [['contacts', 'Contacts'], ['properties', 'Properties']];

  /* Database scale: about 40,000 contacts and 18,600 properties (Thomas, P3 25:14). The table shows the fictional demo rows. */
  const DB = { contacts: 40212, inTerritory: 36480, properties: 18640, propsInTerritory: 16910 };
  const lists = [['all', 'All contacts', 40212], ['A', 'Class A sellers', 1140], ['B', 'Class B sellers', 3860], ['C', 'Class C sellers', 9420], ['D', 'Class D sellers', 25792], ['LH', 'Likely holders', 5200], ['warm', 'Warm contacts', 3310], ['cold', 'Cold contacts', 36902]];
  const listsOff = [['Professional grade', 1260], ['Portfolio sellers', 2140], ['Active buyers', 3480]];
  const hoods = [['Lower East Side', 4820], ['East Village', 3960], ['Upper East Side', 7140], ['Midtown West', 5310], ['Chelsea', 3220]];
  const customLists = ['Class A sellers', 'LES debt 2026', 'Estate watch', 'Q4 mail merge', 'Air rights', 'Callbacks this week'];


  /* ───────── Lists and the criteria builder ─────────
     Engagement per contact: what each owner received, opened, clicked, viewed or downloaded. Labels match the
     Who to call, Listings and Website rows, so "Turn into a list" on a row is the same chip in the builder. */
  const Q3 = ['Received Q3 market report', 'Delivered Q3 market report'];
  const engagement = {
    marchetti: [...Q3, 'Opened Q3 market report', 'Clicked Q3 market report email', 'Clicked Q3 report PDF', 'Downloaded Q3 market report'],
    feld: [...Q3, 'Opened Q3 market report', 'Clicked Q3 market report email', 'Clicked 41 Ludlow St OM', 'Viewed 41 Ludlow St'],
    okafor: [...Q3, 'Opened Q3 market report', 'Clicked Q3 market report email', 'Clicked 41 Ludlow St OM', 'Viewed 41 Ludlow St', 'Viewed 15 Clinton St', 'Downloaded 41 Ludlow St OM', 'Visited the website'],
    adler: [...Q3, 'Opened Q3 market report', 'Clicked Q3 market report email', 'Clicked 41 Ludlow St OM', 'Clicked Book a call', 'Viewed 41 Ludlow St', 'Viewed 15 Clinton St', 'Downloaded 41 Ludlow St OM', 'Visited the website'],
    rivera: [...Q3, 'Opened Q3 market report', 'Clicked Q3 market report email', 'Clicked 88 Orchard St OM', 'Viewed 88 Orchard St', 'Viewed 230 E 7th St', 'Downloaded 88 Orchard St OM', 'Visited the website'],
    kowalski: [...Q3, 'Clicked Q3 market report email', 'Clicked 88 Orchard St OM', 'Viewed 88 Orchard St', 'Viewed 230 E 7th St'],
    chen: [...Q3, 'Viewed 41 Ludlow St'],
    shah: [...Q3, 'Opened Q3 market report', 'Clicked Q3 market report email', 'Clicked 41 Ludlow St OM', 'Clicked Listings page', 'Viewed 41 Ludlow St', 'Visited the website'],
    greene: [...Q3, 'Opened Q3 market report', 'Clicked Q3 market report email', 'Clicked 41 Ludlow St OM', 'Clicked Q3 report PDF', 'Clicked Listings page', 'Viewed 41 Ludlow St', 'Downloaded Q3 market report', 'Visited the website'],
    morales: [...Q3, 'Viewed 41 Ludlow St'],
    baum: ['Viewed 41 Ludlow St'],
    lindqvist: [...Q3, 'Opened Q3 market report', 'Clicked Q3 market report email', 'Clicked 41 Ludlow St OM', 'Viewed 41 Ludlow St', 'Downloaded 41 Ludlow St OM'],
    osei: [...Q3, 'Viewed 41 Ludlow St'],
    brennan: [...Q3, 'Opened Q3 market report', 'Clicked Q3 market report email', 'Clicked 41 Ludlow St OM', 'Viewed 41 Ludlow St', 'Viewed 230 E 7th St'],
    dubois: [...Q3],
  };
  // LinkedIn connections and this week's touches, for the Social connection and Last touch criteria.
  const linkedin = ['marchetti', 'okafor', 'adler', 'rivera', 'greene', 'lindqvist', 'brennan'];
  const touched = { 'Called this week': ['marchetti', 'okafor', 'adler', 'rivera', 'shah'], 'Emailed this week': ['adler', 'okafor', 'lindqvist', 'marchetti'], 'Texted this week': ['marchetti', 'adler'], 'Conversation this week': ['adler', 'rivera', 'okafor'] };

  /* Team history: what the team did on each building, from the imported archive (OneDrive and Salesforce).
     [property, year, event, team member, document]. Kept separate from the predictive score. */
  const teamHistory = [
    ['p118', 2004, 'Proposal', 'John Stewart', 'Proposal · 118 Ludlow St · 2004.pdf'],
    ['p118', 2005, 'Listing', 'John Stewart', 'Exclusive listing agreement · 118 Ludlow St.pdf'],
    ['p118', 2006, 'Sale', 'John Stewart', 'Closing statement · sold to Ludlow 118 Holdings LLC.pdf'],
    ['p118', 2012, 'BOV', 'John Stewart', 'BOV · 118 Ludlow St · 2012.xlsx'],
    ['p118', 2019, 'First meeting', 'Thomas Windels', 'Meeting notes · Marchetti · Mar 2019.docx'],
    ['p22h', 2017, 'Proposal', 'Sarah Klein', 'Proposal · 22 Hester St · 2017.pdf'],
    ['p90c', 2015, 'First meeting', 'John Stewart', 'Meeting notes · Okafor family · 2015.docx'],
    ['p90c', 2018, 'Proposal', 'John Stewart', 'Proposal · 90 Clinton St · 2018.pdf'],
    ['p90c', 2026, 'BOV', 'Thomas Windels', 'BOV · 90 Clinton St · Sep 2026.xlsx'],
    ['p64e', 2011, 'BOV', 'John Stewart', 'BOV · 64 Essex St · 2011.xlsx'],
    ['p64e', 2020, 'Proposal', 'Sarah Klein', 'Proposal · 64 Essex St · 2020.pdf'],
    ['p27o', 2013, 'Proposal', 'David Ortiz', 'Proposal to the Feld estate · 27 Orchard St.pdf'],
    ['p212e', 2020, 'Proposal', 'Thomas Windels', 'Air-rights proposal · 212 E 3rd St.pdf'],
    ['p19r', 2016, 'First meeting', 'Thomas Windels', 'Meeting notes · Greene · 2016.docx'],
    ['p311e', 2009, 'Listing', 'John Stewart', 'Exclusive listing agreement · 311 E 82nd St.pdf'],
    ['p311e', 2009, 'Sale', 'John Stewart', 'Closing statement · sold to East 82nd Street Associates.pdf'],
    ['p311e', 2018, 'Proposal', 'Sarah Klein', 'Proposal · 311 E 82nd St · 2018.pdf'],
    ['p236w', 2012, 'Proposal', 'David Ortiz', 'Proposal · 236 W 22nd St · 2012.pdf'],
    ['p236w', 2013, 'Listing', 'David Ortiz', 'Exclusive listing agreement · 236 W 22nd St.pdf'],
    ['p236w', 2014, 'Sale', 'David Ortiz', 'Closing statement · sold to Chelsea 22 Realty LLC.pdf'],
  ].map(([pid, year, type, who, doc]) => ({ pid, year, type, who, doc }));
  const teamOf = pid => teamHistory.filter(e => e.pid === pid).sort((a, b) => b.year - a.year);

  /* The relationship, distilled: touches since, the notes that matter (Brain-picked, ids of timeline entries),
     the last reply, a suggested angle, the next touch and connected people (co-owners across buildings). */
  const relationship = {
    marchetti: { since: 2014, touches: 31, warmth: 64, notesOf: 14, notes: ['n1', 'n2', 'n3'], said: ['Talk to me after the summer. I’ll know where the refi lands.', 'Text reply · Jul 2'], next: ['Opened the Q3 report 2 days ago', 'Suggest a text, then LinkedIn'], connected: [['Lucia Marchetti', 'Co-owner · 118 Ludlow St and 22 Hester St', null], ['Paul Reyes', 'Partner · 22 Hester St', null], ['Peter Kowalski', 'Fellow member · Avenue B Owners LLC', 'kowalski']] },
    okafor: { since: 2015, touches: 22, warmth: 78, notesOf: 9, said: ['The family wants a number before the loan is due.', 'Lunch recap · Sep 30'], next: ['Lunch today at 12 PM', 'Suggest an email with the BOV after lunch'], connected: [['Daniel Okafor', 'Co-owner · Clinton Street Partners LP', null]] },
    adler: { since: 2011, touches: 27, warmth: 71, notesOf: 11, said: ['Open to a pricing opinion on 64 Essex St.', 'Call · Sep 28'], next: ['Viewed 41 Ludlow St 4 times this week', 'Suggest a call, then the comps by email'], connected: [['Samuel Adler', 'Co-trustee · Adler Family Trust', null]] },
    feld: { since: 2013, touches: 4, warmth: 22, notesOf: 1, said: null, next: ['Clicked the 41 Ludlow St OM', 'Suggest a letter, then a call'], connected: [] },
    lindqvist: { since: 2009, touches: 12, warmth: 55, notesOf: 5, said: ['Send me what 82nd St buildings traded for.', 'Email reply · Sep 11'], next: ['Downloaded the 41 Ludlow St OM', 'Suggest a call, then LinkedIn'], connected: [] },
  };

  /* The opener (3.0 · 2.2, Orientation doc 2 §5): what Thomas says first, in his voice. Never a price for the owner's own building. */
  const openers = {
    marchetti: ['Daniel, it’s Thomas Windels at Stewart Group. You told me to call after the summer, once the refi picture was clearer.', 'With the June maturity on 118 Ludlow, I’ve put the refinance math next to what a sale would net, so you can compare the two.', 'No pitch. If it helps, I can walk you through it in fifteen minutes this week.'],
    okafor: ['Grace, it’s Thomas. Looking forward to lunch today.', 'I’ll bring the 90 Clinton St BOV so the family can see a recap and a sale side by side before August.', 'Whatever you decide, you’ll have the numbers in hand.'],
    adler: ['Ruth, it’s Thomas Windels. I have the Q3 comps you asked for on 64 Essex.', 'I’ll email them today. They show what’s trading around you, not a number for your building.', 'Could we keep Thursday at 11 for the pricing opinion?'],
    feld: ['Mr. Feld, it’s Thomas Windels at Stewart Group. I’m sorry for your loss.', 'Our team knew your father; we worked with him on 27 Orchard in 2013.', 'If a valuation would help the estate, I’m glad to put one together, with no obligation.'],
    lindqvist: ['Erik, it’s Thomas Windels. John Stewart sold you 311 East 82nd back in 2009.', 'With the March maturity coming, I can show you what similar buildings on 82nd have traded for.', 'Would a short call this week be useful?'],
  };

  /* What changed (3.0 · 2.5, Orientation doc 1 §9): [id, area, date, what changed, how it was before, who approved it]. */
  const changes = [
    ['ranking', 'Ranking', 'Oct 25', 'Paid-off loans weigh more, so owners with no debt rank lower.', 'A paid-off loan counted the same as any long hold.', 'Model v4.1 · approved by Thomas W.'],
    ['lesson', 'Brain lesson', 'Oct 24', 'Family owners who say “not selling” are read as “not yet”, unless they just refinanced.', 'Brain took “not selling” at face value.', 'Lesson approved by Thomas W.'],
    ['dnc-check', 'Approvals', 'Oct 23', 'A text to a number on a do-not-call list shows a check before you send.', 'It went into the queue with no check.', 'Thomas W.'],
    ['callbacks', 'Today', 'Oct 22', 'Callbacks come first in Call next.', 'Callbacks were mixed into the ranked list.', 'Thomas W.'],
  ].map(([id, area, date, what, before, by]) => ({ id, area, date, what, before, by }));

  /* The first touch per owner (3.0 · 2.4, Orientation doc 1 §6, doc 2 §3): [channel icon, plan, because, sequence step, why it stopped, approval id]. */
  const touches = {
    marchetti: ['phone', 'Call now', 'he asked to talk after the summer, and opened the Q3 report 2 days ago', null, null, 'a4'],
    feld: ['file-text', 'Letter first · call in 7 days', 'an heir after a recent loss: a letter before any call', null, null, 'a6'],
    okafor: ['calendar-blank', 'Lunch today · BOV by email after', 'the family wants a number before August', null, null, 'a8'],
    adler: ['phone', 'Call now · comps by email after', 'she asked for the Q3 comps on Monday’s call', null, null, 'a1'],
    rivera: ['phone', 'Email sent Mon · call today', 'cold, with a phone and a verified email', 'Step 2 of 2', null, null],
    kowalski: ['chat-text', 'Text first · call Thu', 'never called, and his mobile is on a do-not-call list', null, null, 'a5'],
    lindqvist: ['envelope-simple', 'Email, then call', 'warm from the sale in 2009', 'Step 1 of 2', 'Stopped: he replied Sep 11', null],
  };

  /* Buyers who fit (fictional): [name, buy box, timing, neighborhoods]. The call card shows three, then the rest on request. */
  const buyers = [
    ['Hudson Row Capital', 'LES and East Village walk-ups, 20–40 units', '1031 deadline Mar 14', ['Lower East Side', 'East Village', 'Chinatown']],
    ['Kessler Family Office', 'Rent-stabilized buildings below 14th St', 'Cash, closes in 45 days', ['Lower East Side', 'East Village', 'Chinatown']],
    ['Grand & Orchard Partners', 'Mixed free-market walk-ups', 'Bought 2 on Orchard St this year', ['Lower East Side', 'Chinatown']],
    ['Bowery Lane Investors', 'Walk-ups with unused air rights', '1031 deadline Jan 30', ['East Village', 'Lower East Side']],
    ['Rye Street Residential', '20–50 unit multifamily in Manhattan', 'Fund II, buying through 2027', ['Lower East Side', 'East Village', 'Chinatown', 'Upper East Side', 'Midtown West', 'Chelsea', 'Central Harlem']],
    ['Yorkville Holdings', 'UES walk-ups, 15–35 units', 'Bought on E 81st St in June', ['Upper East Side']],
    ['Carnegie Hill Realty', 'Pre-war walk-ups above 72nd St', 'Cash, closes in 60 days', ['Upper East Side']],
    ['Park & Lex Family Office', 'Low-leverage multifamily, long hold', 'Looking since spring', ['Upper East Side', 'Midtown West']],
    ['Clinton West Partners', 'Midtown West and Chelsea walk-ups', '1031 deadline Feb 20', ['Midtown West', 'Chelsea']],
    ['Eighth Avenue Capital', 'Mixed-use with retail on the ground floor', 'Cash, closes in 60 days', ['Chelsea', 'Midtown West']],
    ['Tenth Street Capital', 'Value-add walk-ups, any size', 'Bought 3 buildings this year', ['East Village', 'Chelsea', 'Midtown West', 'Upper East Side', 'Central Harlem']],
  ].map(([name, box, when, hoods]) => ({ name, box, when, hoods }));
  const buyersFor = p => buyers.filter(b => b.hoods.includes(p.hood)).slice(0, 5);

  /* Approvals (3.0 · 2.3, Orientation doc 1 §10, doc 4 §5 and §8): every planned touch waits for Thomas's click, with its reason.
     [id, lane, contact or null, building or null, title, reason, body lines, check: null | ['warn' | 'block', text], extra]. */
  const LANES = [['email', 'Email', 'envelope-simple'], ['text', 'Text', 'chat-text'], ['letter', 'Letter', 'file-text'], ['linkedin', 'LinkedIn', 'linkedin-logo'], ['valuation', 'Valuation', 'buildings'], ['data', 'Data push', 'list-bullets']];
  const approvals = [
    ['a0', 'email', null, null, 'Q4 market note · LES owners', 'Mail merge to the “LES debt 2026” list. Brain suggests a first wave, then the rest if replies look healthy.', ['Subject: What changed on the Lower East Side this quarter', 'Three buildings traded on your blocks this quarter, and two lenders tightened terms for walk-ups.', 'I put the numbers on one page. If it would help to talk them through for your building, reply and I’ll call.', 'Thomas Windels · Stewart Group'], null, { n: 312, wave: 40 }],
    ['a1', 'email', 'adler', 'p64e', 'Q3 comps for 64 Essex St', 'She asked for them on the Sep 28 call.', ['Subject: The Q3 comps you asked for', 'Ruth, as promised, here are the Q3 sales around 64 Essex. They show what’s trading near you, not a number for your building.', 'Thursday at 11 still works for me if you’d like to go through them.', 'Thomas'], null],
    ['a2', 'email', 'marchetti', 'p118', 'Refinance next to a sale, side by side', 'He opened the Q3 report two days ago and asked to talk after the summer.', ['Subject: 118 Ludlow, refinance or sell', 'Daniel, with the June maturity coming, I laid the refinance math next to what a sale would net.', 'No pitch. Fifteen minutes this week is enough to walk through it.', 'Thomas'], null],
    ['a3', 'email', 'baum', 'p120n', 'Q4 market note', 'In the Q4 mail merge list.', ['Subject: What changed on the Lower East Side this quarter', 'Harold, three buildings traded near 120 Norfolk this quarter…'], ['block', 'Harold Baum asked not to be contacted, on every channel. This can’t be sent.']],
    ['a4', 'text', 'marchetti', 'p118', 'Quick text before the email', 'Next touch: a text, then LinkedIn.', ['Daniel, it’s Thomas Windels. I’m sending you the refi-vs-sale numbers for 118 Ludlow by email today. Happy to talk whenever suits.'], null],
    ['a5', 'text', 'kowalski', 'p31b', 'First touch on 31 Avenue B', 'Never called; his loan is due in November.', ['Peter, it’s Thomas Windels at Stewart Group. I work with owners on Avenue B. Would a short call this week be useful?'], ['warn', '(212) 555-0175 is on a do-not-call list. A text is allowed; check before you send.']],
    ['a6', 'letter', 'feld', 'p27o', 'Condolence letter, 27 Orchard St', 'He inherited the building in March. A letter before any call.', ['Dear Mr. Feld,', 'I was sorry to hear of your father’s passing. Our team worked with him on 27 Orchard Street in 2013, and he was a pleasure to know.', 'If a valuation would ever help the estate, I’d be glad to prepare one, with no obligation.', 'With sympathy, Thomas Windels'], null],
    ['a7', 'linkedin', null, null, 'Post: LES maturities this winter', 'Tuesday’s slot, Oct 6 at 9:00 AM.', ['Twelve Lower East Side loans mature before year end. Owners who start early have the most options: refinance, recap or sell.', 'If that’s you, I’m glad to share what we’re seeing.'], null],
    ['a8', 'valuation', 'okafor', 'p90c', 'Updated BOV for 90 Clinton St', 'The family wants a number before the August maturity. Lunch is today at 12.', ['Updated rent roll (Sep 2026) and three new comps.', 'Recap and sale side by side. The number goes to the family, never into an opener.'], null],
    ['a9', 'data', null, null, 'Push “LES debt 2026” to Terrakotta', '142 owners with debt due by year end, from ACRIS. Opted-out owners are already removed.', ['Queue: LES debt 2026 · 142 owners', 'Channel: Phone (Terrakotta)', 'Order: by rank'], null],
  ].map(([id, lane, cid, pid, title, why, body, check, extra]) => ({ id, lane, cid, pid, title, why, body, check, ...(extra || {}) }));

  /* Database-wide counts behind each criterion, so a list's size reads at the scale of the real database.
     The live count combines them (see DS.crit in js/product.js); the table shows the matching demo rows. */
  const critCounts = {
    cls: { A: 1140, B: 3860, C: 9420, D: 25792 },
    signal: { 'Loan maturity': 4200, 'Estate transition': 1300, 'Long hold': 9800, 'Unused FAR': 2100, 'Lis pendens': 380, 'Nearby sale': 3100, 'Recent refinance': 5200 },
    trust: { verified: 22000, single: 11000, stale: 6000, disputed: 1200 },
    btype: { fm: 9800, rs: 6200, mixed: 24200 },
    hood: { 'Lower East Side': 4820, 'East Village': 3960, 'Upper East Side': 7140, 'Midtown West': 5310, Chelsea: 3220, 'Central Harlem': 3730 },
    debt: { '2026-12-31': 140, '2027-06-30': 420, '2027-12-31': 910 },
    team: { Proposal: 2400, BOV: 1100, 'First meeting': 3900, Listing: 640, Sale: 520 },
    eng: { 'Received Q3 market report': 12400, 'Delivered Q3 market report': 11980, 'Opened Q3 market report': 5270, 'Clicked Q3 market report email': 712, 'Clicked 41 Ludlow St OM': 268, 'Clicked Q3 report PDF': 196, 'Clicked Book a call': 104, 'Clicked Listings page': 86, 'Clicked 88 Orchard St OM': 58, 'Viewed 41 Ludlow St': 11, 'Viewed 88 Orchard St': 2, 'Viewed 230 E 7th St': 3, 'Viewed 15 Clinton St': 2, 'Downloaded 41 Ludlow St OM': 18, 'Downloaded 88 Orchard St OM': 10, 'Downloaded Q3 market report': 19, 'Visited the website': 9 },
    social: { yes: 5630, no: 34582 },
    rel: { warm: 3310, cold: 36902 },
    touch: { 'Called this week': 112, 'Emailed this week': 186, 'Texted this week': 64, 'Conversation this week': 9, 'Never called': 21000, 'No touch in 90 days': 9000 },
  };
  // Brain's /list answer and the lists it saves are criteria too.
  const brainList = 'hood:Lower East Side,East Village;debt:2026-12-31;cls:A,B';
  const listCrit = { all: '', A: 'cls:A', B: 'cls:B', C: 'cls:C', D: 'cls:D', LH: 'signal:Recent refinance', warm: 'rel:warm', cold: 'rel:cold' };


  /* ───────── Proactive Brain ─────────
     Suggested lists on Today: criteria plus a reason (the count in the reason is the live count). */
  const suggested = [
    { id: 'ludlow-om', name: 'Clicked the 41 Ludlow OM', tag: 'Class A', hint: 'Owners click a listing to price their own building.', crit: 'cls:A;eng:Clicked 41 Ludlow St OM', why: n => n + ' Class A owners clicked the 41 Ludlow St OM this month. Owners click a listing to price their own building.' },
    { id: 'q3-uncalled', name: 'Opened the Q3 report, never called', tag: 'LES · Class A', hint: 'Warm from the report, cold on the phone.', crit: 'cls:A;hood:Lower East Side;eng:Opened Q3 market report;touch:Never called', why: n => n + ' Class A owners on the Lower East Side opened the Q3 report and have never been called.' },
    { id: 'ues-debt', name: 'Debt due by June', tag: 'UES · Class A and B', hint: 'No UES call block this month.', crit: 'cls:A,B;hood:Upper East Side;debt:2027-06-30', why: n => n + ' Class A and B owners on the Upper East Side have debt due by June 30, 2027. Nobody has a call block on the UES this month.' },
  ];
  // What Brain has been taught (Learning Mode): corrections Thomas approved. Approving the Okafor correction adds one.
  const taught = [
    ['Estate owners in probate are not sellers until the court names an executor', 'Feld and 22 similar estate owners', 'Sep 18', 'Thomas W.'],
    ['“Long hold” alone is not a reason to call. Pair it with a debt or estate signal', 'All Class C and D owners', 'Sep 4', 'Thomas W.'],
  ];
  const okaforLesson = ['Grace Okafor is refinancing, not selling. Treat family owners refinancing a maturing loan as a check-in after the refi closes, not a pitch', 'Okafor and 14 similar family owners', 'Today', 'Thomas W.'];
  // The paperclip's simulated drop.
  const dropFile = ['Okafor refinance term sheet.pdf', '1.2 MB · added today'];

  /* Headlines (read-only, under More): stories tagged by who they matter to, each a list and a post. */
  // hours: how long ago it was published (today is Wed, Sep 30). Topics and sources follow Thomas's feed (The Real Deal, Commercial Observer, Bisnow, GlobeSt, YIMBY NY…).
  const headlines = [
    { id: 'rgb', src: 'The Real Deal', hours: 20, tag: 'Rent regulation', t: 'Rent Guidelines Board votes to freeze stabilized rents for 2026–27 leases', sum: 'One-year and two-year leases on rent-stabilized units stay flat from October 1. Owners with mostly stabilized buildings lose this year’s increase while costs keep rising.', crit: 'btype:rs,mixed;hood:Lower East Side', audience: 'rent-stabilized owners in the LES' },
    { id: 'q3', src: 'Commercial Observer', hours: 44, tag: 'Sales', t: 'Manhattan multifamily sales volume rose 18% in Q3 as rates eased', sum: 'Walk-up trades below 96th St led the quarter, with a median of $362 per square foot. Buyers are back for free-market buildings.', crit: 'cls:A,B;btype:fm', audience: 'Class A and B owners of free-market buildings' },
    { id: 'lenders', src: 'Crain’s New York', hours: 92, tag: 'Lending', t: 'Two regional banks pull back on walk-up refinancing below 96th St', sum: 'Brookline Capital and Hudson Mutual tightened terms for buildings with stabilized units. Owners with 2026–27 maturities face higher rates or a sale.', crit: 'debt:2027-06-30;btype:rs,mixed', audience: 'owners with debt due by June 2027' },
    { id: 'far', src: 'YIMBY NY', hours: 190, tag: 'Development', t: 'East Village air-rights sale sets a $410 per square foot record', sum: 'A developer paid $410/SF for unused rights over a walk-up on E 4th St, the highest on record for the neighborhood.', crit: 'signal:Unused FAR', audience: 'owners with unused air rights' },
    { id: 'ues-trade', src: 'PincusCo', hours: 6, tag: 'Sales', t: 'Family sells a 28-unit UES walk-up on E 81st St for $14.1M', sum: 'The seller held the building for 34 years. It traded at $498 per square foot, about 6% above the UES average this year.', crit: 'hood:Upper East Side;signal:Long hold', audience: 'long-hold owners on the Upper East Side' },
    { id: 'lis', src: 'The Real Deal', hours: 30, tag: 'Distress', t: 'Lis pendens filings on Manhattan walk-ups hit a two-year high', sum: 'Foreclosure filings rose 22% in Q3, concentrated on buildings bought between 2014 and 2018 at peak prices.', crit: 'signal:Lis pendens', audience: 'owners with a lis pendens on record' },
    { id: 'jlaw', src: 'Bisnow', hours: 52, tag: 'Policy', t: 'City Council advances Local Law 97 relief for older walk-ups', sum: 'A proposed amendment gives pre-1930 buildings under 25,000 SF two more years to meet emissions caps.', crit: 'units:-25;btype:rs,mixed', audience: 'owners of small pre-war buildings' },
    { id: 'rates', src: 'GlobeSt', hours: 70, tag: 'Lending', t: 'Ten-year Treasury slips below 4%, multifamily lenders reprice', sum: 'Agency spreads tightened on smaller loans. Brokers report the first uptick in refinancing quotes since spring.', crit: 'debt:2027-12-31', audience: 'owners with debt due by the end of 2027' },
    { id: 'chelsea', src: 'Commercial Observer', hours: 120, tag: 'Sales', t: 'Chelsea walk-up portfolio of six buildings trades for $52M', sum: 'A private investor bought the free-market portfolio from a family office. The deal works out to $612 per square foot.', crit: 'hood:Chelsea,Midtown West;btype:fm', audience: 'free-market owners in Chelsea and Midtown West' },
    { id: 'estate', src: 'Crain’s New York', hours: 160, tag: 'Market data', t: 'Estate sales are a third of Manhattan walk-up trades this year', sum: 'Heirs are selling faster than in past cycles, often within two years of inheriting, as carrying costs rise.', crit: 'signal:Estate transition', audience: 'owners in an estate transition' },
    { id: 'les-dev', src: 'YIMBY NY', hours: 230, tag: 'Development', t: 'Permits filed for a 14-story building on Delancey St', sum: 'The project would replace two walk-ups and a parking lot. Neighbors on the block may see offers for their air rights.', crit: 'hood:Lower East Side;signal:Unused FAR,Nearby sale', audience: 'LES owners near new development' },
    { id: 'q2', src: 'The Real Deal', hours: 900, tag: 'Market data', t: 'Q2 review: rent-stabilized values down 4% on the year', sum: 'Stabilized walk-ups traded at a median of $362 per square foot, while free-market buildings held steady.', crit: 'btype:rs', audience: 'owners of mostly stabilized buildings' },
    { id: 'harlem', src: 'Bisnow', hours: 1300, tag: 'Sales', t: 'Harlem brownstone buildings see bidding wars again', sum: 'Several small multifamily buildings above 110th St sold over ask in the summer, a first since 2022.', crit: 'hood:Central Harlem', audience: 'owners in Central Harlem' },
    { id: 'insurance', src: 'GlobeSt', hours: 2600, tag: 'Policy', t: 'Insurance premiums for older walk-ups up 31% in a year', sum: 'Carriers cite water damage and aging systems. Owners of pre-war buildings are shopping policies earlier.', crit: 'btype:rs,mixed;units:-25', audience: 'owners of small older buildings' },
  ];
  // The scripted post for the rent-freeze headline (Brain's "headline to post" flow).
  const postDraft = 'The Rent Guidelines Board just froze stabilized rents for 2026–27. If you own a mostly stabilized walk-up on the Lower East Side, this is the second flat year in three, while taxes and insurance keep rising. We’ve run the numbers on what that does to values on the block. Happy to share them, no pitch.';

  /* BOV & OM (next phase, drawn): comps with trust, and a price range, for 118 Ludlow St. [address, date, units, $/SF, $/unit, cap, trust] */
  const comps = [
    ['104 Ludlow St', 'Jul 2026', 28, 362, 271000, '5.4%', 'verified'],
    ['77 Essex St', 'May 2026', 34, 348, 239000, '5.7%', 'verified'],
    ['159 Rivington St', 'Apr 2026', 22, 391, 318000, '5.1%', 'single'],
    ['31 Orchard St', 'Feb 2026', 40, 333, 226000, '5.9%', 'verified'],
    ['12 Clinton St', 'Nov 2025', 25, 404, 334000, '4.9%', 'stale'],
  ];

  /* Display-only Dashboard tabs. Content mirrors the client's portal tabs; drill-downs and logging are drawn but off. */
  const outreachPerf = {
    // [label, icon, today, previous day, this week]; counted automatically.
    activity: [['Calls', 'phone', 6, 33, 112], ['Emails', 'envelope-simple', 38, 41, 186], ['Texts', 'chat-text', 5, 22, 64], ['Conversations', 'phone-call', 2, 1, 9]],
    efficiency: { hit: 38, efficacy: 12, conversations: 9, confirmed: 42, calls: 112 },
    // A drop worth explaining: conversations this week vs last, with what moved.
    diagnosis: { metric: 'Conversations', now: 9, prev: 15, calls: [112, 110], confirmed: [42, 70], list: 'hood:Lower East Side;touch:Called this week', text: 'Conversations are down 40% on last week (9 vs 15). Calls are flat (112 vs 110), but confirmed numbers fell from 70 to 42, so check data quality on the LES list before the next call block.' },
    linkedin: { pct: 14, connected: 5630, total: 40212 },
    blasts: { n: 2, sub: 'Q3 market report, LES digest' },
    // [label, current, change %, window, previous]; logged by hand. Pipeline order.
    business: [['First meetings', 4, 33, '30 days', 3], ['Proposals delivered', 2, 0, '45 days', 2], ['Listings', 1, -50, '90 days', 2], ['Deals in contract', 0, -100, '90 days', 1], ['Deals closed', 1, 0, '90 days', 1]],
    communication: { cur: '24%', change: 6, window: '30 days', sub: 'replies or conversations per touch' },
    prediction: { pct: 78, flagged: 7, total: 9, window: '180 days' },
    trades: [['Class A', 4], ['Class B', 2], ['Class C', 1], ['Class D', 0], ['Likely holder', 0], ['Unclassified', 2]],
  };
  const reporting = {
    // [zip, owners touched, reachable owners, warm]
    zips: [['10002', 412, 2940, 61], ['10003', 141, 1530, 22], ['10009', 128, 2180, 14], ['10012', 126, 1180, 25], ['10013', 37, 930, 4], ['10028', 214, 2460, 31], ['10038', 19, 650, 2], ['10036', 74, 1640, 6], ['10011', 98, 1230, 13], ['10010', 31, 620, 3]],
    engaged: 86,
    channels: ['All outreach', 'Calls', 'Mail merge', 'Constant Contact', 'Texts'],
    emailChannels: ['All email', 'Constant Contact', 'Mail merge', 'Calling', 'Texts'],
    funnel: { sent: 12400, delivered: 11980, opened: 5270, clicked: 712, bounced: 420, unsub: 18 },
    clicked: [['41 Ludlow St OM', 268], ['Q3 report PDF', 196], ['Book a call', 104], ['Listings page', 86], ['88 Orchard St OM', 58]],
    engagement: [
      { t: 'Cold email', v: 'Smartlead', head: '312 opens', rows: [['Sent', '1,240'], ['Clicked', '38'], ['Replies', '17'], ['Bounced', '22']], foot: 'Last 7 days: 64 opens · 5 replies' },
      { t: 'Digest', v: 'Constant Contact', head: '4,190 opened', rows: [['Recipients', '11,800'], ['Delivered', '11,640'], ['Bounced', '160'], ['Unsubscribed', '21']], foot: '36% of delivered opened' },
      { t: 'Inbox', v: 'Replies and direct mail', head: '41 captured', rows: [['Email replies', '29'], ['Mail responses', '12'], ['Unread', '9']], foot: 'In the Death Star inbox' },
    ],
  };
  const listings = [
    { addr: '41 Ludlow St', sub: 'Lower East Side · 24 units · 18,600 SF · $14.5M', status: 'Active', photo: 'assets/listings/41-ludlow-st.svg',
      counts: [['Website views', 612, true], ['Blast views', 1019, true], ['LinkedIn post views', 1420, false], ['Tours', 6, false], ['Written offers', 1, false]],
      viewers: [['adler', 4, 'Sep 29'], ['okafor', 3, 'Sep 28'], ['lindqvist', 3, 'Sep 28'], ['greene', 2, 'Sep 27'], ['shah', 1, 'Sep 25'], ['brennan', 1, 'Sep 24'], ['chen', 1, 'Sep 22'], ['feld', 1, 'Sep 21'], ['osei', 1, 'Sep 20'], ['morales', 1, 'Sep 19'], ['baum', 1, 'Sep 12']],
      // Written offers, for "we just reduced the price, any room to come up?"
      offers: [['Halcyon Capital', '$13.2M', 'Sep 24', 'Below ask · 91%'], ['Tomas Ruiz', '$12.6M', 'Sep 9', 'Expired Sep 23']] },
    { addr: '88 Orchard St', sub: 'Lower East Side · 12 units · 9,200 SF · $6.9M', status: 'In contract', photo: 'assets/listings/88-orchard-st.svg',
      counts: [['Website views', 205, true], ['Blast views', 488, true], ['LinkedIn post views', 310, false], ['Tours', 4, false], ['Written offers', 2, false]],
      viewers: [['rivera', 2, 'Sep 26'], ['kowalski', 1, 'Sep 24']],
      offers: [['Bowery Equities', '$6.7M', 'Sep 18', 'Accepted · in contract'], ['Leah Kim', '$6.4M', 'Sep 12', 'Declined'], ['Halcyon Capital', '$6.2M', 'Sep 3', 'Declined']] },
    // No street-view asset: the card draws one (DS.streetArt) from these.
    { addr: '230 E 7th St', sub: 'East Village · 16 units · 11,400 SF · $8.2M', status: 'Active', art: { stories: 5, units: 16, shops: true },
      counts: [['Website views', 318, true], ['Blast views', 640, true], ['LinkedIn post views', 520, false], ['Tours', 3, false], ['Written offers', 0, false]],
      viewers: [['rivera', 2, 'Sep 29'], ['kowalski', 1, 'Sep 25'], ['brennan', 1, 'Sep 23']], offers: [] },
    { addr: '15 Clinton St', sub: 'Lower East Side · 20 units · 14,800 SF · $11.9M', status: 'Coming soon', art: { stories: 6, units: 20, shops: false },
      counts: [['Website views', 96, true], ['Blast views', 0, true], ['LinkedIn post views', 210, false], ['Tours', 0, false], ['Written offers', 0, false]],
      viewers: [['adler', 1, 'Sep 30'], ['okafor', 1, 'Sep 29']], offers: [] },
  ];
  // [name, form, email or phone, about, message, date, in database, new]
  const inquiries = [
    ['Priya Venkataraman', 'Contact form', 'priya.v@example.com', '41 Ludlow St', 'Could you send the rent roll and the last two years of expenses?', 'Sep 29, 4:12 PM', true, true],
    ['Jonah Weiss', 'Buyer registration', '(212) 555-0188', '41 Ludlow St', 'Would like to tour this week, any morning works.', 'Sep 28, 9:40 AM', false, true],
    ['Leah Kim', 'Contact form', 'leah.kim@example.com', '88 Orchard St', 'When is the offer deadline?', 'Sep 26, 2:05 PM', false, false],
  ];
  const inbound = {
    buyers: [['Tomas Ruiz', 'Multifamily, LES, up to $12M', 'Sep 28'], ['Halcyon Capital', '1031 buyer, walk-ups', 'Sep 24']],
    bov: [['90 Clinton St', 'Grace Okafor · Sent', 'Sep 30'], ['64 Essex St', 'Ruth Adler · Draft, due Fri', 'Sep 27']],
    bookings: [['Tour · 41 Ludlow St', 'Jonah Weiss', 'Oct 2, 11:00 AM'], ['Call · 30 min', 'Priya Venkataraman', 'Oct 1, 4:00 PM'], ['Tour · 88 Orchard St', 'Leah Kim', 'Oct 3, 10:00 AM']],
    events: { name: 'Q3 luncheon promo', v7: 84, v30: 312, rsvps: 18, rsvps7: 5, refs: [['Constant Contact', 141], ['Direct', 96], ['LinkedIn', 52]] },
  };
  const web = {
    site: 'stewartgroup.example', now: 3,
    audience: [['Visitors', '4,912', '+18% on last month'], ['Sessions', '6,580', '1.3 per visitor'], ['Page views', '11,380', '+12% on last month'], ['Engaged time', '1m 52s', 'per session, tab in view'], ['Bounce rate', '41%', 'one page, under 10s']],
    outcomes: [['Inquiries', '15', 'website forms'], ['Downloads', '64', 'OMs and documents'], ['Known contacts', '9', 'from tracked email links']],
    weeks: [['Aug 18', 880], ['Aug 25', 940], ['Sep 1', 1020], ['Sep 8', 990], ['Sep 15', 1110], ['Sep 22', 1190], ['This wk', 1284]],
    insights: ['Email is carrying the site. Constant Contact and Smartlead visitors convert at about three times the rate of search.', 'The OM pages hold attention for over a minute, but the listings page loses half its visitors before the first scroll.', 'One listing page is slow on phones (largest paint over 4 seconds). Its photo is the likely cause.'],
    // [channel, sessions, engaged, conversions]
    channels: [['Direct', 2040, '1m 08s', 5], ['Organic search', 1777, '52s', 3], ['Email · Constant Contact', 1053, '2m 20s', 4], ['Email · Smartlead', 592, '2m 05s', 3], ['Referral', 526, '44s', 0], ['Social · LinkedIn', 395, '38s', 0], ['Paid', 197, '29s', 0]],
    campaigns: [['les-sept', 'Smartlead', 210, 3], ['redigest-w39', 'Constant Contact', 105, 2], ['redigest-w38', 'Constant Contact', 70, 1], ['tribeca-longhold', 'Smartlead', 52, 0], ['q3-report', 'LinkedIn', 42, 0]],
    // [contact id, views, pages, last visit, channel]
    contacts: [['adler', 6, '41 Ludlow St, Listings', 'Sep 29', 'Constant Contact'], ['okafor', 4, '41 Ludlow St', 'Sep 28', 'Smartlead'], ['greene', 3, 'Listings, Market reports', 'Sep 27', 'Constant Contact'], ['shah', 2, '41 Ludlow St', 'Sep 25', 'Smartlead'], ['rivera', 2, '88 Orchard St', 'Sep 24', 'Constant Contact']],
    realtime: [['/listings', 2], ['/', 1]],
    // [path, views, people, engaged, scroll]
    pages: [['/', 3420, 2210, '48s', '52%'], ['/listings', 2080, 1460, '1m 05s', '38%'], ['/listings/41-ludlow-st', 1270, 612, '1m 42s', '71%'], ['/listings/88-orchard-st', 640, 205, '1m 18s', '64%'], ['/market-reports', 590, 410, '2m 10s', '58%'], ['/sell-your-building', 380, 290, '1m 30s', '66%']],
    documents: [['41 Ludlow St OM', 'om-41-ludlow-st.pdf', 26, 18], ['88 Orchard St OM', 'om-88-orchard-st.pdf', 14, 10], ['Q3 market report', 'q3-manhattan-multifamily-report.pdf', 24, 19]],
    forms: [['Contact form', 12, 5, 5], ['Property evaluation', 7, 3, 3], ['Buyer registration', 6, 3, 3], ['Email updates', 18, 8, 0], ['Event RSVP', 4, 4, 4]],
    clicks: [['Call', '(212) 555-0100', 8], ['Email', 'info@example.com', 4], ['Button', 'Request a valuation', 3], ['Outbound', 'linkedin.com', 2]],
    // [metric label, value, short code, rating]
    vitals: [['Largest paint', '2.1s', 'LCP', 'good'], ['Response to taps', '168ms', 'INP', 'good'], ['Layout shift', '0.062', 'CLS', 'good'], ['Server response', '612ms', 'TTFB', 'good']],
    vitalPages: [['/', '1.8s', '120ms', '0.02'], ['/listings', '2.4s', '180ms', '0.08'], ['/listings/41-ludlow-st', '3.1s', '240ms', '0.14'], ['/listings/88-orchard-st', '4.4s', '520ms', '0.31']],
  };
  const nudges = {
    home: 'Meetings are at 3 this week, up from 1. Follow-ups are the gap: 2 are overdue.',
    'attack-plan': '22 Class A owners have no logged call yet and 3 loans mature inside 12 months. Start the call block with the maturities.',
    calendar: 'Your 1:30 PM call block has 6 owners queued. Marchetti is first.',
    conversations: '3 conversations this week asked for a number. Two proposals are in progress.',
    'outreach-performance': 'Replies are up but conversations are down 40% on last week. Work the 5 replies before sending anything new.',
    reporting: 'Coverage is thinnest in 10038 and 10013. Both have Class A owners nobody has called.',
    listings: '3 people viewed 41 Ludlow this week. Two are in your database.',
    'web-analytics': 'The 41 Ludlow St page drives most inquiries. Feature it in Thursday’s digest.',
  };

  /* Property record facts, in the shape of the client's current property page (DOF, ACRIS, HPD, DOB, ECB,
     zoning). Derived per building so every record is complete; values agree with the contact case file. */
  const LENDERS = ['Hudson Mutual Savings', 'Delancey Federal', 'Bowery Community Bank', 'East River Lending', 'Gotham Capital Partners'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  const short = n => n >= 1e6 ? '$' + (Math.round(n / 1e5) / 10) + 'M' : '$' + Math.round(n / 1e3) + 'K';
  const VIOS = {
    p118: [['HPD', 'Leak in ceiling, apt 4B', 'Aug 19', 'Open'], ['HPD', 'Missing window guard, apt 2A', 'Aug 19', 'Open'], ['HPD', 'No hot water, apt 3C', 'Jul 2', 'Open'], ['HPD', 'Mold in bathroom, apt 5A', 'Jun 14', 'Open'], ['HPD', 'Peeling lead paint, apt 1B', 'May 30', 'Open', 'Hazardous'], ['HPD', 'Smoke detector missing, apt 6C', 'May 2', 'Open', 'Hazardous'], ['DOB', 'Facade inspection overdue', 'Jun 2', 'Open'], ['ECB', 'Sidewalk shed permit expired', 'Feb 11', 'Closed'], ['HPD', 'Broken intercom', 'Jan 8', 'Closed'], ['HPD', 'Defective door lock, apt 3A', 'Dec 3, 2025', 'Closed'], ['DOB', 'Boiler inspection late', 'Nov 20, 2025', 'Closed'], ['HPD', 'Roach infestation, apt 2C', 'Oct 9, 2025', 'Closed']],
  };
  const propFacts = p => {
    const c = cById[p.owner], h = [...p.id].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
    const mixed = ['p155d', 'p31b', 'p19r'].includes(p.id), stories = p.units < 15 ? 4 : p.units < 25 ? 5 : 6;
    const [, blk, lt] = p.bbl.split('-').map(Number);
    const zoning = p.hood === 'East Village' ? 'R7B' : mixed ? 'C6-2A' : 'R7A', far = { R7B: 3, R7A: 4, 'C6-2A': 6.02 }[zoning];
    const unused = p.id === 'p212e' ? 9400 : 0, lotSF = Math.round((p.sf + unused) / far / 10) * 10;
    const lead = c.pid === p.id, years = lead ? c.years : Math.max(6, c.years - 4 - (h % 7));
    const saleY = 2026 - years, saleD = p.id === 'p118' ? 'Mar 14, 2006' : MONTHS[h % 12] + ' ' + (1 + (h % 27)) + ', ' + saleY;
    const saleP = p.id === 'p118' ? 4.1e6 : Math.round(p.sf * (95 + (h % 60)) * (years > 25 ? 0.35 : years > 15 ? 0.7 : 1) / 1e5) * 1e5;
    const assessed = Math.round(p.sf * (88 + (h % 40)) / 1e3) * 1e3;
    const hasDebt = p.debt !== 'Not on record';
    const months = p.id === 'p118' ? 8 : (() => { const d = new Date(p.mat); if (!hasDebt || isNaN(d)) return null; const m = Math.round((d - TODAY) / (30.4 * 864e5)); return m > 0 ? m : null; })();
    const vio = VIOS[p.id] || (p.signals > 1 ? [['HPD', 'No hot water, apt 3C', 'Sep 3', 'Open'], ['HPD', 'Peeling paint, hallway', 'Mar 18', 'Closed'], ['DOB', 'Elevator inspection late', 'Jan 22', 'Closed']] : p.signals === 1 ? [['HPD', 'Broken window, apt 1A', 'Apr 4', 'Closed']] : []);
    const count = ag => { const v = vio.filter(x => x[0] === ag); return { open: v.filter(x => x[3] === 'Open').length, total: v.length }; };
    const signals = [
      ['Loan maturity', months != null && months <= 18, months != null ? p.debt + ' due ' + p.mat + ' · ' + months + ' months to maturity' : ''],
      ['Pre-2005 owner', years >= 20, 'Acquired ' + saleD + ' · held ' + years + ' years, large embedded gain'],
      ['Lis pendens', c.id === 'chen' && lead, 'Active legal distress on record · filed Aug 14'],
      ['High debt', p.id === 'p118', p.debt + ' across ' + p.units + ' units · debt is 68% of value'],
      ['Unused FAR', unused > 0, DS_fmt(unused) + ' SF of unbuilt development rights under ' + zoning],
    ];
    return {
      type: mixed ? 'Mixed-use, walk-up with stores' : 'Walk-up apartments', cls: mixed ? 'C7' : 'C1', stories, pipeline: 'None on record',
      avgUnit: Math.round(p.sf * 0.82 / p.units / 10) * 10 + ' SF', rentReg: p.rs ? 'Stabilized · 2024 tax bill' : 'Not regulated', ownerOcc: 'No',
      saleD, saleP: money(saleP), saleShort: short(saleP), years, assessed: money(assessed), assessedShort: short(assessed),
      lotSF, block: 'Block ' + blk + ' · Lot ' + lt, zoning, far, unused, maxB: p.sf + unused,
      lender: p.id === 'p118' ? 'Brookline Capital' : hasDebt ? LENDERS[h % LENDERS.length] : 'Not on record',
      debtAsOf: p.id === 'p118' ? 'Aug 12, 2026' : hasDebt ? MONTHS[(h >> 3) % 12] + ' ' + (1 + ((h >> 2) % 27)) + ', ' + (2024 + ((h >> 4) % 2)) : 'Not on record',
      months, distress: c.id === 'chen' && lead ? 'Lis pendens · filed Aug 14' : 'None on record',
      vio, dob: count('DOB'), ecb: count('ECB'), hpd: count('HPD'), litigation: p.id === 'p118' ? 1 : 0,
      storefront: mixed ? 'Occupied' : null,
      signals,
      deals: [],
    };
  };
  const DS_fmt = n => Number(n).toLocaleString('en-US');

  window.DS_DATA = { changes, touches, LANES, approvals, openers, buyers, buyersFor, dncList, TODAY, addD, TERRITORY, DB, suggested, taught, okaforLesson, dropFile, headlines, postDraft, comps, engagement, linkedin, touched, teamHistory, teamOf, relationship, critCounts, brainList, listCrit, C, P, cById, pById, propFacts, CLASS, TIER, TRUST, evidence, drivers, antis, baseTimeline, contactPoints, callIds, tiles, meetings, tasks, cats, goals, weekFocus, weekAlt, calendars, events, conversations, chats, proactive, docs, nav, more, links, dashboardTabs, databaseTabs, lists, listsOff, hoods, customLists, outreachPerf, reporting, listings, inquiries, inbound, web, nudges };
})();
