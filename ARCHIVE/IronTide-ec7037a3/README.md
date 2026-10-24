# IRON TIDE
Inspiration image: ec7037a3

A playable 3D steam-tug demolition harbor. Rip the opening crane off its pier, tow wreck machinery into the cyan foundry, and grow a brutal little tug beneath the crowned queen. Quick Play provides fully upgraded rigs and repeating three-minute score sessions.

Serve `dist/` with any static HTTP server, for example `python3 -m http.server 8080 --directory dist`, then open localhost:8080. The pinned Three.js 0.169.0 jsDelivr module needs internet access on first load. No application APIs, accounts, analytics or remote audio.

- WASD / arrows: drive and steer. Reverse to strain a hooked seam.
- Space: hook nearest highlighted machinery / release.
- Shift: steam boost. Mouse drag: orbit camera.
- E: refine nearby free salvage at the cyan foundry.
- U: shipyard; buy eight tiers in each of six branches.
- Q: dive after rig IV. Rig II crawls rail beds; rig VI climbs upper terraces automatically.
- Shipyard rig selector: balanced, torque or speed profile.
- Gamepad: left stick helm, A hook, right trigger boost. Keyboard is needed for refining and upgrades. Touch is not implemented.

Progress saves locally every ten seconds and on purchases/deliveries. Restoring a foundry costs 600 Fe and adds capped offline production. Quick Play retains the main save and offers resettable wreck formations.

Build: `npm install`, then `npm run build`. Source is plain HTML/CSS/JS. The build copies static files and strips the development test block. No deployment workflow. Test: `npm test` (install Chromium with `npx playwright install chromium` first). Screenshots and the detailed machine report go into ignored `test-output/`; see TESTING.md for results. Source-only `?test` enables state access, teleport, currency grants and an FPS overlay via `window.__IRON`; production has none of these.

Test result: a 188.74-second assisted browser run reached first action in 2.20 seconds, broke 10 assemblies, completed eight deliveries and logged zero console errors. All 48 tiers and traversal modes passed additional checks. Low preset averaged 6.01 FPS under shared SwiftShader software rendering; the 60 FPS laptop target remains unverified. Captures at load, 30 seconds, three minutes and the first major upgrade are in ignored `test-output/`.

Shortcuts: spring-based towing and break thresholds replace a full rigid-body solver. Ships are procedural silhouettes; the queen uses shaped lathed dress geometry, anatomical meshes, wire hair and crown spikes. Broken machinery tips as an assembly and scatters instanced fragments rather than dynamically fracturing every triangle. The harbor has finite salvage and three traversal terraces, without NPC traffic, contract UI, reconstruction placement or a single-pull challenge editor. Rig profiles are scalar tradeoffs. Automation increases yield; foundry restoration provides passive income. Upgrade dependencies are lightweight. The camera can be occluded by large wreck hulls. No music, custom imported models, touch interface or comprehensive accessibility pass.

The three changes most likely to improve fun:

1. Give the cable real wrapping and multiple anchor points so swinging wreckage becomes a precision skill.
2. Author larger collapsible dock chains with replayable single-pull challenges and best-score ghosts.
3. Add moving salvage barges and bespoke dive/rail districts with traversal-specific demolition.
