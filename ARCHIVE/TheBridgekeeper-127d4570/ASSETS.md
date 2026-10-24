# Procedural asset replacement guide
All current geometry, surfaces, particles and sound are authored procedurally. No downloaded art or audio. Three.js is the sole runtime dependency, pinned to 0.169.0 on jsDelivr.

| Asset | Generator prompt | Target spec |
|---|---|---|
| Keeper | Hooded bridgekeeper, charcoal ragged oilskin, layered leather plague respirator, glowing amber glass goggles, iron storm lantern, wet rust details; full body, no background | Rigged GLB, 12k triangles, 1k PBR atlas, walk/charge/fire/jump animations |
| Sea horrors | Towering drowned crustacean humanoid, long hooked arms, slate chitin, barnacle spine, tiny amber eyes, threatening silhouette | Rigged GLB, 6k triangles, 1k PBR, emerge/stagger/fall animations; three LODs |
| Ruined sea fort | Broken iron lighthouse fortress above storm sea, charcoal stone, rust girders, battered cargo gantries | Modular GLB kit, 30k triangles total, 1k tiling PBR; fracture chunks |
| Timber | Rain soaked black timber, splinters, amber glints, no baked directional light | Seamless 1k albedo/normal/roughness, world-space triplanar compatible |
| Sea foam | Wind torn cold whitewater lace, isolated foam patterns | Tileable 512 RGBA mask |
| Storm | Distant violent ocean, wind whistling through rusted beams, occasional thunder, no voices | Seamless 45 second stereo OGG loop, -20 LUFS |
| Lantern bolt | Huge low resonant amber energy cannon, slow rising hum, explosive release, wooden debris tail | Three 1 second mono OGG variants, normalized -6 dB peak |
| Footsteps and salvage | Heavy boots on soaked creaking wood; warm metallic salvage chimes | Eight 0.3 second mono OGG variations each |

Current audio uses Web Audio oscillators and envelopes. Current ocean uses displaced shader geometry, surfaces use procedural world-space triplanar grain. No image-generation service was required.
