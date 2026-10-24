# The Sleeping Ones
Inspiration image: 3fbe3bda

A wordless 3D flight and demolition toy. Hover beneath sleeping moon faces, send enormous slow shells along abandoned railway lines, and turn derelict carriages and root bridges into drifting dream energy. Eight branches × eight permanent tiers change artillery, ribbons, attraction, companions and movement. A separate five-minute quick-play run starts with powerful flight and offers three-way upgrade pickups.

Play [dist/index.html](dist/index.html) through a static HTTP server. From this folder:

```sh
python3 -m http.server 8080
# Open http://localhost:8080/dist/
```

Controls: WASD / arrows glide; mouse aims; hold left click fires. Space rises, C descends. E opens upgrades; Escape releases the mouse. Wings I unlocks Shift boost, II sustained lift, III Q dash, IV high soaring. Clicking the scene captures the mouse and enables synthesized sound. The sound button mutes it. Basic touch buttons are included; keyboard and mouse are the intended controls.

Progress saves locally. Main currency and upgrades are restored after quick play. LOW / MED / HIGH / AUTO changes resolution, fog density and debris budget; AUTO uses hardware concurrency and device pixel ratio. The only external request is the pinned Three.js 0.170.0 jsDelivr module. No gameplay services, accounts, telemetry or external art/audio.

Build with `node build.mjs` (no build dependencies). Source is in `src/`; the static `dist/` build is included. `node build.mjs --dev` creates an ignored test build with teleport, currency, upgrade, aiming and state hooks plus an FPS overlay. Production strips that entire block.

For tests, `npm install`, `npx playwright install chromium`, then `npm test`. The automated run plays for three real minutes with held artillery, keyboard movement and scripted travel/aiming, purchases an upgrade using earned energy, samples frame rate, captures four screenshots, checks quick-play pickups and main-save isolation, reloads saved progression and verifies production has no debug API or overlay. Test artifacts and dependencies stay ignored inside this folder. The final three-minute run passed: 23 shells, 20 destroyed targets, zero console errors; first action after initialization was 0.386 seconds. Low averaged 3.61 fps under software rendering; 60 fps on laptop hardware remains unverified. See [VERIFICATION.md](VERIFICATION.md) for results and the image comparison.

Shortcuts: destruction uses authored breakaway parts and lightweight ballistic debris rather than rigid-body simulation. Collisions are generous target volumes, with aim assistance. The world has three continuous regions and recycled salvage, rather than bespoke missions. Giants remain still; distant terrain is intentionally sparse. All art is procedural; replacement prompts and specs are in [ASSETS.md](ASSETS.md).

Not verified: physical integrated-GPU hardware, audible speaker balance, extended 30-minute balance, mobile browsers, gamepad, accessibility with assistive technology. Touch is a basic fallback. The 60 fps laptop target needs hardware verification.

The three changes most likely to improve fun:

1. Give rail-skimming boosts curved launch ramps and more expressive banking.
2. Add carriage piles and multi-support bridges with larger cascading collapses.
3. Add rare artillery mutations and distinct elevated districts to make later upgrades more surprising.
