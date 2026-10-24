# OVERBOARD
Inspiration image: 0869347a

Swim through amber swells, recover timber, break wrecks, and turn a raft into a roaming fortress. Voyage offers 30 upgrades across six disciplines with local saves. Quick rescue is a fresh 150-second, one-life sprint toward a passing ship.

## Run / build

Serve `dist/` with a static HTTP server, or use `npm run dev` at http://localhost:4173. The first load requires the pinned **Three.js 0.170.0** module from jsDelivr. No other external requests, accounts, telemetry, or backend.

`npm install` installs development tools. `npm run build` copies HTML/CSS and removes development hooks from JavaScript into `dist/`. Source and static production files are both included.

## Controls

| Input | Action |
|---|---|
| WASD / arrows | Swim or steer |
| Shift | Surge |
| E | Recover; board / leave raft |
| Space | Break wreck; otherwise buy hull tier |
| B / salvage counter | Upgrades |
| Hold Q | Dive with Deepwater; sub at tier 4 |
| Drag mouse | Orbit / movement bearing |
| Escape | Close panels |

The first plank is within reach. Recover it, lash a wider deck, and swim to the raft. Boarding relieves exposure. Buy rigging for speed, a workshop for salvage multipliers and passive processing, and holds/depth equipment for longer journeys. Dive beside wrecks for deep salvage.

Gamepad: left stick moves, right stick orbits, A interacts, X breaks. Touch provides movement/interaction buttons and drag orbit. Neither has been tested on physical devices.

## Verification

`npx playwright install chromium` if needed; `npm test` runs the core loop for three minutes with keyboard/UI actions and assisted teleports between wrecks. It also checks saves, separate rescue progress, win/loss, and stripped production hooks. Screenshots and JSON reports go into ignored `test-output/`. `npm run test:production` checks the shipped build and all quality presets. Measured results and image comparison: [VERIFICATION.md](VERIFICATION.md).

For development: `node server.mjs --dev`, then `/?test` exposes `window.__overboard` (state, teleport, currency, boarding, FPS). The production build removes this switch and API. Low/medium/high/auto presets adjust water detail and resolution; salvage/cargo/debris use instancing, static modules use batching, and distant wrecks are culled.

## Shortcuts / remaining work

Buoyancy, impacts, and steering are kinematic. Upgrades assemble preset modules; storms shed cargo instead of simulating structural fractures. Equipment improves access through speed/range; areas have no invisible gates. Diving has traversal, hold salvage, and simple rib/floor wreck interiors; there is no seabed ecosystem. Saves retain salvage/upgrades, not world positions. Art and audio are procedural. Physical laptop 60 FPS, physical touch/gamepad, and 30-minute balance remain unverified.

Three changes most likely to improve fun:

1. Place individual decks with bending and breaking support joints.
2. Add timed crest boosts and richer towline/wind handling.
3. Give the bell, sub, and fortress distinct wreck/storm encounters.

[Design](DESIGN.md) · [Generator replacement prompts](ASSETS.md)
