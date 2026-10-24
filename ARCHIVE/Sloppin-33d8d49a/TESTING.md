# Verification

The automated Chromium / Playwright run lasted **202.74 seconds**, including startup, screenshots and final assertions. The core loop held root and movement for 180 seconds, using developer teleports to sample the cabbage patch, orchard and piggery. The captured final state represents 190.97 seconds since startup. This is an automated functional exercise, not a human fun assessment.

| Measurement | Result |
|---|---:|
| Controls / test state ready | 0.36 seconds |
| First rooting action after navigation | **1.98 seconds** |
| Low graphics average FPS | **3.52** |
| Low graphics minimum sampled FPS | 0.85 |
| Lifetime feed earned | 1,352 |
| Final available feed | 1,281 |
| First major movement upgrade | Hide II, earned and purchased |
| Additional upgrade purchase | Passed |
| Fully unlocked sandbox | Passed |
| Production dev hooks absent | Passed, even with `?test` |
| Browser console / page errors | **0** |

Performance was measured at 1280×800 in Chromium with **SwiftShader software WebGL**, 0.75 rendering scale, low shadows/rain disabled. The instanced farm renders about 44–47 draw calls. These are real wall-clock FPS measurements; an earlier counter that clamped frame time was corrected. **60 FPS has not been demonstrated.** Hardware GPU performance, integrated-laptop performance and thermal stability remain untested.

Final cleanup removes unused overlapping crop instances, keeps the upgrade panel within small viewports, and clears tracks and debris when starting a fresh sandbox. These changes do not alter the sampled rooting loop. The production build and save/reset checks are tested after cleanup. Raw results are in verification.json. Reproduce with `npm test` and `npm run test:smoke`; both scripts start their own local servers. All raw logs and captures go to ignored test-output/. Curated requested captures are retained below.

## Captures and reference comparison

- [0 seconds](screenshots/00-start.png): immediate cabbage patch, no blocking introduction. Preserves the large charcoal pig, low farm horizon and silver storm cover. The game terrain is lighter and more olive than the source image's black slurry.
- [30 seconds](screenshots/30-seconds.png): rooted field, a growing pig and cleared crop rows. The chase camera favors navigability; the reference has a more dramatic side-on face silhouette.
- [3 minutes](screenshots/3-minutes.png): the larger pig, scattered timber and persistent dark tracks show accumulated destruction. Procedural crops and tree crowns are simpler and more rounded than the reference's organic detail.
- [First major upgrade](screenshots/first-major-upgrade.png): Hide II purchased with earned food, unlocking the muddy belly-surf movement response. Growth adds visible bulk and wet highlights; further tusk upgrades visibly extend the tusks.

The visual review compared all four captures with inspiration image **33d8d49a**: storm mood and palette are recognizable, while ground wetness, anatomy animation and realistic vegetation need further art work. The source image is not required at runtime.

## Final smoke checks

At 800×500: localStorage survives reload; switching to sandbox grants all anatomy tiers; mud-depth input and fresh-farm reset respond; returning to main restores its currency and anatomy; production renders a canvas and saved feed with no developer state, even with the test query. The small-screen panel overlap found during this check was fixed.

Not tested: a 30-minute human play session, progression balance over that duration, audio quality by ear, touch hardware, gamepads, non-Chromium browsers, or real GPU preset comparisons. No deployment, git commit or push was performed.
