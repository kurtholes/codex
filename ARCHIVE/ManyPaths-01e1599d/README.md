# The Many Paths
Inspiration image: 01e1599d

A third-person mirror-ocean traversal toy. Start already running, carve luminous routes, shatter crystals, bank light in golden crossroads, and invest in a 48-tier constellation. Quick Crossing offers a separate timed one-life route.

Serve this folder (`npm run dev`) and open http://localhost:8080. The committed `dist/` is the production static build; serve it through any static HTTP server. Three.js 0.170.0 loads from the pinned jsDelivr CDN, so the initial library load requires internet. There are no service calls, accounts or analytics.

- WASD / left-right arrows: steer, W accelerates, S slows.
- Space: leap; Wings II adds a second jump.
- F / down arrow: slam. Shift: surge.
- E: bank anywhere; golden halos bank automatically.
- Tab / constellation button: upgrades. Escape: pause.
- Mouse drag: steer. Touch tap: jump; double tap: slam.
- Basic gamepad: left stick, A leap, right trigger surge.

Progress saves locally. Audio starts muted; use the music-note button. Low/medium/high pixel-density presets and hardware-based automatic selection are available.

Build: `npm install` then `npm run build`. No bundler or runtime dependencies beyond Three.js. Build strips development hooks. Test: serve source on port 8080, install Playwright Chromium (`npx playwright install chromium`), then `npm test`. `?dev=1` exposes teleport, give, buy, bank, movement state and an FPS overlay in source only. Test output and node_modules are ignored.

Validation captures and measurements are described in TESTING.md. The automated test drives the core loop for three real minutes, captures opening/30s/180s/first-upgrade views, checks quick-play entry, and confirms production has no test state. Physical gamepad, touch hardware, integrated-GPU performance and a 30-minute balance session were not tested.

Shortcuts: reflections are a procedural sunrise approximation and submerged mountain silhouettes, not full scene reflections. Ruin arches and mountains remain static; crystals break into pooled instanced debris. Ribbons are visual routes rather than rail collision constraints. Tether upgrades provide aerial control and low gravity rather than a physical rope. Elevated shelves share the mirror sea map; no separate underwater region. Quality presets primarily change resolution. Ghosts follow sampled routes. Quick Crossing uses seeded movement variations but a common three-way layout. No offline vendored Three.js.

Three changes most likely to improve fun:
1. Add magnetic ribbon grinding, banked corners and skill-based speed rewards.
2. Add physical tether anchors, wall runs and cascading arch collapses.
3. Handcraft landmark circuits with layered mastery rewards and distinctive late-game movement spaces.

Measured browser result: first movement 0.39s; three-minute endurance run completed with four routes, one upgrade and zero console errors. Low preset averaged 32.9 FPS under headless software WebGL (not a hardware 60 FPS claim). Save/reload, quick-play win/loss and stripped production hooks passed. See TESTING.md for caveats and capture paths.
