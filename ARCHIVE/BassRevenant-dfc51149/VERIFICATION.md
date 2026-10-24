# Verification

Inspiration image: dfc51149

Automated Chromium / Playwright 1.56.1, Linux headless, SwiftShader software WebGL, 1280×800 viewport, low preset (0.7 render scale, 500 rain streaks, 180 debris instances). This is a shared cloud CPU environment, not laptop integrated graphics.

| Measurement | Observed |
|---|---:|
| Active wall time | 184.48 seconds |
| First action after game module ready | 3.738 seconds |
| Mean sampled low FPS | 3.09 |
| Lowest / highest sampled FPS | 1.26 / 6.86 |
| Simulation time reached | 48.91 seconds |
| Shots / counters | 63 / 18 |
| Captured rigs | 9 / 9 |
| Samurai silenced | 40 |
| Objects / towers destroyed | 23 |
| Final score | 18,194 |
| Page errors / console errors | 0 / 0 |
| Save survives reload | Pass |
| Quick-play upgrades isolated | Pass |
| Production test hook absent / external requests | Pass / 0 |
| Tier IV wall launch / armor purchase | Pass / Pass |

**Performance target remains unverified.** Software WebGL fell well below 60fps. The capped simulation delta and hit-stop mean this was three minutes of wall-time interaction, not three minutes on the game clock. A laptop integrated-GPU benchmark and a full three-minute simulation-time run are still needed. The report preserves all FPS samples rather than hiding slow frames.

The automation starts with actual movement and a mouse charge/release, then uses the development teleport and currency hooks for deterministic coverage of all districts and early movement upgrades. Shots, counters, damage, capture, destruction and purchases run through the game logic. Some incoming volleys are injected to check counter timing reliably. This verifies mechanics, not an unaided human completion time or upgrade economy.

During development, screenshot inspection found a reticle intercepting fire input; it was fixed using pointer-event pass-through. An early automation route landed outside roof bounds; it was corrected. Geometry batching, planar skyline windows, shared wave geometry, instanced equipment/crowds/debris/waves and a 70-wave cap reduce draw calls and bound the combat load. The final screenshot shows 83 calls in a demolished area; the opening district is approximately 340 calls.

Final targeted checks also exercised the wall-launch unlock and armor purchase after those additions. The full wall-time run predates those two visual/movement additions; its tested lower-tier combat behavior is unchanged. Production smoke was repeated on the final build.

## Captures against the reference

- [Load / 0s](verification/00-load.png): cyan-black skyline, wet dark foreground, red haze behind samurai and the hooded twin-speaker silhouette preserve the main visual vocabulary. The title uses the empty left side; the camera faces the battlefield.
- [30s](verification/30-seconds.png): rooftop exploration and demolition keep the skyline visible. The game has harder, simplified building shapes and brighter navigation edges than the reference.
- [First major upgrade](verification/first-major-upgrade.png): larger speaker stacks and bass rings visibly communicate growth. White counter rings and orange-red returns distinguish action from the dark roof; these readable effects are intentionally brighter than the source.
- [3 minutes](verification/180-seconds.png): the hooded rig, chunky demolition debris and gold amplified returns remain legible. The fortress view is a closer combat composition than the source's wide establishing shot.

The reference's photographic rain, fabric, smoke volume and true wet reflections are approximated by generated cloth geometry, billboards, rain lines and procedural triplanar concrete. No claim of photoreal fidelity. The source image is not needed at runtime.

[Full metrics](verification/report.json) · [Persistence checks](verification/checks.json) · [Production smoke check](verification/production.json) · [Movement check](verification/movement.json)

Not verified: real audio listening, mobile browser usability, physical gamepad, laptop GPU 60fps, long-term balance, 30-minute play session, every upgrade combination, or every browser. No deployment was performed.
