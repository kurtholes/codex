# Procedural assets and possible replacements

All current models, surface noise, fog, stars and sounds are generated locally by the source. No external art, music or audio files are used. Three.js is the only runtime library (0.170.0, jsDelivr). The inspiration photograph is not shipped or requested at runtime.

| Asset | Generator prompt | Target specification |
|---|---|---|
| Sleeping giant | Serene closed-eyed cyan moon face, irregular spherical skull, delicately carved eyelids and tiny lips, tall interwoven hollow roots, midnight cobalt, no ornament, reference 3fbe3bda | GLB, 12k triangles, three LODs 12k/4k/1k, PBR 1024 textures, 100m tall, root at origin |
| White traveler | Slender traveler seen from behind, short dark hair, luminous backless white gown dividing into sixteen long fabric ribbons, elegant quiet silhouette | GLB, 8k triangles, simple humanoid rig, separate ribbon bones, 1.9m human scale |
| Derelict carriage | Rust-orange abandoned 1930s rail carriage, faded cobalt paint, broken windows, exposed wheel bogies, foggy night | GLB, 6k triangles, 24 independent fracture pieces, 17m long, 1024 PBR atlas, three LODs |
| Root bridge | Interwoven cyan deadwood root arch, organic load-bearing lattice, splinterable intersections | GLB, 5k triangles, 12 separable chunks, 35m span |
| Terrain material | Basalt rubble, wet charcoal soil, cobalt shadows, fine rust gravel, seamless with no directional lighting | Tileable 1024 albedo/normal/roughness; sample in world-space triplanar shader |
| Dream shell impact | Soft rising sub-bass swell ending in distant enormous thunder and brittle metallic collapse, spacious and dreamlike, no voices | Mono WAV, 48kHz, 1.5 seconds, peak -3dB; separate launch, impact and debris layers |
| Energy absorption | Delicate glass harmonic rising chime with airy tail, restrained, no harsh transient | Mono WAV 48kHz, 0.35 seconds, six pitches |
| Ambient bed | Wordless midnight railway dream, low wind, distant bowed metal and slow cobalt drone, no percussion or melody foreground | Stereo OGG, 90-second seamless loop, -23 LUFS |

Current synthesized sounds: descending sine launch, bass triangle/saw impact, ascending sine pickup and upgrade chime, filtered noise wind and a quiet 47 Hz drone. Fog is a canvas-generated radial alpha sprite; large surfaces use procedural world-space triplanar noise, never UV-stretched images.
