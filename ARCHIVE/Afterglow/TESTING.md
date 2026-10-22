# Verification — 2026-10-22

- Node.js 24: six deterministic checks passed, including clear routes through 60 seeded charts, handling for all three rides, collision recovery, and 10–20 minute cruise-duration bounds.
- Chromium with software WebGL: browser harness passed. It verified rendered/finite geometry, all craft and route selectors, chart generation, keyboard throttle/steering/brake/cruise, pause freeze, cameras, shore collision/recovery, autosave/resume, all seven radio signals, the natural final transition, continuing into free sail, distant chunk disposal, a virtual gamepad, and all quality presets.
- Production startup passed; `?test=1` exposes no development hooks. Mobile viewport and actual browser touch input passed.
- No JavaScript or WebGL errors. Request audit passed: local assets plus the exact pinned Three.js CDN URL only.
- Visual captures: 1440 × 1000 desktop and 390 × 844 touch viewport.
- The exact Three.js 0.169.0 CDN module was downloaded for the automated harness and supplied to the browser without altering application imports.
- Performance design: initial balanced scene approximately 96 draw calls and 88k triangles per main pass, with batched scenery and a separate lower-resolution reflection. This is a scene-complexity check, **not** a laptop frame-rate benchmark.

Not verified on physical integrated graphics, a physical gamepad, real touch hardware, Safari, or Firefox. Synth audio initialization/scheduling was exercised by the browser; the soundtrack was not evaluated through speakers.

## Optional browser harness

`tests/browser.mjs` requires a separately available Playwright installation and Chromium; these are test tools, not runtime dependencies. Start the dev server and build `dist/`, then run:

```sh
CHROMIUM_PATH=/path/to/chromium node tests/browser.mjs
```

`PLAYWRIGHT_MODULE` can select an existing Playwright module; `THREE_TEST_FILE` can supply an exact copy of the pinned CDN file. Without it, the harness loads jsDelivr normally. The test uses development teleport access to traverse the full sequence, then waits for the natural final transition; it does not simulate twelve minutes of manual sailing.
