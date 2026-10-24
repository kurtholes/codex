# The Carbs of Destiny
Inspiration image: d397f2e8

A third-person demolition playground beneath a floating sourdough. Hook floors, let the dough stretch, then yank buildings into cascading failure. Spend grain across 24 fermentation upgrades. Plant cultures for passive income; elasticity opens the root ascent. Collapse Run offers a 90-second central-tower challenge with instant retry.

Serve this directory over HTTP (`npm run serve`) and open `http://localhost:8080/dist/`. The root index is the development version. Three.js is pinned to **0.170.0** on jsDelivr; loading needs that CDN, with no other runtime requests, accounts or analytics. Audio is synthesized. Main progression saves in localStorage.

Controls: WASD move, mouse look (click to capture), left click hook, right click/E yank (again to hurl a swinging floor), Space leap, Shift sling/sprint, C plant culture (60 grain), Tab mutations, Escape release mouse. Touch taps alternate hook/yank; keyboard and mouse are the intended controls. Graphics selector provides auto/low/medium/high.

Build: `npm install`, then `npm run build`. This copies static files into `dist/` and strips the development test block. No bundler or runtime packages beyond Three.js. No deployment workflow.

Verification: `npx playwright install chromium`, then `npm test`. The tests start a private HTTP server on an available port. The test performs three minutes of real-time low-preset demolition, captures 0s/30s/3min/first-upgrade images, checks saving and mode switching, and verifies production has no test API. Dev-only `?test` exposes `window.__game` with state, teleport, currency, upgrades, hook/yank and an FPS overlay. Output lives in ignored `test-output/`. Run `npm run test:checks` for upgrade UI, movement, jump, colony income and quick-play victory assertions. Final run: 8.91s first action, 78 floors, zero console errors; low-preset software rendering averaged 1.35 FPS. Laptop GPU performance is unverified. See [TESTING.md](TESTING.md) for reports and visual comparison.

Shortcuts: bespoke arcade floor physics rather than a general rigid-body engine; auto-targeting within a forward cone; floor rewards absorb instantly; colonies last for the current visit; major arm mutations share a procedural shape; city rubble does not reconstruct saved destruction. No authored music, enemy AI, gamepad mapping or interior cavern. Armor affects quick-play impact damage. Low/medium/high change render resolution and fog rather than asset sets.

Three improvements most likely to improve fun:

1. Give swung floors richer mass, collision response, and directional aiming.
2. Give each district distinct break patterns and active threats.
3. Add hand-shaped loaf caverns and more expressive arm mutation meshes.
