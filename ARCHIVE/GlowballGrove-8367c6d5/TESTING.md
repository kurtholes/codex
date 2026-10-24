# Verification

The automated test uses Chromium with software WebGL, a 1280×800 viewport and the Low preset. It starts from a clean browser context, rolls with keyboard input, plants a grove, buys four pollen tiers (the first major evolution), then continues a timed 180-second roll/surge/jump session. It captures the starting view, 30 seconds, 180 seconds and the evolution; checks quick-roll entry, persistence after reload, and absence of the development bridge in production. Numeric results are recorded below after completion; raw samples and captures live in ignored `test-output/`.

Image comparison: the starting view preserves the left-hand turquoise tree, warm cottage, low yellow moon, cobalt grass and curved golden path. The low chase view puts the beetle and pollen ball in the foreground. The evolution capture shows the enlarged luminous ball and evolved label; later views show traversable open terrain and persistent garden production. The reference's hand-painted brushwork and dense nebula are approximated with procedural grain, geometry and a shader sky, rather than reproduced as textures. Geometry is intentionally readable and stylized; hills and canopy are simpler than the source illustration.

Not validated on physical integrated-GPU hardware, touchscreen devices or physical gamepads. The 48-tier economy, eight-hour offline cap and extended 30-minute balance have not had a full human playtest. The test gives currency to reach the first major evolution without waiting for progression; later rolling rewards are earned through input.

## Final smoke

Passed: four-tier evolution, cottage arrival with ball-size scoring bonus, real-time countdown labels, production development-bridge removal, and zero page errors. Captures: `final-start.png`, `final-upgrade.png`. The final full three-minute run uses uncapped frame intervals for FPS, while physics has a separate capped step. Quick-roll timers and garden income use real elapsed time.

## Final three-minute run

- Continuous roll/surge/jump input: **180 seconds**.
- Low preset, uncapped frame-time measurement: **11.3 FPS average**, **1.8 FPS minimum**, Chromium SwiftShader software rendering. Screenshot capture stalls are included. **60 FPS on integrated-GPU hardware remains unverified**.
- Console/page errors: **0**.
- Planting and saving: **1 grove**, preserved across reload.
- First major evolution: **4 pollen upgrades**, captured visually.
- Quick-mode entry and absence of the development bridge in production: **passed**.
- Four required screenshots: `00-start.png`, `30-seconds.png`, `180-seconds.png`, `upgrade.png`, all in ignored `test-output/`.
- Capture-first harness recorded **14.362 seconds** until it sent and observed the first rolling input. This includes the blocking initial software screenshot. A separate immediate-input smoke test measures startup without that capture delay.

Raw per-second FPS/state samples are in `test-output/report.json`. No numerical hardware performance claim is made from the software-rendered test.

Immediate-input startup measurement: **3.613 seconds** from navigation to observed rolling, without a blocking screenshot before input. Final smoke passed cottage scoring, timer labels, evolution, production debug removal and zero page errors.
