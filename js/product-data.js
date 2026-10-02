/* Death Star demo fixtures. All people, entities, addresses and BBLs are fictional.
   "Today" is Wednesday, September 30, 2026. Offsets (off) count days from today. */
(() => {
  const TODAY = new Date(2026, 8, 30);
  const addD = n => { const d = new Date(TODAY); d.setDate(d.getDate() + n); return d; };

  const C = [
    ['marchetti', 'Daniel Marchetti', 'Ludlow 118 Holdings LLC', 'A', 132, 'p118', 'Loan maturity', '$9.4M loan due in June on 37 units', 'Daniel Marchetti has a $9.4M loan coming due in June on his 37-unit Ludlow Street building. He’ll need to refinance or sell, so now’s the time to get in front of him.', 'verified', '41d ago · No answer', '(212) 555-0147', 'Contacted', 19, 'Debt Clock', 'Rising', 'Domestic LLC · Family owner', 1],
    ['feld', 'Aaron Feld', 'Orchard 27 Realty LLC', 'A', 121, 'p27o', 'Estate transition', 'Inherited in March; estate in probate', 'Aaron Feld inherited 27 Orchard St in March, and public records suggest the estate is still in probate. Heirs often sell within two years.', 'single', 'Never called', '(212) 555-0182', 'New', 1, 'Estate Transition', 'Rising', 'Domestic LLC · Heir', 0],
    ['okafor', 'Grace Okafor', 'Clinton Street Partners LP', 'A', 117, 'p90c', 'Loan maturity', '$6.1M loan due in August; held 22 years', 'Grace Okafor’s $6.1M loan on 90 Clinton St matures in August, and her family has held the building for 22 years. A sale or recap is likely this year.', 'verified', '12d ago · Voicemail', '(212) 555-0164', 'Contacted', 22, 'Debt Clock', 'Steady', 'Limited partnership · Family office', 1],
    ['adler', 'Ruth Adler', 'Adler Family Trust', 'B', 98, 'p64e', 'Long hold', 'Held 31 years; partners in their 70s', 'Ruth Adler’s family has held 64 Essex St for 31 years, and both partners are in their 70s. Long holds like this often trade when the next generation takes over.', 'verified', '3d ago · Callback set', '(212) 555-0121', 'Engaged', 31, 'Legacy Hold', 'Steady', 'Trust · Family owner', 1],
    ['rivera', 'Marisol Rivera', 'Rivera Holdings LLC', 'B', 88, 'p212e', 'Unused FAR', '9,400 SF of unused air rights', 'Marisol Rivera’s building at 212 E 3rd St has 9,400 SF of unused development rights. Developers are paying for air rights in the East Village, which could prompt a sale.', 'verified', '27d ago · No answer', '(212) 555-0138', 'Contacted', 18, 'Fund Exit', 'Rising', 'Domestic LLC · Private owner', 1],
    ['kowalski', 'Peter Kowalski', 'Avenue B Owners LLC', 'B', 84, 'p31b', 'Loan maturity', '$3.2M loan due in November', 'Peter Kowalski has a $3.2M loan on 31 Avenue B coming due in November. With rates where they are, he may prefer to sell than refinance.', 'verified', 'Never called', '(212) 555-0175', 'New', 14, 'Debt Clock', 'Rising', 'Domestic LLC · Private owner', 0],
    ['chen', 'Wei Chen', 'Delancey Owners LLC', 'B', 82, 'p155d', 'Lis pendens', 'Lis pendens filed in August', 'A lis pendens was filed against 155 Delancey St in August. Owners facing a foreclosure action often look for a quick sale.', 'stale', '64d ago · Not interested', '(212) 555-0193', 'Nurture', 9, 'Partner Split', 'Falling', 'Domestic LLC · Partnership', 0],
    ['shah', 'Anita Shah', 'Allen Street Realty LLC', 'C', 61, 'p48a', 'Long hold', 'Held 26 years, no recent activity', 'Anita Shah has held 48 Allen St for 26 years with no refinance or listing. Worth a check-in, not a pitch.', 'single', '90d ago · Voicemail', '(212) 555-0110', 'Contacted', 26, 'Legacy Hold', 'Steady', 'Domestic LLC · Private owner', 0],
    ['greene', 'Michael Greene', 'Rivington 19 LLC', 'C', 55, 'p19r', 'Nearby sale', 'Listed a nearby building last year', 'Michael Greene listed a nearby building last year and pulled it. He may be open to talking about 19 Rivington St.', 'stale', '5mo ago · Connected', '(212) 555-0156', 'Nurture', 11, 'Fund Exit', 'Falling', 'Domestic LLC · Investor', 0],
    ['morales', 'Elena Morales', 'Stanton 7 LLC', 'D', 34, 'p7s', 'Long hold', 'Long hold; few signals', 'Elena Morales has owned 7 Stanton St for 15 years. There are few signals right now, so keep her informed rather than calling.', 'single', 'Never called', '(212) 555-0149', 'New', 15, 'Legacy Hold', 'Steady', 'Domestic LLC · Private owner', 0],
    ['baum', 'Harold Baum', 'Norfolk 120 Associates', 'LH', 14, 'p120n', 'Recent refinance', 'Refinanced in 2024 on a 10-year term', 'Harold Baum refinanced 120 Norfolk St in 2024 on a 10-year term. He’s likely to hold.', 'verified', '2mo ago · Not interested', '(212) 555-0187', 'Do not contact', 21, 'Legacy Hold', 'Steady', 'Domestic LLC · Private owner', 0],
  ].map(([id, name, entity, cls, score, pid, signal, why, whyFull, trust, last, phone, status, years, narrative, momentum, meta, warm]) => ({ id, name, entity, cls, score, pid, signal, why, whyFull, trust, last, phone, status, years, narrative, momentum, meta, warm }));

  const P = [
    ['p118', '118 Ludlow St', 'Lower East Side', '10002', '1-00412-0033', 'marchetti', 37, 12, 25, 21400, 1910, '$9.4M', 'Jun 9, 2026', 4],
    ['p22h', '22 Hester St', 'Chinatown', '10002', '1-00301-0018', 'marchetti', 16, 10, 6, 9800, 1925, '$2.1M', 'Mar 2029', 1],
    ['p9l', '9 Ludlow St', 'Lower East Side', '10002', '1-00296-0041', 'marchetti', 12, 4, 8, 7200, 1920, 'Not on record', 'Not on record', 1],
    ['p27o', '27 Orchard St', 'Lower East Side', '10002', '1-00297-0012', 'feld', 24, 9, 15, 14100, 1915, '$3.8M', 'Jan 2028', 2],
    ['p90c', '90 Clinton St', 'Lower East Side', '10002', '1-00348-0025', 'okafor', 41, 20, 21, 26800, 1928, '$6.1M', 'Aug 2026', 3],
    ['p64e', '64 Essex St', 'Lower East Side', '10002', '1-00352-0007', 'adler', 20, 6, 14, 12400, 1905, '$1.4M', 'Dec 2030', 2],
    ['p155d', '155 Delancey St', 'Lower East Side', '10002', '1-00346-0031', 'chen', 30, 18, 12, 19600, 1931, '$4.9M', 'Feb 2027', 2],
    ['p212e', '212 E 3rd St', 'East Village', '10009', '1-00385-0044', 'rivera', 18, 8, 10, 11300, 1900, '$1.9M', 'Oct 2029', 2],
    ['p31b', '31 Avenue B', 'East Village', '10009', '1-00384-0002', 'kowalski', 22, 12, 10, 13800, 1910, '$3.2M', 'Nov 2026', 2],
    ['p48a', '48 Allen St', 'Lower East Side', '10002', '1-00308-0019', 'shah', 14, 6, 8, 8600, 1915, 'Not on record', 'Not on record', 1],
    ['p19r', '19 Rivington St', 'Lower East Side', '10002', '1-00425-0036', 'greene', 10, 10, 0, 6400, 1925, '$1.1M', 'Jul 2031', 1],
    ['p7s', '7 Stanton St', 'Lower East Side', '10002', '1-00426-0003', 'morales', 8, 2, 6, 5100, 1910, 'Not on record', 'Not on record', 0],
    ['p120n', '120 Norfolk St', 'Lower East Side', '10002', '1-00354-0028', 'baum', 26, 14, 12, 16200, 1930, '$5.5M', 'May 2034', 0],
  ].map(([id, addr, hood, zip, bbl, owner, units, fm, rs, sf, built, debt, mat, signals]) => ({ id, addr, hood, zip, bbl, owner, units, fm, rs, sf, built, debt, mat, signals }));

  const cById = Object.fromEntries(C.map(c => [c.id, c]));
  const pById = Object.fromEntries(P.map(p => [p.id, p]));

  const CLASS = { A: 'Immediate seller', B: 'High probability', C: 'Monitor', D: 'Informational', LH: 'Likely holder' };
  const TIER = { A: 'Tier 1 · Hot', B: 'Tier 2 · Warm', C: 'Tier 3 · Watch', D: 'Tier 4 · Inform', LH: 'Hold' };
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
    ? [['Call', 'No answer', 'Aug 21'], ['Email', 'Opened the Q3 market report', 'Aug 3'], ['Call', 'Voicemail', 'Jul 14'], ['Text', 'Sent the LES rent roll comps', 'Jul 2'], ['Broadcast', 'Q2 LES market report · opened', 'Jun 18'], ['Note', 'Met at the REBNY breakfast; open to talking next year', 'Jun 2']]
    : (c.last === 'Never called' ? [] : [['Call', c.last.split(' · ')[1] || 'Call', c.last.split(' · ')[0]]]);

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
    { name: 'Activity', icon: 'pulse', label: 'Calls today', num: '6 / 40', title: 'Calls per day, last 7 days', sub: 'Activity · goal 40 a day', head: '112', headL: 'calls this week', go: 'Go to Outreach performance', to: 'outreach-performance', goal: 40, labels: D7, vals: [28, 31, 0, 0, 14, 33, 6], max: 40, zero: 'No calls' },
    { name: 'Database', icon: 'database', label: 'New Class A', num: '4', title: 'New signals per week', sub: 'Database · last 7 weeks', head: '26', headL: 'new signals this week', go: 'Go to Database', to: 'contacts', labels: W7, vals: [14, 18, 11, 22, 19, 24, 26] },
    { name: 'Outreach', icon: 'list-bullets', label: 'Queues ready', num: '3', title: 'Contacts queued per week', sub: 'Outreach · last 7 weeks', head: '148', headL: 'in 3 ready queues', go: 'Go to Outreach', labels: W7, vals: [90, 110, 95, 130, 120, 142, 148] },
    { name: 'Phone', icon: 'phone', label: 'Conversations', num: '2', title: 'Conversations per day', sub: 'Phone · last 7 days', head: '9', headL: 'conversations this week', go: 'Go to Phone', labels: D7, vals: [3, 2, 0, 0, 1, 1, 2] },
    { name: 'Email', icon: 'envelope-simple', label: 'Replies', num: '5', title: 'Replies per day', sub: 'Email · last 7 days', head: '17', headL: 'replies this week', go: 'Go to Email', labels: D7, vals: [3, 4, 0, 1, 2, 2, 5] },
    { name: 'Texting', icon: 'chat-text', label: 'Unread', num: '3', title: 'Texts sent per day', sub: 'Texting · last 7 days', head: '64', headL: 'texts sent this week', go: 'Go to Texting', labels: D7, vals: [12, 15, 0, 0, 9, 22, 6] },
    { name: 'Marketing', icon: 'megaphone', label: 'Last open rate', num: '44%', title: 'Last campaign funnel', sub: 'Marketing · Q3 market report', head: '44%', headL: 'open rate', go: 'Go to Marketing', labels: ['Sent', 'Delivered', 'Opened', 'Clicked'], vals: [2400, 2316, 1019, 143], fmt: 'loc' },
    { name: 'LinkedIn', icon: 'linkedin-logo', label: 'New connections', num: '12', title: 'New connections per week', sub: 'LinkedIn · last 7 weeks', head: '12', headL: 'new this week', go: 'Go to LinkedIn', labels: W7, vals: [6, 9, 4, 11, 8, 10, 12] },
    { name: 'Social', icon: 'users', label: 'Engagement', num: '230', title: 'Engagement per week', sub: 'Social · last 7 weeks', head: '230', headL: 'engagements this week', go: 'Go to Social', labels: W7, vals: [140, 165, 120, 190, 210, 175, 230] },
    { name: 'Map', icon: 'map-trifold', label: 'ZIP coverage', num: '8%', title: 'Owners called by ZIP', sub: 'Map · share called at least once', head: '8%', headL: 'territory coverage', go: 'Go to Map', labels: ['10002', '10003', '10009', '10012', '10013', '10014', '10038'], vals: [14, 9, 6, 11, 4, 7, 3], fmt: 'pct', flat: true },
    { name: 'Web analytics', icon: 'globe', label: 'Visitors this week', num: '1,284', title: 'Visitors per week', sub: 'Web analytics · last 7 weeks', head: '1,284', headL: 'visitors this week', go: 'Go to Web analytics', to: 'web-analytics', labels: W7, vals: [880, 940, 1020, 990, 1110, 1190, 1284], fmt: 'loc' },
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
    Weekly: [['150 dials', 150, 'dials'], ['3 first meetings', 3, 1], ['Post one market note on LinkedIn', 0, 0]],
    Monthly: [['2 proposals delivered', 2, 1], ['1 new listing', 1, 0], ['Refresh the Q4 owner list', 0, 0]],
  };
  const weekFocus = [['Calls · Sourcing', '14 dials done'], ['Mail merge · Listings', '1 blast sent'], ['Calls · LES maturities', 'calls'], ['LinkedIn · Market info', 'Planned'], ['Constant Contact · Listings', 'Planned']];
  const weekAlt = [['Calls · Class A', 'Calls'], ['Mail merge · Market report', 'Blast'], ['Calls · Probate leads', 'Calls'], ['LinkedIn · Listings', 'Posts'], ['Constant Contact · Digest', 'Email']];

  /* Calendars: key → [label]. Events: [weekday 0–4, start hour, hours, calendar, title, with, contact]. */
  const calendars = { mtg: 'Meetings', call: 'Call blocks', tour: 'Tours', mkt: 'Marketing' };
  const events = [[0, 9, 2, 'call', 'Calls · Sourcing', 'Class A list'], [0, 14, 1, 'mtg', 'Lender coffee', 'Brookline Capital'], [1, 10, 1, 'mkt', 'Mail merge · Listings', 'LES owners'], [1, 15, 0.5, 'mtg', 'Adler callback', 'Ruth Adler', 'adler'],
    [2, 9.5, 1, 'tour', 'Tour · 41 Ludlow St', 'Priya Venkataraman'], [2, 12, 1, 'mtg', 'Lunch · Grace Okafor', 'Okafor family office', 'okafor'], [2, 13.5, 1.5, 'call', 'Calls · LES maturities', 'Daniel Marchetti first', 'marchetti'], [2, 15.5, 0.5, 'mtg', 'Pipeline review', 'Zoom · Mira W.'], [2, 17, 0.5, 'mtg', 'Lender update', 'Brookline Capital'],
    [3, 11, 0.5, 'mkt', 'LinkedIn · Market note', 'Post'], [3, 14, 1, 'tour', 'Tour · 90 Clinton St', 'Grace Okafor', 'okafor'], [4, 10, 1, 'mtg', 'Team meeting', 'Stewart Group'], [4, 13, 1, 'mkt', 'Constant Contact · Listings', 'Weekly send']];

  /* Conversations board for this week: [weekday or 'prop', contact, topic, outcome, next step]. */
  const conversations = {
    0: [['0', 'adler', 'Open to a pricing opinion on 64 Essex St', 'Interested', 'Send comps Fri'], ['1', 'rivera', 'Asked who is buying air rights in the East Village', 'Interested', 'Intro a developer'], ['2', 'okafor', 'Lunch recap: family wants a number before the loan is due', 'Callback', 'Call Oct 6'], ['prop', 'okafor', 'BOV for 90 Clinton St', 'Sent', 'Follow up Oct 8'], ['prop', 'adler', 'Pricing opinion · 64 Essex St', 'Draft', 'Due Fri']],
    prev: [['1', 'greene', 'Would revisit 19 Rivington in spring', 'Not now', 'Nurture'], ['3', 'shah', 'Check-in, no plans to sell', 'Not now', 'Q1 check-in'], ['prop', 'okafor', 'BOV for 90 Clinton St', 'Draft', 'Sent Sep 30']],
    next: [['prop', 'okafor', 'BOV for 90 Clinton St', 'Sent', 'Follow up Oct 8']],
  };

  const chats = [
    { id: 'p1', g: 'Pinned', pin: true, t: 'LES owners with debt due before year end', m: [{ role: 'user', text: '/list LES owners with debt due before year end' }, { role: 'bot', text: '12 owners match: Lower East Side, debt due by Dec 31, 2026, Class A and B. Marchetti, Feld and Okafor are the top three.', acts: [['Open in Database', 'contacts', '', false]] }] },
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
  const nav = [['Home', 'house', 'home'], ['Dashboard', 'squares-four', 'attack-plan'], ['Brain', 'sparkle', 'brain'],
    'Prospecting', ['Database', 'database', 'contacts'], ['Map', 'map-trifold'], ['Outreach', 'list-bullets'],
    'Channels', ['Phone', 'phone'], ['Email', 'envelope-simple', null, '4'], ['Texting', 'chat-text', null, '2'], ['LinkedIn', 'linkedin-logo'], ['Social', 'users'],
    'Marketing', ['Marketing', 'megaphone'], ['Website', 'globe']];
  const more = [['Today', 'sun'], ['Field Mode', 'device-mobile'], ['Headlines', 'newspaper'], ['Market Data', 'chart-line'], ['Ledger', 'book'], ['Prediction Model', 'brain'], ['BOV & OM', 'file-text'], ['Integrations', 'puzzle-piece']];
  const links = [{ h: 'Research', items: ['PincusCo', 'UniCourt', 'LoopNet', 'Zillow', 'StreetEasy', 'Hunter', 'PropertyShark', 'Apollo', 'CoStar', 'NYC ACRIS', 'NYC Open Data'] }, { h: 'Media', items: ['The Real Deal', 'Bisnow', 'Commercial Observer', 'WSJ Real Estate', 'Crain’s New York', 'YIMBY NY', 'GlobeSt'] }];

  /* Page tabs. A null page is drawn but disabled. */
  const dashboardTabs = [['attack-plan', 'Attack Plan'], ['calendar', 'Calendar'], ['conversations', 'Conversations'], '|', ['outreach-performance', 'Outreach performance'], ['reporting', 'Reporting'], ['listings', 'Listings'], ['web-analytics', 'Web analytics']];
  const databaseTabs = [['contacts', 'Contacts'], ['properties', 'Properties']];

  const lists = [['all', 'All contacts', 320], ['A', 'Class A sellers', 22], ['B', 'Class B sellers', 41], ['C', 'Class C sellers', 88], ['D', 'Class D sellers', 120], ['LH', 'Likely holders', 64], ['warm', 'Warm contacts', 37], ['cold', 'Cold contacts', 210]];
  const listsOff = [['Professional grade', 18], ['Portfolio sellers', 29], ['Active buyers', 46]];
  const hoods = [['Lower East Side', 184], ['East Village', 136]];
  const customLists = ['Class A sellers', 'LES debt 2026', 'Estate watch', 'Q4 mail merge', 'Air rights', 'Callbacks this week'];

  /* Display-only Dashboard tabs. */
  const outreachPerf = {
    outreach: [['Calls', '6', 'Previous day 33 · Week 112', 'phone'], ['Emails', '38', 'Previous day 41 · Week 186', 'envelope-simple'], ['Texts', '5', 'Previous day 22 · Week 64', 'chat-text'], ['Conversations', '2', 'Previous day 1 · Week 9', 'chat-text', true], ['LinkedIn connections', '412', '14% of the database', 'linkedin-logo'], ['Weekly marketing blasts', '2', 'Q3 market report, LES digest', 'megaphone']],
    efficiency: [['Hit rate', 38, 'Right number reached'], ['Call efficacy', 12, 'Produced a conversation']],
    business: [['First meetings', '4', '30 days · +33%', 'prev period 3'], ['Proposals delivered', '2', '45 days · 0%', 'prev period 2'], ['Listings', '1', '90 days · −50%', 'prev period 2'], ['Deals in contract', '0', '90 days', 'prev period 1'], ['Deals closed', '1', '90 days · 0%', 'prev period 1']],
    efficacy: [['Communication efficacy', '24%', '30 days · replies or conversations per touch'], ['Prediction model accuracy', '7 of 9', 'trades were flagged in advance · 180 days']],
    trades: [['Class A', 4], ['Class B', 2], ['Class C', 1], ['Class D', 0], ['Likely holder', 0], ['Unclassified', 2]],
  };
  const reporting = {
    zips: [['10002', 14, 184], ['10003', 9, 96], ['10009', 6, 136], ['10012', 11, 74], ['10013', 4, 58], ['10014', 7, 82], ['10038', 3, 41], ['10016', 5, 63], ['10011', 8, 77], ['10010', 2, 39]],
    clicked: [['41 Ludlow St OM', 61], ['Q3 report PDF', 44], ['Book a call', 23], ['Listings page', 15]],
    outreach: [['Sent', '2,400'], ['Delivered', '2,316'], ['Open rate', '44%'], ['Click rate', '6%'], ['Bounced', '84'], ['Unsubscribed', '0']],
    funnel: [['Sent', 2400], ['Delivered', 2316], ['Opened', 1019], ['Clicked', 143]],
    engagement: [['Cold email', 'Smartlead', '17 replies', '1,240 sent · 1.4% reply rate'], ['Digest', 'Constant Contact', '36% open rate', '1,180 subscribers · 3 unsubscribes'], ['Inbox', 'Replies and direct mail', '9 to answer', '5 email replies · 4 mail responses']],
  };
  const listings = [
    { addr: '41 Ludlow St', sub: 'Lower East Side · 24 units · $14.5M', status: 'Active', counts: [['Website views', '612'], ['Blast views', '1,019'], ['LinkedIn post views', '1,420'], ['Tours', '6'], ['Written offers', '1']] },
    { addr: '88 Orchard St', sub: 'Lower East Side · 12 units · $6.9M', status: 'In contract', counts: [['Website views', '205'], ['Blast views', '488'], ['LinkedIn post views', '310'], ['Tours', '4'], ['Written offers', '2']] },
  ];
  const viewers = [['adler', '41 Ludlow St · 4 views'], ['okafor', '41 Ludlow St · 3 views'], ['rivera', '88 Orchard St · 2 views'], ['greene', '41 Ludlow St · 2 views'], ['shah', '41 Ludlow St · 1 view'], ['kowalski', '88 Orchard St · 1 view']];
  const inquiries = [['Priya Venkataraman', '41 Ludlow St · asked for the rent roll', 'Sep 29', true], ['Jonah Weiss', '41 Ludlow St · tour request', 'Sep 28', false], ['Leah Kim', '88 Orchard St · offer deadline', 'Sep 26', false]];
  const inbound = { buyers: [['Tomas Ruiz', 'Multifamily, LES, up to $12M', 'Sep 28'], ['Halcyon Capital', '1031 buyer, walk-ups', 'Sep 24']], bov: [['Grace Okafor', '90 Clinton St', 'Sent Sep 30'], ['Ruth Adler', '64 Essex St', 'Draft · due Fri']], bookings: [['Jonah Weiss', 'Tour · 41 Ludlow St', 'Oct 2, 11:00 AM'], ['Priya Venkataraman', 'Call · 30 min', 'Oct 1, 4:00 PM'], ['Leah Kim', 'Tour · 88 Orchard St', 'Oct 3, 10:00 AM']] };
  const web = {
    stats: [['Visitors', '4,912', '30 days · +18%'], ['Page views', '11,380', '30 days · +12%'], ['Inquiries', '15', '30 days · +4'], ['Average time', '1m 52s', '30 days · +9s']],
    weeks: [['Aug 18', 880], ['Aug 25', 940], ['Sep 1', 1020], ['Sep 8', 990], ['Sep 15', 1110], ['Sep 22', 1190], ['This wk', 1284]],
    insights: ['Visitors are up 18% on last month, led by the 41 Ludlow St listing page (612 views).', 'Inquiries rose by 4. Most came from the listing page, not the home page.', 'People stay about two minutes. The rent roll download is the most clicked link.'],
  };
  const nudges = {
    'attack-plan': '22 Class A owners have no logged call yet and 3 loans mature inside 12 months. Start the call block with the maturities.',
    calendar: 'Your 1:30 PM call block has 6 owners queued. Marchetti is first.',
    conversations: '3 conversations this week asked for a number. Two proposals are in progress.',
    'outreach-performance': 'Replies are up but conversations are flat. Work the 5 replies before sending anything new.',
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
      signals, priority: { A: 'P1', B: 'P2', C: 'P3', D: 'P4', LH: 'P4' }[c.cls],
      deals: [],
    };
  };
  const DS_fmt = n => Number(n).toLocaleString('en-US');

  window.DS_DATA = { TODAY, addD, C, P, cById, pById, propFacts, CLASS, TIER, TRUST, evidence, drivers, antis, baseTimeline, contactPoints, callIds, tiles, meetings, tasks, cats, goals, weekFocus, weekAlt, calendars, events, conversations, chats, proactive, docs, nav, more, links, dashboardTabs, databaseTabs, lists, listsOff, hoods, customLists, outreachPerf, reporting, listings, viewers, inquiries, inbound, web, nudges };
})();
