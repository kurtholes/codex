# Verification

Automated browser checks use Playwright Chromium with SwiftShader (software WebGL), 1100 × 700 viewport and the Low preset. This is not a laptop GPU benchmark. The test holds fire, aims at live attackers, lifts the rig, moves across the roof, buys earned cannon upgrades, and builds defenses when affordable.

The first successful run recorded 68 kills, wave four, Ember Core tier three, 245 shots and zero console errors. First action: 2.95 seconds from navigation. Low preset average: 12.63 FPS. A host scheduling interruption produced an extreme minimum of 0.13 FPS and 3337.8 seconds wall time; simulated play was only 170.48 seconds, so the harness was corrected to require 180 seconds of simulation rather than 180 one-second waits. The final rerun is recorded below.

**Completed rerun:** 181.45 seconds of simulated play, 533.39 seconds wall time, first action at **2.25 seconds**, **70 kills**, wave four, Ember Core tier three, 261 shots. Low-preset average **12.69 FPS**, minimum **0.80 FPS** (software renderer / host stalls). **Zero console errors.** All four screenshot milestones were captured. Production test API remained absent.

Production `dist/game.js` contains neither the development switch nor `window.__SMOKE_TEST__`; opening production returned `undefined` for the test API. Source syntax and production build pass. Only the requested game folder is modified.

## Screenshots compared with reference

The automated captures are in ignored `test-output/`: `00s.png`, `30s.png`, `180s.png`, and `major-upgrade.png`.

- At load: the pointed huts, dense roof field, circular wooden walks, blue-black forest and central pale smoke reproduce the reference's spatial language. The current roofs are brighter and the circle more regular than the source; fine weathering is procedural rather than photographic.
- At thirty seconds: flight and lateral movement reveal the huts as real geometry. Amber cannon shells contrast with teal terrain. The original mood remains readable behind the HUD.
- After the major upgrade: the cannon becomes longer and its projectiles larger; roof and socket scale remain consistent. Twin exhaust wings belong to Flight Rig upgrades, which the automated run does not purchase.
- At three minutes: missing railing assemblies and broken hut foundations show persistent damage; defensive towers add amber silhouettes. The smoke and outer roof circle remain orientation landmarks.

## Limits

60 FPS on integrated graphics is a target, not a verified result. The ten-minute final boss, thirty-minute economy, every upgrade tier, canopy unlock, refresh persistence, audible sound quality, touch, and gamepad were not covered by the three-minute automation. Gamepad and the flooded hollow are not implemented. The initial interrupted run is retained here as a failed attempt, not counted as completed three-minute coverage.
