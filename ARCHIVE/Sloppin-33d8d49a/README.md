# Sloppin
Inspiration image: 33d8d49a

A third-person mud-pig destruction toy. Start rooting immediately, eat the cabbage field, grow, evolve six permanent upgrade branches, and wreck the orchard and old piggery. Wallow Sandbox grants all upgrades and offers mud depth and a fresh-farm reset.

Serve `dist/` with any static HTTP server, for example `python3 -m http.server 8000 --directory dist`. Three.js **0.170.0** uses the pinned jsDelivr module URL; that initial library download needs internet. There are no gameplay network calls, accounts, telemetry, or other runtime dependencies. Audio is synthesized after the first click or key press.

- WASD / arrows: move and steer. Drag mouse: turn.
- Space: hold to root. Shift: charge; evolved hide enables the belly-surf pose and faster movement.
- E: head toss. U: anatomy and infrastructure upgrades.
- Buttons support touch; a touch direction pad appears on coarse pointers.
- Graphics selector: auto, low, medium, high. Progress saves to localStorage in main mode.

Build: `npm install`, then `npm run build`. The build copies the static page and strips the developer block from `dist/game.js`. Source and production build are included. No deployment workflow is used.

Development: serve this folder, open `/?test` for `window.__game`: teleport, give feed, upgrade, action, state, quality and FPS overlay. These hooks are removed from production. `npm test` starts a local static server on port 8033 and runs the Playwright browser exercise; install Chromium with `npx playwright install chromium` if needed. `npm run test:smoke` checks saving, sandbox reset, main-mode restoration and production startup. Test output and node_modules are ignored locally. See TESTING.md for measured results and screenshots.

Shortcuts: collisions use radial arcade damage; destroyed structures disappear into pooled ballistic fragments, without structural simulation. Ruts are persistent dark ground decals rather than excavated terrain. Flooding expands a surfable-looking puddle, with no fluid simulation. Deliveries regenerate cabbage heaps near the pig. Tree crowns and cabbage heads remain simplified procedural shapes. There are no drainage tunnels, thorn biomes, gamepad controls, true bank scrambling, or bespoke lunge animation. Terrain slopes, three farm regions, 32 upgrade tiers and local progression are implemented. The sandbox timer continues to free play at zero.

The three changes most likely to improve fun:
1. Replace radial hits with snout contact, carried props and physically connected shed fractures.
2. Add deformable mud, downhill surfing momentum and breach-driven water flow.
3. Give each anatomy branch distinctive animations and new routes through tunnels and orchard terraces.
