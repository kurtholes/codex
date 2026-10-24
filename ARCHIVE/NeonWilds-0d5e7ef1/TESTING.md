# Verification

Automated Chromium / Playwright run, 1280 × 800, low preset, headless ANGLE SwiftShader software renderer:

| Measurement | Result |
| --- | --- |
| Continuous playthrough | 181.379 seconds |
| First movement after navigation | 1.936 seconds |
| Mean sampled frame rate | 17.22 fps |
| JavaScript / console errors | 0 |
| Shoots pruned | 195 |
| Sap earned by cuts | 585 |
| Major upgrade | Wheel tier 3 purchased |

The test moves with W, teleports between live shoots using source-only hooks, prunes repeatedly, grants 100 test sap and buys three wheel tiers. It exercises the action/resource/upgrade loop rather than evaluating natural navigation or player enjoyment. The reported frame rate is measured frame timing, not a capped simulation timestep. SwiftShader is CPU rendering; **60 fps on laptop integrated graphics is a target, not a verified result**. Hardware profiling and further batching/LOD work remain necessary.

Separate browser checks passed: production has no `__dev`; four graft branches render; Quick Run starts and R retries; reaching the first pink pin connects it; E travels along its rail; purchased grafts and pin connections survive reload. Both source and production JavaScript pass syntax checks. `git diff --check` passes.

Screenshots (generated, intentionally ignored test output):
- `test-output/0s.png`
- `test-output/30s.png`
- `test-output/3min.png`
- `test-output/first-major-upgrade.png`
- Machine-readable results: `test-output/report.json`

## Comparison with inspiration 0d5e7ef1

At 0 seconds, the small white/red explorer stands on a broad etched golden leaf beneath the floating mint map, framed by hollow turquoise trunks and orange botanical forms. This preserves the reference's contrast, scale and recognizable landmarks. The reference is a flat illustration; the game introduces shaded depth and a navigable floor, so orange and gold become darker on unlit faces.

At 30 seconds, cut orange spires lie sideways and golden fragments surround the pink shear arc. The etched leaf underside and towering hollow trunk maintain the image's botanical line language. At the first major upgrade, the board grows and the explorer reaches higher speed, but a foreground shoot partially obscures the silhouette; camera occlusion remains a weakness. At three minutes, widespread cuts provide a visibly changed garden and continued free traversal. The scene has less negative space and more repeated shoots than the reference. The map is luminous unlit geometry without true bloom; the sun is modeled but often outside the chase camera framing.

Not verified: actual audio quality by listening, integrated-GPU frame rate, mobile/browser compatibility beyond desktop Chromium, every high-tier combination, long-session balance, or accessibility. No claim of a complete thirty-minute content campaign. The branching tiers are implemented; district depth and physical bridge behavior remain prototype shortcuts documented in README.
