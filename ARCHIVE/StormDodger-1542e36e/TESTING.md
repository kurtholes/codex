# Verification

The current test uses Chromium / SwiftShader software WebGL at 1280×720 with the Low preset. It moves using keyboard input, watches development state to time last-second dodges, and buys the first Boots upgrade with earned currency. It does not teleport or grant currency during the three-minute core-loop run. Currency is granted only for the separate late-unlock smoke check.

The performance target is 60 FPS on integrated laptop graphics. SwiftShader is a CPU renderer, so these measurements do not verify that hardware target. Final measurements appear below after the completed run.

The separate `tests/verify.mjs` check passed storm riding (player rises above 5 units) and localStorage reload persistence. Saved tiers `[1,0,0,0,0,5]` restored exactly. Audio is synthesized and triggered, but not listened to in headless mode. Touch, physical gamepad, cross-browser support and 30-minute progression balance have not been tested.

Screenshot comparison against inspiration image 1542e36e:

- **0s:** preserves ochre earth, charcoal weather, ivory horns and a white-shirted lone figure. The playable view is behind the player. The source's storm fills more of the sky and has much finer atmospheric detail.
- **30s:** repeated close dodges show the score bank and reward feedback. Scattered timber and destroyed structures add the playable frontier layer; the source has open prairie.
- **First upgrade:** the first earned Boots tier changes dive speed and cooldown. This is a modest first purchase, not the final power fantasy; cape and weather branches create larger silhouette changes.
- **180s:** the scene tracks sustained charges, debris and demolition. Cloud lobes remain visibly stylized rather than volumetric, and lighting lacks the source's detailed sun shafts.

The raw report and captures live in ignored `test-output/`. Selected captures and the completed report are copied to `verification/` for review.

## Completed final run

| Check | Result |
|---|---|
| Harness duration | 186.51 seconds including final checks |
| Core-loop play | 180+ seconds wall time; 170.19 seconds simulation time (long frames capped) |
| Time to first movement | 1.22 seconds on the game clock |
| Low mean FPS | 9.02 (SwiftShader CPU rendering) |
| Low minimum sampled FPS | 0.93 (includes stalls / captures) |
| Console and page errors | 0 |
| Perfect dodges | 21 |
| Destroyed structures | 20 |
| Earned bank after first purchase | 71,820 Olé |
| Earned Boots upgrade | Passed |
| Quick-play timer completion | Passed |
| Rider V unlock | Passed |
| Production test hooks stripped | Passed |

The final harness owns its HTTP server, avoiding the temporary-server shutdown that interrupted the production smoke check after an earlier completed core run. `npm test` now runs independently. The 60 FPS hardware target remains unverified and the CPU-rendered result is below target. Screenshots are [initial](verification/00s.png), [30 seconds](verification/30s.png), [first upgrade](verification/first-upgrade.png), and [three minutes](verification/180s.png). Raw measurements: [report](verification/report.json).
