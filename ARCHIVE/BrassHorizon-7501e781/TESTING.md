# Verification — 24 October 2026

## Three-minute headless playthrough

Command: `npm run dev`, then `npm test` in a second terminal. Google Chrome 156.0.8078.47, Playwright 1.56.1, ANGLE SwiftShader CPU rasterizer, 1280×800 viewport, Low preset (0.6 pixel ratio). The browser had no prior campaign save.

| Measurement | Observed |
|---|---|
| Time from navigation to first action | **3.423 seconds** |
| Core playthrough duration | **180 seconds wall time** |
| Median Low FPS | **6.12** |
| Sampled Low FPS range | 4.14–12.46 |
| Shots fired | 177 |
| Factory sections destroyed | 322 |
| Earned refits | 2 siege tiers; twin cannons unlocked |
| Salvage remaining | 3,168 |
| Console errors / warnings | **0 / 0** |
| External requests | **0** |
| Saved tiers and currency restored | Passed |

**60 fps has not been established.** These measurements are from CPU software rendering, not a laptop integrated GPU. A hardware GPU benchmark is still needed; do not interpret the software result as meeting the performance target. The simulation caps individual frame steps at 0.2 seconds, so the 180-second wall test advanced 160.7 simulation seconds under this unusually slow renderer.

The script uses actual mouse aiming, held Space, and refit button clicks. It earns the purchase currency from destruction and collection; it does not grant currency. The development teleport places the airship at successive islands every 35 wall seconds for repeatable traversal, resetting hull there. This verifies the loop, not survival difficulty or uninterrupted cross-world flight. Target positions come from development state to make aiming deterministic.

After the core run it selects each of the three sortie loadouts, returns to the frontier, verifies a shortened timer reaches the results screen, then reloads and verifies the campaign save. The full five-minute timer is not waited out. Raw measurements, samples and screenshots are ignored under `test-output/` and can be regenerated.

## Screenshot review against inspiration 7501e781

| Captured checkpoint | File | Comparison / finding |
|---|---|---|
| Launch / first action | `test-output/00-launch.png` | Real ribbed black grip on a stepped brass pedestal, dark timber console, warm ivory dial faces, black structural framing and caged amber lamps preserve the reference's focal shapes and palette. Broad windows extend that room into the sky. |
| 30 seconds | `test-output/01-30s.png` | The cockpit remains stable and readable during flight; removed factory sections, orange projectiles and floating salvage communicate action without a story screen. |
| 180 seconds | `test-output/02-180s.png` | A different industrial island and persistent salvage balance demonstrate travel and collection. Amber fog, charcoal factories, red pressure vessels and brass bands stay consistent across the frontier. |
| First major upgrade | `test-output/03-major-upgrade.png` | Twin Thunder adds a second pair of visible barrels; the brief confirmation appears above the cockpit. Upgrade currency was earned naturally. |

The result is intentionally stylized geometry, not photorealism: the reference has richer wear, fine surface roughness, tighter room lighting and denser mechanical clutter. The game's exterior is brighter for target readability; its floating rock silhouettes and repeated factory kit are the largest visual simplifications. The black grip, brass rings, wooden panel, needle instruments and lamp arrangement provide the strongest source-image correspondence. The low preset screenshots visibly trade sharpness for speed.

## Production / limits

A separate production smoke check serves `dist/` on port 4180 and runs `node scripts/production-check.mjs`. It checks that the dev state object and injected helper code are absent, checks six refit branches and three sortie loadouts, fires a sortie, returns to campaign, and captures 1440×900 and 800×600 views. **Passed:** development helpers absent, six refit branches, three loadouts, both viewport sizes, zero console errors, and zero external requests. Results are in `test-output/production-check.json`.

Not verified: physical integrated-GPU performance, mobile device thermals, touch ergonomics, gamepad hardware, all 48 refits in a natural campaign, or 30-minute economy balance. No screenshots or synthetic tests establish those claims. There are no rigid-body debris collisions; collapse is support-triggered and fragments are pooled ballistic particles.
