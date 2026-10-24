# The Bridgekeeper
Inspiration image: 127d4570

A third-person storm survival toy: charge amber lantern shells, shatter drowned horrors and cargo, attract salvage, and grow across six permanent eight-tier upgrade branches. Roam the timber network, wreck field, foundry and iron citadel. The separate five-minute Siege starts with a powerful build and ends with a leviathan.

Serve `dist/` over HTTP and open `index.html`. Three.js **0.169.0** loads from its pinned jsDelivr URL; that import requires internet. There are no gameplay requests, accounts, analytics or external audio/art. Progress saves locally in this browser.

Controls: WASD/arrows move; mouse aims; hold/release left mouse charges/fires; right mouse locks camera rotation, Escape releases it. Space jumps (hold for flight at Stride 6); E grapples at Stride 2; Shift dashes at Stride 4. R repairs nearby broken planks or extends a missing span for five salvage. Click upgrades or press 1–6. Quality and sound controls sit at lower right. Siege and Main maintain separate progression; death returns the keeper to the start with upgrades retained.

Build: `npm ci`, then `npm run build`. Source is in `src/`; the committed static build is in `dist/`. No bundler or deployment workflow. Development: serve the game folder and open `src/index.html?dev`; only that source page exposes `window.__test` (teleport, currency, upgrades, shooting, state and FPS). The build removes the entire developer block. `npm test` runs Playwright; first run `npx playwright install chromium`. Test outputs and dependencies are ignored locally.

Validation: the final three-minute run recorded first movement at **1.24 s**, **20 kills**, **28 shots**, working salvage and upgrades, **zero console errors**, and no production developer hook. Low averaged **6.8 FPS** (minimum **2.8**) in headless Chromium using SwiftShader software WebGL, not laptop hardware; the 60 FPS target remains unverified. A final triplanar instancing correction received a separate production shader smoke check. The test drives movement and a real charged mouse shot, then uses developer targeting to repeatedly exercise the combat/salvage loop for three wall-clock minutes, buys the grapple upgrade and a shell tier, captures four requested screenshots, checks production has no developer hook, and enters Siege. It is a reproducible systems test, not a human difficulty or aiming assessment. Screenshots and JSON are under `test-output/`.

Art comparison: the screenshots preserve the reference's charcoal timber, violet/slate distance, precarious perspective and amber lantern focal point. The modeled keeper has a hood, respirator, glowing goggles, layered coat tails, boots and caged lantern. Procedural geometry remains visibly stylized; the sea lacks the painting's dense breaking whitewater, distant forts are simple silhouettes, and the camera mostly sees the keeper's back. `ASSETS.md` lists replacement prompts and budgets.

Shortcuts: grapple and dash use short positional impulses; the leviathan is an enlarged horror; cargo and tower destruction scatters pooled splinters rather than simulating rigid bodies. Cargo impacts can tear out plank instances and drop pursuers; repairs restore them. Sky, ocean, grain and all audio are procedural. Low uses reduced resolution and ocean tessellation; bridge timbers and debris are instanced. The progression has 48 persistent tiers, but has not received a 30-minute human balance pass. No gamepad or mobile movement scheme. No real integrated-GPU benchmark, complete five-minute Siege finish, or cross-browser/audio-device test was performed.

Three changes most likely to improve fun:
1. Distinct grappling, charging and armored enemies with clearer attack tells.
2. Animated wave crests and more spectacular multi-stage tower collapses.
3. Hand-tune the full 30-minute upgrade economy and add unique fortress encounters.
