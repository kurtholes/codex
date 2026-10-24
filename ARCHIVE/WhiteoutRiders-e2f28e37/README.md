# Whiteout Riders
Inspiration image: e2f28e37

A third-person snowmobile playground in a blue-white alpine basin. Ride immediately, carve for credits, smash logging props, take beacon jobs, tow stranded riders, and buy 30 permanent upgrades. Quick Run starts a 90-second rescue with a loaner sled. Progress stays in localStorage.

## Play
Serve `dist/` using any static server. From this directory: `npm run serve`, then open `http://localhost:8080/dist/`. No build is required to play the checked-in static version. The pinned Three.js 0.170.0 module loads from jsDelivr; that CDN request is the only runtime network dependency. Audio starts with the first key or click.

- **WASD / arrows:** throttle, brake/reverse, steer.
- **Space:** drift and bunny-hop. **Shift:** boost.
- **E:** accept a nearby orange beacon job. Drive into the destination ring.
- **G:** garage. **Esc:** close it. **R:** right the sled.
- **F:** winch assist after Utility 2.
- Mouse: garage purchases, quick run, audio, graphics preset.
- Optional gamepad: left stick steer, triggers throttle/brake, A accept, B boost, X drift. Touch buttons offer basic riding.

## Build and verify
Node 20+: `npm install`, then `npm run build`. The build copies source into `dist/` and removes the development injection marker. No bundler or other runtime dependency. No deploy workflow.

`npm test` runs a real-time three-minute low-preset keyboard playthrough with Playwright and system Chrome. Set `CHROME_PATH` if needed. It earns money, finishes jobs, buys an upgrade, checks saving, rescue/retry, destruction, and production debug absence. Screenshots and machine-readable metrics are generated under ignored `test-output/`: `00s.png`, `30s.png`, `180s.png`, `first-major-upgrade.png`, and `upgraded-sled.png`. Final run: first action in 4.97s, three jobs completed, eight props smashed, no console errors. Low averaged 3.90 fps in headless software rendering; the 60 fps hardware target remains unverified. See `VERIFICATION.md` for measured results and image comparison.

Development only: `node tests/server.mjs`, open `http://127.0.0.1:8173/dev/`. `window.__dev` exposes `teleport(x,z)`, `give(n)`, `state`, `keys`, `fpsOverlay()`, and progression helpers. Production serves no dev tools; these hooks are injected by the test server, never included in `dist/`.

## Scope and shortcuts
Procedural art is stylized, not photoreal. Heightfield arcade physics replace a rigid-body simulation; towing follows a damped tether. Sheds scatter pooled debris rather than fracture structurally. Snow grooves use a bounded 5,000-instance buffer. Regions are connected and freely reachable; upgrades improve access rather than imposing invisible gates. The lake kit removes an ice speed penalty; it does not simulate water buoyancy. Hardware detection chooses a conservative preset from logical CPU count; it is not a GPU benchmark. No manual integrated-GPU, mobile, touch, gamepad or audio-listening certification has been performed.

Three changes most likely to improve fun: (1) tune weighted carving and add banked powder berms after hands-on playtests; (2) give rescue sleds damage, stronger tether physics and alternative risk/reward routes; (3) add authored jump lines and distinctive landmark geometry so exploration has more memorable destinations.
