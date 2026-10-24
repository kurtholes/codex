# Verification

Automated Chromium / Playwright, 1280 × 800, Low preset, SwiftShader software rendering. The timed naval run lasted **180 seconds**, followed by landing and quick-play checks (184.5 seconds total). Dev state was used to supply 500 gold for refits and teleport to a dock for shore coverage; the sailing and firing used keyboard input.

| Check | Result |
|---|---|
| First action | Already sailing at load; first input in initial frame (~0 seconds) |
| Timed captures | 0.000 s, 30.000 s, 180.005 s |
| First refit capture | 46.203 s; battery and sail tier 1 |
| Core combat | 26 volleys, 5 destroyed targets |
| Landing / quick play | Both passed |
| Browser console errors | 0 |
| Low FPS, cold sample | 4.76 fps, measured by requestAnimationFrame against real elapsed time |
| Low FPS, final production sample | 14.49 fps over five seconds; software renderer (earlier sample 6.35 fps) |
| Production debug removal | No state/teleport/currency hooks or FPS element |
| Persistence | Gold 1234 and saved upgrades reloaded successfully |

**Performance target not established:** 60 fps on laptop integrated graphics was not tested. SwiftShader is below target. The old dev overlay visible in the naval captures used clamped simulation time and overstated FPS; it has been corrected to real elapsed time. The independent frame samples above are the reliable measurements. The initial action timestamp was -6 ms due to the first animation timestamp preceding initialization; the final build clamps negative frame deltas to zero.

Review of the shore capture exposed a camera passing through scenery during a teleport/landing transition. The final version snaps behind the captain when landing and uses dock/beach foot height. A separate headless shore smoke check passed and produced the updated shore capture below. The full endurance run preceded that camera-only fix and the frame timing correction; final production checks cover the resulting build.

## Visual comparison with inspiration a107ed12

- [At load](screenshots/00-start.png): charcoal sails, sparse amber stern lamps, slate water, enclosing cliffs and silver fog preserve the source's palette and dominant silhouette. The camera is a playable chase view rather than the image's front-quarter composition.
- [30 seconds](screenshots/30-seconds.png): ship motion, wake rings and layered hazards carry the navigation; the procedural water is brighter and more regular than the source's turbulent surf.
- [First upgrade](screenshots/first-upgrade.png): additional cannon barrels and taller sail rig change the ship silhouette, with immediate refit feedback. These are tier-one fittings, not the maximum ship configuration.
- [180 seconds](screenshots/180-seconds.png): combat feedback and floating cargo remain readable against the same dark palette; distant hulls remain recognizable under LOD.
- [Shore after camera correction](screenshots/shore.png): third-person captain, dock, crates and defenders are readable. Geometry and animation are visibly simple; the source's rich rock and timber detail has not been reproduced photorealistically.

Raw reports/screenshots are generated under ignored `test-output/`. The linked captures are intentionally retained review artifacts. No listening test, integrated-GPU benchmark, full campaign completion, 30-minute balance test, touch or gamepad test was performed.
