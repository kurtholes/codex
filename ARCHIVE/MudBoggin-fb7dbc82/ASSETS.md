# Procedural assets / replacement queue

All current geometry and materials are generated in game.js. Audio is synthesized with Web Audio; there are no external asset files or licensing dependencies. Three.js 0.170.0 loads from its pinned jsDelivr URL. No other runtime requests.

| Replaceable asset | Generator prompt | Target specification |
|---|---|---|
| ATV | Mud-caked charcoal utility ATV, wet plastics, tubular steel bars, rubber controls, knobby tread, spring suspension, realistic backwoods proportions; separate steering and wheel pivots | GLB, under 30k triangles, 2×1K PBR atlases, named wheels and bars, 2m long |
| Cockpit | First-person mud ATV cockpit, gray LCD, braided cables, oval right mirror, scuffed black handlebar housing | GLB, 15k triangles, 1K PBR, near-plane-safe geometry |
| Mud | Churned chocolate clay, fresh parallel ATV tracks, wet dark aggregates, no vegetation, cloudy illumination | Seamless 1024² albedo/normal/roughness, world-space triplanar sampling |
| Forest | Sparse spring birch and dense dark spruce, damp backwoods forest edge beneath overcast sky | 6 GLB variants, 2k triangles each, 512² atlas, two LODs |
| Shed / fence | Rotten logging shed and split-rail fence, damp gray-brown timber, splinterable boards | GLB pieces, under 8k triangles, 1K atlas, separate fracture chunks |
| Sky | Heavy gray northern storm deck, silver horizon, low dark clouds, no blue sky or sun disk | 2K equirectangular HDR, low contrast, no ground objects |
| Engine | Single-cylinder ATV idle, loaded low-gear rumble, aggressive throttle rev and overrun | Four seamless mono OGG loops, 48kHz, 2–4 sec, normalized -18 LUFS |
| Mud impacts | Thick mud tire churn, heavy water splash, small clod impacts, wet wood splintering | 12 mono OGG one-shots, 48kHz, .2–1.5 sec, no clipping |

Music is deliberately absent: engine, wheel spray and forest quiet carry the mood.
