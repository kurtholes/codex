# The Final Mile
Inspiration image: 2797a12a

Drive a battered coupe toward a reachable crystal city. Smash roadside hazards, drift for scrap, and buy 36 permanent upgrade tiers. **One Mile Left** starts a short final approach with escalating failures. The car is moving immediately.

Serve `dist/` using any static HTTP server and open `index.html`. Internet access is required once for the pinned Three.js 0.180.0 jsDelivr module; there are no gameplay services, accounts, analytics, or other network requests. Audio is synthesized and starts through the sound button.

Controls: WASD/arrows drive, Space drift, Shift boost, J jump after suspension upgrade, E garage, C dashboard/chase, R recover. Gamepad left stick steers and primary button boosts. Touch buttons cover basic driving. Choose LOW/MED/HIGH at the top. Progress saves locally; quick-play earnings are excluded from persistence.

Build: `npm install`, then `npm run build`. Source is in `src/`; the static production build is in `dist/`. Build strips the development interface. `npm test` runs a local development server and a three-minute Playwright drive. Install Chromium with `npx playwright install chromium` if needed. Test controls live in `src/dev.js`: state, teleport, currency, upgrades, restart and FPS. Test output and node_modules are ignored.

Testing and visual review: see `VERIFICATION.md`. Captures are generated at start, 30 seconds, three minutes and the first major upgrade. Tested Chromium headless with SwiftShader; hardware GPU, Safari, Firefox, physical gamepad, touch devices and long-term saves have not been tested. 60 FPS on integrated laptop GPUs remains an unverified target.

Shortcuts: arcade steering and spring/bounce motion replace a wheel-contact physics solver. Crashes scatter pooled debris and remove whole props; no fracture simulation. The highway remains intact; rolling rocks and crystal surges supply the disasters. The elevated road is scenery rather than a complete jump route. Garage opens anywhere. Engine faults are timed modifiers. Dashboard camera is a close forward view. City crossings loop with permanent parts; route layouts and quick-play scenery are deterministic, with cosmetic dust randomness. Procedural materials and geometry approximate the reference; no generated art/audio is bundled. Upgrade branches have six tiers each, but most tiers adjust stats rather than adding unique geometry.

Three changes most likely to improve fun:
1. True suspension/contact physics and detachable body panels, with recoverable wheel damage.
2. Collapsing road sections and connected jump routes that demand the movement upgrades.
3. More distinct upgrade silhouettes and a richer quick-play medal/results system.
