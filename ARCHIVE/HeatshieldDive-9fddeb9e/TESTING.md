# Verification

## Three-minute automated playthrough

Chromium headless, SwiftShader software renderer, X11 Ozone; 1280×720 viewport, Low preset (960×540 internal render). Test script: `tests/playthrough.mjs`. No currency grants, teleports or invulnerability were used in this run; the development hook supplied directional/button inputs and read telemetry.

| Measure | Result |
| --- | --- |
| Wall-clock play duration | 180.291 seconds |
| Load → first player input | 1.952 seconds |
| Low FPS, median | 35.74 |
| Low FPS, 10th percentile | 17.35 |
| Lowest rolling FPS | 16.17 |
| First earned shield purchase | 1.789 seconds after test-loop start |
| Rescue reached | 120.228 seconds |
| Quick mode entered | 120.814 seconds |
| Console errors / warnings | 0 / 0 |
| Upgrade persisted after reload | Passed |
| Production test hook absent | Passed, including `?test=1` |
| External production requests | 0 |

The run collected salvage, bought the first ceramic shield tier, carved near wrecks for multipliers, took impact damage, cooled the shield, deployed a chute, landed, walked/sprinted to the mast and transmitted. It banked 694 salvage on rescue and entered a quick dive. At the three-minute capture the quick dive was at 59.4 seconds with an ×8 multiplier. Full quick-mode expiry and the remaining upgrade branches are covered by the separate smoke test.

Two issues found during verification were corrected: the result overlay blocked quick-mode navigation and the workshop; long-distance instanced fragments needed persistent visibility bounds. Landing now snaps the camera to the surface. A final review also made Low's collision count match its visible instance count. Syntax/build checks were repeated after those fixes. The subsequent slow-renderer smoke check found a simulation-clock dependency in quick mode and a premature landing at the final fraction of a second. Quick mode now uses elapsed time and ends directly at 60 seconds; only expedition mode can transition to the surface. Movement still uses a bounded physics step. Test harness timers use the monotonic clock.

## Screenshot comparison

Artifacts are intentionally ignored in `test-output/`, including `report.json`, `smoke.json`, and these captures:

- `00s.png`: recognizable black-space / blue-Earth composition, diagonal ribbed station, orange fire and white EVA silhouette. The opening porthole expands away during the first four seconds. The reference has more photographic smoke, surface wear and a denser broken hull.
- `30s.png`: station has passed behind the player; Earth remains the destination and the suit/heatshield silhouette stays legible. HUD confirms heat control and a ×4 score chain. Earth uses procedural cloud noise rather than reference-grade satellite detail.
- `first-upgrade.png`: earned shield purchase, enlarged tile platform and installation feedback; the station/fire composition remains visible. This is the first mechanical upgrade, not an endgame suit.
- `180s.png`: post-rescue quick run, deployed canopy, tilted shield, visible jet flames and ×8 multiplier. Orange heatshield and cyan limb preserve the reference palette; the canopy and trek are deliberate gameplay additions.
- `rescue.png`: successful signal result and replay/upgrade actions.
- `surface.png`, `max-upgrades.png`, `quick-complete.png`: focused smoke-test captures.

## Limits

Software GL is not an integrated laptop GPU benchmark. The 60 FPS target is not hardware verified. Touch/gamepad behavior, sound quality on real speakers, long-session save durability, human difficulty and thirty-minute progression balance remain untested. The art comparison is a manual silhouette/palette/mood review, not an image-similarity score. The terrain is a procedural bounded island, and the entry-to-surface transition uses separate scenes.

## Final focused check

`tests/smoke.mjs` completed successfully against the final source: **36/36 purchases**, all six branches capped at tier six, surface movement verified, workshop opened and closed over rescue results, and a complete quick run ended at **60.0067 seconds** in `phase: end`, without entering the trek. Console errors: **0**. Currency grants and a mast teleport were used only for the upgrade/UI portion of this focused check. The full three-minute run above used earned salvage and normal movement.
