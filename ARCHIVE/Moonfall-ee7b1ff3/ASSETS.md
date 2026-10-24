# Procedural assets / replacement guide
All current meshes, surface patterns, particles and sounds are generated in code. No external art/audio assets. Three.js is the sole runtime library, pinned to jsDelivr 0.170.0. No font downloads.

| Replaceable asset | Generator prompt | Target specification |
|---|---|---|
| Amber sanctuary | Jagged obsidian island mountain, split amber crystal crown, lavender dusk, serrated asymmetrical silhouette; no buildings | glTF, <25k triangles, 3 LODs, separate emissive crystal, 150m tall |
| Escape ship | Arctic salvage spacecraft, swept broken-slate fins, twin engines, faceted amber cockpit, heavy underslung cannon | glTF, <12k triangles, separate fins/engines/cannon, 12m wingspan |
| Suit | Lone dark expedition suit, long narrow silhouette, sealed amber visor, compact twin jetpack | Rigged glTF, <8k triangles, run/jump/hover loops |
| Moon surface | Peach limestone impact craters, fine dusty ridges, no baked lighting | Seamless 1k albedo/normal/roughness; triplanar sampled |
| Ice and basalt | Dark blue fractured rock and lavender frozen tidal flats | Two tileable 1k PBR sets, world-space triplanar |
| Cannon SFX | Slow enormous electromagnetic cannon, sub punch, crystal splinters, short tail | Mono 48kHz WAV, 0.7s; replace synthesized bass sweep |
| Impacts | Moonstone crashes through frozen basalt, bass crack and scattering ice | Three mono WAV variants, <1.5s |
| Ambience/music | Spacious cold wind, low orbital rumble, sparse glass harmonics, rising danger without percussion overload | Stereo seamless 90s OGG loop; current build uses action synthesis only |
