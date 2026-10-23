# MOONFALL
Inspiration image: ee7b1ff3

A third-person survival toy: sprint through a tidal ice plain to the amber ship, launch, fly through gravitational disturbances, and shatter falling moonstone. Spend persistent salvage across six eight-tier upgrade branches. The 90s Dash button starts a short session, launching automatically after 25 seconds.

Serve this directory (`npm run dev`, http://localhost:8080) for development, or serve `dist/` for production. Three.js 0.170.0 loads from its pinned jsDelivr CDN; that initial dependency request is the only remote request. No accounts, telemetry or gameplay networking. Internet access is needed to load the CDN library.

Controls: WASD move; mouse look after clicking; Space jump / ascend; Ctrl descend; Shift boost; click fire; E launch near ship / extract in flight; U upgrades; Escape menu. Touch offers forward movement, steering and firing; gamepad offers movement, boost and trigger firing. Keyboard/mouse is the complete control scheme. Sound begins on input; ♪ toggles it. Progress saves automatically in localStorage.

Build: `npm install`, then `npm run build`. The build copies static files and removes the development-only state/teleport/currency/FPS hooks. No bundler or runtime dependencies beyond Three.js. Quality menu controls pixel ratio; automatic selection uses hardware concurrency. Shared geometry, instanced rubble and a bounded instanced particle pool limit draw overhead.

Test: `npm test` runs Playwright for three real-time minutes. Install its Chromium browser if missing (`npx playwright install chromium`). Test outputs and screenshots go to ignored `test-output/`. Test assists aim and teleports to the ship; it is a smoke test of the core systems, not proof that an unassisted player can survive. See [VALIDATION.md](VALIDATION.md) for measured results and visual review. The completed software-rendered test averaged 15.55 FPS with zero console errors; the 60 FPS laptop target remains unverified.

Shortcuts: terrain is a deforming heightfield with a shallow reflective ice plane; impacts depress rather than split the mesh. Mountain geometry is generated, not sculpted. Asteroids are shared low-poly meshes; no true moon-scale rigid-body simulation. Upgrade visuals are procedural attachments and scaling. Upper layers are difficulty/altitude variations in the same free-flight space, not separate authored biomes. No music track. No touch-complete vertical flight controls. Save restoration preserves stats but does not reconstruct cosmetic attachments until another purchase. A failed run banks salvage and opens upgrades.

The three changes most likely to improve fun:
1. Authored tidal ramps and collapsing shelves that reward a skilled jump route.
2. More distinctive cannon impacts, enemy fragment shapes and chained breakup patterns.
3. Separate orbital biomes with larger slingshot arcs and visible extraction destinations.
