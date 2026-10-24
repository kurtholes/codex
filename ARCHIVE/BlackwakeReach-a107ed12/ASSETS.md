# Procedural asset replacement manifest
All current assets are code-generated. No external art or audio is bundled. Three.js 0.170.0 is loaded from the specified jsDelivr URL.

| Current asset | Replacement prompt | Target specification |
|---|---|---|
| Parametric ribbed ship, curved sails, railings, guns, rigging | Black-sailed two-masted pirate frigate, weathered black oak, amber stern windows, charcoal canvas, intricate spars; slate ocean mood | GLB, under 35k triangles, 3 LODs, separate sail/cannon/hull damage nodes, 2K PBR |
| Faceted cliff clusters | Jagged near-black volcanic sea stacks, wet slate strata, broken overhangs | 6 modular GLBs, 2k–8k triangles, 3 LODs |
| Triplanar procedural grain | Seamless wet dark slate and aged oak, silver highlights | 1K albedo/normal/roughness, repeatable; retain triplanar mapping |
| Fort blocks, docks and crates | Ruined coastal pirate battery, damp masonry, lantern docks, splinterable timber | Modular GLBs, separate fracture chunks, under 20k triangles per island |
| Coat captain | Dark tricorn captain, long charcoal coat, pale cutlass, brass pistol | Rigged GLB, 5k triangles, walk/slash/fire clips |
| Noise-buffer cannon and hit sounds | Thunderous naval cannon with wood creak, rigging snap, splinters, distant tail | Mono WAV 48kHz, 0.2–2 seconds, normalized -6dB |
| No music | Low ocean drone, distant bowed strings, wind through rigging, sparse ship bells; no vocals | Seamless 90-second stereo OGG, -18 LUFS |
| Procedural water and wake rings | Wind-torn slate ocean foam with thin silver spray | Tileable 1K normal/foam atlas, 16-frame wake atlas |
