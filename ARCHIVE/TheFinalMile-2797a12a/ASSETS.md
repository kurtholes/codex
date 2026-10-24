# Procedural asset replacement sheet
Everything currently comes from procedural geometry, shader noise, CSS, and Web Audio. No external art or audio files. Three.js 0.180.0 is the sole runtime dependency, loaded from jsDelivr.

| Asset | Generator prompt | Target spec |
|---|---|---|
| Coupe | Battered late-1980s charcoal coupe, red strip tail lamps, chrome bumpers, two seated silhouettes, sun-bleached desert wear, separate wheels and detachable panels | GLB, 15k triangles, 2K PBR atlas, 5.4m long |
| Crystal city | Impossibly tall needle skyline, cool lavender glass spires, luminous vertical seams, clustered low podiums, amber sunset reflections | Modular GLB towers, 2k triangles each, 1K PBR |
| Desert rocks | Rust-brown basalt and eroded sandstone mesas, angular broken faces, golden desert dust | LOD GLB set, 300/100 triangles, seamless 1K textures |
| Roadside garage | Abandoned desert fuel stop, faded cream steel, orange hazard markings, breakable canopy and pumps | GLB, 8k triangles, separate fracture pieces |
| Terrain surfaces | Burnt sienna gravel and cracked asphalt, no directional lighting or perspective | Seamless 1K albedo/normal/roughness; world triplanar |
| Engine | Rough old inline-six, loaded acceleration, loose rattling bodywork | Mono WAV, 48kHz, clean 4-second loops at three RPMs |
| Impacts | Crunching sheet metal, glass fractures, gravel scattering | Mono WAV, 48kHz, 12 variants under one second |
| Ambience | Warm desert wind with distant metallic crystal resonance; no voices | Stereo OGG, 60-second seamless loop |
