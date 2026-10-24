# Under the Red Sky
Inspiration image: 195f7cae

A playable 3D desert destruction sandbox. Start behind the wheel beside the glowing diner; launch slow plasma shells, drive into the wreckage, and spend scrap at the OPEN sign. Eight six-tier upgrade branches persist locally. Quick siege loans advanced equipment for five minutes.

Serve this folder with `npm run dev`, then open http://localhost:8080. The committed static build is at http://localhost:8080/dist/. Requires WebGL2 and an initial connection for pinned Three.js 0.170.0 from jsDelivr. No other runtime requests, accounts or analytics. Audio is synthesized after interaction.

Controls: WASD drive/steer, mouse aim, hold left click fire, Space lift, Shift boost, V cockpit/chase camera, E garage within its radius, Esc release mouse. Click garage upgrades to purchase; Roam closes it. The Garage button also opens it nearby. Touch buttons and standard gamepad controls are included (left stick drive, right aim, right trigger fire, A flight, B boost).

Build: `npm install && npm run build`. Build copies the HTML and strips the marked development API from JavaScript. No bundler or runtime dependencies besides Three.js. `npm run dev` uses Python 3's static server. Save key: `redsky-save-v1`; clear that key to reset. Siege never spends campaign scrap.

Development: visit `/?dev` for FPS overlay and `window.__RED_SKY__`: `state`, `teleport(x,y,z)`, `give(amount)`, `buy(branch)`, `fire()`, `aim(yaw,pitch)`, `quality('low')`. Production contains none of that API, even with `?dev`.

Verification: with the server running, `npm test` runs a real-time three-minute Chromium/Playwright core-loop session, captures 0s / 30s / 180s / first upgrade screenshots, checks natural salvage and an upgrade, starts siege, checks persistence and production API stripping, and reports FPS, first-action timing and console errors in ignored `test-output/`. Detailed results and visual comparison are in TESTING.md.

Shortcuts: stylized procedural geometry rather than authored models; nonphysical suspension and chunk debris; no complex structural solver; basic swarm pursuit with no player death; open areas use soft progression through speed and flight rather than locked gates. Flight means the entire cannon car lifts, keeping the vehicle fantasy continuous. The diner is protected. Compounds rebuild after full demolition; scrap auto-credits after a timeout. No prestige resets. No music track. Quality auto selection uses CPU count, not a GPU benchmark. Static batches and instancing reduce draw overhead, but laptop hardware performance needs measurement.

The three changes most likely to improve fun:

1. Add crawler bosses with armor plates that slow shells visibly punch through.
2. Give each distant compound moving machinery and more varied chain-reaction opportunities.
3. Tune suspension, gliding and recoil together on real laptop hardware, with authored impact sounds.
