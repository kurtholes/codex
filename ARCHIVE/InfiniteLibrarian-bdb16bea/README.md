# Infinite Librarian
Inspiration image: bdb16bea

A third-person arcade library: scoop cascading books, fling bulk loads into matching shelves, grind balcony rails and grow an automatic sorting operation. Opens directly into play. Archive mode saves currency and 24 upgrade tiers locally. One Shift is a separate three-minute overflow challenge.

Serve this folder using `python3 -m http.server 8080`, then open `http://localhost:8080/dist/`. The pinned Three.js **0.170.0** module comes from jsDelivr; that initial dependency fetch requires connectivity. There are no gameplay network requests, accounts or analytics.

Controls: WASD/arrows move; click or Space flings; hold Shift to grind near rails; E rides to the next unlocked gallery; Q jumps (Traversal 4 adds double jump; 6 adds held-jump slow fall); R shoves nearby rolling shelves. Drag to orbit. Buttons buy upgrades. Sound starts muted; enable with ♪. Basic gamepad movement/fling and touch movement/fling are included. Quality menu offers Auto/Low/Medium/High.

Build: `npm install` then `npm run build`. Source is `src/`; static output is `dist/`. No build-time runtime libraries. Build strips the marked development test API. Serve `src/index.html?test` for FPS, `window.__game`, teleport, currency grants and state access. `npm test` runs Playwright; install Chromium with `npx playwright install chromium`. Test output and node_modules are ignored locally.

The 200-second headless core run sorted 83 books with zero console errors; first action took 0.79s. Low-quality software rendering was poor (about 0.77 rendered frames per wall second including capture overhead); the 60 FPS hardware target is unverified. Full measurements and screenshot comparison are in [TESTING.md](TESTING.md). Physical laptop integrated-GPU performance, real gamepads, touch devices and audible sound quality require manual testing.

Shortcuts: lightweight custom bouncing and magnetic collection replace rigid-body physics; delivery automatically chooses matching shelves. Rolling cases topple and rebuild, but architectural shelves do not structurally collapse. Upper wings reuse the archive architecture; lifts are forgiving instant traversal, and automated arms earn periodically rather than routing individual physics objects. No prestige resets.

The three changes most likely to improve fun:

1. Build skatable salvage ramps and chain-swing transfers with momentum challenges.
2. Simulate conveyor routes and sorting bottlenecks, with meaningful equipment tradeoffs.
3. Give each upper wing distinct gravity, delivery hazards and structural domino collapses.
