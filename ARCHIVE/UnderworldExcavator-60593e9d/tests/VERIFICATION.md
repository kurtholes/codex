# Recorded verification

Three-minute excavation navigator run, Chromium 141 via Playwright 1.56.1, 1280×714 viewport, LOW at 0.6 pixel ratio, ANGLE SwiftShader software rendering. No physical GPU performance claim.

| Check | Result |
|---|---|
| First fired shot, from navigation | **3.283 s** |
| First earned cannon upgrade | **4.472 s** after capture start |
| Charge/release actions | **14** |
| Destroyed chunks | **127** |
| Final equipment tiers | 1 / 1 / 1 / 1 / 1 / 0 |
| Low FPS, sampled mean / median / p10 | **5.20 / 5.29 / 4.62** |
| Console errors | **0** |
| Saved destruction and tiers survive reload | Pass |
| Rush starts with hover | Pass |
| Returning from rush preserves main progress | Pass |
| Production rejects development switch/API | Pass |

**Timing/performance caveat:** the browser stalled after the 42-second sample. The next returned sample was at 220.95 seconds and measured 0.018 FPS. Consequently the requested 180-second boundary screenshot was captured late, and the complete run including reload/rush/production checks took 483.8 seconds. The sampled FPS statistics do not represent sustained real-time throughput during that stall. This run does not meet or establish the 60 FPS integrated-GPU target. An earlier run also lost its browser; the completed run used `--disable-dev-shm-usage`.

Screenshots from the completed run are retained in ignored `test-output/`: `00-start.png`, `30-seconds.png`, `first-major-upgrade.png`, and `180-seconds.png`; raw metrics and output are `report.json` and `run.log`. The repeatable test now records capture offsets explicitly. Navigation uses development teleports/aim to reach surviving faces, while firing, movement and the first purchase use real input. Later branch purchases use the dev API with earned currency. This verifies the core action and persistence, not an unaided player route.

## Comparison to inspiration 60593e9d

- **Start:** ochre/umber palette, repeated high organic arch silhouettes, relief figures, rough timber and golden narrow shafts carry the image's cave-city setting. The result is visibly more stylized and regular; it does not reproduce the photograph's dense carving or photographic dust.
- **30 seconds:** the opened curtain reveals another neighborhood, side arches and timber spans. Angular debris and exposed traversable floor clearly communicate excavation. Low-preset grain is simplified and visibly more patterned than the source stone.
- **First upgrade:** a new luminous muzzle ring and larger barrel distinguish MK II; the cleared opening and rubble establish the action/result relationship.
- **End capture:** longer sightlines and a discovered cistern district demonstrate progression through the underground hall; bright projectiles and scattered rubble add gameplay contrast while preserving the warm silhouette language.

## Scope and remaining checks

Production hooks are removed by the build, not merely hidden behind a query check. Source and build pass Node syntax checks. The final production smoke check passed after the autoplay guard fix: six chunks destroyed, production API absent, zero console errors and zero warnings. Automatic district discovery no longer creates audio before user activation. Observed external requests contained only the pinned Three.js CDN module. Run `node tests/smoke.mjs` against the same local server to repeat it.

Not verified: physical laptop GPU frame rate, audible mix, touch hardware, gamepad hardware, five-minute rush completion, all 48 upgrade tiers, 30-minute balance, or browser compatibility beyond Chromium. The current finite city will need more branching districts to sustain active excavation throughout a long upgrade session.
