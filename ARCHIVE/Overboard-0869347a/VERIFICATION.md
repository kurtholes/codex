# Verification

The automated Playwright test runs a real Chromium/WebGL browser for at least 180 seconds. Initial recovery, first hull expansion, movement, boarding, wreck breaking, and upgrade purchases use keyboard/UI controls. Developer teleports make travel between wrecks deterministic; collection during those assisted hops calls the same interaction method. No currency is granted in the sustained test. This exercises systems, not unassisted balance or player enjoyment.

Full samples and screenshots remain in the ignored `test-output/` folder. The test uses a fixed development seed for reproducibility. It also uncovered and fixed wreck placement inside reef collision envelopes. Generated wrecks now spawn clear of those landmarks.

## Visual comparison to inspiration 0869347a

Reviewed the supplied photograph alongside the start, first upgrade, 30-second, and three-minute game captures.

| Capture | Compared with the source |
|---|---|
| `00s.png` | Honey gold and smoky umber, low pale sun, tiny dark head amid broad swells. The swimmer starts centered with a reachable plank. The game is brighter and more legible than the photograph's soft dark troughs. |
| `first-upgrade.png` | Broad wave silhouettes and gold reflection remain; added lashings/deck width make progress visible without an introductory panel. |
| `30s.png` | Mast, cloth, bell, windmill, and barrel silhouettes turn the original survival setting into a useful moving foothold. Palette stays warm. |
| `180s.png` | Expanded raft, taller sail, stored cargo and machinery show permanent power growth. Distant shoals still invite travel. |

The source's dense spray, optical droplets, and translucent wave faces are simplified into procedural mist, foam/ripple marks, camera bob, and a screen spray layer. Low intentionally sacrifices fine surface grain. The result interprets the place rather than reproducing the photograph. No source photograph is needed at runtime.

## Scope of the checks

The sustained test verifies first recovery, deck growth, swimming/steering, boarding and exposure relief, repeated wreck destruction, salvage, all six upgrade disciplines, submersible/deep-hold interaction, localStorage reload, rescue victory, rescue timeout, and separation of rescue/voyage saves. The production check loads `dist/` with `?test`, confirms there is no developer API, exercises recovery/construction and rescue, compiles every quality preset, and records external requests.

Not verified: physical integrated-GPU performance, physical gamepad/touch devices, unassisted 30-minute balance, subjective sound quality, and browser coverage beyond Chromium. Software rendering is a functional test environment, not evidence of meeting the laptop frame-rate target.

## Measured sustained run

| Measurement | Result |
|---|---|
| Duration | 183.3s wall; 183.2s simulation |
| Time to first action | 2.30s |
| Low average FPS | 10.5 FPS |
| Rendering environment | Chromium / ANGLE Vulkan SwiftShader; no physical GPU available |
| Viewport | 1280 × 714; low rendering scale 0.75 |
| Recovered / broken | 251 salvage interactions / 20 wrecks |
| Progression exercised | All 30 tiers through normal costs, with assisted travel |
| Console errors | 0 |
| Target 60 FPS laptop | Not verified; software rendering does not meet this target |

Screenshots: `test-output/00s.png`, `first-upgrade.png`, `30s.png`, `180s.png`, and `dive.png`. The 30s and 180s checkpoints occur at the next completed loop, so they may be slightly later than their labels. A separate `production.png` captures the shipped build.

Production checks passed: developer API absent with `?test`; first salvage and hull purchase; low/medium/high/auto shader rendering; rescue start. Console errors: 0. The only external request was the pinned Three.js CDN module.
