# Verification

Automated Chromium playthrough: **passed**, 2026-10-24. The core loop ran for at least 180 wall-clock seconds, followed by save/mode/build checks. Total measured run after setup was 195.126 seconds. A final smoke pass covers the refined canine mesh, upgraded wall scramble and stripped production interface.

| Measurement | Result |
|---|---:|
| Development state ready | 842 ms |
| First player movement | 4.58 s from navigation |
| Low preset, mean FPS | 3.70 |
| Low preset, minimum / maximum FPS | 1.55 / 8.57 |
| Console / uncaught errors | 0 / 0 |
| Actions dispatched | 77 |
| Kindness moments | 76 |
| Earned sunshine remaining | 955 |
| Earned Paws upgrades | 2 |

**Performance limit:** these numbers are from Chromium SwiftShader software WebGL at 960×600 in a shared cloud worker, with other active software-rendered sessions. They do not demonstrate the 60 FPS integrated-GPU target. The target remains unverified on laptop hardware. Rendering uses static mesh batching, instanced grass/flowers/skyline, pooled instanced debris and particles, bounded pool sizes, fog culling and automatic resolution/shadow/grass reduction. The simulation caps frame deltas for stability; the 180-second wall-clock soak advanced roughly 60 seconds of game simulation at this low frame rate. Quick-play uses wall-clock time, so its three-minute limit remains real time.

## What passed

- Real keyboard movement and sprint before ten seconds; immediate dog possession with no start screen.
- Cart body-check rescue, pickup and return of the ball to the child.
- Borrow swallow, reach the roof and dive; borrow neighbor and construct a platform.
- Break fences/crates into instanced physical debris, receive rewards and purchase two upgrades with earned currency.
- Repeated movement, jumping and destruction during the three-minute soak.
- localStorage survives reload; quick-play has three wishes and an isolated balance; returning to Wander restores main progress.
- Production runs without the development state API or FPS element, even with `?test` in its URL.
- Final smoke: four Paws tiers enable ascending the side of a house; final production renders and accepts movement with zero errors.
- Syntax checks and build succeeded. Source and built files remain within the requested folder.

The automation uses development teleports between activity locations to keep body-specific interactions deterministic. It tests the verbs rather than validating a natural route or a human player's understanding of every prompt. Test scripts are in `tests/`; generated artifacts live in ignored `test-output/`.

## Screenshot comparison with inspiration image 212e00e5

| Capture | Comparison |
|---|---|
| [First render](test-output/00s.png) | Keeps the golden meadow, mint haze, teal skyline, red-haired/red-shirted child, charcoal-and-honey dog and amber presence. Uses a playable rear camera rather than the reference's broad side view. The palette is retained; foliage density and painterly realism are simplified. |
| [30 seconds](test-output/30s.png) | Side-on dog silhouette, cream muzzle/chest and moving guardian filaments remain readable away from the opening scene. Garden houses establish the expanded neighborhood. |
| [Three minutes](test-output/180s.png) | Scattered timber and accumulated sunshine show the physical loop. The child and other hosts remain visible across the meadow. The world is more toy-like and geometrically rounded than the reference. |
| [First major upgrade](test-output/first-major-upgrade.png) | Paws II purchase changes to tier III display, larger dog/halo and stronger charge. Splinters, sparks and reward feedback show intervention; later tiers add a luminous body band. |
| [Final production](test-output/production-final.png) | Confirms the final build's sculpted canine ribcage/muzzle, dense foreground grass and production HUD without developer overlay. |

Captures at 0/30/180 seconds are measured relative to capture/soak stages rather than a single continuous cinematic timeline. The three-minute run preceded the final cosmetic mesh refinement and wall-climb smoke check.

## Not tested

Real integrated GPU performance, mobile/touch ergonomics, sound perceived through speakers, every tier's long-term balance, a 30-minute human session, quick-play timeout/win end-to-end, companion command at maximum Halo, and multi-browser compatibility. No deployment was performed.
