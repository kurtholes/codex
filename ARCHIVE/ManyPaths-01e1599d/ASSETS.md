# Procedural asset replacement guide
All current assets are generated in Three.js. No downloaded models, textures, music or audio. Runtime library: Three.js 0.170.0, pinned jsDelivr import. Audio is synthesized oscillator envelopes.

| Current asset | Replacement prompt | Target specification |
|---|---|---|
| Sculpted coat runner | Faceless lone traveler, long midnight coat with gold luminous seams, elegant wind-swept hem, silhouette readable against peach sunrise | GLB, <12k triangles, 1 atlas 1024², idle/run/leap/land skeleton animations |
| Jagged mountain cones | Alien jagged alpine ridges, navy basalt, lavender mist, intricate craggy silhouettes | 4 seamless modular GLBs, <5k triangles each; world-space triplanar rock material |
| Procedural stone grain | Weathered blue-black basalt with pale lavender mineral veins | Seamless albedo/normal/roughness, 1024²; world-space triplanar sampling |
| Crystal fans | Fragile translucent ice shards, pale blue and warm-white internal glow | 6 GLB shard clusters, <800 triangles each, origin at base |
| Broken arches | Monumental ancient basalt arch, fractured voussoirs, embedded luminous seams | Modular intact/broken GLB pieces, <8k triangles total |
| Planet shader | Impossible cratered moon, dark navy shadow and peach crescent rim | Equirectangular 2048×1024 albedo/normal; no baked stars |
| Synth jump / shatter / slam | Airy electric leap; glass-ice fracture shower; immense warm sub-bass landing | Separate mono 48kHz WAV, .2/.6/1.2 seconds, normalized -3dB |
| Silence / optional synth notes | Wordless nocturnal ambient bed, luminous warm horizon, sparse cosmic glass tones, no beat | Seamless stereo 90s OGG, -18 LUFS, optional only |
