# Phosphor Icons

Official @phosphor-icons/core 2.1.1, MIT license (LICENSE).
Source: https://github.com/phosphor-icons/core
Catalog: https://phosphoricons.com/

icons.svg is a local SVG sprite containing the starter selection in regular, fill, and duotone. It is a subset, not the full catalog. To add an icon, copy its exact SVG children from the same official package into a symbol with id NAME-WEIGHT, viewBox="0 0 256 256", fill="currentColor", and stroke="none". Preserve opacity on duotone paths. Do not redraw library icons.

Usage from a root HTML page:
<svg class="icon ph-icon" aria-hidden="true" focusable="false" viewBox="0 0 256 256"><use href="assets/phosphor/icons.svg#house-regular"></use></svg>

From pages/, use ../assets/phosphor/icons.svg. Choose regular, fill, or duotone. Label icon-only controls on the button or link, not the decorative SVG. No runtime CDN or JavaScript is required.

Browser compatibility: rendered icons use inline official SVG paths, not external SVG use references. The sprite remains the canonical icon source. Run `python3 tools/sync_icons.py` after adding symbols or icon markup. It updates HTML icons marked data-phosphor="NAME-WEIGHT" and generates js/phosphor.js for the review menu. The regular project check verifies synchronization.
