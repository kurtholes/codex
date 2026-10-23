# Storm Dodger
Inspiration image: 1542e36e

A third-person prairie destruction toy. Taunt a horned storm, dodge its charge, and redirect it through a frontier ranch. Play persistent Free Roam or a two-minute One Charge score attack. Forty-eight upgrade tiers expand movement, style, storm size and storm riding. Progress saves in localStorage.

Serve `dist/` with any static HTTP server. Internet access is needed only for the pinned Three.js 0.170.0 jsDelivr module. No accounts, telemetry, remote audio or application requests.

WASD moves; Space dives; E taunts; Tab opens upgrades; Q glides at Rider II and mounts the storm at Rider V. Drag the mouse to orbit. Sound starts with a gesture; the top-right button mutes it. Gamepad left stick / A / X and right stick are supported. Touch drag moves; ↯ dodges and ⚑ taunts. Quality can be selected at any time.

Build: `npm install` then `npm run build`. The build copies the three static files into `dist/` and removes development hooks. Development: serve this folder with `python3 -m http.server 8080`. `src/?test` on the source version exposes `window.__storm` with teleport, currency, purchase, state, simulation-step and quality controls plus FPS. These hooks are absent from production.

Test: `npx playwright install chromium`, then `npm test` (the harness starts its own local server). The script plays for three real minutes using movement and timed dodges, purchases an earned upgrade, captures 0s / 30s / 180s / first-upgrade screenshots, then checks storm-riding unlock, score-attack completion and production hook removal. Test output and node_modules are ignored. The final run passed: 21 perfect dodges, 20 structures destroyed, no console errors; Low averaged 9.02 FPS in SwiftShader. The 60 FPS integrated-GPU target is unverified. See TESTING.md and verification/ for results and captures.

Shortcuts: custom ballistic debris approximates physics; cloud lobes approximate volumetric weather; prairie is mostly flat and destructible structures use a small modular kit. Storm tiers currently scale and multiply bulls rather than implementing distinct elemental attack patterns. Upgrade branches use continuous stat growth rather than 48 unique animations. Regions are open spatial neighborhoods rather than separately streamed maps. No prestige resets.

The three changes most likely to improve fun:
1. Give hail, ember and storm-king bulls distinct readable attacks.
2. Add directional cape flicks and steerable flank grapples between dodges.
3. Expand building collapse chains with windmills, tanks and connected rail cars.
