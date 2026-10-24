# Browser verification

Headless Chromium / Playwright 1.56.1, 1440×900, Low preset, ANGLE SwiftShader software WebGL.

| Measurement / check | Result |
|---|---|
| Main automated session | 180-second active loop; 198 seconds including loading and checks |
| Time to first automated push | 8.768 seconds from navigation, including initial screenshot |
| Low preset average FPS | 4.45 FPS on software WebGL before final Low resolution/hash optimization |
| Browser console / page errors | 0 |
| Cross push, upgrade purchase, renewable seals | Pass |
| Upgrade persistence after reload | Pass |
| Quick mode entry | Pass |
| Production debug removal | Pass |
| Final keyboard-only first route | Pass after correcting timber step height |
| Final interlinked tier prerequisites | Pass |
| Final quick-play completion | Pass with state-based waiting |

The first quick-completion check used a 160ms fixed wait and failed under slow rendering. It now waits for each beacon's state change. `node tests/smoke.mjs` passed all four focused checks on the final source/build with zero page errors. The final Low preset uses 0.75 device pixels and a multiplication-based procedural hash; the three-minute performance measurement predates those small changes. No claim of 60 FPS on integrated graphics is established. Hardware performance remains a material unverified target.

The three-minute test uses developer teleports between landmarks, with keyboard actions between them; it does not prove every route can be completed by ordinary movement. The additional final keyboard-only check covers the opening cross-to-seal route. Sound quality and mobile usability were not manually audited.

Screenshots: `test-output/00-load.png`, `30-seconds.png`, `180-seconds.png`, `upgrade.png`, and final `quick-complete.png`. Machine-readable reports: `report.json` and `smoke-report.json`. These artifacts are deliberately ignored by Git. Regenerate with the documented commands.

## Visual comparison
The source's warm ochre ground, charcoal striations, timber-cross landmark, scattered black/ivory checker tiles, rust-red human accent and bare branching tree all appear as physical geometry. The game expands the scroll into floating plateau regions with a following camera. It omits the literal scroll rollers and drawn woman, replacing her one-eye gesture with a playable sight mechanic. Geometry is deliberately cleaner and more angular than the dense stippled source. The opening screenshot motivated widening the default camera and batching timber fibers and cliff strips into material-based instances.
