# Verification

Automated Chromium / Playwright run, low preset, 1280×800 viewport, SwiftShader **software rendering**. Measurements include screenshot overhead and CPU contention; they are not an integrated-GPU benchmark.

| Check | Result |
|---|---|
| Timed core-loop playthrough | 180 seconds of actual keyboard/mouse play; 185.7 seconds including follow-up checks |
| Time to first movement/fire | 5.95 seconds from navigation (first input dispatched at 6.00 seconds) |
| Low FPS | Sampled mean **9.59**, minimum **3.43**, final rolling **11.47** |
| Destruction | 156 pieces destroyed; 5,377 coins remaining |
| Natural first upgrade | Pollen mass tier 1, purchased through UI |
| Console / page errors | **0** |
| All upgrade tiers | Eight branches reached tier 8 via developer currency, then verified after reload |
| Quick Play entry | Passed; heavy orb and flight build activated |
| Production build | Static dist; developer block removed by build |

The laptop integrated-graphics **60 FPS target is unverified**. Software performance misses that target. Physics deliberately caps simulation steps, so the 180 seconds of wall-clock play represented 98.9 seconds of simulation under software rendering. Quick Play's countdown uses wall time independently.

## Screenshot comparison
Files are generated under ignored `test-output/`:

- `0s.png`: immediate market view. The bouquet/black hat/crimson band and floating slab retain the source's focal silhouette. Receding balconies and gold stone against teal fog preserve the image's depth and palette.
- `30s.png`: pollen, airborne petals, a broken cart and balcony damage. The game gives the player physical activity inside the setting rather than presenting the inspiration as a background.
- `first-upgrade.png`: natural first pollen upgrade. Orb diameter increases, and bouquet growth starts; larger cumulative changes appear across the full tree.
- `3min.png`: extensive damage and 5k+ income. This capture exposed a building/camera intersection; solid facade collision and camera obstruction checks were added afterward and checked separately.
- `camera-fix.png` / `production.png`: follow-up screenshots for the collision fix and stripped production build.

Compared with inspiration image a5d8e4f8, the implementation is much more geometric and regular. It preserves amber/teal contrast, ragged coat, hat flowers, slab, stalls and layered alley depth, but does not reproduce the image's painterly faces, intricate baskets, dense crowds or dramatic shadow detail. Those are deliberate procedural-art shortcuts, not claimed visual matches.

## Limits
The three-minute run covers the normal core loop. Quick-play entry was smoke-tested; a complete three-minute quick-play finish and replay were not timed separately. Maximum upgrades and persistence were checked with developer shortcuts, not a thirty-minute organic economy test. Touch, physical gamepad, Safari, Firefox, mobile thermals and integrated-GPU performance were not tested. Follow-up collision changes received a targeted browser check rather than another full timed run. Rubble is ballistic and buildings use chunk cascades; there is no general structural physics solver.

Reproduce: serve the game folder on port 8080, install the pinned development dependencies and Playwright Chromium, then run `npm test`. Additional checks: `node tests/production.mjs` and `node tests/camera.mjs`. Raw measurements are in `test-output/report.json`.
