# Procedural asset manifest

Inspiration image: 9fddeb9e. The source photograph is not needed at runtime.

All game art is generated in `src/game.js`. No downloaded models, fonts, textures, music or sound effects. Three.js is the sole runtime library, vendored from https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js (0.170.0). Its MIT notice is retained in the file.

| Replaceable asset | Generator prompt | Target specification |
| --- | --- | --- |
| EVA surfer | Worn white EVA astronaut, gold-black visor, ribbed articulated sleeves, paired oxygen tanks, thermal damage and orange utility accents, cinematic cold blue rim light. Separate backpack, wings and tanks. | GLB, 12k triangles, 1×1024 PBR atlas, 1.8m tall, neutral pose, modular attachments |
| Heatshield | Torn hexagonal heatshield fragment with layered charcoal ceramic tiles, exposed bronze honeycomb, scorched jagged edge. Rideable silhouette. | GLB, 4k triangles, 2×1m, origin at top center, 1024 PBR atlas; six attachment tiers |
| Station | Exploded cylindrical orbital station, exposed pressure rings, ripped thermal blankets, bent trusses, broken blue solar wings; orange molten interior. | Modular GLB, 25k triangles total, 2048 atlas, separated breakable pieces, 40m long |
| Fire texture | Turbulent orbital fuel fire, white-gold pockets, orange filaments, coal-dark curls, isolated transparent edges. | 8×8 flipbook, 2048 RGBA, premultiplied alpha, 2-second seamless cycle |
| Earth | North Atlantic orbital Earth, deep blue ocean, slate coasts, thin cloud filaments and brilliant cyan atmospheric rim. | 4096×2048 equirectangular albedo and cloud mask, no baked stars |
| Island surfaces | Wind-worn coastal basalt, scrub and pale sand; cold dawn, natural small-scale variation, no perspective. | Seamless 1024 PBR material set; world-space triplanar sampling |
| Salvage fragments | Shattered satellite aluminum, ceramic and copper insulation, irregular folded shapes. | 12 GLB pieces, 200–500 triangles each, shared 512 atlas, centered pivots |
| Ground crates & mast | Weathered coastal emergency radio transmitter, open lattice antenna and compact striped supply cases. | 8k triangle mast, 600 triangle crates, 1024 atlas; breakable crate panels |
| Re-entry wind | Muffled EVA helmet rumble rising into plasma hiss, tactile low end, no voices or musical melody. | 12-second seamless stereo OGG, -18 LUFS, 48kHz; blend by speed |
| Impacts / salvage | Ceramic shatter, metal snap, glassy salvage ping, short compressed jet bursts heard through a helmet. | Eight isolated mono WAVs, 48kHz, under 0.7s, no reverb tail over 1s |
| Optional music | Minimal tense analog pulse, cold space ambience with warm distortion during atmospheric entry, no vocals. | Three synchronized 60-second OGG stems, 100 BPM, -20 LUFS |

Current replacements: detailed primitive assembly and merged geometry for station/suit; custom procedural Earth shader; noise-generated fire canvas; instanced fragments; continuous terrain height function and triplanar grain shader; Web Audio noise and oscillators. There is no runtime asset generation service or network use.
