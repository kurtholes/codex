# Validation

The source and production scripts pass Node syntax checks. The production smoke test loaded the static build, entered Quick Raid, held movement/thrust/fire inputs, and opened the forge. No page errors occurred. `?dev` did not expose `window.__game` in production; the build strips the development block.

The three-minute raid harness runs Chromium headless with SwiftShader, Low quality, and a 960×600 viewport. It uses monotonic timing because the shared environment's wall clock jumped during earlier attempts. It teleports between targets, fires real projectiles, waits for natural salvage attraction, and buys the first siege upgrade through its actual UI. It grants 1,000 currency for that purchase check. This validates mechanics, not unassisted aiming, balance or navigation. Checkpoint and JSON reports, plus screenshots at opening, 30 seconds, 180 seconds and first upgrade, are under ignored `test-output/`.

Visual comparison with inspiration 0c8672a9: the opening retains a large gold-lettered HECTOR banner, central braced timber tower, flanking pitched huts, rope approach bridge, black silhouettes, orange sunset and violet clouds. Later frames show free flight across offshore towers and the changed skyline after collapse. The reference has much richer wood, thatch, cloud and water detail; this build uses a deliberately geometric procedural approximation. The tower collapses as a rigid assembly, and nearby bridges remain suspended rather than severing.

Not verified: integrated laptop GPU performance, real-device audio quality, a full five-minute quick-play timeout, all 48 upgrade purchases, 30-minute progression balance, touch/gamepad, and long-term storage migration. The 60 fps hardware target remains unproven. No claim of per-joint destruction, grapple movement or a finished visual story encounter is made.

Recorded run: 247.1 seconds including screenshot overhead; first action 2.64 seconds; Low sampled FPS mean 33.2; 0 console/page errors; 0 browser interruptions. Final score 1824, salvage 2690, siege tier 1. Final live fallen-platform count 15 (districts rebuild during play).
