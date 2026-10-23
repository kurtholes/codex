# Validation — 2026-10-23

Build and JavaScript syntax checks passed. Production scan finds only the pinned Three.js CDN import as a remote reference. Browser check confirms development state access is absent from dist.

## Automated core-loop run
Chromium 141 via Playwright 1.56.1, headless SwiftShader software WebGL, 1280×800, low preset. The test holds W, jumps, teleports to the ship at 15 wall seconds, launches, aims and fires at fragments, grants 150 shards and buys the first cannon tier. This is assisted smoke coverage, not a balance test.

- Time to first action: **1,165 ms** after game initialization (excludes CDN/navigation time).
- Low FPS: **15.55 mean**, **6.89 minimum**, 15 samples. **60 FPS target not verified or met here.**
- Wall time: **232.53 seconds**; screenshot stalls overshot the three-minute deadline.
- Simulation advanced only **11.95 seconds**, because the timestep caps at 50ms during severe software rendering/capture stalls. Thus this is a three-minute wall-time playthrough, not three minutes of simulated survival.
- Eight shots, eight fragment destructions, one purchased cannon tier, bank 80; flying at completion.
- **Zero console errors** in the corrected run.
- Production development hooks: absent.

The earlier terrain shader failed because flat shading omitted Three.js's vNormal varying; fixed with an explicit world-normal varying. Earlier incomplete runs were discarded.

## Image review
Reference: provided image ee7b1ff3. Evidence in `verification/`:
- `00s.png`: central amber peak, serrated ridgeline, multiple peach crescents, icy blue/pink dusk and lone dark pilot preserve the reference's composition and palette. Procedural surfaces and hard-edged mountains look much simpler than the original; no claim of photorealism.
- `30s.png`: closer sanctuary during initial launch, horizon remains consistent; floating salvage reward demonstrates fragment breakup.
- `upgrade.png`: captured immediately after the first cannon purchase. Assisted aiming briefly points the camera into terrain; this is poor evidence for upgrade cosmetics and a camera-occlusion limitation.
- `180s.png`: near sanctuary spires after assisted flight. The rock occludes much of the view. No camera collision avoidance exists yet.
- `report.json`: raw measurements and final state.

## Not verified
Physical integrated-GPU 60 FPS, unassisted 30-minute balance, all 48 purchases, all quality presets, cross-browser behavior, gamepad/touch usability, listening quality, sustained quick-play completion, and save behavior across browser privacy modes. The full keyboard flight scheme exists; touch/gamepad remain partial. There is no real mesh fracture, terrain collision for the mountain meshes, or authored biome separation. Instanced rubble/particles share bounded geometry; there is no crowd system because there are no enemies.

A supplementary save/reload and forced quick-play timeout check could not initialize a WebGL context on two attempts after the long test. It produced no additional functional evidence; those cases remain unverified. Its temporary script was removed. The completed long-run report above is the retained browser result.
