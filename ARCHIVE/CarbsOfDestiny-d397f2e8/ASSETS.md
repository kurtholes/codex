# Procedural assets and replacement targets
All shipped geometry, materials and audio are generated locally at runtime. Three.js 0.170.0 is the only CDN dependency. No downloaded art, textures, music or recordings.

| Asset | Replacement generator prompt | Target |
|---|---|---|
| Colossal sourdough | Ancient floating boule, deeply split scored crust, charred peaks, warm honey crumb, hanging twisted dough roots; no background | GLB, 40k triangles, three LODs, 2K roughness/albedo/normal |
| Antler scavenger | Black tattered waterfront traveler, branching deer crown, leather backpack, elastic glowing dough gauntlets | Rigged GLB, 12k triangles, idle/run/yank/leap animations |
| Waterfront towers | Brutalist jagged flood-damaged skyscrapers, black concrete, sparse amber windows, modular breakable floors | GLB kit, 2k triangles per module, 512px tileable maps |
| Crust surface | Toasted sourdough crust, irregular pores, amber fissures and blackened scoring | Seamless 1K albedo/normal/roughness, triplanar projection |
| Floodwater | Scarlet oily water with ember reflections, short choppy waves | Seamless 512px normal map; retain procedural reflection shader |
| Elastic hook | Sticky dough stretching, rising tension, wet snap | Mono WAV, 0.4s, 48kHz, no voice |
| Collapse | Deep concrete fractures, heavy slabs crashing into shallow floodwater | Mono WAV variants, 1.2s, 48kHz |
| Ambience | Ominous distant city wind, subsonic fermentation pulse, water lapping; no melody | Stereo loop 60s OGG, -20 LUFS |

Current sound: Web Audio oscillators with pitch and amplitude envelopes. Materials use weighted world-space projections of procedural grain, including large concrete and crust surfaces. Water is a world-aligned procedural wave shader.
