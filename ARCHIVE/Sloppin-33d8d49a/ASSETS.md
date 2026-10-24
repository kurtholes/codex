# Procedural asset replacement sheet
All current geometry, surface noise, sky, rain, impacts and grunts are generated in game.js. No third-party art or audio is bundled. Three.js 0.170.0 is loaded from jsDelivr. Replacement assets are optional; the game runs without a generator.

| Asset | Generator prompt | Target specification |
|---|---|---|
| Pig | Enormous mud-soaked black farm pig, low heavy shoulders, sagging jowls, folded ears, cloven hooves, tiny eyes, curled tail, charcoal bristles, wet brown-black slurry; realistic silhouette | Rigged GLB, under 18k triangles, 2K PBR atlas, root/waddle/toss/surf animations; forward -Z |
| Cabbage | Rotten pale olive cabbage, ragged wet outer leaves, dirty cream heart | GLB, 3 LODs 800/240/60 triangles, 512px atlas, pivot at soil |
| Farm kit | Storm-battered weathered fence, timber trough, compost cart, collapsing plank shed | Modular GLB, under 1k triangles per piece, separate fracture chunks, 1K atlas |
| Orchard | Neglected fruit tree with black twisted bark, sparse dull olive canopy | GLB 3 LODs 2400/600/100 triangles, separate trunk/crown |
| Mud surface | Black-brown churned farm slurry with cabbage fragments, puddled wet earth, no baked lighting | Seamless 1024px albedo, normal, roughness; use world-space triplanar mapping |
| Storm | Oppressive silver storm clouds over flat dark farmland, distant broken tree line | 2K equirectangular HDR environment, no sun disk |
| Root / impacts | Deep wet tearing squelch, gravelly soil spray, cabbage crunch, timber splinter, no voices | 6 mono WAV variants each, 0.15–0.6s, 44.1kHz, normalized -12dB |
| Pig | Huge pig breathing, guttural short effort grunt, snort, wet belly slide | Mono WAV, 0.2–1.2s, 6 variants, no speech |
| Ambience | Distant thunder, steady fine rain, bleak farm wind | Stereo seamless 45s WAV loop, 44.1kHz, quiet mix; no music needed |
