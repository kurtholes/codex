# LAST SHIFT
Inspiration image: 7258f0f0

A small robot keeps delivering paperwork through a flooded cathedral. Pull cabinets, smash a route, winch the cyan coversheet and return it to the amber inbox. Wages buy 36 permanent upgrade tiers across six branches. Side aisles lead to the archives and industrial quay. **One Shift** supplies equipment for a 90-second fragile delivery run.

Serve `dist/` with any static HTTP server. Three.js **0.170.0** loads from the pinned jsDelivr URL; internet access is needed for that library. There are no accounts, telemetry, or other runtime services. Audio is synthesized after interaction. Career progress saves locally.

- WASD: move; click scene and mouse: look; Escape: release mouse.
- E: winch nearest object / release. Pulling the cyan sheet into the amber inbox completes delivery.
- Shift: boost; Space: smash nearby clutter.
- Tab: upgrades. Top buttons: career, quick play, quality, sound.

Build: `npm install`, then `npm run build`. Source is the three root web files; `build.mjs` copies them and strips development hooks into committed `dist/`. No bundler or runtime package dependencies.

Test: `npx playwright install chromium`, then `npm test`. The local test server runs a three-minute Chromium session at 1280×800 on LOW, exercises movement, hauling, deliveries and upgrades, and writes screenshots and JSON under ignored `test-output/`. Source `?dev` exposes teleport, currency, state, actions and FPS; production strips these hooks. Test automation uses teleport for repeated jobs and does not establish natural route completion difficulty.

Shortcuts: simple planar buoyancy and impulse collisions instead of a rigid-body solver; destructible props instead of structural building collapse; compact connected yard rather than a vast city. Late contracts reuse the holographic parcel. Upgrade branches change numbers and attachments but do not implement climbing, swinging, tracks or automated courier agents. Quick play uses a fixed seed and supports a fresh run from Career; it has no global leaderboard. Keyboard/mouse only. No real integrated-GPU benchmark or gamepad/mobile testing.

Three changes most likely to improve fun:

1. Real buoyant cargo physics, cable wrapping, stackable ramps and persistent crossings.
2. Distinct heavy deliveries and multi-part department hauls with new winch tools.
3. More authored districts with vertical routes and reactive floor collapses.

Measured run: 181.7 seconds, 33 deliveries, zero core-loop console errors. LOW averaged 12.72 FPS in SwiftShader software rendering; the 60 FPS hardware target remains unverified. First action registered at 1.018 simulation seconds; wall latency was not measured.

See `DESIGN.md`, `ASSETS.md` and `VERIFICATION.md` for intent, replaceable art and test findings.
