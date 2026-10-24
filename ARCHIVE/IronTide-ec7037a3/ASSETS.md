# Procedural asset replacement manifest
All current art is generated with Three.js geometry and shaders. No external art, fonts, samples or music are used. Three.js 0.169.0 loads from its exact jsDelivr URL; it is the sole runtime dependency and network request.

| Current asset | Replacement prompt | Target specification |
| --- | --- | --- |
| Crowned queen sculpture | Silent iron-crowned woman in corroded, floor-length riveted gown; flowing wire hair, elongated realistic face, moss-black iron, oxidized brass crown; dark industrial beauty | GLB, 35–45m tall, under 25k triangles, 2 × 1k PBR atlases, grounded pivot, opaque materials |
| Steam tug | Brutal compact soot-black harbor steam tug, brass boiler, articulated front winch, riveted hull, cyan cabin, tire fenders and modular paddle-wheel sockets | GLB, 8m length, under 12k triangles, separate engine/armor/rig sockets, 1k PBR |
| Skeletal wreck ships | Rust-black nineteenth-century shipbreaking hull, exposed ribs, three bare masts, dangling rigging, moss and oily metal, no sails | Modular GLBs, 40–100m length, under 15k triangles per ship, three LODs, separate structural seams |
| Cranes / boilers | Corroded Victorian dock crane with brass hydraulic joints and brittle lattice boom; horizontal pressure boiler with glowing cyan gauges | GLBs, separate breakable sections, under 4k triangles each, hull collision proxy |
| Harbor surfaces | Seamless mossy riveted iron, corroded brass, soot stone, subtle oily roughness, dark sulfur-green palette | 1k albedo/normal/roughness; world-space triplanar sampled, no baked directional light |
| Winch and impact tones | Cable straining with ratchet clicks and metallic groans; violent boiler rupture, grinding steel hull collision, falling gantry | Mono WAV 48kHz, 0.2–2s one-shots, normalized -6dB, seamless 2s winch loop |
| Harbor ambience | Low steam engines, distant iron creaks, poisoned harbor waves, sparse wind, ominous industrial silence, no voice | Stereo 48kHz OGG, seamless 45–60s, under 2MB |
| Optional music | Slow mechanical pulse, deep bowed metal, restrained brass drone, oppressive sulfur-fog dock mood, no vocals | Stereo OGG, seamless 90s, intensity stems, under 4MB |

Current sound is short synthesized Web Audio oscillators. Current particles and debris use instancing. Current skyline is baked into material batches. No generated replacement assets are required to run the game.
