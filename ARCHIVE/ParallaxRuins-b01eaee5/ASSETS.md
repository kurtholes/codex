# Procedural asset manifest
All present geometry, surface patterns, particles and sound are generated in source. No external art, font, music or audio files are required. The image is a reference, not a runtime asset.

| Replaceable asset | Generator prompt | Target specification |
|---|---|---|
| Cross timber | Monumental interlocked ancient wooden cross, chipped endgrain, black ink fibers, ochre parchment palette, copper pegs, no symbols | GLB, under 12k triangles, pivot at hinge, separate two beams, 1m units |
| Striped cathedral | Hollow clustered striated wooden basalt cliffs, charcoal ink grooves and parchment highlights, open central doorway | Modular GLB segments, 4k triangles each, collision proxy, 2 LODs |
| Traveler | Tiny rust-red cloaked parchment mapmaker, black bob-shaped hood, ivory face, wooden staff, no modern detail | Rigged GLB under 5k triangles, idle/run/leap/push, 512px atlas |
| Parchment | Weathered golden ochre paper, fibrous grain, tiny charcoal stipple, no lettering, no baked lighting | Seamless 1024px basecolor/roughness/normal; world triplanar sampling |
| Timber surface | Ancient engraved wooden fibers, black etching, dry warm ochre, chipped ends | Seamless 1024px PBR set; triplanar |
| Bare tree | Twisted leafless ink-black tree, irregular branching, isolated rocky parchment island | GLB under 6k triangles, silhouette preserved in 2 LODs |
| Scrape / collapse | Heavy dry timber grinding over stone, brittle ceramic cascade, papery grit, warm close impact | Mono WAV 48kHz, 0.3–1s, normalized -6dB, no speech |
| Seal / sight | Delicate resonant wood chimes and a soft inhaling parchment shimmer | Mono WAV 48kHz, 0.3–0.8s, clean tails |
| Ambient bed | Quiet warm wind across enormous dry parchment cliffs, faint wood creaks, sparse organic tones | Stereo OGG 60s seamless loop, -22 LUFS, no voices or drums |
