# Procedural asset manifest
All assets currently generated in code; no external art or audio. Three.js 0.170.0 is imported from jsDelivr; it is the only runtime network request.

| Replaceable asset | Generator prompt | Target |
|---|---|---|
| Chrome heart drone | Beveled mirrored anatomical-symbol heart, mechanical split seam, red slash emitter, dark teal reflections, brutalist future | GLB, <4k triangles, 3 LODs, separate halves |
| Concrete architecture | Rain-stained blue-black prison concrete, horizontal casting seams, no markings | Seamless 1k albedo/normal/roughness, triplanar |
| Wet paving | Teal rain-wet stone slabs, puddles, restrained roughness | Seamless 1k PBR maps |
| Blade and pistol | Slim red laser blade, industrial black grip; offhand angular chrome sidearm | GLB, <6k triangles each |
| Slash / break / reflect | Sharp electrical slash, metallic chrome snap, heavy concrete crumble, rising reflected laser chirp | Mono 48k WAV, <0.7s, dry |
| Atmosphere | Empty concrete compound, distant wind, subsonic machinery, no voices or melody | Stereo 48k loop, 45s |

Current sounds: Web Audio oscillators and envelopes. Current heart: custom Bézier extrusion with bevels. Debris: bounded instanced chrome chunks. Materials: procedural world-space triplanar concrete/paving.
