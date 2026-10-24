# Procedural asset replacement guide
All current geometry, shaders, particles and oscillator sounds are authored locally. The only runtime external resource is pinned Three.js 0.170.0 from jsDelivr. No asset generators were used.

| Asset | Replacement prompt | Target spec |
|---|---|---|
| Wanderer | Rear-facing hooded wanderer, flared heavy charcoal cloak covered in tiny weathered glyphs, recessed faceless hood, pale green luminous scroll held forward; teal cavern lighting | GLB, 8k triangles, rigged run/vault/charge, 1k PBR maps |
| Masonry | Ancient black stone labyrinth wall, chipped edges, engraved lost script, green moss in seams, broken modular caps | GLB modules, 1–3k triangles, 1k seamless material |
| Stone surface | Charcoal rough slate, tiny mineral flecks, shallow incised glyphs, sparse moss; no baked light | Tileable 1024 PBR albedo/normal/roughness; triplanar mapping |
| Fungi | Bioluminescent cyan mushroom clusters, delicate translucent caps, subterranean moss | GLB, 500 triangles per cluster, atlas 512 |
| Guardian | Heavy angular stone sentinel, floating carved torso and fractured arms, narrow turquoise eye slit | GLB, 3k triangles, locomotion and stagger |
| Cavern | Colossal dark jagged cavern silhouettes with mist and distant storm glow | Modular GLB, LOD 2k/500 triangles |
| Charge impact | Deep stone shoulder impact, grit shower and tumbling blocks, short crisp transient | Mono WAV 48kHz, 0.6 seconds, normalized -3dB |
| Beacon | Resonant glass harmonic bloom, warm luminous chord, subterranean echo | Stereo WAV 48kHz, 2 seconds |
| Ambience | Deep cavern air, sparse distant thunder, subtle water drips, no voices or melody | Seamless stereo OGG loop, 60 seconds |
