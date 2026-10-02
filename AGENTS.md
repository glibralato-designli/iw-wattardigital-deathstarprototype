# Project rules
- Read PRODUCT.md, DESIGN.md, and config/project.js before changing screens.
- Check direction status in DESIGN.md. Start in concept exploration: create representative screens from the brief, brand, audience, and content while freely adapting the shared design system. Existing styles are editable starting points, not constraints. Mark the direction established only after the user approves the concept.
- Keep screens, flows, and business rules within PRODUCT.md and the requested scope; do not add speculative product features.
- Once established, new screens inherit that identity, tokens, recipes, and interaction patterns. Vary composition for content; do not introduce a new visual style or duplicate controls per screen. Changing the established direction requires an explicit redesign request.
- Extend only for a clear unmet content, interaction, or accessibility need. Routine coherent extensions need no extra approval. Update DESIGN.md, CSS/behavior, and system.html together for core changes; run token sync after token edits.
- Use semantic color roles, including multiple brand palettes when appropriate. Keep brand colors separate from status meanings and action hierarchy. Verify contrast in both themes.
- During concept exploration, freely replace or add shared text styles, fonts, weights, line heights, letter spacing, colors, spacing, and component recipes. Change the shared foundation rather than accumulating local overrides. Keep DESIGN.md, tokens, CSS, and system.html synchronized. The starter inventory is not a ceiling. After approval, use the consolidated project styles consistently.
- Use Phosphor Icons (local SVG sprite in assets/phosphor/) for interface icons. During concept exploration, freely choose regular, fill (filled), or duotone by visual purpose. Intentional combinations, such as regular navigation and filled active states, are allowed. After approval, record the rules in DESIGN.md and keep them consistent. Add needed icons from the official library; the bundled selection is not a limit. Preserve duotone opacity and accessible labels on icon-only controls. Render official SVG paths inline for browser compatibility. Run python3 tools/sync_icons.py after changing the icon source or usage; checks enforce synchronization. See assets/phosphor/README.md for usage.
- Surface is treatment only. Compose layouts appropriate to content; avoid wrapping everything in cards.
- Keep complex product patterns in css/product.css and js/product.js, even when repeated locally.
- Product pages must never import prototype/ CSS or JS. Keep the review layer isolated.
- Respect the selected project type: app-first mobile versus structurally responsive web.
- Preserve semantic HTML, accessible labels, keyboard behavior, safe areas, and adequate touch targets in every visual direction.
- Keep HTML, plain CSS, and small vanilla JS files. No framework or build dependency without a concrete project need.
- Before completing any change, check whether it affects shared styles, the design-system showcase, or documented product/review behavior. Update the relevant implementation, DESIGN.md, system.html, PRODUCT.md, README.md, and validation notes as applicable without waiting for a separate documentation request. Keep prose aligned with actual behavior; distinguish historical checks from current verification. For token changes, edit the canonical definitions in DESIGN.md, run `python3 tools/sync_tokens.py`, then run `python3 tools/check.py`. Purely screen-specific changes do not require unrelated documentation edits.
- Run python3 tools/check.py and verify relevant screens at mobile and desktop widths before delivery.

- Preview with `python3 tools/preview.py` to disable caching and reload changed files, including embedded screens. After shared-style changes, verify computed styles in both the system showcase and a product screen when one exists. Keep the reload helper server-injected; never add it to product source.

## Starting a real project
- Before adapting a project copy, establish its type from the user's instructions or brief. If unspecified, ask: “Is this project a mobile app, a responsive web app, or both?” Wait for the answer before mode-specific setup; do not treat the template's default mode as the user's choice or ask again when the choice is already clear.
- Record the choice in PRODUCT.md and config/project.js: set enabledModes to ['mobile'], ['responsive-web'], or both, and type to an enabled default mode. Keep both mode configurations and both home cards. The unused card stays visible, greyed out, with disabled Prototype and Canvas links; never remove it. Leave the Design system card active. enabledModes: null means the project type is undecided, so both cards remain active.
- Both manifests start empty. Create independent screens in pages/ and register IDs, paths, descriptions, and entry in config/project.js. Also give every screen its `flow`, `kind`, and extra `states` (with presets) and any fact-based `waivers`, and list the flows in journey order; see DESIGN.md, "Portal export". Preserve user-created work, the shared foundation, showcase, and review tools. Empty manifests must remain usable.
- Project setup applies to a project copy. Maintaining the master template must not trigger the project-type question. The master has no sample product screens.

## Concept approval and consolidation
- Design a few representative screens before expanding the full product. Let real content and references determine hierarchy and composition; freely restyle or replace starter components where useful. No separate concept stylesheet is required.
- Iterate with the user. Concept approval is the gate to consolidation; do not infer it from passing checks or finishing implementation. Do not ask again if the user already explicitly approved the concept.
- After approval, preserve the approved appearance and behavior while consolidating shared tokens, text styles, components, and interaction patterns. Remove unused starter choices after checking references. Update DESIGN.md and system.html, and mark the direction established with approval context.
- Expand using the established system. Make coherent extensions for actual unmet needs, and check screens with different content densities and relevant loading, empty, error, and success states. Broad visual changes require a redesign request.

## Screens, states, and the Design Portal
- A state is a preset, not a one-off toggle: when a screen shows a distinct situation (a tab, an open sheet, an error, an empty list), make it reachable from URL parameters read through `Nav.params`, and declare it in the screen's `states`. The player, canvas, and portal export all use the declaration.
- Every move between screens is a real link. Script-driven moves use `Nav.go('page')` or `Nav.replace('page')` with a hidden `data-routes` link for that destination; timed moves use `Nav.advance(fn, ms)`; images a script sets use `Nav.asset(path)`. Never build a screen URL as a string.
- Product pages load `js/navigation.js` after `js/theme.js` and before `js/product.js`.
- Never edit `design/flows/**/*.html`, `design/prototype.json`, or `design/export-stamp.json` by hand: `tools/export_portal.py` regenerates them. Uploading to the portal goes through `/discovery-design-export`, which exports first; a project hook blocks the plugin's publish while the export is stale.
- Client copy edits pulled from the portal are applied to the source (`pages/`, `js/product.js`), never to the exported files.
