# Procedural asset replacement guide
All current assets are generated locally in JavaScript. No external art, music or audio files are used. Three.js 0.170.0 is the sole runtime library, imported from the exact jsDelivr URL in game.js. Surface detail uses blended world-space projections of procedural grain (triplanar), without image textures or stretched UV maps.

| Replacement | Generator prompt | Target specification |
|---|---|---|
| Lake creature | Small eel-like lake monster, one luminous amber eye on either side, near-black wet teal hide, intricate skin folds, long muscular coilable tail, curious silhouette; no background | Rigged glTF, 8k triangles, 24 tail bones, 1k PBR maps; four optional anatomy attachment sets |
| Ancient hand | Ancient human hand extending into black water, deeply wrinkled bronze skin, silver hairs, gold fingertip; enormous scale | glTF 15k triangles, 2k PBR maps, articulated index finger, separate hair cards |
| Sleeping giant | Kind ancient giant submerged in drowned woodland, root-bound stone and skin face, shut golden eyes | glTF, 20k triangles, 2k maps, jaw and eyelid rig |
| Drowned forest | Broken twisted trunks with forked branches and grasping submerged roots, black teal wood, wet grain | 6 glTF variants, 1k triangles each, separate fracture chunks, three LODs |
| Sluice ruins | Root invaded ancient stone sluice fragments, blue-green mineral deposits, no readable symbols | 4 modular glTF pieces, 2k triangles each, fracture chunks and collider hulls |
| Water / terrain detail | Wet dark sediment, drowned bark and ancient creased skin, teal and muted bronze | Seamless 1k albedo/normal/roughness; sample through existing world triplanar shader |
| Wrench snap | Deep stressed timber creak, explosive splinter crack, underwater bass thump | 5 mono WAV variations, 0.8s, 48kHz, normalized -6dB |
| Swim / bite / surge | Muffled liquid rush, bubble pop feeding chirp, heavy underwater tail sweep | 3 sets of 4 mono WAVs, 0.15–0.5s, 48kHz |
| Ambience / music | Submerged dark teal lake, slow resonant wood pulses, warm amber shimmer, no voices | Seamless 90s stereo OGG, -20 LUFS; optional calm/action stems |

Current synthesis: oscillator pitch drops provide snap, bite and surge feedback. No soundtrack is bundled. No generator service is called by the game.
