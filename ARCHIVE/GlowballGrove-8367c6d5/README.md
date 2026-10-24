# Glowball Grove
Inspiration image: 8367c6d5

A moonlit beetle rolling playground. Follow the golden path, bowl through timber, gather fireflies and plant a luminous garden. Six botanical branches offer 48 persistent upgrades. Garden production includes up to eight hours offline. Quick roll offers repeatable 90-second downhill sessions with a saved best score.

Serve `dist/` with any static HTTP server and open `index.html`. The only runtime dependency is Three.js **0.170.0**, imported from the pinned jsDelivr URL; internet access is needed for this import. There are no application requests, accounts or analytics.

Controls: **WASD** roll, **Shift** surge, **Space** hop, **E** plant (30 glow), **Tab** research. Drag the mouse to orbit; arrow keys also steer/turn. Touch buttons and basic gamepad stick/surge support are included. Use the top buttons for quick roll, sound and graphics presets. Garden saves automatically in localStorage.

Build: `npm install` then `npm run build`. This copies source to `dist/` and creates an ignored `.dev/` build. Production strips the development bridge and FPS overlay. Serve `.dev/?test` to expose `window.__grove` (state, player, teleport, give, fps). `npm test` runs the three-minute Playwright session; install Chromium with `npx playwright install chromium` if needed. Test artifacts and node_modules are ignored locally.

Verification: 180-second headless playthrough, zero console errors; direct-input startup **3.6 seconds**. Low averaged **11.3 FPS in software WebGL** (capture stalls included). Results and screenshot comparison: [TESTING.md](TESTING.md). Headless software rendering does not establish 60fps on laptop hardware. Touch, physical gamepads and long-term progression balance have not been manually tested.

Shortcuts: custom heightfield rolling rather than a rigid-body engine; procedural art rather than painted textures; timber is the main destructible prop, while cottage/tree remain landmarks. Tracks are a bounded visual pool, not saved terrain deformation. Branches are independent tier ladders rather than prerequisite graphs. Root grip helps climbing; the canopy uses a simplified collision ramp. No ball splitting, automated multi-garden beetles, root-network simulation or background music yet.

Three changes most likely to improve fun:
1. Add banked courses, jump chains and speed-sensitive score multipliers.
2. Add ball splitting and autonomous beetles linking garden production.
3. Add destructible stone walls, physical cottage props and persistent carved tracks.
