# Verification

Final core run: Chromium headless, 1280 × 720, low preset, ANGLE / SwiftShader software rendering. The test starts its own static server, begins from an empty save, and uses aim / movement / combat inputs. **No currency, health, kill or upgrade grants and no teleports are used in this run.**

| Measurement | Result |
|---|---:|
| Navigation → first movement | **2.784 seconds** |
| Simulation played | **181.6 seconds** |
| Wall time for combat phase | 198.4 seconds |
| Low FPS, mean rolling average | **9.66** |
| Low FPS, lowest rolling average | 8.08 |
| Console errors / page exceptions | **0** |
| Rivals defeated | 40 |
| Structures broken | 34 |
| Charges / throws / armor rips | 75 / 24 / 14 |
| Earned tiers fitted | 17 |
| Captures / recaptures | 12 |
| Workshop income | 941 salvage |

The bot visited multiple territories, captured and lost workshops, and bought Pistons II (long lunge), Armor II (river traction), and Pistons IV (cliff claws) using earned salvage. It used broad, aggressive strikes, interrupting windups; **timed parry is verified in the separate focused test**, not counted as covered by this run. It triggered 105 terrain impacts; the terrain retains the latest 30 crater deformations.

GPU geometry counts fell from 412 at the first sample to 317 at the last, despite 40 defeats, after explicitly disposing retired enemy and replaced upgrade geometry. This checks against per-enemy resource accumulation; it is not a general heap profiler. The recorded run passes **22 checks**, including exact source hashes, simulation duration, earned upgrades, combat, destruction, workshop income and captures. Run `node verify-report.mjs` to validate the saved report against current source.

**Performance limit:** the 60 fps target is not met by this software renderer. Physical laptop integrated graphics have not been available for verification. Low uses cheaper diffuse materials, 0.68 internal pixel ratio, fewer instances, no shadow maps and nearer LOD switches; medium/high retain metallic environment lighting and shadows. Auto detects software rendering and lowers resolution when slow. Do not interpret the measured software rate as a proven hardware rate.

## Captures and source comparison

- [0 seconds](test-output/00s.png): already facing a warden; curved sun-etched brass pauldrons, black iron, blue conduits, river and foundry silhouettes are visible. No title screen or cutscene blocks input.
- [30 seconds](test-output/30s.png): canyon foundry combat, damage numbers, upgraded chassis and captured workshops demonstrate roaming progression.
- [After first major upgrade](test-output/upgrade.png): Pistons II has been purchased; the next furnace ring is also fitted while the screenshot is captured. Piston assemblies and a blue furnace ring change the knight; broken architecture lies in the foreground.
- [Three minutes](test-output/180s.png): a larger sovereign is being winched amid toppled walls; additional chimneys, reels, rings and armor change the player silhouette.

These four captures were visually inspected against inspiration **96cd28c5**. The brass / iron / electric-blue contrast, peach sunset, green river plains and cathedral-mech silhouette carry across. The image has much richer weathering, atmospheric depth, cloud lighting and monumental proportions. Low-preset diffuse lighting is flatter, smoke is faceted, water is an approximation, and architecture is deliberately modular. This is a stylized procedural playable world, not reference-level photorealism. Screenshots and JSON reports are ignored test output and can be regenerated.

## Additional checks

`node smoke.mjs` covers the opening punch, staggered armor shield, attach / throw, riverbank escape without upgrades, intact-wall collision, charging through that wall, all 30 tiers, committed systems, save reload, full saved hull, Rumble entry/build choice, valley isolation, all presets and production stripping. Currency is granted only in this focused upgrade/save test. All **22 checks passed**, with no exceptions.

`node systems.mjs` covers timed parry, a blocked cliff before claws and successful ascent after, long-lunge distance, river traction, toppling/craters, a complete 90-second Rumble, result/replay and valley retention. All **13 checks passed** on the finished build, with no exceptions. Long-lunge travel increased from **15.4 to 39.0** world units; cliff claws reached **15.3** elevation where the base chassis stopped at the cliff. River travel over the sampled interval increased from **7.0 to 19.0** units. The complete Rumble ended with **84 defeats**, showed its result screen, replayed, and retained valley progression. Measurements are recorded in `test-output/systems.json`.

Build and syntax checks passed. Production contains no `window.__game`, FPS overlay or development block. Static files are included in `dist/`; no deploy workflows, commits or pushes were performed.

Not verified: physical integrated-GPU 60 fps, touch/gamepad hardware, prolonged 30-minute balance, browser engines other than Chromium, offline loading of the required CDN module, or save migration from earlier prototypes. Saves retain chassis, ownership and feats; destroyed props and debris are rebuilt between modes/reloads. Towers use deterministic falling collisions rather than a general rigid-body solver; winching and climbing use kinematic motion.
