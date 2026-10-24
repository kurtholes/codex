# Brass Horizon
Inspiration image: 7501e781

Pilot a brass-and-mahogany airship through floating industrial foundries. Hold fire to smash pressure tanks and collapse factories; follow the salvage, then refit in flight. The persistent frontier has 48 upgrades across six branches. Quick Sortie offers three powerful loadouts and five minutes of demolition.

## Play / build

Serve `dist/` with any static HTTP server and open `index.html`. No runtime network, accounts, analytics or asset downloads. Three.js **0.170.0** is bundled unchanged from the pinned jsDelivr URL recorded in ASSETS.md; there are no other runtime dependencies.

From this folder:

```sh
npm run build       # Node 20+, no install needed for building
npm run preview     # http://localhost:4173, serves dist
npm run dev         # source + development-only test helpers
npm install         # only needed for Playwright testing
npm test            # run against the dev server, real 180-second core loop
```

The test defaults to `/opt/google/chrome/chrome`; set `CHROME_PATH` for another installed Chromium. Test artifacts and node_modules stay ignored within this folder. No deploy workflow is included.

## Controls

| Input | Action |
|---|---|
| W / S | Increase thrust / brake; reverse after engine tier 1 |
| A / D | Turn helm; heavy momentum and bank |
| Q / E | Descend / climb |
| Mouse | Aim |
| Hold Space / left click | Fire cannon |
| R | Refit / resume flight |
| Z / C | Side jets after engine tier 2 |
| Shift | Emergency lift after engine tier 3 |
| Esc | Close panels |
| Sound / gear icons | Audio / low-medium-high graphics |

Touch buttons cover basic piloting and firing. Gamepad: left stick turns, triggers adjust thrust, A/B lift, right stick aims, right bumper fires. Audio starts on the first flight input. Progress saves locally every five seconds and after purchases. Sorties preserve campaign currency and upgrades; frontier buildings replenish on reload.

## Verification

See [TESTING.md](TESTING.md) for measured results and screenshot comparisons. The automated test fires, aims at actual geometry, earns salvage, buys the twin-cannon upgrade through the UI, visits islands, checks all three sortie loadouts and the timer results screen, reloads the save, and rejects console errors and external requests. The dev server alone injects teleport, currency, state, aim and FPS controls; the production build contains none of those helpers.

Hardware 60 fps, gamepad ergonomics, touch ergonomics, and a complete 30-minute balance session have not been verified. Low/medium/high presets change render scale, particle budget and world detail distance. Instancing handles factory sections, debris and salvage; distant factories use simplified silhouettes. There are no crowds.

## Shortcuts / next fun improvements

Procedural factories share a small modular kit. Collapses are support-triggered destruction with pooled ballistic fragments, rather than a rigid-body simulation. The first-person ship is represented by its detailed cockpit, attached guns, extra engine pods and orbiting drones; there is no external ship camera. Terrain uses world-space triplanar procedural grain. Sky and instrument maps are generated locally. No music or downloaded artwork is needed.

The three changes most likely to improve fun:

1. Add mobile rival airships with breakable engines and broadside attacks.
2. Handcraft more dramatic bridges, narrow canyons and explosive factory arrangements.
3. Tune upgrade costs and enemy pressure through real 30-minute player sessions, then add distinct cannon firing patterns.
