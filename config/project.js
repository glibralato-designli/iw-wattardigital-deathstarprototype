/* Death Star — Stewart Group prospecting portal POC (Wattar Digital × Designli).
   `type` selects the default mode. ?mode=... only previews an alternative.

   Screens and flows (the review player, the canvas, and the Design Portal export all read these):
   flows:   [{ id, title, goal, entry, next: [{ flow, on }] }]       // listed in journey order
   screens: [{ id, name, path, description, flow, kind, primaryAction, states: { Name: 'preset' }, waivers: { State: 'fact' } }]
   State names use the portal vocabulary (Loading, Empty, Validation, Submitting, Error, Success, Disabled,
   Selected, Partial, Stale); any other name becomes Custom-<Name>. A preset is applied as URL parameters,
   which js/navigation.js exposes as Nav.params. See DESIGN.md, "Portal export". */
const LOCAL = 'demo data is local fixtures; nothing is fetched';
window.PROJECT = {
  name: 'Death Star',
  description: 'A calmer prospecting portal for Stewart Group: Home summarises the day, every owner carries one why now with its trust, and a call is logged in two clicks.',
  type: 'responsive-web',
  enabledModes: ['responsive-web'],
  status: 'POC · concept approved',
  systemVersion: '5b · Navy shell · Core 1.0',
  modes: {
    mobile: {
      label: 'Mobile app',
      description: 'App-first screens. A phone preview on desktop, a full-screen experience on mobile.',
      primaryViewport: { width: 390, height: 844 },
      entry: null,
      flows: [],
      screens: []
    },
    'responsive-web': {
      label: 'Responsive web',
      description: 'Responsive web, from a 390 phone to 1920 desktop. Designed at 1440 × 900.',
      entry: 'home',
      viewports: { desktop: { width: 1440, height: 900 }, tablet: { width: 1024, height: 768 }, mobile: { width: 390, height: 844 } },
      flows: [
        { id: 'start-day', title: 'Start the day', goal: 'Reach the first owner to call in two clicks, without scrolling.', entry: 'home', next: [{ flow: 'live-call', on: 'Call Daniel Marchetti' }] },
        { id: 'live-call', title: 'Live call', goal: 'Judge the why now, call, log the outcome (no answer in two clicks) and move to the next owner.', entry: 'contact' },
        { id: 'ask-brain', title: 'Ask Brain', goal: 'Explain a why now, build a list, or look up a property, with sources.', entry: 'brain', next: [{ flow: 'live-call', on: 'Open record' }] },
        { id: 'find', title: 'Find anything', goal: 'Find a contact or property by name, phone or BBL.', entry: 'contacts', next: [{ flow: 'live-call', on: 'Open record' }] },
        { id: 'plan-week', title: 'Plan the week', goal: 'See the week, add an event, review conversations and the numbers.', entry: 'calendar' }
      ],
      screens: [
        { id: 'home', name: '01 Home', path: 'pages/home.html', flow: 'start-day', kind: 'data', primaryAction: 'Open Attack Plan',
          description: 'Greeting, today’s Attack Plan, the pulse strip, metric tabs, Up next and meetings. Brain is open.',
          states: { ClassicLayout: 'layout=classic', UpNextFirst: 'lead=upnext', SidebarCollapsed: 'nav=rail', BrainMinimized: 'brain=min&ask=why', BrainClosed: 'brain=closed', GuideFlows: 'guide=flows', GuideStructure: 'guide=structure', AccountMenu: 'menu=avatar' },
          waivers: { Loading: LOCAL, Error: LOCAL, Empty: 'Home always has today’s plan' } },
        { id: 'attack-plan', name: '02 Dashboard · Attack Plan', path: 'pages/attack-plan.html', flow: 'start-day', kind: 'data', primaryAction: 'Call Daniel Marchetti',
          description: 'Today’s plan with Call next, to-dos, the week strip, goals and meetings. Day and week stepper with a date picker.',
          states: { Empty: 'called=all', PastDay: 'day=-1', FutureDay: 'day=1', Week: 'range=week', DatePicker: 'picker=1', Resolved: 'resolved=1' },
          waivers: { Loading: LOCAL, Error: LOCAL } },
        { id: 'contact', name: '03 Contact case file', path: 'pages/contact.html', flow: 'live-call', kind: 'form', primaryAction: 'Call',
          description: 'Daniel Marchetti’s record: why now with trust, the live-call bar, the outcome bar, and the record tabs.',
          states: { WhyThis: 'id=marchetti&why=open', LiveCall: 'id=marchetti&call=live', Outcome: 'id=marchetti&call=outcome', Selected: 'id=marchetti&call=outcome&choice=No%20answer', Submitting: 'id=marchetti&call=saving', Success: 'id=marchetti&call=logged', Disputed: 'id=marchetti&why=open&flag=1', Intelligence: 'id=marchetti&tab=intelligence', Ownership: 'id=marchetti&tab=ownership', Activity: 'id=marchetti&tab=activity', Details: 'id=marchetti&tab=details', History: 'id=marchetti&tab=history', NoteOpen: 'id=marchetti&note=1', DoNotContact: 'id=baum', PropertyPeek: 'id=marchetti&tab=ownership&peek=p22h' },
          waivers: { Loading: LOCAL, Error: LOCAL, Empty: 'every contact has a why now', Validation: 'the only required input is the outcome; Save stays disabled until one is picked (Outcome state)' } },
        { id: 'brain', name: '04 Brain', path: 'pages/brain.html', flow: 'ask-brain', kind: 'data', primaryAction: 'Send',
          description: 'History, the empty state with suggestions, and a centred conversation with why-now, list and lookup answers.',
          states: { Empty: 'new=1', Loading: 'ask=why&stage=thinking', Streaming: 'ask=why&stage=streaming', WhyNowAnswer: 'ask=why', ListAnswer: 'ask=list', Success: 'ask=list&approved=1', LookupAnswer: 'ask=lookup', History: 'chat=c1' },
          waivers: { Error: 'answers are scripted and always return' } },
        { id: 'contacts', name: '05 Database · Contacts', path: 'pages/contacts.html', flow: 'find', kind: 'data', primaryAction: 'Open record',
          description: 'Lists, filters and the contacts table. A row opens the peek; ⌘K finds anything.',
          states: { Loading: 'data=loading', Error: 'data=error', Empty: 'q=zzzz', Selected: 'peek=marchetti', PeekCenter: 'peek=marchetti&peekmode=center', PeekProperty: 'peek=marchetti&peektab=property', ClassAList: 'list=A', Search: 'palette=search', SearchResults: 'palette=search&pq=ludlow', SearchNoMatch: 'palette=search&pq=zzz', LogCall: 'palette=log' } },
        { id: 'properties', name: '06 Database · Properties', path: 'pages/properties.html', flow: 'find', kind: 'data', primaryAction: 'Open property',
          description: 'The properties table. A row opens the property peek.',
          states: { Empty: 'q=zzzz', Selected: 'peek=p118', PeekOwner: 'peek=p118&peektab=owner', Loading: 'data=loading', Error: 'data=error' } },
        { id: 'property', name: '07 Property record', path: 'pages/property.html', flow: 'find', kind: 'data', primaryAction: 'Call owner',
          description: '118 Ludlow St: key facts, why now with distress signals, Overview (building, units, debt, sale, zoning), Violations, Ownership, Deals, Evidence, and the owner rail.',
          states: { Evidence: 'id=p118&tab=evidence', Violations: 'id=p118&tab=violations', Ownership: 'id=p118&tab=ownership', NoDeals: 'id=p118&tab=deals', MixedUse: 'id=p155d&tab=violations', PortfolioProperty: 'id=p22h' },
          waivers: { Loading: LOCAL, Error: LOCAL, Empty: 'every property has an owner and facts' } },
        { id: 'calendar', name: '08 Dashboard · Calendar', path: 'pages/calendar.html', flow: 'plan-week', kind: 'form', primaryAction: 'New event',
          description: 'Day, week and month. A click on a slot drops a draft with an inline card; New event opens the full dialog.',
          states: { Day: 'view=day', Month: 'view=month', Selected: 'event=0-6', Draft: 'draft=1', NewEvent: 'dialog=new', Validation: 'dialog=new&clash=1', Success: 'added=1' },
          waivers: { Loading: LOCAL, Error: LOCAL, Empty: 'the week always has events', Submitting: 'saving an event is instant and confirmed by a toast (Success)' } },
        { id: 'conversations', name: '09 Dashboard · Conversations', path: 'pages/conversations.html', flow: 'plan-week', kind: 'data', primaryAction: 'Conversation',
          description: 'A Monday to Friday board plus Proposals. Connected calls from the case file land on today.',
          states: { Empty: 'week=1', PreviousWeek: 'week=-1', NewConversation: 'dialog=new' },
          waivers: { Loading: LOCAL, Error: LOCAL } },
        { id: 'outreach-performance', name: '10 Dashboard · Outreach performance', path: 'pages/outreach-performance.html', flow: 'plan-week', kind: 'info',
          description: 'Display-only: Outreach, Business generation and Workflow efficacy. Conversations carry the emphasis.' },
        { id: 'reporting', name: '11 Dashboard · Reporting', path: 'pages/reporting.html', flow: 'plan-week', kind: 'info',
          description: 'Display-only: coverage by ZIP on the navy ramp, outreach, the marketing funnel and engagement.' },
        { id: 'listings', name: '12 Dashboard · Listings', path: 'pages/listings.html', flow: 'plan-week', kind: 'info', primaryAction: 'Open a viewer',
          description: 'Listing cards with five counters, who viewed them (rows open the contact), inquiries and inbound requests.' },
        { id: 'web-analytics', name: '13 Dashboard · Web analytics', path: 'pages/web-analytics.html', flow: 'plan-week', kind: 'info',
          description: 'Display-only: four numbers, visitors per week, and what the numbers say.' }
      ]
    }
  }
};
