# Procedural asset replacement map

All geometry, surface detail, sky, particles and audio are generated locally. The only runtime library is **Three.js 0.170.0**, loaded from its exact jsDelivr URL. No image files, external models, recorded audio or generative service calls are used. Surfaces use generated world-space triplanar grain; sky uses a generated canvas texture and environment map. All future replacements should retain the peach / olive / tarnished gold / black iron / electric-blue palette.

| Current asset | Local-generator replacement prompt | Target specification |
|---|---|---|
| Knight armor and chassis | Towering tarnished brass knight, huge layered curved pauldrons, engraved worn sun emblems, rivets, black exposed pistons, thin electric-blue conduits; industrial cathedral silhouette | GLB, 25k triangles, separate arms / legs / armor sockets, 2K PBR atlas, 10m tall; LODs 12k / 3k |
| Rival fortress-knights | Walking citadel mounted on a mechanical knight, stepped shoulder battlements, spires and smokestacks; increasing scale from warden to sovereign | Five GLBs, compatible limb pivots, 25k / 8k / 2k LODs, 2K atlas |
| Upgrade machinery | Six increasingly powerful levels each of furnace rings, joint pistons, overlapping shells, winch drums and chimney arrays; branching condensing versus blast steam systems | Modular GLB socket parts, under 1k triangles each, shared brass / iron atlas |
| Ripped armor | Curved riveted sun-etched shoulder plate torn from a fortress-knight, usable as a shield or club | GLB, 1k triangles, grip at origin, 1K atlas |
| Foundry modules | Weathered stone river-valley foundry with brass crenellations, iron windows, buttresses, tall smoking chimney, breakable walls and towers | GLB 4m modules, separate fracture chunks and fall pivots, 1K atlas; 500 triangles per wall |
| Citadel silhouette | Dense distant cathedral foundry with layered towers, iron pinnacles and an impossibly tall central smokestack | Single GLB, 4k triangles, two materials, 256px silhouette atlas |
| Terrain surface | Olive grass plain, damp gravel riverbank and exposed worn gray rock; no baked lighting | Seamless 1K albedo / normal / roughness, triplanar-compatible |
| Armor surface | Tarnished brass, tiny scratches and dark dents, fine engraved sun rays, warm worn edges | Seamless 1K PBR, no directional lighting |
| Cloud sky | Vast peach sunset, amber horizon, mauve cloud banks, dramatic light at left, soft smoky depth | 2K equirectangular HDR environment, seamless longitude |
| Valley vegetation | Sparse dark olive grass tufts and weathered river rocks, miniature against immense walking machines | GLB clusters, 30–100 triangles, instancing-ready, shared 512px atlas |
| Metal hit / break | Ten-ton iron fist crumples brass plate, deep hammer resonance followed by rattling fragments, no voice | Mono WAV, 0.4–0.8s, four variants each, peak -6dB |
| Steam / winch / rip | Giant piston hisses, winch gears strain, armor tears at the rivets; punchy industrial sounds | Mono WAV, 0.3–0.7s, three variants each |
| Planted footstep | Enormous iron knight plants a heavy foot on wet gravel, short sub thump and stone crunch | Mono WAV, 0.4s, four variants |
| Valley ambience | River and wind through grass beneath distant foundry machinery, no voices | Stereo OGG, 45s seamless loop |
| Rumble music | Rhythmic industrial percussion and low brass, heavy mechanical pulse; sunset scale, no vocals | Stereo OGG, 90s seamless loop |
