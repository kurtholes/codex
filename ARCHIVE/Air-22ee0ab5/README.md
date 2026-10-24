# AIR
Inspiration image: 22ee0ab5

A first-person alien survival homestead. Crack frozen cargo, cultivate oxygen algae, and grow a warm refuge across a cold blue-gray landscape. Main progression saves locally; Quick Expedition lends equipment for a separate ten-minute salvage run.

Serve `dist/` with any static HTTP server. Three.js **0.170.0** loads from jsDelivr; this is the only external runtime request. No accounts, analytics, or game-data networking. Audio is synthesized after interaction.

Controls: click to capture mouse; WASD move, mouse look, hold left click cut, Shift sprint, Space jump (hold with vector jets), E cultivate near home, Q upgrades, Esc release mouse. Gamepad sticks and trigger provide basic movement/aim/cutting. Quality and sound controls are at top right. Shelter restores air; exhaustion automatically tethers home with a 10% salvage loss. Six branches each have six permanent tiers. Algae generates salvage every five seconds. Upgrades include cutter reach, air economy, jump jets, rover-speed travel, crop yield and automation.

Build: `npm install`, then `npm run build`. The build copies static files and strips the source-only development hooks. Serve the folder with `python3 -m http.server 8222`; `npm test` runs Playwright against that server (Chrome expected at `/usr/bin/google-chrome`). All dependencies and transient test output are ignored locally. No deployment workflow.

Verification: test harness exercises cutting, shelter returns, planting and first cutter upgrade across 180 seconds of fixed-step simulation; captures 0s, 30s, 180s and upgrade screenshots; checks production has no test state access. Presentation FPS is measured separately in headless Chrome. Detailed results and image comparison are in `VERIFICATION.md`. Source-only `src/?test=1` exposes teleport, currency, state, simulation stepping and FPS. Production strips these hooks entirely.

Shortcuts: procedural low-poly shapes, synthetic sounds, visual terrain without rigid-body collisions, automatic inventory transfer, tool tiers share one silhouette, rover is a speed upgrade rather than a vehicle model. Winch is represented by mobility improvements and emergency return. Pipeline tiers expand the home's air radius rather than building player-routed pipes. No touch interface. No full laptop hardware benchmark or long-term 30-minute balance test.

Three improvements most likely to improve fun:
1. Placeable satellite greenhouses and physical air hoses for planning longer circuits.
2. Distinct magnetic winch and drivable heated rover with cargo handling.
3. More reactive farming: nutrient choices, growth animations and weather-driven crop behavior.
