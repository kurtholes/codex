# Verification

Tested 2026-10-24 with Playwright 1.56.1 / headless Chromium. Source was served by Python's local static server. Production was built with `npm run build` and separately loaded to verify the development API is absent, including with `?dev`.

The core-loop run lasted 180 seconds, followed by persistence and production checks (187 seconds total). It used keyboard/mouse input, development teleports to make traversal deterministic, and a development quality override. **No currency grant was used for the first upgrade.** The firing range yielded 75 scrap; the shell-mass upgrade cost 65. Later salvage brought the campaign balance to 26. Siege used its loaner stats and separate score.

| Check | Result |
| --- | --- |
| First action after game initialization | 3.202 seconds, including initial screenshot |
| Shots fired | 115 |
| Structure pieces destroyed | 16 |
| Final siege score | 25,665 |
| Natural salvage → garage purchase | Passed; shell mass tier 1 |
| Save / reload | Passed |
| Production development API stripping | Passed |
| JavaScript / shader / console errors | 0 |
| Low FPS average / minimum sampled rolling average | 6.21 / 5.08 |

The FPS measurement is **software WebGL (SwiftShader)** on a shared headless host, at a 1280×900 viewport and low's 0.65 rendering scale (832×585 render buffer). Other browser workloads were also active on this shared host. It is not evidence of integrated-GPU laptop performance. The 60 FPS target remains unverified. There were two driver warnings about screenshot `ReadPixels` GPU stalls. The test reports rolling frame averages, not precise frame-time percentiles. Simulation steps are capped during long stalls, so game time advances more slowly than wall time in this software-rendered run.

Screenshots are generated into ignored `test-output/`:

| Capture | Comparison with inspiration 195f7cae |
| --- | --- |
| `00s.png` | Preserves the cockpit foreground, converging cracked road, right-side amber diner, black horizon and dominant scarlet clouds. Stylized terrain and clouds are simpler and brighter; diner and highway are modeled geometry. |
| `first-upgrade.png` | Shows the purchased cannon car at the safe garage. The warm OPEN facade stays the visual anchor; chase view reveals the vehicle rather than the reference's cockpit. |
| `30s.png` | Garage forecourt, larger cannon and approaching dark creatures make the still scene playable. The diner remains intact during bombardment. |
| `180s.png` | Fast traversal, swarms and shockwave ring carry the action into the red wilderness; the distant amber diner remains readable. Silhouettes and black/red palette remain consistent. |
| `late-tier-flight.png` | Supplemental all-branch smoke test: winged cannon car, orbiting drones and flight. Uses granted currency to inspect the end-state. |

`node tests/upgrades.mjs` additionally purchases all 48 upgrade tiers with development currency, checks flight height, reloads to verify all tiers persisted, and captures the late-tier rig. This is an implementation smoke test, not progression-balance evidence.

Also checked JavaScript syntax and build output. Not tested: 30-minute human enjoyment or progression pacing, complete five-minute siege countdown, physical gamepad/touch devices, audio balance by listening, browser compatibility outside Chromium, or laptop GPU performance. The core test uses teleports, so it does not establish that unaided first-time navigation is intuitive. There is no automated source-image similarity score; the comparison above is visual inspection.
