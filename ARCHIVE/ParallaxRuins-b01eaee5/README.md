# Parallax Ruins
Inspiration image: b01eaee5

A small third-person parchment playground: tip the giant cross, leap into striped ruins, hold one eye closed to walk fractured checker bridges, break brittle walls and grow six tools through six tiers. Main mode saves locally. Quick play supplies upgraded tools and shuffles a three-seal route with a three-minute clock and time medals. Select Quick Play again to restart.

## Play and build
Serve this folder with `python3 -m http.server 8000`, then open `/dist/`. The static production build is included. Three.js is pinned to **0.170.0** on jsDelivr; the initial module request requires connectivity. No other runtime dependencies, remote services or telemetry. Sound is synthesized after interaction.

Rebuild with `node build.mjs`. Development lives in `src/`; production lives in `dist/`. To test: `npm install`, `npx playwright install chromium`, `npm test`; `node tests/smoke.mjs` runs the focused route/quick-play checks. Test dependencies and output are ignored locally. No deployment workflow.

## Controls
WASD / arrows move; drag to orbit; wheel to zoom; Space jumps; Shift runs; E tips the nearby timber or smashes nearby walls; Q holds one-eye sight (look down the checker route); R restores nearby broken walls and returns to the last seal; F pulls toward a nearby seal after buying Tether. Tab opens tools. Escape closes tools. Touch buttons cover movement, jump, push and sight. Graphics menu offers Auto, Low, Med and High; music-note button mutes sound.

Walk onto a seal pedestal to earn currency. Pedestals recharge in 25 seconds. Spend seals in the tool garden. Grip improves jumps and lets held Space scramble up nearby ledges; Tether reaches elevated regions. Higher tiers require neighboring tool levels, shown by their icon. Higher tools increase reach, speed and rewards; copper bands accumulate on the traveler. Save is under `parallax-ruins-v1` in localStorage. Clear that key to reset.

## Verification
The dev-only `?dev` switch exposes `window.__game`: state, teleport, currency, upgrades, interactions and FPS overlay. `build.mjs` strips the entire debug block; production ignores the switch. Automated Chromium testing exercises three minutes of keyboard movement, pushing, sight, jump, rewind and beacon circuits, using teleport between landmarks to cover the small world. It captures load, roughly 30 seconds, three minutes and the first movement-tool upgrade; checks persistent upgrades, quick mode and production debug removal. Measurements and results are in `VERIFICATION.md`.

Not tested: physical integrated-GPU hardware, gamepad, mobile browsers, long-session balance or a fully manual end-to-end route. No gamepad support. Touch controls are basic.

## Shortcuts and next fun improvements
Collision uses height surfaces rather than rigid-body simulation. Timber tips around a scripted hinge; fragments animate and walls disappear into a pooled debris burst rather than simulating individual heavy bodies. One-eye sight tests view direction and range rather than true screen-space fragment overlap. Routes are compact; quick-play shuffles target order rather than rebuilding geometry. The procedural surface uses world-coordinate triplanar grain; it is intentionally an etched approximation of the reference image.

The three changes most likely to improve fun:
1. Add sliding/rotating timber blocks with physical collisions and player-controlled leverage.
2. Replace direction-based bridges with authored perspective-overlap challenges and clearer shadows.
3. Expand cliff interiors and give higher tool tiers unique movement combos and new route geometry.
