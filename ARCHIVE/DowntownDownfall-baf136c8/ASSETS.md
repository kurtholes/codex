# Procedural asset inventory
Everything currently uses generated geometry, canvas sign textures, shader surfaces or Web Audio oscillators. No external artwork or audio is loaded. Three.js 0.170.0 is the sole CDN runtime import.

Potential local-generator replacements:

| Asset | Prompt | Target spec |
|---|---|---|
| Hooded flight rig | Charcoal hooded scavenger, long weathered coat, twin orange plasma thrusters, oversized industrial cannon, alien rain city | GLB, <12k triangles, 1 × 1k PBR atlas, articulated arms and exhaust sockets |
| Tower modules | Brutalist alien skyscraper, tapering antenna crown, magenta and amber neon, exposed structural braces | Six modular GLBs, <2k triangles each, compatible 9m floor grid, separate breakable facade |
| Saucer | Low broad black saucer, layered rim, copper running lights, small raised cockpit | GLB, <4k triangles, no baked background |
| Concrete and asphalt | Rain soaked charcoal concrete and broken black asphalt, subtle aggregate, no perspective or lettering | Seamless 1k albedo/roughness/normal maps, world-space triplanar application |
| Copper planet | Gigantic copper rocky planet, eroded dark ridges and rust-colored storm bands | 2k equirectangular map, no stars or lighting baked in |
| Cannon audio | Huge low plasma cannon thump, long electrical tail, no voice | Three mono WAVs, 48kHz, <1.5 seconds, normalized -3dB |
| Collapse audio | Concrete slab crack then dense chunky debris cascade, alien metal resonance | Four mono WAVs, 48kHz, <3 seconds |
| Ambience | Distant hover traffic, soft rain, low industrial machinery, no melody or speech | Stereo seamless 30-second OGG loop, -20 LUFS |

Current audio: synthesized descending sawtooth cannon/collapse, square drone pulses, sine upgrade chime. Current planet: shader-modulated sphere; current character: layered hood, face inset, coat, limbs, tanks, thruster collars and cannon. Debris is instanced procedural concrete chunks.
