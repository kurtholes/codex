# BASS REVENANT
Inspiration image: dfc51149

A rain-soaked rooftop destruction shooter. Charge slow bass waves, counter sword returns, break towers, capture nine sound rigs, and evolve a hooded speaker warrior. District Run saves 48 upgrade tiers, salvage and captured-rig income locally. Quick Drop gives you flight and an oversized cannon for a three-minute score attack. Captured rooftops keep receiving stronger samurai reinforcements.

## Play
Serve `dist/` over HTTP, then open the printed local address:

```sh
cd ARCHIVE/BassRevenant-dfc51149
python3 -m http.server 8080 --directory dist
```

WASD moves; mouse aims while firing (pointer lock where supported). Hold left mouse to charge, release to fire. Space jumps/hovers; F or right mouse counters nearby red volleys. Tab opens upgrades. Hover Drive II unlocks flight, III adds Shift/double-Space dash, IV adds wall launches and surfing alongside your waves. Settings select low/medium/high or automatic quality. Escape pauses. Touch buttons and a standard gamepad have basic support.

## Build / test
Node 20+; production has no package/runtime dependency beyond bundled Three.js.

```sh
npm install
npm run build
npm run dev
```

`npm run dev` serves the development build at port 8080. In a second terminal:

```sh
npx playwright install chromium
npm test
```

`node tests/movement.mjs` checks wall launches on the dev server. `node tests/production.mjs` checks a separate `dist/` server on port 8081.

The dev build exposes `window.__TEST__` (teleport, currency, state, attacks, FPS). Production build removes that entire block and overlay. Tests and output are ignored under `test-output/`; representative captures and results are retained in `verification/` and `VERIFICATION.md`.

Three.js is pinned to **0.160.1**, obtained from [this exact jsDelivr module](https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js) and vendored in both source and `dist/`. It makes no runtime CDN request. Audio is synthesized; no accounts, analytics, network services or deployment workflows. Local saves use `bass-revenant-dfc51149-v1`; browser site-data clearing resets them.

## Limits / next improvements
Procedural stylization replaces photoreal materials and character animation. Destruction uses segmented mesh removal, instanced flying chunks and rubble rather than rigid-body simulation. Concrete is world-position triplanar; wet highlights use procedural shading rather than screen-space reflections. Distant architecture is simple merged geometry, crowds/debris/equipment/waves are instanced, and low quality reduces render resolution. The lower district is an open flooded ground plane with elevated roof combat; it is not a detailed street simulation. Input and upgrade panels pause gameplay. Music is omitted; attacks form the beat.

The three changes most likely to improve fun:

1. More deliberate samurai parry tells, distinct blade styles and a perfect-return score ladder.
2. Moving fortress bosses and recoverable district defense events with unique sound rigs.
3. Authored rooftop routes for dash chains, wall-launch routes and longer wave-surf combos.

Testing scope, measured performance and visual comparison are in [VERIFICATION.md](VERIFICATION.md). Desktop integrated-GPU 60fps, audible mix quality, touch usability, gamepad hardware and a 30-minute balance session require hands-on validation. See [ASSETS.md](ASSETS.md) for replacement prompts and target specifications.
