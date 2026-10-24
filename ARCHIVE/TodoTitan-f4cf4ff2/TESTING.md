# Browser verification

Automated 180-second headless playthrough, 1280×800, LOW preset, system Chromium with SwiftShader software WebGL, shared Linux host:

| Measurement | Result |
|---|---|
| Navigation to first shot | 4.31 seconds |
| Average LOW frame rate | 3.64 FPS |
| Destroyed structures | 75 |
| Remaining salvage | 897 |
| First upgrade purchased | Piercing staples I |
| Quick Shift rig | 4 / 3 / 2 / 2 / 4 / 1 |
| Production development API | Absent |
| JavaScript exceptions | None |
| Browser console errors | One missing favicon (404); fixed afterward |

The FPS target is **not verified**. SwiftShader results are far below 60 FPS and cannot establish integrated-GPU performance. Static cathedral geometry is batched by material; paper torrent and 650 pooled debris pieces use instancing. Targets use simplified collision and fixed counts. Real hardware profiling and further optimization remain necessary.

Screenshots were captured and visually reviewed in ignored `test-output/00s.png`, `30s.png`, `180s.png` and `upgrade.png`. Compared with inspiration f4cf4ff2: the centered mechanical face, paired black monuments, luminous eyes, white mouth torrent and white-coated worker preserve the source composition and palette. The game is deliberately more readable and brighter on the floor. The face is stylized and smoother than the source's dense worn metal; pillars use stacked destructible chunks rather than detailed fracture surfaces. At 30 seconds the paper bank has visible gaps and flying fragments. The upgrade capture shows the purchase and changed cannon. The three-minute capture shows sustained salvage and destruction with the central waterfall intact.

After the endurance run, the favicon was replaced with an inline icon and the Quick Shift clock was corrected to use wall time independently of capped physics steps. `node tests/smoke.mjs` checks these final changes, localStorage upgrade persistence and production stripping. The long run predates only these icon/timing fixes. The final long-run reproduction script loads the current source.

Not tested: a full three-minute Quick Shift ending, 30-minute upgrade balance, physical gamepad, mobile movement, listening quality or real integrated GPU performance. No claim of complete rigid-body scenery destruction: the titan shell, floor, platforms and rails remain fixed.

Final smoke result: **PASS**. Zero console errors; saved staple tier 1 recovered from localStorage; Quick Shift advanced 5.23 seconds during the measured wait; production test API absent. Both source and production pass `node --check`; `npm audit` reports zero vulnerabilities.
