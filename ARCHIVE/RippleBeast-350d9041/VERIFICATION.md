# Verification

Final source and static build checked on 2026-10-24 using Playwright 1.56.1 / headless Chromium, 1280 × 800 viewport, LOW preset, SwiftShader software WebGL in the shared cloud environment.

| Check | Observed result |
|---|---|
| Load to render / development ready | 1.471 seconds |
| First player action | 8.465 seconds after module startup; includes initial screenshot capture delay |
| First core-loop destruction | First trunk snapped through held Space; 45 nutrients awarded |
| Session | At least 180 wall-clock seconds of repeated movement/coiling; 191.423 seconds including final screenshot and quick/production checks |
| Destruction | 11 targets broken |
| First major evolution | Muscle II; visible horns and larger silhouette |
| Final nutrients | 1,213 after evolution costs and feeding |
| LOW FPS | Mean sampled 6.32; minimum sampled 1.97 |
| Browser console / page errors | 0 |
| Quick play | Flood mode entered and advanced; complete one-life run/restart not automated |
| Production development API | `window.__game` undefined |
| JavaScript syntax | Source, build and test script pass `node --check` |

**Performance limitation:** the software renderer falls far below the 60 fps target. Hardware integrated graphics performance has not been measured and must not be inferred from these results. Simulation caps long frame deltas, so 180 seconds here is wall-clock play, not 180 simulated seconds. LOW uses 0.6 pixel ratio, fewer reeds/fish, and nearby tree rendering; forest geometry is batched per destructible target and debris/reeds/fish are instanced.

The harness uses keyboard input for swimming and coiling, development teleportation between targets, and granted nutrients for the major-upgrade capture. It verifies interaction mechanics, not an unaided progression or difficulty curve. Screenshots are taken at the initial rendered view, after the first major upgrade, at the first sample beyond 30 seconds, and after the three-minute interaction loop. The latter two times are measured from the start of the repeated core-loop portion, after the opening/upgrade setup. Raw samples: [report.json](evidence/report.json).

## Visual comparison

Reference: [inspiration 350d9041](evidence/inspiration-350d9041.jpg).

- [Initial view](evidence/00-start.png): retains near-black teal water, drowned tree silhouettes, a descending colossal finger and concentrated golden concentric ripples. The wider playable camera shows more forest; the original's close photographic hand detail is approximated with curved geometry, crease rings, hairs and procedural grain.
- [First major upgrade](evidence/upgrade.png): amber fingertip remains a landmark; horns and enlarged muscular body distinguish the upgraded silhouette. Fragment reward feedback is visible. The camera views the creature from behind, so its eyes read less strongly than the reference's profile eye.
- [30 seconds](evidence/30-seconds.png): the creature has left the hand for the flooded grove, preserving blue-green trunks, dark water and amber highlights. Repeated branch shapes and visible water streaks remain more stylized than the source.
- [Three minutes](evidence/180-seconds.png): continued traversal/destruction in a different grove with the evolved body and persistent accumulated nutrients. Color language remains consistent; richly sculpted organic assets would improve fidelity most.

Not verified: a full giant rescue, every evolution prerequisite combination, all traversal unlocks in a normal playthrough, mobile/gamepad hardware, save recovery across browser versions, long-session memory behavior, integrated-GPU frame rate, and 30-minute fun/balance. The source contains these mechanics, but this run does not establish those outcomes.
