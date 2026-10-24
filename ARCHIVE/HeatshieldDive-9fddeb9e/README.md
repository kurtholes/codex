# Heatshield Dive
Inspiration image: 9fddeb9e

Surf a torn heatshield out of a burning station, cool it through re-entry, land and reach the blue rescue mast. Play starts immediately. Quick Dive is a 60-second score run. Salvage buys 36 persistent upgrades across six branches.

## Play
Serve this folder with `python3 -m http.server 8080`, then open `http://localhost:8080/dist/`. The production build is already included; no install is needed to play. Use an HTTP server rather than `file://` for JavaScript modules.

- **WASD / arrows:** steer in flight, walk on land. Mouse drag also steers.
- **Space:** cool/brake; deploy chute below 25 km; jump on land.
- **Shift:** boost / sprint. **E:** transmit near the mast.
- **U:** upgrades. **Esc:** close workshop. **R:** redeploy. **M:** sound.
- Touch buttons and basic gamepad left-stick / A support are included.

Heat damages your suit at 95%. Braking cools the shield but lengthens the fall; boost spends air. Fly near debris for score multipliers, hit it for salvage at a suit cost, and catch glowing fragments for a safe payout. Earned salvage survives failed dives. Buy orbit access to change the landing region and increase yield. The mast is always reachable without a key or collection gate.

## Build & test
`npm run build` copies the source into `dist/` and strips the development hook. Three.js **0.170.0** is the exact jsDelivr build, bundled in `dist/vendor/` so play makes no network requests. No other runtime dependencies, accounts, analytics, deployment configuration or remote assets.

`npm install` installs Playwright for development only. With the server running, `npm test` runs a real three-minute automated playthrough. `CHROME_PATH` selects Chromium; `TEST_DISPLAY` selects an X11 display for software GL. Artifacts are ignored under `test-output/`. `npm run test:smoke` checks all 36 upgrades, workshop controls and a complete timed quick dive. See [TESTING.md](TESTING.md) for measurements and screenshot comparisons.

Source at `/src/?test=1` exposes the **development-only** `window.__HEAT_TEST__`: `state`, `keys`, `grant(n)`, `teleport(x,y,z)`, `start(mode)`, `buy(branch)`, `land()`, `rescue()`, and `fps()`, plus an FPS overlay. Production removes the entire hook, including when `?test=1` is present.

## Scope & shortcuts
The Earth, fire and materials are procedural, stylized equivalents of the reference. The station is a detailed static shell; the surrounding debris is destructible and recycled using instancing. Ground crates break by proximity into a salvage payout. Terrain is a bounded 2.3 km island with four palette/destination variants, rather than four separately authored maps. There are no vehicles, authored music or skeletal animations. Air refills on the surface to keep exploration relaxed. Upgrade visuals are procedural scale/attachment changes rather than 36 unique models. The chute transition changes scenes; it is not a geographically continuous planet simulation.

Low/medium/high presets control resolution and instance counts; automatic selection uses device hints. Laptop integrated-GPU 60 FPS remains a target, not a hardware-verified claim. Gamepad/touch and prolonged 30-minute balance need human testing.

The three most useful fun improvements:
1. Add moving wreck clusters and more readable, risky salvage routes.
2. Add a driveable salvage rover and distinct island hazards.
3. Tune the heat/air economy through human sessions, then make each orbit an authored biome.
