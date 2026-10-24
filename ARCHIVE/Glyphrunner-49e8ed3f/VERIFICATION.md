# Verification

Test environment: Chromium headless through Playwright 1.56.1, 1280×800, ANGLE SwiftShader software renderer, low preset at 0.8 pixel ratio. This is a CPU rendering benchmark, not an integrated GPU measurement. Target laptop 60 FPS remains unverified.

`tests/playthrough.mjs` runs at least three minutes of real time after the opening action. It alternates keyboard movement and charges, uses development teleports to sample all eight beacon regions, purchases two momentum ranks, reloads the save, and opens the production build to check the development API is absent. It captures `00s.png`, `30s.png`, `180s.png` and `upgrade.png` in ignored `test-output/`, together with `report.json`. The screenshot names refer to wall-clock checkpoints; the simulation clamps long frames to keep physics stable.

The opening screenshot was visually inspected against inspiration image 49e8ed3f. Shared elements: charcoal maze walls, green-teal lighting, hooded flared cloak silhouette, brightest yellow-green scroll, small cyan mushroom clusters and distant haze. Differences: the reference's crumbling engraved masonry and dense organic detail are represented by regular procedural wall sections and shader grain. Cave ceiling, rich mist, and storm sky are simplified. Chase framing replaces the reference's broad elevated composition. The upgrade screenshot shows larger scroll, bright trail fragments and active debris; power changes are readable but still subtle.

The test is assisted coverage of the core loop, not an autonomous maze solver or proof of all routes. Remaining manual checks: hardware GPU performance, subjective sound mix, full economy balance, reaching lookout columns through vault chains, every wall-run corner and tether route, fog loss condition, keyboard layouts and accessibility. No gamepad/touch controls were implemented.

## Completed run

- Real duration: **193.701 seconds**; first movement: **3.841 seconds** from script start.
- 52 wall sections broken, all 8 beacons awakened, 2 momentum ranks purchased.
- Save reload passed; production development-API removal passed; **0 console/page errors**.
- The original overlay incorrectly divided frames by clamped physics time, reporting 25.15 FPS. This was corrected in source and rebuilt after the run. Actual whole-run software throughput was approximately **4.4 FPS** (851 frames / 193.701 seconds, including screenshot/reload overhead). Do not interpret the old report's `lowFpsMean` as rendering throughput. The 60 FPS target is not met in SwiftShader and remains unverified on integrated graphics.
- Screenshot files at opening, ~30s, ~180s and momentum rank 2 were captured. The three-minute run uses real elapsed wall time; only 33.76 physics seconds elapsed because slow frames are capped.

The final FPS accounting correction was syntax checked and rebuilt; the full playthrough preceded that timing-only correction.

Final-build smoke check: quick-exit trigger passed through a development teleport and returned to expedition after its short result toast; purchasing Thread rank 2 enabled Q and raised the character off the floor (0.784 units sampled under slow rendering). Both tests used development assistance. Final syntax checks passed.
