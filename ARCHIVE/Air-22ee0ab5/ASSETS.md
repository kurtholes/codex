# Procedural asset replacement guide
All current geometry, surface grain, snow, fragments and audio are generated locally in JavaScript. No external art files or audio downloads. Three.js 0.170.0 is the sole CDN runtime import.

| Asset | Generator prompt | Target specification |
|---|---|---|
| Pressure greenhouse | Frost-encrusted arched industrial greenhouse, charcoal ribbing, scratched glass, amber airlock, green algae beds; cold alien planet | GLB, under 20k triangles, separate glass/frame/beds, 12m wide |
| Cutter and glove | Heavy charcoal salvage cutter, silver wear, amber pressure strips, insulated astronaut glove | GLB, under 8k triangles, first-person silhouette, separate recoil parts |
| Cargo wrecks | Broken cylindrical spacecraft hulls and bolted cargo boxes, silver frost over blue-black metal | 4 GLBs, under 5k triangles each, fracture-ready parts |
| Basalt terrain | Wind-scoured frozen basalt, gray-blue ice, rough frost veins, no baked directional light | Seamless 1024 color/roughness/normal maps for triplanar mapping |
| Alien crops | Luminous oxygen algae, broad frosted fern fronds, pale green bubble sacs | 6 plant GLBs, 300–1000 triangles, growth stages |
| Wind | Low polar wind, helmet muffling, distant metal groans, no voices | 30-second mono seamless loop, OGG, normalized −22 LUFS |
| Cutting and debris | Pneumatic plasma cutter thump, brittle icy metal fracture, scattering shards | 8 mono one-shot OGGs, 0.1–0.8 seconds |
| Breathing | Muffled pressure-suit breathing, accelerating under low oxygen | 3 loopable mono 4-second OGGs |

Replacement assets are optional future work. Current synthesized wind, crunch/cutter impacts, upgrade tones and warning pulses require no files.
