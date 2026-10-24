# Brass Colossus
Inspiration image: 96cd28c5

Pilot a brass knight in a sunset river valley. Punch, parry, charge through walls, throw rivals into towers and tear off armor to wield. Capture foundries for salvage and repairs; build a visibly changing chassis across **30 tiers and 10 competing systems**. Foundry Rumble is a separate **90-second survival** mode with three ready-made builds.

Run `npm install`, `npm run build`, then `npm run serve`. Open **http://localhost:8080/dist/** for production, or `/` for development. The static `dist/` is included. Three.js **0.170.0** loads from jsDelivr; that module download requires internet. Everything else is local, including synthesized audio and localStorage saves. No accounts, analytics or deployment workflows.

| Control | Action |
|---|---|
| WASD | Walk |
| Mouse / arrows | Look / turn |
| Left mouse | Strike; third blow finishes |
| Right mouse / Shift | Timed parry, then held brace |
| Space | Shoulder charge |
| E, then E / strike | Winch, then directional throw |
| R after a hit | Rip armor into shield / club |
| Tab / F | Select branch / fit tier |
| Q / system buttons | Choose system before tier III |
| Escape | Release mouse |

Pistons II unlock long lunges, Armor II riverbed traction, Pistons IV cliff claws. Clear defenders and step inside a foundry to capture it. Captured workshops generate salvage and repair nearby hulls. Rivals can contest unattended workshops. Rumble buttons or 1–3 select Brawler, Runner or Bastion; valley progression stays separate. Graphics and sound controls sit at top right. Basic gamepad support: left stick move, right stick look, A strike, B charge, X winch, Y rip, left trigger brace, right bumper upgrade. Touch has a movement stick, drag look and combat buttons.

`node test.mjs` starts its own local server and performs a three-minute combat run with earned upgrades, FPS/error reporting and four captures in ignored `test-output/`. `node smoke.mjs` checks mechanics, all tiers, local saves, mode isolation, presets and production stripping. `node systems.mjs` checks mobility, timed parry and a full Rumble/replay. Chromium must be installed (`npx playwright install chromium` if missing). Development exposes `window.__game` for state, teleport, currency, input and FPS. The build removes that API and overlay. Verified: 181.6 simulation seconds, 40 defeats, earned upgrades and workshop income; zero console errors. First action: 2.8 seconds. Low averaged 9.66 fps in software-rendered headless Chromium; physical laptop 60 fps remains unverified. Full results and image comparison: [VERIFY.md](VERIFY.md).

Shortcuts: towers use deterministic falling collisions and pooled rubble, rather than a general rigid-body engine. Clouds, surface wear, water reflection and armor are stylized procedural approximations. Punches use broad melee arcs; ripped armor is a limited-use tool. Factory manufacturing is timed salvage/repair income. Saves retain chassis, workshop ownership and feats, not individual rubble positions. Physical integrated-GPU performance, touch/gamepad hardware and 30-minute balance remain unverified.

The three changes most likely to improve fun:
1. Add rival-specific attack patterns and directional combo finishers.
2. Add articulated wrestling takedowns and more tower chain reactions.
3. Add territory-specific machinery rewards and richer workshop defenses.
