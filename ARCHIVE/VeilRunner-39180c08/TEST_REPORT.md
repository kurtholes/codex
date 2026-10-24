# Verification report

Inspiration image: 39180c08

## Method

Chromium / Playwright, 1280 × 800 viewport, low preset (0.75 rendering scale), headless WebGL. The browser drives ordinary movement around solid-building collisions using a development-only grid route driver. It earns all purchase currency through routes and crystal destruction; no teleports or currency grants are used during the three-minute main session. Real keyboard input starts the run. The script samples FPS every two seconds and stores incremental checkpoints. A complete quick run follows the main session.

The machine has no `/dev/dri` GPU device. Its software-renderer results are a constrained functional baseline, not a laptop integrated-GPU benchmark. Shared host load also affects timings. The 60 fps laptop target remains unverified.

## Measured results

Full test **PASS**, on Chromium's ANGLE / Vulkan SwiftShader software renderer.

| Check | Result |
|---|---|
| Time to first action | **By 4.501s** from navigation start, including initial screenshot capture; first movement at simulation time 1.40s |
| Main traversal | **180.127 wall seconds**; 105.25 active simulation seconds because physics clamps long frames |
| Core loop | **17 routes**, **31 screens shattered**, **9 earned-currency purchases** |
| First major upgrade | Stride II purchased, increasing sprint speed and trail strength; screenshot captured |
| Contrast adaptation | Started at 72%, reached approximately 57%; V restored 85% |
| Low FPS | **6.01 mean**, **5.23 median**, 2.63–15.51 sampled range, under shared-host software rendering |
| Quick play | Full 60 simulation seconds, **18 routes**, **100% detection accuracy**, **0.8s best split**; retry resets timer |
| Persistence | Upgrade tiers survive page reload |
| JavaScript errors | **0** |
| Console errors | **0** |
| External runtime requests | **0** |

These measurements do **not** establish 60 fps on a laptop. The low software frame rate also slows simulation through the physics timestep cap. Initial load is interactive without menus or pointer lock; clicking is required only for captured mouse look and audio activation.

Raw metrics: `test-output/report.json`; incremental samples: `test-output/partial.json`. An earlier long-run process was interrupted before its final checkpoint; the results above are from the subsequent complete run.

## Production build check

`npm run test:production` **PASS**. The shipped `dist/` earned 37 resonance through keyboard movement, opened all six branches / 48 tier nodes, applied the visibility slider and reset, started quick play, and rendered the settings panel at 390 × 844 touch size. No development bridge, route driver, teleport or FPS overlay exists in production. Zero production console errors and zero external requests. Raw results: `test-output/production-report.json`; additional captures: `production.png` and `mobile-settings.png`.

## Screenshot comparison

Screenshots are in ignored `test-output/`, at the exact viewport above. `00s` is the first rendered view, before movement; 30s and 180s are wall-time checkpoints after movement starts. The major-upgrade capture shows the skill web immediately after buying Stride II with earned currency.

| Capture | Comparison with inspiration |
|---|---|
| `00s.png` | Preserves the lone dark-coated figure in the center, enormous spherical lanterns, blue-gray paving, pale Gothic street walls and bright silver distance. Uses crisp modeled tracery and restrained procedural reflection bands. The source has richer fog, more organic apparitions and softer architectural edges. |
| `30s.png` | The camera has freely moved into the city; pale crowds, lattice globes and pointed ribs remain the visual language. The source's fixed composition is intentionally replaced by navigable streets. Contrast decreases after successful routes while UI stays readable. |
| `first-major-upgrade.png` | Same restrained pearl/blue palette behind the translucent skill web. Stride II confirms persistent growth; the web pauses movement. |
| `180s.png` | End-of-session district framing and reduced contrast are compared for consistent silver lighting, silhouette readability and low-saturation color. This is stylized geometry rather than a photoreal recreation. |

## Limits

Automated movement cannot establish subjective fun or actual low-contrast discrimination ability. Audio events are synthesized and exercise the browser audio graph, but sound quality has not been human-auditioned here. No claim of eyesight improvement. Real laptop GPU performance, physical touch/gamepad controls, all 48 upgrade combinations, offline income over an actual eight-hour wait, and a real 30-minute session remain untested.
