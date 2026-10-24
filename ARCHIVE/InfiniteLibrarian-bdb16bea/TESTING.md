# Verification

The automated Playwright session uses Chromium with SwiftShader software WebGL at 1280×800 and Low quality. It steers toward naturally arriving books, flings bulk loads and purchases upgrades using earned credits for at least three minutes. The core session uses no currency grants, artificial spawns or teleports. Separate checks exercise test controls, gallery lifts and advanced jumps, production API stripping, saved progress and Quick Play isolation.

Screenshots are generated locally in ignored `test-output/`: `00s.png`, `30s.png`, `180s.png`, `first-upgrade.png`, and `gallery.png`. Run `npm test` to regenerate them. Machine-readable measurements are in `test-output/report.json`.

## Recorded run

- Core run: **199.94 seconds**, including screenshot and automation overhead.
- First action: **793 ms** from navigation; input response **16.4 ms**.
- **83 books sorted**, first upgrade purchased from **115 earned credits**; no grants or teleports during the core loop.
- Low quality / SwiftShader: **approximately 0.77 rendered frames per wall second**, including capture stalls; smoothed overlay samples averaged **8.63 FPS** (minimum sampled overlay **4.73 FPS**). The smoothed overlay overestimates sustained throughput during long stalls; the wall-time metric is the conservative measurement. Software-renderer performance was poor. **60 FPS on laptop integrated graphics is unverified.**
- **Zero console errors**. Actual keyboard movement after changing quality passed.
- Save restoration, Quick Play isolation, production test-API stripping, gallery lift and double-jump checks passed. Lift reached 8m; the sampled jump peak exceeded 8.63m.
- JavaScript syntax, exact CDN version, inspiration identifiers, and static build stripping checks passed.

The separate post-core traversal check used test currency and teleport. That test state is separate from the earned progression reported above.

## Source-image comparison

The initial and 30-second views preserve the source's long centered aisle, tall repeated walnut shelves, narrow brass ladders, stacked balcony silhouettes, smoky brown distance and central caged hanging lantern. The first-upgrade view shows a brass collection hoop and expanded load capacity. The three-minute view shows the expanded four-hoop trolley, two sorting arms and conveyor lanes. The upper-gallery view shows a side balcony, the central lantern and the stacked shelves below.

The game uses stylized lower-detail geometry and a broader receiving floor for movement readability. Its lighting is brighter and flatter than the image, with less volumetric haze, no cinematic depth of field, and fewer tiny asymmetrical shelf details. The source's almost bottomless central chasm is represented by the upper galleries rather than the initial receiving floor. These are deliberate readability and performance compromises, not an exact image reconstruction.

## Limits

Software-renderer FPS does not establish the 60 FPS integrated-GPU target. Hardware laptop performance, prolonged 30-minute balance, physical gamepads, actual touch hardware and audible audio quality remain unverified. Basic touch and gamepad paths are implemented. Quick Play's start and mode isolation are checked; a complete separate survival session is not part of the automated core run. Shelf physics use lightweight bouncing, rotation and salvage particles; architecture has no structural solver.
