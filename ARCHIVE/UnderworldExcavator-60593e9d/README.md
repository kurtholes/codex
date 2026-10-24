# Underworld Excavator
Inspiration image: 60593e9d

A first-person sandstone demolition toy: charge seismic spheres, collapse rock curtains and timber spans, uncover five descending cave districts, and grow a brass excavation cannon. Starts in play. Main excavation has 48 upgrade tiers, automatic rigs, grapple/hover movement and local saves; **5 MIN RUSH** supplies a powerful cannon and hover immediately, with a separate score and no main-save overwrite.

## Play
Serve `dist/` over HTTP, for example `python3 -m http.server 8000 --directory dist`, then visit `http://localhost:8000`.

- WASD / arrows: move; mouse: look after clicking the scene.
- Hold left mouse: charge; release: fire. Shift: sprint. Space: jump.
- Tab / ◈: forge. E: grapple after Mobility III. Hold Space: hover after Mobility V.
- Escape: release mouse. Select AUTO / LOW / MED / HIGH; ♫ toggles synthesized sound.
- Touch: drag to look and use the on-screen move/fire/jump buttons. Basic gamepad sticks, trigger and jump are supported.

Progress autosaves every eight seconds and on exit. Clear this game's browser storage to restart. Main gear and rigs also earn capped offline income.

## Build / verify
Run these commands from this folder:

```sh
npm ci
npm run build
python3 -m http.server 8000
# In another terminal:
npm test
```

Source: `src/`. Static release: `dist/index.html`. Three.js is pinned to **0.170.0** on jsDelivr, the sole external runtime request; otherwise no network, accounts or analytics. Audio and visuals are generated locally. The CDN must be reachable on initial load.

`src/index.html?dev` exposes teleport, currency, equipment, state and FPS through `window.__excavator`. The build removes the dev loader and API. Automated Chromium uses real mouse charge/release and movement with a dev navigator, buys earned upgrades, checks saves and rush isolation, and captures 0s/30s/180s/first-upgrade screenshots. Results live in ignored `test-output/`; see `tests/VERIFICATION.md`. Recorded first shot: 3.28 seconds; 127 chunks destroyed; save/rush checks passed; zero console errors. Software-rendered low FPS median was 5.29 with a long stall, so the 60 FPS target remains unverified. The final production smoke check also passed without warnings.

## Limits / next fun improvements
The city is a compact procedural arcade interpretation, not a historical reconstruction. Supports use column/dependency collapse; excavation removes authored chunks rather than arbitrary voxels. Outer vaults stay intact. Rigs animate conveyors and generate income rather than physically transporting simulated ore. Touch, gamepad, audible mix, long-term balance and integrated-GPU 60 FPS need hands-on validation.

The three best next improvements:

1. Add irregular branching neighborhoods and vertical shafts with risky, rewarding collapse chains.
2. Give each cannon branch a distinct projectile behavior and stronger upgrade silhouettes.
3. Let players place rigs and conveyors to design mining routes instead of buying fixed installations.
