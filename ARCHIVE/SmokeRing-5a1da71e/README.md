# SMOKERING
Inspiration image: 5a1da71e

A playable 3D woodland village defense toy. Fly above pointed timber roofs, lob giant embers at crawlers, and build a ring of automated defenses around the smoking hearth. Starts immediately; Quick Siege offers an accelerated ten-minute run.

Serve this directory with `npm run dev`, then open localhost:8080. Production: serve `dist/`. Requires WebGL and an initial connection for the pinned Three.js **0.169.0** jsDelivr module; no gameplay network requests, accounts or analytics. Audio is synthesized. Village currency and upgrade tiers save locally.

- WASD: roam. Space: burst flight. Shift: dash.
- Mouse: ground aim; hold left button: fire. Nearby targets receive aim assistance.
- 1–4: build/upgrade the nearest socket within 15m. Harpoon / mortar / slowing smoke / scrap collector.
- R: repair hearth and rebuild destroyed structures. U: toggle forge.
- Forge buttons: permanent upgrades. Summon Wave starts the next cleared wave; waves also start automatically.
- Quality selector: Auto / Low / Med / High. Audio toggle at top right.

`npm install && npm run build` rebuilds the committed static files. `npm test` runs the Playwright three-minute low-preset playthrough and saves screenshots/metrics under ignored `test-output/`. Install Chromium with `npx playwright install chromium` if needed. Source-only `?dev` exposes `window.__SMOKE_TEST__` (teleport, currency, upgrade/build, aim, fire, state and FPS); build removes the entire development block.

## Scope and shortcuts
Procedural geometry and synthesized sound throughout. Static geometry is batched by material and debris is pooled/instanced; enemies have a population constrained by wave size. Terrain and large surfaces use world-space triplanar grain. Every hut and railing assembly is destructible; main walkway planks remain stable, so bridge-gap routing and full structural physics are approximated by slowing crawlers near surviving huts. Enemies are grouped articulated silhouettes, without skeletal animation or crowd LOD. Expansion currently adds canopy platforms at Outer Reach tier three; the flooded hollow is not implemented. The eight-tier branches scale power, flight, volley count, tower cadence, repair and income; piercing and true tower-to-tower linking are approximated by damage and cadence. Quick Siege shares permanent tiers but does not save its earnings; its final attacker arrives at ten minutes. Touch can fire and lift, but keyboard/mouse is the intended input. Gamepad is not implemented.

## Three changes to improve fun
1. True bridge collapse and enemy rerouting, plus rebuild previews.
2. Distinct aerial threats and a climbing giant with breakable armor.
3. More dramatic tier-three/six weapon transformations and a flooded outer region.

Validation results and image comparison are recorded in TESTING.md. Laptop integrated-GPU, touch, gamepad, and a full thirty-minute balance session were not tested.
