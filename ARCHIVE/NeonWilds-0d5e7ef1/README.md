# Neon Wilds
Inspiration image: 0d5e7ef1

A playable third-person midnight garden: skate golden leaves, prune orange shoots for sap, graft equipment, and connect pink pins to mint grind routes. Quick Run provides a 90-second score session with upgraded gear; R retries instantly. Main garden upgrades and connected routes save in localStorage.

## Play
Serve `dist/` with any static HTTP server, then open `index.html`. Internet access is required for the pinned Three.js **0.170.0** module from jsDelivr; there are no game service calls, accounts or analytics.

- W/S accelerate/brake; A/D steer. Arrow keys also work.
- Space jumps. Shift or left click sweeps shears.
- E attaches to a nearby rail; E or Space dismounts.
- U opens/closes grafts. Click a branch to buy a tier.
- Hold right mouse and drag to turn.
- G grapples toward a pin after spring tier 3.
- Wheel tier 3 enables boundary wall carving; rail tier 3 enables held-Space catapult jumps.
- Quality menu: automatic, low, medium, high. Music-note button mutes synthesized SFX.

## Build and checks
`npm install` then `npm run build` copies the static entry and strips marked development blocks into `dist/`. No bundler or runtime dependency beyond Three.js. Source is `src/`; build script uses Node built-ins.

For the automated browser run, install Chromium with `npx playwright install chromium`, serve this folder on port 8097 (`python3 -m http.server 8097`), then `npm test`. The test runs for three minutes on low quality, steers and cuts shoots, buys three wheel tiers, and writes screenshots plus JSON metrics to ignored `test-output/`. Source-only `src/?test` exposes teleport, currency, state and FPS tools. Production contains none of those hooks.

## Scope and tradeoffs
Procedural modeled leaves, hollow trunks, petal crowns, pins, board and explorer preserve the reference palette and botanical silhouette language. Large surfaces use world-space triplanar grain. Shoots and debris are instanced; quality presets adjust rendering resolution. There are 28 purchasable graft tiers across four branches.

This is a compact traversal prototype. Cut spires tip instantly into visual logs rather than rigid-body bridges; leaves have simplified height-field collision. There is no touch/gamepad support, bird perching, underground district, full plant-growing editor or postprocessing bloom. Automated tending grants passive sap. Destruction resets on reload while progression persists. Quick Run shares the open garden rather than a separate bespoke downhill course. No prestige resets.

The three strongest fun improvements:
1. Shape a continuous downhill ribbon with banked turns, trick scoring and a ghost replay.
2. Add bending stems and physical fallen-spire bridges, plus editable planted shortcuts.
3. Build flower-crown and rootway districts with bird perches and distinct traversal rewards.

See `TESTING.md` for measured results and visual comparison, `DESIGN.md` for the design, and `ASSETS.md` for replaceable procedural assets.
