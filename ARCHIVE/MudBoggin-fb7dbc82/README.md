# Mud Boggin
Inspiration image: fb7dbc82

A first-person 3D ATV playground with reflective bogs, logging trails, quarry hills, a swamp, breakable timber, persistent session ruts, synthesized engine audio and 48 mechanical upgrade tiers. Progress saves locally. Instant Bog Run provides a separate 60-second stock-rig session.

Serve `dist/` over HTTP and open `index.html` (`python3 -m http.server 8080 --directory dist`). The only runtime dependency is Three.js **0.170.0**, imported from its exact jsDelivr CDN URL; an internet connection is needed for that module. No accounts, analytics or game-service requests.

Controls: WASD / arrows drive; Space brakes; C switches cockpit/chase; R recovers; G opens the workshop; Shift holds differential lock after Tires II; E pulls the winch after Torque III. Drag the mouse to glance. Gamepad sticks/triggers and touch buttons are supported. Quality selector offers auto/low/medium/high. Audio starts with input.

Build: `npm install` then `npm run build` inside this directory. Source is in `src/`; the production static build is in `dist/`. The build removes developer hooks. Serve `src/` with `?dev` for `window.__mud` state, teleport, cash, upgrade controls and FPS. After `npx playwright install chromium`, `npm test` runs the real-time three-minute Chromium playthrough and stores screenshots and JSON in ignored `test-output/`.

Verification results and image comparison are in [TESTING.md](TESTING.md). Tested: keyboard motion, cash loop, route reward, upgrade purchase, quick-play movement, production hook removal and console errors. Not verified: physical gamepad/touch devices, browser audio quality, Safari, or real integrated-GPU performance.

Shortcuts: arcade vehicle dynamics rather than rigid-body tire simulation; pooled clods represent both splash and splinters; puddle reflections approximate the silver sky; ruts persist only within the running session; obstacles hide on impact rather than fracture individually. One ATV instead of a truck collection. Upgrade shop is available anywhere. Sinking uses a lightweight timer; winching has no attachment targeting or physical cable. No geometric terrain excavation. The quick-run seed is fixed. No prestige system.

The three changes most likely to improve fun:

1. Tire contact patches, deformable mud and deeper bog recovery decisions.
2. More authored jumps and alternate racing lines with ghost replays.
3. Specialized ATV/truck chassis and visible individual suspension animation.
