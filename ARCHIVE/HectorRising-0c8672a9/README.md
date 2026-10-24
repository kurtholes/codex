# Hector Rising
Inspiration image: 0c8672a9

A sunset aerial demolition toy in a sprawling sea fortress. Enter immediately, blast the banner tower, catch salvage, and grow six eight-tier upgrades. Quick Raid provides a five-minute powered loadout. Main progression saves in localStorage.

Serve `dist/` using any static HTTP server. Three.js is pinned to **0.170.0** on jsDelivr; that single library request requires internet. There are no gameplay network requests, accounts or analytics.

Controls: WASD fly, mouse aim, click fire, Space rise, Ctrl descend, Shift boost, E forge. Click the world to capture the mouse; Escape releases it. Low/medium/high quality selector is at bottom right.

Build: `npm install`, then `npm run build`. Source lives in `src/`; the committed static output is `dist/`. Build strips the developer test block. Development: serve `src/`, append `?dev` for FPS and `window.__game` (teleport, currency, upgrades, aim, fire and state).

Test: `npx playwright install chromium`, then `npm test`. The three-minute headless run produces ignored screenshots at 0s, 30s, 180s and an upgrade, plus a JSON report in `test-output/`. The harness uses teleport-assisted aiming and grants 1,000 salvage for the purchase check; ordinary salvage collection also runs. It records browser interruptions and resumes if the shared runner closes Chromium. `node smoke.mjs` checks the production build and quick-play controls. See VALIDATION.md for recorded results.

Shortcuts: platform destruction uses a shared support health pool and a rigid falling group, rather than per-joint physics. Bridges are decorative and cannot sever. Roofs use layered procedural geometry. Chain blast widens splash damage; penetration increases siege damage. Flight tiers increase speed, lift and endurance; grapple and underwater exploration are not implemented. No gamepad or touch controls. The optional rival encounter and full audio ambience are future work. No external art assets; replacement briefs are in ASSETS.md.

The three changes most likely to improve fun: connected per-beam destruction with rope severing; weapon variants that ricochet and drill; aerial rivals that pressure the player between salvage runs.
