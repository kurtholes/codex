# Verification

Automated Chromium / Playwright test on the final gameplay build: **passed**. The active core-loop run lasted **180.017 seconds**, followed by quick-play, persistence and production checks. Machine graphics were Chromium SwiftShader (software rasterization), with no physical GPU available.

| Measurement | Result |
|---|---|
| First action after game initialization | 0.386 s |
| Navigation to first observed shot | 4.732 s (includes screenshot and polling) |
| Low preset, 1280 × 800 viewport, 0.7 render scale | **3.61 fps average** over 652 frames / 180.40 wall seconds |
| Main shells fired / targets destroyed | 23 / 20 |
| First naturally earned upgrade | Mass I, 10.9 s into active run |
| Purchased tiers by end | Mass II, Cascade I, Wings V, Reactor III |
| Console errors | **0** |
| Three-way quick-play pickup / return to main save | Passed |
| Progress persisted after reload | Passed |
| Production debug API / FPS overlay absent | Passed |

FPS is total frames divided by wall-clock time, including capture stalls, rather than a flattering average of instantaneous frame rates. Software rendering is slow and variable on this shared environment. **The 60 fps integrated-laptop target is unverified and was not achieved in this software-rendered test.** Low caps debris at 220, uses 550 instanced rocks, 25 fog sprites and 0.7 pixel ratio. Medium/high raise those budgets. Carriage LOD switches at 220 m; static meshes are batched by material. Gameplay physics steps are bounded on very slow frames, so this run covers about 34 seconds of simulation during three minutes of real input. The quick-play timer intentionally uses wall time.

The automation holds artillery, uses actual keyboard movement at the start, then uses development-only teleport/aim hooks to keep attacking fresh targets. It buys upgrades with earned energy; the currency-give hook is available but unused. This verifies the repeated loop rather than human navigation skill or long-term balance. The supplementary production smoke check also passed with zero console errors: mouse capture/release, synthesized audio initialization, mute persistence after firing, menus, the real-time quick-play pickup and absence of debug controls. Results: [production-smoke.json](screenshots/production-smoke.json).

## Reference comparison

The supplied image was inspected directly; it is intentionally not bundled. Inspiration image: **3fbe3bda**. These four retained captures are from the automated run, at the low preset:

| Capture | Comparison with the source |
|---|---|
| [0 seconds](screenshots/00s.png) | Preserves a centered white traveler, curving rust railway, derelict carriage on the right, cyan closed-eyed giants, cobalt sky and violet horizon. Faces and root trunks are modeled geometry. The landscape is wider and flatter than the source; source-quality sculpting and volumetric mist are not reproduced. |
| [30 seconds](screenshots/30s.png) | The player has moved into the yard. Breakaway panels, luminous shells, damage figures and energy introduce motion while the giants stay still. Elevated tracks create a visible destination. |
| [First upgrade](screenshots/first-upgrade.png) | Mass I is purchased from destruction income. Bright shells have larger geometry and blast radius, with fragments still falling from the first carriage. |
| [3 minutes](screenshots/180s.png) | The run reaches the drowned-station district, with larger shells, stronger flight progression, destroyed train panels and overlapping tracks. The white traveler remains legible against blue and violet silhouettes. |

Art limitations: simpler facial anatomy and trunk weave, sparse ground dressing, opaque water without reflections, and sprite fog rather than volumetric fog. White ribbons animate procedurally rather than using cloth simulation. The source's oxidized orange is more muted under the game's blue lighting. The composition and palette carry the reference; fidelity is a stylized procedural interpretation.

Not verified: a physical integrated GPU, audible mixing on speakers, a full five-minute quick-play completion, all 64 tiers in a 30-minute human session, high-altitude navigation, mobile browsers, gamepad or assistive-technology accessibility. All branches are implemented, but the automated purchase path exercises four of them.

Machine-readable summary: [results.json](screenshots/results.json). Full sampled telemetry stays in ignored `test-output/report.json`. Re-run with `npm test`; `node tests/smoke.mjs` runs the supplementary production check.
