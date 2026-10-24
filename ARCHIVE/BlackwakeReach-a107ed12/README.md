# Blackwake Reach
Inspiration image: a107ed12

A playable 3D pirate sandbox: sail a black-sailed frigate through a fogbound archipelago, smash ships and coastal batteries, grapple, raid shores, claim harbors and buy permanent refits. **Harbor Breakout** starts a separate escape run immediately.

Serve this folder over HTTP and open `dist/index.html`. The only runtime dependency is Three.js **0.170.0**, loaded from pinned jsDelivr; an internet connection is needed for that import. There are no service requests, accounts or analytics. Audio is synthesized. Campaign gold, six upgrade branches and harbor ownership save in localStorage.

- **W/S:** sail forward/reverse; **A/D:** steer. Already sailing at load.
- **Space:** hold for both broadsides; ashore, swing cutlass.
- **Q:** grapple nearby enemy or catch a wind surge.
- **E:** land near a lantern dock / return to ship.
- **F:** pistol. **R:** refit. Drag the scene to orbit.
- Sound toggles at top right. Keyboard/pointer interaction enables audio.

Six branches have six permanent tiers each. Hull improves armor and unlocks shallow draft at tier 2 and ram damage at tier 3. Sails raise speed and mast height; battery adds damage, firing rate and barrels; rigging improves turning and landing reach; boarding strengthens cutlass/pistol and shore speed; empire increases captured-harbor income. Captured batteries attack nearby hostile ships, and harbors repair visiting captains.

## Build and test

From this folder:

```sh
npm install
npm run build
python3 -m http.server 5173
# open http://localhost:5173/dist/
```

For automation, run `node build.mjs --dev`, keep the server running, then `npx playwright install chromium` and `npm test`. This runs real keyboard input for three minutes and writes screenshots and JSON into ignored `test-output/`. It also exercises refits, landing, and quick play. The dev build exposes `window.__game.state`, `.teleport(x,z)`, `.give(amount)` and an FPS overlay. **Run `npm run build` afterward**: production omits this access and hides the overlay. Additional checks: `node tests/production.mjs` checks production hook removal, save reload and a short FPS sample; `node tests/shore.mjs` expects a dev build. See [VERIFICATION.md](VERIFICATION.md) for measured results and visual comparison.

Auto/Low/Med/High control pixel ratio and instanced debris budgets. Enemy ships switch to simplified silhouettes at distance; debris is instanced. Static terrain uses world-space triplanar procedural shading; sea shading uses world coordinates. No generated texture files are required.

## Scope and shortcuts

This is a compact procedural prototype, with arcade damage and compact shore skirmishes. Grappling applies boarding damage rather than transferring the captain onto enemy decks. There are no rooftop traversal, diving bell, crew orders, physical trade convoys, animated fracture meshes or full fitting exclusivity. Islands and campaign opponents are finite; passive harbor income supports longer refitting. Quick play varies starting battery strength, with a fixed archipelago and randomized enemy firing cadence. No ship picker, gamepad or touch controls. Distant cliffs are scenic rock clusters. Synthesized effects replace recorded audio; there is no music. The art captures the source palette and silhouettes with visibly simplified geometry.

Hardware integrated-GPU performance, touch, gamepads, long-term economy balance and 30-minute retention have not been validated. The 60 fps figure is a target, not a measured hardware guarantee.

The three most useful fun improvements:

1. Playable deck-to-deck boarding with rope swings and reactive crews.
2. Roaming trade convoys, regenerating naval threats and rival harbor recapture.
3. More differentiated fittings, mission routes and destructible hull sections.

Asset replacement prompts and budgets are in [ASSETS.md](ASSETS.md); design intent is in [DESIGN.md](DESIGN.md).
