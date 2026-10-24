# Browser verification

Test environment: Playwright 1.56.1 Chromium, 1280×720, headless, ANGLE SwiftShader (software WebGL). This is not representative of integrated-GPU throughput.

`test.mjs` drives forward movement, repeated leaps and slams, banking, an upgrade purchase and steering for 180 real seconds. It then enters Quick Crossing and checks that `dist/?dev=1` does not expose development state. Screenshots and raw measurements are written to ignored `test-output/`:

- `00s.png`: opening run, HUD, coat silhouette and sunrise.
- `30s.png`: traversal after the first purchase.
- `180s.png`: developed trail and roaming after three minutes.
- `first-upgrade.png`: first Stride purchase.
- `final-opening.png`, `constellation.png`, `quick.png`: later visual and feature smoke checks.

Compared with inspiration image 01e1599d: the game preserves the dark traveler, navy/lavender sky, enormous crescent planets, warm central sunrise, jagged shores and blue/gold route language. It is substantially more stylized: faceted terrain, fewer atmospheric layers and approximate water reflections. The reference's photoreal clouds and detailed galaxy are represented by sprite haze and a procedural star spiral, rather than matched literally.

`checks.mjs` verifies save/reload (purchased Stride and Wings survive), quick-play loss, restart, success, and production-hook removal. `smoke.mjs` purchases all six branches and exercises jumping, slamming and the upgrade interface. Neither is a substitute for a long balance session.

Not verified: real integrated-GPU 60 FPS, mobile/touch hardware, physical gamepads, sustained thirty-minute balance, or offline CDN availability. There are no gameplay-unit tests that merely mirror the implementation.

Measured endurance result: 188.5 seconds total including captures and production navigation; 180 one-second play steps. First movement: **389.8 ms** after navigation time origin. Low-preset average: **32.91 FPS**, minimum sampled one-second average: **25.66 FPS**. Four persistent routes, first Stride tier purchased, 1,385 banked light and 657 carried light at the endpoint. Quick mode entered successfully; production test state was `undefined`. **Zero console/page errors in the repeated endurance run.** An earlier exploratory run reported two intermittent undefined-index errors; the repeat did not reproduce them. Ghost samples now also have a defensive bounds check. Final wake, shockwave and route-segmentation refinements received a separate clean smoke check, rather than another full endurance run.

The screenshots were inspected against the supplied image. The 180-second capture also shows a limitation of unrestricted roaming: the player can leave the densely populated starting corridor for large sparse expanses. More handcrafted traversal circuits are the highest-value content improvement.
