# Procedural asset manifest

All current visuals are generated from geometry, shaders and canvas at runtime. All audio uses Web Audio synthesis. No generated raster art, model download, music recording or external runtime requests are used. Three.js 0.160.1 is vendored from the exact jsDelivr URL in README.

Potential local-generator replacements (optional; the game runs without them):

| Asset | Generator prompt | Target specification |
|---|---|---|
| Revenant | Hooded rooftop bass warrior, folded wet black cloak with torn asymmetric hem, oxidized steel skull respirator, two dim cyan slit eyes, armored gauntlets; rain-soaked cyberpunk silhouette, no logos | GLB, Y-up, 4m tall, under 15k triangles, one 1k PBR atlas, idle/hover/charge rig; preserve readable hood and speaker mounts |
| Speaker rig | Battered industrial twin woofer stacks with recessed cones, circular cyan rim LEDs, steel corner braces, exposed cable harness, black scratched enclosures | GLB, under 6k triangles each, one 1k PBR atlas; separate cone meshes for bass animation |
| Samurai | Crimson-fog silhouette, broad conical helmet, long katana, ragged coat, layered black lamellar shoulder armor | GLB, under 4k triangles, one 512 atlas, LOD 1k/300 triangles; idle, slash, recoil |
| Wet concrete | Seamless dark rain-soaked concrete and oxidized industrial roof metal; irregular puddles and fine grit, restrained cyan reflection; no baked lights | 1k tileable albedo/normal/roughness; world-space triplanar at 4.5m repeat |
| Neon signage | Vertical industrial red and cyan abstract signal glyphs, sparse scanlines, no words or real brands | Transparent 256×1024 atlas; emissive planes, low pixel area |
| Bass charge/drop | Enormous descending analog sub-bass, saturated transient, airy wet rooftop tail; strong weight on small speakers without clipping | Mono 48kHz WAV, charge loop 1s and drop one-shot .8s, peak -3dB, sub content 45–100Hz with harmonics |
| Katana counter | Metallic katana scrape into a snapping reversed bass pulse, bright short confirmation | Mono 48kHz WAV, .4s, peak -3dB |
| Demolition | Heavy rooftop machinery snapping, concrete chunks falling, short stereo rain-space tail | Stereo 48kHz WAV, 1s, three variants, peak -3dB |
| Ambient score | Sparse dark dub pulse at 100 BPM, cyan nocturnal pads, distant mechanical rain, no voice or melody competing with attack timing | Stereo 48kHz OGG, seamless 90s loop, -20 LUFS; optional stems for combat intensity |

Current substitutes: custom ring-built cloak mesh and shaped hood/mask; detailed procedural speaker cones; five instanced samurai body parts; triplanar procedural concrete; instanced rain and debris; lowpass sine/saw bass and noise transients. Music is deliberately omitted: the player's charge and impacts provide the rhythm.
