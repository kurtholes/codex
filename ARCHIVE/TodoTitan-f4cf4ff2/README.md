# TO DO / TITAN
Inspiration image: f4cf4ff2

A playable 3D flight demolition toy inside a paperwork-spewing machine cathedral. Opens directly in the arena. Campaign has 48 upgrade tiers and local saves; Quick Shift lends a powerful rig for a three-minute score attack.

Serve this folder with `python3 -m http.server 8123`, then open `http://localhost:8123/dist/`. Three.js **0.170.0** loads from jsDelivr; that pinned module request is the only network dependency. No accounts, analytics, external audio or application API calls.

Controls: WASD fly, mouse drag or pointer lock look, hold left mouse (or F) fire, Space rise, Ctrl/C descend, Shift dash, E upgrade, Escape close upgrades/release mouse. Flight tier 2 reaches eye platforms; tier 4 enables R rail surfing near the silver side rails. The top buttons switch modes, audio and quality. Gamepad supports sticks, right trigger, A/B height; touch supports drag aim and firing, but lacks a complete movement layout.

Build: `npm ci && npm run build`. The dependency-free Node build copies source to dist and strips the development block. Runtime requires no npm packages. `src/?test=1` exposes teleport, currency grants, upgrade purchase, aiming, state and FPS overlay. Production ignores that switch.

Verification: `npx playwright install chromium`, serve on port 8123, then `npm test`. The script holds fire, moves, targets new banks, collects salvage, purchases the first upgrade, checks Quick Shift and confirms the production test API is absent. It records screenshots at load, 30 seconds, 180 seconds and the first upgrade in ignored `test-output/`. See TESTING.md for measured results and visual comparison. Tests use software WebGL; real integrated-GPU 60 FPS, physical gamepad, mobile input, audio listening and a full 30-minute progression session remain unverified.

Shortcuts: simplified chunk physics and proximity collision; the titan shell and floor are permanent, while paper banks, column sections and organ rings regenerate. Paperweight and chain branches modify the staple shot rather than separate weapons. Idle machinery provides active-session passive income, without offline accrual. Drones are visual magnet upgrades. No enemy combat or failure health. No full rigid-body solver, authored textures, bloom pass or music. Area progression is primarily altitude and movement access. Debris and waterfall are instanced; fixed-count distant machinery replaces elaborate LOD assets.

Three changes that would most improve fun:

1. Add moving mechanical organs and attacks that force aerial dodges.
2. Give paperweights and chain shredders distinct alternate-fire inputs and effects.
3. Add linked structural supports so whole multi-level chambers can collapse.

All art and sound are procedural. ASSETS.md lists generation prompts and replacement specifications. DESIGN.md was written before implementation. No deployment workflow is included.
