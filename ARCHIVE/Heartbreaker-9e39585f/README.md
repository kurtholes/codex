# HEARTBREAKER
Inspiration image: 9e39585f

A first-person chrome-heart slicing arcade toy beneath a dying sun. Click the world to play. Progression saves automatically; Quick Play is a one-life survival run. Reach the red rear gate after wave five to extract.

Controls: WASD move, mouse look, hold left mouse sweep, right mouse shoot/reflect with blade, Space dash, Shift sprint, Q cycle three weapon kits, Tab upgrades, E grapple after Vector III. Recharge at the red floor vent. Escape releases the mouse. Vector II enables wall boosts; Breach extends district access. Six permanent branches have eight tiers each.

Run `npm install`, `npm run build`, then serve this folder with `python3 -m http.server 8080`; visit `/dist/`. Three.js is pinned to jsDelivr 0.170.0, so initial loading needs internet access. No accounts, analytics or other runtime services. Audio is synthesized after interaction. Low/Medium/High and CPU-based Auto presets available.

Development: `npm run dev` builds test hooks; append `?test`. Hooks provide teleport, currency, spawn, aim, state, upgrades and FPS. `npm run build` removes these hooks from production. `npm test` runs a 180-second Chromium combat exercise and records screenshots/report under ignored `test-output/`. Run the dev build first.

Shortcuts: procedural architecture and instruments; façade pieces break rather than entire building structures. Hearts burst into instanced chunks rather than exact cut meshes. Slash direction is expressive rather than a strict rhythm scoring rule. Movement upgrades use wall boosts and grapple hops; no complex wall-running physics. No touch or gamepad support. Weapons share a procedural base silhouette. Tests use aim assistance and health replenishment; they do not establish human difficulty, long-term balance or hardware-specific performance.

Three improvements with the most fun impact: directional cut scoring with authored attack formations; physically split drone shells and collapsing walkways; dedicated models and behavior for each weapon kit.

Verification: final 188.9-second automated run recorded first action at 7.98s, 15 kills, wave 2, a purchased Edge upgrade and persisted currency; zero console errors. Low averaged 5.00 FPS using Chromium SwiftShader software rendering under shared CPU load. This is below the 60 FPS target; integrated-GPU testing remains outstanding. Simulation steps are capped, so the run covered three wall-clock minutes rather than three simulated minutes. Screenshots and the machine-readable report are in `verification/`; source comparison is in `VISUAL_REVIEW.md`. No claim of 30-minute balance testing, audio listening validation, mobile support or full upgrade-tree playthrough.
