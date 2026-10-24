# Procedural assets / replacement briefs
Inspiration image: 60593e9d. No external art, music, fonts or sound files are used. Three.js 0.170.0 is the sole runtime library, imported from jsDelivr. Architecture is generated as extruded and warped arch meshes, merged relief geometry, lathed pottery and beveled instanced fracture blocks. Stone uses world-space triplanar procedural grain. Sounds use Web Audio oscillators and filtered noise.

| Replaceable asset | Generator prompt | Target specification |
|---|---|---|
| Relief figures | Weathered anonymous standing sandstone figures carved into a cave wall, long robes, folded arms, rounded headdress, eroded chisel marks, warm ochre, fictional ancient Anatolian underground city; no writing | GLB, 3 LODs, 6k/2k/500 triangles, 2m high, origin at feet, packed 1k PBR, embedded textures |
| Organic arches | Hand-hewn sandstone arcade, tall asymmetrical horseshoe vault, imperfect shoulders, eroded carved relief borders, ochre honey stone | Modular GLB, 12m span, 17m rise, <12k triangles per arch, lower LODs, tiling material using world coordinates |
| Excavation cannon | Heavy brass and blackened iron seismic excavator, ceramic resonance chamber, leather grip, concentric glowing amber rings; utilitarian archaeology tool | First-person GLB <15k triangles; separated barrel, chamber, ring and grip nodes; 2k atlas |
| Timber galleries | Ancient cracked umber timber balcony, irregular planks, pegged joints and diagonal braces | Destruction-ready GLB with 12 separate pieces, <4k total triangles, 1k atlas |
| Sandstone detail | Rough ochre sandstone, fine pitted grains and wavy sediment lines, no shadows or seams | Seamless 1k albedo/normal/roughness; sampled triplanarly at 2m scale |
| Seismic shot | Deep charging resonance rising into a heavy sub-bass launch, dry stone reverb, no modern gun crack | Mono WAV, 48kHz, charge loop 1s plus launch .7s, -16 LUFS, no clipping |
| Stone collapse | Heavy crumbling sandstone, large rock cracks followed by cascading grit and settling dust, enclosed cavern | 6 mono WAV variants, 48kHz, .8–2s, -18 LUFS |
| Cave ambience | Vast warm stone chamber, distant rubble ticks, light wind through daylight shafts, subtle timber creaks, no voices | Stereo seamless 60s OGG/WAV, -28 LUFS, subtle low frequency bed |
| Music | Tactile low percussion with warm resonant plucked strings, quiet exploratory energy, no vocals, slow layered pulse | Seamless 90s OGG loop, 80 BPM, 3 intensity stems, -24 LUFS |

Replacement assets should retain the procedural collision proxies and instancing pools. No source photograph is needed at runtime.
