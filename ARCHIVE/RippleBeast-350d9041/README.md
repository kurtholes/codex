# Ripple Beast
Inspiration image: 350d9041

A playable procedural 3D drowned forest: swim as a golden-eyed lake creature, coil around timber, wrench it apart, feed, and evolve toward the root-bound giant. Starts directly in the lake. **Flood Run** is an instant, seeded one-life score chase.

Serve this directory or `dist/` over HTTP, then open `index.html`. For example, from this folder: `python3 -m http.server 8000`. The only runtime request is Three.js **0.170.0**, pinned to jsDelivr; internet access is needed for that library. No accounts, analytics, remote game data, or external audio. Audio is synthesized after the first gesture.

- WASD: swim; Shift: surge; hold Space near trunks: coil and wrench.
- Q/E: dive/rise. Drag mouse: orbit. Tab: anatomy tree. Escape: close.
- Muscle II: mud burrowing at the west channel. Hide II: haul above water. Symbiosis II + E: climb the east waterfall.
- Gamepad left stick swims, primary button coils. Touch: left drag swims, right hold coils; evolution buttons also work.
- LOW/MED/HIGH button changes render resolution and vegetation density; AUTO samples early performance. Progress and records save to localStorage under `ripplebeast-v1`.

Build: `npm install`, then `npm run build`. This copies the static site to `dist/` and removes development sections from JavaScript. No bundler or other runtime dependency. Source development URL `/?dev` exposes `window.__game` (teleport, currency, upgrade, targets, state, FPS); production has no such hooks.

Verification: `npm test` launches Playwright Chromium, performs a three-minute low-preset core-loop session with keyboard movement and coiling, teleports between targets, grants currency for the first major evolution, captures four requested views, exercises quick play, and checks console errors and production hook removal. Raw artifacts go to ignored `test-output/`; curated evidence and results are in `VERIFICATION.md`. Install the browser with `npx playwright install chromium` if needed. Hardware GPU, mobile performance, all gamepads, long-term balance, and a complete 30-minute progression run have not been verified.

Shortcuts: destruction uses procedural fragment impulses and proximity collisions rather than rigid-body constraints; the body wraps visually rather than physically knotting. The hand and giant are procedural tube/sculpt approximations. Banks and falls use movement zones rather than full terrain collision. Feeding beds accrue passive nutrients without gardening controls. No soundtrack; sonar is represented by eye light and increased feeding reach. The flood advances through health pressure rather than fluid simulation. See `ASSETS.md` for replaceable art and sound prompts.

The three changes most likely to improve fun:
1. Add physical tail constraints and chain-reaction trunk collapses.
2. Give hunting prey distinct evasive behavior and larger predators.
3. Expand bank, mud and waterfall routes into authored looping arenas, then tune all 24 upgrades through longer playtests.
