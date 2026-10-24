# Procedural asset manifest
All current assets are generated in game.js. No third-party models, textures, recordings or fonts. Three.js 0.170.0 is the sole runtime dependency, loaded from the pinned jsDelivr URL. No application network requests occur beyond that module load.

Future local-generator replacements:

| Asset | Prompt | Target specification |
|---|---|---|
| Titan face | Monumental tarnished silver mechanical human face, screaming oval mouth, layered orbital bearings, glowing white eyes, broken bureaucratic cathedral, charcoal and chalk palette | GLB, 30k triangles, 2 LODs, metallic/roughness, mouth and eyes separate, 55m tall |
| Worker | Faceless demolition worker, long chalk-white coat, twin industrial hover engines, heavy staple cannon | GLB, 6k triangles, idle/hover/boost clips, 2 LODs |
| Monuments | Cracked black stone legal monuments with recessed scales and laurel relief, fracture seams | GLB, 3k triangles each, 8 fracture chunks, 3 LODs |
| Stone and silver | Seamless fractured charcoal limestone and tarnished brushed silver | 1024 square albedo/normal/roughness; world-space triplanar sampling |
| Paper | Chalk-white unfinished forms, fine gray printed rules, abstract illegible stamps | 512 square atlas, 4 sheets, no readable narrative |
| Cannon | Heavy slow industrial staple discharge, compressed metallic thump followed by hot mechanical ring | Mono WAV 48kHz, 0.5 seconds, seamless variation set of 5 |
| Collapse | Stone column buckles, low rumble, scattered masonry and fluttering paperwork | Stereo WAV 48kHz, 2 seconds, no speech |
| Ambience | Huge dark machine breathing behind white paper waterfall, restrained industrial drones, no melody or vocals | Stereo OGG, 60-second seamless loop |

Current audio uses short Web Audio oscillators. Current face is built from nested ellipsoid shells, orbital toruses, brow geometry, bridge, nostrils, mouth and bearing assemblies. Paper and debris use instanced geometry. Stone and silver use procedural world-space triplanar grain, without image textures.
