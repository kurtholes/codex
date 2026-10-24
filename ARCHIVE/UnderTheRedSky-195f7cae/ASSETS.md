# Procedural asset inventory
All current geometry, textures and sounds are generated in JavaScript. No external artwork or audio is required. Three.js 0.170.0 is the sole runtime library, loaded from the exact jsDelivr URL in src/game.js. The reference photo is not shipped or sampled.

Optional local-generator replacements:

| Asset | Generator prompt | Target specification |
| --- | --- | --- |
| Diner | Last roadside American diner, rounded black metal facade, amber glass, layered flat roof, glowing orange OPEN sign, booths and counter; no logos; scarlet twilight | GLB, under 20k triangles, one 2k material atlas, separate windows/sign, 32×16×12m |
| Cannon car | Weathered dark oxblood 1970s desert coupe, huge roof plasma mortar, amber instruments, retractable glider wings, rear jet nozzles | GLB, 12k triangles, separate wheels/cannon/wings, 2k PBR atlas |
| Swarm | Low-slung black volcanic six-legged scavenger, twin amber eyes, readable silhouette | GLB, 1k triangles, 256px atlas, run and scatter animations; instancing compatible |
| Compounds | Abandoned roadside gas station, flat canopy and fuel pumps; low desert motel with modular breakable rooms | Modular GLBs, individual wall/post/roof chunks, each under 500 triangles, 1k PBR atlas |
| Terrain | Seamless dark red desert gravel and branching cracked black asphalt; restrained albedo | Two seamless 1024px albedo/normal/roughness sets; world-space triplanar repeat |
| Sky | Turbulent near-black crimson cloud ceiling with incandescent red seams, flat distant desert sunset, no stars or sun disc | 2048×1024 equirectangular HDR or LDR panorama |
| Plasma shot | Thunderous heavy mortar ignition, sub bass thump followed by descending hot electric fizz, no voice | Mono 48kHz WAV, 0.8s, peak −3dB |
| Collapse | Dry concrete burst, metal canopy buckling and scattering debris | Mono 48kHz WAV, 1.5s, three variants |
| Engine/flight | Vintage V8 idle-to-throttle layers, buoyant turbine hover and air dash | Mono 48kHz WAV seamless 2s loops; independent layers |
| Ambience/music | Vast desert wind and sparse low analog drones, ominous warm roadside glow, no vocals or melody demanding attention | Stereo 48kHz OGG, seamless 90s loop, integrated −22 LUFS |

Synthesized sounds currently use Web Audio oscillator envelopes (engine, shot, blast, salvage, upgrade). The sky uses seeded-looking procedural fractal noise baked to a cubemap at startup. Large surface materials use world-position triplanar noise. Debris, rocks, scrub and creatures use instancing; static architecture and lane paint are merged by material.
