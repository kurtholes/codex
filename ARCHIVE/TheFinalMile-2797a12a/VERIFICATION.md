# Browser verification

Automated Chromium / SwiftShader at 1280 × 714. Three minutes of wall-clock driving; held acceleration, periodic steering and handbrake, injected currency and first drivetrain/ram upgrades. Low preset. Detailed JSON and captures are generated in ignored `test-output/`.

The initial completed run recorded movement in 565 ms, average 27.38 FPS, minimum sampled 25.66 FPS, and zero console errors. This exposed excessive road-marking draw calls; markings were converted to two instanced batches. The second three-minute wall-clock run recorded first movement in 503 ms, average 25.88 FPS and minimum 25.16 FPS, with zero console errors. The 60 FPS target was not met in SwiftShader; instancing did not improve the measured software-rendered frame rate. Browser capture stalls reduced simulated progress to 42 seconds in this run.

A separate browser smoke check confirmed the city finish triggers, quick-play starts, a garage button buys suspension, and jumping raises the vehicle (observed height 0.29m shortly after input). Production build removes the development exports and never includes `dev.js`.

Visual comparison with the inspiration: the starting composition retains a dark rear-view coupe, glowing red taillights, straight highway vanishing point, amber earth and sky, angular mesas and a cool crystal skyline. The city has enlarged spires to remain readable at six kilometers. Procedural geometry is noticeably more angular and simplified than the photographic reference; the coupe lacks its rounded bodywork, and the sky uses stylized cloud bands. 30-second and three-minute frames demonstrate free desert traversal and the first-upgrade frame shows the ramming nose and rear spoiler.

Limitations: software rasterizer results do not establish integrated-GPU performance. No manual audio listening, real gamepad/touch test, full upgrade-tree balance run or multi-session persistence test. The three-minute run records actual frame rate rather than accelerating simulation; capped physics dt means simulation time can be shorter under slow rendering. Road collapse and full rigid-body physics are not implemented; see README scope notes.

Saved captures: [start](screenshots/0s.png), [30 seconds](screenshots/30s.png), [three minutes](screenshots/3min.png), [major upgrade](screenshots/upgrade.png). Raw metrics: [verification-report.json](verification-report.json). The final quick-play loaner isolation change was syntax-checked after this run, but not included in the full three-minute test.
