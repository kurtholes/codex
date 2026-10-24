# Verification

Chromium headless, 1280×800, LOW (0.8 pixel ratio), ANGLE SwiftShader software rendering, 2026-10-24.

- Automated core-loop run: **181.702 wall seconds**, 88 routing attempts, **33 completed deliveries**, all 36 upgrade tiers purchased. Movement, shoving, winch handling, delivery payouts and upgrade purchases exercised. Teleports accelerate routing; this is not a natural-play difficulty test.
- First action: **1.018 simulation seconds**. Wall-clock input latency was not captured in this run; the test script now records it on future runs. No start modal blocks input.
- LOW average sampled FPS: **12.72** (sample means 7.57–31.23). This software renderer does not validate the 60 FPS integrated-GPU target. Simulation caps delta at 40ms, so only 50.94 simulated seconds elapsed during this slow run. Performance and timekeeping under sustained slow frames need further work.
- Core-loop console errors: **0**. Initial production navigation hit a test-server directory 404; the server now resolves index.html. Separate production smoke: canvas renders, six upgrade buttons, quick-play starts, development API absent, **0 runtime errors**. Added a data favicon to prevent browser favicon requests.
- Supplemental first-upgrade capture confirmed successful torque purchase after a delivery. Development delivery helper was adjusted to move cargo with the robot rather than snap its cable during teleport.
- Screenshots (ignored local outputs): `test-output/00s.png`, `30s.png`, `180s.png`, `upgrade.png`. JSON results in `report.json` and `production-smoke.json`.

## Comparison to inspiration 7258f0f0

Load: preserves ivory box-headed robot, warm amber square eyes, near-black Gothic bays, cold teal floodwater and distant cyan job marker. The camera shows more of the body and is higher than the source image; water reaches the legs rather than chest. Geometry is deliberately stylized.

30 seconds: repeated pointed ribs and clustered columns retain the reference's monumental scale; the stamp provides a strong red action accent. Water lacks real reflections and windows lack volumetric shafts. Surfaces are visibly procedural.

First upgrade: adds physical motor hardware; the effect is subtle and should become more expressive. Captured after the actual successful purchase in a supplemental check.

Three minutes: persistent wages and full upgrade tree work, with intact atmosphere and rubble. The automated route remains near the inbox, so this image does not establish district variety or natural progression pacing.

## Not established

60 FPS on actual integrated graphics, 30-minute natural progression balance, complete quick-play timeout/condition balance, save migration, browser matrix, touch/gamepad, cable wrapping, stackable physics, structural collapse, vertical traversal or automated courier simulation. LocalStorage read/write is implemented; reload persistence was not separately asserted. Art is procedural geometry; no generated raster or downloaded art assets.
