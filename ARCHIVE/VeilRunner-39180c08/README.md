# Veil Runner
Inspiration image: 39180c08

A first-person perception runner inside a pearl-white Gothic city. Follow grounded silhouettes, break crystal screens and grow a permanent 48-tier movement web. Exploration adapts contrast to successful routes; quick play offers a daily seeded 60-second run with independent accuracy and split results. This is a visual discrimination challenge with no eyesight improvement claim.

## Play

Serve `dist/` over HTTP, or run:

```sh
cd ARCHIVE/VeilRunner-39180c08
npm install
npm run build
npm run dev
```

Open **http://localhost:4173**. The server defaults to the production static build. For development tools: `node server.mjs --dev`.

- **WASD / arrows:** move; **mouse:** look after clicking the scene; **Esc:** release mouse.
- **Shift:** sprint; **Space:** jump / air chain after Lift II; **C:** slide.
- **Click / E:** pulse and shatter; sprinting into crystal also breaks it.
- **Tab:** skill web; **V:** restore visibility immediately.
- **Quick Run:** daily 60-second route; **R:** instant retry.
- **☷:** contrast, minimum contrast, sound and detail controls.

Gamepad: left stick move, right stick look, A jump, left bumper sprint, right trigger pulse. Touch: movement/jump buttons and drag to look; the pulse icon also breaks nearby crystal. Keyboard and mouse are the primary interface. Progress, preferences and up to eight hours of Echo income persist in localStorage.

## Build and dependencies

`npm run build` copies source to `dist/` and excludes the development bridge. The build is static and needs no Node runtime. Three.js **0.170.0**, obtained from the exact pinned jsDelivr URL in [ASSETS.md](ASSETS.md), is bundled locally so play makes no external requests. No other runtime dependencies, network services, accounts, tracking or deployment workflows. Playwright is development-only. Rebuild after source edits.

## Verification

`node server.mjs --dev`, then `npm test` in a second terminal. The automated browser drives real movement around collisions for three minutes, earns and spends currency, shatters screens, captures 0s/30s/180s/major-upgrade screenshots, and checks save reload, visibility reset, a complete quick run and retry. Development state, currency, teleport, route driver and FPS tools are injected only by the development server; `dist/` excludes them. The completed three-minute run reached 17 routes, broke 31 screens and made nine purchases, with zero console errors. First action occurred by 4.5 seconds. Low quality measured 6.0 fps on this shared SwiftShader software-rendering host; laptop 60 fps remains unverified. `npm run test:production` checks the shipped static build separately. See [TEST_REPORT.md](TEST_REPORT.md) for measured results and reference-image comparison. Screenshots and raw output live in ignored `test-output/`.

Laptop hardware, subjective long-session enjoyment, real gamepad/touch hardware and the full 48-tier balance have not been validated. Low/medium/high control rendering scale and crowd density; crowds and debris use instancing, with a distance cutoff for low-detail crowds.

## Shortcuts and next improvements

Wet paving uses procedural triplanar shading and stylized reflection streaks instead of real-time planar reflections. Crystal screens break; full buildings remain solid. The coat figure is a modeled procedural lathe with separate limbs, collar, hair and boots. Districts are compact continuous spaces; high routes use platforms and forgiving vault assistance rather than a full climbing animation system. Sparse synthesized cues stand in for a designed ambient soundtrack.

The three changes most likely to improve fun:

1. Hand-author more flowing multi-level routes with alternate wall-run lines and chained-slide shortcuts.
2. Add richer apparition behaviors and reflection-specific discrimination challenges, tested with real players at multiple contrast settings.
3. Tune the long upgrade economy through 30-minute sessions, and add distinct visual transformations at movement milestones.
