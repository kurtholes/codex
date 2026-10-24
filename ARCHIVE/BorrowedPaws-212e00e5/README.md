# Borrowed Paws
Inspiration image: 212e00e5

A small 3D possession sandbox: be the golden presence behind a shaggy dog, a swallow and a helpful neighbor. Stop a runaway cart, fetch for the child, scatter rotten fences, fly to rooftops and build a play platform. Four guardian branches offer 24 persistent upgrades. **Wander** saves progress; **Quick play** starts a separate three-minute afternoon with three shuffled wishes.

## Play and build
Serve this folder with any static HTTP server, then open `dist/index.html`. For example: `python3 -m http.server 8080`, then visit `http://localhost:8080/dist/`. Opening via `file://` is unsupported. The pinned Three.js 0.169.0 jsDelivr module requires an internet connection for its initial load; there are no other runtime requests or dependencies.

Edit `src/`, then run `node build.mjs`. The committed `dist/` contains the static build. No bundler is required. `npm ci` installs only the development browser test dependency; `npx playwright install chromium` installs its browser if needed. Run `npm test` for the three-minute automated session.

## Controls
- **WASD / arrows:** move. **Shift:** sprint. **Space:** jump; hold to climb in flight.
- **Mouse drag:** orbit camera. **Wheel:** zoom.
- **E:** borrow the closest host within your golden tether.
- **F / double-click:** body-check, fetch/throw, dive/carry or build, depending on body and nearby objects.
- **U:** upgrade constellation. **Esc:** close it. The top-right buttons control sound and automatic/low/medium/high detail.
- Dog: fetch the red ball, then return to the child and press F. Neighbor: build at the glowing garden platform. Bird: fly to the mint rooftop and dive.
- Touch buttons provide basic movement, possession, help and jump. Gamepad is not implemented.

## Verification
See [VERIFICATION.md](VERIFICATION.md) for measured results and screenshot comparisons. The development URL `src/index.html?test` exposes teleport, currency, state and FPS tools. The build strips that entire block; `dist/index.html?test` exposes nothing. Test output and node_modules are ignored within this folder.

## Shortcuts and limits
Procedural, assembled and batched character meshes replace rigged production assets; the result is a stylized interpretation rather than the source image's painterly realism. Audio is synthesized. Neighborhood projects are a compact repeatable platform activity, rather than a full building editor. Confidence is a saved counter and celebration response, rather than a social simulation. The child follows a small autonomous meadow route. Broken props regenerate after 35 seconds away; debris persists for 40 seconds in a bounded pool. Scores and upgrades persist; prop damage and platform geometry reset on reload. Quick-play shuffles wishes, ball and host positions within the same neighborhood. No rescue-failure scoring, skateboard simulation, crowd system, or gamepad support. The quality presets vary resolution, grass density and shadows; distant objects use fog and instancing rather than a full asset LOD system.

## Three changes that would most improve fun
1. More physical host verbs: dog herding, bird aerial catches and neighbor toss-and-catch games with the kid.
2. Evolving neighborhood projects with durable rebuild choices, recurring friends and ramps that link the rooftops.
3. Better animated character responses and impact sound layers, followed by hardware profiling and richer grass at the same frame budget.

Replacement prompts and asset budgets are in [ASSETS.md](ASSETS.md). The source image is not required by the game.
