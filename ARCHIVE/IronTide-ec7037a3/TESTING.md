# Browser verification

Automated with Playwright 1.56.1 and headless Chromium, 1280 × 800, low preset, ANGLE SwiftShader software rendering. The test holds actual steering/reverse and hook keys to break the opening crane, observes the falling crane breach the adjacent seam, moves the boat to the foundry through the development teleport helper, waits for its spring-towed cargo, and refines. Later loops repeat assisted towing. Currency grants exercise upgrades without waiting for the economy. This is an assisted core-loop test, not an autonomous navigation or balance test.

The three-minute script is `test.mjs`. The additional `smoke.mjs` checks all 48 tiers, dive depth, rail deck height, upper terrace height, saved upgrades after reload, Quick Play reset, and absence of development access from the production bundle. All additional checks passed with no page exceptions.

## Completed sustained run

- Wall duration: 188.74 seconds, including final production check.
- Time to first action: 2.20 seconds after navigation.
- Opening crane freed and adjacent gate breached: both passed.
- First delivery: 75 Fe; final: 8 deliveries, 10 broken assemblies, 785 Fe reserve.
- First major upgrade: engine tier II.
- Low preset average: 6.01 FPS; minimum sampled rolling average: 5.00 FPS.
- Console/page errors: 0. Production developer hook removal: passed.

The measured software-renderer result is below the 60 FPS target. This remains an unresolved performance validation limitation, not a performance pass. Shared software rendering had other concurrent workloads; that explains why these figures should not be extrapolated to a GPU, but does not establish laptop performance.

## Image comparison

The ignored `test-output/` folder contains `00s.png`, `30s.png`, `180s.png`, `first-upgrade.png` and `all-upgrades.png`.

- At load: sulfur-green fog, oily black water, oxidized brass crane on the left, skeletal ships on the right, and the crown-bearing sculptural landmark in the center echo the source's composition. The tug occupies the foreground where the image has rails.
- At 30 seconds: the opening structural seam has tipped and debris floats around the tug. The environment is interactive rather than a flat reference backdrop.
- At the first major upgrade: twin additional engine stacks are visible. The foundry glows cyan, maintaining the source's sparse cool accents.
- At three minutes: repeated towing has moved the tug among the wrecks; the screenshot also exposes camera occlusion near large hulls. Camera collision avoidance is not implemented.
- The procedural silhouette and restrained palette match the reference more closely than the surface detail: hulls and faces remain stylized, and there is no photographic texture fidelity, dense hanging vegetation, volumetric fog, or postprocessed bloom.

## Limits

No physical integrated-GPU laptop, audio listening session, manual gamepad, mobile/touch, cross-browser, thirty-minute balance session, or subjective fun assessment was completed. Software headless FPS is not a laptop GPU benchmark. A prior sustained run lost its browser before completion and was restarted; it is not counted as a pass. The source-only developer hooks are stripped by the build, and the production bundle was searched for their identifiers.
