# Replaceable procedural assets
All current meshes, surface detail and audio are generated in game.js. No external art or recordings are used. Three.js 0.170.0 is imported from jsDelivr; this is the only runtime network request.

| Asset | Generator prompt | Target |
|---|---|---|
| Office robot | Chipped ivory service robot, box head, inset black face, two amber square eyes, rusty rivets, cable spool, little articulated legs, apocalypse office worker | GLB, 8k triangles, 1m wide, separate head/limbs, 1k PBR atlas |
| Cathedral kit | Enormous near-black Gothic nave, bundled columns, pointed rib vaults, narrow cyan clerestory windows, damp eroded stone | Modular GLBs, 3k triangles/piece, 12m bays |
| Filing cabinets | Battered ivory three-drawer cabinet, brown rust, bent handles, buoyant office debris | GLB, 1k triangles, separate drawers |
| Stone surface | Seamless damp charcoal limestone with blue-green staining, fine pits and mortar | 1k albedo/normal/roughness, world-space triplanar |
| Water | Dark teal floodwater with restrained ripples and reflected cold light | Optional normal map, tileable 512px; retain animated shader |
| Footsteps | Small heavy robot wading through waist-deep water, metal servo click then deep splash | 8 mono WAV variations, 0.3 sec, 44.1kHz |
| Winch | Straining electric cable motor, rusted ratchet, taut cable twang | Loopable mono WAV, 2 sec, plus release |
| Destruction | Waterlogged cabinet crushing, stone cracking, falling wet rubble | 6 mono WAV, 0.6 sec |
| Delivery | Satisfying enormous office stamp, mechanical thunk with warm bell chord | Stereo WAV, 1 sec |
| Atmosphere | Flooded cathedral, distant dripping and wind, barely audible mechanical hum, no voice | Stereo seamless loop, 60 sec |
