# Verification

The initial real-time headless run reached its wall-time threshold while advancing only eight simulation seconds: software rendering/screenshot stalls made that unsuitable as a three-minute gameplay check. Its first salvage action occurred at 0.78 simulation seconds. Replaced it with a deterministic 180-second fixed-step browser playthrough, with presentation FPS measured separately. This distinction matters: fixed-step gameplay coverage is not a real-time performance benchmark.

The automated route uses development teleports to approach cargo, but mouse input cuts it through the normal targeting/damage logic. It returns to shelter, spends salvage on crops, buys an upgrade, verifies persistent state and checks the production test hook is absent. Screenshots and the full JSON report are in ignored `test-output/`.

Image comparison: source shows charcoal pressure-suit metal, ice-coated curved glass, low contrast blue-gray haze and small warm reflections. The game carries these through a curved visor frame, scratched glass streaks, ribbed pressure greenhouse, silver bolts and frost, storm particles, muted terrain and amber door strips. Screenshots show a legible explorable place instead of reproducing the source's face close-up. Stylized geometry, brighter ambient light, simple frost and absent condensation droplets remain clear visual differences.

Not verified: physical integrated-GPU 60 fps, touch, all gamepad mappings, audio quality by listening, every late tier across a natural 30-minute session, or a complete ten-minute quick expedition. These remain manual checks.

Final automated result: **180 simulated seconds passed**, first action **0.823 s**, **576 salvage** recovered, **12 planted beds**, cutter tier **1**, **0 console errors**, production hook **absent**. Actual low-preset presentation performance in this software-rendered headless environment: **19.29 FPS**. The game does not currently demonstrate the requested 60 FPS target here. All four requested screenshots were generated; `production.png` additionally checks the shipped view. Earlier real-time run errors were favicon 404s, resolved with an inline favicon.
