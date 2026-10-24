# Asset ledger

All shipped visuals are procedural Three.js geometry, canvas instrument faces, and shaders. Audio is synthesized with Web Audio; there are no external asset or service requests. Three.js is the sole runtime library, vendored unchanged from https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js. Its MIT license is in `vendor/THREE-LICENSE.txt` and copied into dist.

Potential local-generator replacements (none required to run):

| Current asset | Replacement prompt | Target specification |
|---|---|---|
| Modeled flight console | Worn Victorian airship control bridge, dark mahogany panels, tarnished brass, black twelve-rib rubber central grip on turned brass pedestal, hand-lettered ivory instruments, amber caged lamps, realistic working parts, reference image 7501e781 | GLB, ≤35k triangles, 3×1024 PBR atlases, separate grip / lever / needle / wheel pivots, real meter scale, no baked lighting |
| Modular foundry blocks | Soot-black riveted industrial floating-island factory kit, warm slit windows, red pressure tanks, segmented smokestacks, aged brass bands, gantry cranes, suspension piers; compact readable silhouette | GLB kit, ≤800 triangles per module, 1×1024 atlas, separate destructible walls / roof / chimney sections, collision bounds |
| Floating rock islands | Angular suspended industrial basalt island, deep fractured underside, rusty perimeter ribs, flat factory deck, smoky teal and charcoal palette | Three LOD GLBs, 2500 / 800 / 150 triangles, seamless 512 PBR rock textures for triplanar mapping |
| Distant dirigibles | Huge cigar-shaped brass-gray airship, exposed dark ribs, mahogany gondola, four engine pods, warm lamps, heavy 1900s industrial silhouette | GLB, 8k / 2k / 300 triangle LODs, 1024 atlas, separate propellers |
| Collection drones | Tiny clockwork brass salvage tug, black folding wings, glowing amber headlamp, two clattering propellers, belongs on a Victorian airship | GLB, ≤1200 triangles, 512 atlas, independent propeller pivots |
| Procedural sky and clouds | Vast smoky industrial sunset, muted amber left sun, desaturated teal upper sky, charcoal haze, layered clouds, open central horizon, no landmarks or typography | Seamless equirectangular 2048×1024 HDR or WebP, no hard sun bloom clipping |
| Engine oscillator | Heavy dirigible engine room heard from timber bridge, rhythmic low piston chug, distant propeller wash, restrained brass rattles, no voices | Stereo OGG, 12-second seamless loop, -20 LUFS, strong mono compatibility |
| Cannon noise / triangle impulse | Deep ponderous naval cannon from enclosed timber cockpit, sharp pressure snap, bass recoil, short metal rattle and airy tail, no voices | 4 variants, mono OGG/WAV, 0.8–1.5 seconds, -16 LUFS, peak -1 dB |
| Destruction synthesis | Industrial metal tower tearing apart, tank pressure rupture, collapsing masonry and raining brass debris, satisfying separated transient layers | 6 mono OGG effects, 0.3–2 seconds, distinct near/far variants |
| Salvage and refit tones | Warm clockwork magnetic pickup, tiny brass chime; refit engages a heavier mechanical latch and rising steam-powered harmonic | 4 pickup variants ≤0.2 seconds; 2 refit variants ≤1 second, mono OGG, no melody |

No music track is shipped: engine, weapon and salvage sounds leave useful sonic space for navigation and action.
