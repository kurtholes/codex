# Procedural asset replacement manifest
All current geometry, surface grain and audio are generated in game code. No downloaded artwork, recordings or model assets. Three.js 0.170.0 is the sole runtime dependency, loaded from jsDelivr.

| Asset | Replacement prompt | Target specification |
|---|---|---|
| Storm bull | Colossal living charcoal thunderhead shaped like a charging bison, broad lowered brow, spiral dust, tapered ivory horns, tiny ember eyes; golden backlight | GLB, 20k triangles, separate horns/eyes/cloud lobes, 3 LODs, under 3 MB |
| Matador | Lone prairie storm matador, rumpled white shirt, dark trousers, leather boots, weathered scarlet cape, tousled dark hair | Rigged GLB, 8k triangles, idle/run/side dive/slide/glide animations, 1k PBR atlas |
| Frontier ranch kit | Sun-bleached red timber barns, silo, windmill, elevated water tank; golden prairie frontier | Modular GLB, breakable pieces with pivots, 3 LODs, under 15k triangles per structure |
| Ground | Dry cracked prairie earth, wheat stubble, ochre sand, no baked light | Seamless 1k albedo/normal/roughness; world-space triplanar sampling |
| Storm sky | Charcoal thunderhead opening onto pale golden sunlight, painterly photographic cloud detail, no terrain | 2k HDR equirectangular, horizon level |
| Wind bed | Low open prairie wind, distant rolling thunder, no voices or music | Seamless 30s mono OGG, -20 LUFS |
| Perfect dodge | Cloth cape snap into a deep cinematic wind whomp and bright ringing overtone | 0.7s mono OGG, no clipping |
| Destruction | Timber splitting, iron groaning, fragments drawn into a roaring vortex | 6 variants, 1s mono OGG, -14 LUFS |

Replacement assets should preserve the charcoal / ivory / wheat-gold palette. The current synthesized audio requires a user gesture to start.
