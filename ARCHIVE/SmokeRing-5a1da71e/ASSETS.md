# Procedural asset register
All current art is generated in JavaScript; all sound is synthesized with Web Audio. No external artwork or sound files are required. Three.js 0.169.0 is the sole CDN runtime dependency. Terrain, timber and roof surfaces use world-space triplanar procedural grain.

| Replaceable asset | Generator prompt | Target specification |
|---|---|---|
| Village hut | Crooked six-sided woodland stilt hut, overlapping weathered slate shingles, open dark door, rough timber braces, blue-black moonlit palette, modular destruction seams | GLB, under 4k triangles, six separated breakable groups, 5m footprint, 8m high |
| Keeper | Soot-cloaked woodland engineer, iron mask, twin ember burst jets, huge cylindrical siege cannon, amber exhaust | Rigged GLB, under 6k triangles, idle/flight/recoil loops, 2m tall |
| Crawlers | Low six-legged bark-and-chitin horror, glowing amber eyes, sharp readable silhouette | GLB, 2k triangles, walk/hit/death, 3m long; 8m giant variant |
| Chimney | Hand-stacked irregular stone chimney, iron mouth rings, glowing coal bowl, pale rising smoke | GLB, 3k triangles, 6m high; smoke separate |
| Timber grain | Seamless rough waterlogged timber, cold grey brown, no baked lighting | 512px tileable albedo/normal/roughness, triplanar ready |
| Terrain | Wet woodland mud and roots, near-black teal, sparse moss | 512px seamless PBR maps, triplanar ready |
| Cannon SFX | Heavy ember mortar launch, soft sub impact and metallic chuff, no speech | Mono WAV, 0.4s, normalized -6dB |
| Impact SFX | Chunky wood splinter and insect shell crack with bass thud | Six mono WAV variants, 0.7s each |
| Flight SFX | Smoky compressed ember turbine burst with airy sustain | Mono WAV, seamless 1s loop and 0.2s ignition |
| Ambience / music | Moonlit wet forest, creaking timber, distant insect clicks, slow ominous tonal drone, no melody or vocals | Stereo OGG, 90s seamless loop, -20 LUFS |
