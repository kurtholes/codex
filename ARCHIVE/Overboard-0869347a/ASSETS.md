# Procedural asset manifest

All shipped geometry, surface patterns, particles, and audio are generated locally in `src/game.js`. No downloaded art, music, fonts, or reference-image runtime dependency. Three.js 0.170.0 is loaded from its pinned jsDelivr URL. The reference photograph is inspiration only; image ID 0869347a.

Potential replacements for local generators:

| Asset | Generator prompt | Target specification |
|---|---|---|
| Swimmer | Exhausted sea survivor, dark wet canvas vest, short hair, sun-warmed umber skin, rope belt; small readable silhouette in amber sunset; separate articulated arms and legs | Rigged GLB, ≤8k triangles, one 1k material atlas, swim/idle/climb loops, 1.7m tall |
| Raft modules | Salt-worn driftwood, split planks, frayed hemp lashings, barrel floats, hand-stitched straw canvas; warm umber and pale ochre; modular survival raft | GLB kit, ≤2k triangles/module, pivots on 0.5m grid, sail and windmill pivots separate; tileable 1k PBR maps |
| Wreck sections | Broken wooden coastal cutter hull and crooked mast, fractured ribs, hanging canvas, amber ocean silhouettes, each plank able to separate | GLB, ≤12k triangles total, 20 breakable named sections, centered pivots, one 1k atlas |
| Rescue vessel | Modest old coastal steamer with long dark hull, cream wheelhouse, railings, short funnel, mast and signal flag | GLB, ≤12k triangles, 27m length, one 2k atlas, two LODs |
| Diving equipment | Handmade bronze diving bell and compact salvage sub, circular dark porthole, brass rings, rudimentary fins and propeller; amber/umber palette | GLB, ≤6k triangles each, separate propeller, 1k atlas |
| Ocean micro-normal | Wind-streaked open ocean wavelets, no baked illumination, no large swells, physically plausible detail | Seamless 1024² normal/roughness, world-space triplanar sample; large waves remain shader generated |
| Reef / volcanic rocks | Smoothed jagged sea basalt, eroded layered forms, smoky umber with straw rimlight; no vegetation | 8 GLBs, ≤1500 triangles each plus 150-triangle LOD, tileable triplanar 1k PBR textures |
| Sea ambience | Immense rolling ocean at swimmer ear height, gentle water rush punctuated by distant heavy breaking crests, no voices or music | 45s seamless stereo OGG, −20 LUFS, under 1.5MB |
| Swim / grab / lash | Close wet swimming stroke, timber thunk, creaking rope pulled tight, crisp plank fractures; organic and tactile | 5 variations each, mono OGG, 0.15–1s, peaks −3dB, ≤500KB total |
| Upgrade sting | Brief rising wooden marimba and airy bronze shimmer, hopeful without grand orchestration | 0.7s stereo OGG, −16 LUFS, ≤80KB |

Current synthesized audio: looping filtered noise surf; oscillator splashes, salvage chimes, fracture knocks, and rising upgrade tones. No music track is shipped.
