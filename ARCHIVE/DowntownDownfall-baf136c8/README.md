# Downtown Downfall
Inspiration image: baf136c8

A playable 3D flight and demolition sandbox: pilot a hooded plasma rig through a copper-planet metropolis, fire slow shells through stacked towers, collect salvage and grow six eight-tier upgrade branches. Campaign saves locally. Quick Run starts upgraded and ends after three minutes.

## Play
Serve this folder with `npm start`, then open `http://localhost:8080/dist/`. Source lives in `src/`; the ready static build lives in `dist/`. Three.js **0.170.0** loads from the pinned jsDelivr URL; that initial library request requires connectivity. There are no gameplay network calls, accounts or analytics.

- WASD / arrows: fly; Space: rise; C / Ctrl: descend.
- Shift: boost; hold right mouse: look; left mouse / F: fire.
- E: workshop; 1–6: purchase branch tiers; E: resume.
- Quick Run button: instant airborne score run. Campaign button returns to your save.
- Graphics dropdown: automatic / low / medium / high. Music-note button toggles synthesized sound.
- Basic gamepad support: sticks move/look, right trigger fires, A rises. Keyboard and mouse recommended.

## Build and verify
`npm install` then `npm run build`. Build uses Node’s standard library and strips the development block. No bundler or runtime dependency beyond Three.js. `npm start` serves files only; it does not build.

For automation, install Chromium with `npx playwright install chromium`, then run `node test.mjs`. The test starts its own temporary local server. Outputs go into ignored `test-output/`. Source-only `src/?test` exposes teleport, currency, purchase, aim, fire, quick-run and state hooks, with an FPS overlay. Production removes those hooks even with `?test`.

Validation results and screenshots are recorded in `verification/`. The completed run measured 6.34 seconds to first action, 23 collapsed towers, 153,330 damage and zero console errors. Low averaged 7.43 FPS (minimum 4.99) in 960×540 headless Chromium with SwiftShader; the 60 FPS target remains unverified on an actual laptop GPU. Quick-run expiry and production cheat removal passed; a separate smoke check confirmed immediate firing after replay and upgrade purchases. Automated coverage exercises movement, firing, tower collapse, salvage, purchases, quick mode for three real minutes, screenshot capture and production-hook removal. Syntax and static build were checked. Browser console errors are captured. Software-rendered headless FPS is measured, not a claim about real laptop GPU performance. Physical laptop GPU, gamepad hardware, mobile/touch and a 30-minute balance session were not tested.

## Shortcuts
Chunk debris uses ballistic motion and ground bounce rather than rigid-body collision solving; it can hit drones. Buildings use stacked slabs and instanced facades rather than fractured meshes. Reflections are rough metal lighting and emissive asphalt ribbons, not screen-space reflections. Drone attacks use direct proximity damage and sparks. Flight upgrades continuously improve the rig rather than locking districts behind gates. No touch UI, weather simulation or full music track. The procedural skyline is deliberately lighter than the image’s dense architectural detail.

## Three improvements for fun
1. Add aimed, dodgeable drone projectiles and specialized enemies that reward shell surfing.
2. Add shearable skybridges and physics-driven tower-to-tower collapse chains.
3. Give each upgrade milestone a distinct firing/movement ability and tune a full 30-minute campaign on real hardware.
