# GLYPHRUNNER
Inspiration image: 49e8ed3f

A playable third-person stone labyrinth: sprint, vault, smash passages and awaken eight beacons. Forty permanent upgrade ranks span five branches. Progress autosaves in localStorage. Quick Escape offers a one-life timed fog run toward the second beacon.

Serve this folder over HTTP and open `dist/index.html`. Three.js **0.170.0** loads from jsDelivr; internet is required for that pinned engine import. There are no other runtime dependencies, telemetry, accounts or service calls. Sound uses Web Audio synthesis after interaction.

- WASD: move; Shift: sprint; Space: vault.
- Click: charge; drag: camera; E: glyph upgrades.
- Thread rank 2: Q tether leap. Ward rank 2: F stomp.
- Grace rank 3: chain vault; rank 4: wall-running.
- Quality button: Auto / Low / Med / High.

Build: `npm install`, then `npm run build`. The static build is checked in under `dist/`. `npm run dev` serves port 4189. Development only: `/src/index.html?test` exposes teleport, currency, state and FPS through `window.__game`; build strips this block. `npm test` requires `npx playwright install chromium` and starts its own local server (stop any existing server on 4189 first). Screenshots and machine reports go to ignored `test-output/`.

A 194-second assisted headless run broke 52 walls, awakened 8 beacons and passed save reload and production API checks with zero console errors. First movement: 3.84 seconds. SwiftShader throughput was about 4.4 FPS; the 60 FPS hardware target remains unverified. Testing results and visual comparison are recorded in `VERIFICATION.md`. The automated route uses keyboard movement and charges plus development teleports between combat/navigation checks; it does not establish that a human can navigate every route. Laptop GPU, gamepad, touch and a full 30-minute economy balance pass have not been tested.

Shortcuts: procedural masonry and character geometry; no rigged animation; synthesized one-shot sounds; temporary instanced rubble represents collapses and traversable ramp regions. Tether is an assisted leap rather than a rope simulation. Regions are visual neighborhoods rather than separately gated levels. Quick mode reuses the central maze; fog adds deadline pressure rather than physically sealing corridors. This is a compact playable prototype of the larger design.

The three changes most likely to improve fun:
1. Hand-tune linked charge/vault routes with more vertical shortcuts.
2. Add guardian attack tells, a timed parry and distinct enemy behaviors.
3. Build a dedicated compact quick-play generator with shifting fog gates and random ability drops.
