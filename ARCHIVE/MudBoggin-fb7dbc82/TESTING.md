# Verification

Inspiration image: fb7dbc82. Test date: 2026-10-24.

`npm test` serves the source and production build locally, launches pinned Playwright Chromium with SwiftShader, and steers through the course for **180 wall-clock seconds**. The driving loop uses normal throttle and steering inputs; it earns and purchases Tires II without developer cash or teleportation. Developer grants and teleportation are used afterward to isolate the later unlocks and finish/retry checks.

The run records actual frame intervals, independently of the physics safety timestep. The FPS figures describe this CPU-based headless renderer, not a laptop GPU benchmark. **The 60 FPS integrated-graphics target has not been demonstrated.** Low quality renders at 0.8 pixel ratio with reduced forest instances; medium/high increase resolution and tree counts. Debris and tire marks use fixed instanced pools.

Checks cover route rewards, obstacle destruction, rut creation, the first major upgrade, reload persistence, torque/gearing prerequisites, differential lock, winch movement, paddle unlock, quick-run motion/finish/retry, production movement, and absence of developer state in production. Audio is synthesized and starts from an input gesture; listening quality was not assessed. Physical touch and gamepad devices, Safari, long-term economy balancing, all 48 tiers over a real 30-minute session, and integrated GPU performance remain untested.

## Screenshots and source comparison

Screenshots and the machine-readable report are intentionally ignored under `test-output/`; running the test regenerates them.

| Capture | File | Comparison with the source photograph |
|---|---|---|
| 0 seconds | [Cockpit start](test-output/00-start.png) | Charcoal ATV fills the foreground with an oval right mirror; silver-gray overcast sky, chocolate ground and a green treeline preserve the photograph's composition and palette. |
| 30 seconds | [First crossing](test-output/30-seconds.png) | Puddles carry the sky's silver tone while the player drives between timber obstacles. Orange trail flags and lime feedback distinguish interactive objects. |
| First major upgrade | [Workshop](test-output/first-upgrade.png), [upgraded rig](test-output/first-upgrade-rig.png) | Tires II and its differential unlock are visible; chase view reveals the modeled vehicle and wider tires. |
| 3 minutes | [Continued riding](test-output/180-seconds.png) | The same weather, forest horizon and over-handlebar silhouette remain during open roaming, with crossing income and progression visible. |

Visual inspection found the first terrain pattern too regular and the sky too flat. The final version uses baked multiscale noise sampled with world-space triplanar coordinates, an overcast cloud shader, irregular puddle outlines and a mixed treeline. It remains a stylized procedural approximation: trees and water edges are simplified, puddles approximate reflections, the cockpit lacks photographic mud detail, and the ground does not geometrically deform. Replacement specifications are in ASSETS.md.

## Fixes from verification

The initial FPS overlay incorrectly used capped physics time; it now measures real frame intervals. Repeated per-fragment noise was replaced with a generated texture to reduce shader cost. Save-on-exit and save-on-hidden handlers prevent losing recent earnings between autosaves. Quick-finish checks wait for the rendered result screen rather than assuming a frame completes within 150 ms.

## Final measured result

The final automated run **passed** all functional assertions.

| Measurement | Result |
|---|---|
| Core driving duration | 180 wall-clock seconds |
| Navigation to throttle | 3.26 seconds |
| First action after game initialization | 2.98 seconds |
| Low-preset average FPS | 5.25 |
| Low-preset minimum FPS | 2.47 |
| Renderer | Chromium headless SwiftShader; 1280×800 low |
| Console / page errors | 0 |
| Crossings completed | 6 |
| Distance driven | 471.1 m |
| Destroyed obstacles | 1 |
| Persistent session rut cells | 258 |
| Earned major upgrade | Tires II |
| Save restored after reload | Pass |
| Prerequisites / diff / winch / paddles | Pass |
| Quick play / finish / retry | Pass |
| Production motion / developer hook stripping | Pass |

Static source/build equality and JavaScript syntax checks also passed. These results do not establish 60 FPS on integrated graphics.
